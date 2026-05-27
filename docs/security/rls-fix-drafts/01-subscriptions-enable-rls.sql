-- ─────────────────────────────────────────────────────────────────────────
-- DRAFT — DO NOT APPLY FROM THIS LOCATION
-- ─────────────────────────────────────────────────────────────────────────
-- This file lives in docs/security/rls-fix-drafts/, NOT in
-- supabase/migrations/. C-side cannot apply destructive SQL. A-side
-- (Chau / ChatGPT) reviews, decides scope/timing, and — if accepted —
-- copies the operative parts into a new, timestamped file under
-- supabase/migrations/, applies via Supabase SQL Editor, and records
-- the result.
--
-- Finding: !84 §1 finding #1 — CRITICAL.
-- Tracker: NEW row to add — currently not in
--          reports/A-SIDE-monetization-auth-release-gate-tracker.md.
-- ─────────────────────────────────────────────────────────────────────────
--
-- Background
-- ----------
-- `public.subscriptions` was created in
--   supabase/migrations/20260315211233_unified_entitlements_and_subscriptions.sql:3
-- and holds raw provider webhook payloads:
--   user_id, provider (stripe/apple/google), provider_customer_id,
--   provider_subscription_id, provider_transaction_id, product_id,
--   environment, status, current_period_start/end, cancel_at_period_end,
--   canceled_at, ended_at, raw_payload jsonb, created_at, updated_at
--
-- The batch RLS-enable migration
--   supabase/migrations/20260422020000_enable_rls_on_exposed_tables.sql
-- closed 11 sibling tables (stripe_events, apple_iap_events, etc.) but
-- did NOT include `public.subscriptions`. The table has been live for
-- ~2.5 months with no RLS protection.
--
-- Repro (read-only, as any authenticated session):
--   SELECT user_id, provider, status, raw_payload
--   FROM public.subscriptions LIMIT 10;
--   -- → returns rows.
--
-- Why this is CRITICAL: every authenticated user can read every other
-- user's billing-provider identifiers, subscription status, and the
-- raw webhook payload (which often contains email, customer name,
-- partial card metadata depending on provider event type).
--
-- Why this pattern (vs the "RLS enabled, no policies" pattern used in
-- 20260422020000 for stripe_events etc.):
--   `public.subscriptions` IS queried from the client by authenticated
--   users (see edge function `me-entitlement` and several admin
--   surfaces that read it via service-role). The right shape is:
--   per-user own-row read + admin-level read; never client write.
--
-- Risk of applying THIS migration
-- -------------------------------
-- - LOW for the client read path: every read site I could identify in
--   the browser bundle is scoped by user_id implicitly (via session)
--   or by edge functions that use service-role and bypass RLS anyway.
--   The per-user RLS policy matches the existing intent.
-- - MEDIUM for admin tooling: any admin SELECT that does NOT pass
--   `Authorization` with a level-9+ admin's JWT will silently return
--   empty after this migration. Verify the admin dashboard queries
--   (`/admin/billing*` and `/admin/users*`) before applying.
-- - ZERO for the edge-function write path: service-role bypasses RLS.
--
-- A-side should:
--   1. Audit every browser SELECT against `public.subscriptions` (grep
--      `from('subscriptions')` in src/ and edge functions in
--      supabase/functions/).
--   2. Verify each is either (a) service-role (no impact), (b) own-row
--      read by authenticated user (handled by the user policy below),
--      or (c) admin read (handled by the admin policy below).
--   3. Apply via SQL Editor in prod with explicit Chau approval — per
--      tracker rule "destructive DB operations require explicit Chau
--      per-operation approval".
--   4. Verify post-apply: run the repro SELECT from an anon SDK; expect
--      zero rows or RLS error.

-- ── Step 1. Enable RLS on the table ──────────────────────────────────────

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- ── Step 2. User-own-row SELECT policy ───────────────────────────────────
-- Authenticated users see only their own subscription rows. Anon sees
-- nothing.

DROP POLICY IF EXISTS "subscriptions_own_select" ON public.subscriptions;

CREATE POLICY "subscriptions_own_select"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Step 3. Admin SELECT policy ──────────────────────────────────────────
-- Level-9+ admins read everything. Uses the existing
-- public.get_admin_level() helper.

DROP POLICY IF EXISTS "subscriptions_admin_select" ON public.subscriptions;

CREATE POLICY "subscriptions_admin_select"
  ON public.subscriptions
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

-- ── Step 4. NO write policies for clients ────────────────────────────────
-- Writes are exclusively service-role (webhook handlers in
-- supabase/functions/stripe-webhook, apple-iap-sync, etc., which bypass
-- RLS). Leaving INSERT/UPDATE/DELETE without policies makes the table
-- effectively read-only for all non-service-role callers. This matches
-- the explicit pattern from 20260422020000 §"Server-only tables".

-- ── Step 5. Explicit grants ──────────────────────────────────────────────
-- Postgres rejects a SELECT before RLS is evaluated if the role lacks
-- table-level SELECT. The batch migration learned this the hard way for
-- entitlement_events; same pattern here.

GRANT SELECT ON public.subscriptions TO authenticated;
-- Anon is NOT granted; the table is invisible to logged-out callers.

-- ── Step 6. Comments for the next auditor ────────────────────────────────

COMMENT ON TABLE public.subscriptions IS
  'Provider subscription webhook ledger. Per-user RLS enforced: '
  'authenticated reads own row; level-9+ admin reads all; writes are '
  'service-role-only. Raw provider payloads in raw_payload jsonb. '
  'RLS enabled retroactively after !84 audit finding.';

-- ── Verification (run after apply, copy results into the MR) ─────────────
-- 1. RLS enabled:
--   SELECT relname, relrowsecurity, relforcerowsecurity
--     FROM pg_class
--    WHERE relname = 'subscriptions' AND relnamespace = 'public'::regnamespace;
--   Expect relrowsecurity = true.
--
-- 2. Policies present:
--   SELECT polname, polcmd, polroles::regrole[], pg_get_expr(polqual, polrelid)
--     FROM pg_policy
--    WHERE polrelid = 'public.subscriptions'::regclass;
--   Expect two SELECT policies (own + admin).
--
-- 3. Negative test (as anon SDK, no session):
--   SELECT count(*) FROM public.subscriptions;
--   Expect 0.
--
-- 4. Positive test (as authenticated user A):
--   SELECT count(*) FROM public.subscriptions WHERE user_id = auth.uid();
--   Expect their own row count (likely 0 or 1).
--   SELECT count(*) FROM public.subscriptions WHERE user_id != auth.uid();
--   Expect 0 (filtered by RLS).
--
-- 5. Admin test (as level-9+ admin):
--   SELECT count(*) FROM public.subscriptions;
--   Expect total row count.
