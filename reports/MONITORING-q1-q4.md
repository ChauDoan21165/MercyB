# Money-Path Monitoring — Q1 & Q4 SQL Editor Runbook (B7 → A3)

**Status:** LIVE runbook. Read-only. Run by operator (Chau) in the Supabase SQL
Editor. **No unattended SQL path to this Supabase** — these are SELECT-only
diagnostic queries, not migrations.

**Why this exists:** safety net before the **B13 phase-3 consolidation
surgery**. Run Q1 + Q4 *immediately before* and *immediately after* the B13
deploy; any row that appears (or any row-set that grows) only on the *after*
run is a regression introduced by the surgery, not pre-existing debt.

**Scope (D5 decision):** Q1 and Q4 only. **Q2, Q3, Q5 are deliberately NOT
built** — the B13 consolidation removes those drift classes outright, so a
monitor for them would be dead on arrival. Do not add them here.

**Source of truth:** `reports/RECON-money-path-silent-failure-monitoring-B7.md`
(branch `b7/money-path-monitoring-scoping`), validated read-only against prod by
B30 on 2026-05-19. The SQL below is the **locked, post-B30-refinement** form.

**Project:** `buemdfxyhxunzpgdoqin.supabase.co` → Supabase Dashboard → SQL
Editor. Run as a privileged dashboard user (these touch `subscriptions`,
`entitlement_events`, `stripe_webhook_events` — admin-gated tables).

---

## Q1 — Stuck / errored webhook events (`[object Object]` family + monotonic-CAS detector)

### Purpose

Catch Stripe webhook events that were claimed but never marked processed and
are not retryable. The claim path inserts `processed_at = NULL`; only
`markStripeWebhookEventProcessed` sets it to `now()`. Retryable failures
self-DELETE via `releaseStripeWebhookEventClaim`, so **any row with
`processed_at IS NULL` older than the 15-minute Stripe fast-retry window is a
non-retryable, swallowed failure** — exactly the class that was blind for ~2
weeks (`error` = `"[object Object]"` from `String(nonErrorObject)`). Q1 is a
deliberate *superset*: it also surfaces stuck monotonic-CAS-failure events.

```sql
-- Q1 — Healthy: 0 rows.
-- Non-zero: a live Stripe webhook errored and is abandoned (non-retryable,
-- swallowed) OR a monotonic-CAS write keeps losing and never lands.
select event_id,
       type,
       error,
       created_at,
       now() - created_at as stuck_for
from public.stripe_webhook_events
where processed_at is null
  and coalesce(livemode, true) = true
  and created_at < now() - interval '15 minutes'
order by created_at;

-- Sub-signal — isolate the specific opaque-serialization family
-- (the 2-week-blind incident). Add to the WHERE above when triaging:
--   and error ilike '%object Object%'
```

15-min grace = Stripe's fast-retry window. The `coalesce(livemode, true) = true`
guard excludes Stripe test-mode events (a missing `livemode` is treated as live,
the safe default).

### Expected zero-state output

Ideally **0 rows**. In practice there is a **known, explained baseline** as of
the B30 prod validation (2026-05-19, `b30/monitor-query-validation`):

- **9 rows total**, all accounted for:
  - 3 `[object Object]` events from B21's failed-deletion family
  - 2 same-bug create/update events
  - 4 monotonic-CAS-failure events (oldest stuck ~45 days)

Treat this 9-row set as the **baseline**, *not* "healthy = 0". A `created_at`
older than 2026-05-19 that matches the above description is pre-existing,
already-tracked debt — not a new fire.

### What a non-zero result beyond baseline means

- **A row with `created_at` after the B13 phase-3 deploy** → the surgery
  introduced a webhook-handling regression. Highest priority during the B13
  window. This is the precise reason Q1 is the pre/post safety net.
- **A new `error ilike '%object Object%'` row** → the opaque-serialization
  failure family is live again: a real Stripe webhook threw a non-`Error`
  object, was logged as `"[object Object]"`, and was swallowed. Money-path
  impact (entitlement may not have been applied).
- **A growing count of monotonic-CAS-failure rows** → a subscription write is
  repeatedly losing the compare-and-swap and never landing; the user's
  entitlement state is stale.

### What to do about it

1. **Confirm in the Stripe Dashboard** (Developers → Events): find the
   `event_id`. Was the event actually delivered? What is its real payload /
   error? `String(error)` destroyed the original message — Stripe has it.
2. **Pre/post B13 diff:** compare the row set from the *before* run to the
   *after* run. Any `event_id` present only after = caused by the surgery →
   block/rollback B13 phase 3 until explained.
3. `[object Object]` family → identify which handler branch threw a non-`Error`
   object; the entitlement for that `event_id`'s customer likely did not apply.
   Manually reconcile that customer's `subscriptions` / `profiles` state.
4. Monotonic-CAS family → the row is informational (the write is losing, not
   erroring). Check whether the affected subscription's
   `current_period_end` / `status` is actually current; if stale, recompute
   entitlement for that user.
5. Do **not** delete rows to "clear" the monitor. These rows are the evidence.

---

## Q4 — invoice.paid received but subscription period not advanced (highest severity)

### Purpose

Catch the worst silent money-path failure: **a customer was charged
(`invoice.paid` recorded in `entitlement_events`) but their subscription period
never moved forward** — the renewal `customer.subscription.updated` was dropped
or stale-rejected by the freshness gate. Real money taken, access lapsing or
lapsed, zero exception anywhere. This is the U3 family (real customer
**mylinh**), blind for 10 days, found only by incidental scan.

```sql
-- Q4 — Healthy: 0 rows.
-- Non-zero: real money was taken this cycle (invoice.paid) but the
-- subscription period never advanced — access is lapsing/lapsed.
select e.user_id,
       e.event_type,
       e.created_at as paid_at,
       s.provider_subscription_id,
       s.status,
       s.current_period_end,
       now() - s.current_period_end as lapsed_for
from public.entitlement_events e
join public.subscriptions s on s.user_id = e.user_id
where e.event_type = 'invoice.paid'
  and e.created_at > now() - interval '35 days'
  and s.status in ('active','trialing','grace_period','past_due')
  and s.current_period_end < now() - interval '2 days'
  and coalesce(s.environment,'production') <> 'sandbox'
order by e.created_at;
```

**Locked predicate note (B30 refinement, do not revert):**
`e.event_type = 'invoice.paid'` — *exact match*, not `ilike 'invoice%'`. B30
confirmed prod `entitlement_events` literals are `checkout.session.completed`,
`customer.subscription.created`, `customer.subscription.updated`,
`invoice.paid`, `invoice.payment_failed`. There is **no**
`invoice.payment_succeeded`. The original `ilike 'invoice%'` form also matched
`invoice.payment_failed` (a *failed* charge) → false positive. The exact-match
form above is the locked, validated predicate.

Grace windows: 35-day lookback covers a full monthly billing cycle; 2-day
`current_period_end` grace absorbs Stripe smart-retry / dunning lag before a
legitimate `past_due`/`expired` transition would occur.

### Expected zero-state output

Ideally **0 rows**. **Known baseline (B30, 2026-05-19): 1 row** —
`user_id = cd9b889c` (**real customer mylinh**): `invoice.paid` recorded
2026-05-09T07:18Z, subscription still `active`, but
`current_period_end = 2026-05-09T06:16Z` (period never advanced after the
payment). This is the confirmed real-money-taken / access-lapsed case the
monitor was built around.

Until mylinh's row is remediated (entitlement recomputed / period advanced),
**Q4's healthy state is "exactly the 1 known mylinh row, nothing else"** — not
0. Any *additional* row is a new incident.

### What a non-zero result beyond baseline means

- **Any row that is not the known `cd9b889c` row** → a *different* customer paid
  and did not get their period advanced. Same severity as mylinh: real revenue
  taken, access about to lapse, no exception logged. Triage immediately.
- **A new row appearing only on the post-B13 run** → the consolidation broke
  the renewal-application path. This is the single highest-severity pre/post
  signal in this runbook — a B13 regression here means paying customers lose
  access. Block/rollback B13 phase 3 until resolved.

### What to do about it

1. **Confirm the charge in the Stripe Dashboard** (Customers → the customer →
   Invoices). Was the `invoice.paid` real and settled? (It almost always is —
   `entitlement_events` only records on success.)
2. If real: the customer **paid and is being denied the period they paid for**.
   Manually advance `subscriptions.current_period_end` to the correct paid-through
   date and recompute/persist entitlement for that `user_id` so
   `profiles.premium_expires_at` reflects the real paid period. (Operator action
   via SQL Editor / the recompute path — there is no unattended write path.)
3. Cross-reference the affected `user_id` against the U3 remediation work
   (A91 / A94 / B57 mylinh-salvage) before hand-fixing — a salvage SQL may
   already cover this customer.
4. Pre/post B13: a row whose `paid_at` is recent and whose
   `provider_subscription_id` was healthy on the *before* run but lapsed on the
   *after* run is a surgery-caused regression — escalate, do not absorb.

---

## Operating notes

- **Read-only.** Nothing here writes. Remediation (period advance, entitlement
  recompute, price-map repair) is operator-driven via SQL Editor and tracked in
  the respective B-series runbooks — not in this monitor.
- **Cadence:** the *minimum* required cadence is once before and once after the
  B13 phase-3 deploy. Beyond that, ad-hoc on any money-path incident report.
  (Hourly automation under pg_cron is the deferred full-B7 plan in the recon —
  out of scope here per D5.)
- **Baselines are dated.** The 9-row Q1 / 1-row Q4 baselines are the B30
  2026-05-19 prod populations. Re-baseline after any of the known rows are
  remediated, and record the new expected-state in this file.
- **Q2 / Q3 / Q5 are intentionally absent.** B13 consolidation deletes those
  drift classes. If a future task asks to "complete the monitor," confirm
  against D5 before adding them — they were scoped out on purpose, not missed.
