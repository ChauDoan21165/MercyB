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

function readEnvBool(key: string, defaultValue: boolean): boolean {
  try {
    const raw = (import.meta as any)?.env?.[key];
    if (raw === undefined || raw === null || raw === "") return defaultValue;
    const s = String(raw).toLowerCase().trim();
    return s === "true" || s === "1" || s === "yes" || s === "on";
  } catch {
    return defaultValue;
  }
}

export const FEATURE_FLAGS = {
  MERCY_HOST_ENABLED: false, // flip to true when ready

  /**
   * Home page "Your focus areas" card that surfaces placement-test
   * weakness tags. Off until CC3's placement-test persistence lands
   * and manual QA passes.
   */
  FOCUS_AREAS_CARD_ENABLED: false,

  /**
   * Wave 2 Step 2 — server-side streaks (P0-2).
   * When ON: streak reads come from profiles.streak_current (server),
   * and the localStorage → server migration runs once per user.
   * When OFF: original localStorage-based streak remains.
   * Reads from env `VITE_SERVER_STREAKS_ENABLED`; defaults to OFF.
   */
  SERVER_STREAKS_ENABLED: readEnvBool("VITE_SERVER_STREAKS_ENABLED", false),

  /**
   * Wave 2 Step 3 — persist CC1's pronunciation scoring results into
   * speech_attempts so future analytics + weekly rollups have data.
   * When ON: each successful score in <SpeechDrill> fires an
   * INSERT into speech_attempts (fire-and-forget, non-blocking UI).
   * When OFF: scoring still runs and displays, but nothing is persisted.
   * Reads from env `VITE_SPEECH_PERSISTENCE_ENABLED`; defaults to OFF.
   */
  SPEECH_PERSISTENCE_ENABLED: readEnvBool("VITE_SPEECH_PERSISTENCE_ENABLED", false),
};

/**
 * Stable hash bucket for percentage-based feature-flag rollout.
 *
 * Returns a deterministic integer in [0, 99] for any non-empty user id.
 * The same userId always returns the same bucket — across page loads,
 * across machines, and across server/client boundaries — so a user
 * who is in cohort < N stays in cohort < N as the percentage advances.
 *
 * Implementation: 32-bit FNV-1a over the string's char codes, then
 * `% 100`. FNV-1a is fast, dependency-free, and produces a near-uniform
 * distribution for UUID-shaped inputs (verified by the companion test).
 *
 * @throws TypeError when `userId` is null, undefined, or empty/whitespace.
 *   Empty inputs are an integration bug — silently returning bucket 0
 *   would hide the bug and quietly enable the flag for one user out of
 *   every hundred who hit the unauthenticated path.
 */
export function getUserHashBucket(userId: string | null | undefined): number {
  if (typeof userId !== "string" || userId.trim().length === 0) {
    throw new TypeError(
      "getUserHashBucket: userId must be a non-empty string",
    );
  }

  // 32-bit FNV-1a hash.
  // Constants per http://www.isthe.com/chongo/tech/comp/fnv/
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i) & 0xff;
    // Multiply by FNV prime (0x01000193) modulo 2^32.
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }

  return hash % 100;
}

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
            | {
                is_enabled: boolean | null;
                enabled_user_ids: string[] | null;
                rollout_percentage?: number | null;
              }
            | null;
          error: { message: string } | null;
        }>;
      };
    };
  };
};

/**
 * Server-side flag resolver. Resolution order (kept in sync with the
 * migrations at supabase/migrations/20260424010000_feature_flags_per_user_cohort.sql
 * and 20260426010000_feature_flags_rollout_percentage.sql, and the browser
 * hook at src/hooks/useFeatureFlag.ts):
 *
 *   1. enabled_user_ids contains userId                                    → ON
 *   2. rollout_percentage IS NOT NULL AND bucket(userId) < percentage      → ON  (new)
 *   3. is_enabled = true                                                   → ON (global)
 *   4. else (row missing, error, or null userId)                           → OFF
 *
 * Safe to call with a null/undefined userId — unauthenticated callers fall
 * through to the global toggle only (the percentage step is skipped because
 * we can't bucket without a stable id). Never throws; any error is logged
 * and the function returns false so a misconfigured flag always fails closed.
 */
export async function isFlagEnabledForUser(
  client: MinimalSupabaseClient,
  flagKey: string,
  userId: string | null | undefined,
): Promise<boolean> {
  try {
    const { data, error } = await client
      .from("feature_flags")
      .select("is_enabled, enabled_user_ids, rollout_percentage")
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

    const percentage =
      typeof data.rollout_percentage === "number" ? data.rollout_percentage : null;
    if (percentage !== null && userId) {
      const bucket = getUserHashBucket(userId);
      if (bucket < percentage) return true;
    }

    return !!data.is_enabled;
  } catch (err) {
    console.warn(`[featureFlags] unexpected error for ${flagKey}:`, err);
    return false;
  }
}
