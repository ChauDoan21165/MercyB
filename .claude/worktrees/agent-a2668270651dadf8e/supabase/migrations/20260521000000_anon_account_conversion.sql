-- Anonymous → permanent account conversion.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- A1's anon-auth bootstrap (#163), A5's cleanup migration (#164),
-- per-IP rate limit (#171), and mock-interview server gate (#177) ship
-- the anon-auth infrastructure. Last gap: a clean conversion path so
-- a visitor who started anonymously can save their progress without
-- losing speech_attempts, streak counters, leaderboard position,
-- mercy_user_facts, etc.
--
-- TWO PATHS, TWO SHAPES
-- ───────────────────────────────────────────────────────────────────────
-- 1. EMAIL/PASSWORD: handled entirely via auth.admin.updateUser() in
--    the edge function. Same auth.users.id is preserved, is_anonymous
--    flips to false, all FK references survive automatically. No SQL
--    needed beyond the telemetry write.
-- 2. OAUTH (Google / Apple): a NEW auth.users row is created by the
--    OAuth flow, and we MERGE the anon user's owned rows into the new
--    one before deleting the anon user. This SQL function runs the
--    merge atomically.
--
-- TABLES MIGRATED ON OAUTH MERGE
-- ───────────────────────────────────────────────────────────────────────
-- The brief names: speech_attempts, streaks (profiles columns),
-- leaderboard, mercy_user_facts, user_room_progress. We also migrate
-- mock_interview_sessions and user_xp because they're per-user state
-- that drives the new gates. Tables NOT migrated (kept CASCADE-on-anon-
-- delete semantics): rate-limit logs, telemetry hits, audit trails —
-- those are per-session bookkeeping, not user-owned content.
--
-- ATOMIC: the function runs inside a single Postgres transaction so
-- either the full merge succeeds or nothing changes.
--
-- TELEMETRY
-- ───────────────────────────────────────────────────────────────────────
-- account_conversions records every conversion attempt + result.
-- Drives the conversion-rate funnel dashboard and time-to-convert
-- distribution. Service-role only (the edge function writes; no
-- client-side reads).

-- ── 1. Telemetry table ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.account_conversions (
  id                 bigserial PRIMARY KEY,
  anon_user_id       uuid NOT NULL,
  permanent_user_id  uuid,
  conversion_source  text NOT NULL
                       CHECK (conversion_source IN ('email', 'google', 'apple', 'other')),
  status             text NOT NULL
                       CHECK (status IN ('success', 'failed_email_in_use', 'failed_weak_password', 'failed_other')),
  error_code         text,
  anon_session_age_seconds  integer,
  attempted_at       timestamptz NOT NULL DEFAULT now(),
  completed_at       timestamptz
);

CREATE INDEX IF NOT EXISTS idx_account_conversions_attempted_at
  ON public.account_conversions (attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_account_conversions_status_source
  ON public.account_conversions (status, conversion_source, attempted_at DESC);

ALTER TABLE public.account_conversions ENABLE ROW LEVEL SECURITY;
-- service-role only.

COMMENT ON TABLE public.account_conversions IS
  'One row per conversion attempt (anonymous → email/oauth). Drives the conversion-rate funnel dashboard. Admin-internal; RLS denies all client access.';


-- ── 2. Merge function (OAuth path) ───────────────────────────────────────
--
-- Called from the account-convert edge function ONLY on the OAuth path.
-- Email/password conversion uses auth.admin.updateUser() instead and
-- needs no merge.
--
-- Atomic via a single function body — Postgres wraps function execution
-- in an implicit transaction. Any RAISE EXCEPTION rolls back every row
-- touched by the function.

CREATE OR REPLACE FUNCTION public.merge_anon_user_into_permanent(
  p_anon_id       uuid,
  p_permanent_id  uuid
)
RETURNS TABLE (
  rows_migrated_total  integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_total integer := 0;
  v_count integer;
BEGIN
  IF p_anon_id IS NULL OR p_permanent_id IS NULL THEN
    RAISE EXCEPTION 'merge_anon: both ids required';
  END IF;
  IF p_anon_id = p_permanent_id THEN
    RAISE EXCEPTION 'merge_anon: anon and permanent ids cannot match';
  END IF;

  -- Verify the anon row is genuinely anonymous before we touch anything.
  -- Belt-and-suspenders: the edge function already checks, but DB-level
  -- enforcement guards against a bad RPC caller.
  IF NOT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = p_anon_id AND is_anonymous = true
  ) THEN
    RAISE EXCEPTION 'merge_anon: source user % is not anonymous', p_anon_id;
  END IF;

  -- ── speech_attempts ─────────────────────────────────────────────────
  UPDATE public.speech_attempts
     SET user_id = p_permanent_id
   WHERE user_id = p_anon_id;
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_total := v_total + v_count;

  -- ── user_room_progress ──────────────────────────────────────────────
  -- Conflict path: same (user_id, app_id, room_id) might already exist
  -- on the permanent user (rare — they wouldn't normally have any rows
  -- yet on a fresh OAuth signup). Take the higher progress_pct on
  -- conflict; otherwise straight UPDATE.
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_room_progress'
  ) THEN
    INSERT INTO public.user_room_progress (
      user_id, app_id, room_id, progress_pct, last_seen_at, created_at, updated_at
    )
    SELECT
      p_permanent_id,
      app_id,
      room_id,
      progress_pct,
      last_seen_at,
      created_at,
      updated_at
    FROM public.user_room_progress
    WHERE user_id = p_anon_id
    ON CONFLICT (user_id, app_id, room_id) DO UPDATE
      SET progress_pct = GREATEST(public.user_room_progress.progress_pct, EXCLUDED.progress_pct),
          last_seen_at = GREATEST(public.user_room_progress.last_seen_at, EXCLUDED.last_seen_at);
    GET DIAGNOSTICS v_count = ROW_COUNT;
    v_total := v_total + v_count;

    DELETE FROM public.user_room_progress WHERE user_id = p_anon_id;
  END IF;

  -- ── mercy_user_facts ────────────────────────────────────────────────
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'mercy_user_facts'
  ) THEN
    UPDATE public.mercy_user_facts
       SET user_id = p_permanent_id
     WHERE user_id = p_anon_id;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    v_total := v_total + v_count;
  END IF;

  -- ── mock_interview_sessions ─────────────────────────────────────────
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'mock_interview_sessions'
  ) THEN
    UPDATE public.mock_interview_sessions
       SET user_id = p_permanent_id
     WHERE user_id = p_anon_id;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    v_total := v_total + v_count;
  END IF;

  -- ── user_xp (leaderboard scoring) ───────────────────────────────────
  -- Strategy: SUM the anon XP into the permanent row if it exists,
  -- else INSERT a new row. Then delete the anon row.
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'user_xp'
  ) THEN
    INSERT INTO public.user_xp (user_id, total_xp, last_xp_at)
    SELECT p_permanent_id, total_xp, last_xp_at FROM public.user_xp WHERE user_id = p_anon_id
    ON CONFLICT (user_id) DO UPDATE
      SET total_xp = public.user_xp.total_xp + EXCLUDED.total_xp,
          last_xp_at = GREATEST(
            COALESCE(public.user_xp.last_xp_at, '1970-01-01'::timestamptz),
            COALESCE(EXCLUDED.last_xp_at, '1970-01-01'::timestamptz)
          );
    GET DIAGNOSTICS v_count = ROW_COUNT;
    v_total := v_total + v_count;

    DELETE FROM public.user_xp WHERE user_id = p_anon_id;
  END IF;

  -- ── profiles (streak counters + miscellanea) ───────────────────────
  -- The permanent user already has a profiles row from the OAuth-side
  -- handle_new_user trigger. Promote the better-of streak fields onto
  -- it from the anon row, then delete the anon profile (which cascades
  -- the auth.users row below).
  IF EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    UPDATE public.profiles AS p
       SET
         streak_current = GREATEST(
           COALESCE(p.streak_current, 0),
           COALESCE((SELECT streak_current FROM public.profiles WHERE id = p_anon_id), 0)
         ),
         streak_longest = GREATEST(
           COALESCE(p.streak_longest, 0),
           COALESCE((SELECT streak_longest FROM public.profiles WHERE id = p_anon_id), 0)
         ),
         streak_last_studied_date = GREATEST(
           COALESCE(p.streak_last_studied_date, '1970-01-01'::date),
           COALESCE((SELECT streak_last_studied_date FROM public.profiles WHERE id = p_anon_id), '1970-01-01'::date)
         )
     WHERE p.id = p_permanent_id;

    DELETE FROM public.profiles WHERE id = p_anon_id;
    GET DIAGNOSTICS v_count = ROW_COUNT;
    v_total := v_total + v_count;
  END IF;

  -- ── auth.users — drop the anon row last ───────────────────────────
  -- Any tables we DIDN'T enumerate above with ON DELETE CASCADE on
  -- their auth.users FK get cleaned up here. Tables with NO ACTION
  -- (rate-limit logs etc.) keep their hashed/anonymized rows — they
  -- aren't tied to the user's identity any more.
  DELETE FROM auth.users WHERE id = p_anon_id;

  RETURN QUERY SELECT v_total;
END;
$$;

COMMENT ON FUNCTION public.merge_anon_user_into_permanent(uuid, uuid) IS
  'Merge an anonymous user''s owned rows into a permanent user, then delete the anon row. Atomic. Service-role only.';

REVOKE ALL ON FUNCTION public.merge_anon_user_into_permanent(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.merge_anon_user_into_permanent(uuid, uuid) FROM anon;
REVOKE ALL ON FUNCTION public.merge_anon_user_into_permanent(uuid, uuid) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.merge_anon_user_into_permanent(uuid, uuid) TO service_role;
