# RECON — `currency_code` / `billing_interval` data-quality fix scope (A32)

> **Scoping only. NO code, NO migration, NO PR.** Resolves "how do we fix the
> currency/interval data-quality gap" given A20's correction to A8: these
> columns are **declared, written-as-null, and read by the admin dashboard
> view** — a data-quality gap, *not* a drop candidate.
>
> Branch: `a32/currency-interval-fix-scope` off `origin/main` @ `4fbc3a41f`
> Date: 2026-05-19 · Labels: `money-path`, `data-quality`, `silent-failure`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Cross-refs (quotable): `RECON-mrr-source-D4-A8.md` (branch
> `b69/d4-mrr-source-strategic` @ `499967d23`); A20's correction to A8.
> **Grounded in live source reads in this worktree**, every claim verified
> against the file/line cited — not inferred from the sibling recons.

---

## TL;DR

- **3 writers of `subscriptions`**: `stripe-webhook` (insert+update via one
  pure mapper), `revenuecat-webhook` (projection), `billing-google-attach-purchase`.
  **None of the three writes `currency_code` / `billing_interval` /
  `billing_interval_count`.** (A 4th candidate, `billing-stripe-change-plan`,
  is *not* a writer — it only SELECTs then defers the row write back through
  `stripe-webhook`.)
- The reader is **`public.admin_users_dashboard_v1`** +
  `admin_users_dashboard_kpis_v1()` (the admin "Estimated MRR/ARR" KPI).
  It has a **raw_payload soft-fallback** for currency & interval, so the gap is
  **latent for the KPI on the Stripe path** but **MRR-visible-and-broken on the
  Google path** (Google never persists `raw_payload` either → 0 MRR + anomaly
  flags on real paying subs).
- **Recommended: 3 separate PRs (one per writer)** + one Chau-applied backfill
  SQL on the Stripe PR. Different risk, different source-of-truth, different
  test surface.
- **Couples to D4: YES, hard.** A8's chosen end-state **(b2)** is *literally*
  "populate the dead `currency_code`/`billing_interval`/`billing_interval_count`
  on every webhook write + one-shot backfill from `raw_payload`." This A32 fix
  **is the writer-side half of D4 (b2)** — it should ship *as* the first
  concrete step of D4, not as an independent patch, and inherits A8
  flip-condition #4's pre-backfill check.

---

## The reader (why this is a gap, not dead schema — confirms A20)

`supabase/sql/admin_users_dashboard_v1.sql` — `subscription_base` CTE reads the
columns directly **then soft-falls-back to `raw_payload`**:

```sql
-- :28-33  plan_interval
coalesce(nullif(s.billing_interval,''),
         s.raw_payload->'plan'->>'interval',
         s.raw_payload->'items'->'data'->0->'price'->'recurring'->>'interval',
         'unknown')
-- :34-41  normalized_currency_code
upper(coalesce(nullif(s.currency_code,''),
               s.raw_payload->>'currency',
               s.raw_payload->'plan'->>'currency',
               'USD'))
-- :42-46  amount_cents  (NO column — raw_payload only)
coalesce((s.raw_payload->'plan'->>'amount')::numeric,
         (s.raw_payload->'items'->'data'->0->'price'->>'unit_amount')::numeric,
         0)::bigint
```

`admin_users_dashboard_kpis_v1()` (:139-167) sums `estimated_mrr`/`estimated_arr`
**only where `plan_interval IN ('month','year')`**; `'unknown'` → 0. A row with
`amount_cents = 0` also raises the `unknown_amount` anomaly flag (:71, :104) and
`'unknown'` interval raises `unknown_plan` (:70, :103) — so a broken writer
doesn't just under-count MRR, it **surfaces real paying subscribers as
anomalies in the admin users table**.

Net: the columns are a live read path with a JSON safety net. **Confirms A20**:
data-quality gap, not a drop candidate. (Note: the *other* MRR view
`billing_mrr_inputs_v` takes currency/interval from `billing_price_map`, not
these columns — that path is D4/A8's subject, orthogonal to A32's writer fix.)

---

## Per-writer current state (code-verified)

| Writer | File:line | `currency_code` | `billing_interval` / `_count` | `raw_payload` | KPI impact today |
|---|---|---|---|---|---|
| **Stripe** insert+update | `stripe-webhook/subscription-insert.ts:50-81` (`mapStripeSubscription`), called by `billing.ts:657` (both create & update paths) | ❌ never set | ❌ never set | ✅ full Stripe payload | **Correct via fallback** (raw_payload has interval/currency/amount). Columns empty = brittle, not broken. |
| **Google attach** | `billing-google-attach-purchase/index.ts:353-356` | ❌ hardcoded `null` | ❌ hardcoded `null` | ❌ **never written** (Google purchase goes to `provider_metadata.rawPurchase` :368, not `raw_payload`) | **Broken**: fallback finds nothing → `plan_interval='unknown'`, currency→`'USD'` default, `amount_cents=0` → 0 MRR + `unknown_plan`+`unknown_amount` flags on every real Google sub. |
| **RevenueCat** projection | `revenuecat-webhook/projection.ts:65-83` | ❌ never set | ❌ never set | ❌ never written | **Broken but latent**: 0 MRR (web-only today ⇒ ≈0 RC subs; goes live on store launch). Hardcodes `provider:"apple"` even for Play. |

---

## Per-writer source-of-truth field

### Stripe — fully available, already parsed elsewhere
The Stripe price object is already in scope in `core.ts:563-574` (`derivePlanDetails`
reads `subscription.items.data[0].price` / `invoice.lines.data[0].price`), used
today **only** to build a display string. The fields:

- `currency_code` ← `price.currency` (subscription/invoice price; Stripe sub
  also carries top-level `currency`).
- `billing_interval` ← `price.recurring.interval`
- `billing_interval_count` ← `price.recurring.interval_count`
- (amount, for D4 b2) ← `price.unit_amount`

All four are **already persisted in `raw_payload`** (A8 §"What is persisted",
B42 confirmed all 3 yearly subs byte-identical here). Zero new external calls.

### Google attach — **no native price/currency source exists**
`GoogleSubscriptionPurchaseV2` (the `purchases.subscriptionsv2` API this
function calls, `index.ts:203-225`) returns **no price and no currency** — only
`lineItems[].{productId, expiryTime, offerDetails.basePlanId/offerId,
autoRenewingPlan}` and `startTime`. Therefore:

- `billing_interval` — **inferable**, not given: from `offerDetails.basePlanId`
  string convention, or period math (`expiryTime − startTime` on the line item).
- `billing_interval_count` — from the same period math.
- `currency_code` — **not derivable from any data this function fetches or
  stores.** Requires either the Play *monetization* API
  (`monetization.subscriptions.get` keyed by package + product + basePlan) or
  RTDN price fields — a materially larger scope than a mapper tweak.

### RevenueCat — available on the event, currently discarded
`RcEvent` (`revenuecat-webhook/types.ts:32-33`) carries `price?: number` and
`currency?: string`; the projection discards both. Interval is **inferable**
from `product_id` — the file already maps `mercy.premium.monthly` /
`.yearly` via `productIdToTier()` (`projection.ts:33-37`).

- `currency_code` ← `event.currency`
- `billing_interval` ← derive from `product_id` (`monthly`→`month`,
  `yearly`→`year`); `_count` = 1.
- (amount, for D4 b2) ← `event.price`

---

## Backfill strategy for existing rows

| Provider | Backfillable from DB? | Strategy |
|---|---|---|
| **Stripe** | ✅ Yes — `raw_payload` already holds it | One-shot **Chau-applied SQL** (SQL Editor; **no unattended catalog path** per memory) `UPDATE … SET billing_interval = raw_payload#>>'{items,data,0,price,recurring,interval}'`, etc. No Stripe API refetch. **Gated on A8 flip-condition #4**: re-run A8's pre-commit completeness query first (`count where status in (active,trialing,past_due) and provider='stripe' and raw_payload#>'{items,data,0,price,unit_amount}' is null` — expect 0; non-zero ⇒ Stripe API refetch for the gap rows only). |
| **Google** | ❌ No price/currency stored anywhere; `provider_metadata.rawPurchase` has period (interval recoverable) but never currency | **Forward-only.** Interval *could* be backfilled from `provider_metadata.activeLineItem` period math; currency cannot. In practice ≈0 existing Google rows (pre-store-launch) → treat as N/A, fix forward. |
| **RevenueCat** | ❌ Neither `raw_payload` nor the RcEvent is stored | **Forward-only.** ≈0 existing RC rows today. |

---

## Recommended PR scope — **3 PRs, one per writer**

Not one combined PR: the three writers have different risk, different
source-of-truth difficulty, and different test surfaces. Money-path ⇒
"small diffs over smart diffs" (CLAUDE.md). Priority order:

1. **PR-1 — Stripe (ship first; highest value, lowest risk).**
   Thread `currency_code` / `billing_interval` / `billing_interval_count` into
   `mapStripeSubscription` from the Stripe price object already parsed by
   `derivePlanDetails`. `subscription-insert.ts` is deliberately pure +
   vitest-covered → deterministic unit test, small diff, covers both
   insert & update (single mapper). **+ the one-shot Chau-applied backfill SQL**
   (with the A8 #4 pre-check). Independent; valuable now (hardens the live KPI
   column contract even though the fallback masks it today).

2. **PR-2 — Google attach.** Populate `billing_interval`/`_count` from line-item
   period (or `basePlanId`); **also persist a Stripe-shaped `raw_payload`** (or
   the normalized columns) so the dashboard fallback can engage. **Defer
   `currency_code`** to a tracked follow-up (needs the Play monetization API —
   out of scope for a writer-mapper fix; flag it, don't bundle it). Forward-only.

3. **PR-3 — RevenueCat projection.** Persist `currency_code` ← `event.currency`,
   `billing_interval` ← product-id map, (for b2) amount ← `event.price`.
   Forward-only. **Coupling alert:** A8 §"Cross-cutting" independently
   recommends a RevenueCat projection change for the same reason — PR-3 **is**
   that change; do not double-dispatch it under both A32 and a D4 ticket.

---

## Couples to D4 (retire `billing_price_map`)? — **Yes, structurally**

A8's verdict is end-state **(b2)**, defined verbatim as: *"Add `unit_amount_minor`
and finally populate the dead `currency_code` / `billing_interval` /
`billing_interval_count` on every webhook write; one-shot backfill historical
rows from `raw_payload`."* (`RECON-mrr-source-D4-A8.md:149-153`.)

That is **exactly A32's three PRs plus an amount column**. Consequences:

- **A32 is the writer-side half of D4 (b2)**, not an independent data-quality
  patch. The PR-1 Stripe extractor is the *same* extractor (b2) needs; A8
  explicitly says it should be "written once, against a durable column (b2),
  not against a side table scheduled for deletion" (`:264-266`). Building it in
  A32 satisfies that.
- **These columns become the new MRR source under A8's chosen end-state.** The
  residual D4-b2 delta on top of A32 = (i) add `unit_amount_minor`, (ii)
  zero-decimal-currency `CASE`, (iii) rewrite `billing_mrr_inputs_v` off
  `billing_price_map`. A32 unblocks those; it does not deliver them.
- **Sequencing:** per A8 §Recommendation 4, the b2 workstream slots into
  **B48-P2**, *after* B48-P1 (single `deriveEntitlement`). A32 inherits that
  gate — schedule A32's PRs inside the D4-b2 / B48-P2 workstream, not ahead of
  P1. (B42's one-row INSERT + #700 cleanup remain the parallel P0; unaffected.)
- **Inherited pre-commit gate:** A32's Stripe backfill must re-confirm A8
  flip-condition #4 (`raw_payload` completeness on historical Stripe rows)
  before applying — same read-only query, Chau-run.

**Recommendation: do not dispatch A32 as a standalone data-quality fix.**
Fold it into the D4-(b2) implementation as its phase-1 (the writer fills +
Stripe backfill), gated behind B48-P1, with the amount column + view rewrite as
phase-2.

---

## Worktree disposition

**`prune` — scope fully captured here. No code, no follow-up worktree.** This
file is the go/no-go scoping input for the D4-(b2) implementation dispatch:
recommendation is *fold into D4-b2, 3 PRs, Stripe first, RC PR is A8's
cross-cutting fix (don't double-dispatch), Google currency deferred behind the
Play monetization API.*

---

*A32 — read-only scoping. No DB writes, no code, no PR. Branch
`a32/currency-interval-fix-scope`. Operator artifact.*
