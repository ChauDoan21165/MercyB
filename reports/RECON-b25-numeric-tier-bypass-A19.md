# RECON — B25 numeric `tier >= N` bypass map (A19, no-op)

**Status:** NO-OP recon. **Gated on PR #774.** No code deleted.
**Date:** 2026-05-19 · **Agent:** A19 · **Base:** `origin/main` @ `5cfa27e3f`

## Why this is a no-op

A19 is the **companion cleanup** to A11's T2 retirement: delete B25's numeric
`tier >= N` bypass once the entitlement-based replacement lands. The replacement
is **PR #774** (`b25/tier-gate-fix-pr1`, *"fix(billing): premium gates read
entitlement, not stale profiles.tier (B17 PR1)"*).

At recon time **PR #774 is OPEN** (`state: OPEN`, `mergedAt: null`). Per the
dispatch, bypass deletion is hard-gated on #774 landing — deleting now would
remove code #774 still depends on / has not yet superseded. **STOP and document.**

## Root cause (from #774 body, B5/B17 chain)

`profiles.tier` is a **TEXT** column (`database.types.ts: tier: string`).
Billing (Stripe → `recomputeAndPersistEntitlement`) **never writes
`profiles.tier`** — it writes `premium_status` + `premium_expires_at` (B5).
Any gate doing `typeof row.tier === "number" ? … : 0` then `tier >= N` is
**unreachable dead code** (numeric test on a TEXT value is always false → 0).
A paying user past trial silently falls through to the free/trial path.
Discovered case: "Mylinh".

## The B25 bypass — exactly two sites

### Site 1 — `supabase/functions/azure-phoneme/core.ts`

```
:902  const tier = typeof profile.tier === "number" ? profile.tier : 0;
:903  if (tier >= 1) return { allowed: true };
```
Doc-comment refs: `:395`, `:847` (`"paid (tier >= 1)"`).
Test ref: `azure-phoneme/__tests__/index.test.ts:516`.

**#774 disposition:** *replaces* `if (tier >= 1)` → `if (isPremiumEntitled(profile))`,
retypes `tier` `string|number|null`, selects `premium_status`/`premium_expires_at`.
→ **#774 removes this numeric bypass itself.** A19 residual here = only whatever
stale `const tier = …` line / `tier >= 1` doc-comments #774 leaves behind (TBD
from #774's *merged* shape — re-derive, don't assume).

### Site 2 — `supabase/functions/_shared/mockInterviewRateLimit.ts`  ← A19's PRIMARY target

```
:108  if (ctx.tier >= 2) {
:109    return { allowed: true, reason: "paid", … };
```
Type: `MockInterviewGateContext.tier: Tier` (`:30`), tier-comment block `:7-9`,`:29`.
Test ref: `mockInterviewRateLimit` test suite.

**#774 disposition:** changes to `if (ctx.isPaid || ctx.tier >= 2)` —
**deliberately KEEPS `ctx.tier >= 2` as a defensive fallback** (#774 body:
*"legacy tier kept as defensive fallback"*). This retained `|| ctx.tier >= 2`
is **A19's precise deletion target** once #774's `ctx.isPaid`
(= `isPremiumEntitled`) is proven to fully cover the paid case.

## Post-#774 A19 action plan (do NOT run until #774 is merged)

1. `gh pr view 774 --json mergedAt` → confirm non-null. Re-derive residual from
   the **merge commit** (review may reshape #774; do not assume the body).
2. `mockInterviewRateLimit.ts`: drop `|| ctx.tier >= 2` from the paid branch.
   If `MockInterviewGateContext.tier` is then unused → delete the field (`:30`),
   the `Tier` import, the tier-comment block (`:7-9`, `:29`), every call-site
   that populates `tier`, and any test asserting the numeric-tier-only path.
3. `azure-phoneme/core.ts`: delete any stale `const tier = typeof … : 0` line
   and `tier >= 1` doc-comments (`:395`, `:847`) #774 left, if not already gone.
4. Gates: `npm run typecheck:ci` + `npm run lint` + `npx vitest run` (the two
   edge-fn test suites) + `npm run build`. Edge fns are Deno — also sanity-check
   `supabase/functions/_shared` imports compile.
5. PR: `cleanup(entitlement): delete B25 numeric tier>=N bypass (post-#774)`.

## NOT the B25 bypass — leave these alone (classified, no action)

- `supabase/functions/trial-expiry-emails/categorizeForTrialExpiry.ts:94-95`
  `tierIsPaid()` — correctly handles **both** number and `Number.parseInt(string)`.
  This is the *good* pattern #774 itself cites (email-reengagement `isPaidActive`
  style). Not a bypass; do not touch.
- `src/lib/stories/eligibility.ts:5,32,138-139` — testimonial-eligibility gate,
  `tier: number | null`, `MIN_TIER=1`. Different concern (asking for a story),
  not a premium feature gate; #774 does not touch it. Carries the same latent
  numeric-on-TEXT class bug (B5) but **out of A19 scope** (A19 = delete the B25
  *bypass*, not fix every numeric-tier reader). Flag as related debt only.

## #774 state when A19 ran

`PR #774` — **OPEN**, `mergedAt: null`, head `b25/tier-gate-fix-pr1`, base `main`.
