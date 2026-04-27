-- Teacher reviewer role — admin level 5.
--
-- The codebase already has an `admin_users` table (see
-- 20251209061329_…sql) with `level integer CHECK (level >= 1 AND
-- level <= 10)`. Levels are interpreted by
-- src/hooks/admin/useAdminAccess.ts:
--   level 1+   = isAdmin (basic admin access)
--   level 3+   = canManageUsers
--   level 5+   = canManageContent  ← teacher_reviewer slot
--   level 7+   = canManagePayments
--   level 8+   = canManageAdmins
--   level 9+   = canEditSystem (full admin)
--   level 10   = isAdminMaster (Chau)
--
-- Teachers get level 5: enough to access /teacher and submit reviews,
-- but NOT enough to mutate user data, payments, or other admins.
--
-- The existing `public.get_admin_level(_user_id uuid)` function works
-- without modification — it returns the integer from `admin_users.level`,
-- so a row with `level = 5` automatically means
-- `get_admin_level(auth.uid()) >= 5` evaluates true for that user. No
-- function-body change is required.
--
-- This migration:
--   1. Adds an idempotent helper `public.is_teacher_reviewer()` that
--      returns true when the caller has level >= 5. RLS policies use
--      this to express intent without referencing the magic number 5.
--      We keep `get_admin_level()` as the canonical primitive — the
--      helper is a readability sugar, not a replacement.
--   2. Inserts a PLACEHOLDER row at level 5 for the email
--      `teacher.review@mercyblade.com`. THIS EMAIL IS A PLACEHOLDER
--      AND MUST BE REPLACED with real teacher emails before this
--      migration runs in prod. The INSERT is wrapped in a guard so
--      it's a no-op if the email isn't yet a Supabase auth user
--      (admin_users.user_id has a NOT NULL fk to auth.users).
--
-- Reversibility:
--   DELETE FROM public.admin_users WHERE email = 'teacher.review@mercyblade.com';
--   DROP FUNCTION IF EXISTS public.is_teacher_reviewer();

-- ── 1. Helper RPC ─────────────────────────────────────────────────────
-- Usage in RLS:  USING (public.is_teacher_reviewer())
-- Equivalent to: USING (public.get_admin_level() >= 5)

CREATE OR REPLACE FUNCTION public.is_teacher_reviewer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT level FROM public.admin_users WHERE user_id = auth.uid()),
    0
  ) >= 5;
$$;

REVOKE ALL ON FUNCTION public.is_teacher_reviewer() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_teacher_reviewer() TO authenticated;

COMMENT ON FUNCTION public.is_teacher_reviewer() IS
  'True when caller is admin level >= 5 (teacher_reviewer or higher). '
  'Readability sugar over get_admin_level() >= 5.';

-- ── 2. Placeholder teacher reviewer row ───────────────────────────────
-- DEPLOYMENT NOTE — DO NOT DEPLOY THIS ROW TO PROD WITHOUT CHAU'S CONFIRMATION.
-- The email `teacher.review@mercyblade.com` is a PLACEHOLDER. Real
-- teacher emails (one row per teacher) must replace this entry before
-- this migration is applied to production. To replace:
--
--   1. Create the teacher's auth.users account (signup or admin invite).
--   2. INSERT INTO public.admin_users (user_id, email, level)
--      SELECT id, email, 5 FROM auth.users WHERE email = '<teacher_email>';
--   3. Optionally REMOVE the placeholder row inserted below.
--
-- The DO block guards against the auth.users row missing — if the
-- placeholder email hasn't been seeded as an auth user, this block is
-- a no-op (no error, no row inserted). That keeps the migration safe to
-- run in any environment.

DO $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Look up the placeholder email in auth.users. If it doesn't exist,
  -- silently skip the insert.
  SELECT id INTO v_user_id
  FROM auth.users
  WHERE email = 'teacher.review@mercyblade.com'
  LIMIT 1;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO public.admin_users (user_id, email, level)
    VALUES (v_user_id, 'teacher.review@mercyblade.com', 5)
    ON CONFLICT (user_id) DO UPDATE SET level = EXCLUDED.level;
  END IF;
END
$$;
