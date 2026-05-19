# RECON — Billing / Entitlement Layer: How It Got Here (B47)

> **Label:** B47 · **Branch:** `b47/billing-architecture-history` · **Base:** `origin/main` @ `5cfa27e3f`
> **Date:** 2026-05-19 · **Type:** historical meta / git archaeology · **No code touched.**
> **`stale-audit-note`:** point-in-time snapshot. SHAs/branches below are accurate as of the base
> commit; the unmerged-branch facts (B25/B17 `premiumEntitlement.ts`) will rot the moment that PR
> lands or is rebased. Re-derive before acting on the "still live in prod" claims.

Companion to **B45** (which maps how the layer *works*). This maps how it *got here* — which
"fix" is a patch over an older fix vs. a clean addition.

---

## TL;DR

- The entitlement engine and its **dead `src/billing/*` twin were born in the same commit**
  (`8be638e33`, 2026-03-15). `src/billing/*` was never a *copy* — it is the **original home**,
  orphaned when the `me-entitlement` edge function superseded it. Features kept being written
  into the corpse through 2026-04-25 (family/corporate/gift) and it was still being *refactored*
  on 2026-05-17 (#580). Zero non-self importers at HEAD — confirmed dead. (B13 correct.)
- The **dormant `sync_profile_tier` trigger (B27) has no creation migration anywhere in the
  repo.** The only file that names it (`20260510010000_fix_sync_profile_tier_trigger.sql`,
  #358) *patches column drift* on a trigger that VCS never saw created → it was applied
  out-of-band via the Supabase SQL Editor. The repo holds a patch over an invisible original.
- The **numeric `profiles.tier` premium bypass (B25)** was introduced **2026-04-26** in the
  revenue-protection wave (`#177` mock-interview + azure-phoneme Day 1), has been **live in
  prod ~3 weeks**, and its fix (`premiumEntitlement.ts`, `0c14a206d`) is **NOT on `origin/main`**
  — it sits unmerged on `b25/tier-gate-fix-pr1`. The fix commit is labelled "B17 PR1" while the
  branch is `b25/...` — **B17/B25 ownership drift** worth flagging.
- **`billing_price_map` (B30)**: filename timestamp `20260403000000` is **backdated**. It was
  actually authored 2026-04-25 in a timestamp-standardization sweep (`437f1bb2f`). The filename
  date lies — do not date the price-map schema to April 3.
- Two parallel tier representations have coexisted since Era 1: UUID `subscription_tiers.id`
  (Lovable, Oct 2025) and numeric `profiles.tier` / `premium_status` (added 2026-03-15). Every
  "stale tier" bug class in B5/B17/B25 descends from code reading one while truth lives in the
  other.

---

## Method

`git log --follow` per load-bearing file from a fresh worktree off `origin/main`. Creation
commits via `--diff-filter=A`. Dead-code status via importer grep. Migration lineage by
content-grep across the whole tree at HEAD. Unmerged work traced via `--all` + branch list.
`npm ci` skipped intentionally: pure archaeology, zero gate runs, node_modules irrelevant
(the staggered-sleep step exists only to de-conflict concurrent `npm ci`).

---

## Era timeline

| Era | Window | Defining commits | What was built |
|----|--------|------------------|----------------|
| **0 — Lovable scaffold** | 2025-10 → 2025-12 | `20251020094557…` … `20251207075419…` (UUID-suffixed = Lovable autogen) | `subscription_tiers` (UUID-keyed), RLS, `subscriptions` table |
| **1 — Entitlement engine core** | 2026-03-15/16 | `8be638e33` add entitlement engine core · `b4fd211e6` add unified entitlement schema · `4e78b89a0` monotonicity/Deno fix · `577443a1f` "canonical shared subscription model" | `me-entitlement/index.ts` **and** `src/billing/*` (same commit) · `20260315211233_unified_entitlements_and_subscriptions.sql` adds `premium_status` + numeric tier projection onto profiles |
| **2 — First Stripe finalize** | 2026-03-21 | `96c57c8ba` "finalize Stripe entitlement flow" | `_shared/billing.ts` created — **never touched again** (frozen 2 months) |
| **3 — RevenueCat / Apple dual-write** | 2026-03-25 → 2026-04-08 | `ba82d081d` (UI-refactor msg) hides `_shared/apple-billing.ts` · `b7524cc7c` "Split Stripe webhook" · same-day patch `1124b0df2` · `541c4dc7f` (core.ts frozen after) · `07eacc9ff`, `a269e000b` checkout patches | webhook split into `billing.ts`/`core.ts`/`webhook-events.ts`; Apple/RC path |
| **4 — Redemption layer** | 2026-04-21 → 2026-04-26 | `9b8014aa8` trial fields · `743513c5d` referral #98 · `90d7e515b` family #103 · `67ba5c5bb` corporate #105 · `30a29384a` gift #106 · `437f1bb2f` timestamp sweep (backdates price_map) · `94f7ed063` #177 + `c079047bb` azure-phoneme Day 1 | family/corporate/gift entitlement — **written into the dead `src/billing/computeEntitlement.ts`**; numeric-tier gates born in #177/azure-phoneme |
| **5 — Hardening wave** | 2026-05-10 → 2026-05-19 | `9e673a6f9` #355 · `5a26898fe` #358 · `aba622c82` #361 · `f45e517f9` #362 · `cd2f30a06` #365 · `bd66e0bd5` #579 · `3853b3de7` #580 · `380dd1b38` #726 · `8d5c1e6e9` #770 · `0c14a206d` (B17/B25, **unmerged**) · `16110df6a` #750 | redeem patch-storm; period-resolution extraction; type-bug repair; unmerged tier-gate fix |

---

## Era narratives — bug class introduced, and when caught

### Era 0 — Lovable scaffold (Oct–Dec 2025)
`subscription_tiers` is **UUID-keyed** from birth (`20251020094557`). No numeric tier yet.
**Bug class seeded:** an opaque-UUID tier model with no human-readable ordering — every later
"is this user paid?" check needs a join or a projection. **Caught:** never directly; it is the
root cause the whole Era 5 wave keeps re-treating.

### Era 1 — Entitlement engine core (2026-03-15/16)
`8be638e33` creates the engine in **two places at once**: `me-entitlement/index.ts` (edge) and
`src/billing/computeEntitlement.ts` + `recomputeAndPersistEntitlement.ts` +
`subscriptionRepository.ts` + `types.ts` (client lib). `20260315211233` bolts numeric
`premium_status`/tier projection onto `profiles`. `577443a1f` (next day) calls itself the
"canonical shared subscription model" — the canonicalization that never finished.
**Bug class introduced:** **dual source of truth** (UUID `subscription_tiers` vs numeric
`profiles.premium_status`/tier) **and dual code home** (edge fn vs `src/billing`).
**Caught:** the dual *code* home only on 2026-05-19 by B13; the dual *truth* by B5/B17/B25
(2026-05-17→19). ~2 months dormant.

### Era 2 — First Stripe finalize (2026-03-21)
`96c57c8ba` creates `_shared/billing.ts` and never returns. A shared billing helper that has
been **frozen for two months** while everything around it churned.
**Bug class introduced:** a load-bearing shared module excluded from every subsequent refactor —
drift accumulates *around* it, not *in* it (the most dangerous kind, per CLAUDE.md "central
files are dangerous"). **Caught:** not yet flagged as stale by any B-task; noted here.

### Era 3 — RevenueCat / Apple dual-write (2026-03-25 → 04-08)
`ba82d081d` introduces `_shared/apple-billing.ts` under the commit message *"Refine header,
home top fold, and mobile layout"* — billing infrastructure smuggled inside a UI commit.
`b7524cc7c` splits the Stripe webhook; it needed a **same-day** follow-up `1124b0df2` ("Fix
subscription activation flow") and two more patches on 2026-04-08. `core.ts` was last touched
2026-04-04 and has been frozen since.
**Bug class introduced:** (a) **mixed-concern commits** hiding billing changes from
`git log -- billing` archaeology; (b) **webhook split shipped broken** (patch-same-day pattern);
(c) two writers (Stripe webhook + Apple/RC) into one entitlement state with no documented
reconciliation. **Caught:** the dual-write reconciliation gap is what B22 (gift propagation)
and B17 (4-fn status-only chain) are still untangling.

### Era 4 — Redemption layer (2026-04-21 → 04-26)
Trial fields, referral (#98), family (#103), corporate (#105), gift (#106) — **all five
entitlement extensions were written into `src/billing/computeEntitlement.ts`**, which by this
point the live `me-entitlement` edge path had already superseded. `437f1bb2f` (the timestamp
"standardize" sweep) **backdated** `billing_price_map`'s filename to `20260403000000`.
`94f7ed063` (#177) + `c079047bb` (azure-phoneme) introduce the **numeric `profiles.tier`
premium gate** in revenue-protection code.
**Bug class introduced:** (a) **features authored into dead code** — family/corporate/gift
logic may never have reached the live edge path; (b) **migration timestamp ≠ authorship date**
(price-map archaeology trap, B30); (c) the **numeric tier bypass** goes live. **Caught:** dead
copy → B13 (2026-05-19, ~24 days later); numeric bypass → B17/B25 (2026-05-19, ~23 days later,
**fix still unmerged**); price-map row → B30.

### Era 5 — Hardening wave (2026-05-10 → 05-19)
The redeem **patch-storm of 2026-05-10**: four migrations in one day —
`#355` atomic redemption → `#358` patch the `sync_profile_tier` trigger column drift → `#361`
unblock paid-tier gift subs → `#362` patch the *second* active-requires-stripe constraint.
`#362`'s title literally says "second" — a fix for the previous same-day fix's blast radius.
Then `#365` me-entitlement gift fallback (B22 territory), `#579` extracts
`me-entitlement/entitlement.ts` from `index.ts` for test coverage, `#580` makes the **dead**
`src/billing/recomputeAndPersistEntitlement` injectable (refactor effort spent on a corpse),
`#578` freezes privileged profile columns, `#726` repairs 11 latent edge type bugs, `#770`
extracts `period-resolution.ts` (B5 class bug, today), `#750` resolves duplicate
migration-timestamp collisions, and `0c14a206d` adds `premiumEntitlement.ts` — **unmerged**.
**Bug class introduced:** patch-over-patch within a single day with no consolidation; effort
invested in dead code (#580) and in extracting modules (#579, #770) without retiring the twin.
**Caught:** this *is* the catching era — but it is treating symptoms (extract, type-fix,
period-order) faster than it is retiring the structural causes (dead twin, out-of-band trigger,
unmerged tier fix).

---

## Special section — bugs introduced by "fixes" that never got cleaned up

1. **The out-of-band `sync_profile_tier` trigger (B27 dormant trigger).**
   No `CREATE … sync_profile_tier` exists in any migration in the repo. The only reference is
   `20260510010000_fix_sync_profile_tier_trigger.sql` (#358), which *patches column drift* on a
   trigger VCS never saw born → it was created manually in the Supabase SQL Editor (consistent
   with CLAUDE.md's documented migration drift). **Net:** the repo carries a patch over a ghost.
   Anyone reading migrations will conclude the trigger is benign/dormant because they can't see
   what it actually does — its body lives only in prod. Never cleaned up; never reconciled into
   VCS.

2. **The numeric `profiles.tier` bypass (B25).** Born 2026-04-26 in revenue-protection code
   (#177, azure-phoneme). Premium gates read the cheap stale `profiles.tier`/`premium_status`
   snapshot instead of computing entitlement. The fix (`premiumEntitlement.ts`, `0c14a206d`)
   exists but is **stranded on `b25/tier-gate-fix-pr1`, not on `origin/main`** → the bypass is
   **live in production right now**. The fix commit is mislabelled "B17 PR1" on a B25 branch —
   **B17/B25 ownership ambiguity**; clarify which task lands it before merge.

3. **The dead `src/billing/*` twin (B13).** Not a copy — the *original* engine home
   (`8be638e33`), orphaned when `me-entitlement` superseded it but never deleted. Features
   (#103/#105/#106) and refactors (#580) kept landing in it for two more months. Zero non-self
   importers at HEAD. Every hour spent reading/refactoring it is wasted; worse, family/
   corporate/gift logic may have only ever existed there.

4. **`billing_price_map` backdated filename (B30 context).** `437f1bb2f` (#? timestamp sweep,
   2026-04-25) renamed the price-map migration to `20260403000000_*`. The schema's true arrival
   is ~April 25, not April 3. Any "the price map has been live since early April" reasoning is
   wrong by ~3 weeks — relevant to B30's missing-row diagnosis.

5. **Frozen `_shared/billing.ts` (newly noted, no owning B-task).** Created 2026-03-21, never
   touched in the 2 months of churn since. Not a bug yet — a latent one: a load-bearing shared
   helper that every refactor has flowed *around*. Recommend a B-task verify it against current
   schema before the next billing change.

---

## Key inflection points (chronological)

- `8be638e33` 2026-03-15 — engine + dead twin born together (the original sin: dual code home).
- `577443a1f` 2026-03-16 — "canonical shared subscription model" refactor that never canonicalized.
- `96c57c8ba` 2026-03-21 — `_shared/billing.ts` created, then frozen forever.
- `ba82d081d` 2026-03-25 — Apple/RC infra smuggled under a UI commit message.
- `b7524cc7c` + `1124b0df2` 2026-04-03 — webhook split shipped broken, patched same day.
- `30a29384a` 2026-04-25 — last write into the dead twin (gift #106).
- `437f1bb2f` 2026-04-25 — timestamp sweep backdates `billing_price_map`.
- `94f7ed063` 2026-04-26 — numeric tier bypass goes live (still live).
- `5a26898fe`+`f45e517f9` 2026-05-10 — redeem patch-storm; trigger ghost-patch (#358); fix-of-fix (#362).
- `bd66e0bd5`/`3853b3de7` 2026-05-17 — extract for tests (#579) / refactor the corpse (#580).
- `8d5c1e6e9` 2026-05-19 — `period-resolution.ts` extracted (B5 class bug).
- `0c14a206d` (b25 branch, unmerged) — the tier-gate fix that hasn't shipped.

## Cross-references

B45 (architecture map, in flight) · B5/#770 (period-order class bug) · B17 (4-fn status-only
chain; PR1 = `0c14a206d`) · B25 (`b25/tier-gate-fix-pr1`, unmerged) · B22 (gift propagation,
#365 lineage) · B27 (dormant trigger = the ghost in §Special-1) · B30 (price-map row; backdating
context in §Special-4) · B11 (`period-resolution.ts`/`webhook-events.ts` reorg) ·
B13 (dead `src/billing` — confirmed here).
