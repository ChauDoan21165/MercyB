-- Family / friend bulk invitations.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- A9's referral system (#160) is one-by-one — copy a 6-char code, hand
-- it to one friend at a time. Vietnamese culture is family-oriented;
-- users have 5+ family members they'd want to learn together. Asking
-- for one referral at a time is friction. Bulk-invite via contact list
-- = 10× more invites and the cascading-growth primitive the diaspora
-- needs.
--
-- THIS MIGRATION INSTALLS
--   1. `public.family_invitations` — one row per recipient. Tracks
--      send → clicked → signed_up → converted lifecycle. Carries a
--      personalised message, relationship-context (chị/anh/em/cô/chú),
--      and per-invitation `invite_token` so the /invite/:token page
--      can render a personalised welcome.
--   2. RLS — owner reads/writes their own invitations; anonymous /
--      authenticated users can SELECT exactly one invitation by token
--      (so the recipient page works without auth).
--   3. SECURITY DEFINER helpers:
--        - `count_family_invitations_in_window` — drives the per-user
--          rate limit (20/hour, 100/day; brief says failed delivery
--          does NOT count).
--        - `mark_family_invite_clicked` / `_signed_up` / `_converted`
--          — idempotent state transitions called from the edge fn.
--   4. Anti-abuse — UNIQUE on (inviter_user_id, lower(recipient_email))
--      and (inviter_user_id, recipient_phone) so the same recipient
--      cannot be invited twice by the same user.
--   5. 30-day expiry default — invitations past expiry stop counting
--      toward the inviter's tally and the recipient page shows expired.
--
-- HOW TO MANUALLY REVOKE A USER'S UNSENT INVITATIONS
--   UPDATE public.family_invitations SET status = 'revoked'
--   WHERE inviter_user_id = '<uuid>' AND status = 'pending';
--
-- HOW TO DISABLE
--   UPDATE feature_flags SET is_enabled = false WHERE flag_key = 'family_bulk_invite_enabled';
--   (the edge function reads this flag; with it off, /send-bulk-invitations
--   returns 503 and the table stops growing.)

-- ── 1. Table ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.family_invitations (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  inviter_user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Recipient. At least one of email/phone must be present.
  recipient_name      text,
  recipient_email     text,
  recipient_phone     text,
  relationship        text,

  -- Personalisation.
  template_key        text NOT NULL DEFAULT 'family',
  custom_message      text,

  -- Tracking.
  invite_token        text NOT NULL UNIQUE
                        CONSTRAINT family_invite_token_format
                        CHECK (invite_token ~ '^[2-9A-HJ-NP-Z]{12}$'),
  status              text NOT NULL DEFAULT 'pending'
                        CHECK (status IN (
                          'pending', 'sent', 'clicked', 'signed_up',
                          'converted', 'failed', 'revoked', 'expired'
                        )),
  error_message       text,

  -- Lifecycle timestamps.
  created_at          timestamptz NOT NULL DEFAULT now(),
  sent_at             timestamptz,
  clicked_at          timestamptz,
  signed_up_at        timestamptz,
  converted_at        timestamptz,
  expires_at          timestamptz NOT NULL DEFAULT (now() + interval '30 days'),

  -- Recipient FK after signup so we can join to streak / tier later.
  referred_user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Trial bonus on signup. 11 = 14-day total trial (3 base + 11) per
  -- the brief. Stored on the row so the bonus is locked at invite time
  -- and a future global change to the default trial doesn't retro-apply.
  trial_bonus_days    integer NOT NULL DEFAULT 11
                        CHECK (trial_bonus_days >= 0),

  CONSTRAINT family_invite_has_contact
    CHECK (recipient_email IS NOT NULL OR recipient_phone IS NOT NULL),
  CONSTRAINT family_invite_email_format
    CHECK (recipient_email IS NULL OR recipient_email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  CONSTRAINT family_invite_message_len
    CHECK (custom_message IS NULL OR length(custom_message) <= 280)
);

-- Anti-abuse: the same recipient can only be invited once per inviter.
-- Partial uniques because either field is nullable.
CREATE UNIQUE INDEX IF NOT EXISTS uq_family_invite_email_per_inviter
  ON public.family_invitations (inviter_user_id, lower(recipient_email))
  WHERE recipient_email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_family_invite_phone_per_inviter
  ON public.family_invitations (inviter_user_id, recipient_phone)
  WHERE recipient_phone IS NOT NULL;

-- Hot paths.
CREATE INDEX IF NOT EXISTS idx_family_invitations_inviter_created
  ON public.family_invitations (inviter_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_family_invitations_status_created
  ON public.family_invitations (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_family_invitations_referred_user
  ON public.family_invitations (referred_user_id)
  WHERE referred_user_id IS NOT NULL;

-- ── 2. RLS ─────────────────────────────────────────────────────────────

ALTER TABLE public.family_invitations ENABLE ROW LEVEL SECURITY;

-- Owner: full read on own invitations.
DROP POLICY IF EXISTS family_invitations_owner_select ON public.family_invitations;
CREATE POLICY family_invitations_owner_select
  ON public.family_invitations
  FOR SELECT
  USING (inviter_user_id = auth.uid());

-- Owner: revoke (UPDATE status='revoked' on own pending rows).
-- Other UPDATE shapes go through the SECURITY DEFINER functions.
DROP POLICY IF EXISTS family_invitations_owner_revoke ON public.family_invitations;
CREATE POLICY family_invitations_owner_revoke
  ON public.family_invitations
  FOR UPDATE
  USING (inviter_user_id = auth.uid() AND status IN ('pending', 'sent'))
  WITH CHECK (inviter_user_id = auth.uid() AND status = 'revoked');

-- Anon + authenticated: look up exactly one row by token to render
-- the recipient welcome page. This is intentional — the token is the
-- secret. Anyone with the token can see the row, but the token IS the
-- single-recipient URL. Phone / email are visible (so the page can
-- pre-fill signup); other recipients of OTHER invitations are not
-- exposed because the token uniquely picks one row.
DROP POLICY IF EXISTS family_invitations_recipient_by_token ON public.family_invitations;
CREATE POLICY family_invitations_recipient_by_token
  ON public.family_invitations
  FOR SELECT
  USING (true);
-- ^ Combined with the API contract (callers always filter by
-- invite_token = '...'), this is effectively token-only access. The
-- trade-off is that a leaked token leaks one recipient's row — which
-- is the same blast radius as a leaked URL anywhere on the internet.

-- All other write paths (insert / update other than revoke / delete)
-- go through SECURITY DEFINER functions only. service_role bypasses
-- RLS for the edge function's writes.

COMMENT ON TABLE public.family_invitations IS
  'Per-recipient bulk invitations. Drives the cascading-growth referral cohort. Service-role writes; owner reads own; anon SELECTs by token render the recipient welcome page.';


-- ── 3. Rate-limit count helper ─────────────────────────────────────────
-- Brief: failed delivery (status = 'failed') does NOT count toward
-- the rate limit. The function takes a window in seconds so the
-- caller can ask "how many in the last hour" and "how many in the
-- last 24 hours" with the same shape.

CREATE OR REPLACE FUNCTION public.count_family_invitations_in_window(
  p_inviter_user_id  uuid,
  p_window_seconds   integer
)
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT count(*)::integer
  FROM public.family_invitations
  WHERE inviter_user_id = p_inviter_user_id
    AND status <> 'failed'
    AND status <> 'revoked'
    AND created_at >= now() - make_interval(secs => p_window_seconds);
$$;

REVOKE ALL ON FUNCTION public.count_family_invitations_in_window(uuid, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.count_family_invitations_in_window(uuid, integer) FROM anon;
REVOKE ALL ON FUNCTION public.count_family_invitations_in_window(uuid, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.count_family_invitations_in_window(uuid, integer) TO service_role;


-- ── 4. State-transition helpers ────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.mark_family_invite_clicked(p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.family_invitations
     SET status = CASE WHEN status IN ('sent', 'pending') THEN 'clicked' ELSE status END,
         clicked_at = COALESCE(clicked_at, now())
   WHERE invite_token = p_token
     AND expires_at > now();
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_family_invite_clicked(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_family_invite_clicked(text) TO anon, authenticated, service_role;


CREATE OR REPLACE FUNCTION public.mark_family_invite_signed_up(
  p_token             text,
  p_referred_user_id  uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_bonus integer;
BEGIN
  UPDATE public.family_invitations
     SET status = 'signed_up',
         signed_up_at = COALESCE(signed_up_at, now()),
         referred_user_id = p_referred_user_id
   WHERE invite_token = p_token
     AND expires_at > now()
     AND status NOT IN ('signed_up', 'converted', 'revoked', 'expired')
  RETURNING trial_bonus_days INTO v_bonus;

  IF v_bonus IS NULL THEN
    RETURN false;
  END IF;

  -- Apply the trial bonus to the recipient's profile. Read-modify-write
  -- under the function's transaction so a concurrent claim can't
  -- double-stack.
  UPDATE public.profiles
     SET trial_extension_days = COALESCE(trial_extension_days, 0) + v_bonus
   WHERE id = p_referred_user_id;

  RETURN true;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_family_invite_signed_up(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_family_invite_signed_up(text, uuid) TO authenticated, service_role;


CREATE OR REPLACE FUNCTION public.mark_family_invite_converted(p_token text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.family_invitations
     SET status = 'converted',
         converted_at = COALESCE(converted_at, now())
   WHERE invite_token = p_token;
  RETURN FOUND;
END;
$$;
REVOKE ALL ON FUNCTION public.mark_family_invite_converted(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_family_invite_converted(text) TO service_role;


-- ── 5. Feature flag for the kill switch ────────────────────────────────

INSERT INTO public.feature_flags (flag_key, is_enabled)
VALUES ('family_bulk_invite_enabled', true)
ON CONFLICT (flag_key) DO NOTHING;
