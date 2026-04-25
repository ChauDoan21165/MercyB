-- 20260425165003_compounding_analytics.sql
--
-- Step 11 (Data moat) — compounding analytics views.
--
-- Ships four read-side views + matching SECURITY DEFINER RPC wrappers.
-- The RPCs are what the client actually calls; every RPC gates on
-- public.get_admin_level(auth.uid()) >= 9 (same pattern as the
-- existing 20260427000000_admin_analytics_views migration).
--
-- The analytics here are about LEARNING outcomes, not just usage:
--   1. user_cohorts                  — weekly signup buckets
--   2. cohort_retention_daily        — % users active on day 1/7/14/30
--                                       per cohort
--   3. l1_rule_effectiveness         — derived from speech_attempts.error_code:
--                                       % attempts that improved on a
--                                       second try at the same line.
--                                       Until L1 hint logging lands,
--                                       this is the closest proxy we
--                                       have for "did the L1 message
--                                       work?". TODO at the bottom.
--   4. weakness_trends_weekly        — per-user weakness flag counts
--                                       over time, derived from
--                                       user_placements.weakness_flags.
--
-- Materialization: views are computed-on-read. If any prove too slow
-- in production, swap to MATERIALIZED VIEW + a scheduled refresh —
-- see TODO blocks at the end of each section.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.analytics_cohort_retention();
--   DROP FUNCTION IF EXISTS public.analytics_l1_rule_effectiveness();
--   DROP FUNCTION IF EXISTS public.analytics_weakness_trends_weekly();
--   DROP FUNCTION IF EXISTS public.analytics_user_cohorts();
--   DROP VIEW IF EXISTS public.v_analytics_cohort_retention_daily;
--   DROP VIEW IF EXISTS public.v_analytics_l1_rule_effectiveness;
--   DROP VIEW IF EXISTS public.v_analytics_weakness_trends_weekly;
--   DROP VIEW IF EXISTS public.v_analytics_user_cohorts;

-- ── 1. user_cohorts view ──────────────────────────────────────────────────
-- One row per user, tagged with the ISO-week start date their account
-- was created. We use date_trunc('week', ...) so Monday is the cohort
-- anchor (Postgres default).

CREATE OR REPLACE VIEW public.v_analytics_user_cohorts AS
SELECT
  p.id                                        AS user_id,
  date_trunc('week', p.created_at)::date      AS cohort_week,
  p.created_at                                AS signed_up_at
FROM public.profiles p
WHERE p.created_at IS NOT NULL;

COMMENT ON VIEW public.v_analytics_user_cohorts IS
  'Step 11. One row per user with their weekly signup cohort (Monday-anchored).';

-- ── 2. cohort_retention_daily view ────────────────────────────────────────
-- For each cohort, % of users active on day N after signup, where N
-- ∈ {1, 7, 14, 30}. "Active" = at least one user_sessions row whose
-- last_activity falls within that day's window.
--
-- Returns one row per (cohort_week, day_offset). Empty cohorts are
-- returned with retained_users = 0 / retention_pct = 0 so the chart
-- doesn't have gaps.

CREATE OR REPLACE VIEW public.v_analytics_cohort_retention_daily AS
WITH offsets(day_offset) AS (
  VALUES (1), (7), (14), (30)
),
cohort_sizes AS (
  SELECT cohort_week, COUNT(*)::integer AS cohort_size
  FROM public.v_analytics_user_cohorts
  GROUP BY cohort_week
),
activity AS (
  -- A user is "active on day N" if any session row's last_activity
  -- falls in [signed_up_at + N days - 12h, signed_up_at + N days + 12h].
  -- The 24h window centred on day-N keeps semantics intuitive when a
  -- user signs up at 11pm and comes back at 1am the next day.
  SELECT
    c.cohort_week,
    o.day_offset,
    COUNT(DISTINCT s.user_id)::integer AS retained_users
  FROM public.v_analytics_user_cohorts c
  CROSS JOIN offsets o
  LEFT JOIN public.user_sessions s
    ON  s.user_id = c.user_id
    AND s.last_activity BETWEEN
            (c.signed_up_at + (o.day_offset || ' days')::interval - INTERVAL '12 hours')
        AND (c.signed_up_at + (o.day_offset || ' days')::interval + INTERVAL '12 hours')
  GROUP BY c.cohort_week, o.day_offset
)
SELECT
  a.cohort_week,
  a.day_offset,
  cs.cohort_size,
  a.retained_users,
  CASE
    WHEN cs.cohort_size = 0 THEN 0
    ELSE ROUND((a.retained_users::numeric / cs.cohort_size) * 100, 1)
  END AS retention_pct
FROM activity a
JOIN cohort_sizes cs ON cs.cohort_week = a.cohort_week
ORDER BY a.cohort_week DESC, a.day_offset ASC;

COMMENT ON VIEW public.v_analytics_cohort_retention_daily IS
  'Step 11. Per-cohort retention at days 1/7/14/30 with retention_pct rounded to 1dp.';

-- TODO(perf): if this view scans too long once we have >5k profiles
-- and >100k user_sessions rows, materialize it nightly:
--   CREATE MATERIALIZED VIEW mv_analytics_cohort_retention_daily AS
--   SELECT * FROM v_analytics_cohort_retention_daily;
-- and refresh from a pg_cron job.

-- ── 3. l1_rule_effectiveness view ─────────────────────────────────────────
-- For each error_code seen in speech_attempts, compute:
--   total_attempts    — total attempts that flagged this code
--   improvements      — attempts where the SAME (user, line) had a
--                        later attempt with a higher match_score AND
--                        no error_code.
--   improvement_rate  — improvements / total_attempts (0..1)
--   sample_size       — distinct users
--
-- Why error_code as the proxy: today's L1 hints aren't persisted to
-- their own table. speech_attempts.error_code is the closest signal —
-- it captures detected pattern (e.g. MISSING_FINAL_S, R_Z_CONFUSION)
-- and lets us measure whether learners improved after seeing the
-- regional remediation message. When dedicated L1 logging lands,
-- swap the source table and keep this shape stable.

CREATE OR REPLACE VIEW public.v_analytics_l1_rule_effectiveness AS
WITH flagged AS (
  SELECT
    sa.id,
    sa.user_id,
    sa.room_id,
    sa.line_id,
    sa.error_code,
    sa.match_score,
    sa.created_at
  FROM public.speech_attempts sa
  WHERE sa.error_code IS NOT NULL
),
later_attempts AS (
  -- For each flagged attempt, find ANY later attempt by the same user
  -- on the same line. The "improvement" criteria: higher match_score
  -- AND no error_code. We pick the FIRST chronologically — slightly
  -- more honest than "best ever score later" because it measures
  -- whether the immediate next attempt benefited.
  SELECT DISTINCT ON (f.id)
    f.id           AS flagged_attempt_id,
    f.error_code,
    f.user_id,
    f.match_score  AS flagged_score,
    next_a.match_score AS next_score,
    next_a.error_code  AS next_error_code
  FROM flagged f
  LEFT JOIN public.speech_attempts next_a
    ON  next_a.user_id = f.user_id
    AND next_a.line_id = f.line_id
    AND next_a.created_at > f.created_at
  ORDER BY f.id, next_a.created_at ASC
)
SELECT
  l.error_code                                      AS rule_tag,
  COUNT(*)::integer                                 AS total_attempts,
  COUNT(*) FILTER (
    WHERE l.next_score IS NOT NULL
      AND l.next_score > l.flagged_score
      AND l.next_error_code IS NULL
  )::integer                                        AS improvements,
  CASE
    WHEN COUNT(*) = 0 THEN 0
    ELSE ROUND(
      (COUNT(*) FILTER (
        WHERE l.next_score IS NOT NULL
          AND l.next_score > l.flagged_score
          AND l.next_error_code IS NULL
      ))::numeric / COUNT(*),
      4
    )
  END                                                AS improvement_rate,
  COUNT(DISTINCT l.user_id)::integer                AS sample_size
FROM later_attempts l
GROUP BY l.error_code
ORDER BY total_attempts DESC, l.error_code ASC;

COMMENT ON VIEW public.v_analytics_l1_rule_effectiveness IS
  'Step 11. Per-error_code improvement rate from speech_attempts. Proxy for L1 rule effectiveness until dedicated rule-event logging ships.';

-- TODO(observability): when L1 rule firings get their own log table,
-- repoint this view at it (rule_tag becomes vi_l1_*). Keep the column
-- names intact so dependent dashboards/exports don't break.

-- ── 4. weakness_trends_weekly view ────────────────────────────────────────
-- Counts how often each weakness flag appears in user_placements per
-- ISO week. This lets a teacher see whether a weakness is getting more
-- common or fading away across the cohort.
--
-- Weakness flags are stored as a jsonb array on user_placements. We
-- unnest with jsonb_array_elements_text and group.

CREATE OR REPLACE VIEW public.v_analytics_weakness_trends_weekly AS
WITH unrolled AS (
  SELECT
    up.user_id,
    date_trunc('week', up.created_at)::date AS week_start,
    jsonb_array_elements_text(
      COALESCE(up.weakness_flags, '[]'::jsonb)
    ) AS weakness_tag
  FROM public.user_placements up
  WHERE up.created_at IS NOT NULL
)
SELECT
  u.week_start,
  u.weakness_tag,
  COUNT(*)::integer                       AS total_occurrences,
  COUNT(DISTINCT u.user_id)::integer      AS unique_users
FROM unrolled u
GROUP BY u.week_start, u.weakness_tag
ORDER BY u.week_start DESC, total_occurrences DESC;

COMMENT ON VIEW public.v_analytics_weakness_trends_weekly IS
  'Step 11. Per-week count of each weakness flag from user_placements.weakness_flags.';

-- TODO(perf): same materialization plan as cohort_retention_daily if
-- user_placements grows past ~50k rows.

-- ── 5. SECURITY DEFINER RPC wrappers ──────────────────────────────────────
-- All four views are admin-only. Mirror the existing
-- analytics_daily_active_users / analytics_user_funnel pattern: each
-- function explicitly checks get_admin_level >= 9 and bubbles 42501
-- otherwise. Aggregates never leak through base-table RLS.

CREATE OR REPLACE FUNCTION public.analytics_user_cohorts()
RETURNS TABLE (
  user_id uuid,
  cohort_week date,
  signed_up_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT v.user_id, v.cohort_week, v.signed_up_at
    FROM public.v_analytics_user_cohorts v;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_cohort_retention(p_weeks integer DEFAULT 12)
RETURNS TABLE (
  cohort_week date,
  day_offset integer,
  cohort_size integer,
  retained_users integer,
  retention_pct numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;

  -- Clamp p_weeks to a reasonable range to keep response payloads small
  -- and discourage accidental "all of history" queries.
  IF p_weeks IS NULL OR p_weeks < 1 THEN p_weeks := 12; END IF;
  IF p_weeks > 52 THEN p_weeks := 52; END IF;

  RETURN QUERY
    SELECT v.cohort_week, v.day_offset, v.cohort_size, v.retained_users, v.retention_pct
    FROM public.v_analytics_cohort_retention_daily v
    WHERE v.cohort_week >= (current_date - (p_weeks || ' weeks')::interval)::date
    ORDER BY v.cohort_week DESC, v.day_offset ASC;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_l1_rule_effectiveness()
RETURNS TABLE (
  rule_tag text,
  total_attempts integer,
  improvements integer,
  improvement_rate numeric,
  sample_size integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;
  RETURN QUERY
    SELECT v.rule_tag, v.total_attempts, v.improvements, v.improvement_rate, v.sample_size
    FROM public.v_analytics_l1_rule_effectiveness v;
END;
$$;

CREATE OR REPLACE FUNCTION public.analytics_weakness_trends_weekly(p_weeks integer DEFAULT 12)
RETURNS TABLE (
  week_start date,
  weakness_tag text,
  total_occurrences integer,
  unique_users integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE(public.get_admin_level(auth.uid()), 0) < 9 THEN
    RAISE EXCEPTION 'admin access required' USING ERRCODE = '42501';
  END IF;

  IF p_weeks IS NULL OR p_weeks < 1 THEN p_weeks := 12; END IF;
  IF p_weeks > 52 THEN p_weeks := 52; END IF;

  RETURN QUERY
    SELECT v.week_start, v.weakness_tag, v.total_occurrences, v.unique_users
    FROM public.v_analytics_weakness_trends_weekly v
    WHERE v.week_start >= (current_date - (p_weeks || ' weeks')::interval)::date
    ORDER BY v.week_start DESC, v.total_occurrences DESC;
END;
$$;

GRANT EXECUTE ON FUNCTION public.analytics_user_cohorts()                     TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_cohort_retention(integer)          TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_l1_rule_effectiveness()            TO authenticated;
GRANT EXECUTE ON FUNCTION public.analytics_weakness_trends_weekly(integer)    TO authenticated;
