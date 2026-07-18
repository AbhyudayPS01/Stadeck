import { GEMINI_MIN_REQUEST_INTERVAL_MS } from '../../config/constants';
import { GeminiClientError, parseJsonResponse, requestGemini } from './client';
import type { FeatureId } from './responses';

/**
 * Why a mock response was served: "offline" for network-shaped failures
 * (fetch failed, request timed out), "no-key" when the proxy reports Gemini
 * is not configured, "unavailable" for everything else (rate limits, server
 * errors, unparseable responses).
 */
export type MockReason = 'offline' | 'no-key' | 'unavailable';

export interface GeminiResult<T> {
  data: T;
  /** "mock" drives the offline/demo badge in the UI — live and mock never look identical to the fan. */
  source: 'live' | 'mock';
  /** Set only when source is "mock": picks the badge copy ("Offline mode" vs "Demo data"). */
  mockReason?: MockReason;
}

/**
 * Secondary AI actions get their own limiter key so they never rate-limit the
 * primary feature they share a screen with (e.g. translating an announcement
 * vs. the concierge chat — used back-to-back on the same screen).
 */
export type LimiterKey =
  | FeatureId
  | 'multilingual:announcement-translation'
  | 'real-time-decision-support:scenario-planning'
  | 'accessibility:plain-language'
  | 'sustainability:report'
  | 'multilingual:volunteer-assist-translation';

const lastCalledAt = new Map<LimiterKey, number>();

function isWithinMinInterval(feature: LimiterKey): boolean {
  const last = lastCalledAt.get(feature);
  return last !== undefined && Date.now() - last < GEMINI_MIN_REQUEST_INTERVAL_MS;
}

/** Maps a failed request to the badge the fan should see (see MockReason). */
function toMockReason(error: unknown): MockReason {
  if (error instanceof GeminiClientError) {
    if (error.type === 'network' || error.type === 'timeout') {
      return 'offline';
    }
    if (error.type === 'not-configured') {
      return 'no-key';
    }
  }
  return 'unavailable';
}

/**
 * Shared per-feature request flow: client-side rate limiting (so rapid
 * repeated triggers on one screen don't hammer the API), then a live
 * Gemini call, defensively parsed — falling back to the deterministic mock
 * on any failure so the app never shows an error state for AI content.
 *
 * The deterministic fallback is a product decision, not just resilience:
 * international fans are on expensive roaming inside a congested stadium
 * bowl, where requests time out or drop constantly. Every feature must keep
 * answering — grounded in the same local facts — with zero connectivity and
 * zero API key. The app never presents a dead end.
 */
export async function callFeature<T>(
  feature: LimiterKey,
  prompt: string,
  isValidResponse: (value: unknown) => value is T,
  mockResponse: () => T,
): Promise<GeminiResult<T>> {
  if (isWithinMinInterval(feature)) {
    return { data: mockResponse(), source: 'mock', mockReason: 'unavailable' };
  }

  lastCalledAt.set(feature, Date.now());

  try {
    const text = await requestGemini(prompt);
    const data = parseJsonResponse(text, isValidResponse);
    return { data, source: 'live' };
  } catch (error) {
    return { data: mockResponse(), source: 'mock', mockReason: toMockReason(error) };
  }
}
