-- Manual migration: fix admin INSERT on access_codes
--
-- Run this in Supabase SQL Editor (https://supabase.com/dashboard/project/buemdfxyhxunzpgdoqin/sql/new)
--
-- Problem: Admin user cannot INSERT access codes via frontend.
-- Root cause: "Admins can manage access codes" policy uses FOR ALL with
-- only USING, no WITH CHECK. Postgres defaults WITH CHECK to USING for
-- INSERT, but this is fragile.
--
-- Fix 1: Ensure the admin user has an entry in user_roles
-- (skip if already present — safe to re-run).
INSERT INTO public.user_roles (user_id, role)
VALUES ('9957f25a-7b58-4a17-a3f2-4b91e63e69ae', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;

-- Fix 2: Replace the old "Admins can manage access codes" policy
-- with separate SELECT + INSERT/UPDATE/DELETE policies that have
-- explicit WITH CHECK clauses.
DROP POLICY IF EXISTS "Admins can manage access codes" ON public.access_codes;

-- SELECT: admins can read all codes
CREATE POLICY "Admins can select access codes"
ON public.access_codes FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- INSERT: admins can create codes
CREATE POLICY "Admins can insert access codes"
ON public.access_codes FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- UPDATE: admins can update codes
CREATE POLICY "Admins can update access codes"
ON public.access_codes FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- DELETE: admins can delete codes
CREATE POLICY "Admins can delete access codes"
ON public.access_codes FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));
