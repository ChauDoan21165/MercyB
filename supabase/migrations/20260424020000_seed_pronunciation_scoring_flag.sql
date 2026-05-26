-- Seeds the pronunciation scoring feature flag row so the UI can toggle it
-- without first having to INSERT. Default is OFF globally; the per-user
-- cohort (enabled_user_ids) stays empty until Chau adds a tester.
--
-- Resolution order is enforced by src/hooks/useFeatureFlag.ts and
-- src/lib/featureFlags.ts — keep all three in sync if the semantics change.

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'pronunciationScoringEnabled',
  false,
  ARRAY[]::uuid[],
  'Gates the Web Speech API pronunciation scoring UI. See src/lib/pronunciation/README.md for scope, browser support matrix, and the Azure/Speechace upgrade path.'
)
ON CONFLICT (flag_key) DO NOTHING;
