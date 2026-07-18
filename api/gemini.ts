import type { IncomingMessage, ServerResponse } from 'node:http';

/**
 * Inlined rather than imported from src/config/constants.ts: Vercel's Node
 * runtime loads this function as an ESM module and cannot resolve a
 * relative import that reaches outside api/ without an explicit file
 * extension, which fails at runtime with ERR_MODULE_NOT_FOUND (this only
 * surfaces in the deployed function, not in `tsc`'s Bundler resolution or
 * Vite's build). Keep these two values in sync with constants.ts by hand.
 */
const GEMINI_MODEL = 'gemini-1.5-flash';
const MAX_GEMINI_PROMPT_LENGTH = 8_000;

/**
 * Vercel's Node runtime augments the standard http request/response with
 * these; typed locally so the handler doesn't need the (much heavier)
 * @vercel/node package just for a few type signatures.
 */
interface VercelRequest extends IncomingMessage {
  method?: string;
  body?: unknown;
}

interface VercelResponse extends ServerResponse {
  status(statusCode: number): VercelResponse;
  json(body: unknown): VercelResponse;
}

interface GeminiProxyRequestBody {
  prompt: string;
}

interface GeminiUpstreamPayload {
  candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
}

const UPSTREAM_TIMEOUT_MS = 12_000;

/** Request validation: exactly one field, `prompt`, a non-empty string within the payload cap. */
function isValidRequestBody(body: unknown): body is GeminiProxyRequestBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || !keys.includes('prompt')) {
    return false;
  }

  const prompt = (body as { prompt: unknown }).prompt;
  return (
    typeof prompt === 'string' && prompt.length > 0 && prompt.length <= MAX_GEMINI_PROMPT_LENGTH
  );
}

function extractText(payload: GeminiUpstreamPayload): string | undefined {
  return payload.candidates?.[0]?.content?.parts?.[0]?.text;
}

/**
 * Serverless proxy: the only place the Gemini API key is used. Validates
 * the request shape and payload size, injects the key server-side, forwards
 * the prompt to Gemini, and returns a minimal `{ text }` shape — upstream
 * errors and the key itself are never echoed back to the client (see
 * SECURITY.md for the full threat model).
 */
export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Reject anything that isn't exactly { prompt: string } within the cap — no unexpected fields allowed.
  const { body } = req;
  if (!isValidRequestBody(body)) {
    res.status(400).json({
      error: `Request must be { prompt: string } up to ${MAX_GEMINI_PROMPT_LENGTH} characters`,
    });
    return;
  }

  // Key injection: read server-side only, from a non-VITE_-prefixed env var the client never sees.
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({ error: 'Gemini is not configured' });
    return;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstream = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: body.prompt }] }] }),
        signal: controller.signal,
      },
    );

    if (!upstream.ok) {
      // Error shaping: log detail server-side, return a generic message — never the upstream body.
      console.error(`Gemini upstream error: ${upstream.status}`);
      res.status(502).json({ error: 'Gemini request failed' });
      return;
    }

    const payload = (await upstream.json()) as GeminiUpstreamPayload;
    const text = extractText(payload);

    if (typeof text !== 'string') {
      console.error('Gemini upstream returned no text candidate');
      res.status(502).json({ error: 'Gemini request failed' });
      return;
    }

    res.status(200).json({ text });
  } catch (error) {
    console.error('Gemini proxy error', error);
    res.status(502).json({ error: 'Gemini request failed' });
  } finally {
    clearTimeout(timeoutId);
  }
}
