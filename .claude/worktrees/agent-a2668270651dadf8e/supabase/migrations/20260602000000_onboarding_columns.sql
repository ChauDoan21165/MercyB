-- supabase/migrations/20260602000000_onboarding_columns.sql
--
-- Onboarding rebuild (PR feat/onboarding-rebuild).
--
-- Adds three nullable columns to public.profiles to capture the
-- 60-second goal-capture flow:
--
--   onboarded_at  — timestamp when the user finished (or skipped)
--                   onboarding. NULL means "has not yet seen the
--                   flow" — used by the redirect gate to send new
--                   cohort users through /onboarding on first load.
--   primary_goal  — what the user said they want to use MercyBlade
--                   for: 'career', 'travel', 'ielts', 'vstep',
--                   'toeic', 'general'. Drives first-lesson routing
--                   and persona selection downstream.
--   profession    — when primary_goal = 'career', the user's role:
--                   'restaurant', 'nail_tech', 'customer_service',
--                   'healthcare', 'tech', 'driver', 'hospitality',
--                   'other'. Maps onto the existing profession-pack
--                   content (PR #193, #198, etc.). NULL when the
--                   user picked a non-career goal or skipped this
--                   step.
--
-- The existing `english_level` column on profiles is reused as the
-- "level" field — no new column needed.
--
-- Backward compatibility: all three columns are NULLABLE. Existing
-- users (profiles.created_at < 2026-04-27) keep onboarded_at = NULL
-- but the application's gate logic only redirects when
-- created_at >= '2026-04-27' AND onboarded_at IS NULL — so legacy
-- users are not affected. A separate background backfill (out of
-- scope for this PR) can later set onboarded_at = created_at for
-- legacy users with proven activity.

BEGIN;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS onboarded_at timestamptz,
  ADD COLUMN IF NOT EXISTS primary_goal text,
  ADD COLUMN IF NOT EXISTS profession   text;

-- CHECK constraints document the canonical value set without forcing
-- a hard schema change later. Allowing NULL keeps legacy users + the
-- skip flow valid; allowing the documented strings prevents typos.

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_primary_goal_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_primary_goal_check
  CHECK (
    primary_goal IS NULL
    OR primary_goal IN (
      'career',
      'travel',
      'ielts',
      'vstep',
      'toeic',
      'general'
    )
  );

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_profession_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_profession_check
  CHECK (
    profession IS NULL
    OR profession IN (
      'restaurant',
      'nail_tech',
      'customer_service',
      'healthcare',
      'tech',
      'driver',
      'hospitality',
      'other'
    )
  );

-- Helpful index for the gate query: WHERE onboarded_at IS NULL AND
-- created_at >= '2026-04-27'. Partial index on onboarded_at IS NULL
-- so the index stays small as users complete onboarding.
CREATE INDEX IF NOT EXISTS profiles_pending_onboarding_idx
  ON public.profiles (created_at)
  WHERE onboarded_at IS NULL;

COMMENT ON COLUMN public.profiles.onboarded_at IS
  'Set when user completes or skips the /onboarding flow. NULL = not yet seen. Gate redirects new-cohort users (created_at >= 2026-04-27) with NULL.';
COMMENT ON COLUMN public.profiles.primary_goal IS
  'User-selected goal from onboarding step 2: career / travel / ielts / vstep / toeic / general.';
COMMENT ON COLUMN public.profiles.profession IS
  'When primary_goal = career, the user-selected profession from onboarding step 3. Drives profession-pack routing.';

COMMIT;
