-- ============================================================================
-- B53 — Remediation: delete 2 stale price_replace_* placeholder rows from
--       public.billing_price_map (PR #700's hand patch was never applied).
--
-- STATUS:    HANDOFF ONLY. NOT EXECUTED by B53. A read-only service-role
--            diagnostic produced this. Apply ONCE via the Supabase SQL
--            Editor, human-reviewed. Never `supabase db push`. There is no
--            unattended SQL path to this Supabase.
-- EVIDENCE:  reports/RECON-price-data-quality-B53.md  (the PK list, the
--            "zero consumers" proof, and the PR #700 root cause are
--            justified there; do not trust this file standalone).
-- SCOPE:     EXACTLY 2 rows in public.billing_price_map, by primary key:
--              19a53680-13f1-4bf4-bdb1-a7b4c12080ce  price_replace_monthly
--              0384314a-78fb-4153-af06-31aae8e22c72  price_replace_yearly
-- EXCLUDED:  - billing_price_map id b950361e-fe86-4263-82e6-03ed61fbe616
--              (price_1TCW5p2NqcfRsoh4SghDrMQv, the WRONG yearly id). NOT
--              touched here — repointing it to price_1TCKSF2K1tPxy04uNeKcQWp5
--              is B42's territory (b42/price-map-missing-row RUNBOOK). B53
--              does not write that row to avoid a two-agent collision.
--            - subscription a03266db-… (the reviewer comp, B53 Finding 1):
--              no safe attribution; decision-gated, see the recon doc. Not
--              an executable here.
-- INDEPENDENT ENTITLEMENTS: NONE are reachable by this DELETE.
--            billing_price_map is a price→amount REFERENCE table; no user
--            entitlement derives from it (entitlement = subscription.status;
--            PR #700's recomputeAndPersistEntitlement.test asserts a wrong
--            price_id must NOT lock a user). No application code reads this
--            table (grep: only the migration + one test comment). The only
--            reader is the view billing_mrr_inputs_v, which LEFT JOINs on
--            provider_price_id; ZERO subscriptions reference
--            'price_replace_monthly'/'price_replace_yearly', so the DELETE
--            removes 0 join rows and changes MRR by exactly nothing. The
--            GUARD block below proves this empirically before COMMIT.
-- ============================================================================

BEGIN;

-- ---- PREVIEW (run first; expect EXACTLY 2 rows, both price_replace_*) ------
SELECT id, provider, price_id, plan_name, is_active, created_at
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');   -- PK-targeted, part 1

-- ---- GUARD-BEFORE: no subscription references the placeholder price_ids ---
-- Expect 0 rows. If this returns ANY row, STOP — do not COMMIT (the rows are
-- not dead and the recon's zero-consumer premise is violated).
SELECT id, user_id, status, provider_price_id
FROM   public.subscriptions
WHERE  provider_price_id IN ('price_replace_monthly', 'price_replace_yearly');

-- ---- DELETE (PK + idempotency-guarded; expect 2 rows) ---------------------
DELETE FROM public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72')   -- PK, not predicate
  AND  provider = 'stripe'                               -- discriminator
  AND  price_id IN ('price_replace_monthly',
                    'price_replace_yearly');             -- idempotency, part 3
                    -- second run: rows gone -> 0 matched -> safe no-op.

-- ---- VERIFY-AFTER: the 2 PKs are gone ------------------------------------
SELECT id, price_id
FROM   public.billing_price_map
WHERE  id IN ('19a53680-13f1-4bf4-bdb1-a7b4c12080ce',
              '0384314a-78fb-4153-af06-31aae8e22c72');   -- expect 0 rows

-- ---- VERIFY-AFTER: real price rows untouched, count == 2 -----------------
-- Expect exactly the 2 real Stripe rows still present:
--   price_1TCKY02K1tPxy04uCHQNbvik (monthly), and the yearly row
--   (still price_1TCW5p2NqcfRsoh4SghDrMQv until B42's reconciliation runs).
SELECT id, price_id, plan_name, is_active
FROM   public.billing_price_map
ORDER  BY created_at;                                    -- expect 2 rows

-- ---- GUARD-AFTER: billing_mrr_inputs_v join unaffected -------------------
-- Expect IDENTICAL row count / amounts to a pre-run snapshot of this query.
-- The placeholders contributed 0 join rows, so MRR inputs must be unchanged.
SELECT count(*)                              AS mrr_input_rows,
       count(*) FILTER (WHERE mapped_monthly_amount IS NULL) AS unmapped_rows
FROM   public.billing_mrr_inputs_v;

-- First run with ROLLBACK. Read PREVIEW (=2 rows), GUARD-BEFORE (=0 rows),
-- VERIFY-AFTER (PK rows = 0, real rows = 2), GUARD-AFTER (mrr rows unchanged).
-- Only then change the line below to `COMMIT;` and re-run.
ROLLBACK;
-- ============================================================================
