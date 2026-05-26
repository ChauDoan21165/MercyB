-- Create enum for device types
CREATE TYPE public.device_type AS ENUM ('desktop', 'mobile');

-- Create user_sessions table to track active sessions
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  device_type public.device_type NOT NULL,
  device_info JSONB,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, device_type)
);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own sessions
CREATE POLICY "Users can view own sessions"
ON public.user_sessions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can insert their own sessions
CREATE POLICY "Users can insert own sessions"
ON public.user_sessions
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own sessions
CREATE POLICY "Users can update own sessions"
ON public.user_sessions
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Users can delete their own sessions
CREATE POLICY "Users can delete own sessions"
ON public.user_sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Function to cleanup old sessions
CREATE OR REPLACE FUNCTION public.cleanup_old_sessions()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete sessions older than 7 days
  DELETE FROM public.user_sessions
  WHERE last_activity < now() - interval '7 days';
  
  RETURN NEW;
END;
$$;

-- Trigger to cleanup old sessions periodically
CREATE TRIGGER cleanup_sessions_trigger
AFTER INSERT ON public.user_sessions
FOR EACH STATEMENT
EXECUTE FUNCTION public.cleanup_old_sessions();

-- Create index for faster lookups
CREATE INDEX idx_user_sessions_user_device ON public.user_sessions(user_id, device_type);
CREATE INDEX idx_user_sessions_activity ON public.user_sessions(last_activity);