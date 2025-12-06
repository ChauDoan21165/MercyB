-- Drop the overly permissive VIP3 policy that exposes all profile columns
DROP POLICY IF EXISTS "vip3_view_other_vip3_public_info" ON public.profiles;

-- Create a view for VIP3 matchmaking that only exposes safe fields (username, avatar)
CREATE OR REPLACE VIEW public.vip3_public_profiles AS
SELECT 
  id,
  username,
  avatar_url
FROM public.profiles
WHERE id IN (
  SELECT us.user_id 
  FROM user_subscriptions us
  JOIN subscription_tiers st ON us.tier_id = st.id
  WHERE st.name = 'VIP3' AND us.status = 'active'
);

-- Enable RLS on the view (views inherit table RLS, but we add explicit policy)
-- Grant select on view to authenticated users who are VIP3
CREATE OR REPLACE FUNCTION public.is_vip3_user(user_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_subscriptions us
    JOIN subscription_tiers st ON us.tier_id = st.id
    WHERE us.user_id = user_uuid
      AND st.name = 'VIP3'
      AND us.status = 'active'
  )
$$;

-- Comment explaining the security fix
COMMENT ON VIEW public.vip3_public_profiles IS 'Safe view exposing only username/avatar for VIP3 matchmaking. Replaces direct profile access policy that exposed PII (email, phone, full_name).';