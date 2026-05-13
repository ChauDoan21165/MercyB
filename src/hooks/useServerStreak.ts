import { useEffect, useMemo } from "react";

import { useAuth } from "@/providers/AuthProvider";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { useProfileQuery } from "@/lib/queries/useProfileQuery";
import { setCachedStreak, type CachedStreak } from "@/lib/streakCache";

export type ServerStreakState = {
  current: number;
  longest: number;
  lastStudiedDate: string | null;
  loading: boolean;
  error: string | null;
};

const DISABLED: ServerStreakState = {
  current: 0,
  longest: 0,
  lastStudiedDate: null,
  loading: false,
  error: null,
};

/**
 * Read-only hook over `profiles.streak_current / streak_longest /
 * streak_last_studied_date`. Re-runs when the auth session changes.
 *
 * When the feature flag is OFF, returns a stable "disabled" zero state
 * without touching the network — components can still call the hook
 * unconditionally.
 *
 * Side effect: populates `streakCache.ts` so the synchronous
 * `pointsService.getStreakDays()` can serve recent server values.
 */
export function useServerStreak(): ServerStreakState {
  const { user } = useAuth();
  const userId = user?.id ?? null;
  const flagOn = FEATURE_FLAGS.SERVER_STREAKS_ENABLED;

  // Pass null when the flag is off so useProfileQuery is disabled and
  // never hits the network — preserves the original zero-fetch contract.
  const profileQuery = useProfileQuery(flagOn ? userId : null);

  const state = useMemo<ServerStreakState>(() => {
    if (!flagOn) return DISABLED;
    if (!userId) return DISABLED;
    if (profileQuery.isLoading) {
      return {
        current: 0,
        longest: 0,
        lastStudiedDate: null,
        loading: true,
        error: null,
      };
    }
    if (profileQuery.error) {
      return {
        current: 0,
        longest: 0,
        lastStudiedDate: null,
        loading: false,
        error: (profileQuery.error as Error).message,
      };
    }
    const row = (profileQuery.data ?? {}) as {
      streak_current?: number;
      streak_longest?: number;
      streak_last_studied_date?: string | null;
    };
    return {
      current: row.streak_current ?? 0,
      longest: row.streak_longest ?? 0,
      lastStudiedDate: row.streak_last_studied_date ?? null,
      loading: false,
      error: null,
    };
  }, [
    flagOn,
    userId,
    profileQuery.isLoading,
    profileQuery.error,
    profileQuery.data,
  ]);

  // Mirror the loaded server values into streakCache so the synchronous
  // pointsService.getStreakDays() reader can see them.
  useEffect(() => {
    if (!flagOn || !userId || state.loading || state.error) return;
    const next: CachedStreak = {
      current: state.current,
      longest: state.longest,
      lastStudiedDate: state.lastStudiedDate,
      updatedAt: Date.now(),
    };
    setCachedStreak(next);
  }, [
    flagOn,
    userId,
    state.loading,
    state.error,
    state.current,
    state.longest,
    state.lastStudiedDate,
  ]);

  return state;
}
