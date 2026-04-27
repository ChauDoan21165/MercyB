-- Email preferences + token-based unsubscribe (CASL/GDPR + Gmail
-- one-click compliance).
--
-- What this adds to public.profiles:
--   email_re_engagement_enabled  boolean — gates re-engagement campaigns
--   email_trial_expiry_enabled   boolean — gates D-1 / D+1 trial emails
--   email_weekly_digest_enabled  boolean — gates the public weekly digest
--   email_unsubscribed_at        timestamptz — set on full opt-out
--   email_unsubscribe_token      text — opaque token for /unsubscribe?token=
--
-- The token is the security boundary for the public no-auth /unsubscribe
-- page. It must be:
--   1. unguessable (24 random bytes → 48 hex chars)
--   2. unique per user (UNIQUE INDEX)
--   3. non-rotating once set (otherwise old email links break)
--
-- Two RPCs are exposed:
--   unsubscribe_by_token(token)        — full opt-out from email link
--   get_email_preferences()            — read prefs for /account/notifications
--
-- update_email_preferences runs through the standard authenticated
-- profiles UPDATE (no RPC needed) — the existing RLS policy already
-- restricts UPDATE to auth.uid() = id.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.unsubscribe_by_token(text);
--   DROP FUNCTION IF EXISTS public.get_email_preferences();
--   ALTER TABLE public.profiles
--     DROP COLUMN IF EXISTS email_re_engagement_enabled,
--     DROP COLUMN IF EXISTS email_trial_expiry_enabled,
--     DROP COLUMN IF EXISTS email_weekly_digest_enabled,
--     DROP COLUMN IF EXISTS email_unsubscribed_at,
--     DROP COLUMN IF EXISTS email_unsubscribe_token;
--   DROP TRIGGER IF EXISTS profiles_set_unsubscribe_token ON public.profiles;
--   DROP FUNCTION IF EXISTS public.profiles_set_unsubscribe_token();

-- pgcrypto provides gen_random_bytes(); enable if not already.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ── Columns ────────────────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_re_engagement_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_trial_expiry_enabled  boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_weekly_digest_enabled boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS email_unsubscribed_at       timestamptz,
  ADD COLUMN IF NOT EXISTS email_unsubscribe_token     text;

-- Token must be unique. Use a partial index so legacy NULL rows don't
-- collide (they're filled by the backfill below, but the partial form
-- protects against any future re-introduction of NULL via column drop +
-- re-add).
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_unsubscribe_token_uidx
  ON public.profiles (email_unsubscribe_token)
  WHERE email_unsubscribe_token IS NOT NULL;

COMMENT ON COLUMN public.profiles.email_re_engagement_enabled IS
  'Gates re-engagement campaigns sent by supabase/functions/email-reengagement.';
COMMENT ON COLUMN public.profiles.email_trial_expiry_enabled IS
  'Gates trial expiry D-1 / D+1 emails sent by supabase/functions/trial-expiry-emails.';
COMMENT ON COLUMN public.profiles.email_weekly_digest_enabled IS
  'Gates the weekly digest email sent by supabase/functions/weekly-digest-email.';
COMMENT ON COLUMN public.profiles.email_unsubscribed_at IS
  'Set when the user clicks one-click unsubscribe; flips all email_*_enabled to false in the same UPDATE.';
COMMENT ON COLUMN public.profiles.email_unsubscribe_token IS
  'Opaque 48-char hex token for the no-auth /unsubscribe?token= flow. Generated automatically on insert; never rotated.';

-- ── Trigger: auto-generate token on insert if missing ─────────────────
CREATE OR REPLACE FUNCTION public.profiles_set_unsubscribe_token()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.email_unsubscribe_token IS NULL OR NEW.email_unsubscribe_token = '' THEN
    NEW.email_unsubscribe_token := encode(extensions.gen_random_bytes(24), 'hex');
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_set_unsubscribe_token ON public.profiles;
CREATE TRIGGER profiles_set_unsubscribe_token
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.profiles_set_unsubscribe_token();

-- ── Backfill existing rows ────────────────────────────────────────────
-- Idempotent: only fills NULLs. Re-running this migration is a no-op.
UPDATE public.profiles
   SET email_unsubscribe_token = encode(extensions.gen_random_bytes(24), 'hex')
 WHERE email_unsubscribe_token IS NULL;

-- ── RPC: unsubscribe_by_token ─────────────────────────────────────────
-- Public — no JWT required. Validates the token, flips all email
-- preferences off, and stamps email_unsubscribed_at. Returns the user
-- id of the affected row (or NULL when the token didn't match) so the
-- /unsubscribe page can confirm without leaking user data.
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
     SET email_re_engagement_enabled = false,
         email_trial_expiry_enabled  = false,
         email_weekly_digest_enabled = false,
         email_unsubscribed_at       = COALESCE(email_unsubscribed_at, now())
   WHERE email_unsubscribe_token = p_token
   RETURNING id INTO v_user_id;

  IF v_user_id IS NULL THEN
    RETURN QUERY SELECT false, 'token_not_found'::text;
  ELSE
    RETURN QUERY SELECT true, 'unsubscribed'::text;
  END IF;
END;
$$;

-- Grant execute to anon + authenticated so /unsubscribe works without auth.
GRANT EXECUTE ON FUNCTION public.unsubscribe_by_token(text) TO anon, authenticated;

COMMENT ON FUNCTION public.unsubscribe_by_token(text) IS
  'Public no-auth RPC for one-click email unsubscribe. Sets all email_*_enabled to false and stamps email_unsubscribed_at. Returns ok=false with message=invalid_token | token_not_found on failure.';

-- ── RPC: get_email_preferences ────────────────────────────────────────
-- Convenience read for /account/notifications. Returns the four flags
-- + the unsubscribed_at stamp for the current authenticated user. RLS
-- on profiles already restricts row access, but a small RPC keeps the
-- /account UI from needing to know the column names.
CREATE OR REPLACE FUNCTION public.get_email_preferences()
RETURNS TABLE (
  email_re_engagement_enabled boolean,
  email_trial_expiry_enabled  boolean,
  email_weekly_digest_enabled boolean,
  email_unsubscribed_at       timestamptz
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
         p.email_unsubscribed_at
    FROM public.profiles p
   WHERE p.id = auth.uid();
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_email_preferences() TO authenticated;

COMMENT ON FUNCTION public.get_email_preferences() IS
  'Read the email preference flags for the current authenticated user. Returns no rows for anonymous callers.';
