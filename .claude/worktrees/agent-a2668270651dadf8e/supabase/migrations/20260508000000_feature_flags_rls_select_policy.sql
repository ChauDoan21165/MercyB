-- Allow client-side useFeatureFlag hook to read feature_flags.
-- Table contains no secrets (flag_key + is_enabled + enabled_user_ids
-- only). SELECT is safe for both authenticated and anon roles.
-- Without this policy, every useFeatureFlag call 401s and falls
-- through to defaultValue, breaking per-user cohort rollouts.

DROP POLICY IF EXISTS "feature_flags_read_authenticated" ON feature_flags;
CREATE POLICY "feature_flags_read_authenticated"
  ON feature_flags
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "feature_flags_read_anon" ON feature_flags;
CREATE POLICY "feature_flags_read_anon"
  ON feature_flags
  FOR SELECT
  TO anon
  USING (true);
