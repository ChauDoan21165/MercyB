-- Add preferred_name to profiles for Teacher Mercy personalized greeting
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_name text;
