-- ============================================================================
-- placement-v3-session keepalive  (BUG-placement-v3-session-gateway-net-err-failed)
-- ----------------------------------------------------------------------------
-- The placement-v3-session edge function intermittently returns
-- net::ERR_FAILED with no HTTP response under COLD START / load. The dominant
-- cold-boot cost is the remote `esm.sh/@supabase/supabase-js@2` ESM import
-- (see the bug report's cold-init analysis) which is on the first-response
-- critical path and cannot be lazy-loaded away.
--
-- This job keeps one isolate warm by pinging the function on a short interval.
-- A GET reaches the function and returns 405 (method_not_allowed) *before* any
-- auth or forensic-logging runs (index.ts: OPTIONS check, then
-- `req.method !== "POST"` → 405), so the ping boots/keeps the isolate with
-- ZERO side effects — no auth, no DB write, no forensic-log row.
--
-- Auth: `Authorization: Bearer <anon_key>` — the anon key is itself a valid
-- (anon-role) JWT, so the ping passes the gateway whether or not
-- placement-v3-session sets verify_jwt. The anon key is public (it ships in the
-- web bundle as VITE_SUPABASE_ANON_KEY); it is NOT a secret.
--
-- DEPLOY IS A CHAU GATE. Do not apply automatically. See the report for the
-- exact command. Before applying: replace <PROJECT_ANON_KEY> below with the
-- project anon key (same value as VITE_SUPABASE_ANON_KEY / supabaseClient.ts).
--
-- Gating: only worth deploying if cold start is confirmed the trigger. If
-- Supabase edge logs for a failed invocation show NO boot line at all, the
-- gateway is dropping requests before boot for a reason a warm instance may
-- not fix — confirm via logs (report Part 3) before relying on this.
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

DO $$
BEGIN
  -- Idempotent: replace any prior schedule so re-applying is safe.
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'placement-v3-session-keepalive') THEN
    PERFORM cron.unschedule('placement-v3-session-keepalive');
  END IF;

  -- Every 4 minutes: short enough to stay inside the edge idle-eviction
  -- window, infrequent enough to be negligible load. Tune if logs show the
  -- isolate still going cold between pings.
  PERFORM cron.schedule(
    'placement-v3-session-keepalive',
    '*/4 * * * *',
    $cron$
      SELECT net.http_get(
        url     := 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/placement-v3-session',
        headers := jsonb_build_object(
          'apikey', '<PROJECT_ANON_KEY>',
          'Authorization', 'Bearer <PROJECT_ANON_KEY>'
        ),
        timeout_milliseconds := 8000
      );
    $cron$
  );
END $$;

-- To remove later:
--   SELECT cron.unschedule('placement-v3-session-keepalive');
