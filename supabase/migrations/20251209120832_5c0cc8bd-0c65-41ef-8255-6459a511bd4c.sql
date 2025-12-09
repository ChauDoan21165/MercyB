-- Add used_by_email column to gift_codes table for tracking
ALTER TABLE public.gift_codes 
ADD COLUMN IF NOT EXISTS used_by_email text;

-- Create index for faster filtering
CREATE INDEX IF NOT EXISTS idx_gift_codes_used_by ON public.gift_codes(used_by);
CREATE INDEX IF NOT EXISTS idx_gift_codes_used_at ON public.gift_codes(used_at);