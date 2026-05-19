# RECON — RevenueCat MRR projection: scoping the `projection.ts` price/currency drop (A21)

> **Scope-only. NO code, NO migration, NO PR.** Decides *what* the fix is,
> *where* it goes, and *whether it can ship independently of D4*. Does not
> write it.
>
> Branch: `a21/revenuecat-mrr-projection-scope` off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Labels: `silent-failure`, `money-path`, `scope`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Cross-refs: `RECON-mrr-source-D4-A8.md` (A8, branch `b69/d4-mrr-source-strategic`,
> **not on main** — quoted below so this doc stands alone),
> `RECON-billing-target-state-B48.md` §D4, A5 `RECON-entitlements-table-schema-A5.md`.
> All column/call claims verified against the worktree source, not inferred.

---

## TL;DR

The projection.ts patch *itself* is small (~4 h, ~20 LOC + ~30 test LOC, the
test harness already supports it). **But shipping it alone moves MRR by
exactly £0** — the live MRR view reads a `billing_price_map` join keyed by a
Stripe price id RevenueCat rows don't have, so persisted RevenueCat
price/currency would land in a column nothing reads. The *useful* unit of
work is A8's D4 end-state **(b2)** — add a normalized amount column, rewrite
the MRR view, backfill Stripe — and the RevenueCat projection patch is **one
sub-task inside it**, not a standalone webhook fix. **Hard-gated on the D4
decision; only viable if D4 = retire the map.**

---

## 1. Exactly where price/currency is dropped (code-verified)

`supabase/functions/revenuecat-webhook/types.ts:32-33` **declares** the
fields:

```ts
export type RcEvent = {
  …
  price?: number;       // line 32
  currency?: string;    // line 33
};
```

`supabase/functions/revenuecat-webhook/projection.ts` **never reads them.**
`handleEvent` destructures `type`, `product_id`, transaction ids,
`expiration_at_ms`, `environment` (lines 44-52) — `event.price` and
`event.currency` are never referenced anywhere in the file. The grant-path
`subRow` (lines 65-83) that gets `upsert`ed into `subscriptions` has **no
amount, no currency, no interval, and no `raw_payload`**:

```
subRow keys (projection.ts:65-83): app_id, user_id, customer_id,
  subscription_id, provider("apple", hardcoded — even for Google),
  provider_subscription_id, provider_original_transaction_id,
  provider_product_id, product_id, tier, status, environment,
  current_period_end, current_period_end_at, cancel_at_period_end,
  canceled_at, ended_at
```

The drop is **total**: not a mis-mapping, the economic fields are simply
absent from the only write that touches `subscriptions`. The data arrives in
the RcEvent and is discarded before it touches the DB. (A8 §Cross-cutting
independently reached the same finding.)

## 2. What RevenueCat actually sends for Apple/Google subs

The single live Apple/Google → `subscriptions` projection path **is**
`revenuecat-webhook` (`provider:"apple"` hardcoded at projection.ts:70 even
for Google — a separate A8-flagged bug, **out of scope here**). Verified the
sibling functions are *not* a second projection path:

- `apple-webhook/index.ts` and `google-webhook/index.ts` only call
  `registerProviderEvent` → `register_billing_provider_event` RPC
  (`_billing/provider-events.ts:18`). That writes a raw **event-audit** row
  (`is_new`/`delivery_count`/`process_status`) — it does **not** write
  `subscriptions` and feeds nothing in the MRR path. They are an
  inbound dedup/audit log, not a projector.

So MRR for every store sub depends solely on revenuecat-webhook's RcEvent.
RevenueCat v2 sends more than the typed subset. **MRR-relevant fields:**

| RcEvent field | In `types.ts`? | Meaning | MRR use |
|---|---|---|---|
| `price` | ✅ (`:32`) | **USD-normalized** amount RevenueCat estimates (2-decimal float, e.g. `9.99`) | **primary MRR amount** |
| `currency` | ✅ (`:33`) | ISO code of the *local purchase* currency — currency of `price_in_purchased_currency`, **NOT of `price`** | ⚠️ trap (see §3) |
| `price_in_purchased_currency` | ❌ not typed | amount charged in the store/local currency | alt amount (needs FX) |
| `period_type` | ❌ not typed | `TRIAL`/`INTRO`/`NORMAL`/`PROMOTIONAL` — trial/intro carry `price:0` | filter / 0-MRR |
| `store` | ❌ not typed | `APP_STORE`/`PLAY_STORE`/… — would fix the hardcoded-`apple` bug | out of scope |
| `takehome_percentage` | ❌ not typed | post-store-commission fraction | net-MRR only (not needed for "Estimated" gross) |

Interval is **not** an RcEvent field but is derivable for free from the
product id: `IAP_PRODUCT_MONTHLY` (`mercy.premium.monthly`) → `month`,
`IAP_PRODUCT_YEARLY` (`mercy.premium.yearly`) → `year`, count = 1
(`projection.ts:21-22`, already in scope as `productIdToTier`).

## 3. Two correctness traps the fix MUST resolve (not optional)

1. **`price` and `currency` are different currencies.** RevenueCat `price`
   is USD-normalized; `currency` is the *local* purchase currency (the
   currency of `price_in_purchased_currency`). Persisting `(price, currency)`
   as a pair mislabels a USD amount as e.g. VND. **Decision required:** the
   MRR-safe choice for a gross "Estimated MRR" KPI is to persist `price`
   with a literal `'USD'` (matches what RevenueCat itself reports as
   revenue), *not* `event.currency`. Persisting `price_in_purchased_currency`
   + `currency` instead would require an FX table the app does not have.
2. **`price` is major-unit float; Stripe is minor-unit integer.** If (b2)
   standardizes on an integer `unit_amount_minor` like Stripe's
   `unit_amount`, RevenueCat's `9.99` must become `999` via
   `Math.round(price*100)`. That ×100 is correct *only because the chosen
   field is USD* (2-decimal). This is the same zero-decimal class A8 flagged
   in `core.ts:221 formatMoney` (`minor/100` unconditional). Standardizing on
   USD-normalized `price` sidesteps it; persisting local currency would
   re-import the VND/JPY/KRW zero-decimal bug onto the RevenueCat path.

Trial/intro events carry `price:0` — correct: a free trial *is* £0 MRR until
the `RENEWAL` event carries the real recurring price. The existing
`upsert(..., { onConflict:"subscription_id" })` is last-write-wins, so
RENEWAL naturally overwrites the trial's 0 with the real amount. No extra
state machine needed.

## 4. The fix spec (assuming D4 = retire the map → A8 (b2))

**Fields projection.ts should persist on the grant-path `subRow`** (the
`INITIAL_PURCHASE`/`RENEWAL`/`PRODUCT_CHANGE`/`NON_RENEWING_PURCHASE` branch,
projection.ts:57-101):

| New `subRow` field | Source | Notes |
|---|---|---|
| `unit_amount_minor` (NEW column, b2) | `Math.round((event.price ?? 0) * 100)` | USD minor units |
| `currency_code` (DEAD col, exists) | literal `'USD'` | per §3.1 — *not* `event.currency` |
| `billing_interval` (DEAD col, exists) | product id → `'month'`/`'year'` | CHECK ∈ day/week/month/year (mig 20260319000000) |
| `billing_interval_count` (DEAD col, exists) | `1` | CHECK > 0 |
| `raw_payload` (col exists, RC never writes it) | the full RcEvent | audit parity with Stripe; **not** the MRR source — the columns are |

**Where they go:** the same `subscriptions` row already upserted at
projection.ts:85-88 — five extra keys on the existing `subRow` object, no new
write, no new round-trip.

**How the MRR aggregator reads them:** it cannot today. The live view
(`billing_mrr_inputs_v`, migration `20260403000000`) is
`subscriptions LEFT JOIN billing_price_map ON (provider, provider_price_id)
WHERE status IN (active,trialing,past_due)` → `Σ mapped_monthly_amount`
(A8: `admin-billing-metrics/index.ts:226`). RevenueCat rows have
`provider_price_id = NULL` and there are no `apple`/`google` price_map rows,
so the join is NULL → £0. **The view must be rewritten** (b2) to read
`unit_amount_minor`/`currency_code`/`billing_interval` off the row directly
(`CASE billing_interval WHEN 'year' THEN amount/12 ELSE amount END`,
zero-decimal `CASE`) for *all three* providers. The projection patch is
inert until that rewrite + the column exist.

## 5. Step-7 answer: same columns for all 3 providers — NOT raw_payload, NOT separate columns

The question's premise ("same columns as Stripe subs in raw_payload")
contains a false assumption worth correcting: **Stripe does not use columns.**
`mapStripeSubscription` (`stripe-webhook/subscription-insert.ts:50-81`)
persists `raw_payload` (carrying `price.unit_amount/currency/recurring.interval`)
and `provider_price_id`, and writes **no** `currency_code`/`billing_interval`/
amount column — those are dead schema for Stripe too. Stripe's economics are
surfaced only via the `billing_price_map` join on `provider_price_id`.

Three shapes were considered:

- **R1 — mirror Stripe (raw_payload + JSON-extract in the view):** persist
  the RcEvent as `raw_payload`, JSON-extract in the view. Rejected:
  RevenueCat's payload shape ≠ Stripe's, so the view needs provider-branched
  JSON paths; this is A8's variant (b1), which A8 explicitly recommends
  *against* in favor of (b2).
- **R2 — separate RevenueCat-only amount columns:** rejected — fragments the
  MRR view into per-provider math and duplicates the zero-decimal logic.
- **R3 — one normalized amount model for all 3 (= A8 (b2)) — RECOMMENDED:**
  reuse the existing dead `currency_code`/`billing_interval`/
  `billing_interval_count` columns + one NEW `unit_amount_minor`. Stripe
  backfills these from `raw_payload`; Apple/Google fill them from the RcEvent
  the projection currently discards. The view reads columns, no provider
  branch, no price_map for store subs. RevenueCat *additionally* writes
  `raw_payload` for audit parity (cheap, one field) — but the **columns are
  the MRR source, raw_payload is the audit copy.**

**Answer: same normalized columns across all three providers (A8 b2).** Not
raw_payload-JSON-extract, not separate columns. raw_payload should also be
persisted for RevenueCat (it currently isn't) purely for audit/re-derivation
parity with Stripe.

## 6. Complexity & dependency

**The projection.ts delta in isolation — small, ~4 h:**
- ~20 prod LOC: read `event.price`; `Math.round(price*100)`; derive interval
  from product id; add 5 keys to `subRow`; persist `raw_payload`.
- ~30 test LOC: `projection.test.ts` already has a recording fake client and
  a `purchaseEvent` factory (`:103`) — extend the factory with `price`,
  add `toMatchObject` assertions on the 5 new keys to the existing
  `handleEvent — grant paths` `it.each`. No new harness.
- `deno check` + the existing vitest suite already gate this function.

**But it is NOT independently shippable.** Useful only as part of A8's (b2):
1. Schema migration: add `unit_amount_minor` to `subscriptions` (NO such
   column exists anywhere — verified against both DDL migrations
   `20260315211233` + `20260319000000`; `currency_code`/`billing_interval`/
   `billing_interval_count` exist but are dead). **Chau-applied via SQL
   Editor — no unattended catalog path to this DB** (per memory).
2. One-shot Stripe backfill from `raw_payload` (gated on A8 flip-condition
   #4: `raw_payload` completeness on historical Stripe rows — Chau's
   read-only count query, run *before* the migration).
3. View rewrite (`billing_mrr_inputs_v`) — Chau-hand-applied (migration-drift
   hazard: two historical defs of this view, A8 §migration-drift).
4. The projection.ts patch (this doc's §4).

**Net: multi-day, schema-coupled, Chau-gated — not a 4-hour webhook patch.**
The 4-hour figure is real but it's the *cheapest* item in a workstream whose
critical path is the migration + view + backfill.

**Dependency on the D4 decision (hard gate):**

| D4 outcome | RevenueCat projection fix |
|---|---|
| **retire the map → (b2)** (A8's recommendation, 0.7 conf) | proceed — fold §4 into the (b2) implementation PR(s); slots into **B48-P2**, *after* P1 (single `deriveEntitlement`). |
| **keep the map → (a)** | **do NOT ship §4** — there is no `apple`/`google` price_map curation surface and the B42 RUNBOOK is Stripe-only; persisting the amount writes to a column the (a) view never reads. Would require inventing a *second* curation surface (A8: "leaves RevenueCat permanently unmappable"). |
| **D4 undecided** | **blocked.** Dispatching this as a standalone webhook patch now produces persisted-but-unread data and a false "fixed" signal. |

## 7. Scope decision

1. **Do not dispatch the projection.ts fix as a standalone webhook patch.**
   It is a sub-task of A8 D4 end-state (b2), not an independent bug fix. On
   its own it moves MRR by £0 and creates a false-green.
2. **Hard-gate on D4 = retire-the-map.** If D4 lands on keep-the-map, this
   fix is *not viable* without a new Apple/Google curation surface — a
   strictly larger scope this doc does not cover.
3. **When (b2) is approved, fold §4 in as one item of that PR series,**
   sequenced into B48-P2 after P1. Spec is frozen in §4 (USD-normalized
   `price`, literal `'USD'`, interval from product id, +`raw_payload`).
4. **Resolve §3.1 explicitly before coding:** confirm gross USD "Estimated
   MRR" is acceptable (the KPI is already labeled "Estimated") so the
   `price`+`'USD'` choice stands. If net-of-commission MRR is required
   (`takehome_percentage`), that is A8 flip-condition #1 and escalates past
   this scope into an invoice/`billing_facts` model.
5. **Complexity estimate:** projection.ts delta = ~4 h / ~50 LOC total;
   *deliverable* unit (b2 incl. this) = **multi-day, schema-coupled,
   Chau-applied migration**, not a webhook-only patch.

---

## Worktree disposition

**`prune` — scope fully captured in this committed doc.** No code, no
follow-up worktree. This file is the go/no-go input for whether the
RevenueCat projection fix is dispatched: **no-go until D4 is decided = retire
the map; then it ships as part of the (b2) workstream, never standalone.**

---

*A21 — read-only scope. No DB writes. No code. No PR. Branch
`a21/revenuecat-mrr-projection-scope`. Depends on the D4 decision
(`RECON-mrr-source-D4-A8.md`, A8) and B48-P1.*
