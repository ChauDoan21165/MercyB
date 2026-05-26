-- Enable pgcrypto extension for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create room_pins table to store hashed PINs
CREATE TABLE public.room_pins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL UNIQUE REFERENCES public.rooms(id) ON DELETE CASCADE,
  pin_hash TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.room_pins ENABLE ROW LEVEL SECURITY;

-- Only admins can manage room PINs
CREATE POLICY "Admins can manage room PINs"
ON public.room_pins
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Function to set or update room PIN
CREATE OR REPLACE FUNCTION public.set_room_pin(
  _room_id TEXT,
  _pin TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can set room PINs';
  END IF;
  
  -- Validate PIN is exactly 4 digits
  IF _pin !~ '^\d{4}$' THEN
    RAISE EXCEPTION 'PIN must be exactly 4 digits';
  END IF;
  
  -- Insert or update the PIN hash
  INSERT INTO public.room_pins (room_id, pin_hash, updated_at)
  VALUES (_room_id, crypt(_pin, gen_salt('bf')), now())
  ON CONFLICT (room_id) 
  DO UPDATE SET 
    pin_hash = crypt(_pin, gen_salt('bf')),
    updated_at = now();
END;
$$;

-- Function to validate room PIN
CREATE OR REPLACE FUNCTION public.validate_room_pin(
  _room_id TEXT,
  _pin TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  stored_hash TEXT;
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can validate room PINs';
  END IF;
  
  -- Get the stored hash
  SELECT pin_hash INTO stored_hash
  FROM public.room_pins
  WHERE room_id = _room_id;
  
  -- If no PIN exists, return false
  IF stored_hash IS NULL THEN
    RETURN false;
  END IF;
  
  -- Validate the PIN
  RETURN (stored_hash = crypt(_pin, stored_hash));
END;
$$;

-- Function to remove room PIN (when unlocking)
CREATE OR REPLACE FUNCTION public.remove_room_pin(
  _room_id TEXT,
  _pin TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user is admin
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Only admins can remove room PINs';
  END IF;
  
  -- Validate the PIN before removing
  IF NOT public.validate_room_pin(_room_id, _pin) THEN
    RAISE EXCEPTION 'Incorrect PIN';
  END IF;
  
  -- Remove the PIN
  DELETE FROM public.room_pins
  WHERE room_id = _room_id;
END;
$$;

-- Create trigger for updated_at
CREATE TRIGGER update_room_pins_updated_at
BEFORE UPDATE ON public.room_pins
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();