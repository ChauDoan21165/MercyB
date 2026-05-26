# SQL P0 — D4 bridge: `billing_price_map` 1-row INSERT + `raw_payload` feasibility (A8)

**Agent:** A8 (parallel-rail packaging) · **Branch:** `chore/price-map-insert-package`
**Labels:** silent-failure, money-path, P0, bridge
**Cross-refs (all committed, all pushed to `origin`):**
- `reports/RUNBOOK-price-map-row-B42.md` on `origin/b42/price-map-missing-row`
- `reports/REMEDIATION-price-map-repair-B64.sql` on `origin/b64/price-map-repair-sql`
- `reports/RECON-mrr-source-D4-A8.md` on `origin/b69/d4-mrr-source-strategic`
- `reports/RECON-monitor-query-baseline-B30.md` (committed to `main` @ `98e05a40`)

> **Purpose.** Package the paste-ready bridge SQL Chau needs at the SQL Editor
> for **today's** silent ≈6,000,000 VND/yr MRR undercount, and gate the
> downstream D4 backfill on a single read-only feasibility query. **No SQL is
> executed by this agent** (D6: no unattended catalog path to this Supabase).

---

## Block 1 — B30 validation summary

B30's Phase-0 read-only validation (single atomic service-role snapshot,
`2026-05-19T16:38:35Z`) ran all 5 of B7's money-path detection queries against
prod. Q1/Q2/Q3a/Q4 came back **VERIFIED MATCH** — they re-found the known sets
(B21's 3 `[object Object]` deletions, the 3-row phantom-MRR cohort including
mylinh, and the confirmed real-money-taken / access-lapsed case `mylinh @
2026-05-09T07:18Z invoice.paid`). Q3b was flagged **QUERY TOO BROAD** (matches
NULL-price comp rows; refinement filed to B7). Q5a was the **NOVEL FINDING**
and the trigger for this bridge: a whole live Stripe yearly price —
`price_1TCKSF2K1tPxy04uNeKcQWp5` — is **completely absent from
`billing_price_map`**, so **3 active yearly subscribers (≥2 with profiles,
sub-end dates in 2027)** are silently contributing **0 VND** to the admin
"Estimated MRR" KPI. At 2,000,000 VND/year × 3 subs this is the
≈6,000,000 VND/yr invisibility the bridge below extinguishes. This is the
**same #700-class drift recurring** (2nd documented occurrence) — see A8's
D4 RECON for why the structural fix is to retire the map (end-state b2,
`unit_amount` on the row) and B64's SQL for the bridge that ships **now**.

---

## Block 2 — the 1-row INSERT SQL (copy-ready)

**Authority.** This block is the verbatim P0 fix from
`origin/b64/price-map-repair-sql` (full file:
`reports/REMEDIATION-price-map-repair-B64.sql`). The values are recovered from
authoritative `subscriptions.raw_payload` by B42. The `BEGIN; … ROLLBACK;`
frame is **intentional** — first run prints PART D verification rows; only after
those all match expectations is `ROLLBACK;` flipped to `COMMIT;` and re-run.
Idempotency is guaranteed by `ON CONFLICT (provider, price_id) DO UPDATE`.

> **Pre-flight (Chau, Stripe Dashboard, LIVE mode, before flipping COMMIT):**
> 1. Confirm price `price_1TCKSF2K1tPxy04uNeKcQWp5` exists on product
>    `prod_UAfnlqhxFFLDE0` with amount **2,000,000 VND / year** (zero-decimal).
> 2. Capture the product display name. Codebase convention for the 2M VND/yr
>    plan is `'VIP Yearly'` (legacy billing label, **not** a user-facing tier —
>    keep verbatim for `billing_mrr_inputs_v` JOIN consistency).
> 3. If amount/currency/interval **differ** from raw_payload → **STOP**,
>    re-diagnose, do not paste.

```sql
-- ============================================================================
-- D4 BRIDGE — add missing live Stripe yearly price row to
--             public.billing_price_map. Apply ONCE via Supabase SQL Editor,
--             human-reviewed. Never `supabase db push`. Source-of-truth:
--             reports/REMEDIATION-price-map-repair-B64.sql (read full file
--             first; it carries the complete PART A pre-state probes and the
--             PART D verification block).
-- ============================================================================

BEGIN;

-- ---- PART A · PREVIEW (run first; nothing persists under ROLLBACK) ---------

-- A1. Pre-state: full billing_price_map. Expect 4 rows; the target price_id
--     is NOT among them.
SELECT provider, price_id, plan_name, billing_interval, interval_count,
       monthly_amount, yearly_amount, currency, is_active
FROM   public.billing_price_map
ORDER  BY is_active DESC, provider, price_id;

-- A2. Targeted absence proof — MUST return 0 rows BEFORE the INSERT.
SELECT provider, price_id, plan_name, is_active
FROM   public.billing_price_map
WHERE  provider = 'stripe'
  AND  price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5';
-- expect 0 rows (pre-INSERT)

-- A3. The 3 active yearly subs are currently UNMAPPED. Expect 3 rows.
SELECT s.user_id, s.provider_price_id, s.status
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  s.provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5'
  AND  bpm.price_id IS NULL;
-- expect 3 rows (pre-INSERT)

-- ---- PART B · THE FIX — add the one missing reference row -----------------
INSERT INTO public.billing_price_map (
  provider, price_id, plan_name, billing_interval, interval_count,
  monthly_amount, yearly_amount, currency, is_active, notes
) VALUES (
  'stripe',
  'price_1TCKSF2K1tPxy04uNeKcQWp5',
  'VIP Yearly',          -- legacy billing label; confirm against Stripe Dashboard
  'year',
  1,
  166666.67,             -- 2000000 / 12, monthly-normalized for MRR view
  2000000.00,            -- Stripe unit_amount; VND is zero-decimal — do NOT /100
  'VND',
  true,
  'D4 bridge (A8 packaging of B64): reconciled live yearly price id; matches '
  || 'Pricing.tsx + all 3 active yearly subs raw_payload; #700 hand-patch was '
  || 'never applied to live prod (migration drift, 2nd occurrence).'
)
ON CONFLICT (provider, price_id) DO UPDATE SET
  plan_name        = EXCLUDED.plan_name,
  billing_interval = EXCLUDED.billing_interval,
  interval_count   = EXCLUDED.interval_count,
  monthly_amount   = EXCLUDED.monthly_amount,
  yearly_amount    = EXCLUDED.yearly_amount,
  currency         = EXCLUDED.currency,
  is_active        = EXCLUDED.is_active,
  notes            = EXCLUDED.notes,
  updated_at       = now();

-- ---- PART D · VERIFY-AFTER -------------------------------------------------

-- D1. PRIMARY SUCCESS CRITERION — re-run A3; MUST return 0 rows.
SELECT s.user_id, s.provider_price_id, s.status
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  s.provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5'
  AND  bpm.price_id IS NULL;
-- expect 0 rows

-- D2. General unmapped detector drops 4 → 1 (the remaining is the NULL
--     provider_price_id comp row, separate issue).
SELECT s.provider_price_id, count(*) AS unmapped_subs
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  bpm.price_id IS NULL
GROUP  BY s.provider_price_id;
-- expect 1 row: (NULL, 1)

-- D3. MRR sanity: 3 yearly subs now resolve.
SELECT user_id, status, provider_price_id, plan_name, mapped_monthly_amount
FROM   public.billing_mrr_inputs_v
WHERE  provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5';
-- expect 3 rows, each mapped_monthly_amount = 166666.67

-- D4. The new reference row exists and is correct.
SELECT provider, price_id, plan_name, billing_interval, interval_count,
       monthly_amount, yearly_amount, currency, is_active
FROM   public.billing_price_map
WHERE  provider = 'stripe'
  AND  price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5';
-- expect 1 row matching the INSERT

-- ============================================================================
-- First run with ROLLBACK below. Read PART D. Only when D1=0, D2=1 (NULL),
-- D3=3 rows, D4=1 row matching → flip ROLLBACK to COMMIT and re-run.
ROLLBACK;
-- ============================================================================
```

---

## Block 3 — D4 backfill feasibility gate (read-only `raw_payload` completeness)

**Authority.** This is the read-only query A8 (the D4 strategic RECON, branch
`b69/d4-mrr-source-strategic`) calls out as **flip-condition #4** — the single
data-quality check that gates whether end-state (b2) (retire the map; persist
`unit_amount` from `raw_payload`) is feasible **without** a Stripe-API
backfill.

```sql
-- Read-only. Service-role via SQL Editor. Returns one number.
SELECT count(*) AS unit_amount_missing
FROM   public.subscriptions
WHERE  status IN ('active','trialing','past_due')
  AND  provider = 'stripe'
  AND  (
         raw_payload IS NULL
         OR raw_payload #> '{items,data,0,price,unit_amount}' IS NULL
       );
-- expect 0
```

**Why this number matters.** D4's recommendation is to retire
`billing_price_map` and read the amount off `subscriptions.raw_payload` (the
amount already arrives on every price-bearing Stripe event and is already
persisted). A `0` here means the historical backfill that variant (b2) needs
is feasible **from the database alone** — no Stripe-API replay. A non-zero
means some active rows are pre-`team_c` / pre-`20260319` and the (b2) backfill
has gaps the map does not.

---

## Block 4 — if `unit_amount_missing > 0`

**Do NOT proceed to the D4 backfill yet.** Specifically:

1. **The Block-2 INSERT still ships now, unchanged.** It is the bridge; its
   value does not depend on the (b2) feasibility. Apply via SQL Editor as
   documented, flip to COMMIT once PART D matches, stop the bleed today.
2. **Hold the D4 (b2) workstream.** Per A8's D4 RECON flip-condition #4, a
   non-zero count flips the recommendation: **(a) + B52 Option A becomes the
   stop-gap** (Option A self-heals the map on the next paid event for any sub
   that ever transacts), and (b2) is deferred until either:
   - the historical gaps are repaired from the Stripe API into `raw_payload`
     (Chau-applied, D6), at which point the same query returns 0 and (b2)
     re-becomes feasible; **or**
   - a Stripe-API-driven backfill path is written directly into the (b2)
     migration itself, raising its cost (no longer purely DB-internal).
3. **Open a follow-up RECON.** Bucket the non-zero rows by `created_at` decade
   and by which JSON path is missing (`raw_payload IS NULL` vs.
   `items.data[0].price.unit_amount IS NULL` vs. nested under a different
   shape). Some pre-`team_c` rows may carry the amount on a different
   `raw_payload` key — the count alone does not distinguish "truly empty" from
   "schema-shifted".
4. **Do NOT widen the query to "fix the count".** Lowering the bar (e.g.,
   `OR raw_payload IS NOT NULL`) defeats the gate. The gate exists precisely
   because (b2) reads exactly this JSON path; if it is null on real rows, (b2)
   will compute 0 MRR for them.

If the count is **0**: D4 (b2) backfill is feasible from `raw_payload` alone.
Proceed to the (b2) implementation dispatch (still gated behind B48-P1 per A8
RECON §Recommendation).

---

## Status

- **No SQL executed.** Bridge SQL handed to Chau; D6 honored.
- **No production data touched.**
- **No code edited.** Pure docs PR.

*A8 packaging-only. Source authorship: B42 (RUNBOOK), B64 (paste-ready SQL),
A8/b69 (D4 RECON + completeness query), B30 (Q5a finding). All source branches
pushed to `origin` (see Cross-refs).*
