import {
  GEMINI_CACHE_TTL_MS,
  GEMINI_MAX_RETRIES,
  GEMINI_REQUEST_TIMEOUT_MS,
  GEMINI_RETRY_BASE_DELAY_MS,
} from '../../config/constants';

export type GeminiErrorType =
  | 'timeout'
  | 'network'
  | 'rate-limited'
  | 'not-configured'
  | 'server-error'
  | 'invalid-response';

export class GeminiClientError extends Error {
  constructor(
    public readonly type: GeminiErrorType,
    message: string,
    public readonly retryable: boolean,
  ) {
    super(message);
    this.name = 'GeminiClientError';
  }
}

function isTextPayload(payload: unknown): payload is { text: string } {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'text' in payload &&
    typeof payload.text === 'string'
  );
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || status >= 500;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function attemptRequest(prompt: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), GEMINI_REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt }),
      signal: controller.signal,
    });

    if (!response.ok) {
      // 503 is the proxy's "no GEMINI_API_KEY configured" answer (api/gemini.ts)
      // — distinguished from transient failures so the UI can label the mock
      // fallback as demo data rather than an offline condition.
      const type: GeminiErrorType =
        response.status === 503
          ? 'not-configured'
          : response.status === 429
            ? 'rate-limited'
            : 'server-error';
      throw new GeminiClientError(
        type,
        `Gemini proxy responded with ${response.status}`,
        type !== 'not-configured' && isRetryableStatus(response.status),
      );
    }

    const payload: unknown = await response.json();
    if (!isTextPayload(payload)) {
      throw new GeminiClientError(
        'invalid-response',
        'Gemini proxy returned an unexpected shape',
        false,
      );
    }

    return payload.text;
  } catch (error) {
    if (error instanceof GeminiClientError) {
      throw error;
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new GeminiClientError('timeout', 'Gemini proxy request timed out', true);
    }
    throw new GeminiClientError('network', 'Gemini proxy request failed', true);
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Retries transient failures (timeouts, network errors, 429/5xx) with exponential backoff. */
async function requestWithRetries(prompt: string): Promise<string> {
  let lastError: GeminiClientError | undefined;

  for (let attempt = 0; attempt <= GEMINI_MAX_RETRIES; attempt += 1) {
    try {
      return await attemptRequest(prompt);
    } catch (error) {
      // attemptRequest wraps every failure, but never assume: anything else is non-retryable.
      const clientError =
        error instanceof GeminiClientError
          ? error
          : new GeminiClientError('network', 'Gemini proxy request failed', false);
      lastError = clientError;
      const hasRetriesLeft = attempt < GEMINI_MAX_RETRIES;
      if (!clientError.retryable || !hasRetriesLeft) {
        throw clientError;
      }
      await sleep(GEMINI_RETRY_BASE_DELAY_MS * 2 ** attempt);
    }
  }

  throw lastError ?? new GeminiClientError('network', 'Gemini request failed', false);
}

interface CacheEntry {
  text: string;
  expiresAt: number;
}

const responseCache = new Map<string, CacheEntry>();

/**
 * djb2-style string hash — not cryptographic, just a fast deterministic key
 * so identical prompts share a cache entry without storing the full prompt
 * text as the map key.
 */
function hashPrompt(prompt: string): string {
  let hash = 5381;
  for (let index = 0; index < prompt.length; index += 1) {
    hash = (hash * 33) ^ prompt.charCodeAt(index);
  }
  return (hash >>> 0).toString(36);
}

function getCachedResponse(prompt: string): string | undefined {
  const entry = responseCache.get(hashPrompt(prompt));
  if (!entry || entry.expiresAt < Date.now()) {
    return undefined;
  }
  return entry.text;
}

function setCachedResponse(prompt: string, text: string): void {
  responseCache.set(hashPrompt(prompt), { text, expiresAt: Date.now() + GEMINI_CACHE_TTL_MS });
}

/** Clears the in-memory response cache — used between tests, never in app code. */
export function clearGeminiCache(): void {
  responseCache.clear();
}

/**
 * In-memory TTL cache keyed by prompt hash: repeat requests for the same
 * prompt (e.g. a fan re-opening the same screen) are served instantly
 * without spending another Gemini call.
 */
export async function requestGemini(prompt: string): Promise<string> {
  const cached = getCachedResponse(prompt);
  if (cached !== undefined) {
    return cached;
  }

  const text = await requestWithRetries(prompt);
  setCachedResponse(prompt, text);
  return text;
}

/**
 * Parses a Gemini text response as JSON, defensively: strips markdown code
 * fences the model sometimes adds despite instructions, then validates the
 * parsed shape before trusting it.
 */
export function parseJsonResponse<T>(rawText: string, isValid: (value: unknown) => value is T): T {
  const stripped = rawText
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/```\s*$/, '')
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(stripped);
  } catch {
    throw new GeminiClientError('invalid-response', 'Gemini response was not valid JSON', false);
  }

  if (!isValid(parsed)) {
    throw new GeminiClientError(
      'invalid-response',
      'Gemini response did not match the expected shape',
      false,
    );
  }

  return parsed;
}
