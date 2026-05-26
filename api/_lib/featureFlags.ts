// api/_lib/featureFlags.ts
//
// Server-side feature-flag resolver for the Vercel serverless functions
// under api/. Extracted from src/lib/featureFlags.ts so the api/ bundle
// is self-contained (Vercel's bundler has historically had trouble
// tracing imports outside the api/ subtree, as discovered during the
// [ERR_MODULE_NOT_FOUND] production outage — see
// fix/grammar-api-import-path).
//
// Resolution order (kept in sync with the Supabase migration and the
// React hook at src/hooks/useFeatureFlag.ts):
//   1. If enabled_user_ids contains userId  → ON
//   2. Else if is_enabled = true            → ON (global rollout)
//   3. Else (row missing, error, null user) → OFF
//
// Never throws: any error is logged and the function returns false so a
// misconfigured flag always fails closed.

type MinimalSupabaseClient = {
  from: (table: string) => {
    select: (columns: string) => {
      eq: (
        column: string,
        value: string,
      ) => {
        maybeSingle: () => Promise<{
          data:
            | { is_enabled: boolean | null; enabled_user_ids: string[] | null }
            | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

export async function isFlagEnabledForUser(
  client: MinimalSupabaseClient,
  flagKey: string,
  userId: string | null | undefined,
): Promise<boolean> {
  try {
    const { data, error } = await client
      .from('feature_flags')
      .select('is_enabled, enabled_user_ids')
      .eq('flag_key', flagKey)
      .maybeSingle();

    if (error) {
      console.warn(
        `[featureFlags] lookup failed for ${flagKey}:`,
        error.message,
      );
      return false;
    }
    if (!data) return false;

    const cohort = Array.isArray(data.enabled_user_ids)
      ? data.enabled_user_ids
      : [];
    if (userId && cohort.includes(userId)) return true;

    return !!data.is_enabled;
  } catch (err) {
    console.warn(`[featureFlags] unexpected error for ${flagKey}:`, err);
    return false;
  }
}
