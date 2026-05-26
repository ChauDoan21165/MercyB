-- Create companion_state table
CREATE TABLE IF NOT EXISTS public.companion_state (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  last_room text,
  last_mood text,
  emotional_tags jsonb DEFAULT '[]'::jsonb,
  reflection_history jsonb DEFAULT '[]'::jsonb,
  path_progress jsonb DEFAULT '{}'::jsonb,
  last_active_at timestamptz DEFAULT now()
);

-- Enable RLS on companion_state
ALTER TABLE public.companion_state ENABLE ROW LEVEL SECURITY;

-- Users can only read their own companion state
CREATE POLICY "Users can read own companion state"
ON public.companion_state
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own companion state
CREATE POLICY "Users can insert own companion state"
ON public.companion_state
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Users can update their own companion state
CREATE POLICY "Users can update own companion state"
ON public.companion_state
FOR UPDATE
USING (auth.uid() = user_id);

-- Create companion_events table
CREATE TABLE IF NOT EXISTS public.companion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  room_id text,
  event_type text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on companion_events
ALTER TABLE public.companion_events ENABLE ROW LEVEL SECURITY;

-- Users can read their own events
CREATE POLICY "Users can read own companion events"
ON public.companion_events
FOR SELECT
USING (auth.uid() = user_id);

-- Users can insert their own events
CREATE POLICY "Users can insert own companion events"
ON public.companion_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_companion_events_user_id ON public.companion_events(user_id);
CREATE INDEX IF NOT EXISTS idx_companion_events_created_at ON public.companion_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_companion_state_last_active ON public.companion_state(last_active_at DESC);

-- Ensure paths table has proper RLS
ALTER TABLE public.paths ENABLE ROW LEVEL SECURITY;

-- Public can read paths
DROP POLICY IF EXISTS "Anyone can read paths" ON public.paths;
CREATE POLICY "Anyone can read paths"
ON public.paths
FOR SELECT
USING (true);

-- Admins can manage paths
DROP POLICY IF EXISTS "Admins can manage paths" ON public.paths;
CREATE POLICY "Admins can manage paths"
ON public.paths
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure path_days table has proper RLS
ALTER TABLE public.path_days ENABLE ROW LEVEL SECURITY;

-- Public can read path_days
DROP POLICY IF EXISTS "Anyone can read path days" ON public.path_days;
CREATE POLICY "Anyone can read path days"
ON public.path_days
FOR SELECT
USING (true);

-- Admins can manage path_days
DROP POLICY IF EXISTS "Admins can manage path days" ON public.path_days;
CREATE POLICY "Admins can manage path days"
ON public.path_days
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));