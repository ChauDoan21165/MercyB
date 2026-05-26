-- Security Fixes from Pentest Report
-- 1. Fix search_path on database functions
-- 2. Restrict access_codes RLS policy

-- Fix 1: Add search_path to update_kids_updated_at_column
CREATE OR REPLACE FUNCTION public.update_kids_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix 2: Add search_path to update_app_settings_updated_at
CREATE OR REPLACE FUNCTION public.update_app_settings_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$;

-- Fix 3: Restrict access codes to prevent enumeration
DROP POLICY IF EXISTS "Authenticated users can view active codes for redemption" ON public.access_codes;

-- Only allow users to see codes meant for them or public codes
CREATE POLICY "Users can view their assigned codes or public codes"
ON public.access_codes
FOR SELECT
TO authenticated
USING (
  (is_active = true) 
  AND ((expires_at IS NULL) OR (expires_at > now()))
  AND (for_user_id IS NULL OR for_user_id = auth.uid())
);

-- Still allow admins to see all codes
CREATE POLICY "Admins can view all access codes"
ON public.access_codes
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'));