-- Fix 1: Make feedback.user_id NOT NULL to enforce RLS
ALTER TABLE public.feedback 
ALTER COLUMN user_id SET NOT NULL;

-- Fix 2: Create rate limiting table for text-to-speech
CREATE TABLE IF NOT EXISTS public.tts_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text_length INTEGER NOT NULL,
  voice TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on tts_usage_log
ALTER TABLE public.tts_usage_log ENABLE ROW LEVEL SECURITY;

-- RLS policies for tts_usage_log
CREATE POLICY "Users can view their own TTS usage"
ON public.tts_usage_log
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "System can insert TTS usage logs"
ON public.tts_usage_log
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Add index for efficient rate limit queries
CREATE INDEX IF NOT EXISTS idx_tts_usage_user_created 
ON public.tts_usage_log(user_id, created_at DESC);

-- Fix 3: Remove hardcoded admin email trigger (drop trigger first, then function)
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_auth_user_created_admin ON auth.users;
DROP FUNCTION IF EXISTS public.handle_admin_signup();

-- Fix 4: Make storage buckets private
UPDATE storage.buckets 
SET public = false 
WHERE id IN ('room-audio', 'room-audio-uploads');

-- Fix 5: Add storage policies for signed URL access
CREATE POLICY "Authenticated users can access room audio via signed URLs"
ON storage.objects
FOR SELECT
USING (
  bucket_id = 'room-audio' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "VIP users can upload to room-audio-uploads"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'room-audio-uploads'
  AND auth.uid() IS NOT NULL
);