import type { Module } from '../types/module';

/** Demo venue for all mock data: the FIFA World Cup 2026 Final host. */
export const STADIUM_NAME = 'MetLife Stadium';
export const STADIUM_ID = 'metlife-2026-final';
export const STADIUM_CAPACITY = 82_500;

/**
 * The eight modules named exactly after the challenge clauses. Drives route
 * generation and navigation — see App.tsx.
 */
export const MODULES: readonly Module[] = [
  { id: 'navigation', label: 'Navigation', path: '/navigation' },
  { id: 'crowd-management', label: 'Crowd Management', path: '/crowd-management' },
  { id: 'accessibility', label: 'Accessibility', path: '/accessibility' },
  { id: 'transportation', label: 'Transportation', path: '/transportation' },
  { id: 'sustainability', label: 'Sustainability', path: '/sustainability' },
  {
    id: 'multilingual-assistance',
    label: 'Multilingual Assistance',
    path: '/multilingual-assistance',
  },
  {
    id: 'operational-intelligence',
    label: 'Operational Intelligence',
    path: '/operational-intelligence',
  },
  {
    id: 'real-time-decision-support',
    label: 'Real-Time Decision Support',
    path: '/real-time-decision-support',
  },
];

/** Gemini model requested through the serverless proxy — never called directly from the client. */
export const GEMINI_MODEL = 'gemini-1.5-flash';

/** Cap on raw end-user text before it reaches guard.ts (see guard.ts for why). */
export const MAX_USER_INPUT_LENGTH = 500;

/** Cap on the fully-assembled prompt the proxy will accept, enforced server-side in api/gemini.ts. */
export const MAX_GEMINI_PROMPT_LENGTH = 8_000;

/** Client request timeout before client.ts aborts and (if retries are exhausted) falls back to mock. */
export const GEMINI_REQUEST_TIMEOUT_MS = 15_000;

/** Retry attempts client.ts makes on a 429/5xx before giving up. */
export const GEMINI_MAX_RETRIES = 2;

/** Base backoff delay between retries; doubles each attempt. */
export const GEMINI_RETRY_BASE_DELAY_MS = 500;

/** How long an identical prompt's response is served from the in-memory cache. */
export const GEMINI_CACHE_TTL_MS = 5 * 60 * 1000;

/** Minimum time between live calls to the same feature before index.ts serves mock instead. */
export const GEMINI_MIN_REQUEST_INTERVAL_MS = 2_000;
