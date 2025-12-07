-- Drop the security definer view and recreate as SECURITY INVOKER (default)
DROP VIEW IF EXISTS public.vip3_public_profiles;

-- Create as regular view (SECURITY INVOKER is default - uses caller's permissions)
CREATE VIEW public.vip3_public_profiles 
WITH (security_invoker = true)
AS
SELECT 
  p.id,
  p.username,
  p.avatar_url
FROM public.profiles p
WHERE p.id IN (
  SELECT us.user_id 
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE st.name = 'VIP3' AND us.status = 'active'
)
AND public.is_vip3_user(auth.uid());

COMMENT ON VIEW public.vip3_public_profiles IS 'Safe view exposing only username/avatar for VIP3 matchmaking. Uses SECURITY INVOKER to respect caller RLS.';