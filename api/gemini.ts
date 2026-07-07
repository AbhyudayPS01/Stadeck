import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Vercel's Node runtime augments the standard http response with these
 * helpers; typed locally so the handler doesn't need the (much heavier)
 * @vercel/node package just for two method signatures.
 */
interface VercelRequest extends IncomingMessage {
  method?: string;
}

interface VercelResponse extends ServerResponse {
  status(statusCode: number): VercelResponse;
  json(body: unknown): VercelResponse;
}

/**
 * Serverless proxy for Gemini requests. Request validation, payload
 * capping, and key injection land in Phase 1 — this stub only enforces the
 * HTTP method so the function, its routing, and CI wiring can be verified now.
 */
export default function handler(req: VercelRequest, res: VercelResponse): void {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  res.status(501).json({ error: 'Not implemented yet' });
}
