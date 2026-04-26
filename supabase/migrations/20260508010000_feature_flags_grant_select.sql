-- The RLS policies in 20260508000000_feature_flags_rls_select_policy.sql
-- created CREATE POLICY rules but the table-level GRANT SELECT was never
-- issued to authenticated or anon. RLS policies filter access; GRANTs
-- enable access. Both are required for the client-side useFeatureFlag
-- hook to read the table.
--
-- Table contains no secrets — flag_key, is_enabled, enabled_user_ids only.

GRANT SELECT ON public.feature_flags TO authenticated;
GRANT SELECT ON public.feature_flags TO anon;
