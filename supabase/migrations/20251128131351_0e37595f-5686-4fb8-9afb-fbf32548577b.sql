-- Create room_specifications table for storing visual settings
CREATE TABLE IF NOT EXISTS public.room_specifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  use_color_theme BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create room_specification_assignments table for applying specs
CREATE TABLE IF NOT EXISTS public.room_specification_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  specification_id UUID REFERENCES public.room_specifications(id) ON DELETE CASCADE,
  scope TEXT NOT NULL CHECK (scope IN ('room', 'tier', 'app')),
  target_id TEXT, -- room_id or tier name, null for app-wide
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  applied_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.room_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.room_specification_assignments ENABLE ROW LEVEL SECURITY;

-- RLS Policies - admins only
CREATE POLICY "Admins can manage room specifications"
  ON public.room_specifications
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage specification assignments"
  ON public.room_specification_assignments
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anyone can view specifications
CREATE POLICY "Anyone can view specifications"
  ON public.room_specifications
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view assignments"
  ON public.room_specification_assignments
  FOR SELECT
  USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_room_specifications_updated_at
  BEFORE UPDATE ON public.room_specifications
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();