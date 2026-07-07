import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, requestGemini: vi.fn() };
});

import { requestGemini } from './client';
import {
  getAccessibilityGuidance,
  getNavigationGuidance,
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

describe('getNavigationGuidance', () => {
  it('returns live data when Gemini responds with a valid shape', async () => {
    requestGeminiMock.mockResolvedValueOnce(
      JSON.stringify({ summary: 'Go left', steps: ['Step 1'], etaMinutes: 4 }),
    );

    const result = await getNavigationGuidance('Where is Gate A?');

    expect(result.source).toBe('live');
    expect(result.data).toEqual({ summary: 'Go left', steps: ['Step 1'], etaMinutes: 4 });
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
