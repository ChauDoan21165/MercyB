-- Core Web Vitals (LCP / FID / CLS / TTFB / FCP / INP) telemetry.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- Backend reliability is monitored (PRs #162 + #185 + #196). Frontend
-- performance was invisible — slow LCPs, layout shifts, large bundles
-- all silently hurt SEO and retention. This table backs the
-- /admin/frontend-perf dashboard + the perf-alert cron.
--
-- WHAT THIS INSTALLS
--   1. `public.web_vitals_events` — one row per metric reported by the
--      browser via src/lib/perf/webVitalsTracking.ts. Privacy: route +
--      metric + value + device class only. NO user_id, NO session id,
--      NO cookies. Anonymous insert allowed (writes only).
--   2. `public.web_vitals_aggregates` — daily P50/P95 per (route,
--      metric, device_class). 90-day retention.
--   3. `public.aggregate_web_vitals_daily(date)` — fold raw events for
--      one UTC day into the aggregates table.
--   4. `public.delete_old_web_vitals()` — drops events >7d, aggregates >90d.
--   5. pg_cron schedules: aggregate at 02:50 UTC, cleanup at 03:00 UTC.

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;


-- ── 1. raw events ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.web_vitals_events (
  id            bigserial PRIMARY KEY,
  route         text NOT NULL,
  metric_name   text NOT NULL CHECK (metric_name IN ('LCP','FID','CLS','TTFB','FCP','INP')),
  value_ms      numeric(12,2) NOT NULL CHECK (value_ms >= 0),
  device_class  text NOT NULL CHECK (device_class IN ('mobile','desktop')),
  rating        text,
  recorded_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_route_time
  ON public.web_vitals_events (route, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_web_vitals_metric_time
  ON public.web_vitals_events (metric_name, recorded_at DESC);

CREATE INDEX IF NOT EXISTS idx_web_vitals_recent
  ON public.web_vitals_events (recorded_at);

ALTER TABLE public.web_vitals_events ENABLE ROW LEVEL SECURITY;

-- Anonymous + authenticated browsers may INSERT (no PII in the row).
-- Reads are restricted to admin level >= 9.
CREATE POLICY "anyone_can_insert_web_vitals"
  ON public.web_vitals_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "admin_read_web_vitals"
  ON public.web_vitals_events
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.web_vitals_events IS
  'Per-metric Web Vitals samples from the browser. Privacy: route + metric + value + device only — NO user_id, NO session id. 7-day retention.';


-- ── 2. aggregates ─────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.web_vitals_aggregates (
  id              bigserial PRIMARY KEY,
  date            date NOT NULL,
  route           text NOT NULL,
  metric_name     text NOT NULL,
  device_class    text NOT NULL,
  sample_count    integer NOT NULL,
  p50_value       numeric(12,2) NOT NULL,
  p75_value       numeric(12,2) NOT NULL,
  p95_value       numeric(12,2) NOT NULL,
  p99_value       numeric(12,2) NOT NULL,
  good_count      integer NOT NULL DEFAULT 0,
  poor_count      integer NOT NULL DEFAULT 0,
  computed_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (date, route, metric_name, device_class)
);

CREATE INDEX IF NOT EXISTS idx_web_vitals_agg_recent
  ON public.web_vitals_aggregates (date DESC, route, metric_name);

ALTER TABLE public.web_vitals_aggregates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_web_vitals_aggregates"
  ON public.web_vitals_aggregates
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.web_vitals_aggregates IS
  'Daily Web Vitals rollups. 90-day retention. Computed by aggregate_web_vitals_daily().';


-- ── 3. perf-alert dedup log ──────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.perf_alert_history (
  id                bigserial PRIMARY KEY,
  route             text NOT NULL,
  metric_name       text NOT NULL,
  current_p95_ms    numeric(12,2) NOT NULL,
  threshold_ms      numeric(12,2) NOT NULL,
  sample_count      integer NOT NULL,
  device_class      text,
  sent_at           timestamptz NOT NULL DEFAULT now(),
  email_sent        boolean NOT NULL DEFAULT false,
  metadata          jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_perf_alert_route_recent
  ON public.perf_alert_history (route, sent_at DESC);

ALTER TABLE public.perf_alert_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_perf_alert_history"
  ON public.perf_alert_history
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);


-- ── 4. aggregator ─────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.aggregate_web_vitals_daily(
  p_target_date date DEFAULT (current_date - 1)
)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_n integer;
BEGIN
  WITH stats AS (
    SELECT
      route,
      metric_name,
      device_class,
      count(*)::integer AS sample_count,
      percentile_disc(0.50) WITHIN GROUP (ORDER BY value_ms)::numeric AS p50_value,
      percentile_disc(0.75) WITHIN GROUP (ORDER BY value_ms)::numeric AS p75_value,
      percentile_disc(0.95) WITHIN GROUP (ORDER BY value_ms)::numeric AS p95_value,
      percentile_disc(0.99) WITHIN GROUP (ORDER BY value_ms)::numeric AS p99_value,
      count(*) FILTER (WHERE rating = 'good')::integer AS good_count,
      count(*) FILTER (WHERE rating = 'poor')::integer AS poor_count
    FROM public.web_vitals_events
    WHERE recorded_at >= p_target_date::timestamptz
      AND recorded_at <  (p_target_date + 1)::timestamptz
    GROUP BY route, metric_name, device_class
  )
  INSERT INTO public.web_vitals_aggregates (
    date, route, metric_name, device_class,
    sample_count, p50_value, p75_value, p95_value, p99_value,
    good_count, poor_count
  )
  SELECT
    p_target_date, route, metric_name, device_class,
    sample_count, p50_value, p75_value, p95_value, p99_value,
    good_count, poor_count
  FROM stats
  ON CONFLICT (date, route, metric_name, device_class) DO UPDATE SET
    sample_count = EXCLUDED.sample_count,
    p50_value    = EXCLUDED.p50_value,
    p75_value    = EXCLUDED.p75_value,
    p95_value    = EXCLUDED.p95_value,
    p99_value    = EXCLUDED.p99_value,
    good_count   = EXCLUDED.good_count,
    poor_count   = EXCLUDED.poor_count,
    computed_at  = now();

  GET DIAGNOSTICS v_n = ROW_COUNT;
  RETURN v_n;
END;
$$;

REVOKE ALL ON FUNCTION public.aggregate_web_vitals_daily(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.aggregate_web_vitals_daily(date) TO service_role;


-- ── 5. cleanup ────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.delete_old_web_vitals()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_total integer := 0;
  v_n integer;
BEGIN
  WITH d AS (
    DELETE FROM public.web_vitals_events
    WHERE recorded_at < now() - interval '7 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  WITH d AS (
    DELETE FROM public.web_vitals_aggregates
    WHERE date < (current_date - 90)
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  WITH d AS (
    DELETE FROM public.perf_alert_history
    WHERE sent_at < now() - interval '90 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_old_web_vitals() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_old_web_vitals() TO service_role;


-- ── 6. P95 helper for the perf-alert cron ────────────────────────────

CREATE OR REPLACE FUNCTION public.compute_route_p95(
  p_route text,
  p_metric_name text,
  p_since timestamptz
)
RETURNS TABLE (
  p95_value     numeric,
  sample_count  integer
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(
      percentile_disc(0.95) WITHIN GROUP (ORDER BY value_ms)::numeric,
      0
    ) AS p95_value,
    count(*)::integer AS sample_count
  FROM public.web_vitals_events
  WHERE route = p_route
    AND metric_name = p_metric_name
    AND recorded_at >= p_since;
$$;

REVOKE ALL ON FUNCTION public.compute_route_p95(text, text, timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.compute_route_p95(text, text, timestamptz) TO service_role;
GRANT EXECUTE ON FUNCTION public.compute_route_p95(text, text, timestamptz) TO authenticated;


-- ── 7. cron schedules ─────────────────────────────────────────────────

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'web-vitals-aggregate-daily') THEN
    PERFORM cron.unschedule('web-vitals-aggregate-daily');
  END IF;
  PERFORM cron.schedule(
    'web-vitals-aggregate-daily',
    '50 2 * * *',
    $cron$ SELECT public.aggregate_web_vitals_daily(current_date - 1); $cron$
  );

  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'web-vitals-cleanup-daily') THEN
    PERFORM cron.unschedule('web-vitals-cleanup-daily');
  END IF;
  PERFORM cron.schedule(
    'web-vitals-cleanup-daily',
    '0 3 * * *',
    $cron$ SELECT public.delete_old_web_vitals(); $cron$
  );
END $$;
