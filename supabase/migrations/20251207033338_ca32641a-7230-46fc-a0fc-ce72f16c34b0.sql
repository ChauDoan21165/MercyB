-- Fix: Change default visibility from 'vip3_only' to 'private' for user privacy
-- SAFE: will not crash if the table/column does not exist yet during db reset.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'user_knowledge_profile'
      AND column_name = 'profile_visibility'
  ) THEN
    ALTER TABLE public.user_knowledge_profile
      ALTER COLUMN profile_visibility SET DEFAULT 'private';
  END IF;
END $$;