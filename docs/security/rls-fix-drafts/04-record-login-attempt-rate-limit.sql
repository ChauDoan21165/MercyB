-- ─────────────────────────────────────────────────────────────────────────
-- DRAFT — DO NOT APPLY FROM THIS LOCATION
-- ─────────────────────────────────────────────────────────────────────────
-- This file lives in docs/security/rls-fix-drafts/, NOT in
-- supabase/migrations/. See ./README.md.
--
-- Finding: !84 §1 finding #4 / §3A — MEDIUM-HIGH.
--          `public.record_login_attempt(...)` is callable by anon and
--          inserts attacker-supplied (email, ip, user_agent) rows into
--          public.login_attempts. Downstream brute-force lockout logic
--          counts those rows; an attacker can flood the table with the
--          email of a legitimate user + fake IPs to trigger their
--          lockout — a denial-of-service vector.
-- ─────────────────────────────────────────────────────────────────────────
--
-- Background
-- ----------
-- Defined in supabase/migrations/20260622000000_secdef_browser_write_wrappers.sql:96
-- Body validates email shape and clamps lengths but has NO rate limit.
-- Granted EXECUTE to anon + authenticated + service_role (line 158 of
-- the same migration).
--
-- The function exists because the browser needs to record failed login
-- attempts BEFORE the user is authenticated (the pre-auth anon
-- context). That's a legitimate use case; we can't just revoke the
-- anon grant without breaking lockout telemetry.
--
-- Existing rate-limit machinery
-- -----------------------------
-- supabase/migrations/20260516000000_ip_rate_limit.sql ships
--   public.ip_rate_limit table +
--   public.incr_ip_rate_limit(p_ip text, p_bucket text, p_capacity int, p_window_seconds int)
-- which is the canonical atomic check-and-increment. We re-use it.
--
-- Fix shape
-- ---------
-- Inside record_login_attempt, before the INSERT, call
-- incr_ip_rate_limit with bucket 'login_attempt' and per-IP capacity.
-- If the IP is over the limit, raise an exception (preserves the
-- exception-on-bad-input contract the function already uses).
--
-- Choice of capacity: ~20 attempts per IP per 5 minutes. Calibration:
--   - A real user mistyping their password 3-5 times in 5 minutes is
--     well below.
--   - A legitimate shared NAT gateway might see 10-15 distinct users
--     hitting login in 5 minutes; still below.
--   - An attacker scripting against one user's email needs to be below
--     20/5min to evade; that's slow enough to make the brute-force
--     wall-clock cost meaningful while the existing per-email lockout
--     (in app code) catches the password-guessing pattern.
--
-- Tradeoff documented
-- -------------------
-- Behind a load balancer / Cloudflare, all users share the LB's IP.
-- We mitigate by having the browser pass the real client IP via
-- _ip_address (the existing function param). If _ip_address is NULL
-- we treat it as a single-IP bucket called '_no_ip' — which is the
-- DoS-worst case but matches today's behavior at least.
--
-- An alternative — per-email rate limit — was considered but rejected:
-- an attacker who wants to lock out user@example.com could just hit
-- the function with email='user@example.com' from many IPs (botnet).
-- Per-IP catches the practical attacker; per-email would actively
-- enable DoS by letting any anon enumerate "can I trigger lockout for
-- email X". Per-IP is the right knob.

CREATE OR REPLACE FUNCTION public.record_login_attempt(
  _email          text,
  _success        boolean,
  _ip_address     text DEFAULT NULL,
  _user_agent     text DEFAULT NULL,
  _failure_reason text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_id    uuid;
  v_rate_bucket text;
  v_rate_ok     boolean;
BEGIN
  -- ── Input validation (unchanged from 20260622) ───────────────────────
  IF _email IS NULL OR btrim(_email) = '' THEN
    RAISE EXCEPTION 'record_login_attempt: email is required'
      USING ERRCODE = '22023';
  END IF;
  IF position('@' in _email) < 2 OR length(_email) > 320 THEN
    RAISE EXCEPTION 'record_login_attempt: malformed email'
      USING ERRCODE = '22023';
  END IF;
  IF _success IS NULL THEN
    RAISE EXCEPTION 'record_login_attempt: success is required'
      USING ERRCODE = '22023';
  END IF;

  -- ── NEW: per-IP rate limit (20 attempts / 5 minutes / IP) ────────────
  v_rate_bucket := COALESCE(left(_ip_address, 100), '_no_ip');
  v_rate_ok := public.incr_ip_rate_limit(
    p_ip              := v_rate_bucket,
    p_bucket          := 'login_attempt',
    p_capacity        := 20,
    p_window_seconds  := 300
  );
  IF NOT v_rate_ok THEN
    -- Generic error code; do not echo the bucket. Calling code in
    -- src/utils/securityUtils.ts already treats record_login_attempt
    -- exceptions as a no-op (telemetry-failure path), so a rate-limit
    -- breach here silently drops the row — which is exactly what we
    -- want for an attacker. Real users hitting their own login flow
    -- never reach 20 attempts in 5 minutes.
    RAISE EXCEPTION 'record_login_attempt: rate limit exceeded'
      USING ERRCODE = '53400';   -- SQLSTATE: configuration_limit_exceeded
  END IF;

  -- ── Insert (unchanged from 20260622) ─────────────────────────────────
  INSERT INTO public.login_attempts (
    email, ip_address, user_agent, success, failure_reason
  )
  VALUES (
    left(_email, 320),
    left(_ip_address, 100),
    left(_user_agent, 1024),
    _success,
    left(_failure_reason, 500)
  )
  RETURNING id INTO attempt_id;

  RETURN attempt_id;
END;
$$;

COMMENT ON FUNCTION public.record_login_attempt(text, boolean, text, text, text) IS
  'Records a login attempt (pre-auth telemetry). Anon-callable. '
  'Per-IP rate limit: 20 attempts / 5 minutes via public.incr_ip_rate_limit '
  '(bucket=login_attempt). Closes the brute-force-lockout DoS surface '
  'from !84 finding #4.';

-- Grants unchanged; the existing
--   GRANT EXECUTE … TO anon, authenticated, service_role
-- from 20260622000000_secdef_browser_write_wrappers.sql still applies.

-- ── Verification (run after apply) ─────────────────────────────────────
--
-- 1. Happy path: an authenticated user mistyping their password 3 times
--    in a row succeeds.
--   SELECT public.record_login_attempt('a@b.com', false, '1.2.3.4', 'ua', 'wrong_pw');
--   -- repeat ×3 → returns 3 distinct uuids, all logged.
--
-- 2. Attacker path: 25 calls from the same IP in <5min.
--   -- The first 20 succeed; the next 5 raise:
--   --   ERROR: record_login_attempt: rate limit exceeded (SQLSTATE 53400)
--   -- The browser caller in securityUtils.ts catches and silently drops.
--
-- 3. Real-IP fallback: caller passes _ip_address = NULL.
--   -- All NULL-IP calls share the '_no_ip' bucket. Documented above —
--   -- this is the worst-case path; mitigation is "make sure the
--   -- browser sends the real client IP". Confirm src/utils/securityUtils.ts
--   -- already does this (it should via Supabase Auth's request.ip()).
--
-- 4. Confirm the ip_rate_limit row exists post-call:
--   SELECT * FROM public.ip_rate_limit
--    WHERE bucket = 'login_attempt' AND ip = '1.2.3.4'
--    ORDER BY window_start DESC LIMIT 1;
--   Expect a row with hits = N.
--
-- 5. After 5 minutes of idle, a fresh attempt from the same IP succeeds
--    (window has rolled).
