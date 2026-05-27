-- ─────────────────────────────────────────────────────────────────────────
-- DRAFT — DO NOT APPLY FROM THIS LOCATION
-- ─────────────────────────────────────────────────────────────────────────
-- This file lives in docs/security/rls-fix-drafts/, NOT in
-- supabase/migrations/. See ./README.md.
--
-- Finding: !84 §3B — SECURITY DEFINER functions taking user-id params
--          without enforced caller-equals-subject check.
-- Tracker: authenticated_security_definer_function_executable (Advisor)
-- ─────────────────────────────────────────────────────────────────────────
--
-- Audit correction
-- ----------------
-- !84 §3B flagged SIX functions as HIGH/MEDIUM risk. On re-inspection
-- for this drafting pass, THREE are already safe — the bodies do
-- already enforce caller-equals-subject:
--
--   ✅ public.grant_referral_reward(p_referred_user_id uuid)
--      Has `IF v_caller <> p_referred_user_id THEN
--             RETURN jsonb_build_object('ok', false, 'error', 'not_self');
--           END IF;` (referral_engagement_gate.sql:144).
--   ✅ public.kick_study_group_member(p_group_id uuid, p_user_id uuid)
--      Has `IF v_owner <> v_caller THEN
--             RETURN jsonb_build_object('ok', false, 'error', 'not_owner');
--           END IF;` (study_groups.sql:322).
--   ✅ public.apply_referral_code(p_code text)
--      Uses `auth.uid()` for the referred user (caller), so the
--      "subject" IS the caller by construction. Also has `self_referral`
--      check. (referral_engagement_gate.sql:73).
--
-- The remaining THREE functions are still vulnerable to caller-not-
-- subject probing; this draft addresses each.
--
--   ⚠️ public.get_admin_level(_user_id uuid)              — admin enumeration
--   ⚠️ public.check_admin_email_rate_limit(p_admin_id uuid, ...) — admin probe
--   ⚠️ public.referral_owner_grants_in_year(p_owner_id uuid)     — referral activity probe
--
-- For each, the fix is the same shape: add a guard at the top that
-- either (a) returns the same shape but with no-op data when
-- auth.uid() != subject, or (b) returns the real data only when caller
-- is admin or caller IS the subject.
--
-- Severity per function
-- ---------------------
-- All three are MEDIUM (information disclosure). Not a CRITICAL —
-- they don't grant writes or reveal raw secrets. But they let any
-- authenticated user probe arbitrary user_ids for admin status, admin
-- email-send history, or referral activity count. In aggregate these
-- are a discovery surface for targeting specific users.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. public.get_admin_level(_user_id uuid)
-- ─────────────────────────────────────────────────────────────────────────
-- Current body (supabase/migrations/20260427010000_grant_execute_get_admin_level.sql):
--   SELECT COALESCE((SELECT level FROM public.admin_users
--                     WHERE user_id = _user_id), 0);
-- No caller check. Any authenticated user can probe whether any user
-- is an admin.
--
-- Choice: this function is used INSIDE RLS policies (e.g.
--   USING (public.get_admin_level(auth.uid()) >= 9)
-- ) so we can't simply restrict to service-role. The fix:
-- callers asking about THEMSELVES get the real level (needed for
-- policies); callers asking about OTHERS get 0 unless they themselves
-- are level 9+.

CREATE OR REPLACE FUNCTION public.get_admin_level(_user_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller_uid   uuid := auth.uid();
  v_caller_level integer;
BEGIN
  -- Self-probe: return real level (load-bearing for RLS policies that
  -- call get_admin_level(auth.uid())).
  IF v_caller_uid IS NOT NULL AND v_caller_uid = _user_id THEN
    RETURN COALESCE(
      (SELECT level FROM public.admin_users WHERE user_id = _user_id),
      0
    );
  END IF;

  -- Cross-probe: only return real level if the CALLER is themselves a
  -- level 9+ admin. Otherwise return 0 (the same value the function
  -- returns for non-admins, so the probe leaks nothing).
  v_caller_level := COALESCE(
    (SELECT level FROM public.admin_users WHERE user_id = v_caller_uid),
    0
  );
  IF v_caller_level >= 9 THEN
    RETURN COALESCE(
      (SELECT level FROM public.admin_users WHERE user_id = _user_id),
      0
    );
  END IF;

  RETURN 0;
END;
$$;

REVOKE ALL ON FUNCTION public.get_admin_level(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.get_admin_level(uuid) TO authenticated;

COMMENT ON FUNCTION public.get_admin_level(uuid) IS
  'Returns admin level (0-10) for a user. Self-probe always works (load-'
  'bearing for RLS). Cross-probe returns 0 unless caller is level 9+. '
  'Hardened by !84 follow-up.';

-- ─────────────────────────────────────────────────────────────────────────
-- 2. public.check_admin_email_rate_limit(p_admin_id uuid, p_max integer, p_window interval)
-- ─────────────────────────────────────────────────────────────────────────
-- Current body (supabase/migrations/20260505020000_email_audit.sql):
--   counts email_audit rows for p_admin_id; returns boolean.
-- Any authenticated user can ask "has admin X sent more than 0 emails
-- in the last hour?" — a low-value but real information leak.
--
-- Fix: callers asking about themselves get the real answer. Callers
-- asking about others get a generic `true` (i.e. "yes, you're allowed
-- to send" — which is the unhelpful answer for an attacker because
-- they can't act on someone else's rate limit anyway).
--
-- Alternative considered: REVOKE EXECUTE FROM authenticated; have the
-- send-feedback-reply edge function call it with service-role. Cleaner
-- but requires touching the edge function — out of scope for this
-- draft.

CREATE OR REPLACE FUNCTION public.check_admin_email_rate_limit(
  p_admin_id  uuid,
  p_max       integer DEFAULT 10,
  p_window    interval DEFAULT '1 hour'
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
DECLARE
  recent_count integer;
BEGIN
  IF p_admin_id IS NULL THEN
    RETURN false;
  END IF;

  -- Cross-probe block: callers asking about ANY admin other than
  -- themselves get a non-informative `true`. The legitimate caller is
  -- always the admin themselves (the edge function uses the caller's
  -- own admin_id from the JWT).
  IF auth.uid() IS NULL OR auth.uid() <> p_admin_id THEN
    RETURN true;
  END IF;

  SELECT COUNT(*) INTO recent_count
    FROM public.email_audit
    WHERE admin_user_id = p_admin_id
      AND sent_at > now() - p_window
      AND success = true;

  RETURN recent_count < p_max;
END;
$$;

-- Grant unchanged.
COMMENT ON FUNCTION public.check_admin_email_rate_limit(uuid, integer, interval) IS
  'Per-admin email rate limit. Self-query returns real answer; cross-query '
  'returns generic true (closes admin-probe information disclosure). '
  'Hardened by !84 follow-up.';

-- ─────────────────────────────────────────────────────────────────────────
-- 3. public.referral_owner_grants_in_year(p_owner_id uuid)
-- ─────────────────────────────────────────────────────────────────────────
-- Current body (supabase/migrations/20260512000000_referral_engagement_gate.sql):
--   SELECT COUNT(*) joining referral_uses + referral_codes WHERE owner = p_owner_id.
-- Any authenticated user can count any other user's referral grants in
-- the past year.
--
-- Fix: same shape as get_admin_level — self-probe works; cross-probe
-- returns 0 unless caller is admin.

CREATE OR REPLACE FUNCTION public.referral_owner_grants_in_year(p_owner_id uuid)
RETURNS integer
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_caller       uuid := auth.uid();
  v_caller_level integer;
BEGIN
  IF p_owner_id IS NULL THEN
    RETURN 0;
  END IF;

  -- Self-probe: legitimate "what's my own count" path. Common in
  -- product surfaces showing "you've granted N referrals this year".
  IF v_caller IS NOT NULL AND v_caller = p_owner_id THEN
    RETURN (
      SELECT COALESCE(count(*)::int, 0)
        FROM public.referral_uses ru
        JOIN public.referral_codes rc ON rc.code = ru.code
       WHERE rc.owner_user_id = p_owner_id
         AND ru.reward_granted_owner = true
         AND ru.used_at >= now() - interval '365 days'
    );
  END IF;

  -- Admin cross-probe: ops dashboards counting other users' activity.
  v_caller_level := COALESCE(
    (SELECT level FROM public.admin_users WHERE user_id = v_caller),
    0
  );
  IF v_caller_level >= 9 THEN
    RETURN (
      SELECT COALESCE(count(*)::int, 0)
        FROM public.referral_uses ru
        JOIN public.referral_codes rc ON rc.code = ru.code
       WHERE rc.owner_user_id = p_owner_id
         AND ru.reward_granted_owner = true
         AND ru.used_at >= now() - interval '365 days'
    );
  END IF;

  RETURN 0;
END;
$$;

REVOKE ALL ON FUNCTION public.referral_owner_grants_in_year(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.referral_owner_grants_in_year(uuid) TO authenticated;

COMMENT ON FUNCTION public.referral_owner_grants_in_year(uuid) IS
  'Count of referral grants made by p_owner_id in past 365 days. Self-'
  'probe always works; cross-probe returns 0 unless caller is level 9+. '
  'Hardened by !84 follow-up.';

-- ── Verification (run after apply, copy results into the MR) ────────────
-- For each function, run from THREE distinct sessions and confirm:
--
-- 1. As authenticated user A asking about themselves: real value.
-- 2. As authenticated user A asking about user B (non-admin): zero /
--    non-informative value.
-- 3. As authenticated user A who IS a level-9 admin asking about user
--    B: real value.
--
-- Concrete test snippets:
--
--   -- get_admin_level
--   SELECT public.get_admin_level(auth.uid());                    -- self → real
--   SELECT public.get_admin_level('00000000-0000-0000-0000-000000000000'); -- other → 0 unless admin
--
--   -- check_admin_email_rate_limit
--   SELECT public.check_admin_email_rate_limit(auth.uid());       -- self → real
--   SELECT public.check_admin_email_rate_limit('<some-admin-uuid>'); -- other → true (uninformative)
--
--   -- referral_owner_grants_in_year
--   SELECT public.referral_owner_grants_in_year(auth.uid());      -- self → real
--   SELECT public.referral_owner_grants_in_year('<some-uuid>');   -- other → 0 unless admin
