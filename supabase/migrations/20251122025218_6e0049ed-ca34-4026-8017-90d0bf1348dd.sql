-- Drop duplicate policies on profiles table
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "vip3_can_view_basic_profiles" ON public.profiles;

-- Keep only the properly named policies with correct scope
-- These already exist: users_insert_own_profile, users_update_own_profile, users_view_own_profile

-- Recreate VIP3 policy without recursion
CREATE POLICY "vip3_view_other_vip3_profiles" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can view profiles of other VIP3 users
  EXISTS (
    SELECT 1
    FROM user_subscriptions us1
    JOIN subscription_tiers st1 ON us1.tier_id = st1.id
    WHERE us1.user_id = auth.uid()
      AND st1.name = 'VIP3'
      AND us1.status = 'active'
  )
  AND id IN (
    SELECT us2.user_id
    FROM user_subscriptions us2
    JOIN subscription_tiers st2 ON us2.tier_id = st2.id
    WHERE st2.name = 'VIP3'
      AND us2.status = 'active'
  )
);