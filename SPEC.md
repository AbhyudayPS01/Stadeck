# SPEC.md — Stadeck Project Constitution

Read this file fully before every task. Every rule here applies to every phase, every file, every commit. When any instruction in a task prompt conflicts with this file, this file wins.

## What we are building

**Stadeck** — a GenAI-powered stadium operations and fan experience platform for FIFA World Cup 2026. It is a hackathon submission **scored by an AI judge reading the GitHub repository**, followed by a manual human review of the deployed app. Every line of code, file name, and comment is scoring surface.

Challenge statement (align to this verbatim):
> "Build a GenAI-enabled solution that enhances stadium operations and the overall tournament experience for fans, organizers, volunteers, or venue staff. The solution must leverage Generative AI to improve navigation, crowd management, accessibility, transportation, sustainability, multilingual assistance, operational intelligence, or real-time decision support during the FIFA World Cup 2026."

## Judging rubric (optimize in this order)

| Parameter | Weight |
|---|---|
| Code Quality | HIGH |
| Problem Statement Alignment | HIGH |
| Security | MEDIUM |
| Efficiency | MEDIUM |
| Testing | LOW (tiebreaker) |
| Accessibility | LOW (tiebreaker) |

When in doubt about any implementation choice, choose the option that reads better to a code reviewer.

## Product shape

- Three role views from a landing screen: **Fan** (open, one click), **Volunteer & Staff** and **Organizer** (demo access code field + a one-click "Continue with demo access" button; the button applies the demo code through the same validation path — no separate bypass logic).
- Eight modules named **exactly** after the challenge clauses: Navigation, Crowd Management, Accessibility, Transportation, Sustainability, Multilingual Assistance, Operational Intelligence, Real-Time Decision Support. Folder names, routes, component names, and README headings use these exact terms.
- **Flagship modules** (deepest, built first, best demo): Multilingual Assistance, Crowd Management, Real-Time Decision Support. The other five are supporting modules — complete and polished, but simpler.
- Demo context: one stadium (MetLife Stadium, 2026 Final venue) with mock data. All "real-time" feeds are simulated.
- Demo access codes live in `config/constants.ts` as `DEMO_ACCESS_CODES` with a JSDoc block: "Demo-only role gate for hackathon judging. Production would use venue SSO/OIDC — see SECURITY.md." Never call them passwords. Role stored in React context only (never localStorage).

## Tech stack (fixed — do not add dependencies without strong reason)

- React 18 + Vite + **TypeScript strict**. No `any`, no `@ts-ignore`, no non-null assertions to silence errors.
- Tailwind CSS with design tokens defined in `tailwind.config` (see DESIGN.md for the token values).
- React Router, one route per module, all routes lazy-loaded.
- Vitest + React Testing Library.
- **Gemini API via a Vercel serverless function** (`api/gemini.ts`). The key lives in Vercel env var `GEMINI_API_KEY` (server-side only, no `VITE_` prefix). The client NEVER sees the key. This is the project's core security control.
- ESLint + Prettier, configs committed, zero warnings tolerated.
- No state library. React context + hooks.
- MIT LICENSE file at repo root.

## Architecture rules

```
api/
  gemini.ts                 # Vercel serverless proxy: validates request shape,
                            # injects key, forwards to Gemini, returns response.
                            # Rejects oversized payloads. ~50 lines, fully commented.
src/
  main.tsx
  App.tsx                   # router + role context + global ErrorBoundary
  config/constants.ts       # model name, limits, stadium id, demo codes
  types/                    # shared interfaces, one domain per file
  services/
    gemini/
      client.ts             # fetch wrapper to /api/gemini: timeout (15s AbortController),
                            # 2 retries w/ backoff on 429/5xx, typed error taxonomy
      prompts.ts            # ALL prompt templates as typed builder functions
      guard.ts              # input sanitization + prompt-injection mitigation
      mock.ts               # deterministic mock responses per feature
      index.ts              # public API: one named function per feature
    data/                   # mock data providers (sensors, transit, incidents, KPIs)
  hooks/                    # useGemini, useMockStream, useReducedMotion, etc.
  components/
    ui/                     # Button, Card, Badge, Spinner, ErrorState, EmptyState, ErrorBoundary
    layout/                 # Shell, Sidebar, RoleSwitcher, LanguagePicker
    map/                    # StadiumMap + overlay layers (see SVG rules)
    mascot/                 # original mascot component + poses
  features/
    navigation/  crowd-management/  accessibility/  transportation/
    sustainability/  multilingual-assistance/  operational-intelligence/
    real-time-decision-support/
  utils/                    # pure functions only — fully unit tested
```

- One-way dependencies: features → services/hooks/components. Never feature → feature.
- Every Gemini call goes through `services/gemini/index.ts`. Zero fetch calls in components.
- Every exported symbol gets a JSDoc comment (what/params/returns). No noise comments. Stale comments are worse than none.
- No file over ~250 lines; no component over ~150 lines. Split before it grows.
- Every feature screen opens with a JSDoc block naming the challenge clause it implements.
- Co-located tests: `*.test.ts(x)` next to the source. One convention, everywhere.

## Stadium map rules (highest-risk component — follow exactly)

- The map is a **clean schematic, never realistic**: concentric ring layout, labeled section blocks (e.g., 101–140 lower bowl, 201+ upper), gates at compass points (Gate A–H), amenity markers (restrooms, food, first aid, accessible seating).
- **Data-driven**: sections/gates/amenities come from a typed JSON config in `services/data/stadiumLayout.ts`; the component maps config → SVG elements. No hand-drawn path soup.
- Base map renders once; density heatmaps, routes, and markers are separate overlay layers so updates never re-render the base.
- Every section/gate is keyboard-focusable with an accessible name.

## Gemini integration rules

- Client calls `/api/gemini` only. Mock fallback is mandatory: if the proxy errors after retries or returns non-OK, transparently serve the deterministic mock for that feature and show a subtle "Demo data" badge. The app must fully work offline / with zero key.
- `guard.ts`: cap user input at 500 chars, strip control characters, wrap user text in delimited blocks with an instruction that delimited content is data, not instructions. Comment WHY (prompt-injection mitigation — scoring point).
- Prompts requesting structured output must instruct JSON-only and be parsed defensively (strip code fences, validate schema, fall back to mock on parse failure).
- In-memory TTL cache keyed by prompt hash for repeat requests. Client-side min-interval limiter per feature. Comment the rationale on both (efficiency scoring points).
- UI chrome stays **English**. AI-generated content is multilingual: the chat region and translated announcements set `lang` on their own containers. Do NOT build full UI i18n.

## Security rules (each must be visible in code or docs)

- No secrets anywhere in the repo or git history. `.env` gitignored in the FIRST commit. `.env.example` with placeholder.
- Serverless proxy: validate request body shape, enforce max payload size, allow only expected fields, never echo the key or upstream errors verbatim to the client.
- All user input passes `guard.ts` before prompts or DOM. No `dangerouslySetInnerHTML`. AI output rendered as plain text / safe markdown subset.
- Treat mock "external" feeds as untrusted: validate and clamp values before render (comment this).
- Pin dependency versions. Minimal dependency count.
- `SECURITY.md`: threat model (key exposure → mitigated by proxy; prompt injection → guard.ts; XSS → no raw HTML; role gate → documented demo stub for venue SSO/OIDC) and what was consciously left out of scope.

## Efficiency rules

- Route-level code splitting for all eight features (React.lazy + Suspense).
- Memoize only where a real recomputation cost exists — comment why. No cargo-cult memoization.
- Debounce chat/translation inputs (300ms). All intervals/timeouts cleaned up on unmount.
- No moment.js, no lodash. Native Date/Intl and small utils.
- Decorative animation must be cheap: CSS transforms/opacity only, never layout-thrashing properties.

## Accessibility rules

- Semantic landmarks, correct heading hierarchy, keyboard-reachable everything, visible focus states.
- ARIA labels on icon buttons; `aria-live="polite"` on AI response regions and the incident feed.
- Contrast ≥ WCAG AA. Never encode meaning by color alone (heatmap gets labels/patterns).
- High-contrast toggle + text-size control (part of the Accessibility module's story).
- `prefers-reduced-motion` respected — ALL celebratory animation (confetti, mascot motion, ball spins) disabled under it, via a shared `useReducedMotion` hook.
- Decorative elements (footballs, mascot, confetti) are `aria-hidden="true"` and never carry information.

## Testing rules

- `npm test` green with zero warnings. CI (GitHub Actions): install → lint → typecheck → test → build; badge in README.
- Unit tests for 100% of `utils/`, `guard.ts`, `prompts.ts` builders, mock providers, cache/limiter, and the proxy's validation logic.
- Component tests: chat send flow, role gate (code + demo button), error/fallback states with the Gemini service mocked.
- Test names read as specs: `"returns mock response when proxy is unreachable"`.

## Per-module Definition of Done (applies to every feature screen)

1. Loading, error, empty, success, and mock-mode states all designed — no unstyled flashes, no dead ends.
2. Gemini interaction works live AND with mock fallback.
3. Keyboard-only walkthrough succeeds.
4. Screen JSDoc names its challenge clause; README table row added.
5. Tests written; phase gate passed.

## Phase gate (run at the end of EVERY phase — non-negotiable)

1. `npm run lint && tsc --noEmit && npm test && npm run build` all pass clean.
2. Delete dead code, unused imports/exports, commented-out blocks, stray `console.log`s.
3. Logic pasted twice gets extracted into `utils/` or a hook NOW.
4. Any file past ~250 lines gets split.
5. New code matches existing patterns exactly (error handling shape, component structure, import order).
6. Commit with conventional-commit messages (`feat: add crowd density overlay`), small and scoped.

## Repo hygiene

- MIT `LICENSE`, `SECURITY.md`, `README.md` (structure defined in Phase 7 prompt), `.env.example`, CI workflow.
- Repo description and topics set on GitHub (fifa-world-cup-2026, genai, gemini, stadium-operations, react, typescript).
- Zero secrets in git history — verify before every push.
