import type { LanguageOption } from '../types/language';
import type { Module } from '../types/module';
import type { GatedRole, RoleOption } from '../types/role';

/**
 * Venue every screen renders until a venue switcher lands: the FIFA World Cup
 * 2026 Final host. The full host-venue registry lives in
 * services/data/venues.ts; layouts, facts, and mock feeds are all generated
 * per venue from that registry.
 */
export const DEFAULT_VENUE_ID = 'metlife-stadium';

/**
 * Beyond this radius, "Find nearest venue" treats the fan as planning ahead
 * from home rather than standing near a venue: it surfaces the nearest match
 * as information instead of silently jumping the view to an irrelevant venue.
 */
export const NEARBY_VENUE_THRESHOLD_KM = 500;

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
 * Languages offered by the interface-language picker. The bounded static
 * string table in services/data/uiStrings covers each of these (module
 * titles/descriptions, primary buttons, placeholders, empty states —
 * deliberately not full UI i18n), and AI-generated content follows the same
 * setting.
 */
export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
  { code: 'fr', label: 'French', nativeLabel: 'Français' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português' },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
];

/** Default interface language until the visitor picks another. */
export const DEFAULT_LANGUAGE = 'en';

/** Delay before the chat input's language-detection hint recomputes (CLAUDE.md: debounce chat inputs). */
export const CHAT_INPUT_DEBOUNCE_MS = 300;

/** How often the simulated venue announcement feed emits a new item. */
export const ANNOUNCEMENT_FEED_INTERVAL_MS = 40_000;

/** Most recent announcements kept on screen; older ones scroll off like a real PA board. */
export const ANNOUNCEMENT_FEED_LIMIT = 6;

/** How often the simulated occupancy sensors publish a fresh set of readings. */
export const DENSITY_REFRESH_INTERVAL_MS = 5_000;

/** How often the simulated organizer KPI snapshot refreshes. */
export const KPI_REFRESH_INTERVAL_MS = 10_000;

/** How often the simulated sustainability metrics refresh. */
export const SUSTAINABILITY_REFRESH_INTERVAL_MS = 20_000;

/** How often the simulated transit board refreshes ETAs and crowding. */
export const TRANSIT_REFRESH_INTERVAL_MS = 15_000;

/** Longest transit ETA the board will display — feed values are clamped to this (untrusted feed). */
export const TRANSIT_MAX_ETA_MINUTES = 120;

/**
 * When the demo match is expected to end (3:00 PM kickoff per the announcement
 * feed, plus regulation time and ceremony) — anchors the egress planner's
 * departure-time reasoning.
 */
export const EXPECTED_FINAL_WHISTLE = '4:50 PM';

/** Busiest zones shown in the Crowd Management watchlist. */
export const CROWD_WATCHLIST_COUNT = 8;

/** How often the simulated incident feed reports a new incident. */
export const INCIDENT_FEED_INTERVAL_MS = 30_000;

/** Most recent incidents kept in the feed. */
export const INCIDENT_FEED_LIMIT = 8;

/** Cap on raw end-user text before it reaches guard.ts (see guard.ts for why). */
export const MAX_USER_INPUT_LENGTH = 500;

/**
 * Cap on the fully-assembled prompt the proxy will accept. The proxy
 * (api/gemini.ts) enforces its own inlined copy of this value at runtime —
 * see that file for why it can't import this one — this export exists so
 * client-side code (stadiumFacts's size test) can check against the same
 * cap without duplicating the number a third time.
 */
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
