-- Add is_demo flag to rooms table to mark demo-accessible rooms
ALTER TABLE public.rooms
ADD COLUMN IF NOT EXISTS is_demo BOOLEAN NOT NULL DEFAULT false;

-- Create index for efficient querying of demo rooms
CREATE INDEX IF NOT EXISTS idx_rooms_is_demo ON public.rooms(is_demo);

-- Update RLS policy to allow anonymous users to view demo rooms only
DROP POLICY IF EXISTS "Anyone can view rooms" ON public.rooms;

CREATE POLICY "Authenticated users can view all rooms"
  ON public.rooms FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anonymous users can view demo rooms only"
  ON public.rooms FOR SELECT
  USING (auth.uid() IS NULL AND is_demo = true);

-- Update responses table to allow demo users to view cached responses for demo rooms
DROP POLICY IF EXISTS "Users can view cached responses" ON public.responses;

CREATE POLICY "Authenticated users can view all cached responses"
  ON public.responses FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Anonymous users can view demo room responses"
  ON public.responses FOR SELECT
  USING (
    auth.uid() IS NULL 
    AND room_id IN (
      SELECT id FROM public.rooms WHERE is_demo = true
    )
  );

-- Mark first 2 rooms as demo rooms (adjust IDs as needed)
-- This is an example - admin can mark specific rooms as demo via the admin panel
COMMENT ON COLUMN public.rooms.is_demo IS 'Whether this room is accessible in demo mode without authentication';