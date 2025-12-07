-- Fix: Change default visibility from 'vip3_only' to 'private' for user privacy
ALTER TABLE public.user_knowledge_profile 
  ALTER COLUMN profile_visibility SET DEFAULT 'private';

-- Fix: Add search_path to generate_referral_code function for security best practices
ALTER FUNCTION public.generate_referral_code() 
  SET search_path = public;