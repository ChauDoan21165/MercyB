-- Add missing columns to rooms table for migration compatibility
ALTER TABLE public.rooms 
ADD COLUMN IF NOT EXISTS slug text,
ADD COLUMN IF NOT EXISTS content_en text DEFAULT '',
ADD COLUMN IF NOT EXISTS content_vi text DEFAULT '',
ADD COLUMN IF NOT EXISTS content_audio text,
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create unique index on slug (nullable, so partial index)
CREATE UNIQUE INDEX IF NOT EXISTS rooms_slug_unique ON public.rooms(slug) WHERE slug IS NOT NULL;

-- Create room_entries table
CREATE TABLE public.room_entries (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id text NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  index integer NOT NULL DEFAULT 1,
  slug text NOT NULL,
  copy_en text NOT NULL DEFAULT '',
  copy_vi text NOT NULL DEFAULT '',
  audio text,
  tags text[],
  severity integer,
  metadata jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for room lookups
CREATE INDEX room_entries_room_id_idx ON public.room_entries(room_id);
CREATE INDEX room_entries_room_id_index_idx ON public.room_entries(room_id, index);

-- Enable RLS
ALTER TABLE public.room_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies: same access pattern as rooms table
CREATE POLICY "Users can view room entries based on room tier"
ON public.room_entries
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.rooms r 
    WHERE r.id = room_entries.room_id 
    AND (has_role(auth.uid(), 'admin'::app_role) OR get_user_tier_level(auth.uid()) >= get_room_tier_level(r.tier))
  )
);

CREATE POLICY "Admins can manage room entries"
ON public.room_entries
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Trigger for updated_at
CREATE TRIGGER update_room_entries_updated_at
BEFORE UPDATE ON public.room_entries
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();