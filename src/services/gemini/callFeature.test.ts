import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./client', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./client')>();
  return { ...actual, requestGemini: vi.fn() };
});

import { callFeature } from './callFeature';
import { GeminiClientError, requestGemini } from './client';

const requestGeminiMock = vi.mocked(requestGemini);

const isReply = (value: unknown): value is { reply: string } =>
  typeof value === 'object' && value !== null && 'reply' in value;

function callNavigation() {
  return callFeature('navigation', 'test prompt', isReply, () => ({ reply: 'mock reply' }));
}

beforeEach(() => {
  requestGeminiMock.mockReset();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('mock reason taxonomy', () => {
  // Each test steps simulated time forward so the previous test's call never
  // trips the min-interval limiter.
  let simulatedNow = Date.now() + 100_000;
  beforeEach(() => {
    simulatedNow += 10_000;
    vi.spyOn(Date, 'now').mockImplementation(() => simulatedNow);
  });

  it('labels network-shaped failures as offline', async () => {
    requestGeminiMock.mockRejectedValueOnce(
      new GeminiClientError('network', 'Gemini proxy request failed', false),
    );

    const result = await callNavigation();

    expect(result.source).toBe('mock');
    expect(result.mockReason).toBe('offline');
  });

  it('labels a not-configured proxy as no-key', async () => {
    requestGeminiMock.mockRejectedValueOnce(
      new GeminiClientError('not-configured', 'Gemini proxy responded with 503', false),
    );

    const result = await callNavigation();

    expect(result.source).toBe('mock');
    expect(result.mockReason).toBe('no-key');
  });

  it('labels every other failure as unavailable and omits the reason on live results', async () => {
    requestGeminiMock.mockResolvedValueOnce('not valid json');
    const mockResult = await callNavigation();
    expect(mockResult.mockReason).toBe('unavailable');

    simulatedNow += 10_000;
    requestGeminiMock.mockResolvedValueOnce(JSON.stringify({ reply: 'live reply' }));
    const liveResult = await callNavigation();
    expect(liveResult.source).toBe('live');
    expect(liveResult.mockReason).toBeUndefined();
  });
});

describe('per-feature min-interval limiter', () => {
  it('serves mock without calling Gemini again when called within the interval', async () => {
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000_000);
    requestGeminiMock.mockResolvedValue(JSON.stringify({ reply: 'live reply' }));

    await callFeature('transportation', 'prompt', isReply, () => ({ reply: 'mock reply' }));
    requestGeminiMock.mockClear();

    const result = await callFeature('transportation', 'prompt', isReply, () => ({
      reply: 'mock reply',
    }));

    expect(result.source).toBe('mock');
    expect(result.mockReason).toBe('unavailable');
    expect(requestGeminiMock).not.toHaveBeenCalled();
    nowSpy.mockRestore();
  });

  it('calls Gemini again once the interval has elapsed', async () => {
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValue(2_000_000);
    requestGeminiMock.mockResolvedValue(JSON.stringify({ reply: 'live reply' }));

    await callFeature('sustainability', 'prompt', isReply, () => ({ reply: 'mock reply' }));
    requestGeminiMock.mockClear();

    nowSpy.mockReturnValue(2_000_000 + 3_000);
    const result = await callFeature('sustainability', 'prompt', isReply, () => ({
      reply: 'mock reply',
    }));

    expect(result.source).toBe('live');
    expect(requestGeminiMock).toHaveBeenCalledTimes(1);
    nowSpy.mockRestore();
  });
});
