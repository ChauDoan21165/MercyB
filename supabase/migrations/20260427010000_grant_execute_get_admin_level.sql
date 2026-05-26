-- Fix: "permission denied for function get_admin_level" in prod.
--
-- Symptom (prod console):
--   [Home/placement] profile fetch error:
--     permission denied for function get_admin_level
--
-- Root cause:
--   `public.get_admin_level(uuid)` is defined with SECURITY DEFINER and
--   reads the restricted `admin_users` table — but the EXECUTE grant
--   to `authenticated` is missing (or was revoked by a broader REVOKE)
--   in production. The function was created in migration
--   20251209061329_... but the GRANT has drifted.
--
-- We keep admin_users RLS restrictive — callers never read admin_users
-- directly. SECURITY DEFINER lets the function bypass RLS internally,
-- so the ONLY thing we need to restore is the EXECUTE privilege for
-- authenticated clients.
--
-- Safe to re-run.

-- Re-assert SECURITY DEFINER + locked search_path (idempotent replace;
-- body is unchanged from 20251209061329_…).
CREATE OR REPLACE FUNCTION public.get_admin_level(_user_id uuid)
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT level FROM public.admin_users WHERE user_id = _user_id),
    0
  );
$$;

-- Defensively remove any ambient PUBLIC grant before re-granting narrowly.
REVOKE ALL ON FUNCTION public.get_admin_level(uuid) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_admin_level(uuid) TO authenticated;
