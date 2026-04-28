-- Path: supabase/migrations/20260608000000_2fa_phase_2.sql
--
-- 2FA Phase 2 — backup codes + recovery + server-side lockout.
--
-- Phase 1 (PR #199, migration 20260529) shipped TOTP enrollment +
-- aal=2 enforcement via RLS. Phase 2 layers on:
--   - mfa_backup_codes: 8 single-use bcrypt-hashed codes per user,
--     generated at enrollment and on regenerate
--   - mfa_lockouts: server-side 5-attempts-in-15-min → 30-min lockout
--   - helper functions used by the new edge functions
--
-- See reports/2fa-design-decisions-2026-04-27.md for the design call:
--   - Recovery requires password + backup code (NOT backup code alone),
--     matching GitHub / Google / GitLab / Stripe / 1Password / Authy
--   - Backup codes hashed with bcrypt (10 rounds) — verification runs
--     in an edge function, not in client code (RLS can't safely
--     compare hashes)
--   - Lockouts table is service-role-only (no client-readable RLS),
--     so a client cannot probe the lockout state of arbitrary users

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- 1. Backup codes table
-- ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mfa_backup_codes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  code_hash     text NOT NULL,
  used_at       timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  -- Ties 8 codes to one "regenerate" event so we can mark a whole
  -- generation invalid in a single query without delete-then-insert
  -- races when the user is logged in twice.
  generation_id uuid NOT NULL DEFAULT gen_random_uuid()
);

-- Fast lookup of unused codes for the verifier
CREATE INDEX IF NOT EXISTS mfa_backup_codes_user_unused_idx
  ON public.mfa_backup_codes (user_id)
  WHERE used_at IS NULL;

-- Lookup all codes for a generation (for regen-invalidate-old)
CREATE INDEX IF NOT EXISTS mfa_backup_codes_generation_idx
  ON public.mfa_backup_codes (user_id, generation_id);

ALTER TABLE public.mfa_backup_codes ENABLE ROW LEVEL SECURITY;

-- Owner can SELECT their own rows (to read used_at status for the UI),
-- but cannot INSERT/UPDATE/DELETE — those are service-role-only via
-- the edge functions. We deliberately don't expose code_hash through
-- views because reading the hash is useless to the client and adds
-- attack surface. See the SELECT policy below — we filter columns
-- via a view instead.
CREATE POLICY "mfa_backup_codes_owner_read"
  ON public.mfa_backup_codes
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policies → only service role can mutate.
-- The edge functions hold the service-role key.

-- ─────────────────────────────────────────────────────────────────────
-- 1b. View hiding the code_hash column from client-side queries.
-- The owner can read their backup-code STATUS via this view (id,
-- created_at, used_at, generation_id) without ever seeing the hash.
-- ─────────────────────────────────────────────────────────────────────
CREATE OR REPLACE VIEW public.mfa_backup_codes_status AS
  SELECT
    id,
    user_id,
    used_at,
    created_at,
    generation_id
  FROM public.mfa_backup_codes;

GRANT SELECT ON public.mfa_backup_codes_status TO authenticated;

-- ─────────────────────────────────────────────────────────────────────
-- 2. Lockouts table
-- ─────────────────────────────────────────────────────────────────────
-- One row per user. PRIMARY KEY user_id so insert-on-conflict-update
-- works as the natural state machine: every failed-attempt write
-- bumps failed_attempt_count + last_failure_at, and verifies clear
-- the row.
CREATE TABLE IF NOT EXISTS public.mfa_lockouts (
  user_id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  failed_attempt_count int NOT NULL DEFAULT 0,
  last_failure_at      timestamptz NOT NULL DEFAULT now(),
  lockout_until        timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.mfa_lockouts ENABLE ROW LEVEL SECURITY;

-- DELIBERATELY no SELECT/INSERT/UPDATE/DELETE policies for
-- authenticated users. Service-role bypasses RLS, so the edge
-- functions can read/write. Clients have NO access to this table —
-- they can't probe whether other users are locked out, and the only
-- way the UI learns about a lockout is via the 429 response from
-- mfa-challenge-rate-limit.

-- ─────────────────────────────────────────────────────────────────────
-- 3. Helpers
-- ─────────────────────────────────────────────────────────────────────

-- Returns the count of unused backup codes for the calling user.
-- Used by /account/security to render "X / 8 unused" without needing
-- to fetch all rows.
CREATE OR REPLACE FUNCTION public.mfa_backup_code_unused_count()
RETURNS int
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT COALESCE(count(*)::int, 0)
  FROM public.mfa_backup_codes
  WHERE user_id = auth.uid()
    AND used_at IS NULL;
$$;

REVOKE ALL ON FUNCTION public.mfa_backup_code_unused_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mfa_backup_code_unused_count() TO authenticated;

COMMENT ON FUNCTION public.mfa_backup_code_unused_count() IS
  'Count of unused MFA backup codes for the calling user. Used by '
  '/account/security to render "X/8 unused" without exposing the hashes.';

-- Returns the timestamp lockout_until for the calling user, or NULL
-- if not currently locked out. Returning NULL when the lockout has
-- expired (lockout_until < now) lets the client treat the response
-- as "no lockout" without needing to interpret timestamps.
CREATE OR REPLACE FUNCTION public.mfa_active_lockout()
RETURNS timestamptz
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public, auth
AS $$
  SELECT lockout_until
  FROM public.mfa_lockouts
  WHERE user_id = auth.uid()
    AND lockout_until IS NOT NULL
    AND lockout_until > now();
$$;

REVOKE ALL ON FUNCTION public.mfa_active_lockout() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mfa_active_lockout() TO authenticated;

COMMENT ON FUNCTION public.mfa_active_lockout() IS
  'Returns lockout_until for the calling user if currently locked out, '
  'NULL otherwise. Lets the client read its OWN lockout state without '
  'broad SELECT access on mfa_lockouts.';

-- ─────────────────────────────────────────────────────────────────────
-- 4. Sanity check — log table count after apply
-- ─────────────────────────────────────────────────────────────────────
DO $$
DECLARE
  bc_count int;
  lk_count int;
BEGIN
  SELECT count(*) INTO bc_count FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name = 'mfa_backup_codes';
  SELECT count(*) INTO lk_count FROM information_schema.tables
   WHERE table_schema = 'public' AND table_name = 'mfa_lockouts';
  RAISE NOTICE '2FA Phase 2 tables: mfa_backup_codes=%, mfa_lockouts=%',
    bc_count, lk_count;
END
$$;

COMMIT;
