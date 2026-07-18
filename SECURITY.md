# Security

Stadeck is a hackathon demo. This document describes the threat model as it
is actually implemented — every mitigation below names the file that enforces
it — and what is consciously out of scope.

## Threat model

| Risk                            | Mitigation                                                                                                                                                                                                                                                                                                                                                   | Where                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| Gemini API key exposure         | The key lives only in the Vercel env var `GEMINI_API_KEY` (server-side, no `VITE_` prefix, `.env` gitignored with a placeholder in `.env.example`). The client calls `/api/gemini` and never sees the key. This is the project's core security control.                                                                                                      | `api/gemini.ts`                                                                                          |
| Malicious/oversized requests    | The proxy accepts only `POST` with a body of exactly `{ prompt: string }` — no extra fields — capped at `MAX_GEMINI_PROMPT_LENGTH` (8,000 chars). Anything else is rejected with 400 before the key is touched.                                                                                                                                              | `api/gemini.ts` (`isValidRequestBody`)                                                                   |
| Upstream error/key leakage      | Upstream failures are logged server-side and returned to the client as a generic `Gemini request failed` — the upstream body, status detail, and key are never echoed back.                                                                                                                                                                                  | `api/gemini.ts` (error shaping)                                                                          |
| Prompt injection via user input | All free-text user input is capped at 500 chars, stripped of control characters, and wrapped in a delimited block with an explicit instruction that the delimited content is data, never instructions. Structured pickers (gates, sections) bypass free text entirely.                                                                                       | `src/services/gemini/guard.ts`; used by every builder in `src/services/gemini/prompts.ts`                |
| Injection via "external" feeds  | Simulated venue feeds are treated as untrusted like user input: announcement text is delimiter-wrapped before it reaches a prompt (translation, plain-language rewrite), and numeric feed values (transit ETAs, sustainability metrics, KPIs) are clamped before render.                                                                                     | `src/services/gemini/prompts.ts`; `clamp` in `src/utils/numbers.ts` at each dashboard/board              |
| Malformed/hostile AI output     | Model output is untrusted JSON: code fences are stripped, the text is parsed defensively, and the result is validated against a per-feature shape guard. Anything nonconforming falls back to a deterministic mock — hostile output never reaches the DOM as markup.                                                                                         | `src/services/gemini/client.ts` (`parseJsonResponse`); `src/services/gemini/validators.ts`               |
| XSS via AI-generated content    | AI output renders as plain text only. There is no `dangerouslySetInnerHTML` anywhere in the app and no HTML/markdown rendering of model output.                                                                                                                                                                                                              | Enforced app-wide; verified in the Phase 6 audit                                                         |
| Role gate bypass                | Volunteer/Organizer views open with a demo access code — a documented hackathon stand-in for venue SSO/OIDC, not an authentication system; the codes protect nothing sensitive. Both entry paths funnel through one validation function, and the active role is held in React context only (never `localStorage`), so a refresh always returns to the gate. | `src/utils/accessCode.ts`; `src/config/constants.ts` (`DEMO_ACCESS_CODES`); `src/context/roleContext.ts` |
| API abuse from the client       | A per-feature minimum-interval limiter and an in-memory TTL response cache keep repeat or rapid-fire requests from reaching Gemini at all.                                                                                                                                                                                                                   | `src/services/gemini/index.ts` (limiter); `src/services/gemini/client.ts` (cache)                        |

## Location privacy

The "Find nearest venue" control in the venue picker never runs on load —
only that button click triggers the browser's Geolocation permission prompt,
and denial, unavailability, or a timeout all fall back to the picker with no
error state. When permission is granted, the coordinates are compared against
the bundled venue registry entirely on-device (`utils/geolocation.ts`, a
haversine distance calculation with no network call and no third-party
geocoding service) and then discarded — they are never transmitted anywhere,
stored, or logged. Venue selection itself lives in React context only, like
role and language, so a refresh always returns to the default (Final) venue.

## Dependency vulnerabilities

`npm audit` currently reports 3 advisories (2 moderate, 1 high) in
`esbuild`/`vite`'s dev server (path traversal in optimized-deps `.map`
handling, a Windows-only NTLM hash disclosure in `launch-editor`, and a
dev-server CORS request issue). All are scoped to the local Vite dev server,
not the production build output, and one is Windows-specific. Fixing them
requires a major Vite version jump that is out of scope for the pinned stack.
Consciously accepted for this hackathon build; revisit if the dev server is
ever exposed beyond localhost.

## Out of scope

- Production-grade auth (venue SSO/OIDC) — the demo access code is a stand-in,
  and is deliberately visible in the repo so judges can enter the gated views.
- Server-side rate limiting and per-user quotas beyond the client-side
  per-feature limiter (a real deployment would enforce these at the proxy).
- Secrets management beyond a single Vercel env var.
- Penetration testing / third-party security audit.
