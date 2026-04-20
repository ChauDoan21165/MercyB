-- Add total_points to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS total_points integer DEFAULT 0;

-- Add preferred_name to profiles  
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_name text;
