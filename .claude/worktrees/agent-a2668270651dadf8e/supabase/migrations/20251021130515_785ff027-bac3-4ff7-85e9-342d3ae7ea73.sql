-- Add username to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- Add username validation constraint
ALTER TABLE public.profiles ADD CONSTRAINT username_length CHECK (length(username) >= 3 AND length(username) <= 30);