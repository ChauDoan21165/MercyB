# RECON — Billing / Entitlement Architecture, As-Built (B45)

**Agent:** B45 · **Branch:** `b45/billing-architecture-map` · **No PR** (recon).
**Date:** 2026-05-19 · **Labels:** stale-audit-note, silent-failure, money-path
**Scope:** META-DOCUMENTATION. Pure synthesis of seven sibling diagnostics —
**no code change, no re-investigation, no prod query.** This is the single map
of how billing/entitlement *actually works today*, not as designed.

> Synthesizes: `RECON-mylinh-paid-but-free-B5.md`,
> `RECON-profile-trigger-architecture-B27.md`, `RECON-tier-trigger.md`,
> `RECON-monitor-query-baseline-B30.md`,
> `RECON-money-path-silent-failure-monitoring-B7.md`,
> `RECON-isentitling-fix-plan-B13.md`,
> `supabase/functions/stripe-webhook/period-resolution.ts` (B11, merged #770),
> `supabase/functions/_shared/premiumEntitlement.ts` (B25, **PR #774 OPEN**),
> `me-entitlement/index.ts fetchActiveGiftSubscription` (#365),
> `a1/gift-redeem-fix`. Provenance gaps & source disagreements: see §Inconsistencies.

---

## Verdict

MercyBlade has **one canonical entitlement signal in principle**
(`profiles.premium_status` + `profiles.premium_expires_at`, written only by the
Stripe webhook's `recomputeAndPersistEntitlement`) but **three uncoordinated
write paths and a fan of stale, partially-dead read paths around it**. Stripe
writes the canonical pair and never touches `profiles.tier`; RevenueCat writes
`profiles.tier` directly and the canonical pair; gift redemption writes neither
the canonical pair nor reliably `profiles.tier` (it lands in `user_subscriptions`
+ `payment_transactions`, reaching `profiles.tier` only through a trigger that is
**dormant for every Stripe user by table-mismatch**). `profiles.tier` survives as
an **inconsistently-maintained denormalized cache that no canonical reader
trusts** — yet pre-B25 server gates still read it (and, being a TEXT column
mis-typed as numeric, those gates were silently dead). Tonight's fixes repair
the *write* correctness (B11 period_end) and introduce *one* server-side helper
(B25) that reads the right columns; the architectural cleanup of the stale
caches and the four status-only access readers is **not yet done**.

---

## Evidence — Sources of truth (post-B25)

**Canonical entitlement (the number the app should trust):**

| Column | Written by | Read by |
|---|---|---|
| `profiles.premium_status` (`'active'｜'inactive'`, also `trialing`/`past_due`/`grace_period` upstream) | **only** Stripe webhook `recomputeAndPersistEntitlement` (`billing.ts:542`) + RevenueCat projection | `me-entitlement`, `get-subscription-status`, `_shared/billing toEntitlementResponse`, B25's `isPremiumEntitled` |
| `profiles.premium_expires_at` | same writer (`= winner.current_period_end`) | B25's `isPremiumEntitled`; **B13: NOT re-checked by the 4 status-only readers** |
| `subscriptions` row (`status`, `current_period_end`, …) | Stripe webhook `subscription-insert`; RevenueCat projection | `me-entitlement` (the live access gate) derives entitlement from here |

**The new single server-gate helper (B25, `_shared/premiumEntitlement.ts` —
branch-only, PR #774 OPEN, NOT in `origin/main`):**

`isPremiumEntitled(row, nowMs)` — one decision for server feature gates
(`azure-phoneme`, `mock-interview`). Decision order:
1. `past_due` / `grace_period` → entitled, **ignore expiry** (Stripe dunning
   window — B13 caveat #3; revoking here punishes a transient card failure).
2. `active` / `trialing` → entitled **iff** `nowMs < premium_expires_at`
   (null/unparseable expiry ⇒ fail-toward-access; billing hasn't stamped an end).
3. Defensive secondary: a non-empty, non-`"0"`/`"free"` `tier` *string* still
   GRANTS (never denies — a stale tier can never lock a paying user out).

It deliberately treats `premium_status`+`premium_expires_at` as truth and
`profiles.tier` as a **never-coerced-to-number, grant-only** fallback — the
exact opposite of the B17 dead-bypass bug.

---

## Evidence — Stale caches that still exist

**`profiles.tier`** — TEXT column, `NOT NULL DEFAULT 'free'` in prod (NOT
integer; `database.types.ts: tier: string`). Originally intended as the
canonical paid-tier signal (the dormant trigger T2 is the proof of that intent).
Today it is an inconsistently-maintained denormalized cache:

| Writer | When | Value | Tracked? |
|---|---|---|---|
| `revenuecat-webhook/index.ts:241,296` | IAP purchase / expiry | `'level3'` / `'level0'` | code, legitimate |
| `trg_sync_profile_tier_from_payment` (**T2**) on `payment_transactions` | gift/access-code redeem only | `subscription_tiers.vip_key::text` | **binding NOT tracked** (SQL-Editor drift); fn-fix migration `20260510010000` only |
| `sync_profile_tier_from_latest_payment(uuid)` RPC | — | `vip_key` | **NO — zero callers, pure dead debt** |
| Stripe webhook | **never** | — | — |

**Stale readers of `profiles.tier`** (pre-B25 — the bug class):
- `azure-phoneme` + `mock-interview`: `typeof row.tier === "number" ? row.tier : 0`
  → TEXT column ⇒ **always 0** ⇒ every `if (tier >= 1/2)` paid bypass was
  **unreachable dead code** (B17 finding, embedded in B25's header). A user who
  paid *after* trial lapse was denied pronunciation scoring + dropped to the
  free mock-interview limit despite paying.
- `src/lib/stories/eligibility.ts:118` (R1): `tier ?? 0; tier < MIN_TIER` →
  `'free' < 1` → `NaN < 1` → `false` ⇒ **no-op gate** (never blocks).
- Admin display only (AdminUsersPage, AdminStatsStrip) — not gates.
- `me-entitlement` does **NOT** read `profiles.tier` (confirmed end-to-end,
  RECON-tier-trigger §3/§4).

B25 fixes the two server gates; **R1 (stories eligibility) is still on stale
`profiles.tier`** (RECON-tier-trigger §6 PR1, not yet shipped).

---

## Evidence — Three write paths to entitlement

| # | Path | Writes | `payment_transactions` INSERT? | Fires T2? | Sets `profiles.tier`? | Sets canonical `premium_*`? |
|---|---|---|---|---|---|---|
| **W1** | **Stripe** `stripe-webhook/billing.ts` → `recomputeAndPersistEntitlement` | `entitlement_events`, `subscriptions`, `profiles.{premium_status,premium_expires_at,premium_source}` | No | No | **No** | **Yes (canonical)** |
| **W2** | **RevenueCat** `revenuecat-webhook/projection.ts` | `subscriptions`, `profiles.{tier,premium_status}` | No | No | **Yes — directly** | partial (`premium_status`, not the canonical recompute) |
| **W3** | **Gift / access-code** `redeem_access_code_atomic` RPC (service_role; `a1/gift-redeem-fix` made it atomic + always-200) | `user_subscriptions`, `payment_transactions(status='completed')`, `access_code_redemptions` | **Yes** | **Yes** (only path that does) | via T2 *iff* `_col_exists`+`vip_key` resolve | **No — never reaches `profiles.premium_*`** |

**W3 is the gift-propagation gap** (task's "see B22"): a redeemed gift code
never writes the canonical `premium_status`/`premium_expires_at` pair. It is
visible to users **only** because the *read* side has a special gift fallback
(R-gift below). Remove that fallback and every gift redemption silently grants
nothing. *(No standalone B22 doc exists — see §Inconsistencies; reconstructed
from B27 §2 + RECON-tier-trigger §4 + `me-entitlement` code + `a1/gift-redeem-fix`.)*

**The B11 write-correctness fix (merged #770, in `origin/main`):**
`stripe-webhook/period-resolution.ts:getCurrentPeriodEnd` precedence was
`raw.period_end` **before** `getLinePeriodEnd(raw)`. On a
`billing_reason:"subscription_cycle"` renewal invoice, top-level `period_end`
is the boundary of the period that **just ended**; the new period is in
`lines.data[0].period.end`. So every monthly renewal wrote a *past*
`current_period_end` while the freshness marker (which reads `lines`) still
advanced → row "looked fresh", entitlement boundary already expired →
**paid-but-free for every renewer** (confirmed live: mylinh). Fix reorders to
mirror `deriveObjectTimeMs`: `current_period_end → items → lines → period_end`.
`getCurrentPeriodStart` deliberately **left unchanged** (symmetric START fix is
B26 / PR #773 OPEN).

---

## Evidence — Read paths (the "two", expanded)

**R-live (me-entitlement) — the gate the app actually calls, gift-aware:**
`useEntitlements`/`authService` → `me-entitlement/index.ts` →
`SELECT * FROM subscriptions WHERE user_id, app_id='mercy_blade'` →
`normalizeStatus`. Falls back to `fetchActiveGiftSubscription` (`user_subscriptions`,
`is_gift_redemption=true`, `current_period_end > now()`) — the **only** reader
anywhere that does a real expiry check. Does **not** read `profiles.tier`.

**R-stale (direct `profiles.*` reads — partially dead, mostly fixed by B25):**
- `get-subscription-status/index.ts:53` — `premium_status==='active'`, **no
  expiry re-check** (trusts what the webhook wrote).
- `_shared/billing.ts:95 toEntitlementResponse` — status ∈
  {active,trialing,grace_period,past_due}, **no expiry**.
- `azure-phoneme` / `mock-interview` — were the dead numeric `tier` reads;
  **B25 repoints these to `isPremiumEntitled`** (premium_status+expiry).
- `stories/eligibility.ts` (R1) — still stale `profiles.tier`, not yet fixed.

**B13's structural finding:** there are **FOUR status-only entitlement checks**
that gate on `status` without `current_period_end > now()` —
`isEntitlingSubscription` (the persisted-metric/MRR writer),
`me-entitlement normalizeStatus` (the live gate), `toEntitlementResponse`,
`get-subscription-status`. A lapsed `status='active'` row grants live premium
**and** counts toward MRR. Only the gift fallback checks expiry. No DB trigger
recomputes entitlement — projection is 100% app/edge code, so remediation must
re-run recompute, not lean on a trigger.

---

## ASCII diagram — write paths → store → read paths

```
 WRITE PATHS                          STORE (Supabase)                 READ PATHS
 ──────────                           ────────────────                 ──────────

 W1 Stripe webhook                ┌────────────────────────┐
   recomputeAndPersist ──────────►│ profiles.premium_status │◄── R-live  me-entitlement
   (period-resolution.ts,         │ profiles.premium_expires │     normalizeStatus  [status-only*]
    B11 #770 fixes period_end)    │   _at      (CANONICAL)  │       │  └─gift fallback:
                                  └────────────────────────┘       │     user_subscriptions
 W2 RevenueCat webhook  ──┬──────► profiles.tier  (TEXT cache)──┐   │     is_gift_redemption
   projection.ts          └──────► profiles.premium_status      │   │     +period_end>now() ✓ONLY
                                  ┌────────────────────────┐    │   │
 W1/W2 ──────────────────────────►│ subscriptions          │◄───┼───┘  (live access gate)
                                  │  status,current_period_│    │
                                  │  _end (status-only*)   │    ├── R-stale (no expiry recheck):
                                  └────────────────────────┘    │     get-subscription-status
                                  ┌────────────────────────┐    │     _shared/billing toEntitlement
 W3 Gift redeem (RPC) ───────────►│ user_subscriptions     │    │     stories/eligibility (R1, tier)
   redeem_access_code_atomic ────►│ payment_transactions   │    │
   (a1/gift-redeem-fix)           │ access_code_redemptions│    └── azure-phoneme / mock-interview
        │ AFTER INSERT/UPDATE     └───────────┬────────────┘         └─ B25 isPremiumEntitled
        ▼  status                             │ T2 fires ONLY here      (premium_status+expiry) ✓
   T2 trg_sync_profile_tier_from_payment ─────┘ → profiles.tier
        └─ DORMANT for W1/W2 (they never INSERT payment_transactions)
           => "paid but tier=level0" class; T2 binding = SQL-Editor drift,
              not in any tracked migration

 * "status-only" = grants on status without current_period_end>now()  (B13: 4 such readers)
 NOTE: W3 never writes the CANONICAL premium_* pair → gifts work ONLY via R-live's gift fallback
```

---

## Root cause (by CLAUDE.md layer)

**Data-shape + ownership**, not loading/rendering/permissions:
- *Ownership drift:* `profiles.tier` had a single intended owner (T2). The
  architecture moved to a derived `subscriptions → premium_status` model but
  never retired the old cache or its trigger → two entitlement signals that
  disagree by construction (B27 §4).
- *Data-shape:* (a) B11 — wrong Stripe period field written on renewals;
  (b) B17 — `profiles.tier` is TEXT, read as numeric ⇒ paid bypasses dead.
- *Path coverage gap:* T2 is bound to `payment_transactions`, which the two
  real-money paths (Stripe, RevenueCat) never INSERT ⇒ T2 dormant-by-table-
  mismatch for ~all paying users; gift path is its only trigger.
- *Silent by design:* recompute failure is `console.warn`-swallowed
  (`billing.ts:587`); the four status-only readers throw no exception when they
  grant a lapsed row. Only state-level queries (B7/B30) catch these.

---

## Impact

- **Confirmed real money/trust harm:** `mylinh.nutrition@gmail.com`
  (`cd9b889c…`) — paid through ≈2026-06-08, no premium as of 2026-05-19
  (B5/B30 Q4).
- **B30 prod validation (2026-05-19 snapshot):** 3 phantom-MRR subs still live
  (A94 cleanup SQL **unapplied**); **NOVEL P1** — Stripe price
  `price_1TCKSF2K1tPxy04uNeKcQWp5` absent from `billing_price_map`, **≥2 real
  paying subscribers (valid to 2027) counted as 0 MRR** — the #700
  MRR-undercount class, **live right now** (B42 owns the SQL-Editor fix).
- **Class blast radius:** every renewing Stripe subscriber was exposed to the
  B11 bug pre-#770; every gift redeemer depends on one read-side fallback;
  every paid-after-trial user hit the B17 dead server gates pre-B25.
- Severity: **high** — money-path, user-visible, silent (no exception).

---

## Known gaps (open, not closed by tonight's fixes)

1. **W3 gift → canonical `profiles.premium_*` never written.** Gifts survive
   only via R-live's `user_subscriptions` fallback. No standalone B22 recon
   exists — topic still un-investigated as a first-class doc.
2. **T2 dormant + untracked.** Binding (`trg_sync_profile_tier_from_payment`,
   `AFTER INSERT OR UPDATE OF status`) and `_col_exists` are SQL-Editor drift,
   in no tracked migration. B27 recommends **retire T2** (tombstone migration,
   Chau via SQL Editor) + keep T1 freeze trigger untouched.
3. **B13 family-of-4 status-only readers** still grant lapsed `active` rows;
   me-entitlement is not yet the single source of truth (Phase 3, HOLD).
4. **R1 `stories/eligibility.ts`** still on stale numeric `profiles.tier`
   (RECON-tier-trigger §6 PR1 — not shipped).
5. **period_end backfill for historical bad rows:** A94 stale-sub cleanup SQL
   **unapplied**; B5's mylinh remediation SQL **not on disk** (lost — must be
   recovered from the chat transcript or regenerated under human review; no
   unattended SQL path to this Supabase).
6. **#700 price-map drift LIVE** (B30 Q5a) — add missing
   `price_1TCKSF2K1tPxy04uNeKcQWp5` row (B42, Chau SQL Editor).
7. **B26 symmetric period_START fix** open (PR #773) — B11 fixed END only.
8. **Monitoring not yet built** — B7's 5-query `money_path_anomaly_scan()` +
   `money_path_anomalies` table is scoped, B30-validated, awaiting Chau go
   (2 predicate refinements locked: Q3b `+ provider_subscription_id is not
   null`; Q4 `event_type = 'invoice.paid'`).

---

## Fix recommendation — sequencing for full healing

| # | Step | Owner / status |
|---|---|---|
| 1 | **B11 period_end field-order fix** — new renewals stop writing stale `current_period_end` | ✅ **shipped** (PR #770, in `origin/main`) |
| 2 | **B26 symmetric period_start fix** | PR #773 **OPEN** — review/merge |
| 3 | **A94 stale-sub cleanup SQL** (3 phantom subs incl. mylinh) | **Chau action**, SQL Editor — *not yet applied* (B30-confirmed) |
| 4 | **B5 mylinh remediation SQL** (re-pull/recompute her sub → re-grant premium) | **Chau action** — SQL lost; recover from transcript or B12-regenerate under review |
| 5 | **B42 price-map row add** (`price_1TCKSF…`, #700 class P1 live) | **Chau action**, SQL Editor — `RUNBOOK-price-map-row-B42.md` |
| 6 | **B25 server-gate SSOT** (`premiumEntitlement.ts`; azure-phoneme + mock-interview) | PR #774 **OPEN** — review/merge *(NOT shipped — see §Inconsistencies)* |
| 7 | **B13 Phase 3** — family-of-4 expiry+grace fix; make me-entitlement the SSOT | **queued**, HOLD for Chau go **and** P3.G1–G3 == 0 |
| 8 | **B27 scoped-B** — keep T1, retire T2 (tombstone, Chau SQL Editor), delete B25's numeric `tier>=N` bypass, fix R1 | **queued** — spec is RECON-profile-trigger-architecture-B27 §5 |
| 9 | **B7 money-path monitoring** — `money_path_anomaly_scan()` + table + alert (4 PRs) | **queued**, awaiting Chau go |
| 10 | **Architectural cleanup of stale caches (Option C)** — every remaining `profiles.tier` reader → entitlement; de-dup dead `src/billing/*`; make recompute failure loud | **next-next session** — phased, money-path, do not big-bang |

Discipline: each step is the smallest safe diff; payments-table DDL never rides
with app edits (CLAUDE.md "small diffs", "central files dangerous", "restore
before redesign"). Steps 3–5 have **no unattended SQL path** — Chau-applied,
human-reviewed only.

---

## Inconsistencies between source agents (require follow-up)

1. **Task premise vs reality — B25 is NOT shipped.** The dispatch lists
   "B25 (✓ shipped)". B25's `premiumEntitlement.ts` is **not in `origin/main`**;
   B32's agent inventory marks PR #774 **OPEN / HARD-BLOCKED**. The sequencing
   above corrects this to "review/merge". *Action: merge #774 before treating
   the server-gate SSOT as real.*
2. **B22 produced nothing.** Both B32 (agent inventory) and B41 (next-session
   primer) record `b22/gift-propagation-gap` as branch-only, no worktree, no
   commit, no recon — "never produced". The task lists "B22's gift-propagation
   recon" as a source; it does not exist. Gift-propagation gap here is
   reconstructed from B27 §2 + RECON-tier-trigger §4 + `me-entitlement` code +
   `a1/gift-redeem-fix`. *Action: a real B22-class recon (does W3 ever need to
   write canonical `premium_*`, or is the read fallback the intended design?)
   is still owed.*
3. **B17 has no standalone doc.** B32 marks it CLOSED/superseded — its
   tier-gating audit is embedded in B25's `premiumEntitlement.ts` header and
   independently corroborated by RECON-tier-trigger §4 (both gates type-broken;
   `profiles.tier` TEXT). Consistent in conclusion; just no first-class artifact.
4. **B27 vs RECON-tier-trigger.md on T2 binding verifiability.** B27 (2026-05-19)
   states the T2 binding's enabled/disabled state is "catalog-only —
   unverifiable by an agent" and describes it as `AFTER INSERT`. The older
   RECON-tier-trigger.md (2026-05-17) **did verify it** via
   `supabase db dump --linked` (line 17693): binding is live and broader —
   `AFTER INSERT OR UPDATE OF status`. **Reconcile:** the binding *is*
   confirmed-live (one-time db-dump, before the policy that removed agents'
   catalog access); B27's "dormant" means dormant-**by-table-mismatch** (never
   fires for Stripe/RevenueCat), not dormant-by-disabled. Both agree T2 never
   propagates `profiles.tier` for paying users. Use the §4 `pg_trigger` SQL
   (Chau) only to confirm it has not changed since 2026-05-17.
5. **B5 evidence is a B24 retroactive reconstruction**, not B5's live output
   (raw transcript lost; rebuilt from on-disk probe scripts; no prod re-query).
   Subscription status, the exact denying reader, and the remediation SQL are
   marked NOT RECOVERABLE — do not infer them from this map.

---

## Worktree disposition

`prune` — findings are fully captured here; this is a synthesis doc, no live
state to preserve. The sibling worktrees this draws on have their own
dispositions (B27 `keep` as scoped-B spec; B5 `prune`; B7/B13 specs for queued
dispatches). This doc supersedes nothing — it is the index a future contributor
reads first to know *which* of the seven recon docs answers their question, and
the gap/sequencing tables are the live status. Re-open only when steps 6–10
land, to add `> SUPERSEDED` banners per B16 lifecycle.
