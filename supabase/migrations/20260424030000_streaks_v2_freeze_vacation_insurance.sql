-- Streaks v2 — freeze days, vacation mode, streak insurance.
--
-- Step 4 (Retention). Adds three forgiveness mechanisms on top of the
-- v1 server-side streak (20260425000000_server_side_streaks.sql). The
-- gating logic lives in src/lib/streaks/streakRules.ts; this migration
-- adds the persistence columns only.
--
-- Counters (freezes_used_this_week, insurance_used_this_month) are
-- maintained by app code that resets them at the top of the user's
-- ISO week / calendar month. We deliberately do NOT enforce that here
-- with a CHECK or trigger — separating policy from storage keeps
-- experimentation cheap.
--
-- Additive only. Five new columns on profiles, no rename, no drop.
--
-- Reversibility:
--   ALTER TABLE profiles DROP COLUMN IF EXISTS freezes_used_this_week;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS last_freeze_at;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS vacation_until;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS insurance_used_this_month;
--   ALTER TABLE profiles DROP COLUMN IF EXISTS last_insurance_at;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS freezes_used_this_week integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_freeze_at timestamp with time zone;

-- Inclusive last day of the user's planned break (their local timezone,
-- stored as date — no time component). NULL = not on vacation.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS vacation_until date;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS insurance_used_this_month integer NOT NULL DEFAULT 0;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS last_insurance_at timestamp with time zone;

-- Documentation comments — surface in pgAdmin / Supabase studio so the
-- next dev doesn't have to grep for the spec.
COMMENT ON COLUMN public.profiles.freezes_used_this_week IS
  'Streaks v2: count of freeze days consumed in the current ISO week. Reset weekly by app.';
COMMENT ON COLUMN public.profiles.last_freeze_at IS
  'Streaks v2: timestamp of the most recent freeze. Used to enforce one-per-day.';
COMMENT ON COLUMN public.profiles.vacation_until IS
  'Streaks v2: inclusive last day of the user''s vacation window in their local TZ. NULL = no vacation.';
COMMENT ON COLUMN public.profiles.insurance_used_this_month IS
  'Streaks v2: count of insurance uses this calendar month. Reset monthly by app. Cap = 1.';
COMMENT ON COLUMN public.profiles.last_insurance_at IS
  'Streaks v2: timestamp of the most recent insurance use.';
