-- Public weekly pronunciation leaderboard (opt-in).
--
-- Distinct from the existing `leaderboard_weekly` table (PR #79) which
-- aggregates engagement points; this table aggregates pronunciation
-- match_score from speech_attempts and is publicly readable for opted-in
-- rows only.
--
-- Privacy model:
--   - Row exists for every user who has at least one speech_attempt this
--     week (created via trigger).
--   - `display_name IS NULL` ⇒ user has NOT opted in. Public SELECT
--     hides those rows; only the owner can see them. The user can opt
--     out by setting display_name back to NULL.
--   - Tier / admin / email never appear here. The only PII surfaced
--     is the user-chosen display_name + their score.
--
-- Reversibility:
--   DROP FUNCTION IF EXISTS public.weekly_leaderboard_top(integer);
--   DROP FUNCTION IF EXISTS public.weekly_leaderboard_my_rank();
--   DROP FUNCTION IF EXISTS public.weekly_leaderboard_current_week_start();
--   DROP TRIGGER IF EXISTS trg_weekly_leaderboard_on_speech_attempt ON public.speech_attempts;
--   DROP FUNCTION IF EXISTS public.weekly_leaderboard_apply_attempt();
--   DROP TABLE IF EXISTS public.weekly_leaderboard;

-- ── 1. Helper — Monday of the current ISO week, UTC ───────────────────────
-- Same convention as leaderboard_weekly (PR #79). UTC keeps "this week"
-- the same calendar window for everyone in the table.
CREATE OR REPLACE FUNCTION public.weekly_leaderboard_current_week_start()
RETURNS date
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT (date_trunc('week', (now() AT TIME ZONE 'UTC')))::date;
$$;

COMMENT ON FUNCTION public.weekly_leaderboard_current_week_start() IS
  'Monday (UTC) of the current ISO week — single source of truth for week_starts_on.';

-- ── 2. Table ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.weekly_leaderboard (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  week_starts_on  date NOT NULL,
  total_score     numeric NOT NULL DEFAULT 0,
  attempts_count  integer NOT NULL DEFAULT 0,
  display_name    text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT weekly_leaderboard_user_week_uniq UNIQUE (user_id, week_starts_on),
  CONSTRAINT weekly_leaderboard_score_nonneg CHECK (total_score >= 0),
  CONSTRAINT weekly_leaderboard_attempts_nonneg CHECK (attempts_count >= 0),
  CONSTRAINT weekly_leaderboard_display_name_length
    CHECK (display_name IS NULL OR char_length(display_name) BETWEEN 1 AND 30)
);

-- Top-N lookup: rank by score within a week.
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboard_rank
  ON public.weekly_leaderboard (week_starts_on, total_score DESC);

-- Single-user lookup: the my-rank query reads by user_id directly.
CREATE INDEX IF NOT EXISTS idx_weekly_leaderboard_user
  ON public.weekly_leaderboard (user_id, week_starts_on);

COMMENT ON TABLE public.weekly_leaderboard IS
  'Per-user weekly pronunciation totals. Public read for opted-in rows (display_name IS NOT NULL).';

-- ── 3. RLS ────────────────────────────────────────────────────────────────
ALTER TABLE public.weekly_leaderboard ENABLE ROW LEVEL SECURITY;

-- Public read for opted-in rows. Anon users can SELECT — leaderboard
-- pages render for signed-out visitors as a viral-acquisition surface.
DROP POLICY IF EXISTS weekly_leaderboard_select_public_optin
  ON public.weekly_leaderboard;
CREATE POLICY weekly_leaderboard_select_public_optin
  ON public.weekly_leaderboard
  FOR SELECT
  TO anon, authenticated
  USING (display_name IS NOT NULL);

-- Owner read for their own row regardless of opt-in (so the user can
-- still see their own score and toggle the opt-in toggle).
DROP POLICY IF EXISTS weekly_leaderboard_select_own
  ON public.weekly_leaderboard;
CREATE POLICY weekly_leaderboard_select_own
  ON public.weekly_leaderboard
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Direct INSERT/UPDATE limited to the user's own row. The trigger
-- below runs as SECURITY DEFINER so it can write rows on behalf of
-- the authenticated speech_attempts INSERT regardless of RLS.
DROP POLICY IF EXISTS weekly_leaderboard_write_own
  ON public.weekly_leaderboard;
CREATE POLICY weekly_leaderboard_write_own
  ON public.weekly_leaderboard
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

GRANT SELECT ON public.weekly_leaderboard TO anon, authenticated;
GRANT UPDATE (display_name, updated_at) ON public.weekly_leaderboard
  TO authenticated;

-- ── 4. Aggregation trigger ────────────────────────────────────────────────
-- Fires on INSERT into speech_attempts. Upserts the (user, week) row
-- with the new attempt's match_score and increments attempts_count by
-- 1. Atomic per-row; concurrent attempts from two devices can't lose
-- updates because we use ON CONFLICT.
--
-- match_score is the local pronunciation scorer's 0..100 word-level
-- score. Cloud Azure scoring writes to a different table; we do not
-- mix the two on this leaderboard.
CREATE OR REPLACE FUNCTION public.weekly_leaderboard_apply_attempt()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  contribution numeric;
  week_start   date;
BEGIN
  -- Skip rows missing the score (the local scorer always emits one,
  -- but defensive: never insert NULL into total_score).
  IF NEW.match_score IS NULL THEN
    RETURN NEW;
  END IF;

  contribution := NEW.match_score::numeric;
  IF contribution < 0 THEN contribution := 0; END IF;

  week_start := (NEW.created_at AT TIME ZONE 'UTC')::date;
  -- Walk back to Monday of that week. date_trunc('week', timestamp)
  -- returns Monday 00:00; the cast to date drops the time component.
  week_start := date_trunc('week', week_start::timestamp)::date;

  INSERT INTO public.weekly_leaderboard
    (user_id, week_starts_on, total_score, attempts_count)
  VALUES
    (NEW.user_id, week_start, contribution, 1)
  ON CONFLICT (user_id, week_starts_on) DO UPDATE
    SET total_score    = public.weekly_leaderboard.total_score + EXCLUDED.total_score,
        attempts_count = public.weekly_leaderboard.attempts_count + 1,
        updated_at     = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_weekly_leaderboard_on_speech_attempt
  ON public.speech_attempts;
CREATE TRIGGER trg_weekly_leaderboard_on_speech_attempt
  AFTER INSERT ON public.speech_attempts
  FOR EACH ROW
  EXECUTE FUNCTION public.weekly_leaderboard_apply_attempt();

-- ── 5. RPC — top N for the current week ──────────────────────────────────
-- Returns up to `p_limit` rows ordered by total_score DESC. Includes a
-- rank column (1-indexed) computed via window function. Anon-callable.
CREATE OR REPLACE FUNCTION public.weekly_leaderboard_top(p_limit integer DEFAULT 100)
RETURNS TABLE (
  rank            integer,
  user_id         uuid,
  display_name    text,
  total_score     numeric,
  attempts_count  integer,
  week_starts_on  date
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH this_week AS (
    SELECT
      w.user_id,
      w.display_name,
      w.total_score,
      w.attempts_count,
      w.week_starts_on
    FROM public.weekly_leaderboard w
    WHERE w.week_starts_on = public.weekly_leaderboard_current_week_start()
      AND w.display_name IS NOT NULL
  )
  SELECT
    (ROW_NUMBER() OVER (
      ORDER BY total_score DESC,
               attempts_count DESC,
               user_id ASC  -- deterministic tie-break
    ))::integer AS rank,
    user_id,
    display_name,
    total_score,
    attempts_count,
    week_starts_on
  FROM this_week
  ORDER BY rank
  LIMIT GREATEST(1, LEAST(COALESCE(p_limit, 100), 500));
$$;

GRANT EXECUTE ON FUNCTION public.weekly_leaderboard_top(integer) TO anon, authenticated;

-- ── 6. RPC — caller's own rank for the current week ──────────────────────
-- Returns NULL columns when caller is anon or has no row this week.
-- Always returns one row so the client can read it without checking
-- for empty result sets.
CREATE OR REPLACE FUNCTION public.weekly_leaderboard_my_rank()
RETURNS TABLE (
  rank            integer,
  total_score     numeric,
  attempts_count  integer,
  display_name    text,
  opted_in        boolean,
  week_starts_on  date
)
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  ws date := public.weekly_leaderboard_current_week_start();
BEGIN
  IF uid IS NULL THEN
    -- Anon caller — return one row of nulls so the client doesn't 4xx.
    RETURN QUERY
      SELECT NULL::integer, NULL::numeric, NULL::integer, NULL::text, false, ws;
    RETURN;
  END IF;

  RETURN QUERY
    WITH ranked AS (
      SELECT
        w.user_id,
        w.total_score,
        w.attempts_count,
        w.display_name,
        ROW_NUMBER() OVER (
          ORDER BY w.total_score DESC,
                   w.attempts_count DESC,
                   w.user_id ASC
        )::integer AS rank
      FROM public.weekly_leaderboard w
      WHERE w.week_starts_on = ws
        AND w.display_name IS NOT NULL
    ),
    own_row AS (
      SELECT *
      FROM public.weekly_leaderboard
      WHERE user_id = uid
        AND week_starts_on = ws
    )
    SELECT
      ranked.rank,
      own_row.total_score,
      own_row.attempts_count,
      own_row.display_name,
      (own_row.display_name IS NOT NULL) AS opted_in,
      ws
    FROM own_row
    LEFT JOIN ranked ON ranked.user_id = own_row.user_id;

  -- If the user has no row at all this week, surface a one-row null result.
  IF NOT FOUND THEN
    RETURN QUERY
      SELECT NULL::integer, NULL::numeric, NULL::integer, NULL::text, false, ws;
  END IF;
END;
$$;

GRANT EXECUTE ON FUNCTION public.weekly_leaderboard_my_rank() TO authenticated;
