-- Seed the practice_recommendations_enabled feature flag.
-- Default OFF — ship dark for verification, flip on after one
-- week of dogfood per the task brief.
--
-- Resolution mirrors the rest of the flag system (see
-- src/hooks/useFeatureFlag.ts and src/lib/featureFlags.ts):
--   1. enabled_user_ids contains caller     → ON
--   2. is_enabled = true                    → ON (global)
--   3. else                                 → OFF
--
-- Reversibility:
--   DELETE FROM public.feature_flags WHERE flag_key = 'practice_recommendations_enabled';

INSERT INTO public.feature_flags (flag_key, is_enabled, enabled_user_ids, description)
VALUES (
  'practice_recommendations_enabled',
  false,
  ARRAY[]::uuid[],
  'Mercy proactive practice recommendation engine. Surfaces the Home PracticeRecommendationCard and the inline recommendation card in Mercy chat (when the user asks for a suggestion). Default OFF; flip on after dogfood verification.'
)
ON CONFLICT (flag_key) DO NOTHING;
