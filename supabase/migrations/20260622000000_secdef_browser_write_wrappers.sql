-- SECURITY DEFINER wrappers for the two browser-written tables A59 left open.
--
-- WHY THIS EXISTS  (A72 — direct follow-up to A59 / #744)
-- ───────────────────────────────────────────────────────────────────────
-- 20260621000000_scope_legacy_public_policies.sql (A59) scoped 8 internal
-- INSERT policies to service_role + revoked anon/authenticated INSERT, and
-- DELIBERATELY EXCLUDED `system_logs` and `login_attempts` with this note:
--
--   "Both require a product decision (keep the anon/client path, or move
--    the write behind a SECURITY DEFINER RPC like log_security_event
--    already does for security_events) and are intentionally left
--    untouched here."
--
-- A72 takes the second option: the write moves behind a validated
-- SECURITY DEFINER RPC, exactly mirroring public.log_security_event (the
-- existing pattern for public.security_events). The function runs as its
-- owner, so its INSERT bypasses the table grant/RLS — the browser keeps
-- writing telemetry / brute-force rows, but ONLY through an input-
-- validating gate, and a direct anon/authenticated INSERT is now denied.
--
-- ZERO TELEMETRY REGRESSION (the regression A59's note warned about):
--   • system_logs  — keeps level/message/route/user_id/metadata. The
--                     brief's sketch signature
--                     `log_system_event(category, level, message, metadata)`
--                     was reconciled to the REAL table schema: there is no
--                     `category` column (verified across all migrations);
--                     `route` + `user_id` ARE columns admins query via the
--                     "Admins can view all system logs" policy and are
--                     preserved. `category` lives in metadata->>'scope'
--                     (logger.ts already puts scope there) — no schema
--                     change (out of scope / small-diff).
--   • login_attempts — keeps email/success/ip/user_agent AND the existing
--                     `failure_reason` column (also written today; dropping
--                     it would lose lockout context). created_at is set
--                     server-side (column default now()), no longer trusts
--                     the client clock.
--
-- PROJECT CONVENTION: function + GRANT/REVOKE + policy DDL is applied by
-- hand via the Supabase SQL Editor, NOT `supabase db push`. This file is
-- the reviewed artifact + the copy-paste source for that manual apply.
--
-- Idempotent: CREATE OR REPLACE FUNCTION; DROP POLICY IF EXISTS (legacy
-- AND new name) before CREATE; REVOKE/GRANT are no-ops when already in the
-- target state. Safe to re-run.
-- ───────────────────────────────────────────────────────────────────────

BEGIN;

-- ── 1. log_system_event ────────────────────────────────────────────────
-- Replaces the direct anon INSERT in src/lib/logger.ts. Validates level
-- (mirrors the table CHECK) and message; clamps lengths so a runaway
-- client string can't bloat the log table; coalesces metadata.
CREATE OR REPLACE FUNCTION public.log_system_event(
  _level    text,
  _message  text,
  _route    text  DEFAULT NULL,
  _user_id  uuid  DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log_id uuid;
BEGIN
  IF _level IS NULL OR _level NOT IN ('info', 'warn', 'error', 'debug') THEN
    RAISE EXCEPTION 'log_system_event: invalid level %', _level
      USING ERRCODE = '22023';
  END IF;

  IF _message IS NULL OR btrim(_message) = '' THEN
    RAISE EXCEPTION 'log_system_event: message is required'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.system_logs (level, message, route, user_id, metadata)
  VALUES (
    _level,
    left(_message, 10000),
    left(_route, 2048),
    _user_id,
    COALESCE(_metadata, '{}'::jsonb)
  )
  RETURNING id INTO log_id;

  RETURN log_id;
END;
$$;

-- ── 2. record_login_attempt ────────────────────────────────────────────
-- Replaces the direct anon INSERT in src/utils/securityUtils.ts
-- (trackLoginAttempt — runs in the pre-auth anon context to drive
-- brute-force lockout). Validates email shape + success; clamps lengths.
CREATE OR REPLACE FUNCTION public.record_login_attempt(
  _email          text,
  _success        boolean,
  _ip_address     text DEFAULT NULL,
  _user_agent     text DEFAULT NULL,
  _failure_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_id uuid;
BEGIN
  IF _email IS NULL OR btrim(_email) = '' THEN
    RAISE EXCEPTION 'record_login_attempt: email is required'
      USING ERRCODE = '22023';
  END IF;

  -- basic shape only (this is telemetry, not validation of a real inbox):
  -- an '@' not in first position, and within RFC 5321 length.
  IF position('@' in _email) < 2 OR length(_email) > 320 THEN
    RAISE EXCEPTION 'record_login_attempt: malformed email'
      USING ERRCODE = '22023';
  END IF;

  IF _success IS NULL THEN
    RAISE EXCEPTION 'record_login_attempt: success is required'
      USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.login_attempts (
    email, ip_address, user_agent, success, failure_reason
  )
  VALUES (
    left(_email, 320),
    left(_ip_address, 100),
    left(_user_agent, 1024),
    _success,
    left(_failure_reason, 500)
  )
  RETURNING id INTO attempt_id;

  RETURN attempt_id;
END;
$$;

-- ── 3. Lock function execution to the roles that need it ────────────────
-- Postgres default-grants EXECUTE to PUBLIC; revoke then re-grant so the
-- only callers are the browser (anon/authenticated) and edge fns
-- (service_role). These names are brand-new (grep-verified: zero prior
-- callers), so the REVOKE FROM PUBLIC cannot break an existing path.
REVOKE EXECUTE ON FUNCTION public.log_system_event(text, text, text, uuid, jsonb)         FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.record_login_attempt(text, boolean, text, text, text)   FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.log_system_event(text, text, text, uuid, jsonb)         TO anon, authenticated, service_role;
GRANT  EXECUTE ON FUNCTION public.record_login_attempt(text, boolean, text, text, text)   TO anon, authenticated, service_role;

-- ── 4. system_logs — retire the PUBLIC INSERT policy, lock to RPC ───────
-- Legacy "System can insert logs" was FOR INSERT WITH CHECK (true) with no
-- TO clause (PUBLIC, incl. anon). The service_role policy is a
-- defense-in-depth / intent marker (service_role bypasses RLS anyway); the
-- REVOKE is the operative lock. SELECT stays admin-only (untouched).
DROP POLICY IF EXISTS "System can insert logs"     ON public.system_logs;
DROP POLICY IF EXISTS "system_logs_service_insert" ON public.system_logs;
CREATE POLICY "system_logs_service_insert"
  ON public.system_logs FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.system_logs FROM anon, authenticated;

-- ── 5. login_attempts — retire the PUBLIC INSERT policy, lock to RPC ────
-- Legacy "System can insert login attempts" was FOR INSERT WITH CHECK
-- (true), PUBLIC. SELECT is already admin-only ("Only admins view login
-- attempts") — the anon recentFailures SELECT in securityUtils.ts is
-- already RLS-filtered to 0 rows today, so this changes no read path.
DROP POLICY IF EXISTS "System can insert login attempts" ON public.login_attempts;
DROP POLICY IF EXISTS "login_attempts_service_insert"    ON public.login_attempts;
CREATE POLICY "login_attempts_service_insert"
  ON public.login_attempts FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.login_attempts FROM anon, authenticated;

COMMIT;
