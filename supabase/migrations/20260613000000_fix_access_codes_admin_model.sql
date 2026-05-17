-- Fix: /admin/access-codes frontend INSERT is RLS-denied (wrong admin model).
--
-- Origin: reports/RECON-stripe-audit.md (branch stripe-payment-audit),
-- finding §3.1 / §5 — HIGH, STILL OPEN. Full source trace in
-- RECON-admin-rls-fix.md.
--
-- Root cause:
--   Migration 20260509000000_fix_access_codes_insert_policy.sql wired all
--   four access_codes admin RLS policies to public.has_role(auth.uid(),
--   'admin'), which reads public.user_roles. The app's real admin model is
--   public.admin_users via public.get_admin_level() — used by the admin
--   route guard, every admin edge function, email RLS, story/interview/
--   analytics moderation, and 38 other live RLS policies. Admins
--   provisioned the normal way exist in admin_users (and
--   profiles.is_admin) but not necessarily in user_roles, so the browser
--   INSERT from src/pages/admin/AdminAccessCodes.tsx:172 (anon client +
--   admin JWT, RLS-subject) evaluates has_role → user_roles → no row →
--   false → "new row violates row-level security policy". Workaround in
--   use today: admins INSERT via the Supabase SQL Editor (service_role,
--   bypasses RLS).
--
-- Fix:
--   Re-point the four access_codes admin policies from the wrong admin
--   model (has_role → public.user_roles) to the canonical one
--   (get_admin_level → public.admin_users), matching every other admin
--   RLS gate in the product.
--
--   Threshold: get_admin_level(auth.uid()) >= 7 — payment-grade, matching
--   useAdminAccess `canManagePayments` (>= 7), because issuing an access
--   code grants a paid subscription tier. This predicate is the canonical
--   admin-write check; payment-transactions-rls-fix mirrors it verbatim.
--
-- NOT touched: "Users can view their assigned codes or public codes"
-- (20251130002025) — the unrelated user redemption-visibility policy. It
-- is a separate policy and must remain intact.
--
-- service_role bypasses RLS, so the SQL-Editor workaround and the
-- redeem-access-code RPC/service path are unaffected. get_admin_level
-- already has GRANT EXECUTE TO authenticated (20260427010000) and is
-- SECURITY DEFINER, so the browser JWT path can evaluate this against the
-- RLS-restricted admin_users table safely.
--
-- DROP-before-CREATE within a single transactional migration: there is no
-- point at which access_codes has zero admin policy → no lockout window.
--
-- Reversible: re-applying 20260509000000's body restores the prior state.
-- No schema/column change, no data migration. Safe to re-run
-- (DROP POLICY IF EXISTS … then CREATE).

DROP POLICY IF EXISTS "Admins can select access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can insert access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can update access codes" ON public.access_codes;
DROP POLICY IF EXISTS "Admins can delete access codes" ON public.access_codes;

-- Admins can view all codes
CREATE POLICY "Admins can select access codes"
ON public.access_codes
FOR SELECT
TO authenticated
USING (public.get_admin_level(auth.uid()) >= 7);

-- Admins can insert new codes (this is the path the frontend uses —
-- AdminAccessCodes.tsx:172 — and the one the documented bug broke)
CREATE POLICY "Admins can insert access codes"
ON public.access_codes
FOR INSERT
TO authenticated
WITH CHECK (public.get_admin_level(auth.uid()) >= 7);

-- Admins can update existing codes (toggle active/inactive)
CREATE POLICY "Admins can update access codes"
ON public.access_codes
FOR UPDATE
TO authenticated
USING (public.get_admin_level(auth.uid()) >= 7)
WITH CHECK (public.get_admin_level(auth.uid()) >= 7);

-- Admins can delete codes
CREATE POLICY "Admins can delete access codes"
ON public.access_codes
FOR DELETE
TO authenticated
USING (public.get_admin_level(auth.uid()) >= 7);
