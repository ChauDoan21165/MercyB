-- =====================================================
-- COMPREHENSIVE SECURITY HARDENING MIGRATION
-- Locks down RLS policies across all critical tables
-- =====================================================

-- ============= 1. ROOMS TABLE HARDENING =============
DROP POLICY IF EXISTS "Anonymous users can view demo rooms only" ON public.rooms;
DROP POLICY IF EXISTS "Authenticated users can view all rooms" ON public.rooms;

CREATE POLICY "auth_users_select_rooms_only"
ON public.rooms
FOR SELECT
TO authenticated
USING (auth.uid() IS NOT NULL);

CREATE POLICY "admins_full_access_rooms"
ON public.rooms
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============= 2. USER_SUBSCRIPTIONS HARDENING =============
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.user_subscriptions;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.user_subscriptions;

CREATE POLICY "users_select_own_subscription_only"
ON public.user_subscriptions
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id 
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "admins_full_subscription_access"
ON public.user_subscriptions
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============= 3. SUBSCRIPTION_TIERS HARDENING =============
DROP POLICY IF EXISTS "Anyone can view subscription tiers" ON public.subscription_tiers;

CREATE POLICY "authenticated_users_read_tiers"
ON public.subscription_tiers
FOR SELECT
TO authenticated
USING (is_active = true);

CREATE POLICY "admins_manage_tiers"
ON public.subscription_tiers
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============= 4. PROFILES HARDENING =============
DROP POLICY IF EXISTS "deny_anonymous_profile_access" ON public.profiles;

CREATE POLICY "deny_anonymous_profile_access"
ON public.profiles
FOR ALL
TO anon
USING (false);

-- ============= 5. PAYMENT_TRANSACTIONS HARDENING =============
DROP POLICY IF EXISTS "prevent_transaction_deletion" ON public.payment_transactions;

CREATE POLICY "prevent_transaction_deletion"
ON public.payment_transactions
FOR DELETE
TO authenticated
USING (false);

-- ============= 6. ADMIN NOTIFICATIONS =============
DROP POLICY IF EXISTS "only_admins_access_admin_notifications" ON public.admin_notifications;

CREATE POLICY "only_admins_access_admin_notifications"
ON public.admin_notifications
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============= 7. ADMIN NOTIFICATION SETTINGS =============
DROP POLICY IF EXISTS "only_admins_access_notification_settings" ON public.admin_notification_settings;

CREATE POLICY "only_admins_access_notification_settings"
ON public.admin_notification_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- ============= 8. USER_ROLES HARDENING =============
DROP POLICY IF EXISTS "Allow users to read own role" ON public.user_roles;
DROP POLICY IF EXISTS "only_admins_read_roles" ON public.user_roles;
DROP POLICY IF EXISTS "only_admins_manage_roles" ON public.user_roles;

CREATE POLICY "only_admins_read_roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "only_admins_manage_roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- ============= 9. SECURITY EVENT LOGGING FUNCTION =============
CREATE OR REPLACE FUNCTION public.log_security_event_v2(
  _event_type TEXT,
  _severity TEXT,
  _user_id UUID DEFAULT NULL,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL,
  _metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
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
    metadata,
    created_at
  )
  VALUES (
    COALESCE(_user_id, auth.uid()),
    _event_type,
    _severity,
    _ip_address,
    _user_agent,
    _metadata,
    now()
  )
  RETURNING id INTO event_id;
  
  RETURN event_id;
END;
$$;

-- ============= 10. RATE LIMITS =============
DROP POLICY IF EXISTS "system_manage_rate_limits" ON public.rate_limits;

CREATE POLICY "system_manage_rate_limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============= 11. UI_HEALTH_ISSUES =============
DROP POLICY IF EXISTS "only_admins_manage_ui_health" ON public.ui_health_issues;

CREATE POLICY "only_admins_manage_ui_health"
ON public.ui_health_issues
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));