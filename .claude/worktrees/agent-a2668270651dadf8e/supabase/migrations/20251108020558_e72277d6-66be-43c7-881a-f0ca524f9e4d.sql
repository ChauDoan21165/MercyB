-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_rooms_tier ON public.rooms(tier);
CREATE INDEX IF NOT EXISTS idx_rooms_id ON public.rooms(id);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can update rooms" ON public.rooms;
DROP POLICY IF EXISTS "Admins can delete rooms" ON public.rooms;

-- Allow admins to manage rooms
CREATE POLICY "Admins can insert rooms"
ON public.rooms
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update rooms"
ON public.rooms
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete rooms"
ON public.rooms
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));