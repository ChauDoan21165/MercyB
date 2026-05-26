-- 20260518000000_push_notifications.sql
--
-- A9 — Mobile push notification infrastructure.
--
-- Tables created here:
--   1. push_tokens           — APNs/FCM tokens per device per user.
--   2. push_preferences      — per-user toggles, quiet hours, daily-practice time.
--   3. push_send_log         — audit trail for every push attempt.
--
-- Ships dark: tables exist and the edge function honors them, but no
-- cron schedule is started and no production users have tokens yet.
-- Flip on after Apple/Google review approves the bundle.
--
-- Privacy:
--   - Tokens are sensitive (anyone with a token can push to that device).
--     Owner can SELECT their own rows; service_role bypasses RLS for
--     the send-push edge function. NO anon access.
--   - push_send_log rows reference user_id but are admin-internal.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- ── 1. push_tokens ───────────────────────────────────────────────────-

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'push_platform') THEN
    CREATE TYPE public.push_platform AS ENUM ('ios', 'android', 'web');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'push_token_status') THEN
    CREATE TYPE public.push_token_status AS ENUM ('active', 'invalid', 'revoked');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.push_tokens (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token         text NOT NULL,
  platform      public.push_platform NOT NULL,
  device_id     text,
  status        public.push_token_status NOT NULL DEFAULT 'active',
  enrolled_at   timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz NOT NULL DEFAULT now(),
  invalidated_reason text,
  CONSTRAINT push_tokens_token_uniq UNIQUE (token)
);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_status
  ON public.push_tokens (user_id, status);

CREATE INDEX IF NOT EXISTS idx_push_tokens_user_device
  ON public.push_tokens (user_id, device_id)
  WHERE device_id IS NOT NULL;

COMMENT ON TABLE public.push_tokens IS
  'A9 — APNs/FCM tokens per (user, device). Service-role only for writes from edge functions; RLS lets owners read their own rows.';

ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS push_tokens_owner_read ON public.push_tokens;
CREATE POLICY push_tokens_owner_read
  ON public.push_tokens
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- No INSERT/UPDATE/DELETE policy. Tokens are written via the
-- register_push_token RPC below (SECURITY DEFINER) or by the edge
-- function (service role). Direct client writes are blocked.

-- ── 2. push_preferences ──────────────────────────────────────────────-

CREATE TABLE IF NOT EXISTS public.push_preferences (
  user_id                       uuid PRIMARY KEY
                                  REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_practice_enabled        boolean NOT NULL DEFAULT false,
  daily_practice_local_time     time    NOT NULL DEFAULT '19:00',
  streak_grace_enabled          boolean NOT NULL DEFAULT true,
  leaderboard_change_enabled    boolean NOT NULL DEFAULT true,
  mercy_message_enabled         boolean NOT NULL DEFAULT true,
  trial_expiring_enabled        boolean NOT NULL DEFAULT true,
  quiet_hours_start             time    NOT NULL DEFAULT '22:00',
  quiet_hours_end               time    NOT NULL DEFAULT '07:00',
  -- IANA TZ; defaults to ICT for the Vietnamese-first cohort.
  timezone                      text    NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
  updated_at                    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.push_preferences IS
  'A9 — per-user push notification toggles. daily_practice defaults OFF (opt-in); other types default ON. Quiet hours default 22:00–07:00 user local time.';

ALTER TABLE public.push_preferences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS push_pref_owner_all ON public.push_preferences;
CREATE POLICY push_pref_owner_all
  ON public.push_preferences
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 3. push_send_log ─────────────────────────────────────────────────-

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'push_send_status') THEN
    CREATE TYPE public.push_send_status AS ENUM (
      'queued', 'sent', 'failed', 'skipped_quiet_hours',
      'skipped_pref', 'skipped_no_token'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.push_send_log (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  notification_type text NOT NULL,
  status          public.push_send_status NOT NULL,
  platform        public.push_platform,
  provider_message_id text,
  error_message   text,
  attempted_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_push_send_log_user_attempted
  ON public.push_send_log (user_id, attempted_at DESC);

CREATE INDEX IF NOT EXISTS idx_push_send_log_type_attempted
  ON public.push_send_log (notification_type, attempted_at DESC);

COMMENT ON TABLE public.push_send_log IS
  'A9 — audit trail for every push attempt. Admin-internal; no client access.';

ALTER TABLE public.push_send_log ENABLE ROW LEVEL SECURITY;
-- No policies: service-role only.

-- ── 4. Token registration RPC (SECURITY DEFINER) ─────────────────────-

CREATE OR REPLACE FUNCTION public.register_push_token(
  p_token     text,
  p_platform  public.push_platform,
  p_device_id text DEFAULT NULL
)
RETURNS public.push_tokens
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid uuid := auth.uid();
  result public.push_tokens;
BEGIN
  IF v_uid IS NULL THEN
    RAISE EXCEPTION 'not_signed_in';
  END IF;
  IF p_token IS NULL OR length(p_token) < 8 THEN
    RAISE EXCEPTION 'invalid_token';
  END IF;

  INSERT INTO public.push_tokens AS t (
    user_id, token, platform, device_id, status,
    enrolled_at, last_seen_at
  )
  VALUES (
    v_uid, p_token, p_platform, p_device_id, 'active',
    now(), now()
  )
  ON CONFLICT (token) DO UPDATE SET
    user_id      = EXCLUDED.user_id,
    platform     = EXCLUDED.platform,
    device_id    = COALESCE(EXCLUDED.device_id, t.device_id),
    status       = 'active',
    last_seen_at = now(),
    invalidated_reason = NULL
  RETURNING t.* INTO result;

  -- Initialize preferences row on first registration if missing.
  INSERT INTO public.push_preferences (user_id)
  VALUES (v_uid)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN result;
END;
$$;

COMMENT ON FUNCTION public.register_push_token(text, public.push_platform, text) IS
  'A9 — registers (or refreshes) a push token for the calling user. SECURITY DEFINER so it can write to push_tokens past the deny-write RLS. Idempotent on token; reactivates a previously-invalidated token.';

GRANT EXECUTE ON FUNCTION public.register_push_token(
  text, public.push_platform, text
) TO authenticated;

-- ── 5. Mark token invalid (called by send-push on APNs/FCM error) ────-

CREATE OR REPLACE FUNCTION public.mark_push_token_invalid(
  p_token text,
  p_reason text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.push_tokens
  SET status = 'invalid',
      invalidated_reason = p_reason,
      last_seen_at = now()
  WHERE token = p_token;
END;
$$;

COMMENT ON FUNCTION public.mark_push_token_invalid(text, text) IS
  'A9 — flags a push token as invalid after APNs/FCM rejects it. Called by service_role from send-push edge function.';

-- ── 6. Grants ────────────────────────────────────────────────────────-

GRANT SELECT ON public.push_tokens TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.push_preferences TO authenticated;
-- push_send_log: no authenticated grants. Service role only.

-- ── 7. Cron — DARK BY DEFAULT ────────────────────────────────────────-
--
-- The brief calls for daily_practice / streak_grace / leaderboard
-- triggers, but enabling them now would fire at scheduled times against
-- a zero-token user base — harmless but pointless. We DO NOT register
-- the cron jobs in this migration. Flip on with a follow-up migration
-- after App Store / Play Store approval and at least one real device
-- token exists.
--
-- For reference, the schedule we'd register:
--   refresh-push-daily-practice — '*/15 * * * *' → invokes send-push
--     for users whose local time is now within 15 min of preference.
--   send-push-streak-grace      — '0 23 * * *'   → 23:00 UTC = 06:00 ICT.
--   leaderboard ranks are pushed inline by the leaderboard refresh
--     trigger (no cron needed).
