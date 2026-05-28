-- L6 — Parent / Family layer. Weekly parent digest opt-in + plumbing.
--
-- Decision L6-Q8=A (docs/architecture/L6-parent-teacher-family-layer.md
-- § Decision: L6-Q8): a WEEKLY OPT-IN parent digest. This migration is the
-- scaffold — opt-in flag, send-log campaign key, per-week dedupe, and the
-- single weekly cron handle. The email body / Mercy voice lives in the
-- edge function (supabase/functions/parent-weekly-digest).
--
-- This EXTENDS the existing email-preferences system (PR #190,
-- 20260522000000_email_preferences.sql; extended 20260620000000). It does
-- NOT introduce a new token table: the per-user, non-rotating
-- profiles.email_unsubscribe_token is the credential for the no-auth
-- /unsubscribe flow. We reuse it so one-click unsubscribe silences this
-- digest too.
--
-- OPT-IN, not opt-out: unlike the other email flags (which default true),
-- email_parent_digest_enabled defaults FALSE. Q8=A is explicitly opt-in —
-- a parent must turn it on. The /unsubscribe one-click still flips it off
-- alongside the rest so a global opt-out is honored.
--
-- Reversibility:
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS email_parent_digest_enabled;
--   -- then re-apply 20260620000000's RPC bodies (CREATE OR REPLACE
--   -- unsubscribe_by_token / drop+recreate get_email_preferences) to
--   -- restore the 5-flag signatures, drop constraint v5 / restore v4,
--   -- and `cron.unschedule('send-parent-weekly-digest')`.

-- ── 1. Column (opt-in: default FALSE) ────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_parent_digest_enabled boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.email_parent_digest_enabled IS
  'L6-Q8=A — opt-in (default false) gate for the weekly parent digest sent by supabase/functions/parent-weekly-digest. Flipped off by the one-click unsubscribe_by_token alongside every other email flag.';

-- ── 2. unsubscribe_by_token — fold the new flag into the SET list ────────
-- Return signature unchanged (ok boolean, message text) → CREATE OR REPLACE.
CREATE OR REPLACE FUNCTION public.unsubscribe_by_token(p_token text)
RETURNS TABLE (ok boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  IF p_token IS NULL OR length(trim(p_token)) < 16 THEN
    RETURN QUERY SELECT false, 'invalid_token'::text;
    RETURN;
  END IF;

  UPDATE public.profiles
     SET email_re_engagement_enabled   = false,
         email_trial_expiry_enabled    = false,
         email_weekly_digest_enabled   = false,
         email_streak_reminder_enabled = false,
         email_weekly_progress_enabled = false,
         email_parent_digest_enabled   = false,
         email_unsubscribed_at         = COALESCE(email_unsubscribed_at, now())
   WHERE email_unsubscribe_token = p_token
   RETURNING id INTO v_user_id;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'token_not_found'::text;
  ELSE
    RETURN QUERY SELECT true, 'unsubscribed'::text;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.unsubscribe_by_token(text) TO anon, authenticated;

COMMENT ON FUNCTION public.unsubscribe_by_token(text) IS
  'Public no-auth RPC for one-click email unsubscribe. Sets ALL email_*_enabled flags (re-engagement, trial-expiry, weekly-digest, streak-reminder, weekly-progress, parent-digest) to false and stamps email_unsubscribed_at. Returns ok=false with message=invalid_token | token_not_found on failure.';

-- ── 3. get_email_preferences — return signature CHANGES → drop+recreate ──
DROP FUNCTION IF EXISTS public.get_email_preferences();

CREATE FUNCTION public.get_email_preferences()
RETURNS TABLE (
  email_re_engagement_enabled   boolean,
  email_trial_expiry_enabled    boolean,
  email_weekly_digest_enabled   boolean,
  email_streak_reminder_enabled boolean,
  email_weekly_progress_enabled boolean,
  email_parent_digest_enabled   boolean,
  email_unsubscribed_at         timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.email_re_engagement_enabled,
         p.email_trial_expiry_enabled,
         p.email_weekly_digest_enabled,
         p.email_streak_reminder_enabled,
         p.email_weekly_progress_enabled,
         p.email_parent_digest_enabled,
         p.email_unsubscribed_at
    FROM public.profiles p
   WHERE p.id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_preferences() TO authenticated;

COMMENT ON FUNCTION public.get_email_preferences() IS
  'Read the email preference flags for the current authenticated user (re-engagement, trial-expiry, weekly-digest, streak-reminder, weekly-progress, parent-digest) + the unsubscribed_at stamp. Returns no rows for anonymous callers.';

-- ── 4. email_sends_log: whitelist 'parent_weekly_digest' (constraint v5) ──
ALTER TABLE public.email_sends_log
  DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk_v4;

ALTER TABLE public.email_sends_log
  ADD CONSTRAINT email_sends_log_campaign_chk_v5
  CHECK (
    campaign IN (
      -- A6 skeleton (time-based)
      'reengagement_7d',
      'reengagement_14d',
      'reengagement_30d',
      -- Trial-expiry funnel (PR #149/#102)
      'trial_expiry_d_minus_3',
      'trial_expiry_d_minus_1',
      'trial_expiry_d_plus_1',
      -- A10 re-engagement funnel
      'reengagement_active_then_silent',
      'reengagement_trial_completed_d_plus_14',
      'reengagement_post_subscribe_d_plus_7',
      'reengagement_almost_lapsed',
      'reengagement_added_something_new',
      -- A9 weekly community digest
      'weekly_digest',
      -- L6 weekly parent digest
      'parent_weekly_digest'
    )
  );

COMMENT ON CONSTRAINT email_sends_log_campaign_chk_v5
  ON public.email_sends_log IS
  'Allowed campaign keys across all email tracks. Extending: add the new value here and bump the constraint version.';

-- Per-week dedupe — 'parent_weekly_digest' is sent once per (user, week),
-- mirroring the weekly_digest dedupe index. Reuses the existing week_key
-- column added by 20260517000000.
CREATE UNIQUE INDEX IF NOT EXISTS uq_email_sends_log_parent_digest_user_week
  ON public.email_sends_log (user_id, week_key)
  WHERE campaign = 'parent_weekly_digest' AND week_key IS NOT NULL;

-- ── 5. Cron — one weekly handle. Monday 07:00 ICT = Monday 00:00 UTC ──────
-- Calls the edge function's default daily-pass action over HTTP. The
-- function is verify_jwt=false (see supabase/config.toml), so the bearer
-- is optional; current_setting(..., true) returns NULL when the GUC is
-- unset rather than erroring, keeping this apply-safe in every environment.
-- The function itself enforces opt-in + per-week dedupe, so an extra fire
-- is harmless.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'send-parent-weekly-digest') THEN
    PERFORM cron.unschedule('send-parent-weekly-digest');
  END IF;

  PERFORM cron.schedule(
    'send-parent-weekly-digest',
    '0 0 * * 1',
    $cron$
      SELECT net.http_post(
        url := 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/parent-weekly-digest',
        headers := jsonb_build_object(
          'Content-Type', 'application/json',
          'Authorization',
            'Bearer ' || COALESCE(current_setting('app.parent_digest_bearer', true), '')
        ),
        body := jsonb_build_object('action', 'daily_pass')
      );
    $cron$
  );
END $$;
