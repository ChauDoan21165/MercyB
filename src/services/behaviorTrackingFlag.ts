/**
 * Client-side gate for the session + behavior tracking writers.
 *
 * Both user_sessions and user_behavior_tracking writes are gated by the
 * same feature flag (`behaviorTrackingEnabled`) so one SQL toggle kills
 * all telemetry writes if anything misbehaves in production.
 *
 * Resolution mirrors src/hooks/useFeatureFlag.ts:
 *   1. enabled_user_ids contains current user → ON
 *   2. is_enabled = true                      → ON (global)
 *   3. otherwise                              → OFF
 *
 * Result is cached in-memory per userId for TTL_MS to keep the flag
 * lookup off the hot path — behavior writes happen on every keyword
 * tap, so we must not issue a Supabase request per event.
 */
import { supabase } from "@/lib/supabaseClient";

const FLAG_KEY = "behaviorTrackingEnabled";
const TTL_MS = 5 * 60 * 1000; // 5 min — short enough for flag flips to take effect fast

type CacheEntry = { enabled: boolean; expiresAt: number };

const cache = new Map<string, CacheEntry>();

/**
 * Reset cache — test-only.
 */
export function __resetTrackingFlagCacheForTests(): void {
  cache.clear();
}

export async function isTrackingEnabled(
  userId: string | null | undefined,
): Promise<boolean> {
  if (!userId) return false;

  const cached = cache.get(userId);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.enabled;
  }

  try {
    const { data, error } = await supabase
      .from("feature_flags")
      .select("is_enabled, enabled_user_ids")
      .eq("flag_key", FLAG_KEY)
      .maybeSingle();

    if (error || !data) {
      cache.set(userId, { enabled: false, expiresAt: Date.now() + TTL_MS });
      return false;
    }

    const cohort = Array.isArray(data.enabled_user_ids)
      ? data.enabled_user_ids
      : [];
    const enabled = cohort.includes(userId) || !!data.is_enabled;

    cache.set(userId, { enabled, expiresAt: Date.now() + TTL_MS });
    return enabled;
  } catch {
    cache.set(userId, { enabled: false, expiresAt: Date.now() + TTL_MS });
    return false;
  }
}
