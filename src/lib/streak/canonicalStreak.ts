// src/lib/streak/canonicalStreak.ts
//
// THE canonical streak read seam. Every client-side reader of "the current
// user's streak" routes through here so the number is consistent across the
// badge, the notification at-risk check, gamification, and the family bridge.
//
// Policy (single source of truth):
//   - SERVER_STREAKS_ENABLED on  → server value (warm cache populated by
//     useServerStreak), with a localStorage WARM FALLBACK when the cache is
//     cold (first paint before the hook resolves, or offline).
//   - SERVER_STREAKS_ENABLED off → localStorage value.
//
// Writes still live in pointsService (updateStreak); this module only READS.
// The two local keys below MUST mirror pointsService — the regression test
// writes via pointsService and reads here to lock that contract.

import { FEATURE_FLAGS } from "@/lib/featureFlags";
import { getCachedStreak } from "@/lib/streakCache";

export type StreakSource = "server" | "local";

export interface CanonicalStreak {
  current: number;
  longest: number;
  /** YYYY-MM-DD of the last active/study day, or null. */
  lastStudiedDate: string | null;
  source: StreakSource;
}

// Mirror of pointsService STREAK_KEY / LAST_DAILY_KEY (it owns the writers).
const LOCAL_STREAK_KEY = "mb.points.streak";
const LOCAL_LAST_DAILY_KEY = "mb.points.lastDaily";

function readLocalStreak(): { current: number; lastStudiedDate: string | null } {
  try {
    const current =
      parseInt(localStorage.getItem(LOCAL_STREAK_KEY) || "1", 10) || 1;
    const last = localStorage.getItem(LOCAL_LAST_DAILY_KEY);
    return {
      current,
      lastStudiedDate: last && last.length >= 10 ? last.slice(0, 10) : null,
    };
  } catch {
    return { current: 1, lastStudiedDate: null };
  }
}

/**
 * The canonical streak read: server (warm cache) when enabled, else the
 * localStorage warm fallback. Synchronous — safe in render and imperative code.
 */
export function getCanonicalStreak(): CanonicalStreak {
  if (FEATURE_FLAGS.SERVER_STREAKS_ENABLED) {
    const cached = getCachedStreak();
    if (cached) {
      return {
        current: cached.current,
        longest: cached.longest,
        lastStudiedDate: cached.lastStudiedDate,
        source: "server",
      };
    }
  }
  const local = readLocalStreak();
  return {
    current: local.current,
    // localStorage doesn't track longest separately; current is the best local estimate.
    longest: local.current,
    lastStudiedDate: local.lastStudiedDate,
    source: "local",
  };
}

/**
 * The single at-risk rule (was inlined in the notification readModel). The
 * streak-save warning only operates off SERVER data, so at-risk is gated on
 * SERVER_STREAKS_ENABLED and a server-sourced last-studied date that equals
 * yesterday (and not today). Pure — callers pass the local dates + the
 * authoritative server lastStudiedDate.
 */
export function isStreakAtRisk(args: {
  serverStreaksEnabled: boolean;
  streakDays: number;
  lastStudiedDate: string | null;
  todayLocal: string;
  yesterdayLocal: string;
}): boolean {
  return (
    args.serverStreaksEnabled &&
    args.streakDays > 0 &&
    args.lastStudiedDate === args.yesterdayLocal &&
    args.lastStudiedDate !== args.todayLocal
  );
}
