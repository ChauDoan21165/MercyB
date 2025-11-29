-- Add Row-Level Security (RLS) policies for tier-based room access

-- First, ensure we have a function to get user's tier level
CREATE OR REPLACE FUNCTION public.get_user_tier_level(user_uuid uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(st.display_order, 0)
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE us.user_id = user_uuid
    AND us.status = 'active'
  ORDER BY us.created_at DESC
  LIMIT 1;
$$;

-- Add a helper function to get room tier level
CREATE OR REPLACE FUNCTION public.get_room_tier_level(tier_name text)
RETURNS integer
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE lower(trim(tier_name))
    WHEN 'free' THEN 0
    WHEN 'vip1' THEN 1
    WHEN 'vip2' THEN 2
    WHEN 'vip3' THEN 3
    WHEN 'vip4' THEN 4
    WHEN 'vip5' THEN 5
    WHEN 'vip6' THEN 6
    WHEN 'vip7' THEN 7
    WHEN 'vip8' THEN 8
    WHEN 'vip9' THEN 9
    ELSE 0
  END;
$$;

-- Create RLS policy for room access based on user tier
-- This policy allows users to see only rooms their tier permits
DROP POLICY IF EXISTS "Users can view rooms based on tier" ON public.rooms;
CREATE POLICY "Users can view rooms based on tier"
ON public.rooms
FOR SELECT
TO authenticated
USING (
  -- Admins can see everything
  public.has_role(auth.uid(), 'admin') 
  OR 
  -- Regular users can see rooms at or below their tier level
  public.get_user_tier_level(auth.uid()) >= public.get_room_tier_level(tier)
);

-- Update the anonymous demo rooms policy to be more restrictive
DROP POLICY IF EXISTS "Anonymous users can view demo rooms only" ON public.rooms;
CREATE POLICY "Anonymous users can view demo rooms only"
ON public.rooms
FOR SELECT
TO anon
USING (
  is_demo = true 
  AND 
  (tier IS NULL OR lower(tier) = 'free')
);

-- Add index for better performance on tier lookups
CREATE INDEX IF NOT EXISTS idx_rooms_tier_normalized ON public.rooms(lower(tier));

-- Log the RLS policy creation
DO $$ 
BEGIN
  RAISE NOTICE 'RLS policies for tier-based room access have been created successfully';
END $$;