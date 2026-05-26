-- Per-IP rate limit infrastructure.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- Second prerequisite for the anonymous_auth_enabled flag-flip (the
-- first was the 30-day anon cleanup migration in PR #164). Per-user
-- rate limits become trivially bypassable once anonymous auth is on:
-- a bot can rotate anon sessions and each new session id resets its
-- per-user-id quota. Per-IP rate limits cap the underlying source.
--
-- WHAT THIS INSTALLS
--   1. `public.ip_rate_limit` — sliding-window state (one row per
--      ip_hash + bucket). PRIVACY: stores SHA-256 of the IP, not the
--      raw IP. Brief: "DO NOT log raw IP addresses".
--   2. `public.ip_rate_limit_hits` — telemetry; one row per rejected
--      request with ip_hash, bucket, exceeded_by count. Lets us see
--      whether real users hit the limits (raise) or only bots
--      (limits are working).
--   3. `public.incr_ip_rate_limit(ip_hash, bucket, max, window_seconds)`
--      — SECURITY DEFINER atomic check-and-increment. Used by every
--      protected edge function via _shared/ipRateLimit.ts.
--   4. `public.delete_old_ip_rate_limit()` — reaper for rows older
--      than 24 hours (well past any active window).
--   5. pg_cron schedule running the reaper hourly.
--
-- HOW TO MANUALLY INVOKE
--   SELECT public.delete_old_ip_rate_limit();
--   SELECT public.incr_ip_rate_limit('<sha256>', 'azure-phoneme:minute', 20, 60);
--
-- HOW TO DISABLE
--   UPDATE cron.job SET active = false WHERE jobname = 'cleanup-ip-rate-limit';
--   -- or drop the call sites in the edge functions; the tables stay
--   -- harmless in the absence of writers.

-- ── 1. pg_cron pre-flight ──────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;


-- ── 2. State table ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ip_rate_limit (
  ip_hash             text NOT NULL,
  bucket              text NOT NULL,
  count               integer NOT NULL DEFAULT 0,
  window_started_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (ip_hash, bucket)
);

CREATE INDEX IF NOT EXISTS idx_ip_rate_limit_window
  ON public.ip_rate_limit (window_started_at);

ALTER TABLE public.ip_rate_limit ENABLE ROW LEVEL SECURITY;
-- No policies: service_role bypasses RLS; anon + authenticated get zero rows.

COMMENT ON TABLE public.ip_rate_limit IS
  'Per-IP rate-limit state. Row per (ip_hash, bucket). ip_hash = SHA-256 of client IP. Service-role only.';


-- ── 3. Telemetry table ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.ip_rate_limit_hits (
  id            bigserial PRIMARY KEY,
  ip_hash       text NOT NULL,
  bucket        text NOT NULL,
  hit_at        timestamptz NOT NULL DEFAULT now(),
  exceeded_by   integer NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ip_rate_limit_hits_recent
  ON public.ip_rate_limit_hits (hit_at DESC);
CREATE INDEX IF NOT EXISTS idx_ip_rate_limit_hits_bucket
  ON public.ip_rate_limit_hits (bucket, hit_at DESC);

ALTER TABLE public.ip_rate_limit_hits ENABLE ROW LEVEL SECURITY;
-- service-role only.

COMMENT ON TABLE public.ip_rate_limit_hits IS
  'One row per rejected request. Privacy: ip_hash only, never raw IP. Used to monitor whether limits hit real users or only bots.';


-- ── 4. Atomic check-and-increment RPC ──────────────────────────────────
-- Read-modify-write under a row-level lock so concurrent requests from
-- the same IP+bucket can't race past the cap. SECURITY DEFINER so the
-- service-role-only tables remain inaccessible to clients while the
-- function itself is callable from the edge functions (which authenticate
-- via the service role anyway, but keeping this DEFINER + REVOKE is the
-- belt-and-suspenders pattern matching the anon-cleanup function).

CREATE OR REPLACE FUNCTION public.incr_ip_rate_limit(
  p_ip_hash         text,
  p_bucket          text,
  p_max             integer,
  p_window_seconds  integer
)
RETURNS TABLE (
  allowed              boolean,
  count                integer,
  retry_after_seconds  integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row             public.ip_rate_limit%ROWTYPE;
  v_window_age_sec  integer;
  v_window_age      interval;
BEGIN
  IF p_ip_hash IS NULL OR length(p_ip_hash) = 0 THEN
    RAISE EXCEPTION 'incr_ip_rate_limit: ip_hash required';
  END IF;
  IF p_max <= 0 OR p_window_seconds <= 0 THEN
    RAISE EXCEPTION 'incr_ip_rate_limit: max and window_seconds must be positive';
  END IF;

  v_window_age := make_interval(secs => p_window_seconds);

  -- Atomically: try to claim/refresh the row, returning the post-update state.
  INSERT INTO public.ip_rate_limit (ip_hash, bucket, count, window_started_at)
  VALUES (p_ip_hash, p_bucket, 1, now())
  ON CONFLICT (ip_hash, bucket) DO UPDATE
  SET
    count = CASE
      WHEN public.ip_rate_limit.window_started_at + v_window_age > now()
        THEN public.ip_rate_limit.count + 1
      ELSE 1
    END,
    window_started_at = CASE
      WHEN public.ip_rate_limit.window_started_at + v_window_age > now()
        THEN public.ip_rate_limit.window_started_at
      ELSE now()
    END
  RETURNING * INTO v_row;

  v_window_age_sec := GREATEST(
    1,
    p_window_seconds - EXTRACT(EPOCH FROM (now() - v_row.window_started_at))::integer
  );

  IF v_row.count > p_max THEN
    -- Telemetry: log the rejection. Best-effort; failure here must not
    -- starve the rate-limit response.
    BEGIN
      INSERT INTO public.ip_rate_limit_hits (ip_hash, bucket, exceeded_by)
      VALUES (p_ip_hash, p_bucket, v_row.count - p_max);
    EXCEPTION WHEN OTHERS THEN
      -- Swallow.
    END;
    RETURN QUERY SELECT false, v_row.count, v_window_age_sec;
    RETURN;
  END IF;

  RETURN QUERY SELECT true, v_row.count, v_window_age_sec;
END;
$$;

COMMENT ON FUNCTION public.incr_ip_rate_limit(text, text, integer, integer) IS
  'Atomic check-and-increment for per-IP rate limiting. Returns (allowed, count, retry_after_seconds). On exceed, also writes a row to ip_rate_limit_hits.';

REVOKE ALL ON FUNCTION public.incr_ip_rate_limit(text, text, integer, integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.incr_ip_rate_limit(text, text, integer, integer) FROM anon;
REVOKE ALL ON FUNCTION public.incr_ip_rate_limit(text, text, integer, integer) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.incr_ip_rate_limit(text, text, integer, integer) TO service_role;


-- ── 5. Reaper ─────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.delete_old_ip_rate_limit()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted integer;
BEGIN
  WITH deleted AS (
    DELETE FROM public.ip_rate_limit
    WHERE window_started_at < now() - interval '24 hours'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_deleted FROM deleted;
  RETURN v_deleted;
END;
$$;

COMMENT ON FUNCTION public.delete_old_ip_rate_limit() IS
  'Reaper for ip_rate_limit rows older than 24 hours. Window state past 24h is far beyond any live cap so safe to drop.';

REVOKE ALL ON FUNCTION public.delete_old_ip_rate_limit() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.delete_old_ip_rate_limit() FROM anon;
REVOKE ALL ON FUNCTION public.delete_old_ip_rate_limit() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.delete_old_ip_rate_limit() TO service_role;


-- ── 6. Hourly reaper schedule ─────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'cleanup-ip-rate-limit') THEN
    PERFORM cron.unschedule('cleanup-ip-rate-limit');
  END IF;

  PERFORM cron.schedule(
    'cleanup-ip-rate-limit',
    '0 * * * *',
    $cron$ SELECT public.delete_old_ip_rate_limit(); $cron$
  );
END $$;
