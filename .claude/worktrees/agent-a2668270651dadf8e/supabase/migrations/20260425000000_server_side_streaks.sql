-- P0-2 Wave 2 Step 2 — server-side daily-study streaks.
--
-- Motivation: streaks currently live in 4 localStorage keys across 3
-- modules. Switching phones resets them, which is unacceptable for a
-- paid learning app. See docs/audit-history-phase-1.md and the
-- Phase 1 audit report for Wave 2 Step 2.
--
-- Design (as approved by Chau):
--   - Derivation source: user_room_progress (canonical writer landed in
--     Wave 2 Step 1, PR #15).
--   - Threshold: "studied today" = progress_pct advanced today (INSERT
--     with progress_pct > 0 OR UPDATE where NEW.progress_pct >
--     OLD.progress_pct). Mount-only re-entries do NOT count.
--   - Grace period: 24 hours. prev_date = today OR today-1 OR today-2
--     all extend/continue the streak. Gap of 3+ days resets to 1.
--   - Timezone-aware: DATE(last_seen_at AT TIME ZONE profiles.timezone).
--   - Trigger-maintained: atomic with progress writes, no cron, no
--     client coordination.
--   - Feature flag lives client-side; the trigger always runs (writes
--     are harmless if the UI is hiding the number).
--
-- Reversibility:
--   DROP TRIGGER IF EXISTS trg_update_user_streak ON public.user_room_progress;
--   DROP FUNCTION IF EXISTS public.update_user_streak_from_room_progress();
--   DROP FUNCTION IF EXISTS public.migrate_local_streak(int, int, date);
--   ALTER TABLE profiles DROP COLUMN IF EXISTS streak_current;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS streak_longest;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS streak_last_studied_date;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS streak_migrated_at;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS timezone;

-- ── 1. Schema additions ───────────────────────────────────────────────────

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS timezone text NOT NULL DEFAULT 'Asia/Ho_Chi_Minh';

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_current integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_longest integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_last_studied_date date;

-- One-shot migration flag. NULL = never migrated from localStorage.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS streak_migrated_at timestamp with time zone;

-- ── 2. Trigger function — single source of truth for streak math ──────────
-- Mirrors the TypeScript helper at src/lib/streakMath.ts — keep both
-- implementations in sync.
CREATE OR REPLACE FUNCTION public.update_user_streak_from_room_progress()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tz           text;
  today_local  date;
  prev_date    date;
  prev_current integer;
  new_current  integer;
BEGIN
  -- Load user's timezone + existing streak state.
  SELECT COALESCE(timezone, 'Asia/Ho_Chi_Minh'),
         COALESCE(streak_current, 0),
         streak_last_studied_date
    INTO tz, prev_current, prev_date
    FROM public.profiles
    WHERE id = NEW.user_id;

  -- If the profile doesn't exist, bail silently — the user_id must match
  -- auth.users and profiles mirror 1:1; this branch shouldn't hit in prod
  -- but we don't want to crash the progress write.
  IF NOT FOUND THEN
    RETURN NEW;
  END IF;

  today_local := (NEW.last_seen_at AT TIME ZONE tz)::date;

  -- Cheap debounce: the second+ keyword click of the same day is a no-op.
  IF prev_date = today_local THEN
    RETURN NEW;
  END IF;

  -- Streak math:
  --   prev_date IS NULL        → first study ever                → 1
  --   prev_date = today - 1    → consecutive, normal             → +1
  --   prev_date = today - 2    → 1-day grace (missed one)        → +1
  --   prev_date < today - 2    → gap of 3+ days                  → reset to 1
  --   prev_date > today_local  → clock skew / timezone shift     → no-op
  IF prev_date IS NULL THEN
    new_current := 1;
  ELSIF prev_date > today_local THEN
    -- Defensive — shouldn't happen with server NOW() timestamps but we
    -- guard against a timezone change that moves "today" backwards.
    RETURN NEW;
  ELSIF prev_date = today_local - INTERVAL '1 day'
     OR prev_date = today_local - INTERVAL '2 days' THEN
    new_current := prev_current + 1;
  ELSE
    new_current := 1;
  END IF;

  UPDATE public.profiles
     SET streak_current           = new_current,
         streak_longest           = GREATEST(COALESCE(streak_longest, 0), new_current),
         streak_last_studied_date = today_local
   WHERE id = NEW.user_id;

  RETURN NEW;
END;
$$;

-- ── 3. Trigger — fires only on "engagement" writes (threshold B) ──────────
-- The WHEN clause filters out mount-only trackRoomEntry writes that leave
-- progress_pct at 0 on INSERT or don't change it on UPDATE.
DROP TRIGGER IF EXISTS trg_update_user_streak ON public.user_room_progress;

CREATE TRIGGER trg_update_user_streak
  AFTER INSERT OR UPDATE OF progress_pct
  ON public.user_room_progress
  FOR EACH ROW
  WHEN (
    (TG_OP = 'INSERT' AND NEW.progress_pct > 0)
    OR (TG_OP = 'UPDATE' AND NEW.progress_pct > COALESCE(OLD.progress_pct, 0))
  )
  EXECUTE FUNCTION public.update_user_streak_from_room_progress();

-- ── 4. One-time localStorage → server migration RPC ───────────────────────
-- Called once per user on first authenticated load after deploy.
-- Idempotent: streak_migrated_at acts as the "already ran" flag.
-- Merge rule: MAX(server, local) to avoid punishing users.
CREATE OR REPLACE FUNCTION public.migrate_local_streak(
  p_local_current            integer,
  p_local_longest            integer,
  p_local_last_studied_date  date
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  uid uuid := auth.uid();
  merged_current  integer;
  merged_longest  integer;
  merged_date     date;
  already_flag    timestamp with time zone;
BEGIN
  IF uid IS NULL THEN
    RAISE EXCEPTION 'migrate_local_streak requires an authenticated user';
  END IF;

  SELECT streak_migrated_at INTO already_flag
    FROM public.profiles
    WHERE id = uid;

  IF already_flag IS NOT NULL THEN
    -- Already ran — return current state, don't re-apply.
    RETURN (
      SELECT json_build_object(
        'already_migrated', true,
        'current',          streak_current,
        'longest',          streak_longest,
        'last_date',        streak_last_studied_date,
        'migrated_at',      streak_migrated_at
      )
      FROM public.profiles WHERE id = uid
    );
  END IF;

  -- Fresh migration: MAX-merge local values onto whatever the server has
  -- (which for most users will be 0/NULL since the trigger only started
  -- firing on post-Step-1 progress writes).
  UPDATE public.profiles
     SET streak_current           = GREATEST(COALESCE(streak_current, 0),
                                              COALESCE(p_local_current, 0)),
         streak_longest           = GREATEST(COALESCE(streak_longest, 0),
                                              COALESCE(p_local_longest, 0),
                                              COALESCE(p_local_current, 0)),
         streak_last_studied_date = GREATEST(streak_last_studied_date,
                                              p_local_last_studied_date),
         streak_migrated_at       = now()
   WHERE id = uid
   RETURNING streak_current, streak_longest, streak_last_studied_date
   INTO merged_current, merged_longest, merged_date;

  RETURN json_build_object(
    'already_migrated', false,
    'current',          merged_current,
    'longest',          merged_longest,
    'last_date',        merged_date,
    'migrated_at',      now()
  );
END;
$$;

-- RPC must be callable by any authenticated user — auth.uid() inside the
-- function enforces per-user scoping.
GRANT EXECUTE ON FUNCTION public.migrate_local_streak(integer, integer, date)
  TO authenticated;

-- Note: the trigger function runs under SECURITY DEFINER (owner's rights)
-- because the trigger fires on user-owned user_room_progress rows whose
-- user may not have UPDATE on profiles directly. The function only ever
-- updates the streak_* columns of the matching profile row, so this is
-- bounded.
