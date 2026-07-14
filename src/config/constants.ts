import type { LanguageOption } from '../types/language';
import type { Module } from '../types/module';
import type { GatedRole, RoleOption } from '../types/role';

/** Demo venue for all mock data: the FIFA World Cup 2026 Final host. */
export const STADIUM_NAME = 'MetLife Stadium';
export const STADIUM_ID = 'metlife-2026-final';
export const STADIUM_CAPACITY = 82_500;

/**
 * The eight modules named exactly after the challenge clauses. Drives route
 * generation, Shell navigation, and the ModuleGate role guard — see App.tsx.
 */
export const MODULES: readonly Module[] = [
  {
    id: 'navigation',
    label: 'Navigation',
    path: '/navigation',
    roles: ['fan', 'volunteer', 'organizer'],
  },
  {
    id: 'crowd-management',
    label: 'Crowd Management',
    path: '/crowd-management',
    roles: ['volunteer', 'organizer'],
  },
  {
    id: 'accessibility',
    label: 'Accessibility',
    path: '/accessibility',
    roles: ['fan', 'volunteer', 'organizer'],
  },
  {
    id: 'transportation',
    label: 'Transportation',
    path: '/transportation',
    roles: ['fan', 'volunteer', 'organizer'],
  },
  {
    id: 'sustainability',
    label: 'Sustainability',
    path: '/sustainability',
    roles: ['fan', 'organizer'],
  },
  {
    id: 'multilingual-assistance',
    label: 'Multilingual Assistance',
    path: '/multilingual-assistance',
    roles: ['fan', 'volunteer', 'organizer'],
  },
  {
    id: 'operational-intelligence',
    label: 'Operational Intelligence',
    path: '/operational-intelligence',
    roles: ['organizer'],
  },
  {
    id: 'real-time-decision-support',
    label: 'Real-Time Decision Support',
    path: '/real-time-decision-support',
    roles: ['volunteer', 'organizer'],
  },
];

/** The three role views selectable from the landing screen, in display order. */
export const ROLES: readonly RoleOption[] = [
  {
    id: 'fan',
    label: 'Fan',
    description: 'Wayfinding, matchday help, and multilingual assistance — no sign-in needed.',
    gated: false,
  },
  {
    id: 'volunteer',
    label: 'Volunteer & Staff',
    description: 'Crowd flow, accessibility support, and live guidance for teams on the concourse.',
    gated: true,
  },
  {
    id: 'organizer',
    label: 'Organizer',
    description: 'The full operational picture: intelligence, decision support, and every module.',
    gated: true,
  },
];

/**
 * Demo-only role gate for hackathon judging. Production would use venue
 * SSO/OIDC — see SECURITY.md. These are access codes, not passwords: they
 * select which demo view loads and protect nothing sensitive. The landing
 * screen's "Continue with demo access" button submits these through the same
 * validation path as the text field — there is no separate bypass logic.
 */
export const DEMO_ACCESS_CODES: Readonly<Record<GatedRole, string>> = {
  volunteer: 'PITCH-CREW-2026',
  organizer: 'FINAL-OPS-2026',
};

/**
 * Languages offered for AI-generated content (chat replies, translated
 * announcements). UI chrome stays English — there is deliberately no full UI
 * i18n, only the AI content regions set `lang` on their containers.
 */
export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

/** Default AI content language until the visitor picks another. */
export const DEFAULT_LANGUAGE = 'en';

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
