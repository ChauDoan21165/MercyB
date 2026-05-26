-- Add track column to rooms table for core/bonus separation
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS track TEXT DEFAULT 'core' CHECK (track IN ('core', 'bonus'));

-- Update existing Level 0 tier rooms: EF/English Foundation rooms are core, others are bonus
UPDATE public.rooms 
SET track = 'core' 
WHERE tier ILIKE '%level0%' AND (id LIKE 'english_foundation%' OR id LIKE 'ef_%' OR title_en ILIKE 'EF-%');

UPDATE public.rooms 
SET track = 'bonus' 
WHERE tier ILIKE '%level0%' AND track IS NULL;

-- Set default for non-level0 tiers
UPDATE public.rooms 
SET track = 'core' 
WHERE track IS NULL;