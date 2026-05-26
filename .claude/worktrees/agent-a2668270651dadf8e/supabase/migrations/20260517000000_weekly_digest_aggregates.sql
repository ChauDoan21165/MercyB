-- 20260517000000_weekly_digest_aggregates.sql
--
-- A9 — Public weekly digest aggregates.
--
-- What this migration creates:
--   1. profiles.email_weekly_digest_enabled (bool, default true)
--      Per-user opt-out flag for the digest. A8's email_preferences work
--      hadn't shipped when A9 needed this — owning the column here so the
--      digest function has a stable preference to read.
--   2. public.weekly_digest_data (table — not a matview)
--      One row per ISO week. Refreshed weekly by refresh_weekly_digest().
--      A plain table beats a matview here because the aggregate logic
--      mixes counts, top-N, and joins that don't compose cleanly into a
--      single SELECT — and we need anon-readable RLS on the result.
--   3. refresh_weekly_digest() — UPSERTs the current ISO week's row.
--   4. get_user_weekly_contribution(uid, week_start) — per-user numbers
--      embedded in each digest email; never persisted across users.
--   5. pg_cron schedule: Mondays 23:00 UTC = 06:00 Mon ICT (UTC+7).
--   6. RLS: anon can SELECT weekly_digest_data (public archive page);
--      writes are blocked unless via SECURITY DEFINER refresh function.
--
-- Privacy invariants:
--   - weekly_digest_data stores ONLY aggregates. No user_id, no email.
--   - get_user_weekly_contribution returns the requesting user's own
--     contribution; never reveals another user's data.
--   - Top phoneme + top topic are computed across all users without
--     any per-user attribution.
--
-- Source-of-truth tables this aggregates:
--   - speech_attempts (overall_score, match_score, room_id, user_id,
--     phoneme_scores jsonb, created_at)
--   - profiles (created_at — for new_users_this_week)

CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- ── 1. Per-user opt-out preference ───────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email_weekly_digest_enabled boolean
    NOT NULL DEFAULT true;

COMMENT ON COLUMN public.profiles.email_weekly_digest_enabled IS
  'Per-user opt-out flag for the weekly community digest email. Default true. The digest function MUST filter on this; do not bypass.';

-- ── 2. Aggregate table (one row per ISO week) ────────────────────────

CREATE TABLE IF NOT EXISTS public.weekly_digest_data (
  week_starts_on date PRIMARY KEY,
  total_attempts_this_week integer NOT NULL DEFAULT 0,
  total_unique_active_users_this_week integer NOT NULL DEFAULT 0,
  new_users_this_week integer NOT NULL DEFAULT 0,
  top_phoneme_improved text,
  top_phoneme_improvement_points numeric(5, 2),
  top_topic_practiced text,
  top_topic_attempt_count integer,
  refreshed_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.weekly_digest_data IS
  'A9 weekly community aggregates. Aggregates ONLY — no per-user data. Refreshed by refresh_weekly_digest(). Public-readable (anon SELECT) so the /blog/weekly-digest archive can render without auth.';

-- ── 3. Refresh function ─────────────────────────────────────────────-

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
  -- Default to the ISO week that contains "today" — Monday-anchored.
  v_week_start := COALESCE(target_week, date_trunc('week', now())::date);
  v_week_end   := v_week_start + INTERVAL '7 days';

  -- Total attempts this week.
  SELECT COUNT(*)::int INTO v_attempts
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end;

  -- Unique active users this week.
  SELECT COUNT(DISTINCT user_id)::int INTO v_unique
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND user_id IS NOT NULL;

  -- New users this week (profiles created in window).
  SELECT COUNT(*)::int INTO v_new_users
  FROM public.profiles
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end;

  -- Most-practiced topic this week (room_id with most attempts).
  SELECT room_id, COUNT(*)::int
    INTO v_top_topic, v_top_topic_count
  FROM public.speech_attempts
  WHERE created_at >= v_week_start
    AND created_at <  v_week_end
    AND room_id IS NOT NULL
  GROUP BY room_id
  ORDER BY COUNT(*) DESC, room_id ASC
  LIMIT 1;

  -- Top community-wide phoneme improvement: compare per-phoneme average
  -- score this week vs the prior week. We unnest phoneme_scores from
  -- jsonb to find the phoneme with the largest week-over-week gain.
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

  -- UPSERT the row.
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

COMMENT ON FUNCTION public.refresh_weekly_digest(date) IS
  'A9 — refreshes weekly_digest_data for the given week (defaults to current ISO week, Monday-anchored). SECURITY DEFINER so it can read speech_attempts past RLS. Safe to call repeatedly; UPSERTs the row.';

-- ── 4. Per-user contribution (read-your-own only) ────────────────────-

CREATE OR REPLACE FUNCTION public.get_user_weekly_contribution(
  uid uuid,
  week_start date
)
RETURNS TABLE (
  attempts_count integer,
  sentences_practiced integer,
  topics_explored integer,
  score_delta_vs_last_week numeric(5, 2)
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_week_end date := week_start + INTERVAL '7 days';
  v_prev_start date := week_start - INTERVAL '7 days';
  v_this_avg numeric;
  v_prev_avg numeric;
BEGIN
  SELECT COALESCE(AVG(overall_score), 0) INTO v_this_avg
  FROM public.speech_attempts
  WHERE user_id = uid
    AND created_at >= week_start
    AND created_at <  v_week_end;

  SELECT COALESCE(AVG(overall_score), 0) INTO v_prev_avg
  FROM public.speech_attempts
  WHERE user_id = uid
    AND created_at >= v_prev_start
    AND created_at <  week_start;

  RETURN QUERY
  SELECT
    COUNT(*)::int                              AS attempts_count,
    COUNT(DISTINCT target_text)::int           AS sentences_practiced,
    COUNT(DISTINCT room_id)::int               AS topics_explored,
    ROUND((v_this_avg - v_prev_avg)::numeric, 2) AS score_delta_vs_last_week
  FROM public.speech_attempts
  WHERE user_id = uid
    AND created_at >= week_start
    AND created_at <  v_week_end;
END;
$$;

COMMENT ON FUNCTION public.get_user_weekly_contribution(uuid, date) IS
  'A9 — returns the requesting/target user''s own contribution numbers for a given ISO week. Caller is the digest edge function (SECURITY DEFINER). Never returns data for any user other than the one passed in.';

-- ── 5. RLS — anon SELECT, deny writes ────────────────────────────────-

ALTER TABLE public.weekly_digest_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS weekly_digest_data_public_read
  ON public.weekly_digest_data;

CREATE POLICY weekly_digest_data_public_read
  ON public.weekly_digest_data
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- No INSERT/UPDATE/DELETE policy — only the SECURITY DEFINER refresh
-- function can touch this table. Service role bypasses RLS as usual.

-- ── 6. Cron — Monday 06:00 ICT = Sunday 23:00 UTC ────────────────────-

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'refresh-weekly-digest') THEN
    PERFORM cron.unschedule('refresh-weekly-digest');
  END IF;

  PERFORM cron.schedule(
    'refresh-weekly-digest',
    '0 23 * * 0',
    $cron$ SELECT public.refresh_weekly_digest(); $cron$
  );
END $$;

-- ── 7. email_sends_log: extend for weekly_digest ─────────────────────-

-- Extend the campaign whitelist with 'weekly_digest' (constraint v4).
ALTER TABLE public.email_sends_log
  DROP CONSTRAINT IF EXISTS email_sends_log_campaign_chk_v3;

ALTER TABLE public.email_sends_log
  ADD CONSTRAINT email_sends_log_campaign_chk_v4
  CHECK (
    campaign IN (
      -- A6 skeleton (time-based)
      'reengagement_7d',
      'reengagement_14d',
      'reengagement_30d',
      -- Trial-expiry funnel (PR #149/#102)
      'trial_expiry_d_minus_3',
      'trial_expiry_d_minus_1',
      'trial_expiry_d_plus_1',
      -- A10 re-engagement funnel
      'reengagement_active_then_silent',
      'reengagement_trial_completed_d_plus_14',
      'reengagement_post_subscribe_d_plus_7',
      'reengagement_almost_lapsed',
      'reengagement_added_something_new',
      -- A9 weekly community digest
      'weekly_digest'
    )
  );

COMMENT ON CONSTRAINT email_sends_log_campaign_chk_v4
  ON public.email_sends_log IS
  'Allowed campaign keys across all email tracks. Extending: add the new value here and bump the constraint version.';

-- Per-week dedupe key — 'weekly_digest' is sent once per (user, week).
-- Other campaigns leave week_key NULL.
ALTER TABLE public.email_sends_log
  ADD COLUMN IF NOT EXISTS week_key date;

ALTER TABLE public.email_sends_log
  ADD COLUMN IF NOT EXISTS provider_message_id text;

CREATE UNIQUE INDEX IF NOT EXISTS uq_email_sends_log_weekly_digest_user_week
  ON public.email_sends_log (user_id, week_key)
  WHERE campaign = 'weekly_digest' AND week_key IS NOT NULL;

COMMENT ON COLUMN public.email_sends_log.week_key IS
  'A9 — ISO-week start date for the weekly_digest campaign. NULL for non-weekly campaigns. Drives the (user_id, week_key) uniqueness constraint that prevents duplicate digests in a single week.';

-- ── 8. Grants ────────────────────────────────────────────────────────

GRANT SELECT ON public.weekly_digest_data TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.refresh_weekly_digest(date) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_weekly_contribution(uuid, date)
  TO authenticated;
