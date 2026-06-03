// src/hooks/useCanonicalStreak.ts
//
// React-facing twin of getCanonicalStreak. Shape-compatible with
// useServerStreak (current/longest/lastStudiedDate/loading/error) plus a
// `source` discriminator, so display surfaces can route through ONE seam:
//   - SERVER_STREAKS_ENABLED on  → the server hook value (authoritative).
//   - SERVER_STREAKS_ENABLED off → the localStorage warm fallback (sync).

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { useServerStreak } from "@/hooks/useServerStreak";
import {
  getCanonicalStreak,
  type StreakSource,
} from "@/lib/streak/canonicalStreak";

export interface CanonicalStreakState {
  current: number;
  longest: number;
  lastStudiedDate: string | null;
  loading: boolean;
  error: string | null;
  source: StreakSource;
}

export function useCanonicalStreak(): CanonicalStreakState {
  // Called unconditionally (Rules of Hooks). When the flag is off it returns a
  // stable zero "disabled" state without touching the network.
  const server = useServerStreak();

  if (FEATURE_FLAGS.SERVER_STREAKS_ENABLED) {
    return { ...server, source: "server" };
  }

  const local = getCanonicalStreak();
  return {
    current: local.current,
    longest: local.longest,
    lastStudiedDate: local.lastStudiedDate,
    loading: false,
    error: null,
    source: local.source,
  };
}
