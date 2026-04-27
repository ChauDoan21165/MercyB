-- A9 — Referral engagement gate + 90-day/year cap.
--
-- Builds on:
--   20260429010000_referrals.sql              (referral_codes / referral_uses)
--   20260502000000_referral_grant_function.sql (grant_referral_reward + trial_extension_days)
--
-- Two policy changes here, both anti-fraud:
--
--   1. Day-3 engagement gate for the OWNER reward only.
--      The referred user keeps their +7 immediately on apply (the
--      onboarding hook needs to make signup feel rewarding). The owner
--      reward is held until the referred user reaches Day 3 from
--      profiles.created_at — a soft proof-of-engagement so signup-and-
--      delete farms don't pay out.
--
--   2. 90-day-per-year cap on owner rewards.
--      12 successful owner-side rewards × 7 days = 84 days; the 13th
--      would push past 90 in a rolling year window, so we cap at 12.
--      Hitting the cap flips `reward_granted_owner = true` to stop
--      perpetual retries — if the cap is loosened later we'd need a
--      backfill RPC.
--
-- Also tightens apply_referral_code: a user can only redeem ONE code
-- per account, regardless of which code. The existing UNIQUE(code,
-- referred_user_id) only blocked re-redeeming the SAME code.
--
-- Non-goals: per-code cap, time-based cap on the referred side,
-- billing-aware referrer extension (paid-tier window vs trial). The
-- single trial_extension_days counter is the source of truth for both
-- parties; me-entitlement consumes it.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.referral_owner_grants_in_year(uuid);
--   -- Original apply_referral_code + grant_referral_reward must be
--   -- restored from 20260429010000 / 20260502000000.

-- ── 1. Helper — count owner rewards in past 365 days ─────────────────────

CREATE OR REPLACE FUNCTION public.referral_owner_grants_in_year(p_owner_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(count(*)::int, 0)
    FROM public.referral_uses ru
    JOIN public.referral_codes rc ON rc.code = ru.code
   WHERE rc.owner_user_id = p_owner_id
     AND ru.reward_granted_owner = true
     AND ru.used_at >= now() - interval '365 days';
$$;

GRANT EXECUTE ON FUNCTION public.referral_owner_grants_in_year(uuid) TO authenticated;

-- ── 2. Tighten apply_referral_code: one redemption per user ──────────────

CREATE OR REPLACE FUNCTION public.apply_referral_code(p_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid          uuid := auth.uid();
  norm_code    text;
  owner_id     uuid;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'apply_referral_code requires an authenticated user';
  END IF;

  IF p_code IS NULL THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  norm_code := upper(btrim(p_code));
  IF norm_code !~ '^[2-9A-HJ-NP-Z]{6}$' THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  SELECT owner_user_id INTO owner_id
    FROM public.referral_codes
    WHERE code = norm_code;
  IF owner_id IS NULL THEN
    RETURN json_build_object('ok', false, 'status', 'invalid_code');
  END IF;

  IF owner_id = uid THEN
    RETURN json_build_object('ok', false, 'status', 'self_referral');
  END IF;

  -- One referral per account — block redeeming a *different* code on a
  -- second submission. The base UNIQUE(code, referred_user_id) only
  -- blocks re-submitting the SAME code.
  IF EXISTS (SELECT 1 FROM public.referral_uses WHERE referred_user_id = uid) THEN
    RETURN json_build_object('ok', false, 'status', 'already_used');
  END IF;

  BEGIN
    INSERT INTO public.referral_uses (code, referred_user_id)
      VALUES (norm_code, uid);
  EXCEPTION WHEN unique_violation THEN
    RETURN json_build_object('ok', false, 'status', 'already_used');
  END;

  UPDATE public.referral_codes
     SET uses_count = uses_count + 1
   WHERE code = norm_code;

  RETURN json_build_object('ok', true, 'status', 'applied');
END;
$$;

GRANT EXECUTE ON FUNCTION public.apply_referral_code(text) TO authenticated;

-- ── 3. Replace grant_referral_reward with gated + capped version ─────────

CREATE OR REPLACE FUNCTION public.grant_referral_reward(p_referred_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller             uuid := auth.uid();
  v_use_row            public.referral_uses%ROWTYPE;
  v_owner_id           uuid;
  v_referred_created   timestamptz;
  v_day3_reached       boolean := false;
  v_owner_year_count   integer := 0;
  v_granted_owner      boolean := false;
  v_granted_referred   boolean := false;
  v_owner_pending_day3 boolean := false;
  v_owner_at_cap       boolean := false;
BEGIN
  IF v_caller IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_signed_in');
  END IF;

  -- Only the referred user themselves can trigger their grant. Service
  -- role bypasses RLS for backfills.
  IF v_caller <> p_referred_user_id THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_self');
  END IF;

  SELECT * INTO v_use_row
    FROM public.referral_uses
    WHERE referred_user_id = p_referred_user_id
    ORDER BY used_at DESC
    LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'no_referral_use');
  END IF;

  SELECT owner_user_id INTO v_owner_id
    FROM public.referral_codes
    WHERE code = v_use_row.code;

  IF v_owner_id IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'orphan_code');
  END IF;

  -- Day-3 engagement gate — applies to the OWNER side only.
  -- Use profiles.created_at (account-creation time) rather than
  -- referral_uses.used_at because the apply might happen later than
  -- signup (legacy users redeeming a code).
  SELECT created_at INTO v_referred_created
    FROM public.profiles
    WHERE id = p_referred_user_id;

  v_day3_reached := COALESCE(
    v_referred_created + interval '3 days' <= now(),
    false
  );

  -- ── Referred user side — grant immediately on first call ────────────
  IF NOT v_use_row.reward_granted_referred THEN
    UPDATE public.profiles
       SET trial_extension_days = trial_extension_days + 7
     WHERE id = p_referred_user_id;

    UPDATE public.referral_uses
       SET reward_granted_referred = true
     WHERE id = v_use_row.id;

    v_granted_referred := true;
  END IF;

  -- ── Owner side — gated by Day-3 + 90/365 cap ────────────────────────
  IF NOT v_use_row.reward_granted_owner THEN
    IF NOT v_day3_reached THEN
      -- Hold the owner reward; do NOT flip the flag. The next call
      -- (e.g. from referred user's next login) will re-evaluate.
      v_owner_pending_day3 := true;
    ELSE
      v_owner_year_count := public.referral_owner_grants_in_year(v_owner_id);
      IF v_owner_year_count >= 12 THEN
        -- 12 × 7 = 84 already; granting another 7 would exceed 90.
        -- Flip the flag to stop perpetual retries; this is a hard skip,
        -- not a defer. If policy loosens, a backfill RPC can re-pay.
        v_owner_at_cap := true;
        UPDATE public.referral_uses
           SET reward_granted_owner = true
         WHERE id = v_use_row.id;
      ELSE
        UPDATE public.profiles
           SET trial_extension_days = trial_extension_days + 7
         WHERE id = v_owner_id;

        UPDATE public.referral_uses
           SET reward_granted_owner = true
         WHERE id = v_use_row.id;

        v_granted_owner := true;
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object(
    'ok', true,
    'granted_referred', v_granted_referred,
    'granted_owner', v_granted_owner,
    'owner_pending_day3', v_owner_pending_day3,
    'owner_at_cap', v_owner_at_cap
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.grant_referral_reward(uuid) TO authenticated;

COMMENT ON FUNCTION public.grant_referral_reward(uuid) IS
  'Idempotent referral reward. Referred user gets +7 days on first call. Owner gets +7 only after referred user reaches Day 3 (engagement gate) and is subject to a 12-grants-per-year cap (~90 days/year). Returns owner_pending_day3 / owner_at_cap flags for telemetry.';
