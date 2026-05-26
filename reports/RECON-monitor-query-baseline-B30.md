# RECON — Money-Path Monitor Query Baseline (B30)

**Agent:** B30 · **Branch:** `b30/monitor-query-validation` · **No PR.**
**Labels:** silent-failure, money-path
**Scope:** Phase-0 read-only validation of B7's 5 detection queries against
**prod** Supabase (`buemdfxyhxunzpgdoqin`). NO infra, NO writes, NO code change,
NO pg_cron. Single atomic snapshot, service-role READ ONLY via PostgREST.

> **`npm ci` deliberately skipped.** This is a SQL/REST audit + markdown doc —
> zero code change, no typecheck/build/test gate to run, so `node_modules` (and
> the stagger-sleep that exists only to serialize concurrent `npm` installs) is
> not needed. Documented per operating-discipline "smallest safe change".

## Method

All 5 tables B7's queries touch are tiny — pulled in full once and B7's exact
SQL predicates were re-evaluated in-memory against a single `now()` snapshot.
This sidesteps PostgREST predicate-translation risk (`now()`, `ilike`, joins)
and guarantees one point-in-time consistent read. Emails masked, user_ids
truncated to 8 chars in this doc.

**Snapshot:** `2026-05-19T16:38:35Z`

| Table | Rows |
|---|---|
| subscriptions | 9 (8 active, 1 trialing) |
| stripe_webhook_events | 38 |
| profiles | 344 |
| entitlement_events | 51 |
| billing_price_map | 4 |

---

## Per-query result + bucket

### Q1 — Stuck/errored webhook events → **9 rows · VERIFIED MATCH (superset, all explained)**

| family | n | detail |
|---|---|---|
| `customer.subscription.deleted` + `[object Object]` | **3** | = B21's verified set ✓ (stuck 10–10.7 d) |
| `customer.subscription.created/.updated` + `[object Object]` | 2 | same opaque-serialization bug, event types outside B21's deletion-only scope |
| `Failed to apply monotonic … concurrent modifications` | 4 | known monotonic-CAS bug (A91/B5/B11/B26 territory) |

Bucket: **VERIFIED MATCH.** Contains exactly B21's 3 `[object Object]`
deletions; every extra row is explained by a known bug. Q1 is correctly a
*superset* — not "too broad"; it is the intended state-level catch-all. **Bonus:
Q1 also functions as a live monotonic-CAS-failure detector** (4 such events
currently stuck/abandoned, oldest 45 d). No refinement needed.

### Q2 — Phantom-MRR subscriptions → **3 rows · VERIFIED MATCH**

3 subs, all `status=active`, `ended_at=null`, all on the **mapped** price
`price_1TCKY0…`, all `current_period_end = 2026-05-09` (lapsed ~10 d):
`my…@gmail` (**mylinh — real customer**), `ch…@yahoo`, `ch…@p….me`.

Bucket: **VERIFIED MATCH** — exactly the U1/U2/U3 phantom-MRR set.
**→ Confirms A94's stale-sub cleanup SQL is NOT yet applied** (still 3, not
0/1). These 3 still inflate MRR *and* grant stale entitlement.

### Q3a — Profile premium but expiry past → **3 rows · VERIFIED MATCH**

Same 3 users as Q2 (`premium_status=active`, `premium_expires_at=2026-05-09`,
`premium_source=stripe`). Cosmetic mirror of Q2. Matches the predicted
"mylinh + U1/U2" population exactly.

### Q3b — Paying user NOT granted premium → **1 row · QUERY TOO BROAD (flag B7)**

`c4780775 / de…@m……….com`, `premium_status=inactive`, sub `active` to
**2027-04-28** — BUT `provider_subscription_id = NULL` **and**
`provider_price_id = NULL`. This is a manual / comp / non-Stripe row, not a
real Stripe-paying customer being denied access (email pattern strongly
suggests an internal `demo@mercyblade.com`-style account).

Bucket: **QUERY TOO BROAD.** Not a real revenue leak.
**Refinement for B7:** add `s.provider_subscription_id is not null` to Q3b so
it only flags genuine Stripe payers — otherwise it false-positives on every
admin/comp grant. (Low-priority: Chau may still want to eyeball the `de…`
account once.)

### Q4 — invoice.paid received but period not advanced → **1 row · VERIFIED MATCH**

Exactly `cd9b889c / my…@gmail` (**mylinh — real customer**):
`invoice.paid @ 2026-05-09T07:18Z`, sub still `active`, but
`current_period_end = 2026-05-09T06:16Z` — period never advanced after the
payment. **This is the confirmed real-money-taken / access-lapsed case**,
highest severity, exactly the predicted population.

**Resolves B7 open-verification item #3:** prod `entitlement_events` literals
are `checkout.session.completed`, `customer.subscription.created`,
`customer.subscription.updated`, **`invoice.paid`**, `invoice.payment_failed`.
There is **no** `invoice.payment_succeeded`.
**Refinement for B7:** B7's predicate `event_type ilike 'invoice%'` also
matches `invoice.payment_failed` (a *failed* charge — false positive). It did
not misfire in this snapshot (only mylinh's `invoice.paid` matched the lapsed
condition) but is unsafe as written → tighten to `event_type = 'invoice.paid'`
(or `ilike 'invoice%' and event_type not ilike '%failed%'`).

### Q5a — Active priced sub with no active price-map row → **2 groups / 4 subs · NOVEL FINDING (highest value)**

| provider \| price | affected | who |
|---|---|---|
| `stripe \| price_1TCKSF2K1tPxy04uNeKcQWp5` | **3** | `lo…@gmail` (premium **active**), `le…@gmail` (premium **active**), `115c2ecf` (no profile row) |
| `stripe \| NULL` | 1 | `c4780775 / de…` (the NULL-price comp row from Q3b) |

`price_1TCKSF2K1tPxy04uNeKcQWp5` is **not present in `billing_price_map` at
all**. `billing_price_map` has only 4 rows, two of which are unreconciled
placeholder seeds (`price_replace_monthly`, `price_replace_yearly`). So ≥2
**real, premium-active, paying subscribers** (subs valid through 2027) are
silently contributing **0 MRR** — this is the live **#700 MRR-undercount
class**, not hypothetical. Systematic (a whole real Stripe price unmapped),
not a one-off.

Bucket: **NOVEL FINDING.** Highest-value result of this validation.

### Q5b — Active 0-priced map row used by active subs → **0 rows · VERIFIED clean**

Healthy. Context note (not a Q5b hit): the 2 placeholder seed rows
`price_replace_monthly` / `price_replace_yearly` are `is_active=true` with
non-zero amounts — a seed-hygiene smell worth cleaning when the price-map is
reconciled, but Q5b correctly returns 0 (no active sub uses the literal
`price_replace_*` ids).

---

## Bucket summary

| Query | Bucket |
|---|---|
| Q1 | VERIFIED MATCH (superset; all 9 explained; bonus monotonic-CAS detector) |
| Q2 | VERIFIED MATCH (= U1/U2/U3; **A94 cleanup SQL still unapplied**) |
| Q3a | VERIFIED MATCH (= mylinh + U1/U2 cosmetic mirror) |
| Q3b | **QUERY TOO BROAD** — false-positives on NULL-sub_id comp rows; refine |
| Q4 | VERIFIED MATCH (= mylinh; resolves B7 #3; predicate refinement flagged) |
| Q5a | **NOVEL FINDING** — price-map drift, ≥2 real customers at 0 MRR |
| Q5b | VERIFIED clean (0) |

## 🚩 NOVEL FINDINGS — priority

1. **[P1 · real customers · LIVE] Q5a price-map drift — #700 class active right
   now.** Stripe price `price_1TCKSF2K1tPxy04uNeKcQWp5` is absent from
   `billing_price_map`. Two confirmed **real paying subscribers**
   (`lo…@gmail`, `le…@gmail` — both `premium_status=active`, subs valid to
   2027) plus one profile-less sub (`115c2ecf`) are counted as **0 MRR**.
   MRR is undercounting ≥2 confirmed live subscribers. Fix = add the missing
   price row to `billing_price_map` — **Chau via SQL Editor only** (no
   unattended write path to this Supabase; out of B30 scope, surfaced for
   follow-up). This is exactly the silent failure B7's monitoring is designed
   to catch, demonstrated live on Phase-0 validation.

2. **[P3 · query refinement] Q3b predicate too broad.** `c4780775 / de…` is a
   NULL-sub_id / NULL-price manual/comp row (likely internal demo), not a real
   denied payer. Refinement flagged to B7 author (require
   `provider_subscription_id is not null`). Not a real revenue leak.

3. **[context, not novel] A94 stale-sub cleanup SQL still unapplied.** Q2/Q3a
   confirm the 3 phantom-MRR subs (incl. real customer **mylinh**) are still
   live in prod — re-confirms the A94 finding, no new population.

### Minor data-integrity note
`115c2ecf` (active, price `price_1TCKSF…`) and `ab5a2081` (trialing) have **no
matching `profiles` row** (email/premium null). Subscription rows without a
profile — low-severity integrity smell, parked for follow-up, not a money loss.

## Outcome for B7's Phase-0

All 5 queries are **safe and accurate enough to ship as the read-only scan
core**, with two small predicate refinements before they are locked into
`money_path_anomaly_scan()`:

- **Q3b:** add `s.provider_subscription_id is not null`.
- **Q4:** replace `ilike 'invoice%'` with `event_type = 'invoice.paid'`
  (prod literal confirmed; no `invoice.payment_succeeded` exists;
  `invoice.payment_failed` would otherwise false-positive).

B7 open-verification item **#3 is resolved** by this run (event_type literals
captured above). Q1/Q2/Q3a/Q4 each returned exactly the known affected
population (no drift). Q5 surfaced a **live, previously-unknown** real-customer
MRR loss — the single highest-value result and a concrete proof that the
monitoring B7 scoped would have paid for itself already.
