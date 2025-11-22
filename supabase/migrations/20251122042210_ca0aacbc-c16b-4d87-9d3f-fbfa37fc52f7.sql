-- Create gift_codes table
CREATE TABLE IF NOT EXISTS public.gift_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  tier text NOT NULL CHECK (tier IN ('VIP2', 'VIP3')),
  code_expires_at timestamp with time zone,
  is_active boolean NOT NULL DEFAULT true,
  used_by uuid REFERENCES auth.users(id),
  used_at timestamp with time zone,
  created_by uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  notes text
);

-- Enable RLS
ALTER TABLE public.gift_codes ENABLE ROW LEVEL SECURITY;

-- Admins can manage all gift codes
CREATE POLICY "Admins can manage gift codes"
  ON public.gift_codes
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Authenticated users can view active, unused codes for redemption
CREATE POLICY "Users can view available codes"
  ON public.gift_codes
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL 
    AND is_active = true 
    AND used_by IS NULL
    AND (code_expires_at IS NULL OR code_expires_at > now())
  );

-- Create index for faster lookups
CREATE INDEX idx_gift_codes_code ON public.gift_codes(code);
CREATE INDEX idx_gift_codes_used_by ON public.gift_codes(used_by);

-- Trigger to update updated_at
CREATE TRIGGER update_gift_codes_updated_at
  BEFORE UPDATE ON public.gift_codes
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();