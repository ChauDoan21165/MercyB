BEGIN;

-- Apply only after the served browser bundle resolves non-admin flags through
-- public.feature_flags_public. PR 908 showed revoking base-table reads before
-- that client routing is live can break the landing CTA.

DROP POLICY IF EXISTS "Anyone can read feature flags"
  ON public.feature_flags;

DROP POLICY IF EXISTS "Anyone can view feature flags"
  ON public.feature_flags;

DROP POLICY IF EXISTS "feature_flags_read_authenticated"
  ON public.feature_flags;

DROP POLICY IF EXISTS "feature_flags_read_anon"
  ON public.feature_flags;

DROP POLICY IF EXISTS "feature_flags_admin_select"
  ON public.feature_flags;

CREATE POLICY "feature_flags_admin_select"
  ON public.feature_flags
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (public.get_admin_level(auth.uid()) >= 9);

REVOKE SELECT ON public.feature_flags FROM anon;
GRANT SELECT ON public.feature_flags TO authenticated;

GRANT SELECT ON public.feature_flags_public TO anon;
GRANT SELECT ON public.feature_flags_public TO authenticated;

COMMIT;
