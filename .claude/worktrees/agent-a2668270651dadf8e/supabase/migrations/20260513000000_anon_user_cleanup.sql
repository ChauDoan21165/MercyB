-- Anonymous user cleanup — 30-day TTL with active-user safety net.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- A1's anonymous-auth PR ships dark behind a feature flag. Before
-- flipping the flag on in production, we need automated cleanup of
-- abandoned anonymous accounts. Without it, every visitor (including
-- bots, scrapers, and one-shot tirekickers) creates an `auth.users`
-- + `profiles` row that lives forever. At ~1k visits/day that's
-- ~30k anonymous profiles per month — pure dead weight on storage,
-- query plans, and any future cohort math.
--
-- This migration installs:
--   1. `public.anonymous_user_cleanup_log` — telemetry per cron run.
--   2. `public.cleanup_anonymous_users()` — SECURITY DEFINER function
--      that deletes anonymous users older than 30 days WHO HAVEN'T
--      USED THE APP IN THE LAST 7 DAYS, then writes one log row.
--   3. A `pg_cron` schedule that calls the function daily at 03:00 UTC
--      (10:00 ICT) — outside both Vietnamese and US peak hours.
--
-- WHEN TO RAISE / LOWER THE 30-DAY THRESHOLD
-- ───────────────────────────────────────────────────────────────────────
-- Current threshold: 30 days inactive → delete.
--   Lower it (e.g. 14 days) if anon-table growth outpaces cleanup, or
--     if the conversion-from-anon-to-account rate concentrates in the
--     first week (which we'd see in the cleanup log over time).
--   Raise it (e.g. 60-90 days) if real users are reporting "I lost my
--     progress" complaints because they bounced for a month and came
--     back expecting their anon session to still exist.
--
-- HOW TO MANUALLY INVOKE
-- ───────────────────────────────────────────────────────────────────────
-- From the SQL editor, signed in as service_role:
--   SELECT public.cleanup_anonymous_users();
-- The function returns the number of rows deleted and writes the same
-- count + runtime to `anonymous_user_cleanup_log`.
--
-- HOW TO DISABLE
-- ───────────────────────────────────────────────────────────────────────
-- One-shot pause:
--   UPDATE cron.job SET active = false WHERE jobname = 'cleanup-anonymous-users';
-- Permanent removal:
--   SELECT cron.unschedule('cleanup-anonymous-users');
--   DROP FUNCTION IF EXISTS public.cleanup_anonymous_users();
--   DROP TABLE IF EXISTS public.anonymous_user_cleanup_log;
--
-- SAFETY GUARDS
-- ───────────────────────────────────────────────────────────────────────
-- 1. `is_anonymous = true` filter — never touches password/oauth users.
-- 2. `created_at < now() - interval '30 days'` — newly-converted users
--    keep their account.
-- 3. Active-user exclusion — any anonymous user with at least one row
--    in `public.speech_attempts` from the last 7 days is preserved,
--    regardless of `created_at`. Even an "anonymous" user actively
--    practicing is a real user we don't want to wipe.
-- 4. CASCADE delete from `auth.users(id)` already drops every
--    downstream row (profiles, speech_attempts, etc.) via existing FK
--    `ON DELETE CASCADE` definitions. This function does not need to
--    enumerate child tables.

-- ── 1. pg_cron pre-flight ──────────────────────────────────────────────
-- pg_cron is enabled on the project per prior cron infrastructure
-- (compounding analytics, materialized view refresh comments). Idempotent
-- create-if-not-exists so a fresh project bootstrap also works.
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;


-- ── 2. Telemetry table ─────────────────────────────────────────────────
-- One row per cleanup invocation (cron + manual). RLS denies all client
-- access; only service_role (used by the function + the SQL editor)
-- can read or write.

CREATE TABLE IF NOT EXISTS public.anonymous_user_cleanup_log (
  id                  bigserial PRIMARY KEY,
  run_at              timestamptz NOT NULL DEFAULT now(),
  users_deleted_count integer NOT NULL,
  runtime_ms          integer NOT NULL,
  invoked_by          text NOT NULL DEFAULT 'cron'
                       CHECK (invoked_by IN ('cron', 'manual'))
);

CREATE INDEX IF NOT EXISTS idx_anonymous_user_cleanup_log_run_at
  ON public.anonymous_user_cleanup_log (run_at DESC);

ALTER TABLE public.anonymous_user_cleanup_log ENABLE ROW LEVEL SECURITY;
-- No policies on purpose: with RLS enabled and zero policies,
-- anon + authenticated requests get zero rows. service_role bypasses
-- RLS, so the function and admin SQL editor still work.

COMMENT ON TABLE public.anonymous_user_cleanup_log IS
  'Audit trail for cleanup_anonymous_users(). One row per invocation. Admin-internal; RLS denies all client access.';


-- ── 3. The cleanup function ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.cleanup_anonymous_users()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, extensions
AS $$
DECLARE
  v_started_at  timestamptz := clock_timestamp();
  v_deleted     integer     := 0;
  v_runtime_ms  integer;
  v_invoker     text;
BEGIN
  -- Detect cron vs manual: pg_cron sets the role to 'postgres' and runs
  -- in a session named like 'pg_cron'. Manual SQL-editor calls run
  -- as service_role. We don't enforce this — it's just a label for
  -- the log row so post-hoc dashboards can split the two.
  v_invoker := CASE
    WHEN current_setting('application_name', true) ILIKE '%cron%' THEN 'cron'
    ELSE 'manual'
  END;

  WITH eligible AS (
    SELECT u.id
    FROM auth.users u
    WHERE u.is_anonymous = true
      AND u.created_at < now() - interval '30 days'
      AND NOT EXISTS (
        -- Active-user safety: skip anon accounts with any speech
        -- activity in the last 7 days.
        SELECT 1
        FROM public.speech_attempts sa
        WHERE sa.user_id = u.id
          AND sa.created_at > now() - interval '7 days'
      )
  ),
  deleted AS (
    DELETE FROM auth.users
    WHERE id IN (SELECT id FROM eligible)
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_deleted FROM deleted;

  v_runtime_ms := EXTRACT(EPOCH FROM (clock_timestamp() - v_started_at)) * 1000;

  INSERT INTO public.anonymous_user_cleanup_log (
    users_deleted_count, runtime_ms, invoked_by
  )
  VALUES (v_deleted, v_runtime_ms, v_invoker);

  RETURN v_deleted;
END;
$$;

COMMENT ON FUNCTION public.cleanup_anonymous_users() IS
  'Delete anonymous auth.users older than 30 days with no speech_attempts in the last 7 days. SECURITY DEFINER — only service_role may execute. Returns deletion count; writes telemetry to anonymous_user_cleanup_log.';

-- Lock down execution. The function runs as DEFINER (postgres / supabase
-- superuser) so revoke from PUBLIC and grant only to service_role.
REVOKE ALL ON FUNCTION public.cleanup_anonymous_users() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.cleanup_anonymous_users() FROM anon;
REVOKE ALL ON FUNCTION public.cleanup_anonymous_users() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.cleanup_anonymous_users() TO service_role;


-- ── 4. Daily cron schedule ─────────────────────────────────────────────
-- 03:00 UTC = 10:00 ICT. Quiet hour for both Vietnamese and US users
-- so any unexpected slowdown doesn't land on peak interactive traffic.
-- Re-running this migration is safe: unschedule first if the job
-- already exists, then re-schedule with the current command body.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-anonymous-users') THEN
    PERFORM cron.unschedule('cleanup-anonymous-users');
  END IF;

  PERFORM cron.schedule(
    'cleanup-anonymous-users',
    '0 3 * * *',
    $cron$ SELECT public.cleanup_anonymous_users(); $cron$
  );
END $$;
