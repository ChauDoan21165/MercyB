/**
 * React hook — resolves a feature flag for the current signed-in user.
 *
 * Thin re-export over `useFeatureFlagQuery` so existing callers
 * (`const { enabled, loading } = useFeatureFlag(key, defaultValue)`) keep
 * working unchanged. The shared react-query cache means every component
 * on the page that reads the same `flag_key` triggers exactly one
 * network round-trip — see src/lib/queries/useFeatureFlagQuery.ts.
 *
 * Resolution order is preserved from the pre-react-query version (kept
 * in sync with supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and the server-side helper in src/lib/featureFlags.ts):
 *
 *   1. If enabled_user_ids contains the current user → ON
 *   2. Else if is_enabled = true                      → ON (global)
 *   3. Else (or on error, or no session, row missing) → OFF
 */
export { useFeatureFlagQuery as useFeatureFlag } from "@/lib/queries/useFeatureFlagQuery";
