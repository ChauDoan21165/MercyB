import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import { qk } from "@/lib/queries/keys";
import { useAuthUserQuery } from "@/lib/queries/useAuthUserQuery";

type FeatureFlagRow = {
  is_enabled: boolean | null;
  enabled_user_ids: string[] | null;
};

/**
 * Resolves a feature flag for the current signed-in user via react-query
 * so the same `flag_key` lookup is shared across every component on the
 * page.
 *
 * Resolution order (kept in sync with the migration at
 * supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and the server-side helper in src/lib/featureFlags.ts):
 *   1. If enabled_user_ids contains the current user → ON
 *   2. Else if is_enabled = true                      → ON (global)
 *   3. Else (or on error, or no session, row missing) → OFF
 *
 * Returns `{ enabled, loading }` to match the public API of the legacy
 * `useFeatureFlag` hook — many callers destructure both.
 */
export function useFeatureFlagQuery(
  key: string,
  defaultValue: boolean = false,
): { enabled: boolean; loading: boolean } {
  const userQuery = useAuthUserQuery();
  const userId = userQuery.data?.id ?? null;

  const flagQuery = useQuery({
    queryKey: qk.featureFlag(key, userId),
    queryFn: async (): Promise<{ row: FeatureFlagRow | null }> => {
      // A15b-fix-1: route through feature_flags_public view so anon callers
      // never see other users' UUIDs in enabled_user_ids. Authenticated
      // callers in their own cohort see [auth.uid()] (truthy for the
      // includes-check below); everyone else sees []. See migration
      // supabase/migrations/20260626000000_feature_flags_public_view.sql.
      const { data, error } = await supabase
        .from("feature_flags_public")
        .select("is_enabled, enabled_user_ids")
        .eq("flag_key", key)
        .maybeSingle();

      if (error) {
        console.warn(`[useFeatureFlagQuery] ${key}:`, error.message);
        return { row: null };
      }
      return { row: (data as FeatureFlagRow | null) ?? null };
    },
    // Flags rarely flip — cache for 5 minutes so toggling a flag during
    // a single page lifetime still requires a manual reload, but every
    // component on the page shares one fetch.
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    // Don't refetch on every focus — flag values are very stable.
    refetchOnWindowFocus: false,
  });

  const loading = userQuery.isLoading || flagQuery.isLoading;
  const row = flagQuery.data?.row ?? null;

  // Match the legacy hook: while data is unavailable (still loading, or
  // row missing, or query errored) return `defaultValue` unchanged.
  if (!row) return { enabled: defaultValue, loading };

  const cohort = Array.isArray(row.enabled_user_ids)
    ? row.enabled_user_ids
    : [];

  if (userId && cohort.includes(userId)) {
    return { enabled: true, loading };
  }

  return { enabled: !!row.is_enabled, loading };
}
