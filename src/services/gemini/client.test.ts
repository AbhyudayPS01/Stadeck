import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { clearGeminiCache, GeminiClientError, parseJsonResponse, requestGemini } from './client';

interface MockResponse {
  ok: boolean;
  status: number;
  json: () => Promise<unknown>;
}

function mockResponse(status: number, body: unknown): MockResponse {
  return { ok: status >= 200 && status < 300, status, json: () => Promise.resolve(body) };
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  clearGeminiCache();
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('requestGemini', () => {
  it('returns the text from a successful response', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(200, { text: 'hello' }));

    await expect(requestGemini('prompt-a')).resolves.toBe('hello');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('serves a repeat identical prompt from cache without re-fetching', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(200, { text: 'cached' }));

    await requestGemini('prompt-b');
    const second = await requestGemini('prompt-b');

    expect(second).toBe('cached');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('re-fetches once the cache entry has expired', async () => {
    const nowSpy = vi.spyOn(Date, 'now');
    nowSpy.mockReturnValue(0);
    fetchMock.mockResolvedValueOnce(mockResponse(200, { text: 'first' }));
    await requestGemini('prompt-c');

    nowSpy.mockReturnValue(10 * 60 * 1000); // past the 5-minute TTL
    fetchMock.mockResolvedValueOnce(mockResponse(200, { text: 'second' }));
    const result = await requestGemini('prompt-c');

    expect(result).toBe('second');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    nowSpy.mockRestore();
  });

  it('retries once on a 429 and succeeds on the second attempt', async () => {
    vi.useFakeTimers();
    fetchMock
      .mockResolvedValueOnce(mockResponse(429, { error: 'rate limited' }))
      .mockResolvedValueOnce(mockResponse(200, { text: 'ok after retry' }));

    const resultPromise = requestGemini('prompt-d');
    await vi.advanceTimersByTimeAsync(1000);

    await expect(resultPromise).resolves.toBe('ok after retry');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('throws after exhausting retries on repeated 5xx errors', async () => {
    vi.useFakeTimers();
    fetchMock.mockResolvedValue(mockResponse(503, { error: 'down' }));

    const resultPromise = requestGemini('prompt-e');
    const assertion = expect(resultPromise).rejects.toMatchObject({
      type: 'server-error',
      retryable: true,
    });
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;

    expect(fetchMock).toHaveBeenCalledTimes(3); // initial + 2 retries
  });

  it('does not retry a non-retryable 400', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(400, { error: 'bad request' }));

    await expect(requestGemini('prompt-f')).rejects.toMatchObject({
      type: 'server-error',
      retryable: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('throws invalid-response and does not retry when the payload has no text field', async () => {
    fetchMock.mockResolvedValueOnce(mockResponse(200, { unexpected: true }));

    await expect(requestGemini('prompt-g')).rejects.toMatchObject({
      type: 'invalid-response',
      retryable: false,
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('maps a network failure to a retryable network error', async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValue(new TypeError('Failed to fetch'));

    const resultPromise = requestGemini('prompt-h');
    const assertion = expect(resultPromise).rejects.toMatchObject({
      type: 'network',
      retryable: true,
    });
    await vi.advanceTimersByTimeAsync(5000);
    await assertion;
  });

  it('maps an aborted request to a retryable timeout error', async () => {
    vi.useFakeTimers();
    fetchMock.mockImplementation((_url: string, options: { signal: AbortSignal }) => {
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          reject(new DOMException('Aborted', 'AbortError'));
        });
      });
    });

    const resultPromise = requestGemini('prompt-i');
    const assertion = expect(resultPromise).rejects.toMatchObject({ type: 'timeout' });
    await vi.advanceTimersByTimeAsync(60_000);
    await assertion;
  });
});

describe('parseJsonResponse', () => {
  const isSample = (value: unknown): value is { ok: boolean } =>
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { ok?: unknown }).ok === 'boolean';

  it('parses plain JSON text', () => {
    expect(parseJsonResponse('{"ok": true}', isSample)).toEqual({ ok: true });
  });

  it('strips a markdown code fence before parsing', () => {
    expect(parseJsonResponse('```json\n{"ok": true}\n```', isSample)).toEqual({ ok: true });
  });

  it('throws invalid-response for malformed JSON', () => {
    expect(() => parseJsonResponse('not json', isSample)).toThrow(GeminiClientError);
  });

  it('throws invalid-response when the parsed value fails the shape check', () => {
    expect(() => parseJsonResponse('{"ok": "yes"}', isSample)).toThrow(GeminiClientError);
  });
});
