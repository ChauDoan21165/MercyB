-- Step 5 follow-up — referral reward delivery.
--
-- Context: PR #83 shipped the referral system but left reward delivery
-- deferred. The referral_uses table already has reward_granted_owner /
-- reward_granted_referred boolean flags; this migration adds:
--
--   1. profiles.trial_extension_days — INTEGER counter that the
--      me-entitlement edge function adds to the 3-day base trial when
--      computing trial_expires_at. Stored on profiles (not subscriptions)
--      because the trial gate is profile-driven, not subscription-driven
--      (see supabase/functions/me-entitlement/index.ts § "Trial window").
--
--   2. grant_referral_reward(p_referred_user_id) — SECURITY DEFINER RPC.
--      Idempotent: a second call after both rewards are already granted
--      is a no-op. Designed to be called by the referred user themselves
--      right after apply_referral_code succeeds, but the bookkeeping
--      bumps BOTH the referred user AND the code owner via SECURITY
--      DEFINER (RLS would otherwise prevent the cross-user write to the
--      owner's profile).
--
-- Why this column lives on profiles:
--   The trial gate computes (profiles.created_at + 3 days) inside
--   me-entitlement. The minimal change is to extend that formula to
--   (profiles.created_at + 3 days + trial_extension_days). One source
--   of truth, no new state machine, no entanglement with paid
--   subscriptions or Stripe.
--
-- Deployment note:
--   This migration does NOT activate the reward by itself. The matching
--   change to supabase/functions/me-entitlement/index.ts must be deployed
--   for the extra days to actually delay the trial-expired gate. Both
--   are shipped in this PR; the deploy step is `supabase functions deploy
--   me-entitlement` after the migration applies.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.grant_referral_reward(uuid);
--   ALTER TABLE public.profiles DROP COLUMN IF EXISTS trial_extension_days;

-- ── 1. Add the counter column ────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS trial_extension_days integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_trial_extension_days_nonneg;
ALTER TABLE public.profiles
  ADD  CONSTRAINT profiles_trial_extension_days_nonneg
       CHECK (trial_extension_days >= 0);

COMMENT ON COLUMN public.profiles.trial_extension_days IS
  'Cumulative days added to the 3-day base trial. Bumped by grant_referral_reward; read by me-entitlement edge function.';

-- ── 2. RPC — grant_referral_reward ───────────────────────────────────────

CREATE OR REPLACE FUNCTION public.grant_referral_reward(p_referred_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller            uuid := auth.uid();
  v_use_row           public.referral_uses%ROWTYPE;
  v_owner_id          uuid;
  v_granted_owner     boolean := false;
  v_granted_referred  boolean := false;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_signed_in');
  END IF;

  -- Only the referred user can trigger their own reward grant. Admin /
  -- backfill use-cases use the service role, which bypasses RLS and
  -- doesn't need this function (or could call it via SECURITY DEFINER
  -- from a separate admin RPC if we add one later).
  IF v_caller <> p_referred_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_self');
  END IF;

  -- Find the most recent referral_uses row for this user. There can be
  -- only one because referral_uses has UNIQUE(code, referred_user_id) and
  -- a user can apply at most one code (no UI lets them apply two), but we
  -- LIMIT 1 defensively.
  SELECT * INTO v_use_row
    FROM public.referral_uses
    WHERE referred_user_id = p_referred_user_id
    ORDER BY used_at DESC
    LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_referral_use');
  END IF;

  -- Find the owner of the code (the referrer).
  SELECT owner_user_id INTO v_owner_id
    FROM public.referral_codes
    WHERE code = v_use_row.code;

  IF v_owner_id IS NULL THEN
    -- Code was deleted between apply and grant. Mark the row sent to
    -- prevent perpetual retries and report the inconsistency.
    RETURN jsonb_build_object('ok', false, 'error', 'orphan_code');
  END IF;

  -- Idempotent: only grant if not already granted. Re-running is safe.

  IF NOT v_use_row.reward_granted_referred THEN
    UPDATE public.profiles
       SET trial_extension_days = trial_extension_days + 7
     WHERE id = p_referred_user_id;

    UPDATE public.referral_uses
       SET reward_granted_referred = true
     WHERE id = v_use_row.id;

    v_granted_referred := true;
  END IF;

  IF NOT v_use_row.reward_granted_owner THEN
    UPDATE public.profiles
       SET trial_extension_days = trial_extension_days + 7
     WHERE id = v_owner_id;

    UPDATE public.referral_uses
       SET reward_granted_owner = true
     WHERE id = v_use_row.id;

    v_granted_owner := true;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'granted_referred', v_granted_referred,
    'granted_owner', v_granted_owner
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_referral_reward(uuid) TO authenticated;

COMMENT ON FUNCTION public.grant_referral_reward(uuid) IS
  'Grant 7-day trial extension to both the referred user and the code owner. Idempotent. Caller must be the referred user (auth.uid() = p_referred_user_id).';
