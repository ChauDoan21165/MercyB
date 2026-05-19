-- ============================================================================
-- B64 — Remediation: add the missing live Stripe yearly price row to
--        public.billing_price_map (silent MRR undercount; #700 drift class).
--
-- STATUS:    HANDOFF ONLY. NOT EXECUTED by B64. A read-only diagnostic (B42)
--            produced this; B64 only assembled it into a paste-ready block.
--            Apply ONCE via the Supabase SQL Editor, human-reviewed. Never
--            `supabase db push`. There is no unattended SQL path to this
--            Supabase (CLAUDE.md -> Supabase; project_db_schema_drift_audit).
--
-- EVIDENCE:  reports/RUNBOOK-price-map-row-B42.md (branch b42/price-map-missing
--            -row) is the paired evidence doc — it justifies every value below
--            from authoritative subscriptions.raw_payload (service-role READ).
--            Do NOT trust this .sql standalone; read B42 first.
--            Source finding: B30 Q5a (reports/RECON-monitor-query-baseline
--            -B30.md) — Stripe price absent from billing_price_map.
--
-- SCOPE:     Exactly ONE reference row, natural-keyed on
--            (provider='stripe', price_id='price_1TCKSF2K1tPxy04uNeKcQWp5').
--            ON CONFLICT (provider, price_id) makes the write touch only that
--            one key — it is structurally incapable of altering any other row
--            (this is the INSERT-into-reference-table analogue of B29 part 1
--            PK-targeting: the natural key IS the target; no predicate sweep).
--
-- EXCLUDED:  - price_1TCW5p2NqcfRsoh4SghDrMQv (stale yearly id, maps 0 real
--              subs) — left intact; retiring it is the separate full-#700
--              reconciliation decision (B42 section 6, flag 1). NOT touched.
--            - price_replace_monthly / price_replace_yearly placeholder seeds
--              — the optional cosmetic cleanup in PART C is FENCED OFF from
--              the core fix and disabled by default; the INSERT does not need
--              it (B42 section 3 scope discipline: smallest safe diff).
--            - Every *.subscriptions / *.user_subscriptions row — untouched.
--
-- INDEPENDENT ENTITLEMENTS (B29 part 2, adapted): billing_price_map is
--            read-side MRR-math reference data ONLY. Entitlement derives from
--            subscriptions.status, NOT from price_id (B42 section 1). This
--            write therefore cannot grant, revoke, or alter entitlement for
--            ANY user — gift comps (public.user_subscriptions,
--            is_gift_redemption=true) and manual grants live in a different
--            table that this block does not reference. The only effect is to
--            make ~6,000,000 VND/yr of already-earned revenue visible to MRR.
--
-- LEGACY LABEL: plan_name 'VIP Yearly' is a legacy billing label internal to
--            MRR math, NOT a user-facing tier (MercyBlade has no VIP tier —
--            CLAUDE.md non-negotiable 5 / B42 section 4). Kept verbatim only
--            to match the existing rows and the billing_mrr_inputs_v JOIN.
--            Do not propagate "VIP" to any user-facing surface.
--
-- >>> GATE — DO NOT RUN THE INSERT UNTIL THIS IS DONE <<<
--   plan_name below ('VIP Yearly') is the ONLY non-recovered value. Every
--   other field is filled from authoritative raw_payload (B42 section 1).
--   Before flipping ROLLBACK -> COMMIT you MUST complete B42 section 2:
--     1. Stripe Dashboard -> confirm LIVE mode (these are real paying subs).
--     2. Product catalog -> Prices -> search price_1TCKSF2K1tPxy04uNeKcQWp5
--     3. Confirm product = prod_UAfnlqhxFFLDE0; capture its display name.
--        Codebase convention for the 2M VND/yr plan is 'VIP Yearly' — keep
--        that for JOIN consistency UNLESS the Stripe product name dictates
--        otherwise. If it differs, edit plan_name on the marked line below.
--     4. If amount / currency / interval differ from raw_payload (2,000,000
--        VND zero-decimal / VND / year / interval_count=1) — STOP, do not
--        paste, re-diagnose (they are expected to match).
-- ============================================================================

BEGIN;

-- ---- PART A · PREVIEW (run first; nothing persists under ROLLBACK) ---------

-- A1. Current billing_price_map (pre-state). Expect the 4 drifted live rows
--     (2 price_replace_* placeholders + the real monthly + the stale yearly);
--     price_1TCKSF2K1tPxy04uNeKcQWp5 is NOT among them.
SELECT provider, price_id, plan_name, billing_interval, interval_count,
       monthly_amount, yearly_amount, currency, is_active
FROM   public.billing_price_map
ORDER  BY is_active DESC, provider, price_id;

-- A2. Targeted absence proof — MUST return 0 rows BEFORE the INSERT.
--     (This is the row the fix adds; 0 rows here is the bug.)
SELECT provider, price_id, plan_name, is_active
FROM   public.billing_price_map
WHERE  provider = 'stripe'
  AND  price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5';
-- expect 0 rows (pre-INSERT)

-- A3. B42 section 5a pre-state — the 3 active yearly subs are currently
--     UNMAPPED (no active price-map row). Expect 3 rows BEFORE the INSERT.
SELECT s.user_id, s.provider_price_id, s.status
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  s.provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5'
  AND  bpm.price_id IS NULL;
-- expect 3 rows (pre-INSERT); MUST become 0 in PART D (D1)

-- ---- PART B · THE FIX — add the one missing reference row -----------------
-- Idempotency (B29 part 3): ON CONFLICT (provider, price_id) DO UPDATE makes
-- a second paste a no-op convergence (re-sets the same values + updated_at),
-- never a duplicate-insert or error. expect: 1 row inserted (0 inserted / 1
-- updated on any re-run).
INSERT INTO public.billing_price_map (
  provider, price_id, plan_name, billing_interval, interval_count,
  monthly_amount, yearly_amount, currency, is_active, notes
) VALUES (
  'stripe',
  'price_1TCKSF2K1tPxy04uNeKcQWp5',
  'VIP Yearly',          -- <<< CONFIRM plan_name 'VIP Yearly' in Stripe
                         --     Dashboard before running (header GATE step 3).
                         --     Legacy billing label, not a user tier.
  'year',
  1,
  166666.67,             -- 2000000 / 12, monthly-normalized MRR (mirrors the
                         --   existing yearly row)
  2000000.00,            -- Stripe unit_amount=2000000; VND is zero-decimal,
                         --   this IS 2,000,000 VND — do NOT divide by 100
  'VND',
  true,
  'B64 (per RUNBOOK-price-map-row-B42.md): reconciled live yearly price id; '
  || 'matches Pricing.tsx + all 3 active yearly subs raw_payload; #700 hand-'
  || 'patch was never applied to live prod (migration drift, 2nd occurrence).'
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

-- ---- PART C · OPTIONAL cosmetic cleanup (SEPARATE from the fix) -----------
-- DISABLED BY DEFAULT. The core fix (PART B) does NOT require this. The two
-- price_replace_* placeholder seeds map to 0 real subs, so they cause no MRR
-- error today; flipping them is_active=false is purely cosmetic hygiene and
-- is a different decision than B64's scope (B42 section 6, flag 1). It does
-- NOT touch the stale price_1TCW5p2NqcfRsoh4SghDrMQv row. To apply it,
-- UNCOMMENT the UPDATE below. Idempotency-guarded (AND is_active = true) so a
-- re-run matches 0 rows.
--
-- UPDATE public.billing_price_map
-- SET    is_active  = false,
--        notes      = COALESCE(notes,'') ||
--                      ' [B64: deactivated unreconciled placeholder seed]',
--        updated_at = now()
-- WHERE  provider = 'stripe'
--   AND  price_id IN ('price_replace_monthly','price_replace_yearly')
--   AND  is_active = true;                       -- idempotency; expect 2 rows

-- ---- PART D · VERIFY-AFTER (re-run B30 Q5a — expect 0) --------------------

-- D1. B42 section 5a / B30 Q5a TARGETED — MUST return 0 rows after the INSERT
--     (the 3 subs from A3 are now mapped). This is the pass/fail check.
SELECT s.user_id, s.provider_price_id, s.status
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  s.provider_price_id = 'price_1TCKSF2K1tPxy04uNeKcQWp5'
  AND  bpm.price_id IS NULL;
-- expect 0 rows  <-- PRIMARY SUCCESS CRITERION

-- D2. B42 section 5b / B30 Q5a GENERAL detector — drops 4 -> 1 row. The 1
--     remaining is the provider_price_id IS NULL sub (separate data-quality
--     issue, B42 section 6 flag 2), NOT a price-map gap.
SELECT s.provider_price_id, count(*) AS unmapped_subs
FROM   public.subscriptions s
LEFT JOIN public.billing_price_map bpm
  ON  bpm.provider  = s.provider::text
  AND bpm.price_id  = s.provider_price_id
  AND bpm.is_active = true
WHERE  s.status IN ('active','trialing','past_due')
  AND  bpm.price_id IS NULL
GROUP  BY s.provider_price_id;
-- expect 1 row: (provider_price_id = NULL, unmapped_subs = 1)

-- D3. B42 section 5c — MRR sanity: the 3 yearly subs now resolve an amount.
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
-- expect 1 row: 'VIP Yearly', year, 1, 166666.67, 2000000.00, VND, is_active=t

-- D5. GUARD — the other live rows were NOT disturbed. The real monthly and
--     the (deliberately untouched) stale yearly must be unchanged; the two
--     price_replace_* keep whatever PART C left them (true unless C was run).
SELECT price_id, plan_name, is_active
FROM   public.billing_price_map
WHERE  provider = 'stripe'
  AND  price_id IN ('price_1TCKY02K1tPxy04uCHQNbvik',
                    'price_1TCW5p2NqcfRsoh4SghDrMQv',
                    'price_replace_monthly',
                    'price_replace_yearly')
ORDER  BY price_id;
-- expect: monthly real = active; stale yearly = active (untouched, by design);
--         the 2 placeholders = active (unless OPTIONAL PART C was uncommented)

-- ============================================================================
-- First run with ROLLBACK below. Read PART D output. Confirm:
--   D1 = 0 rows, D2 = 1 row (NULL price), D3 = 3 rows @ 166666.67,
--   D4 = the new row, D5 = others undisturbed.
-- ONLY THEN change the single word `ROLLBACK;` to `COMMIT;` and re-run.
ROLLBACK;
-- ============================================================================

-- CHAU — affected users (anonymized in body; full values here, do not publish).
-- All 3 are real paying yearly subs on price_1TCKSF2K1tPxy04uNeKcQWp5,
-- provider=stripe, product=prod_UAfnlqhxFFLDE0, status=active,
-- cancel_at_period_end=false. Source: B42 RUNBOOK section 7 (raw_payload).
--   User A  user_id=f591540c-312b-4f91-a413-3a6a0391a913
--           lethu86hn@gmail.com           period 2026-04-17 -> 2027-04-17
--   User B  user_id=ff198c71-83be-4b96-95e4-17a58fe29fed
--           longnguyencnt361@gmail.com    period 2026-05-10 -> 2027-05-10
--   User C  user_id=115c2ecf-c215-4147-988c-37ad9cb516a0
--           (no profiles row; email unknown)  period 2026-04-01 -> 2027-04-01
-- ============================================================================
