-- Add track column to rooms table if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'rooms' 
    AND column_name = 'track'
  ) THEN
    ALTER TABLE public.rooms ADD COLUMN track TEXT DEFAULT 'core';
    ALTER TABLE public.rooms ADD CONSTRAINT rooms_track_check CHECK (track IN ('core', 'bonus'));
  END IF;
END $$;

-- Set track = 'core' for English Foundation rooms (EF-XX pattern)
UPDATE public.rooms 
SET track = 'core' 
WHERE (
  id LIKE 'english_foundation_%' 
  OR id LIKE 'ef_%'
  OR title_en LIKE 'EF-%'
)
AND (LOWER(tier) LIKE '%free%' OR LOWER(tier) LIKE '%miễn phí%');

-- Set track = 'bonus' for all other Free tier rooms
UPDATE public.rooms 
SET track = 'bonus' 
WHERE track IS NULL OR track = 'core'
AND (LOWER(tier) LIKE '%free%' OR LOWER(tier) LIKE '%miễn phí%')
AND id NOT LIKE 'english_foundation_%' 
AND id NOT LIKE 'ef_%'
AND title_en NOT LIKE 'EF-%';

-- Ensure all non-free rooms default to 'core' if null
UPDATE public.rooms 
SET track = 'core' 
WHERE track IS NULL;