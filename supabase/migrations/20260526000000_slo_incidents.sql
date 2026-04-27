-- Error-budget SLO infrastructure.
--
-- WHY THIS EXISTS
-- ───────────────────────────────────────────────────────────────────────
-- PRs #162 (Sentry) and #185 (latency monitoring) catch SPECIFIC
-- failures. Error budgets aggregate them: "are we trending toward
-- unreliable?" When the budget burn rate spikes, we should pause
-- non-critical work and fix reliability first.
--
-- WHAT THIS INSTALLS
--   1. `public.slo_incidents` — auto-created when an SLO enters
--      'critical' state; auto-resolved when the SLO returns to
--      'healthy' for INCIDENT_AUTO_RESOLVE_HOURS (4h).
--   2. `public.slo_burn_alerts` — log of every burn-rate alert sent
--      (for dedup + dashboard "recent burns" table).
--   3. `feature_flags` row `slo_pause_active` — when true, future CI
--      gates + experiment toggles can use this as a kill switch for
--      non-critical work.
--   4. `public.snapshot_app_crash_rate(percent_crash_free, sample_count)`
--      and `public.snapshot_db_query_p95(p95_ms, sample_count)` —
--      writers for the two SLO data sources that don't come from
--      latency_events. Designed for an external puller (future cron)
--      to call. Tables: `sentry_crash_rate_snapshots` +
--      `db_p95_snapshots`. 30-day retention.
--
-- HOW TO MANUALLY INVOKE
--   SELECT * FROM public.slo_incidents WHERE resolved_at IS NULL;
--   UPDATE public.feature_flags SET is_enabled = true
--     WHERE flag_key = 'slo_pause_active';

-- ── 1. slo_incidents ──────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.slo_incidents (
  id              bigserial PRIMARY KEY,
  slo_id          text NOT NULL,
  started_at      timestamptz NOT NULL DEFAULT now(),
  resolved_at     timestamptz,
  peak_burn_rate  numeric(8,2),
  peak_status     text NOT NULL DEFAULT 'critical',
  metadata        jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_slo_incidents_open
  ON public.slo_incidents (slo_id, started_at DESC)
  WHERE resolved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_slo_incidents_recent
  ON public.slo_incidents (started_at DESC);

ALTER TABLE public.slo_incidents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_slo_incidents"
  ON public.slo_incidents
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.slo_incidents IS
  'Auto-managed incidents. One row per uninterrupted critical-or-worse window per SLO. Resolved after 4 healthy hours.';


-- ── 2. slo_burn_alerts ────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.slo_burn_alerts (
  id            bigserial PRIMARY KEY,
  slo_id        text NOT NULL,
  severity      text NOT NULL CHECK (severity IN ('fast', 'slow')),
  burn_rate     numeric(8,2) NOT NULL,
  budget_remaining_percent numeric(6,2) NOT NULL,
  sent_at       timestamptz NOT NULL DEFAULT now(),
  email_sent    boolean NOT NULL DEFAULT false,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_slo_burn_alerts_slo_recent
  ON public.slo_burn_alerts (slo_id, sent_at DESC);

ALTER TABLE public.slo_burn_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_slo_burn_alerts"
  ON public.slo_burn_alerts
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

COMMENT ON TABLE public.slo_burn_alerts IS
  'Per-burn-alert log. Used by error-budget-alert cron for dedup (1/SLO/6h) and the admin dashboard recent-burns table.';


-- ── 3. slo_pause_active feature flag ──────────────────────────────────

INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'slo_pause_active',
  false,
  'When true, signals to non-critical experiments + future deploy gates that error budget is being burned and risky work should pause. Toggled via /admin/slo dashboard.'
)
ON CONFLICT (flag_key) DO NOTHING;


-- ── 4. external snapshot tables (Sentry + DB P95) ─────────────────────

CREATE TABLE IF NOT EXISTS public.sentry_crash_rate_snapshots (
  id                  bigserial PRIMARY KEY,
  recorded_at         timestamptz NOT NULL DEFAULT now(),
  percent_crash_free  numeric(6,3) NOT NULL,
  sample_count        integer NOT NULL,
  metadata            jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sentry_snap_recent
  ON public.sentry_crash_rate_snapshots (recorded_at DESC);

ALTER TABLE public.sentry_crash_rate_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_sentry_snap"
  ON public.sentry_crash_rate_snapshots
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

CREATE TABLE IF NOT EXISTS public.db_p95_snapshots (
  id            bigserial PRIMARY KEY,
  recorded_at   timestamptz NOT NULL DEFAULT now(),
  p95_ms        integer NOT NULL,
  sample_count  integer NOT NULL,
  metadata      jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_db_p95_snap_recent
  ON public.db_p95_snapshots (recorded_at DESC);

ALTER TABLE public.db_p95_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_read_db_p95_snap"
  ON public.db_p95_snapshots
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

CREATE OR REPLACE FUNCTION public.snapshot_app_crash_rate(
  p_percent_crash_free numeric,
  p_sample_count integer
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO public.sentry_crash_rate_snapshots (percent_crash_free, sample_count)
  VALUES (p_percent_crash_free, p_sample_count)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.snapshot_app_crash_rate(numeric, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.snapshot_app_crash_rate(numeric, integer) TO service_role;

CREATE OR REPLACE FUNCTION public.snapshot_db_query_p95(
  p_p95_ms integer,
  p_sample_count integer
)
RETURNS bigint
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id bigint;
BEGIN
  INSERT INTO public.db_p95_snapshots (p95_ms, sample_count)
  VALUES (p_p95_ms, p_sample_count)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

REVOKE ALL ON FUNCTION public.snapshot_db_query_p95(integer, integer) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.snapshot_db_query_p95(integer, integer) TO service_role;


-- ── 5. retention cleanup ──────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.delete_old_slo_data()
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
    DELETE FROM public.slo_burn_alerts
    WHERE sent_at < now() - interval '90 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  WITH d AS (
    DELETE FROM public.sentry_crash_rate_snapshots
    WHERE recorded_at < now() - interval '30 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  WITH d AS (
    DELETE FROM public.db_p95_snapshots
    WHERE recorded_at < now() - interval '30 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  -- Resolved incidents older than 180 days are noise.
  WITH d AS (
    DELETE FROM public.slo_incidents
    WHERE resolved_at IS NOT NULL
      AND resolved_at < now() - interval '180 days'
    RETURNING 1
  )
  SELECT count(*)::integer INTO v_n FROM d;
  v_total := v_total + COALESCE(v_n, 0);

  RETURN v_total;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_old_slo_data() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_old_slo_data() TO service_role;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'slo-cleanup-daily') THEN
    PERFORM cron.unschedule('slo-cleanup-daily');
  END IF;
  PERFORM cron.schedule(
    'slo-cleanup-daily',
    '30 2 * * *',
    $cron$ SELECT public.delete_old_slo_data(); $cron$
  );
END $$;
