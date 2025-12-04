-- Create audio audit results table for tracking room-level audio health
CREATE TABLE IF NOT EXISTS public.audio_audit_room (
  room_id text PRIMARY KEY REFERENCES rooms(id) ON DELETE CASCADE,
  missing_en integer NOT NULL DEFAULT 0,
  missing_vi integer NOT NULL DEFAULT 0,
  orphan_count integer NOT NULL DEFAULT 0,
  last_checked timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.audio_audit_room ENABLE ROW LEVEL SECURITY;

-- Admins can manage audit data
CREATE POLICY "Admins can manage audio audit data"
ON public.audio_audit_room
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view audit data
CREATE POLICY "Authenticated users can view audio audit data"
ON public.audio_audit_room
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Add index for quick lookups on rooms with issues
CREATE INDEX idx_audio_audit_missing ON public.audio_audit_room (missing_en, missing_vi) WHERE missing_en > 0 OR missing_vi > 0;