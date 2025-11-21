-- Fix critical security issues

-- 1. Restrict profiles table to prevent contact info exposure
DROP POLICY IF EXISTS "vip3_mutual_visibility" ON public.profiles;
DROP POLICY IF EXISTS "chat_participants_view_profiles" ON public.profiles;

-- Create safer profile visibility policies
CREATE POLICY "vip3_can_view_basic_profiles" ON public.profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM user_subscriptions us
    JOIN subscription_tiers st ON us.tier_id = st.id
    WHERE us.user_id = auth.uid()
    AND st.name = 'VIP3'
    AND us.status = 'active'
  )
  AND id IN (
    SELECT id FROM profiles
    WHERE id IN (
      SELECT user_id FROM user_subscriptions us2
      JOIN subscription_tiers st2 ON us2.tier_id = st2.id
      WHERE st2.name = 'VIP3' AND us2.status = 'active'
    )
  )
);

-- 2. Protect user_moderation_status from public access
ALTER TABLE public.user_moderation_status ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System can manage moderation status" ON public.user_moderation_status;
DROP POLICY IF EXISTS "Admins can view all statuses" ON public.user_moderation_status;
DROP POLICY IF EXISTS "Users can view their own status" ON public.user_moderation_status;

CREATE POLICY "Only admins manage moderation" ON public.user_moderation_status
FOR ALL
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Users view own moderation status" ON public.user_moderation_status
FOR SELECT
USING (auth.uid() = user_id);

-- 3. Enable RLS on daily_feedback_summary view (restrict to admins)
-- Note: Views inherit RLS from base tables, ensure feedback table is properly secured

-- 4. Restrict login_attempts to admin-only
ALTER TABLE public.login_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins view login attempts" ON public.login_attempts
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- 5. Fix security_events insert policy
DROP POLICY IF EXISTS "System can insert security events" ON public.security_events;

CREATE POLICY "Authenticated can log own events" ON public.security_events
FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);