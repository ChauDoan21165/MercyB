import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/providers/AuthProvider";
import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { setCachedStreak, type CachedStreak } from "@/lib/streakCache";

export type ServerStreakState = {
  current: number;
  longest: number;
  lastStudiedDate: string | null;
  loading: boolean;
  error: string | null;
};

const EMPTY: ServerStreakState = {
  current: 0,
  longest: 0,
  lastStudiedDate: null,
  loading: true,
  error: null,
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
  const [state, setState] = useState<ServerStreakState>(
    FEATURE_FLAGS.SERVER_STREAKS_ENABLED ? EMPTY : DISABLED,
  );

  useEffect(() => {
    if (!FEATURE_FLAGS.SERVER_STREAKS_ENABLED) return;
    let alive = true;

    async function load(uid: string | null) {
      if (!uid) {
        if (alive) setState({ ...DISABLED });
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("streak_current, streak_longest, streak_last_studied_date")
        .eq("id", uid)
        .maybeSingle();

      if (!alive) return;
      if (error) {
        setState({
          current: 0,
          longest: 0,
          lastStudiedDate: null,
          loading: false,
          error: error.message,
        });
        return;
      }

      const row = (data ?? {}) as {
        streak_current?: number;
        streak_longest?: number;
        streak_last_studied_date?: string | null;
      };
      const next: CachedStreak = {
        current: row.streak_current ?? 0,
        longest: row.streak_longest ?? 0,
        lastStudiedDate: row.streak_last_studied_date ?? null,
        updatedAt: Date.now(),
      };
      setCachedStreak(next);
      setState({
        current: next.current,
        longest: next.longest,
        lastStudiedDate: next.lastStudiedDate,
        loading: false,
        error: null,
      });
    }

    void load(userId);

    return () => {
      alive = false;
    };
  }, [userId]);

  return state;
}
