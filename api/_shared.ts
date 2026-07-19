export const GEMINI_MODEL = 'gemini-flash-latest';
export const MAX_GEMINI_PROMPT_LENGTH = 8_000;
export const UPSTREAM_TIMEOUT_MS = 15_000;

export interface GeminiProxyRequestBody {
  prompt: string;
}

/** Request validation: exactly one field, `prompt`, a non-empty string within the payload cap. */
export function isValidRequestBody(body: unknown): body is GeminiProxyRequestBody {
  if (typeof body !== 'object' || body === null) {
    return false;
  }

  const keys = Object.keys(body);
  if (keys.length !== 1 || !keys.includes('prompt')) {
    return false;
  }

  if (!('prompt' in body) || typeof body.prompt !== 'string') {
    return false;
  }
  const prompt = body.prompt;

  return prompt.length > 0 && prompt.length <= MAX_GEMINI_PROMPT_LENGTH;
}
