-- ============================================================================
-- Synthetic-user exclusion (Tier 3 — Prod Synthetic Learner, SL-001)
-- ----------------------------------------------------------------------------
-- The prod synthetic learner is a real profiles/auth row so it exercises the
-- real app — which means it MUST be excluded from every learner metric, or it
-- silently inflates counts, funnels, cohorts, retention, the leaderboard, and
-- the PUBLIC weekly-digest number. This migration adds the single exclusion
-- convention (a flag + a predicate) and threads it through every §2 consumer
-- that counts learners.
--
-- APPLY MANUALLY (SQL Editor or psql session pooler). Do NOT `supabase db push`.
-- Every object here is CREATE OR REPLACE / idempotent; safe to re-run.
--
-- Deliberate NON-changes (documented, not omissions):
--   • public.referral_owner_grants_in_year() is a FRAUD CAP, not a metric.
--     Excluding a synthetic *referred* user there would LOOSEN the cap. The
--     synthetic account never refers, so it is left untouched by design.
--   • v4_admin_telemetry_daily / _provider_decisions_summary / _curriculum_plans
--     are telemetry/decision views, not learner counts. Only the learner-count
--     view (v4_admin_learner_memory_summary) is filtered here; the others can
--     adopt the same predicate in a follow-up if desired.
-- ============================================================================

-- ── 1. Exclusion convention ─────────────────────────────────────────────────
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_synthetic boolean NOT NULL DEFAULT false;

COMMENT ON COLUMN public.profiles.is_synthetic IS
  'True ONLY for the Tier-3 prod synthetic learner. Excluded from all learner metrics via public.is_synthetic_user(). Never set on a real account.';

-- Single source of truth for the filter. STABLE + SECURITY DEFINER so it can be
-- called from any aggregate (incl. RLS-bound views) and always read the flag.
CREATE OR REPLACE FUNCTION public.is_synthetic_user(uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT p.is_synthetic FROM public.profiles p WHERE p.id = uid), false);
$$;

COMMENT ON FUNCTION public.is_synthetic_user(uuid) IS
  'True iff uid is the synthetic learner. The canonical exclusion predicate for every learner aggregate.';

-- ── 2. Analytics views (20260427000000_admin_analytics_views.sql) ───────────

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
    AND NOT public.is_synthetic_user(user_id)
)
SELECT
  d.day,
  COALESCE(COUNT(DISTINCT a.user_id), 0)::integer AS active_users
FROM dates d
LEFT JOIN activity a ON a.day = d.day
GROUP BY d.day
ORDER BY d.day ASC;

CREATE OR REPLACE VIEW public.v_analytics_feature_usage_7d AS
SELECT
  interaction_type                   AS event_name,
  COUNT(*)::integer                  AS event_count,
  COUNT(DISTINCT user_id)::integer   AS unique_users
FROM public.user_behavior_tracking
WHERE created_at >= (now() - INTERVAL '7 days')
  AND interaction_type IS NOT NULL
  AND NOT public.is_synthetic_user(user_id)
GROUP BY interaction_type
ORDER BY event_count DESC;

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
  WHERE NOT p.is_synthetic
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

CREATE OR REPLACE VIEW public.v_analytics_room_popularity AS
SELECT
  room_id,
  COUNT(DISTINCT user_id)::integer                                   AS enrollments,
  COUNT(DISTINCT user_id) FILTER (WHERE progress_pct >= 100)::integer AS completions,
  ROUND(AVG(progress_pct)::numeric, 1)                               AS avg_progress_pct,
  MAX(last_seen_at)                                                  AS last_activity_at
FROM public.user_room_progress
WHERE room_id IS NOT NULL
  AND NOT public.is_synthetic_user(user_id)
GROUP BY room_id
ORDER BY enrollments DESC, avg_progress_pct DESC;

-- ── 3. Compounding analytics (20260425165003_compounding_analytics.sql) ─────

CREATE OR REPLACE VIEW public.v_analytics_user_cohorts AS
SELECT
  p.id                                        AS user_id,
  date_trunc('week', p.created_at)::date      AS cohort_week,
  p.created_at                                AS signed_up_at
FROM public.profiles p
WHERE p.created_at IS NOT NULL
  AND NOT p.is_synthetic;  -- cascades to v_analytics_cohort_retention_daily

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
    AND NOT public.is_synthetic_user(sa.user_id)
),
later_attempts AS (
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
    AND NOT public.is_synthetic_user(up.user_id)
)
SELECT
  u.week_start,
  u.weakness_tag,
  COUNT(*)::integer                       AS total_occurrences,
  COUNT(DISTINCT u.user_id)::integer      AS unique_users
FROM unrolled u
GROUP BY u.week_start, u.weakness_tag
ORDER BY u.week_start DESC, total_occurrences DESC;

-- ── 4. Conversion + behavioral RPCs (20260535000000_cohort_retention.sql) ───

CREATE OR REPLACE FUNCTION public.get_conversion_funnel()
RETURNS TABLE (
  signed_up           integer,
  reached_first       integer,
  reached_five        integer,
  reached_thirty      integer,
  paid                integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_signed_up      integer;
  v_first          integer;
  v_five           integer;
  v_thirty         integer;
  v_paid           integer;
BEGIN
  IF coalesce(public.get_admin_level(), 0) < 9 THEN
    RETURN;
  END IF;

  SELECT count(*)::integer INTO v_signed_up
    FROM public.profiles
   WHERE NOT is_synthetic;

  WITH per_user AS (
    SELECT user_id, count(*)::integer AS n
      FROM public.speech_attempts
     WHERE NOT public.is_synthetic_user(user_id)
     GROUP BY user_id
  )
  SELECT
    count(*) FILTER (WHERE n >= 1)::integer,
    count(*) FILTER (WHERE n >= 5)::integer,
    count(*) FILTER (WHERE n >= 30)::integer
    INTO v_first, v_five, v_thirty
    FROM per_user;

  SELECT count(*)::integer INTO v_paid
    FROM public.profiles
   WHERE coalesce(tier, 0) > 0
     AND NOT is_synthetic;

  RETURN QUERY
  SELECT v_signed_up,
         coalesce(v_first,  0),
         coalesce(v_five,   0),
         coalesce(v_thirty, 0),
         v_paid;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_behavioral_metrics(
  p_since date DEFAULT (current_date - interval '90 days')::date,
  p_until date DEFAULT current_date
)
RETURNS TABLE (
  metric_date     date,
  new_signups     integer,
  active_users    integer,
  speech_attempts integer
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
  WITH days AS (
    SELECT generate_series(p_since, p_until, interval '1 day')::date AS d
  ),
  signups AS (
    SELECT date_trunc('day', created_at AT TIME ZONE 'UTC')::date AS d,
           count(*)::integer AS n
      FROM public.profiles
     WHERE created_at >= p_since
       AND created_at <  (p_until + interval '1 day')
       AND NOT is_synthetic
     GROUP BY 1
  ),
  attempts AS (
    SELECT date_trunc('day', attempted_at AT TIME ZONE 'UTC')::date AS d,
           count(*)::integer AS n
      FROM public.speech_attempts
     WHERE attempted_at >= p_since
       AND attempted_at <  (p_until + interval '1 day')
       AND NOT public.is_synthetic_user(user_id)
     GROUP BY 1
  ),
  active AS (
    SELECT date_trunc('day', last_activity AT TIME ZONE 'UTC')::date AS d,
           count(distinct user_id)::integer AS n
      FROM public.user_sessions
     WHERE last_activity >= p_since
       AND last_activity <  (p_until + interval '1 day')
       AND NOT public.is_synthetic_user(user_id)
     GROUP BY 1
  )
  SELECT days.d,
         coalesce(signups.n,  0),
         coalesce(active.n,   0),
         coalesce(attempts.n, 0)
    FROM days
    LEFT JOIN signups  ON signups.d  = days.d
    LEFT JOIN active   ON active.d   = days.d
    LEFT JOIN attempts ON attempts.d = days.d
   ORDER BY days.d ASC;
END;
$$;

-- ── 5. Weekly digest refresh (20260517000000_weekly_digest_aggregates.sql) ──
-- Feeds the PUBLIC WeeklyDigest number — every user-keyed read excludes synth.

CREATE OR REPLACE FUNCTION public.refresh_weekly_digest(
  target_week date DEFAULT NULL
)
RETURNS public.weekly_digest_data
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_start date;
  v_week_end   date;
  v_attempts   integer;
  v_unique     integer;
  v_new_users  integer;
  v_top_topic  text;
  v_top_topic_count integer;
  v_top_phoneme text;
  v_top_phoneme_delta numeric(5, 2);
  result public.weekly_digest_data;
BEGIN
  v_week_start := COALESCE(target_week, date_trunc('week', now())::date);
  v_week_end   := v_week_start + INTERVAL '7 days';

  SELECT COUNT(*)::int INTO v_attempts
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND NOT public.is_synthetic_user(user_id);

  SELECT COUNT(DISTINCT user_id)::int INTO v_unique
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND user_id IS NOT NULL
    AND NOT public.is_synthetic_user(user_id);

  SELECT COUNT(*)::int INTO v_new_users
  FROM public.profiles
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND NOT is_synthetic;

  SELECT room_id, COUNT(*)::int
    INTO v_top_topic, v_top_topic_count
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND room_id IS NOT NULL
    AND NOT public.is_synthetic_user(user_id)
  GROUP BY room_id
  ORDER BY COUNT(*) DESC, room_id ASC
  LIMIT 1;

  WITH this_week AS (
    SELECT
      phoneme_row.value->>'phoneme' AS phoneme,
      AVG((phoneme_row.value->>'score')::numeric) AS avg_score
    FROM public.speech_attempts sa
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(sa.phoneme_scores, '[]'::jsonb)
    ) AS word_row
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(word_row.value->'phonemes', '[]'::jsonb)
    ) AS phoneme_row
    WHERE sa.created_at >= v_week_start
      AND sa.created_at <  v_week_end
      AND NOT public.is_synthetic_user(sa.user_id)
      AND phoneme_row.value->>'phoneme' IS NOT NULL
      AND (phoneme_row.value->>'score') ~ '^-?[0-9]+(\.[0-9]+)?$'
    GROUP BY phoneme_row.value->>'phoneme'
    HAVING COUNT(*) >= 10
  ),
  prev_week AS (
    SELECT
      phoneme_row.value->>'phoneme' AS phoneme,
      AVG((phoneme_row.value->>'score')::numeric) AS avg_score
    FROM public.speech_attempts sa
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(sa.phoneme_scores, '[]'::jsonb)
    ) AS word_row
    CROSS JOIN LATERAL jsonb_array_elements(
      COALESCE(word_row.value->'phonemes', '[]'::jsonb)
    ) AS phoneme_row
    WHERE sa.created_at >= (v_week_start - INTERVAL '7 days')
      AND sa.created_at <  v_week_start
      AND NOT public.is_synthetic_user(sa.user_id)
      AND phoneme_row.value->>'phoneme' IS NOT NULL
      AND (phoneme_row.value->>'score') ~ '^-?[0-9]+(\.[0-9]+)?$'
    GROUP BY phoneme_row.value->>'phoneme'
    HAVING COUNT(*) >= 10
  )
  SELECT t.phoneme, ROUND(t.avg_score - p.avg_score, 2)
    INTO v_top_phoneme, v_top_phoneme_delta
  FROM this_week t
  JOIN prev_week p USING (phoneme)
  ORDER BY (t.avg_score - p.avg_score) DESC
  LIMIT 1;

  INSERT INTO public.weekly_digest_data AS w (
    week_starts_on,
    total_attempts_this_week,
    total_unique_active_users_this_week,
    new_users_this_week,
    top_phoneme_improved,
    top_phoneme_improvement_points,
    top_topic_practiced,
    top_topic_attempt_count,
    refreshed_at
  )
  VALUES (
    v_week_start,
    COALESCE(v_attempts, 0),
    COALESCE(v_unique, 0),
    COALESCE(v_new_users, 0),
    v_top_phoneme,
    v_top_phoneme_delta,
    v_top_topic,
    v_top_topic_count,
    now()
  )
  ON CONFLICT (week_starts_on) DO UPDATE SET
    total_attempts_this_week = EXCLUDED.total_attempts_this_week,
    total_unique_active_users_this_week = EXCLUDED.total_unique_active_users_this_week,
    new_users_this_week = EXCLUDED.new_users_this_week,
    top_phoneme_improved = EXCLUDED.top_phoneme_improved,
    top_phoneme_improvement_points = EXCLUDED.top_phoneme_improvement_points,
    top_topic_practiced = EXCLUDED.top_topic_practiced,
    top_topic_attempt_count = EXCLUDED.top_topic_attempt_count,
    refreshed_at = EXCLUDED.refreshed_at
  RETURNING w.* INTO result;

  RETURN result;
END;
$$;

-- ── 6. Weekly leaderboard (20260429000000_leaderboard_weekly.sql) ───────────

CREATE OR REPLACE FUNCTION public.leaderboard_weekly_top10()
RETURNS TABLE (
  rank              integer,
  user_id           uuid,
  username          text,
  points            integer,
  lessons_completed integer,
  streak_days       integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  wstart date := public.leaderboard_current_week_start();
BEGIN
  RETURN QUERY
  SELECT
    (ROW_NUMBER() OVER (ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id))::integer AS rank,
    l.user_id,
    COALESCE(p.username, p.full_name, '')::text AS username,
    l.points,
    l.lessons_completed,
    l.streak_days
  FROM public.leaderboard_weekly l
  LEFT JOIN public.profiles p ON p.id = l.user_id
  WHERE l.week_start = wstart
    AND NOT COALESCE(p.is_synthetic, false)
  ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id
  LIMIT 10;
END;
$$;

CREATE OR REPLACE FUNCTION public.leaderboard_weekly_my_rank()
RETURNS TABLE (
  rank              integer,
  user_id           uuid,
  username          text,
  points            integer,
  lessons_completed integer,
  streak_days       integer,
  is_me             boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid       uuid := auth.uid();
  wstart    date := public.leaderboard_current_week_start();
  my_rank   integer;
  total     integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'leaderboard_weekly_my_rank requires an authenticated user';
  END IF;

  -- Count only non-synthetic participants so ranks/total aren't inflated.
  SELECT COUNT(*) INTO total
  FROM public.leaderboard_weekly l
  JOIN public.profiles p ON p.id = l.user_id
  WHERE l.week_start = wstart
    AND NOT p.is_synthetic;

  WITH ranked AS (
    SELECT
      l.user_id,
      ROW_NUMBER() OVER (ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id)::integer AS r
    FROM public.leaderboard_weekly l
    JOIN public.profiles p ON p.id = l.user_id
    WHERE l.week_start = wstart
      AND NOT p.is_synthetic
  )
  SELECT r INTO my_rank FROM ranked WHERE user_id = uid;

  IF my_rank IS NULL THEN
    RETURN QUERY
    SELECT
      (total + 1)::integer AS rank,
      uid                   AS user_id,
      COALESCE(p.username, p.full_name, '')::text AS username,
      0::integer           AS points,
      0::integer           AS lessons_completed,
      0::integer           AS streak_days,
      true                 AS is_me
    FROM public.profiles p
    WHERE p.id = uid;
    RETURN;
  END IF;

  RETURN QUERY
  WITH ranked AS (
    SELECT
      l.user_id,
      l.points,
      l.lessons_completed,
      l.streak_days,
      ROW_NUMBER() OVER (ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id)::integer AS r
    FROM public.leaderboard_weekly l
    JOIN public.profiles p ON p.id = l.user_id
    WHERE l.week_start = wstart
      AND NOT p.is_synthetic
  )
  SELECT
    ranked.r                                    AS rank,
    ranked.user_id,
    COALESCE(p.username, p.full_name, '')::text AS username,
    ranked.points,
    ranked.lessons_completed,
    ranked.streak_days,
    (ranked.user_id = uid)                      AS is_me
  FROM ranked
  LEFT JOIN public.profiles p ON p.id = ranked.user_id
  WHERE ranked.r BETWEEN GREATEST(1, my_rank - 2) AND (my_rank + 2)
  ORDER BY ranked.r;
END;
$$;

-- ── 7. v5 admin learner-memory summary (20260521000005_v5_admin_views.sql) ──
-- Drives adminObservability's totalLearners = rows.length; exclude synthetic.
CREATE OR REPLACE VIEW public.v4_admin_learner_memory_summary AS
SELECT
  user_id,
  learner_key,
  schema_version,
  content_hash,
  event_count,
  created_at,
  updated_at,
  pg_column_size(payload) AS payload_bytes
FROM public.v4_learner_memory
WHERE NOT public.is_synthetic_user(user_id);

-- ── 8. Retire the placement-v3 keepalive cron ──────────────────────────────
-- Superseded by Tier-3 journey (e), which pings placement-v3-session every run
-- AND verifies the response. The keepalive migration file is removed in this
-- MR; if it was ever applied, unschedule it (idempotent — no-op otherwise).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_cron')
     AND EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'placement-v3-session-keepalive') THEN
    PERFORM cron.unschedule('placement-v3-session-keepalive');
  END IF;
END $$;
