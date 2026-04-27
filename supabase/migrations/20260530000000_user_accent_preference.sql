-- Multi-accent pronunciation training (PR feat/multi-accent-pronunciation).
--
-- Adds `preferred_accent` to profiles so the Speak tab + Mercy chat +
-- Mock Interview surfaces can pick the right reference voice and route
-- Azure pronunciation scoring through the matching English locale
-- (en-US / en-GB / en-AU / en-CA).
--
-- Default 'us' preserves existing behaviour for everyone — users keep
-- American English unless they explicitly switch, per the brief
-- constraint "DO NOT change default for existing users".
--
-- Reversibility:
--   ALTER TABLE public.profiles
--     DROP CONSTRAINT IF EXISTS profiles_preferred_accent_chk,
--     DROP COLUMN IF EXISTS preferred_accent;

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS preferred_accent text NOT NULL DEFAULT 'us';

-- Constraint added separately so the column-add is idempotent and
-- the constraint can be replaced without touching column data.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'profiles_preferred_accent_chk'
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_preferred_accent_chk
      CHECK (preferred_accent IN ('us', 'uk', 'au', 'ca'));
  END IF;
END $$;

COMMENT ON COLUMN public.profiles.preferred_accent IS
  'User-selected English accent for pronunciation training + reference TTS. One of us/uk/au/ca. Default us preserves prior behaviour for existing users.';
