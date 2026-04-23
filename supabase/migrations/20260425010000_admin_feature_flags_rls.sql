-- Admin feature-flags page (feat/admin-feature-flags).
--
-- Adds the server-side pieces the new /admin/feature-flags UI depends on:
--   1. feature_flags: INSERT + UPDATE policies gated on
--      get_admin_level(auth.uid()) >= 9 — matches the existing
--      admin-write gate used by email_campaigns / email_events and the
--      can_edit_system() helper.
--   2. profiles: a SELECT overlay that admins (level >= 9) can use to
--      read any row's (id, email, username, display_name). Enables the
--      "Lookup user by email" helper in the edit dialog without an RPC.
--
-- Gating decision: uses the existing public.get_admin_level(uuid) function
-- (SECURITY DEFINER, STABLE) rather than introducing a new is_admin flag
-- or current_user_is_admin() helper. One admin-authority surface, not two.
-- See docs/mercy-ai-company-lessons-log.md: "One owner per function".
--
-- SELECT on feature_flags for authenticated users is already in place
-- (added in 20260424010000_feature_flags_per_user_cohort.sql); this
-- migration only layers on the write + email-lookup policies.

-- ── feature_flags: admin INSERT/UPDATE ────────────────────────────────────
DROP POLICY IF EXISTS "feature_flags_admin_insert" ON public.feature_flags;
DROP POLICY IF EXISTS "feature_flags_admin_update" ON public.feature_flags;

CREATE POLICY "feature_flags_admin_insert"
  ON public.feature_flags
  FOR INSERT
  TO authenticated
  WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

CREATE POLICY "feature_flags_admin_update"
  ON public.feature_flags
  FOR UPDATE
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9)
  WITH CHECK (public.get_admin_level(auth.uid()) >= 9);

GRANT INSERT, UPDATE ON public.feature_flags TO authenticated;

-- ── profiles: admin SELECT overlay (for email → uuid lookup) ──────────────
-- Additive. Existing per-user SELECT policies remain and continue to govern
-- non-admin access. RLS combines SELECT policies with OR, so a level-9+ admin
-- sees everyone; a non-admin still sees only their own row.
--
-- Safe from recursion: get_admin_level reads from admin_users, not profiles.
DROP POLICY IF EXISTS "profiles_admin_can_select_all" ON public.profiles;

CREATE POLICY "profiles_admin_can_select_all"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

-- Reversibility:
--   DROP POLICY IF EXISTS "profiles_admin_can_select_all" ON public.profiles;
--   DROP POLICY IF EXISTS "feature_flags_admin_update" ON public.feature_flags;
--   DROP POLICY IF EXISTS "feature_flags_admin_insert" ON public.feature_flags;
--   REVOKE INSERT, UPDATE ON public.feature_flags FROM authenticated;
