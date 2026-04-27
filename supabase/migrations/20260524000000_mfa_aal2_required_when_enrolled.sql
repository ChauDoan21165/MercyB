-- Path: supabase/migrations/20260524000000_mfa_aal2_required_when_enrolled.sql
--
-- 2FA Phase 1 — server-side enforcement of aal=2 for users with a
-- verified MFA factor.
--
-- WHY THIS MIGRATION:
--   The Phase 1 client wires a TOTP prompt after `signInWithPassword`,
--   but the prompt is a UI gate only. supabase.auth.signInWithPassword
--   establishes an aal=1 session and persists it to localStorage BEFORE
--   the prompt renders. Without server-side enforcement an attacker
--   with the user's password can:
--     1. Enter password → aal=1 session created
--     2. Skip the TOTP prompt by URL-bar navigating to /account
--     3. RequireAuth sees `user` is truthy, lets them through
--     4. RLS-protected reads succeed at aal=1 because no policy gates
--        on aal=2
--   That makes 2FA a placebo. This migration closes the gap.
--
-- THE PATTERN — "require_aal2_when_factor_present":
--   Add a RESTRICTIVE policy to every sensitive table that says:
--     allow IF (jwt.aal = 'aal2'  OR  user has no verified factor)
--   Effect:
--     - Users WITHOUT MFA enrolled: policy is a no-op (the OR branch
--       is true; existing permissive policies decide access).
--     - Users WITH MFA enrolled: must have aal=2; aal=1 sessions are
--       blocked from reading or writing the table.
--   RESTRICTIVE policies AND with permissive policies, so existing
--   `auth.uid() = id`-style rules keep working — the new policy adds
--   a gate, never widens access.
--
-- SCOPE:
--   ~30 tables covering: identity (profiles, security status), AI
--   memory (mercy_*, teacher_memory, companion_state), billing &
--   payments (subscriptions, gifts, payment proofs, access codes,
--   developer keys), admin surfaces (admin_*, audit_logs, security
--   events, email_audit), and per-user activity (sessions, notes,
--   placements, interview sessions). Public surfaces (room registry,
--   leaderboards) are intentionally NOT gated — they don't carry
--   user-identifying data beyond what the user opted in to share.
--
-- OPERATIONAL NOTES:
--   - For ~99% of current users (none have MFA enrolled today), this
--     migration is a no-op. The `OR NOT EXISTS (...)` branch is true.
--   - Only when a user enrolls MFA do the aal=2 requirements kick in.
--   - The aal2 requirement on auth.mfa_factors itself is intentionally
--     skipped — that table is owned by Supabase Auth, and the MFA
--     enrollment flow needs to write to it before the user has a
--     verified factor (chicken-and-egg).
--
-- See reports/2fa-design-decisions-2026-04-27.md and the security
-- review that flagged the original aal=1 bypass.

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- Helper function: returns true if the calling user has any verified
-- MFA factor. Marked STABLE + SECURITY DEFINER so the policy can read
-- auth.mfa_factors without each policy needing direct grants on it.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.user_has_verified_mfa()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM auth.mfa_factors
    WHERE user_id = auth.uid()
      AND status = 'verified'
  );
$$;

COMMENT ON FUNCTION public.user_has_verified_mfa() IS
  'Returns true iff the calling user has any verified MFA factor. '
  'Used by aal2-required RESTRICTIVE policies so the policy is a no-op '
  'for users who have not enrolled MFA yet.';

REVOKE ALL ON FUNCTION public.user_has_verified_mfa() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.user_has_verified_mfa() TO authenticated, anon;

-- ─────────────────────────────────────────────────────────────────────
-- Helper function: returns true if the calling session is at aal=2.
-- Same SECURITY DEFINER posture so policies don't need raw JWT access.
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.session_is_aal2()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    (current_setting('request.jwt.claims', true)::jsonb ->> 'aal') = 'aal2',
    false
  );
$$;

COMMENT ON FUNCTION public.session_is_aal2() IS
  'Returns true iff the current session JWT carries aal=aal2. '
  'Used by the aal2-required RESTRICTIVE policy template.';

REVOKE ALL ON FUNCTION public.session_is_aal2() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.session_is_aal2() TO authenticated, anon;

-- ─────────────────────────────────────────────────────────────────────
-- The RESTRICTIVE policy template. Applied per-table below.
-- We use a per-table policy (not one shared) so DROP POLICY IF EXISTS
-- works cleanly during downgrades and per-table RLS audits remain
-- self-contained.
--
-- Policy semantics:
--   USING:  must satisfy on read  (and on UPDATE/DELETE old-row check)
--   WITH CHECK: must satisfy on insert/update new-row
-- Both clauses use the same predicate: aal2 OR no-MFA-enrolled.
-- ─────────────────────────────────────────────────────────────────────

-- A small DO block to apply the same policy across many tables without
-- copy-pasting 30× the same statements. The SQL is plain, not dynamic
-- on user input — table names are hardcoded literals.
DO $apply$
DECLARE
  t text;
  tables text[] := ARRAY[
    -- Identity & security
    'profiles',
    'user_security_status',
    'user_placements',
    'user_sessions',

    -- AI memory & conversations (high PII)
    'mercy_user_facts',
    'mercy_messages',
    'mercy_conversations',
    'teacher_memory',
    'companion_state',
    'companion_events',

    -- Billing & payments
    'user_subscriptions',
    'subscription_usage',
    'payment_proof_submissions',
    'bank_payment_requests',
    'bank_transfer_orders',
    'gift_subscriptions',
    'gift_codes',
    'access_codes',
    'access_code_redemptions',
    'user_promo_redemptions',
    'family_plans',
    'family_plan_members',
    'family_plan_invites',
    'corporate_accounts',
    'corporate_seats',
    'corporate_seat_invites',
    'user_referrals',

    -- Developer surface (API keys are high-impact)
    'developer_accounts',
    'developer_api_keys',

    -- Admin surfaces
    'admin_users',
    'admin_logs',
    'admin_access_audit',
    'admin_notifications',
    'admin_notification_preferences',
    'admin_notification_settings',
    'audit_logs',
    'security_events',
    'email_audit',

    -- Per-user activity records
    'mock_interview_sessions',
    'interview_sessions',
    'user_notes',
    'user_path_progress',
    'user_moderation_status',
    'user_moderation_violations'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- Only apply if the table actually exists. Several of these tables
    -- were created in older / squashed migrations; we don't want a
    -- single missing table to abort the entire migration.
    IF EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = t
    ) THEN
      -- Make sure RLS is on (most should be already, but belt-and-braces).
      EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);

      -- Drop the old policy if a previous run created it — this lets
      -- the migration be re-applied safely during dev / rollback /
      -- replay scenarios.
      EXECUTE format(
        'DROP POLICY IF EXISTS "require_aal2_when_factor_present" ON public.%I',
        t
      );

      -- Create the RESTRICTIVE policy. Combined via AND with whatever
      -- existing permissive policies the table already has, so we are
      -- adding a gate, never widening access.
      EXECUTE format($pol$
        CREATE POLICY "require_aal2_when_factor_present"
        ON public.%I
        AS RESTRICTIVE
        FOR ALL
        TO authenticated
        USING (
          public.session_is_aal2() OR NOT public.user_has_verified_mfa()
        )
        WITH CHECK (
          public.session_is_aal2() OR NOT public.user_has_verified_mfa()
        )
      $pol$, t);
    END IF;
  END LOOP;
END
$apply$;

-- ─────────────────────────────────────────────────────────────────────
-- Sanity check: log how many tables were gated. Visible in the
-- migration output during apply; not a data row, just a NOTICE.
-- ─────────────────────────────────────────────────────────────────────

DO $$
DECLARE
  n integer;
BEGIN
  SELECT count(*) INTO n
  FROM pg_policies
  WHERE schemaname = 'public'
    AND policyname = 'require_aal2_when_factor_present';
  RAISE NOTICE 'aal2-gated tables: % (expected ~30 — varies if some tables predate this app)', n;
END
$$;

COMMIT;
