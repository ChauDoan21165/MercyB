-- Step 4 (Retention) — daily challenge + XP system.
--
-- Why two tables:
--   - user_xp: 1:1 with auth.users, holds running XP total. Cheap to read
--     on every Home mount; no row-per-event overhead.
--   - daily_challenges: one row per (user, date). Holds the assigned
--     challenge payload, completion state, and XP awarded for that day.
--     Letting the UI replay the same challenge on revisit and supporting
--     "XP this week" without re-querying user_xp for date ranges.
--
-- Note: this is intentionally separate from user_points (leaderboard,
-- A2's territory). XP is per-user gamification; points feed the
-- leaderboard. They will likely diverge in awarding rules later.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.daily_challenges;
--   DROP TABLE IF EXISTS public.user_xp;

-- ── 1. user_xp ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.user_xp (
  user_id     uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  total_xp    integer NOT NULL DEFAULT 0,
  last_xp_at  timestamptz
);

ALTER TABLE public.user_xp ENABLE ROW LEVEL SECURITY;

-- Owner-only read.
DROP POLICY IF EXISTS user_xp_select_own ON public.user_xp;
CREATE POLICY user_xp_select_own
  ON public.user_xp
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Owner-only insert (the awardXp client does upsert; first-touch needs INSERT).
DROP POLICY IF EXISTS user_xp_insert_own ON public.user_xp;
CREATE POLICY user_xp_insert_own
  ON public.user_xp
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Owner-only update (running total increments).
DROP POLICY IF EXISTS user_xp_update_own ON public.user_xp;
CREATE POLICY user_xp_update_own
  ON public.user_xp
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 2. daily_challenges ───────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date                date NOT NULL,
  challenge_kind      text NOT NULL
                      CHECK (challenge_kind IN ('sentence', 'rule', 'pronunciation', 'mixed')),
  challenge_payload   jsonb NOT NULL DEFAULT '{}'::jsonb,
  completed           boolean NOT NULL DEFAULT false,
  completed_at        timestamptz,
  xp_awarded          integer NOT NULL DEFAULT 0,
  created_at          timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, date)
);

CREATE INDEX IF NOT EXISTS daily_challenges_user_date_idx
  ON public.daily_challenges (user_id, date DESC);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS daily_challenges_select_own ON public.daily_challenges;
CREATE POLICY daily_challenges_select_own
  ON public.daily_challenges
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS daily_challenges_insert_own ON public.daily_challenges;
CREATE POLICY daily_challenges_insert_own
  ON public.daily_challenges
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS daily_challenges_update_own ON public.daily_challenges;
CREATE POLICY daily_challenges_update_own
  ON public.daily_challenges
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── 3. Atomic XP increment RPC ────────────────────────────────────────────
-- The client could read-then-write instead, but a daily challenge
-- completion can race with a streak bonus award. RPC keeps the math
-- atomic and lets us ignore that.
CREATE OR REPLACE FUNCTION public.increment_user_xp(p_points integer)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  new_total integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'increment_user_xp requires an authenticated user';
  END IF;

  IF p_points IS NULL OR p_points <= 0 THEN
    -- No-op for non-positive awards. Don't update last_xp_at either.
    SELECT COALESCE(total_xp, 0) INTO new_total
      FROM public.user_xp WHERE user_id = uid;
    RETURN COALESCE(new_total, 0);
  END IF;

  INSERT INTO public.user_xp (user_id, total_xp, last_xp_at)
       VALUES (uid, p_points, now())
  ON CONFLICT (user_id) DO UPDATE
       SET total_xp   = public.user_xp.total_xp + EXCLUDED.total_xp,
           last_xp_at = now()
  RETURNING total_xp INTO new_total;

  RETURN new_total;
END;
$$;

GRANT EXECUTE ON FUNCTION public.increment_user_xp(integer) TO authenticated;
