# Security

Stadeck is a hackathon demo. This document tracks the threat model as it is
actually implemented, and what is consciously out of scope. It will grow as
each phase lands (see `CLAUDE.md`).

## Threat model

| Risk                            | Mitigation                                                                                                                                                           | Status                                                                                    |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Gemini API key exposure         | Key lives only in the Vercel env var `GEMINI_API_KEY` (server-side, no `VITE_` prefix); the client calls `/api/gemini` and never sees the key.                       | Proxy scaffolded (`api/gemini.ts`); request validation and key injection land in Phase 1. |
| Prompt injection via user input | User text is capped, control characters stripped, and wrapped as delimited data (not instructions) before it reaches a prompt.                                       | Planned for `src/services/gemini/guard.ts` in Phase 1.                                    |
| XSS via AI-generated content    | AI output is rendered as plain text / a safe markdown subset. No `dangerouslySetInnerHTML` anywhere in the app.                                                      | Enforced from the first UI phase onward.                                                  |
| Untrusted "live" data           | Mock sensor/transit/incident feeds are treated as untrusted and clamped/validated before render.                                                                     | Planned for `src/services/data/` in Phase 1.                                              |
| Role gate bypass                | Volunteer/Organizer access uses a demo access code, documented as a hackathon stand-in for venue SSO/OIDC. Role is held in React context only, never `localStorage`. | Planned for the role-gate UI phase.                                                       |

## Dependency vulnerabilities

`npm audit` currently reports advisories in `esbuild`/`vite`'s dev server
(path traversal in optimized-deps `.map` handling, a Windows-only NTLM hash
disclosure in `launch-editor`, and a dev-server CORS request issue). All are
scoped to the local Vite dev server, not the production build output, and one
is Windows-specific. Fixing them requires a major Vite version jump that is
out of scope for the current pinned stack. Consciously accepted for this
hackathon build; revisit if the dev server is ever exposed beyond localhost.

## Out of scope

- Production-grade auth (venue SSO/OIDC) — the demo access code is a stand-in.
- Rate limiting beyond the client-side per-feature request limiter.
- Penetration testing / third-party security audit.
