# RECON — `billing_price_map` auto-upsert design proposal (B52)

> **Scoping dispatch. NO code.** Produces a fix design for the architectural
> root cause B42 §6.3 surfaced: **no code path keeps `billing_price_map`
> current.** This is the concrete engineering answer to B48's strategic
> decision **D4** (MRR source: hand-maintained map vs. trust Stripe amounts).
>
> Branch: `b52/price-map-autoupsert-scoping` off `origin/main` @ `5cfa27e3f`
> Date: 2026-05-19 · Labels: `silent-failure`, `money-path`
> Convention: B16 (`reports/RECON-<topic>-<agent>.md`, commit-don't-PR)
> Cross-refs (committed, quotable): `RUNBOOK-price-map-row-B42.md`,
> `RECON-billing-target-state-B48.md` (D4), `RECON-billing-architecture-as-built-B45.md`.

---

## Verdict

`billing_price_map` is written by **exactly one thing**: the seed in
`supabase/migrations/20260403000000_billing_price_map.sql`, which runs once
and never again against drifted live prod. The `stripe-webhook` edge function
receives the **full Stripe `price` object on every price-bearing event** and
already extracts `price.id` + `price.product` from it (`getPriceId`,
`getProductId` in `webhook-events.ts`) — it just **throws the economic fields
away**. Every new Stripe price silently repeats the B42/#700 failure until a
write path exists.

**Recommendation: Option A, in its fill-gap (`ON CONFLICT DO NOTHING`)
variant** — the webhook self-heals missing map rows from price data it
already parses, without ever fighting Chau's hand-curated rows. ~60–80 LOC
production, additive, best-effort (cannot break the money path). It is
correct regardless of how B48-D4 later resolves: if D4 kills the map, this
code is deleted with it (low sunk cost); until then, it stops the bleed.

---

## What is actually broken (root cause, by layer)

| Layer | Finding |
|---|---|
| **Write** | `billing_price_map` has **one writer**: the 20260403 seed migration. `stripe-webhook` ingests subscriptions but **never upserts a map row**. No reconcile job. (B42 §6.3) |
| **Data shape** | Map row needs `monthly_amount`/`yearly_amount` **MRR-normalized** (yearly → `monthly_amount = unit_amount/12`, `yearly_amount = unit_amount` — encoded only in the seed's `notes`, nowhere in code). Stripe sends the *raw charge*, not the normalized figure. |
| **External** | MRR correctness depends on a hand-curated table that Stripe price-id churn silently invalidates. 2nd occurrence (#700 → B42). |
| **Silent failure** | A missing row → `billing_mrr_inputs_v` LEFT JOIN yields `NULL` → sub counts as **0 MRR**. No error, no log, no alert. |

**Blast radius is reporting-only.** The *only* runtime reader of the map is
`billing_mrr_inputs_v` → consumed by **one** edge function,
`admin-billing-metrics` (`index.ts:187`). `delete-account` skips the view;
entitlement derives from `subscriptions.status`, **never** the map. So a
missing row = **admin MRR dashboard silently under-reports revenue**; zero
user-facing, zero entitlement, zero access impact. This is a *money-visibility
integrity* bug, not a revenue-loss or paywall bug — severity framing matters
for sequencing (it is real, but it does not block users or lose entitlement).

---

## What Stripe sends, per event type (authoritative)

`webhook-events.ts` already navigates exactly these paths (`getFirstSubscriptionItem`,
`getFirstLine`, `getPriceId`, `getProductId`). The economic fields sit on the
**same `price` object** those helpers already reach — they are read for `id`
and `product` and then discarded.

| Event type | Price object location | Carries id+product? | Carries currency / unit_amount / interval / interval_count? | Carries product **display name**? |
|---|---|---|---|---|
| `customer.subscription.created` / `.updated` | `data.object.items.data[0].price` | ✅ (already extracted) | ✅ all four | ❌ `price.product` is a **string id**, not expanded |
| `checkout.session.completed` (mode=subscription) | routes through `processSubscriptionLikeEvent` → same item path | ✅ | ✅ | ❌ |
| `invoice.paid` | `data.object.lines.data[0].price` / `pricing.price_details` | ✅ | ✅ | ❌ |
| `customer.subscription.deleted` | same item path | ✅ | ✅ | ❌ |
| `invoice.payment_failed` | same line path | ✅ | ✅ | ❌ |

**Conclusion:** every price-bearing event already in `SUPPORTED_STRIPE_WEBHOOK_EVENT_TYPES`
carries currency + amount + interval + interval_count. The handler **could**
extract them with a ~25-line helper reusing the existing navigation. The
**one field the webhook payload does not carry** is the human `plan_name`
(`price.product` is `prod_…`, not "VIP Yearly" — Stripe only expands it if
asked). `STRIPE_SECRET_KEY` **is present** in the edge env
(`core.ts:112` `getStripeSecretKey`; `core.ts:690` `fetchStripeSubscriptionById`
already calls `api.stripe.com` with `expand[]`), so the display name is
*fetchable* — but that is a Phase-2 nicety, not a blocker (see §Recommendation).

---

## Three-option comparison

### Option A — Webhook auto-upsert (fill-gap variant)

Add `extractPriceEconomics(raw)` (reuses existing item/line navigation) +
`upsertBillingPriceMap()` (mirrors the existing `upsertStripeWebhookEventResult`
idiom in `index.ts`). Call it best-effort inside `upsertSharedSubscriptionMonotonic`
(it already has `providerPriceId`/`providerProductId` + `rawPayload` in scope
and runs for every price-bearing event), wrapped in try/catch so a map-write
failure can **never** fail the money path (CLAUDE.md: *core path survives
optional failures*).

**Critical design refinements (these are the difference between A working and
A corrupting MRR):**

1. **`ON CONFLICT DO NOTHING`, not `DO UPDATE`.** The seed rows are
   hand-curated (`plan_name` "VIP Yearly", reconciled `notes`). A
   write-on-every-payment-event `DO UPDATE` would clobber Chau's curation and
   re-derive `monthly_amount` on every invoice. Fill-gap = insert the row
   **only if absent**; existing curated rows are untouched. This makes A
   self-healing *and* non-adversarial to hand-curation.
2. **MRR normalization must be replicated exactly.** `interval=month` →
   `monthly_amount = chargeMajor`, `yearly_amount = null`. `interval=year` →
   `monthly_amount = chargeMajor/12`, `yearly_amount = chargeMajor`. This
   convention lives **only** in the seed's `notes` today; A must encode it or
   it skews MRR.
3. **Zero-decimal currency trap (B42 §1).** Stripe VND is zero-decimal:
   `unit_amount=2000000` is 2,000,000 VND — do **not** ÷100. A must carry an
   explicit zero-decimal currency set (VND, JPY, KRW, …). NB:
   `core.ts:221 formatMoney` already has this latent bug (`minor/100`
   unconditional) — see §"Other silent assumptions".
4. **Synthetic `plan_name`.** Deterministic, e.g.
   `"Stripe year×1 2000000 VND (auto)"`, `notes='auto-upserted by
   stripe-webhook (B52)'`. MRR math uses `mapped_monthly_amount`; `plan_name`
   is display-only in the view. Acceptable; enrichable later.

| | |
|---|---|
| **Pro** | Self-healing — a price can never be missing once any user pays on it. Zero ops dependency. Reuses existing helpers + write idiom. Deletes cleanly if D4 kills the map. |
| **Con** | Writes on payment events (1 cheap idempotent upsert/event; trivially mitigated — DO NOTHING after first). Synthetic `plan_name` until enriched. Handles **creates/updates only**, not Stripe-side **price deletion/rename** (a deleted price stops sending events; its stale `is_active=true` row lingers — but that maps 0 live subs so causes no MRR error, exactly the B42 §6.1 stale-row situation). |
| **LOC** | **~60–80 prod** (extractor ~30, upsert fn ~25, call site + best-effort wrapper ~6, zero-decimal set ~3) + **~60–90 test**. One file primarily (`webhook-events.ts`); optional tiny `price-map.ts` module. |

### Option B — Ops checklist tied to Stripe product creation

A documented step in the Stripe-product-creation runbook: "after creating a
price, INSERT a `billing_price_map` row via SQL Editor" (B42's RUNBOOK §3 is
already the template).

| | |
|---|---|
| **Pro** | Zero code. Zero new write path to test. Already half-written (B42 RUNBOOK). |
| **Con** | **This is exactly what already failed — twice.** #700 reconciled the migration file but the hand-apply was skipped; B42 is the same class. Relies on a human remembering an out-of-band step at the moment of a Stripe dashboard action. CLAUDE.md operating discipline: *don't solve a recurring silent failure with a process that depends on memory.* |
| **LOC** | 0 code; ~1 doc page (mostly exists). |

### Option C — Daily `pg_cron` reconcile job

A `pg_cron`-scheduled function pulls `GET https://api.stripe.com/v1/prices?expand[]=data.product`
and upserts the full map (including display names + `is_active` flips for
deleted/archived prices).

| | |
|---|---|
| **Pro** | Authoritative & complete — gets the **real product display name** (the one thing A can't), and is the **only** option that handles price **deletion/rename/archive** (flips `is_active=false`). `pg_cron` precedent exists (`20260513000000_anon_user_cleanup.sql` et al.). `STRIPE_SECRET_KEY` + the exact `api.stripe.com` fetch idiom already exist in `stripe-webhook/core.ts:690`. |
| **Con** | New scheduled function + cron migration + Stripe `prices.list` pagination + a full upsert-vs-curated-row reconciliation policy (does the cron's authoritative name overwrite Chau's curated `plan_name`? — a real policy question). Up to 24 h stale (a price created and paid before the next run is briefly invisible — A has no such window). Most surface area / most to get wrong on the money path. Needs `STRIPE_SECRET_KEY` in the cron/edge context (present, but one more coupling). |
| **LOC** | **~150–220 prod** (new edge fn ~120 incl. pagination + reconcile policy, cron migration ~15, env wiring) + **~100+ test**. |

---

## Recommendation

**Option A, fill-gap (`ON CONFLICT DO NOTHING`) variant. ~60–80 prod LOC.**

Rationale, against CLAUDE.md operating discipline:

- **Self-healing beats process (rejects B).** B is the control that already
  failed twice. A makes the failure structurally impossible for any price a
  user actually pays on — which is *every price that matters for MRR by
  definition* (a price with zero paying subs contributes zero MRR, so its
  absence from the map is a non-event). This is the precise gap B42 §6.3
  asked to close.
- **Smallest safe diff that ends the recurrence (rejects C as the
  first move).** C is strictly more capable (display names, deletion
  handling) but is ~3× the code on the money path and adds a curated-row
  overwrite policy question. Its unique wins — human `plan_name` and
  archive/`is_active` flips — are **cosmetic for MRR** (the view's math is
  `mapped_monthly_amount`, not `plan_name`; a stale `is_active=true` row maps
  0 live subs and adds 0 MRR error, per B42 §6.1). C is the right *eventual*
  belt-and-suspenders, not the right *now*.
- **Fill-gap, not overwrite, is the load-bearing refinement.** A naive
  `DO UPDATE` Option A would re-derive and clobber Chau's hand-curated
  `plan_name`/`notes`/reconciled `monthly_amount` on every invoice — turning
  a fix into a new drift source. `DO NOTHING` makes A purely additive: it
  only ever fills a hole, never argues with a curated row. This also means A
  and a future Option C **compose** (A keeps the floor; C, if later added,
  owns enrichment/deletion) rather than conflict.
- **D4-agnostic, low sunk cost.** B48-D4 ("keep the map vs. trust Stripe
  amounts on the subscription row") is unresolved and gates the larger
  consolidation. A is correct under *either* D4 outcome: it lives in the same
  file the map-join logic lives near, and if D4 later eliminates the map
  entirely, A is deleted in the same change (~70 LOC, one file). It does not
  prejudge D4; it stops the bleed while D4 is pending.
- **Best-effort, money-path-safe.** Wrapped in try/catch, logged, **never**
  rethrown — a map-upsert failure must not fail subscription ingestion (the
  map is a reporting projection, not the source of truth). Mirror the
  existing `isMissingStripeWebhookEventsTable` fail-soft pattern in
  `index.ts:167`.

**Phase-2 follow-ups (separate, not blockers):** (1) enrich synthetic
`plan_name` via `expand[]=items.data.price.product` on the API call that
already exists at `core.ts:690`; (2) add Option C *purely for deletion/rename
+ `is_active` hygiene* once D4 confirms the map survives — A + C compose by
the `DO NOTHING` design above.

### LOC summary

| Option | Prod LOC | Test LOC | New infra |
|---|---|---|---|
| **A (recommended)** | **~60–80** | ~60–90 | none (1 file + optional tiny module) |
| B | 0 | 0 | none (doc only) — *rejected: already failed twice* |
| C | ~150–220 | ~100+ | new edge fn + cron migration + STRIPE key coupling |

---

## §7 — Where else the system silently assumes "this Stripe price was set up correctly in our DB"

Candidates for the same self-healing pattern (or at least a loud check):

1. **`core.ts:221 formatMoney` — latent zero-decimal money bug (`money-path`).**
   `const major = minor / 100` is **unconditional**. For VND (zero-decimal)
   this renders `unit_amount=2000000` as `20000.00 VND` instead of
   `2,000,000 VND` — a **100× understatement in customer-facing billing
   emails**. Same zero-decimal trap B42 §1 flagged for the map. This fires
   today on every VND receipt email that routes through `formatMoney`.
   **Highest-severity find in this sweep — recommend its own dispatch.**

2. **`resolvePlan()` (`webhook-events.ts:102`) — price-id string heuristic.**
   `monthly`/`yearly` is inferred from `priceId.includes("month"|"year")`.
   Real Stripe ids (`price_1TCKSF2K1tPxy04u…`) contain **neither**, so this
   silently returns `null` and the plan label falls back to metadata. Assumes
   a price-id naming convention Stripe does not guarantee. Should derive from
   `price.recurring.interval` (the same field Option A extracts) — Option A's
   extractor makes this fix nearly free.

3. **`billing_mrr_inputs_v` LEFT JOIN itself.** The `LEFT` join is what makes
   the missing row *silent* (a `NULL` amount, not an error). Even with Option
   A in place, recommend `admin-billing-metrics` emit a loud beacon (Sentry)
   when any active/trialing/past_due sub resolves `mapped_monthly_amount IS
   NULL` — converts B7-Q5a from a manual query into a standing alarm. (B48
   already routes B7-Q1/Q4 to P0; this is the Q5a complement.)

4. **`tierRoomSource.ts` / `roomTierIndex.ts` direct `profiles.tier` reads.**
   Out of strict scope (entitlement, not pricing) but the same *silent-assume*
   shape: assume a column was populated correctly by a path that may not run.
   Already owned by B48-P3 / B17 — flagged here only for the pattern catalog,
   **do not dispatch from B52.**

---

## Worktree disposition

**`prune` — design fully captured in this committed doc.** No code, no
follow-up worktree. This file is the input to the Option-A implementation
dispatch (if Chau approves) and feeds B48-D4. If A is approved, the
implementer should re-confirm the §"Critical design refinements" four points
before writing the upsert — they are where this fix succeeds or silently
corrupts MRR.

---

*B52 — read-only scoping. No DB writes. No PR. Branch
`b52/price-map-autoupsert-scoping`. Awaiting Chau go.*
