-- Fix: Add INSERT policy for access_codes.
-- The existing "Admins can manage access codes" policy uses FOR ALL USING (...)
-- which does NOT cover INSERT operations in Postgres RLS.
-- INSERT statements are only checked against WITH CHECK, not USING.
-- This was missed because the policy was added before the table had any data,
-- and the frontend direct-insert path was only recently enabled.

-- Drop the broken FOR ALL policy and the duplicate SELECT policy from the
-- security fix migration (20251130002025), then recreate with proper
-- per-operation RLS policies.
DROP POLICY IF EXISTS "Admins can manage access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can view all access codes" ON public.access_codes;

-- Admins can view all codes
CREATE POLICY "Admins can select access codes"
ON public.access_codes
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert new codes (this is the one that was missing)
CREATE POLICY "Admins can insert access codes"
ON public.access_codes
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can update existing codes
CREATE POLICY "Admins can update access codes"
ON public.access_codes
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Admins can delete codes
CREATE POLICY "Admins can delete access codes"
ON public.access_codes
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
