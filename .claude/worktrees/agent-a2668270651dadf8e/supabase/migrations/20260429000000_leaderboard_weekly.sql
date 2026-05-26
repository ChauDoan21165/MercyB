-- Step 4 (Retention) — weekly leaderboard MVP.
--
-- Greenfield: no leaderboard existed before this migration.
--
-- Design:
--   - One row per (user_id, week_start). week_start = Monday of the
--     ISO week, computed UTC-side. We use UTC instead of profiles.timezone
--     to keep ranking comparable across users; "this week" means the
--     same calendar window for everyone in the table.
--   - Three accumulators: points, lessons_completed, streak_days. The
--     client RPC `award_leaderboard_points` is the only writer in
--     normal flow — it upserts and increments atomically so concurrent
--     awards from two devices can't lose updates.
--   - RLS: any authenticated user can SELECT every row in the table
--     (a leaderboard is by definition public to its participants).
--     Direct INSERT/UPDATE is restricted to the user's own row, but
--     the SECURITY DEFINER RPC is the recommended path so we can
--     evolve write rules without altering RLS later.
--   - Top-10 + neighbor queries join public.profiles for display
--     name. Profile reads are gated by existing profile RLS — we
--     expose username only, no email / no PII.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.award_leaderboard_points(int, text);
--   DROP FUNCTION IF EXISTS public.leaderboard_weekly_top10();
--   DROP FUNCTION IF EXISTS public.leaderboard_weekly_my_rank();
--   DROP TABLE IF EXISTS public.leaderboard_weekly;
--   DELETE FROM public.feature_flags WHERE flag_key = 'mercyblade_leaderboard_enabled';

-- ── 1. Helper — Monday of the current ISO week, UTC ───────────────────────
CREATE OR REPLACE FUNCTION public.leaderboard_current_week_start()
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (date_trunc('week', (now() AT TIME ZONE 'UTC')))::date;
$$;

COMMENT ON FUNCTION public.leaderboard_current_week_start() IS
  'Monday (UTC) of the current ISO week. Single source of truth for week_start.';

-- ── 2. Table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.leaderboard_weekly (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_start         date NOT NULL,
  points             integer NOT NULL DEFAULT 0,
  lessons_completed  integer NOT NULL DEFAULT 0,
  streak_days        integer NOT NULL DEFAULT 0,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT leaderboard_weekly_user_week_uniq UNIQUE (user_id, week_start),
  CONSTRAINT leaderboard_weekly_points_nonneg CHECK (points >= 0),
  CONSTRAINT leaderboard_weekly_lessons_nonneg CHECK (lessons_completed >= 0),
  CONSTRAINT leaderboard_weekly_streak_nonneg CHECK (streak_days >= 0)
);

-- Top-10 lookup: find rows for a given week, sorted by points desc.
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_lookup
  ON public.leaderboard_weekly (week_start, points DESC);

-- "My rank" lookup: fast access to a single user's rows across weeks.
CREATE INDEX IF NOT EXISTS idx_leaderboard_weekly_user
  ON public.leaderboard_weekly (user_id, week_start);

COMMENT ON TABLE public.leaderboard_weekly IS
  'Per-user weekly score board. Read by everyone; written via award_leaderboard_points RPC.';

-- ── 3. RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.leaderboard_weekly ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS leaderboard_weekly_select_all ON public.leaderboard_weekly;
CREATE POLICY leaderboard_weekly_select_all
  ON public.leaderboard_weekly
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS leaderboard_weekly_write_own ON public.leaderboard_weekly;
CREATE POLICY leaderboard_weekly_write_own
  ON public.leaderboard_weekly
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS leaderboard_weekly_update_own ON public.leaderboard_weekly;
CREATE POLICY leaderboard_weekly_update_own
  ON public.leaderboard_weekly
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ── 4. Award RPC — atomic upsert + increment ──────────────────────────────
-- Kinds:
--   'lesson'    → increments lessons_completed by 1 and points by p_points
--   'streak'    → sets streak_days = GREATEST(existing, p_points) and adds 0
--                 (caller passes the user's current streak length)
--   'challenge' → adds p_points only
-- Anything else is rejected.
CREATE OR REPLACE FUNCTION public.award_leaderboard_points(
  p_points integer,
  p_kind   text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid    uuid := auth.uid();
  wstart date := public.leaderboard_current_week_start();
  delta_points  integer := 0;
  delta_lessons integer := 0;
  new_streak    integer := 0;
  result        record;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'award_leaderboard_points requires an authenticated user';
  END IF;

  IF p_points IS NULL OR p_points < 0 THEN
    RAISE EXCEPTION 'p_points must be a non-negative integer (got %)', p_points;
  END IF;

  IF p_kind = 'lesson' THEN
    delta_points  := p_points;
    delta_lessons := 1;
  ELSIF p_kind = 'challenge' THEN
    delta_points  := p_points;
  ELSIF p_kind = 'streak' THEN
    new_streak := p_points;
  ELSE
    RAISE EXCEPTION 'unknown p_kind: % (expected lesson|streak|challenge)', p_kind;
  END IF;

  INSERT INTO public.leaderboard_weekly (
    user_id, week_start, points, lessons_completed, streak_days
  )
  VALUES (
    uid, wstart, delta_points, delta_lessons, new_streak
  )
  ON CONFLICT (user_id, week_start) DO UPDATE
    SET points            = public.leaderboard_weekly.points + EXCLUDED.points,
        lessons_completed = public.leaderboard_weekly.lessons_completed + EXCLUDED.lessons_completed,
        streak_days       = GREATEST(public.leaderboard_weekly.streak_days, EXCLUDED.streak_days),
        updated_at        = now()
  RETURNING points, lessons_completed, streak_days, week_start
  INTO result;

  RETURN json_build_object(
    'week_start',        result.week_start,
    'points',            result.points,
    'lessons_completed', result.lessons_completed,
    'streak_days',       result.streak_days
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.award_leaderboard_points(integer, text) TO authenticated;

-- ── 5. Top-10 RPC — joins profiles for display name ───────────────────────
-- SECURITY DEFINER so we can expose only the username column from
-- profiles regardless of profiles RLS.
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
  ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id
  LIMIT 10;
END;
$$;

GRANT EXECUTE ON FUNCTION public.leaderboard_weekly_top10() TO authenticated;

-- ── 6. My-rank-with-neighbors RPC ─────────────────────────────────────────
-- Returns up to 5 rows: rank-2, rank-1, ME, rank+1, rank+2.
-- Includes the caller even if they have no row yet (returned with 0 stats
-- and rank = total_participants + 1 to make "you're not on the board yet"
-- renderable without a separate empty-state branch).
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

  SELECT COUNT(*) INTO total
  FROM public.leaderboard_weekly
  WHERE week_start = wstart;

  -- Compute caller's rank (NULL if they have no row this week).
  WITH ranked AS (
    SELECT
      l.user_id,
      ROW_NUMBER() OVER (ORDER BY l.points DESC, l.lessons_completed DESC, l.user_id)::integer AS r
    FROM public.leaderboard_weekly l
    WHERE l.week_start = wstart
  )
  SELECT r INTO my_rank FROM ranked WHERE user_id = uid;

  IF my_rank IS NULL THEN
    -- Caller has no row this week. Return a single synthetic row so the
    -- UI can render "you're not on the board yet" with the same shape
    -- as the populated case.
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
    WHERE l.week_start = wstart
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

GRANT EXECUTE ON FUNCTION public.leaderboard_weekly_my_rank() TO authenticated;

-- ── 7. Updated-at trigger — keeps updated_at honest for non-RPC writes ───
CREATE OR REPLACE FUNCTION public.leaderboard_weekly_touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_leaderboard_weekly_touch ON public.leaderboard_weekly;
CREATE TRIGGER trg_leaderboard_weekly_touch
  BEFORE UPDATE ON public.leaderboard_weekly
  FOR EACH ROW
  EXECUTE FUNCTION public.leaderboard_weekly_touch_updated_at();

-- ── 8. Feature flag — default OFF ─────────────────────────────────────────
INSERT INTO public.feature_flags (flag_key, is_enabled, description)
VALUES (
  'mercyblade_leaderboard_enabled',
  false,
  'Step 4 (Retention) — weekly leaderboard. Off until manual QA + cohort opt-in.'
)
ON CONFLICT (flag_key) DO NOTHING;
