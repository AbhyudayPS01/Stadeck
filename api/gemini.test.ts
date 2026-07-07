import { describe, expect, it, vi } from 'vitest';
import type { IncomingMessage, ServerResponse } from 'node:http';
import handler from './gemini';

function mockReq(method: string): IncomingMessage & { method?: string } {
  return { method } as IncomingMessage & { method?: string };
}

function mockRes(): ServerResponse & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
} {
  const res = {} as ServerResponse & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
  };
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
}

describe('api/gemini handler', () => {
  it('rejects non-POST methods with 405', () => {
    const req = mockReq('GET');
    const res = mockRes();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith({ error: 'Method not allowed' });
  });

  it('returns 501 for POST until Phase 1 implements the proxy', () => {
    const req = mockReq('POST');
    const res = mockRes();

    handler(req, res);

    expect(res.status).toHaveBeenCalledWith(501);
  });
});
