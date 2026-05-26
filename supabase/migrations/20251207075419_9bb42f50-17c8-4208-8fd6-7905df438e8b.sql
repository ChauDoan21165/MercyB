-- Fix RLS policies for gift code redemption

-- Allow authenticated users to update gift codes when redeeming (only their own redemption)
CREATE POLICY "Users can redeem gift codes"
ON public.gift_codes
FOR UPDATE
TO authenticated
USING (
  is_active = true 
  AND used_by IS NULL 
  AND (code_expires_at IS NULL OR code_expires_at > now())
)
WITH CHECK (
  used_by = auth.uid()
  AND is_active = false
  AND used_at IS NOT NULL
);

-- Allow authenticated users to insert their own subscription when redeeming a gift code
CREATE POLICY "Users can create their own subscription"
ON public.user_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());