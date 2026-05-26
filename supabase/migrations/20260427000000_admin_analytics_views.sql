-- Admin analytics dashboard (PR feat/admin-analytics).
--
-- Ships four views + matching SECURITY DEFINER RPC wrappers. The RPCs
-- are what the client actually calls — they gate on
-- public.get_admin_level(auth.uid()) >= 9 so a non-admin JWT gets a
-- hard permission error, and aggregate rows never leak through RLS on
-- the base tables.
--
-- Why views + RPC rather than plain views:
--   - Plain views inherit RLS from their base tables. For a non-admin,
--     they'd silently return only that user's own rows, making the
--     "dashboard" look empty (per-user aggregates).
--   - SECURITY DEFINER runs as the owner (postgres), bypassing RLS on
--     the base tables, and the explicit admin-level check inside each
--     RPC is the single gate point.
--
-- Views are kept around so DBAs / SQL Editor users can `SELECT * FROM
-- v_analytics_*` directly as service_role for ad-hoc queries.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.analytics_daily_active_users();
--   DROP FUNCTION IF EXISTS public.analytics_feature_usage_7d();
--   DROP FUNCTION IF EXISTS public.analytics_user_funnel();
--   DROP FUNCTION IF EXISTS public.analytics_room_popularity();
--   DROP VIEW IF EXISTS public.v_analytics_daily_active_users;
--   DROP VIEW IF EXISTS public.v_analytics_feature_usage_7d;
--   DROP VIEW IF EXISTS public.v_analytics_user_funnel;
--   DROP VIEW IF EXISTS public.v_analytics_room_popularity;
--   DELETE FROM public.feature_flags WHERE flag_key = 'admin_analytics_enabled';

-- ── 1. VIEWS ──────────────────────────────────────────────────────────────

-- Daily active users over the last 30 days, one row per day (even if zero).
-- Source: user_sessions.started_at (authoritative session log per
-- Wave 1). Fallback to last_activity when started_at is null on older rows.
CREATE OR REPLACE VIEW public.v_analytics_daily_active_users AS
WITH dates AS (
  SELECT generate_series(
    (current_date - INTERVAL '29 days')::date,
    current_date,
    INTERVAL '1 day'
  )::date AS day
),
activity AS (
  SELECT
    COALESCE(started_at, last_activity, created_at)::date AS day,
    user_id
  FROM public.user_sessions
  WHERE COALESCE(started_at, last_activity, created_at)
        >= (current_date - INTERVAL '30 days')
)
SELECT
  d.day,
  COALESCE(COUNT(DISTINCT a.user_id), 0)::integer AS active_users
FROM dates d
LEFT JOIN activity a ON a.day = d.day
GROUP BY d.day
ORDER BY d.day ASC;

COMMENT ON VIEW public.v_analytics_daily_active_users IS
  '30-day DAU. One row per day, zero-filled for days with no activity.';

-- Top feature events over the last 7 days.
-- Source: user_behavior_tracking.interaction_type (the closest thing to
-- a generic "event" stream in the current schema). Aliased to
-- `event_name` per the brief.
CREATE OR REPLACE VIEW public.v_analytics_feature_usage_7d AS
SELECT
  interaction_type                   AS event_name,
  COUNT(*)::integer                  AS event_count,
  COUNT(DISTINCT user_id)::integer   AS unique_users
FROM public.user_behavior_tracking
WHERE created_at >= (now() - INTERVAL '7 days')
  AND interaction_type IS NOT NULL
GROUP BY interaction_type
ORDER BY event_count DESC;

COMMENT ON VIEW public.v_analytics_feature_usage_7d IS
  'Events in user_behavior_tracking grouped by interaction_type, last 7d.';

-- 5-stage user funnel. Each row is a stage with absolute count + %
-- relative to the top-of-funnel (total signups).
CREATE OR REPLACE VIEW public.v_analytics_user_funnel AS
WITH totals AS (
  SELECT
    COUNT(*)                                              AS signed_up,
    COUNT(*) FILTER (WHERE p.placement_completed_at IS NOT NULL)    AS took_placement,
    COUNT(*) FILTER (WHERE EXISTS (
      SELECT 1 FROM public.user_room_progress urp
      WHERE urp.user_id = p.id AND urp.progress_pct >= 100
    ))                                                    AS completed_room,
    COUNT(*) FILTER (WHERE EXISTS (
      SELECT 1 FROM public.speech_attempts sa
      WHERE sa.user_id = p.id
    ))                                                    AS tried_pronunciation,
    COUNT(*) FILTER (WHERE p.streak_longest >= 7)         AS hit_day_7_streak
  FROM public.profiles p
),
stages AS (
  SELECT 1 AS stage_order, 'signed_up'           AS stage, signed_up           AS count FROM totals
  UNION ALL
  SELECT 2,               'took_placement',               took_placement               FROM totals
  UNION ALL
  SELECT 3,               'completed_room',               completed_room               FROM totals
  UNION ALL
  SELECT 4,               'tried_pronunciation',          tried_pronunciation          FROM totals
  UNION ALL
  SELECT 5,               'hit_day_7_streak',             hit_day_7_streak             FROM totals
)
SELECT
  stage_order,
  stage,
  count::integer,
  CASE WHEN (SELECT signed_up FROM totals) > 0
       THEN ROUND(100.0 * count / (SELECT signed_up FROM totals), 1)
       ELSE 0
  END::numeric(5,1) AS pct_of_signups
FROM stages
ORDER BY stage_order;

COMMENT ON VIEW public.v_analytics_user_funnel IS
  '5-stage adoption funnel: signup → placement → first room complete → pronunciation → 7-day streak.';

-- Room popularity: enrollments (distinct users who entered), completions
-- (progress_pct >= 100), avg progress_pct.
-- Room title isn't in Postgres — rooms are JSON files. The client-side
-- view maps room_id → display title from roomManifest when rendering.
CREATE OR REPLACE VIEW public.v_analytics_room_popularity AS
SELECT
  room_id,
  COUNT(DISTINCT user_id)::integer                                   AS enrollments,
  COUNT(DISTINCT user_id) FILTER (WHERE progress_pct >= 100)::integer AS completions,
  ROUND(AVG(progress_pct)::numeric, 1)                               AS avg_progress_pct,
  MAX(last_seen_at)                                                  AS last_activity_at
FROM public.user_room_progress
WHERE room_id IS NOT NULL
GROUP BY room_id
ORDER BY enrollments DESC, avg_progress_pct DESC;

COMMENT ON VIEW public.v_analytics_room_popularity IS
  'Per-room enrollment + completion counts. Sort: enrollments desc, then avg_progress_pct desc.';

-- ── 2. SECURITY DEFINER RPC wrappers ──────────────────────────────────────

CREATE OR REPLACE FUNCTION public.analytics_daily_active_users()
RETURNS TABLE (day date, active_users integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT v.day, v.active_users
               FROM public.v_analytics_daily_active_users v;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_feature_usage_7d()
RETURNS TABLE (event_name text, event_count integer, unique_users integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT v.event_name, v.event_count, v.unique_users
               FROM public.v_analytics_feature_usage_7d v;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_user_funnel()
RETURNS TABLE (stage_order integer, stage text, "count" integer, pct_of_signups numeric)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT v.stage_order, v.stage, v."count", v.pct_of_signups
               FROM public.v_analytics_user_funnel v;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_room_popularity()
RETURNS TABLE (
  room_id text,
  enrollments integer,
  completions integer,
  avg_progress_pct numeric,
  last_activity_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY SELECT v.room_id, v.enrollments, v.completions,
                      v.avg_progress_pct, v.last_activity_at
               FROM public.v_analytics_room_popularity v;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_daily_active_users()   TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_feature_usage_7d()     TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_user_funnel()          TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_room_popularity()      TO authenticated;

-- ── 3. Feature flag row (new flag_key) ────────────────────────────────────
-- Uses the runtime DB flag mechanism from 20260424010000, so Chau can
-- flip it via /admin/feature-flags once the page is reviewed.
INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'admin_analytics_enabled',
  false,
  'Gates /admin/analytics. Admin-only regardless of this flag — the flag just lets Chau hide the route while iterating.'
)
ON CONFLICT (flag_key) DO NOTHING;
