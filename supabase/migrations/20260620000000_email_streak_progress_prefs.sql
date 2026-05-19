-- Per-category opt-out for the two cron emails (streak reminder +
-- weekly progress) — the gap that kept issue #694 open and the two
-- crons disabled (PR #696).
--
-- This is an EXTENSION of the existing email-preferences system shipped
-- by PR #190 (migration 20260522000000_email_preferences.sql). It does
-- NOT introduce a new token table: the per-user, non-rotating
-- profiles.email_unsubscribe_token is already the credential for the
-- no-auth /unsubscribe flow and is consumed by three already-wired
-- functions (email-reengagement, trial-expiry-emails,
-- weekly-digest-email). A second single-use token table would orphan
-- that system and break existing email links — so we reuse it.
--
-- What this adds to public.profiles:
--   email_streak_reminder_enabled boolean — gates streak-reminder-email
--   email_weekly_progress_enabled boolean — gates weekly-progress-email
--
-- and folds both flags into the two existing RPCs so:
--   * one-click unsubscribe (unsubscribe_by_token) silences these too
--   * /account/notifications (get_email_preferences) can show + re-enable
--     them (otherwise a global opt-out would trap the user with no path
--     back for these two categories).
--
-- Reversibility:
--   ALTER TABLE public.profiles
--     DROP COLUMN IF EXISTS email_streak_reminder_enabled,
--     DROP COLUMN IF EXISTS email_weekly_progress_enabled;
--   -- then re-apply 20260522000000_email_preferences.sql's RPC bodies
--   -- (CREATE OR REPLACE unsubscribe_by_token / get_email_preferences)
--   -- to restore the 3-flag signatures.

-- ── Columns ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_streak_reminder_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_weekly_progress_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.email_streak_reminder_enabled IS
  'Gates the daily streak reminder email sent by supabase/functions/streak-reminder-email.';
COMMENT ON COLUMN public.profiles.email_weekly_progress_enabled IS
  'Gates the weekly progress summary email sent by supabase/functions/weekly-progress-email.';

-- ── RPC: unsubscribe_by_token (extend the UPDATE SET) ─────────────────
-- Return signature is unchanged (ok boolean, message text) so
-- CREATE OR REPLACE is safe. Only the SET list grows by two columns.
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
     SET email_re_engagement_enabled  = false,
         email_trial_expiry_enabled   = false,
         email_weekly_digest_enabled  = false,
         email_streak_reminder_enabled = false,
         email_weekly_progress_enabled = false,
         email_unsubscribed_at        = COALESCE(email_unsubscribed_at, now())
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
  'Public no-auth RPC for one-click email unsubscribe. Sets ALL email_*_enabled flags (re-engagement, trial-expiry, weekly-digest, streak-reminder, weekly-progress) to false and stamps email_unsubscribed_at. Returns ok=false with message=invalid_token | token_not_found on failure.';

-- ── RPC: get_email_preferences (return signature CHANGES → drop+recreate)
-- Postgres cannot CREATE OR REPLACE a function whose OUT/return columns
-- changed, so drop the 4-column form first, then recreate with 6.
DROP FUNCTION IF EXISTS public.get_email_preferences();

CREATE FUNCTION public.get_email_preferences()
RETURNS TABLE (
  email_re_engagement_enabled  boolean,
  email_trial_expiry_enabled   boolean,
  email_weekly_digest_enabled  boolean,
  email_streak_reminder_enabled boolean,
  email_weekly_progress_enabled boolean,
  email_unsubscribed_at        timestamptz
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
         p.email_unsubscribed_at
    FROM public.profiles p
   WHERE p.id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_preferences() TO authenticated;

COMMENT ON FUNCTION public.get_email_preferences() IS
  'Read the email preference flags for the current authenticated user (re-engagement, trial-expiry, weekly-digest, streak-reminder, weekly-progress) + the unsubscribed_at stamp. Returns no rows for anonymous callers.';
