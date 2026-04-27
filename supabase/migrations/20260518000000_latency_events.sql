-- Latency monitoring + slow-degradation alerts.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- Sentry (PR #162) catches CRASHES. The more dangerous failure mode is
-- slow degradation: edge functions don't error, they just get slower,
-- users abandon the conversation, and silently churn. ELSA has this
-- problem. We want to detect it on MercyBlade BEFORE users notice.
--
-- WHAT THIS INSTALLS
--   1. `public.latency_events` — raw per-request samples for critical
--      paths (azure-phoneme total + Azure call, ai-chat total + LLM
--      call, mercy-tts total + ElevenLabs call). 7-day retention.
--   2. `public.latency_aggregates` — daily P50/P75/P90/P95/P99 per
--      operation. 90-day retention. Computed from latency_events by the
--      `latency_aggregate_daily(date)` function.
--   3. `public.alert_history` — record of every degradation alert sent
--      (operation, current/baseline P95, increase %, sent_at, severity).
--      Used by the cron's dedup window and the admin UI.
--   4. `public.alert_pause` — single-row table holding an optional
--      "pause alerts until <ts>" timestamp the admin UI can set during
--      deploys.
--   5. `public.compute_operation_p95(operation, since)` — SECURITY
--      DEFINER RPC that returns the percentile-95 duration_ms over a
--      time window. Read by both the admin dashboard and the alert cron.
--   6. `public.latency_aggregate_daily(target_date)` — folds raw events
--      for one UTC day into latency_aggregates rows.
--   7. `public.delete_old_latency_events()` — drops latency_events
--      older than 7 days; aggregates older than 90 days.
--   8. pg_cron schedules:
--        * 02:10 UTC daily — aggregate yesterday's events.
--        * 02:20 UTC daily — delete old raw + aggregates.
--
-- HOW TO MANUALLY INVOKE
--   SELECT * FROM public.compute_operation_p95('ai-chat.total', now() - interval '1 hour');
--   SELECT public.latency_aggregate_daily(current_date - 1);
--   SELECT public.delete_old_latency_events();
--
-- HOW TO DISABLE
--   UPDATE cron.job SET active = false WHERE jobname IN
--     ('latency-aggregate-daily', 'latency-cleanup-daily');

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;


-- ── 1. latency_events ─────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.latency_events (
  id           bigserial PRIMARY KEY,
  operation    text NOT NULL,
  duration_ms  integer NOT NULL CHECK (duration_ms >= 0),
  status       text NOT NULL CHECK (status IN ('success', 'error', 'timeout')),
  recorded_at  timestamptz NOT NULL DEFAULT now(),
  metadata     jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_latency_events_op_time
  ON public.latency_events (operation, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_latency_events_recorded
  ON public.latency_events (recorded_at);

ALTER TABLE public.latency_events ENABLE ROW LEVEL SECURITY;

-- Admin level >= 9 can read raw events from the dashboard. Service-role
-- writes everything; anon/authenticated get no rows by default.
CREATE POLICY "admin_read_latency_events"
  ON public.latency_events
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.latency_events IS
  'Per-request latency samples for critical edge functions. Inserted fire-and-forget by _shared/latencyTelemetry.ts. 7-day retention enforced by delete_old_latency_events().';


-- ── 2. latency_aggregates ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.latency_aggregates (
  id              bigserial PRIMARY KEY,
  operation       text NOT NULL,
  date            date NOT NULL,
  sample_count    integer NOT NULL,
  p50_ms          integer NOT NULL,
  p75_ms          integer NOT NULL,
  p90_ms          integer NOT NULL,
  p95_ms          integer NOT NULL,
  p99_ms          integer NOT NULL,
  success_count   integer NOT NULL DEFAULT 0,
  error_count     integer NOT NULL DEFAULT 0,
  timeout_count   integer NOT NULL DEFAULT 0,
  computed_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (operation, date)
);

CREATE INDEX IF NOT EXISTS idx_latency_agg_op_date
  ON public.latency_aggregates (operation, date DESC);

ALTER TABLE public.latency_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_latency_aggregates"
  ON public.latency_aggregates
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.latency_aggregates IS
  'Daily latency rollups per operation. Computed by latency_aggregate_daily(date). 90-day retention.';


-- ── 3. alert_history ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.alert_history (
  id                bigserial PRIMARY KEY,
  operation         text NOT NULL,
  current_p95_ms    integer NOT NULL,
  baseline_p95_ms   integer NOT NULL,
  increase_percent  numeric(6,2) NOT NULL,
  severity          text NOT NULL CHECK (severity IN ('warning', 'alert', 'sustained')),
  sent_at           timestamptz NOT NULL DEFAULT now(),
  email_sent        boolean NOT NULL DEFAULT false,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_alert_history_op_recent
  ON public.alert_history (operation, sent_at DESC);

CREATE INDEX IF NOT EXISTS idx_alert_history_recent
  ON public.alert_history (sent_at DESC);

ALTER TABLE public.alert_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_alert_history"
  ON public.alert_history
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.alert_history IS
  'Record of every latency degradation alert. Used for dedup (1/op/30min) and the admin UI history list.';


-- ── 4. alert_pause ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.alert_pause (
  id            integer PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  paused_until  timestamptz,
  paused_by     uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  reason        text,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.alert_pause (id, paused_until)
VALUES (1, NULL)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.alert_pause ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_alert_pause"
  ON public.alert_pause
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

CREATE POLICY "admin_update_alert_pause"
  ON public.alert_pause
  FOR UPDATE
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9)
  WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.alert_pause IS
  'Single-row table the admin UI uses to pause alerting (e.g. during deploys). NULL paused_until = alerts active.';


-- ── 5. compute_operation_p95 RPC ──────────────────────────────────────
-- Prefer the percentile_disc aggregate over an interpolated percentile_cont
-- so the value is always a real observed sample (no half-integer artifacts).

CREATE OR REPLACE FUNCTION public.compute_operation_p95(
  p_operation text,
  p_since     timestamptz
)
RETURNS TABLE (
  p95_ms        integer,
  sample_count  integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(
      percentile_disc(0.95) WITHIN GROUP (ORDER BY duration_ms)::integer,
      0
    ) AS p95_ms,
    count(*)::integer       AS sample_count
  FROM public.latency_events
  WHERE operation = p_operation
    AND recorded_at >= p_since
    AND status <> 'error';
$$;

REVOKE ALL ON FUNCTION public.compute_operation_p95(text, timestamptz) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.compute_operation_p95(text, timestamptz) FROM anon;
GRANT EXECUTE ON FUNCTION public.compute_operation_p95(text, timestamptz) TO authenticated;
GRANT EXECUTE ON FUNCTION public.compute_operation_p95(text, timestamptz) TO service_role;

COMMENT ON FUNCTION public.compute_operation_p95(text, timestamptz) IS
  'Returns P95 duration_ms + sample count for an operation since a timestamp. Errors are excluded so we measure how slow the working path got, not how fast the failing path was.';


-- ── 6. latency_aggregate_daily ────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.latency_aggregate_daily(
  p_target_date date DEFAULT (current_date - 1)
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_inserted integer := 0;
BEGIN
  WITH stats AS (
    SELECT
      operation,
      count(*)::integer                                                   AS sample_count,
      percentile_disc(0.50) WITHIN GROUP (ORDER BY duration_ms)::integer  AS p50_ms,
      percentile_disc(0.75) WITHIN GROUP (ORDER BY duration_ms)::integer  AS p75_ms,
      percentile_disc(0.90) WITHIN GROUP (ORDER BY duration_ms)::integer  AS p90_ms,
      percentile_disc(0.95) WITHIN GROUP (ORDER BY duration_ms)::integer  AS p95_ms,
      percentile_disc(0.99) WITHIN GROUP (ORDER BY duration_ms)::integer  AS p99_ms,
      count(*) FILTER (WHERE status = 'success')::integer                 AS success_count,
      count(*) FILTER (WHERE status = 'error')::integer                   AS error_count,
      count(*) FILTER (WHERE status = 'timeout')::integer                 AS timeout_count
    FROM public.latency_events
    WHERE recorded_at >= p_target_date::timestamptz
      AND recorded_at <  (p_target_date + 1)::timestamptz
    GROUP BY operation
  )
  INSERT INTO public.latency_aggregates (
    operation, date, sample_count,
    p50_ms, p75_ms, p90_ms, p95_ms, p99_ms,
    success_count, error_count, timeout_count
  )
  SELECT
    operation, p_target_date, sample_count,
    p50_ms, p75_ms, p90_ms, p95_ms, p99_ms,
    success_count, error_count, timeout_count
  FROM stats
  ON CONFLICT (operation, date) DO UPDATE SET
    sample_count  = EXCLUDED.sample_count,
    p50_ms        = EXCLUDED.p50_ms,
    p75_ms        = EXCLUDED.p75_ms,
    p90_ms        = EXCLUDED.p90_ms,
    p95_ms        = EXCLUDED.p95_ms,
    p99_ms        = EXCLUDED.p99_ms,
    success_count = EXCLUDED.success_count,
    error_count   = EXCLUDED.error_count,
    timeout_count = EXCLUDED.timeout_count,
    computed_at   = now();

  GET DIAGNOSTICS v_inserted = ROW_COUNT;
  RETURN v_inserted;
END;
$$;

REVOKE ALL ON FUNCTION public.latency_aggregate_daily(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.latency_aggregate_daily(date) TO service_role;

COMMENT ON FUNCTION public.latency_aggregate_daily(date) IS
  'Folds raw latency_events for the given UTC date into latency_aggregates. Idempotent — rerunning recomputes the row.';


-- ── 7. delete_old_latency_events ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.delete_old_latency_events()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_events_deleted integer;
  v_aggs_deleted   integer;
BEGIN
  WITH deleted AS (
    DELETE FROM public.latency_events
    WHERE recorded_at < now() - interval '7 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_events_deleted FROM deleted;

  WITH deleted AS (
    DELETE FROM public.latency_aggregates
    WHERE date < (current_date - 90)
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_aggs_deleted FROM deleted;

  RETURN COALESCE(v_events_deleted, 0) + COALESCE(v_aggs_deleted, 0);
END;
$$;

REVOKE ALL ON FUNCTION public.delete_old_latency_events() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_old_latency_events() TO service_role;

COMMENT ON FUNCTION public.delete_old_latency_events() IS
  'Drops latency_events older than 7 days and latency_aggregates older than 90 days.';


-- ── 8. pg_cron schedules ──────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'latency-aggregate-daily') THEN
    PERFORM cron.unschedule('latency-aggregate-daily');
  END IF;
  PERFORM cron.schedule(
    'latency-aggregate-daily',
    '10 2 * * *',
    $cron$ SELECT public.latency_aggregate_daily(current_date - 1); $cron$
  );

  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'latency-cleanup-daily') THEN
    PERFORM cron.unschedule('latency-cleanup-daily');
  END IF;
  PERFORM cron.schedule(
    'latency-cleanup-daily',
    '20 2 * * *',
    $cron$ SELECT public.delete_old_latency_events(); $cron$
  );
END $$;
