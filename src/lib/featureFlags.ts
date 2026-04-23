// src/lib/featureFlags.ts — MB-BLUE-93.9 — 2025-12-24 (+0700)

/**
 * Two flag mechanisms coexist here:
 *
 * 1) Compile-time constants (FEATURE_FLAGS below) — flipped by editing the
 *    source and shipping a build. Good for visibility gates that must be
 *    guaranteed-off in production without a DB dependency.
 *
 * 2) Runtime DB-backed flags (public.feature_flags table) — flipped via
 *    SQL at any time, with optional per-user cohorts (enabled_user_ids[]).
 *    Use isFlagEnabledForUser() below for server-side code, or the React
 *    hook useFeatureFlag() for browser code.
 *
 * RULE: Default OFF for any new visible system.
 */

export const FEATURE_FLAGS = {
  MERCY_HOST_ENABLED: false, // flip to true when ready
};

/**
 * Minimal structural type for a Supabase client — accepts both the browser
 * singleton from `@/lib/supabaseClient` and a server-side client built with
 * the service-role key. We only need the `.from(...).select(...).eq(...)`
 * chain, so this avoids dragging the full @supabase/supabase-js types into
 * callers that don't already have them.
 */
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

/**
 * Server-side flag resolver. Resolution order (kept in sync with the
 * migration at supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and the browser hook at src/hooks/useFeatureFlag.ts):
 *
 *   1. If enabled_user_ids contains userId             → ON
 *   2. Else if is_enabled = true                       → ON (global)
 *   3. Else (row missing, error, or null userId)       → OFF
 *
 * Safe to call with a null/undefined userId — unauthenticated callers fall
 * through to the global toggle only. Never throws; any error is logged and
 * the function returns false so a misconfigured flag always fails closed.
 */
export async function isFlagEnabledForUser(
  client: MinimalSupabaseClient,
  flagKey: string,
  userId: string | null | undefined,
): Promise<boolean> {
  try {
    const { data, error } = await client
      .from("feature_flags")
      .select("is_enabled, enabled_user_ids")
      .eq("flag_key", flagKey)
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
