import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, requestGemini: vi.fn() };
});

import { getInitialAnnouncements } from '../data/announcements';
import { GATES, SECTIONS } from '../data/stadiumLayout';
import { requestGemini } from './client';
import {
  getAccessibilityGuidance,
  getAnnouncementTranslation,
  getMultilingualReply,
  getNavigationDirections,
  getSustainabilityTips,
  getTransportationRecommendation,
} from './index';
import { mockAccessibilityResponse, mockSustainabilityResponse } from './mock';

const requestGeminiMock = vi.mocked(requestGemini);

beforeEach(() => {
  requestGeminiMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const TEST_GATE = GATES[0];
const TEST_SECTION = SECTIONS[0];
if (!TEST_GATE || !TEST_SECTION) {
  throw new Error('stadium layout unexpectedly empty in test setup');
}

describe('getNavigationDirections', () => {
  it('returns live data when Gemini responds with a valid shape', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ summary: 'Go left', steps: ['Step 1'], etaMinutes: 4 }),
    );

    const result = await getNavigationDirections(TEST_GATE, TEST_SECTION);

    expect(result.source).toBe('live');
    expect(result.data).toEqual({ summary: 'Go left', steps: ['Step 1'], etaMinutes: 4 });
  });

  it('serves a mock grounded in the chosen gate and section when the proxy is unreachable', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getNavigationDirections(TEST_GATE, TEST_SECTION);

    expect(result.source).toBe('mock');
    expect(result.data.summary).toContain(TEST_GATE.label);
    expect(result.data.summary).toContain(`Section ${TEST_SECTION.label}`);
  });
});

describe('getAccessibilityGuidance', () => {
  it('falls back to mock when Gemini returns malformed JSON', async () => {
    requestGeminiMock.mockResolvedValueOnce('not valid json');

    const result = await getAccessibilityGuidance('I need an accessible route');

    expect(result.source).toBe('mock');
    expect(result.data).toEqual(mockAccessibilityResponse());
  });

  it('falls back to mock when Gemini returns a shape missing required fields', async () => {
    requestGeminiMock.mockResolvedValueOnce(JSON.stringify({ summary: 'ok' }));

    const result = await getAccessibilityGuidance('I need an accessible route');

    expect(result.source).toBe('mock');
  });
});

describe('getSustainabilityTips', () => {
  it('falls back to mock when the Gemini request rejects', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getSustainabilityTips({
      timestamp: 'now',
      wasteDivertedPercent: 70,
      renewableEnergyPercent: 50,
      waterUsageLiters: 200_000,
      carbonOffsetKg: 15_000,
      transitModeSharePercent: 75,
    });

    expect(result.source).toBe('mock');
    expect(result.data).toEqual(mockSustainabilityResponse());
  });
});

describe('getMultilingualReply', () => {
  it('grounds the prompt in the stadium facts and lets the model pick the language', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ reply: 'La Puerta C está en el lado este.', language: 'es' }),
    );

    const result = await getMultilingualReply('¿Dónde está la Puerta C?');

    expect(result.source).toBe('live');
    expect(result.data.language).toBe('es');
    const prompt = requestGeminiMock.mock.calls[0]?.[0] ?? '';
    expect(prompt).toContain('Detect the language');
    expect(prompt).toContain('First aid stations'); // stadium facts context embedded
  });

  it('serves a mock reply in the detected language when the proxy is unreachable', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getMultilingualReply('अगला ट्रेन कब है? गेट कहाँ है?');

    expect(result.source).toBe('mock');
    expect(result.data.language).toBe('hi');
  });
});

describe('getAnnouncementTranslation', () => {
  const announcement = getInitialAnnouncements()[0];
  if (!announcement) {
    throw new Error('announcement feed unexpectedly empty in test setup');
  }

  it('returns the live translation when Gemini responds with a valid shape', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ translation: 'O jogo começa às 15h.', language: 'pt' }),
    );

    const result = await getAnnouncementTranslation(announcement, 'pt');

    expect(result.source).toBe('live');
    expect(result.data.language).toBe('pt');
  });

  it('serves the canned translation when the proxy is unreachable', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getAnnouncementTranslation(announcement, 'fr');

    expect(result.source).toBe('mock');
    expect(result.data.translation).toBe(announcement.translations['fr']);
  });
});

describe('per-feature min-interval limiter', () => {
  it('serves mock without calling Gemini again when called within the interval', async () => {
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
    requestGeminiMock.mockResolvedValue(
      JSON.stringify({ recommendedOptionId: 'nj-transit-rail', summary: 'ok', alternatives: [] }),
    );

    await getTransportationRecommendation([], 'Gate A');
    requestGeminiMock.mockClear();

    const result = await getTransportationRecommendation([], 'Gate A');

    expect(result.source).toBe('mock');
    expect(requestGeminiMock).not.toHaveBeenCalled();
    nowSpy.mockRestore();
  });

  it('calls Gemini again once the interval has elapsed', async () => {
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValue(2_000_000);
    requestGeminiMock.mockResolvedValue(
      JSON.stringify({ recommendedOptionId: 'nj-transit-rail', summary: 'ok', alternatives: [] }),
    );

    await getTransportationRecommendation([], 'Gate A');
    requestGeminiMock.mockClear();

    nowSpy.mockReturnValue(2_000_000 + 3_000);
    const result = await getTransportationRecommendation([], 'Gate A');

    expect(result.source).toBe('live');
    expect(requestGeminiMock).toHaveBeenCalledTimes(1);
    nowSpy.mockRestore();
  });
});
