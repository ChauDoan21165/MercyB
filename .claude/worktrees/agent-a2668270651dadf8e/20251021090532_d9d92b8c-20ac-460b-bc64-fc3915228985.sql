-- Create rooms table for static content from JSON files
CREATE TABLE IF NOT EXISTS public.rooms (
  id text PRIMARY KEY,
  schema_id text NOT NULL,
  title_en text NOT NULL,
  title_vi text NOT NULL,
  room_essay_en text,
  room_essay_vi text,
  safety_disclaimer_en text,
  safety_disclaimer_vi text,
  crisis_footer_en text,
  crisis_footer_vi text,
  entries jsonb DEFAULT '[]'::jsonb,
  keywords text[] DEFAULT ARRAY[]::text[],
  tier text DEFAULT 'free',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create responses cache table
CREATE TABLE IF NOT EXISTS public.responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  query text NOT NULL,
  room_id text REFERENCES public.rooms(id) ON DELETE CASCADE,
  response_en text NOT NULL,
  response_vi text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone DEFAULT (now() + interval '24 hours')
);

-- Create room_assignments table for daily rotations
CREATE TABLE IF NOT EXISTS public.room_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  room_id text REFERENCES public.rooms(id) ON DELETE CASCADE,
  assigned_date date DEFAULT CURRENT_DATE,
  is_full_access boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, room_id, assigned_date)
);

-- Create user_quotas table for rate limiting
CREATE TABLE IF NOT EXISTS public.user_quotas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  questions_used integer DEFAULT 0,
  rooms_accessed integer DEFAULT 0,
  quota_date date DEFAULT CURRENT_DATE,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, quota_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_rooms_keywords ON public.rooms USING gin(keywords);
CREATE INDEX IF NOT EXISTS idx_rooms_tier ON public.rooms(tier);
CREATE INDEX IF NOT EXISTS idx_responses_query ON public.responses(query, room_id);
CREATE INDEX IF NOT EXISTS idx_responses_expires ON public.responses(expires_at);
CREATE INDEX IF NOT EXISTS idx_room_assignments_user_date ON public.room_assignments(user_id, assigned_date);
CREATE INDEX IF NOT EXISTS idx_user_quotas_user_date ON public.user_quotas(user_id, quota_date);

-- Enable RLS on all tables
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;

-- RLS policies for rooms (public read access)
CREATE POLICY "Anyone can view rooms" ON public.rooms FOR SELECT USING (true);

-- RLS policies for responses (users can read cached responses)
CREATE POLICY "Users can view cached responses" ON public.responses FOR SELECT USING (auth.uid() IS NOT NULL);

-- RLS policies for room_assignments (users manage their own)
CREATE POLICY "Users can view their room assignments" ON public.room_assignments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their room assignments" ON public.room_assignments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS policies for user_quotas
CREATE POLICY "Users can view their quotas" ON public.user_quotas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their quotas" ON public.user_quotas FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their quotas" ON public.user_quotas FOR UPDATE USING (auth.uid() = user_id);

-- Function to clean expired cached responses
CREATE OR REPLACE FUNCTION public.clean_expired_responses()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.responses WHERE expires_at < now();
END;
$$;

-- Trigger to update updated_at on rooms
CREATE OR REPLACE FUNCTION public.handle_room_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_rooms_updated_at
BEFORE UPDATE ON public.rooms
FOR EACH ROW
EXECUTE FUNCTION public.handle_room_updated_at();