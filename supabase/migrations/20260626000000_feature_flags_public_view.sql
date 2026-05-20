-- ──────────────────────────────────────────────────────────────────────────
-- A15b-fix-1 (P1): Hide feature_flags PII from anon via a public view.
--
-- Problem (PR #897 §3.2 → recon in PR #902 §2):
--   public.feature_flags has RLS "Anyone can view ... USING (true)" + GRANT
--   SELECT to anon. The 2026-04-24 migration that added enabled_user_ids
--   (uuid[]) for dark-launch cohorts did NOT revisit RLS, so any anon browser
--   session can SELECT the full UUID array of every cohort. Confirmed in prod
--   by A15b verify SQL: 5 flags currently have non-empty cohorts.
--
-- Fix:
--   1. Create public.feature_flags_public — a SECURITY DEFINER-posture view
--      that returns flag_key + is_enabled + masked enabled_user_ids
--      (the caller's OWN uid if in the cohort, else empty).
--   2. REVOKE SELECT on the base table from anon.
--   3. GRANT SELECT on the new view to anon + authenticated.
--   4. Repoint READ-path client code at the view (separate file change).
--
-- Reversibility (rollback path, paste in SQL Editor if needed):
--     BEGIN;
--       DROP VIEW IF EXISTS public.feature_flags_public;
--       GRANT SELECT ON public.feature_flags TO anon;
--     COMMIT;
--
-- Notes:
--   - security_invoker = false is INTENTIONAL — the view IS the security
--     boundary, and it masks the PII column explicitly. Supabase's linter
--     will flag this as `security_definer_view`; that warning is acknowledged
--     and accepted (this is one of the small set of legitimate uses).
--   - The view exposes the SAME column names as the base table so client
--     code can switch with a one-line .from("…") change.
--   - For authenticated callers in their own cohort, the view returns
--     ARRAY[auth.uid()] — exactly the value the existing
--     `cohort.includes(userId)` check needs to evaluate to true.
--   - For anon callers (auth.uid() IS NULL), enabled_user_ids is always [].
--
-- Apply path: Supabase SQL Editor (per project rule — RLS / GRANT changes
-- bypass `supabase db push`). Idempotent: CREATE OR REPLACE + REVOKE/GRANT
-- are all re-runnable.
-- ──────────────────────────────────────────────────────────────────────────

BEGIN;

-- 1. The masked public view.
CREATE OR REPLACE VIEW public.feature_flags_public
WITH (security_invoker = false) AS
SELECT
  flag_key,
  is_enabled,
  CASE
    WHEN auth.uid() IS NOT NULL AND auth.uid() = ANY(enabled_user_ids)
      THEN ARRAY[auth.uid()]
    ELSE '{}'::uuid[]
  END AS enabled_user_ids,
  description,
  created_at,
  updated_at
FROM public.feature_flags;

COMMENT ON VIEW public.feature_flags_public IS
  'A15b-fix-1: Public-read view of feature_flags. enabled_user_ids is masked '
  'so anon callers see [] and authenticated callers see only their own uid '
  '(if they are in the cohort). SECURITY DEFINER posture is intentional — '
  'the view IS the security boundary. Replaces direct anon SELECT on the base '
  'table to close the PR #897 §3.2 / PR #902 §2 leak. Rollback: see migration '
  'header.';

-- 2. Revoke the leak path on the base table. Authenticated keeps SELECT
--    because admin tooling (SloDashboard etc.) reads the base directly.
REVOKE SELECT ON public.feature_flags FROM anon;

-- 3. Grant access on the new view.
GRANT SELECT ON public.feature_flags_public TO anon;
GRANT SELECT ON public.feature_flags_public TO authenticated;

-- 4. Sanity log: confirm anon can no longer SELECT base + can SELECT view.
DO $a15bfix$
DECLARE
  base_anon  text;
  view_anon  text;
BEGIN
  SELECT string_agg(privilege_type, ',')
    INTO base_anon
    FROM information_schema.role_table_grants
   WHERE table_schema = 'public'
     AND table_name = 'feature_flags'
     AND grantee = 'anon';

  SELECT string_agg(privilege_type, ',')
    INTO view_anon
    FROM information_schema.role_table_grants
   WHERE table_schema = 'public'
     AND table_name = 'feature_flags_public'
     AND grantee = 'anon';

  RAISE NOTICE 'A15b-fix-1: anon grants on feature_flags = %, anon grants on feature_flags_public = % (expect: NULL, SELECT)',
               COALESCE(base_anon, 'NULL'),
               COALESCE(view_anon, 'NULL');
END
$a15bfix$;

COMMIT;
