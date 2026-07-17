import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, requestGemini: vi.fn() };
});

import { findGate, findSection } from '../../test/stadiumFixtures';
import { getInitialAnnouncements } from '../data/announcements';
import { requestGemini } from './client';
import {
  getAnnouncementTranslation,
  getMultilingualReply,
  getNavigationDirections,
  getPlainLanguageRewrite,
  getRealTimeDecisionSupport,
  getStepFreeRoute,
  getSustainabilityTips,
  getVolunteerAnswer,
} from './index';
import {
  mockAccessibilityResponse,
  mockPlainLanguageResponse,
  mockRealTimeDecisionSupportResponse,
  mockSustainabilityResponse,
} from './mock';

const requestGeminiMock = vi.mocked(requestGemini);

beforeEach(() => {
  requestGeminiMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

const TEST_GATE = findGate('gate-a');
const TEST_SECTION = findSection('sec-101');

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

describe('getStepFreeRoute', () => {
  it('falls back to mock when Gemini returns malformed JSON', async () => {
    requestGeminiMock.mockResolvedValueOnce('not valid json');

    const result = await getStepFreeRoute(TEST_GATE, TEST_SECTION);

    expect(result.source).toBe('mock');
    expect(result.data).toEqual(mockAccessibilityResponse(TEST_GATE.label, TEST_SECTION.label));
  });

  it('falls back to mock when Gemini returns a shape missing required fields', async () => {
    requestGeminiMock.mockResolvedValueOnce(JSON.stringify({ summary: 'ok' }));

    const result = await getStepFreeRoute(TEST_GATE, TEST_SECTION);

    expect(result.source).toBe('mock');
  });
});

describe('getPlainLanguageRewrite', () => {
  const announcement = getInitialAnnouncements()[0];
  if (!announcement) {
    throw new Error('announcement feed unexpectedly empty in test setup');
  }

  it('returns the live rewrite when Gemini responds with a valid shape', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ rewrite: 'The game starts at 3:00 PM.' }),
    );

    const result = await getPlainLanguageRewrite(announcement);

    expect(result.source).toBe('live');
    expect(result.data.rewrite).toBe('The game starts at 3:00 PM.');
  });

  it('serves the category-matched canned rewrite when the proxy is unreachable', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getPlainLanguageRewrite(announcement);

    expect(result.source).toBe('mock');
    expect(result.data).toEqual(mockPlainLanguageResponse(announcement));
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

describe('getVolunteerAnswer', () => {
  it('asks for the reply in the explicit target language', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ reply: 'الإسعافات الأولية بجوار القسم 112.', language: 'ar' }),
    );

    const result = await getVolunteerAnswer('Where is first aid?', 'ar');

    expect(result.source).toBe('live');
    expect(result.data.language).toBe('ar');
    const prompt = requestGeminiMock.mock.calls[0]?.[0] ?? '';
    expect(prompt).toContain('BCP-47 code "ar"');
    expect(prompt).toContain('First aid stations'); // same grounding as the fan chat
  });

  it('serves the mock in the target language when the proxy is unreachable', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getVolunteerAnswer('Where is first aid?', 'ja');

    expect(result.source).toBe('mock');
    expect(result.data.language).toBe('ja');
  });
});

describe('getRealTimeDecisionSupport', () => {
  const lostChildIncident = {
    id: 'incident-test-1',
    category: 'lost-child' as const,
    severity: 'critical' as const,
    summary: 'Lost child reported by a parent',
    location: 'Section 121 concourse',
    reportedAt: '2026-07-19T19:05:00.000Z',
    status: 'open' as const,
  };

  it('dictates the child-safety protocol in the prompt for lost-child incidents', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify(mockRealTimeDecisionSupportResponse('lost-child')),
    );

    await getRealTimeDecisionSupport(lostChildIncident);

    const prompt = requestGeminiMock.mock.calls[0]?.[0] ?? '';
    expect(prompt).toContain('never moves them through the crowd');
    expect(prompt).toContain('Family Reunification point near section 121');
    expect(prompt).toContain('15 minutes');
  });

  it('serves the full lost-child protocol from the mock with zero key', async () => {
    requestGeminiMock.mockRejectedValueOnce(new Error('network down'));

    const result = await getRealTimeDecisionSupport(lostChildIncident);

    expect(result.source).toBe('mock');
    expect(result.data).toEqual(mockRealTimeDecisionSupportResponse('lost-child'));
  });
});
