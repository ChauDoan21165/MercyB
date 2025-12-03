-- Add profile fields to companion_state for Mercy Guide personalization
ALTER TABLE public.companion_state
  ADD COLUMN IF NOT EXISTS preferred_name text,
  ADD COLUMN IF NOT EXISTS english_level text,
  ADD COLUMN IF NOT EXISTS learning_goal text,
  ADD COLUMN IF NOT EXISTS last_english_activity timestamptz;

-- Add check constraint for english_level values
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'companion_state_english_level_check'
  ) THEN
    ALTER TABLE public.companion_state
    ADD CONSTRAINT companion_state_english_level_check
    CHECK (english_level IS NULL OR english_level IN ('beginner', 'lower_intermediate', 'intermediate', 'advanced'));
  END IF;
END $$;