import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import handler from './gemini';

type MockReq = IncomingMessage & { method?: string; body?: unknown };
type MockRes = ServerResponse & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
};

function mockReq(method: string, body?: unknown): MockReq {
  return { method, body } as MockReq;
}

function mockRes(): MockRes {
  const res = {} as MockRes;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal('fetch', fetchMock);
  vi.stubEnv('GEMINI_API_KEY', 'test-api-key');
});

afterEach(() => {
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe('method validation', () => {
  it('rejects non-POST methods with 405', async () => {
    const res = mockRes();
    await handler(mockReq('GET'), res);
    expect(res.status).toHaveBeenCalledWith(405);
  });
});

describe('request body validation', () => {
  it.each([
    ['missing body', undefined],
    ['missing prompt field', { notPrompt: 'hi' }],
    ['non-string prompt', { prompt: 42 }],
    ['empty string prompt', { prompt: '' }],
    ['prompt over the length cap', { prompt: 'a'.repeat(8_001) }],
    ['an unexpected extra field', { prompt: 'hi', extra: true }],
  ])('rejects %s with 400', async (_label, body) => {
    const res = mockRes();
    await handler(mockReq('POST', body), res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('accepts a well-formed { prompt } body', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text: 'hi there' }] } }] }),
    });
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: 'hi there' });
  });
});

describe('key handling', () => {
  it('returns 503 without calling upstream when GEMINI_API_KEY is unset', async () => {
    vi.stubEnv('GEMINI_API_KEY', '');
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    expect(res.status).toHaveBeenCalledWith(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('never echoes the API key back to the client', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }),
    });
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    const [, calledInit] = fetchMock.mock.calls[0] as [string, { body: string }];
    expect(calledInit.body).not.toContain('test-api-key');
    for (const call of res.json.mock.calls as unknown[][]) {
      expect(JSON.stringify(call)).not.toContain('test-api-key');
    }
  });
});

describe('upstream error handling', () => {
  it('returns a generic 502 and never echoes the upstream body when the response is not ok', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ error: { message: 'quota exceeded for key abc123' } }),
    });
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    expect(res.status).toHaveBeenCalledWith(502);
    const [payload] = res.json.mock.calls[0] as [unknown];
    expect(JSON.stringify(payload)).not.toContain('quota exceeded');
  });

  it('returns 502 when the upstream payload has no text candidate', async () => {
    fetchMock.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ candidates: [] }) });
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    expect(res.status).toHaveBeenCalledWith(502);
  });

  it('returns 502 when the fetch itself throws', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('network down'));
    const res = mockRes();

    await handler(mockReq('POST', { prompt: 'hello' }), res);

    expect(res.status).toHaveBeenCalledWith(502);
  });
});
