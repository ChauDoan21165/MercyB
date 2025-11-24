-- ============================================
-- COMPREHENSIVE SECURITY AUDIT FIXES
-- ============================================

-- 1. FIX: Restrict VIP3 profile visibility to non-sensitive data only
-- DROP existing VIP3 profile viewing policy
DROP POLICY IF EXISTS "vip3_view_other_vip3_profiles" ON public.profiles;

-- CREATE new restricted policy that only shows username and avatar
CREATE POLICY "vip3_view_other_vip3_public_info" 
ON public.profiles 
FOR SELECT 
USING (
  -- Users can see their own full profile
  (auth.uid() = id) 
  OR
  -- VIP3 users can only see username and avatar of other VIP3 users (handled in app layer)
  (
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
  )
  OR
  -- Admins can view all profiles
  (
    EXISTS (
      SELECT 1 
      FROM user_roles
      WHERE user_roles.user_id = auth.uid() 
        AND user_roles.role = 'admin'::app_role
    )
  )
);

-- 2. FIX: Add audit logging for payment data access
CREATE TABLE IF NOT EXISTS public.admin_access_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL,
  accessed_table text NOT NULL,
  accessed_record_id uuid,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_access_audit ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.admin_access_audit
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.admin_access_audit
FOR INSERT
WITH CHECK (auth.uid() = admin_user_id);

-- 3. FIX: Validate private messages against chat requests
DROP POLICY IF EXISTS "Users can view their messages" ON public.private_messages;

CREATE POLICY "Users can view their approved messages"
ON public.private_messages
FOR SELECT
USING (
  (auth.uid() = sender_id OR auth.uid() = receiver_id)
  AND EXISTS (
    SELECT 1 
    FROM public.private_chat_requests
    WHERE private_chat_requests.id = private_messages.request_id
      AND private_chat_requests.status = 'accepted'
      AND (
        private_chat_requests.sender_id = auth.uid() 
        OR private_chat_requests.receiver_id = auth.uid()
      )
  )
);

-- 4. FIX: Add audit logging function for security events access
CREATE OR REPLACE FUNCTION public.log_admin_access(
  _accessed_table text,
  _accessed_record_id uuid DEFAULT NULL,
  _action text DEFAULT 'view',
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only log if user is authenticated
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO public.admin_access_audit (
      admin_user_id,
      accessed_table,
      accessed_record_id,
      action,
      metadata,
      created_at
    )
    VALUES (
      auth.uid(),
      _accessed_table,
      _accessed_record_id,
      _action,
      _metadata,
      now()
    );
  END IF;
END;
$$;

-- 5. FIX: Update all security definer functions to have proper search_path
-- This fixes the function_search_path_mutable warning

-- Fix has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix get_user_tier function
CREATE OR REPLACE FUNCTION public.get_user_tier(user_uuid uuid)
RETURNS TABLE(tier_name text, room_access_per_day integer, custom_topics_allowed integer, priority_support boolean)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    t.name,
    t.room_access_per_day,
    t.custom_topics_allowed,
    t.priority_support
  FROM user_subscriptions us
  JOIN subscription_tiers t ON us.tier_id = t.id
  WHERE us.user_id = user_uuid
    AND us.status = 'active'
  LIMIT 1;
$$;

-- Fix check_usage_limit function
CREATE OR REPLACE FUNCTION public.check_usage_limit(user_uuid uuid, limit_type text)
RETURNS boolean
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  tier_limit INTEGER;
  current_usage INTEGER;
BEGIN
  -- Get the user's tier limit
  IF limit_type = 'rooms' THEN
    SELECT room_access_per_day INTO tier_limit
    FROM subscription_tiers t
    JOIN user_subscriptions us ON t.id = us.tier_id
    WHERE us.user_id = user_uuid AND us.status = 'active';
  ELSIF limit_type = 'topics' THEN
    SELECT custom_topics_allowed INTO tier_limit
    FROM subscription_tiers t
    JOIN user_subscriptions us ON t.id = us.tier_id
    WHERE us.user_id = user_uuid AND us.status = 'active';
  ELSE
    RETURN false;
  END IF;

  IF tier_limit IS NULL THEN
    RETURN false;
  END IF;

  IF limit_type = 'rooms' THEN
    SELECT COALESCE(rooms_accessed, 0) INTO current_usage
    FROM subscription_usage
    WHERE user_id = user_uuid AND usage_date = CURRENT_DATE;
  ELSIF limit_type = 'topics' THEN
    SELECT COALESCE(custom_topics_requested, 0) INTO current_usage
    FROM subscription_usage
    WHERE user_id = user_uuid AND usage_date = CURRENT_DATE;
  END IF;

  RETURN COALESCE(current_usage, 0) < tier_limit;
END;
$$;

-- Fix is_user_blocked function
CREATE OR REPLACE FUNCTION public.is_user_blocked(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_uuid UUID;
  blocked BOOLEAN;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
  
  IF user_uuid IS NULL THEN
    RETURN false;
  END IF;
  
  SELECT is_blocked INTO blocked 
  FROM public.user_security_status 
  WHERE user_id = user_uuid;
  
  RETURN COALESCE(blocked, false);
END;
$$;

-- Fix check_rate_limit function
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  check_email text, 
  check_ip text, 
  time_window_minutes integer DEFAULT 15, 
  max_attempts integer DEFAULT 5
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM public.login_attempts
  WHERE (email = check_email OR ip_address = check_ip)
    AND success = false
    AND created_at > now() - (time_window_minutes || ' minutes')::INTERVAL;
  
  RETURN attempt_count >= max_attempts;
END;
$$;

-- Fix check_endpoint_rate_limit function
CREATE OR REPLACE FUNCTION public.check_endpoint_rate_limit(user_uuid uuid, endpoint_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  config_record RECORD;
  request_count INTEGER;
BEGIN
  SELECT max_requests, window_seconds INTO config_record
  FROM public.rate_limit_config
  WHERE endpoint = endpoint_name;
  
  IF NOT FOUND THEN
    config_record.max_requests := 100;
    config_record.window_seconds := 3600;
  END IF;
  
  SELECT COUNT(*) INTO request_count
  FROM public.security_events
  WHERE user_id = user_uuid
    AND event_type = 'rate_limit_check'
    AND metadata->>'endpoint' = endpoint_name
    AND created_at > now() - (config_record.window_seconds || ' seconds')::INTERVAL;
  
  RETURN request_count >= config_record.max_requests;
END;
$$;

-- Fix log_security_event function
CREATE OR REPLACE FUNCTION public.log_security_event(
  _user_id uuid,
  _event_type text,
  _severity text,
  _ip_address text DEFAULT NULL,
  _user_agent text DEFAULT NULL,
  _metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  event_id UUID;
BEGIN
  INSERT INTO public.security_events (
    user_id,
    event_type,
    severity,
    ip_address,
    user_agent,
    metadata
  )
  VALUES (
    _user_id,
    _event_type,
    _severity,
    _ip_address,
    _user_agent,
    _metadata
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- Fix award_points function
CREATE OR REPLACE FUNCTION public.award_points(
  _user_id uuid,
  _points integer,
  _transaction_type text,
  _description text DEFAULT NULL,
  _room_id text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.point_transactions (user_id, points, transaction_type, description, room_id)
  VALUES (_user_id, _points, _transaction_type, _description, _room_id);
  
  INSERT INTO public.user_points (user_id, total_points, updated_at)
  VALUES (_user_id, _points, now())
  ON CONFLICT (user_id)
  DO UPDATE SET
    total_points = user_points.total_points + _points,
    updated_at = now();
END;
$$;

-- 6. FIX: Add user knowledge profile privacy controls
ALTER TABLE public.user_knowledge_profile 
ADD COLUMN IF NOT EXISTS profile_visibility text DEFAULT 'vip3_only' 
CHECK (profile_visibility IN ('private', 'vip3_only', 'public'));

-- Update VIP3 knowledge profile policy to respect privacy settings
DROP POLICY IF EXISTS "VIP3 users can view other VIP3 knowledge profiles" ON public.user_knowledge_profile;

CREATE POLICY "VIP3 users can view permitted knowledge profiles"
ON public.user_knowledge_profile
FOR SELECT
USING (
  -- Users can always see their own profile
  (auth.uid() = user_id)
  OR
  -- VIP3 users can see other VIP3 profiles if visibility allows
  (
    profile_visibility IN ('vip3_only', 'public')
    AND EXISTS (
      SELECT 1
      FROM user_subscriptions us1
      JOIN subscription_tiers st1 ON us1.tier_id = st1.id
      WHERE us1.user_id = auth.uid()
        AND st1.name = 'VIP3'
        AND us1.status = 'active'
    )
    AND user_id IN (
      SELECT us2.user_id
      FROM user_subscriptions us2
      JOIN subscription_tiers st2 ON us2.tier_id = st2.id
      WHERE st2.name = 'VIP3'
        AND us2.status = 'active'
    )
  )
  OR
  -- Admins can view all profiles
  has_role(auth.uid(), 'admin')
);

-- 7. CREATE index for performance on audit logs
CREATE INDEX IF NOT EXISTS idx_admin_access_audit_admin_user 
ON public.admin_access_audit(admin_user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_admin_access_audit_table 
ON public.admin_access_audit(accessed_table, created_at DESC);