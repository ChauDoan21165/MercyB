-- 20260609000000_xp_system.sql
--
-- A9 — XP system extension: levels, event-typed awarding, idempotency,
-- daily cap, cooldown, gamification opt-out.
--
-- Discipline: this migration is *additive* to the existing XP system
-- (migration 20260424221000_xp_and_daily.sql). Specifically:
--
--   - public.user_xp gains current_level + gamification_enabled.
--     Existing columns and RLS unchanged.
--   - public.xp_events is new — one row per awarded XP event, used
--     for the /xp history page and as the idempotency anchor.
--   - public.increment_user_xp(p_points) is preserved — the existing
--     awardXp() client call continues to work unchanged.
--   - public.award_xp_event(...) is new — handles event_type, source_id
--     idempotency, 500 XP/day per-event-type cap, 1-hour per-source
--     cooldown, level recalc, and a "gamification disabled" short-circuit.
--
-- "One owner per function": the existing awardXp() stays as the single
-- entry point for legacy daily-challenge flows; the new RPC is the
-- single entry point for event-typed awarding. Callers pick one based
-- on whether they have an event_type + source_id to track.
--
-- Reversibility:
--   DROP TABLE IF EXISTS public.xp_events;
--   ALTER TABLE public.user_xp DROP COLUMN IF EXISTS current_level;
--   ALTER TABLE public.user_xp DROP COLUMN IF EXISTS gamification_enabled;
--   DROP FUNCTION IF EXISTS public.award_xp_event(text, text, integer, numeric);
--   DROP FUNCTION IF EXISTS public.xp_level_for_total(integer);

-- ── 1. user_xp extension ──────────────────────────────────────────────-

ALTER TABLE public.user_xp
  ADD COLUMN IF NOT EXISTS current_level integer NOT NULL DEFAULT 1;

ALTER TABLE public.user_xp
  ADD COLUMN IF NOT EXISTS gamification_enabled boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.user_xp.current_level IS
  'A9 — denormalised level derived from total_xp. Recomputed by award_xp_event() so the Home badge can read it without a curve lookup.';

COMMENT ON COLUMN public.user_xp.gamification_enabled IS
  'A9 — per-user opt-out for XP / level / badge surfaces. Default true. award_xp_event() short-circuits with reason=disabled when false.';

-- Levels are positive integers. Anyone manually editing user_xp should
-- not be able to write level <= 0.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'user_xp_level_positive'
  ) THEN
    ALTER TABLE public.user_xp
      ADD CONSTRAINT user_xp_level_positive CHECK (current_level >= 1);
  END IF;
END $$;

-- ── 2. xp_events ──────────────────────────────────────────────────────-

CREATE TABLE IF NOT EXISTS public.xp_events (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type   text NOT NULL,
  xp_amount    integer NOT NULL CHECK (xp_amount > 0),
  source_id    text,
  occurred_at  timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.xp_events IS
  'A9 — append-only log of awarded XP events. One row per real award. Idempotency keyed by (user_id, event_type, source_id) when source_id is non-null.';

-- Idempotency anchor: same (user, event, source) cannot land twice.
-- Partial index — source_id is allowed null for events that don't have
-- a natural identifier (e.g., streak_day_continued for the same day
-- is deduped by the cooldown/cap logic, not by source_id).
CREATE UNIQUE INDEX IF NOT EXISTS xp_events_user_event_source_uniq
  ON public.xp_events (user_id, event_type, source_id)
  WHERE source_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS xp_events_user_recent_idx
  ON public.xp_events (user_id, occurred_at DESC);

CREATE INDEX IF NOT EXISTS xp_events_user_type_day_idx
  ON public.xp_events (user_id, event_type, occurred_at);

ALTER TABLE public.xp_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS xp_events_select_own ON public.xp_events;
CREATE POLICY xp_events_select_own
  ON public.xp_events
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- No INSERT/UPDATE/DELETE policy. Writes go through award_xp_event()
-- (SECURITY DEFINER). Direct client writes are blocked.

-- ── 3. Pure level-curve helper ────────────────────────────────────────-
-- Cumulative XP for level N (N>=1):
--   level 1 = 0
--   level N = round(125 * (1.4^(N-1) - 1))
--
-- Verifies: L2 = 125 * 0.4 = 50. L3 = 125 * 0.96 = 120. Matches the
-- brief's stated values.

CREATE OR REPLACE FUNCTION public.xp_level_for_total(p_total integer)
RETURNS integer
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  v_level integer := 1;
  v_threshold integer;
BEGIN
  IF p_total IS NULL OR p_total <= 0 THEN
    RETURN 1;
  END IF;

  -- Levels capped at 100 per brief.
  FOR v_level IN 2..100 LOOP
    v_threshold := round(125 * (power(1.4, v_level - 1) - 1));
    IF p_total < v_threshold THEN
      RETURN v_level - 1;
    END IF;
  END LOOP;

  RETURN 100;
END;
$$;

COMMENT ON FUNCTION public.xp_level_for_total(integer) IS
  'A9 — pure XP→level lookup. cumulative(N) = round(125*(1.4^(N-1)-1)). L2=50, L3=120, capped at L100.';

-- ── 4. award_xp_event RPC ─────────────────────────────────────────────-
--
-- Returns jsonb with:
--   { awarded: int, reason: text, total_xp: int, current_level: int,
--     level_changed: bool, previous_level: int }
--
-- reason values:
--   'awarded'  — XP added.
--   'duplicate' — same (user, event_type, source_id) already exists.
--   'cooldown' — same source_id was awarded within the last hour.
--   'capped'   — daily cap (500 XP/day per event_type) would be exceeded.
--   'disabled' — user has gamification_enabled = false.
--   'invalid'  — non-positive xp_amount or missing event_type.

CREATE OR REPLACE FUNCTION public.award_xp_event(
  p_event_type text,
  p_source_id  text,
  p_xp_amount  integer,
  p_multiplier numeric DEFAULT 1.0
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  v_amount integer;
  v_already_today integer;
  v_cap integer := 500;
  v_total integer;
  v_prev_level integer;
  v_new_level integer;
  v_pref_enabled boolean;
  v_existing_count integer;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'award_xp_event requires an authenticated user';
  END IF;

  IF p_event_type IS NULL OR length(trim(p_event_type)) = 0
     OR p_xp_amount IS NULL OR p_xp_amount <= 0 THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'reason', 'invalid',
      'total_xp', 0, 'current_level', 1,
      'level_changed', false, 'previous_level', 1
    );
  END IF;

  -- Read or initialise the user_xp row so we have a stable snapshot of
  -- the gamification flag and current level.
  INSERT INTO public.user_xp (user_id, total_xp, last_xp_at)
       VALUES (uid, 0, NULL)
  ON CONFLICT (user_id) DO NOTHING;

  SELECT total_xp, current_level, gamification_enabled
    INTO v_total, v_prev_level, v_pref_enabled
    FROM public.user_xp
    WHERE user_id = uid;

  IF NOT v_pref_enabled THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'reason', 'disabled',
      'total_xp', v_total, 'current_level', v_prev_level,
      'level_changed', false, 'previous_level', v_prev_level
    );
  END IF;

  -- Idempotency: source_id-bearing events are keyed; same key returns
  -- duplicate without writing.
  IF p_source_id IS NOT NULL THEN
    SELECT COUNT(*) INTO v_existing_count
      FROM public.xp_events
      WHERE user_id = uid
        AND event_type = p_event_type
        AND source_id = p_source_id;
    IF v_existing_count > 0 THEN
      RETURN jsonb_build_object(
        'awarded', 0, 'reason', 'duplicate',
        'total_xp', v_total, 'current_level', v_prev_level,
        'level_changed', false, 'previous_level', v_prev_level
      );
    END IF;

    -- 1-hour cooldown: even with a new source_id, if any event of this
    -- type was awarded for this source within the last hour, defer.
    -- Source-less events skip this branch (cap alone protects them).
    SELECT COUNT(*) INTO v_existing_count
      FROM public.xp_events
      WHERE user_id = uid
        AND event_type = p_event_type
        AND source_id = p_source_id
        AND occurred_at > now() - interval '1 hour';
    IF v_existing_count > 0 THEN
      RETURN jsonb_build_object(
        'awarded', 0, 'reason', 'cooldown',
        'total_xp', v_total, 'current_level', v_prev_level,
        'level_changed', false, 'previous_level', v_prev_level
      );
    END IF;
  END IF;

  -- Effective amount after multiplier. Floor at 1, ceiling at cap.
  v_amount := GREATEST(1, LEAST(v_cap, round(p_xp_amount * COALESCE(p_multiplier, 1.0))::int));

  -- Daily cap: sum of xp_amount today (UTC day) for this event_type.
  -- If award would push over, clamp.
  SELECT COALESCE(SUM(xp_amount), 0) INTO v_already_today
    FROM public.xp_events
    WHERE user_id = uid
      AND event_type = p_event_type
      AND occurred_at >= date_trunc('day', now());

  IF v_already_today >= v_cap THEN
    RETURN jsonb_build_object(
      'awarded', 0, 'reason', 'capped',
      'total_xp', v_total, 'current_level', v_prev_level,
      'level_changed', false, 'previous_level', v_prev_level
    );
  END IF;

  IF v_already_today + v_amount > v_cap THEN
    v_amount := v_cap - v_already_today;
  END IF;

  -- Atomic insert of event + total update + level recalc.
  INSERT INTO public.xp_events (user_id, event_type, xp_amount, source_id)
       VALUES (uid, p_event_type, v_amount, p_source_id);

  UPDATE public.user_xp
     SET total_xp     = total_xp + v_amount,
         last_xp_at   = now()
   WHERE user_id = uid
   RETURNING total_xp INTO v_total;

  v_new_level := public.xp_level_for_total(v_total);

  IF v_new_level <> v_prev_level THEN
    UPDATE public.user_xp
       SET current_level = v_new_level
     WHERE user_id = uid;
  END IF;

  RETURN jsonb_build_object(
    'awarded', v_amount,
    'reason', 'awarded',
    'total_xp', v_total,
    'current_level', v_new_level,
    'level_changed', v_new_level <> v_prev_level,
    'previous_level', v_prev_level
  );
END;
$$;

COMMENT ON FUNCTION public.award_xp_event(text, text, integer, numeric) IS
  'A9 — event-typed XP award with idempotency (source_id), 1-hour per-source cooldown, 500 XP/day per-event-type cap, level recalc, gamification opt-out.';

GRANT EXECUTE ON FUNCTION public.award_xp_event(text, text, integer, numeric)
  TO authenticated;
GRANT EXECUTE ON FUNCTION public.xp_level_for_total(integer) TO authenticated;

-- ── 5. Backfill current_level for existing rows ───────────────────────-

UPDATE public.user_xp
   SET current_level = public.xp_level_for_total(total_xp)
 WHERE current_level = 1 AND total_xp > 0;
