-- Add lock field to rooms table
ALTER TABLE public.rooms 
ADD COLUMN is_locked BOOLEAN DEFAULT FALSE;

-- Create function to prevent updates to locked rooms
CREATE OR REPLACE FUNCTION public.check_room_lock()
RETURNS TRIGGER AS $$
BEGIN
  -- Allow updating the is_locked field itself
  IF OLD.is_locked = TRUE AND NEW.is_locked = FALSE THEN
    RETURN NEW;
  END IF;
  
  -- Prevent any other updates to locked rooms
  IF OLD.is_locked = TRUE THEN
    RAISE EXCEPTION 'Cannot modify locked room. Please unlock the room first.';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger to enforce lock
DROP TRIGGER IF EXISTS enforce_room_lock ON public.rooms;
CREATE TRIGGER enforce_room_lock
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.check_room_lock();

-- Create function to toggle room lock (for admins)
CREATE OR REPLACE FUNCTION public.toggle_room_lock(room_id_param TEXT, lock_state BOOLEAN)
RETURNS VOID AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can lock/unlock rooms';
  END IF;
  
  UPDATE public.rooms
  SET is_locked = lock_state
  WHERE id = room_id_param;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;