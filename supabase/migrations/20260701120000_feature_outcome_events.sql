-- Track 1 — feature outcome signal + get_feature_outcome RPC.
--
-- New objects ONLY (no ALTER on existing tables, no DROP, no cutover) per the
-- Supabase lockout. Human-reviewed; apply manually via SQL Editor — do NOT run
-- supabase db push from CI.
--
-- feature_outcome_events: per-user, per-feature product telemetry (first-party,
-- NOT marketing — independent of setMarketingConsent). The client emit is in
-- src/lib/analytics.ts, gated behind the RETENTION_OUTCOME_EVENTS feature flag.
-- get_feature_outcome: the success gate — "win" = returned at D7 AND completed
-- >= N interactions, computed against this table + user_sessions.

-- ─────────────────────────────────────────────────────────────────────────
-- 1. Event table
-- ─────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.feature_outcome_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  feature_key text NOT NULL,
  event       text NOT NULL CHECK (event IN ('shown', 'engaged', 'completed')),
  payload     jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.feature_outcome_events IS
  'First-party per-user feature telemetry for the D1/D7/D30 outcome gate. Written by the client (src/lib/analytics.ts) behind the RETENTION_OUTCOME_EVENTS flag; read by the get_feature_outcome RPC. Not marketing telemetry.';

CREATE INDEX IF NOT EXISTS feature_outcome_events_feature_time_idx
  ON public.feature_outcome_events (feature_key, occurred_at);
CREATE INDEX IF NOT EXISTS feature_outcome_events_user_idx
  ON public.feature_outcome_events (user_id, occurred_at);

ALTER TABLE public.feature_outcome_events ENABLE ROW LEVEL SECURITY;

-- Authenticated users may insert only their own rows; they may read only their
-- own rows. Admin/analytics reads go through the SECURITY DEFINER RPC below
-- (which bypasses RLS), so no broad SELECT policy is granted.
DROP POLICY IF EXISTS feature_outcome_events_insert_own ON public.feature_outcome_events;
CREATE POLICY feature_outcome_events_insert_own
  ON public.feature_outcome_events
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS feature_outcome_events_select_own ON public.feature_outcome_events;
CREATE POLICY feature_outcome_events_select_own
  ON public.feature_outcome_events
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────────────────────────────────
-- 2. Outcome gate RPC — admin-only (mirrors get_cohort_retention auth)
-- ─────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.get_feature_outcome(
  p_feature_key      text,
  p_since            timestamptz DEFAULT (now() - interval '30 days'),
  p_min_interactions integer     DEFAULT 3
)
RETURNS TABLE (
  feature_key  text,
  shown        integer,
  returned_d7  integer,
  completed_n  integer,
  won          integer,
  win_rate     numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF coalesce(public.get_admin_level(), 0) < 9 THEN
    RETURN;
  END IF;

  RETURN QUERY
  WITH shown_users AS (
    -- first time each user was shown the feature in the window
    SELECT e.user_id, min(e.occurred_at) AS first_shown
      FROM public.feature_outcome_events e
     WHERE e.feature_key = p_feature_key
       AND e.event = 'shown'
       AND e.occurred_at >= p_since
     GROUP BY e.user_id
  ),
  returned AS (
    -- returned within 7 days of first_shown (a session strictly after, <= +7d)
    SELECT DISTINCT s.user_id
      FROM user_sessions s
      JOIN shown_users su ON su.user_id = s.user_id
     WHERE s.created_at >  su.first_shown
       AND s.created_at <= su.first_shown + interval '7 days'
  ),
  completed AS (
    -- >= p_min_interactions 'completed' events within 7 days of first_shown
    SELECT e.user_id
      FROM public.feature_outcome_events e
      JOIN shown_users su ON su.user_id = e.user_id
     WHERE e.feature_key = p_feature_key
       AND e.event = 'completed'
       AND e.occurred_at >= su.first_shown
       AND e.occurred_at <= su.first_shown + interval '7 days'
     GROUP BY e.user_id
    HAVING count(*) >= p_min_interactions
  )
  SELECT
    p_feature_key,
    (SELECT count(*) FROM shown_users)::integer,
    (SELECT count(*) FROM returned)::integer,
    (SELECT count(*) FROM completed)::integer,
    (SELECT count(*) FROM returned r WHERE r.user_id IN (SELECT user_id FROM completed))::integer,
    round(
      100.0 * (SELECT count(*) FROM returned r WHERE r.user_id IN (SELECT user_id FROM completed))
      / nullif((SELECT count(*) FROM shown_users), 0),
      1
    );
END;
$$;

REVOKE ALL ON FUNCTION public.get_feature_outcome(text, timestamptz, integer) FROM public, anon;
GRANT EXECUTE ON FUNCTION public.get_feature_outcome(text, timestamptz, integer) TO authenticated;

-- ─────────────────────────────────────────────────────────────────────────
-- 3. pg_cron schedule for the aggregator — APPLY MANUALLY (Chau), NOT via push.
--    Requires pg_cron + pg_net; fill the project ref + ADMIN_CRON_SECRET.
-- ─────────────────────────────────────────────────────────────────────────
-- select cron.schedule(
--   'cohort-retention-aggregator-daily',
--   '15 3 * * *',                       -- 03:15 UTC daily
--   $cron$
--     select net.http_post(
--       url     := 'https://buemdfxyhxunzpgdoqin.supabase.co/functions/v1/cohort-retention-aggregator',
--       headers := jsonb_build_object('Content-Type','application/json','x-cron-secret', current_setting('app.admin_cron_secret', true)),
--       body    := '{}'::jsonb
--     );
--   $cron$
-- );
