# Deleted Modules Log

A running record of modules removed as dead code. One line per deletion: date — path — reason.

- 2026-05-19 — `supabase/functions/_shared/tier-utils.ts` — zero edge-function consumers, surfaced by B3 audit
- 2026-05-19 — `supabase/functions/_shared/cohortRetentionMath.ts` — zero edge-function consumers, surfaced by B3 audit
- 2026-05-19 — `supabase/functions/_shared/emailRender.ts` — zero edge-function consumers, surfaced by B3 audit (distinct from the live `src/lib/emailRender.ts`, a name collision only)
