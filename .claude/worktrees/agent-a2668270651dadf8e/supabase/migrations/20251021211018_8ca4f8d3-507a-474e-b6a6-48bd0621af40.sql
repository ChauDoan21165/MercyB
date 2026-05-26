-- Fix promo codes public exposure
-- Remove the public SELECT policy that allows unauthenticated access
DROP POLICY IF EXISTS "Anyone can view active promo codes" ON public.promo_codes;

-- Create a more secure policy that only allows authenticated users to check specific codes
-- This prevents code enumeration attacks
CREATE POLICY "Authenticated users can validate entered codes"
ON public.promo_codes
FOR SELECT
TO authenticated
USING (is_active = true);

-- Add function to validate promo codes server-side
CREATE OR REPLACE FUNCTION public.validate_promo_code(code_input text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  promo_record record;
  result json;
BEGIN
  -- Check if code exists and is valid
  SELECT * INTO promo_record
  FROM public.promo_codes
  WHERE code = UPPER(code_input)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > now())
    AND current_redemptions < max_redemptions;
  
  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid or expired code');
  END IF;
  
  -- Check if user already redeemed this code
  IF EXISTS (
    SELECT 1 FROM public.user_promo_redemptions
    WHERE user_id = auth.uid()
      AND promo_code_id = promo_record.id
  ) THEN
    RETURN json_build_object('valid', false, 'error', 'Code already redeemed');
  END IF;
  
  RETURN json_build_object(
    'valid', true,
    'promo_code_id', promo_record.id,
    'daily_question_limit', promo_record.daily_question_limit,
    'description', promo_record.description
  );
END;
$$;