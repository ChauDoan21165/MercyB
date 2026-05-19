# RECON — `subscriptions.raw_payload` gets an invoice object instead of a subscription object (A14)

**Date:** 2026-05-19
**Branch:** `a14/webhook-payload-type-audit` (operator artifact, no PR)
**Scope:** Recon only — find why `object_type='invoice'` lands in `subscriptions.raw_payload`, and whether new subs today still hit it. Writing the fix is explicitly out of scope.
**Codebase audited:** `supabase/functions/stripe-webhook/*` at `origin/main` HEAD `5cfa27e3f`.

---

## Verdict (one line)

**LIVE, ACTIVE bug.** The invoice-event handlers persist the raw Stripe **invoice** object straight into `subscriptions.raw_payload`, and the monotonic upsert lets that invoice object overwrite a subscription object whenever `invoice.paid` is the freshness-winning event — which is the normal case for a renewing/new monthly sub. Code path unchanged since **2026-04-03**; every new sub processed today still hits it.

---

## Root cause — exact lines

There are two writers into `public.subscriptions.raw_payload`, both via `upsertSharedSubscriptionMonotonic` → `mapStripeSubscription` (`subscription-insert.ts:78`, `raw_payload: (params.rawPayload ?? null)`).

The defect is in **what `rawPayload` is** for invoice events:

| Handler | File:line | `rawPayload` passed | Resulting `raw_payload.object` |
|---|---|---|---|
| `handleCustomerSubscriptionCreatedOrUpdated` | `webhook-events.ts:464` (via `processSubscriptionLikeEvent`) | `params.raw` = `event.data.object` = **subscription** | `"subscription"` ✓ has `items.data[0].price.unit_amount` |
| `handleCheckoutSessionCompleted` | same | `event.data.object` = **checkout.session** | `"checkout.session"` (no `items`) |
| **`handleInvoicePaid`** | **`webhook-events.ts:739` — `rawPayload: raw`** | `raw` = `getEventObject(event)` = **invoice** | **`"invoice"`** ✗ no `items`, has `lines` |
| **`handleInvoicePaymentFailed`** | **`webhook-events.ts:870` — `rawPayload: raw`** | `raw` = invoice | **`"invoice"`** ✗ |

`getEventObject` (`webhook-events.ts:48-50`) returns `event.data.object` verbatim. For `invoice.paid` / `invoice.payment_failed` that object is a Stripe **invoice** (`object: "invoice"`). It is handed unmodified to `upsertSharedSubscriptionMonotonic({ ... rawPayload: raw })` and persisted. **There is no normalization that converts the invoice shape into a subscription shape before it becomes the canonical `subscriptions.raw_payload`.**

### Why the invoice object *overwrites* a good subscription object

The monotonic upsert (`billing.ts:598-919`) does **not** discriminate by object type. It only compares "freshness" (`compareStripeFreshness`, `billing.ts:213-239`) in this precedence:

1. `object_time_ms` — `deriveObjectTimeMs` (`billing.ts:63-125`): for a **subscription** it's `current_period_start/end` (or `items[].current_period_*`); for an **invoice** it's `lines.data[].period.start/end`. **For the first/renewal cycle these are the same instant** (the invoice line period == the subscription period). → tie.
2. `event_created` — Stripe's event `created` unix ts. `invoice.paid` is typically stamped at/after `customer.subscription.created|updated`. → invoice usually **wins** here (`> 0`), *before* priority is ever consulted.
3. `event_priority` (`billing.ts:127-144`) — only breaks an exact `event_created` tie. (sub.updated 60 > sub.created 50 > invoice.paid 40.) This *would* protect the subscription payload, but only in the rare exact-tie case; it does not fire when `invoice.paid.event_created` is even 1s later.

Net: in the common ordering (`subscription.created/updated` then `invoice.paid`, equal period, invoice stamped later), `compareStripeFreshness(invoice, persisted_subscription) > 0` → the **update branch runs and replaces `raw_payload` with the invoice object**. The freshness wrapper `__stripe_freshness` is the only thing added; the persisted body is now an invoice.

This exactly reproduces the diagnosed **mylinh (monthly)** row: `raw_payload` populated, `object='invoice'`, no `items.data[0].price.unit_amount` (invoices carry `lines.data[0]`, never `items`).

### The other diagnosed row (`raw_payload IS NULL`, yearly, 2026-04-28)

This is a **different sub-failure class** and not produced by these handlers: every webhook writer passes `attachStripeFreshnessToRawPayload(...)` (`billing.ts:241-259`), which **never returns null**. A NULL `raw_payload` therefore means that row was written by something *other* than this webhook (manual SQL, the app-side `src/billing/*` path, a backfill, or a pre-2026-04-03 schema state). Out of scope here — flagged for the raw_payload backfill track (A15) and a separate NULL-class trace.

---

## Live vs historical — git evidence

- `webhook-events.ts:739` (`rawPayload: raw` in `handleInvoicePaid`) — `git blame` → commit **`1124b0df27`, 2026-04-03** ("Fix Stripe webhook subscription activation flow"). Unchanged since.
- `attachStripeFreshnessToRawPayload` + the freshness machinery — commit **`b7524cc7c0`, 2026-04-03**. Object-type-blind from day one.
- Subsequent touches to these files — `#726` (2026-05-19, latent type-bug repair) and `#770` (2026-05-19, `getCurrentPeriodEnd` field-order / B5) — **did not change** the `rawPayload: raw` behavior or add object-type discrimination.
- No test asserts `raw_payload` must be subscription-typed (`subscriptionInsert.test.ts:107` passes any payload through; `periodResolution.test.ts` uses the `mylinh-invoice-subscription-cycle.json` fixture only for period math).

**Conclusion:** Not a ghost of a fixed bug. The writer is on `main` today, unguarded, and every new subscription whose freshness-winning event is `invoice.paid` (the normal monthly case) lands an invoice object in `subscriptions.raw_payload` right now.

---

## Blast radius

`subscriptions.raw_payload` is consumed by:

- **`supabase/sql/admin_users_dashboard_v1.sql` — the user-visible damage.**
  - `amount_cents` (lines 42-46): `coalesce(raw_payload->'plan'->>'amount', raw_payload->'items'->'data'->0->'price'->>'unit_amount', 0)`. An invoice object has **neither** `plan` **nor** `items` → **`amount_cents` = 0** for every invoice-clobbered row.
  - `plan_interval` (lines 28-33): falls through to `raw_payload->'items'...->'recurring'->>'interval'` → `'unknown'` unless `billing_interval` column is set.
  - `normalized_currency_code` (lines 34-41): reads `raw_payload->>'currency'` — invoices *do* have top-level `currency`, so currency survives; amount + interval do not.
- **A15 raw_payload backfill** — consumes these rows as input; an invoice-typed payload has no `items.data[0].price.unit_amount` to read, so backfill from `raw_payload` alone cannot recover the amount for invoice-clobbered rows (must read `lines.data[0].pricing`/`price` or the Stripe API).
- **Webhook-internal readers are resilient:** `fetchStripeSubscriptionByIdFromDb` (`webhook-events.ts:606`) reads only `getMetadata(raw_payload)` (present on both shapes); `derivePersistedFreshness` (`billing.ts:164-211`) reads `__stripe_freshness` then `deriveObjectTimeMs` which already handles the invoice `lines` shape. So the monotonic ordering itself is **not** broken by an invoice payload — only downstream `items`-shaped reads are.
- Parallel non-prod surface: `src/billing/stripe/mapStripeSubscription.ts:54` is an app-side mapper with the same `raw_payload: params.rawPayload` pattern; the **edge function is the production Stripe writer**, so the fix belongs there, but the app-side mapper should be checked for the same object-type assumption when the fix lands.

---

## Count query — for Chau to run in the Supabase SQL Editor

Not auto-run: per the standing "no unattended SQL path to this Supabase" guardrail and the brief's own step-8 framing ("the count query for Chau to run"). Read-only:

```sql
SELECT raw_payload->>'object' AS object_type, count(*)
FROM public.subscriptions
WHERE provider = 'stripe'
GROUP BY 1
ORDER BY 2 DESC;
```

Interpretation key for Chau:
- `subscription` → correct (has `items.data[0].price.unit_amount`).
- `invoice` → **this bug** (amount shows as 0 on the admin dashboard).
- `checkout.session` → a milder variant of the same writer issue (also no `items`).
- `(null)` → the separate NULL-class (A15 / non-webhook writer trace).

Optional drill-down to see which plans are affected:

```sql
SELECT raw_payload->>'object' AS object_type,
       coalesce(billing_interval, 'unknown') AS interval,
       count(*)
FROM public.subscriptions
WHERE provider = 'stripe'
GROUP BY 1, 2
ORDER BY 3 DESC;
```

---

## Recommended fix scope (separate PR — NOT done here)

The fix must keep processing invoice events (they legitimately update `status`, period, price columns) while preventing an invoice-shaped object from becoming the canonical `subscriptions.raw_payload`. Recommended, smallest-safe-diff first:

- **Option A (recommended) — object-type-aware raw_payload write.** In `upsertSharedSubscriptionMonotonic` / `mapStripeSubscription`, when the incoming event is invoice-typed (`raw.object === 'invoice'`) and an existing subscription-typed `raw_payload` is present, **keep the existing subscription payload** for the `raw_payload` column while still updating the derived columns (status/period/price) from the invoice. i.e. raw_payload becomes monotonic on *object quality*, not just time. Narrowest behavioral change, no Stripe API call.
- **Option B — never persist invoice as raw_payload.** Have `handleInvoicePaid`/`handleInvoicePaymentFailed` pass the *previously persisted* subscription `raw_payload` (or a normalized subscription snapshot) instead of the invoice object. Cleaner conceptually but needs a fetch of the existing row's payload at the handler.
- **Option C — fetch the live Stripe subscription** in the invoice path and persist that. Most correct, highest blast radius (adds a Stripe API dependency to the invoice path); defer unless A/B prove insufficient.

Pair the chosen fix with: (1) a unit test asserting `raw_payload.object` stays `'subscription'` after an `invoice.paid` follows a `customer.subscription.created` for the same sub (use the existing `mylinh-invoice-subscription-cycle.json` fixture), and (2) coordinate the historical-row remediation with the A15 raw_payload backfill (invoice-clobbered rows need amount recovered from `lines.data[0].pricing`/`price` or the Stripe API, not `items`).

**Blast-radius statement for the fix PR:** changes are confined to `supabase/functions/stripe-webhook/{webhook-events,billing,subscription-insert}.ts`. No schema migration required. Risk surface = the money-path monotonic upsert (a "central file" per CLAUDE.md operating discipline) — keep the diff minimal, gate on `deno check` + the existing webhook unit suites, and do not alter the freshness ordering for non-raw_payload columns (status/period correctness must not regress).

---

## Handoffs / out of scope

- Writing the fix PR — explicitly out of scope (this is recon to scope it).
- `raw_payload IS NULL` rows + historical invoice-clobbered row remediation — A15 raw_payload backfill track.
- The NULL-row writer source (non-webhook insert path) — separate short trace.
