-- ============================================================================
-- REMEDIATION: raw_payload backfill for 2 public.subscriptions rows (A15)
-- ============================================================================
-- Convention: B29 operator-SQL (header / RESOLVE / PREVIEW / mutation /
--             VERIFY / ROLLBACK wrapper). Chau-applied via Supabase SQL
--             Editor. NOT executed by an agent. NOT a PR.
--
-- WHY
--   Two Stripe subscription rows are missing the canonical Stripe Subscription
--   object in `raw_payload`, so `raw_payload->'items'->'data'->0->'price'->>
--   'unit_amount'` is absent. The webhook freshness/conflict-resolution path
--   (supabase/functions/stripe-webhook/billing.ts) reads `raw_payload`; these
--   two rows have no usable subscription payload to compare against.
--
--     Row 1  id  a03266db-9618-4c28-9a06-44594b66524c
--            user c4780775-7f21-487b-8f1c-73dc88da1cf9
--            yearly, created 2026-04-28
--            raw_payload IS NULL  -> no Stripe object at all
--
--     Row 2  id  62455ab3-5737-41a3-891f-0779b4dab493
--            user cd9b889c-eb9f-428f-9462-de66d4f92c04
--            monthly, "mylinh"
--            raw_payload holds an INVOICE object (object != 'subscription')
--            -> wrong object type; lacks subscription items[].price.unit_amount
--
-- WHAT THIS WRITES
--   ONLY public.subscriptions.raw_payload (+ updated_at) for exactly these two
--   PKs. No status, no current_period_end, no provider ids touched.
--
-- INDEPENDENCE GUARD
--   Entitlement does NOT read raw_payload. Verified in
--   supabase/functions/get-subscription-status/index.ts (filters on
--   `status='active'`, reads profiles.premium_status / premium_expires_at) and
--   the schema in 20260315211233_unified_entitlements_and_subscriptions.sql
--   (entitlement consumes `status` + `current_period_end` columns). raw_payload
--   is consumed only by the stripe-webhook upsert freshness logic. Therefore
--   this script is entitlement-neutral and SAFE TO RUN INDEPENDENTLY of A2's
--   "mylinh" fix — they touch disjoint concerns (A2: status/period; A15:
--   raw_payload only) on row 62455ab3 and do not race on the same columns.
--
-- IDEMPOTENT
--   Each UPDATE is PK-by-id and predicate-guarded so re-running it after a
--   correct payload is already present is a no-op (0 rows). PK-only, never a
--   broad predicate.
--
-- DO NOT INVENT PAYLOAD VALUES
--   ‹STRIPE_PAYLOAD_ROW1› and ‹STRIPE_PAYLOAD_ROW2› are placeholders. Chau
--   fills them with the live Stripe Subscription JSON (retrieval in STEP A).
-- ============================================================================


-- ----------------------------------------------------------------------------
-- STEP 0 — RESOLVE STRIPE IDS  (run alone first; copy the output. NOT a mutation)
-- ----------------------------------------------------------------------------
-- The backfill needs each row's Stripe subscription id (sub_...). It is stored
-- on the row in `provider_subscription_id` (mirror seam: `subscription_id`).
-- The Stripe customer id (cus_...) is in `provider_customer_id` (mirror seam:
-- `customer_id`) — the fallback path if the subscription id is NULL.
SELECT
  id,
  user_id,
  provider,
  provider_subscription_id,
  subscription_id,
  provider_customer_id,
  customer_id,
  status,
  current_period_end,
  raw_payload IS NULL                              AS raw_payload_is_null,
  raw_payload->>'object'                           AS raw_payload_object
FROM public.subscriptions
WHERE id IN (
  'a03266db-9618-4c28-9a06-44594b66524c',
  '62455ab3-5737-41a3-891f-0779b4dab493'
);
-- Expected:
--   Row 1 (a03266db…): raw_payload_is_null = true,  raw_payload_object = NULL
--   Row 2 (62455ab3…): raw_payload_is_null = false, raw_payload_object = 'invoice'
-- Record provider_subscription_id (or provider_customer_id if it is NULL) for
-- each — needed in STEP A.


-- ----------------------------------------------------------------------------
-- STEP A — HOW CHAU RETRIEVES THE STRIPE PAYLOAD  (manual; no DB here)
-- ----------------------------------------------------------------------------
-- Goal: obtain the full Stripe **Subscription** object JSON (it has
--       "object": "subscription" and items.data[0].price.unit_amount) for each
--       of the two subscription ids surfaced by STEP 0.
--
-- Use LIVE-mode keys (these are production rows). Pick ONE path:
--
-- A.1  Stripe CLI (recommended — emits exact API JSON):
--        stripe subscriptions retrieve <SUB_ID> --live
--      or, equivalently:
--        stripe get /v1/subscriptions/<SUB_ID> --live
--      The full JSON it prints is what goes into the placeholder verbatim.
--
-- A.2  Raw API (curl), if no CLI:
--        curl -s https://api.stripe.com/v1/subscriptions/<SUB_ID> \
--          -u "<STRIPE_LIVE_SECRET_KEY>:"
--      (Subscription retrieve already expands items.data[].price, so
--       items.data[0].price.unit_amount is present in the response.)
--
-- A.3  If STEP 0 showed provider_subscription_id IS NULL for a row (possible
--      for the raw_payload-NULL Row 1), resolve the sub id from the customer:
--        stripe subscriptions list --customer <CUS_ID> --live
--      then retrieve the matching sub via A.1/A.2. Match by plan interval:
--      Row 1 = yearly, Row 2 = monthly.
--
-- A.4  Dashboard cross-check (to locate the sub id, not to copy JSON):
--        https://dashboard.stripe.com/subscriptions/<SUB_ID>
--      or via the customer:
--        https://dashboard.stripe.com/customers/<CUS_ID>  -> Subscriptions tab
--      The Dashboard does not export raw JSON cleanly; use A.1/A.2 for the
--      actual payload.
--
-- Paste each retrieved JSON object as a single-quoted JSONB literal into the
-- matching placeholder below (escape any embedded single quote as '').
-- Use the Subscription object EXACTLY as returned. Do not hand-edit, trim, or
-- add wrapper keys.


-- ============================================================================
-- TRANSACTION — review VERIFY output before deciding COMMIT vs ROLLBACK
-- ============================================================================
BEGIN;

-- ----------------------------------------------------------------------------
-- PREVIEW — rows that the mutation WILL touch (same predicate as the UPDATEs)
-- ----------------------------------------------------------------------------
SELECT
  id,
  raw_payload IS NULL          AS is_null,
  raw_payload->>'object'       AS current_object
FROM public.subscriptions
WHERE id IN (
        'a03266db-9618-4c28-9a06-44594b66524c',
        '62455ab3-5737-41a3-891f-0779b4dab493'
      )
  AND (raw_payload IS NULL OR raw_payload->>'object' IS DISTINCT FROM 'subscription');
-- NULL-safe form of the brief's `raw_payload->>'object' != 'subscription'`:
-- IS DISTINCT FROM also matches a non-null payload whose 'object' key is
-- missing/NULL (e.g. an invoice object), which a plain `!=` would skip.
-- Expect 2 rows pre-fix; 0 rows if already backfilled correctly.


-- ----------------------------------------------------------------------------
-- MUTATION — one statement per row, PK-by-id, idempotency-guarded
-- ----------------------------------------------------------------------------

-- Row 1 — a03266db (user c4780775, yearly, raw_payload IS NULL)
UPDATE public.subscriptions
SET raw_payload = '‹STRIPE_PAYLOAD_ROW1›'::jsonb,
    updated_at  = timezone('utc', now())
WHERE id = 'a03266db-9618-4c28-9a06-44594b66524c'
  AND (raw_payload IS NULL OR raw_payload->>'object' IS DISTINCT FROM 'subscription');

-- Row 2 — 62455ab3 (user cd9b889c, monthly, "mylinh", raw_payload = invoice)
UPDATE public.subscriptions
SET raw_payload = '‹STRIPE_PAYLOAD_ROW2›'::jsonb,
    updated_at  = timezone('utc', now())
WHERE id = '62455ab3-5737-41a3-891f-0779b4dab493'
  AND (raw_payload IS NULL OR raw_payload->>'object' IS DISTINCT FROM 'subscription');


-- ----------------------------------------------------------------------------
-- VERIFY — confirm both rows now carry a Subscription object with unit_amount
-- ----------------------------------------------------------------------------
SELECT
  id,
  raw_payload->>'object'                                          AS obj,
  raw_payload->'items'->'data'->0->'price'->>'unit_amount'        AS unit_amount,
  raw_payload->'items'->'data'->0->'price'->>'currency'           AS currency,
  status,
  current_period_end
FROM public.subscriptions
WHERE id IN (
  'a03266db-9618-4c28-9a06-44594b66524c',
  '62455ab3-5737-41a3-891f-0779b4dab493'
);
-- PASS criteria for BOTH rows:
--   obj          = 'subscription'
--   unit_amount  IS NOT NULL  (integer minor units, e.g. yearly/monthly price)
--   status / current_period_end UNCHANGED from STEP 0 (this script never
--   writes them — entitlement stays exactly as it was).


-- ----------------------------------------------------------------------------
-- COMMIT / ROLLBACK
-- ----------------------------------------------------------------------------
-- If VERIFY shows obj='subscription' AND a non-null unit_amount for BOTH rows
-- and status/current_period_end are unchanged: replace the line below with
--   COMMIT;
-- Otherwise leave it as ROLLBACK; (default-safe — nothing is persisted).
ROLLBACK;
-- ============================================================================
-- END REMEDIATION-raw-payload-backfill-A15.sql
-- ============================================================================
