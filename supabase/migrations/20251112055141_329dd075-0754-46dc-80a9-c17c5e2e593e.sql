-- Add missing policies to allow admins to manage user roles
-- This fixes the issue where admins cannot grant or revoke roles

-- Policy to allow admins to grant roles (INSERT)
CREATE POLICY "Admins can grant roles to users"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy to allow admins to revoke roles (DELETE)
CREATE POLICY "Admins can revoke roles from users"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));