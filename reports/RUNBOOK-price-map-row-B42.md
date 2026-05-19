# RUNBOOK — Missing `billing_price_map` row for Stripe yearly price (B42)

**Labels:** silent-failure, money-path
**Status:** DIAGNOSED — no writes performed. One-shot SQL Editor INSERT prepared below; Chau applies by hand.
**Source finding:** B30 Q5a — Stripe price `price_1TCKSF2K1tPxy04uNeKcQWp5` absent from `billing_price_map`.
**Failure class:** identical to PR #700 (migration-file reconciled, live-prod hand-patch never applied → drift).

---

## 1. What is broken (live-prod evidence, service-role READ)

`billing_mrr_inputs_v` LEFT JOINs `subscriptions.provider_price_id` →
`billing_price_map.price_id` (where `is_active = true`). A subscription whose
`provider_price_id` has no active map row gets `mapped_monthly_amount = NULL`
→ counted as **0 MRR**. Entitlement is unaffected (it derives from
`subscriptions.status`, not price_id) so users keep premium — the revenue is
just invisible.

### Live `billing_price_map` (4 rows — drifted from the post-#700 migration file)

| price_id | plan_name | interval | monthly_amount | yearly_amount | is_active |
|---|---|---|---|---|---|
| `price_replace_monthly` | VIP Monthly | month | 200000.00 | — | true ⚠ placeholder, should have been DELETEd |
| `price_replace_yearly` | VIP Yearly | year | 166666.67 | 2000000.00 | true ⚠ placeholder, should have been DELETEd |
| `price_1TCKY02K1tPxy04uCHQNbvik` | VIP Monthly | month | 200000.00 | — | true ✅ real, maps 5 subs |
| `price_1TCW5p2NqcfRsoh4SghDrMQv` | VIP Yearly | year | 166666.67 | 2000000.00 | true ⚠ stale yearly id — maps **0** real subs |
| **`price_1TCKSF2K1tPxy04uNeKcQWp5`** | — | — | — | — | **MISSING** ← this runbook |

### MRR blast radius (all 9 active/trialing/past_due subs)

```
  4  active     price_1TCKY02K1tPxy04uCHQNbvik   (mapped ✅)
  1  trialing   price_1TCKY02K1tPxy04uCHQNbvik   (mapped ✅)
  3  active     price_1TCKSF2K1tPxy04uNeKcQWp5   (UNMAPPED — this fix)
  1  active     None                             (separate data-quality issue — see §6)
```

3 (not 2) active yearly subs are invisible. At `monthly_amount = 166666.67`
that is **~500,000 VND/mo ≈ 6,000,000 VND/yr** of real revenue missing from MRR.

> **⚠ Discrepancy vs B30 brief:** the brief named **2** users (`lo…`, `le…`).
> Live data shows **3** active subs on this price_id. The third
> (`115c2ecf…`, period→2027-04-01) has **no `profiles` row**, so it was likely
> excluded from B30's email-joined query. It is a real paying customer. See §5.

### What Stripe actually sent us (authoritative — from `subscriptions.raw_payload`, all 3 subs identical)

| field | value |
|---|---|
| `price.id` | `price_1TCKSF2K1tPxy04uNeKcQWp5` |
| `price.product` | `prod_UAfnlqhxFFLDE0` |
| `price.currency` | `vnd` |
| `price.unit_amount` | `2000000` — Stripe VND is **zero-decimal**, this is **2,000,000 VND** (do **not** ÷100) |
| `price.recurring.interval` | `year` |
| `price.recurring.interval_count` | `1` |
| `plan.{amount,interval,currency,product}` | mirrors the above |

This is byte-identical to the economics of the existing
`price_1TCW5p2NqcfRsoh4SghDrMQv` "VIP Yearly" row. The missing row is simply
the **correct/current** Stripe yearly price id that #700 reconciled in the
migration file but was never hand-applied to live prod.

---

## 2. Stripe Dashboard lookup (verification + product display name)

`raw_payload` already gives us authoritative amount/currency/interval, so the
Dashboard step is a **cross-check + capture the human product name**, not a
math exercise.

1. Stripe Dashboard → **Test/Live toggle: confirm you are in the mode these
   live subs were created in** (subs are real paying customers → **Live**).
2. **Product catalog → Prices** (or **Developers → search**) → paste
   `price_1TCKSF2K1tPxy04uNeKcQWp5`.
3. On the price page capture:
   - **Price ID** — confirm `price_1TCKSF2K1tPxy04uNeKcQWp5`
   - **Product** — confirm `prod_UAfnlqhxFFLDE0`; note the **product display
     name** (this becomes `plan_name`; codebase convention for the 2M VND/yr
     plan is `VIP Yearly` — keep that for JOIN/consistency unless the product
     name dictates otherwise; "VIP" here is a legacy billing label, not a user
     tier — see §4 PRINCIPLE).
   - **Billing period** — confirm `Yearly` / `interval_count = 1`
   - **Currency** — confirm `VND`
   - **Amount** — confirm `2,000,000 VND` (zero-decimal; matches
     `unit_amount = 2000000`)
4. If any captured value differs from §1's `raw_payload` table, **STOP** and
   re-diagnose — do not paste the INSERT. (They are expected to match.)

---

## 3. Prepared one-shot INSERT (SQL Editor — Chau applies after §2 confirms)

All values are filled from authoritative `raw_payload`; the only placeholder
is `plan_name` (confirm in §2, default shown). Run in **Supabase SQL Editor**
against live prod.

```sql
-- B42: add the missing live Stripe yearly price row that #700 reconciled in
-- the migration file but was never hand-applied to live prod (migration drift).
-- Idempotent: ON CONFLICT keeps re-runs safe. monthly_amount = 2,000,000 / 12
-- (yearly normalized to monthly MRR — mirrors the existing yearly row).
insert into public.billing_price_map (
  provider, price_id, plan_name, billing_interval, interval_count,
  monthly_amount, yearly_amount, currency, is_active, notes
) values (
  'stripe',
  'price_1TCKSF2K1tPxy04uNeKcQWp5',
  'VIP Yearly',                       -- <<< confirm product display name in §2
  'year',
  1,
  166666.67,                          -- 2000000 / 12, monthly-normalized MRR
  2000000.00,                         -- Stripe unit_amount=2000000, VND zero-decimal
  'VND',
  true,
  'B42: reconciled live yearly price id (matches Pricing.tsx + all 3 active yearly subs raw_payload; #700 hand-patch was never applied to live — see RUNBOOK-price-map-row-B42.md)'
)
on conflict (provider, price_id) do update set
  plan_name        = excluded.plan_name,
  billing_interval = excluded.billing_interval,
  interval_count   = excluded.interval_count,
  monthly_amount   = excluded.monthly_amount,
  yearly_amount    = excluded.yearly_amount,
  currency         = excluded.currency,
  is_active        = excluded.is_active,
  notes            = excluded.notes,
  updated_at       = now();
```

> **Scope discipline (small safe diff):** this runbook fixes **only** the one
> missing row B30 flagged. It does **not** delete the two `price_replace_*`
> placeholders or the stale `price_1TCW5p2NqcfRsoh4SghDrMQv` row — those map
> to 0 real subs so they cause no MRR error today, and removing them is a
> separate reconciliation decision (the full #700 hand-patch). Flagged in §6.

---

## 4. PRINCIPLE — this is a one-shot patch, not the fix

This INSERT recovers known-good state for one row. It does **not** answer
*why the row was missing*. `billing_price_map` is hand-curated and drifts from
the migration file because the migration is never auto-applied to live prod
(documented drift). The durable question — **where in normal Stripe product
setup does a `billing_price_map` row get created?** — is a separate dispatch
(see §6). Until that is answered, every new Stripe price will silently repeat
this failure (this is now the **2nd** occurrence: #700, then B42).

`plan_name` "VIP …" is a **legacy billing label internal to MRR math**, not a
user-facing tier/cohort (MercyBlade has no VIP tier — CLAUDE.md §5). It is
kept verbatim only to match existing rows and the `billing_mrr_inputs_v` JOIN;
do not propagate "VIP" into any user-facing surface.

---

## 5. Verify-after queries (re-run B30 Q5a — expect 0 rows)

**5a. Targeted (this price only) — must return 0 rows after the INSERT:**

```sql
select s.user_id, s.provider_price_id, s.status
from public.subscriptions s
left join public.billing_price_map bpm
  on  bpm.provider  = s.provider::text
  and bpm.price_id  = s.provider_price_id
  and bpm.is_active = true
where s.status in ('active','trialing','past_due')
  and s.provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5'
  and bpm.price_id is null;
```

**5b. General Q5a detector (any unmapped paying sub) — should drop from 4→1
row; the 1 remaining is the `provider_price_id IS NULL` sub in §6, not a
map gap:**

```sql
select s.provider_price_id, count(*) as unmapped_subs
from public.subscriptions s
left join public.billing_price_map bpm
  on  bpm.provider  = s.provider::text
  and bpm.price_id  = s.provider_price_id
  and bpm.is_active = true
where s.status in ('active','trialing','past_due')
  and bpm.price_id is null
group by s.provider_price_id;
```

**5c. MRR sanity — the 3 yearly subs now resolve a mapped amount:**

```sql
select user_id, status, provider_price_id, plan_name, mapped_monthly_amount
from public.billing_mrr_inputs_v
where provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5';
-- expect 3 rows, each mapped_monthly_amount = 166666.67
```

---

## 6. Flags for separate dispatch

1. **#700 hand-patch was never applied to live prod.** Live `billing_price_map`
   still carries both `price_replace_*` placeholders (`is_active=true`) and the
   stale yearly `price_1TCW5p2NqcfRsoh4SghDrMQv` (0 real subs). PR #700
   reconciled the *migration file* only; its required one-shot SQL Editor patch
   was skipped. B42 fixes the missing row; a full reconciliation pass
   (placeholder cleanup + retire the stale yearly id) is a separate decision.

2. **1 active sub has `provider_price_id = NULL`.** Unmappable by design — a
   data-quality / webhook-ingestion gap, not a map gap. Needs its own triage
   (which user, why null, recover from its `raw_payload`).

3. **Codebase-ownership question (the real fix):**
   **"Where in the codebase should a `billing_price_map` row be created when a
   new Stripe price is set up?"** Repo grep shows `billing_price_map` is
   *read* by `admin-billing-metrics` and the `billing_mrr_inputs_v` view, and
   *seeded only* by `supabase/migrations/20260403000000_billing_price_map.sql`
   — which never runs against drifted live prod. The `stripe-webhook` edge
   function ingests subscriptions but does **not** upsert a price-map row from
   the price object it already receives in the payload. There is **no code
   path that keeps `billing_price_map` current** → every new Stripe price
   silently repeats this failure. Recommend a dispatch to either (a) have the
   stripe-webhook upsert `billing_price_map` from `price`/`plan` on
   subscription events, or (b) a documented operational checklist step tied to
   Stripe product creation.

---

## 7. Affected users (anonymized; real values in HTML comment for Chau)

- User A — active yearly, period → 2027-04-17 — `le…@gmail`
- User B — active yearly, period → 2027-05-10 — `lo…@gmail`
- User C — active yearly, period → 2027-04-01 — **no profiles row** (B30 brief did not list this 3rd user)

<!-- CHAU — real values, do not publish:
  User A  user_id=f591540c-312b-4f91-a413-3a6a0391a913  lethu86hn@gmail.com        period 2026-04-17 → 2027-04-17
  User B  user_id=ff198c71-83be-4b96-95e4-17a58fe29fed  longnguyencnt361@gmail.com period 2026-05-10 → 2027-05-10
  User C  user_id=115c2ecf-c215-4147-988c-37ad9cb516a0  (no profiles row; email unknown) period 2026-04-01 → 2027-04-01
  All 3: provider=stripe product=prod_UAfnlqhxFFLDE0 price=price_1TCKSF2K1tPxy04uNeKcQWp5 status=active cancel_at_period_end=false
-->

---

*B42 — read-only diagnostic. No DB writes. No PR. Branch `b42/price-map-missing-row`.*
