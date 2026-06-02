// src/features/gamification/defaults.ts
//
// Shared, dependency-free helpers: the canonical empty state and the
// local-day date helpers every engine uses. Kept separate from types.ts so
// the contract stays type-only and this stays the single source of runtime
// defaults.

import {
  GAMIFICATION_SCHEMA_VERSION,
  type DailyGoalConfig,
  type GamificationState,
  type IsoDate,
  type StreakConfig,
} from "./types";

/** Default daily goal: 10 minutes/day — gentle, outcome-first, no shaming. */
export const DEFAULT_DAILY_GOAL: DailyGoalConfig = { metric: "minutes", target: 10 };

/** Default streak rules: a single freeze bridges one missed day, hold up to 2. */
export const DEFAULT_STREAK_CONFIG: StreakConfig = { graceDays: 1, maxFreezes: 2 };

/** Fresh state for a learner with no history. */
export function createDefaultState(): GamificationState {
  return {
    schemaVersion: GAMIFICATION_SCHEMA_VERSION,
    xp: { totalXp: 0, level: 1 },
    streak: {
      current: 0,
      longest: 0,
      lastActiveDate: null,
      freezesAvailable: 0,
      freezeUsedDates: [],
    },
    dailyGoal: {
      config: { ...DEFAULT_DAILY_GOAL },
      date: null,
      progress: 0,
      completedToday: false,
      history: {},
    },
    achievements: { unlocked: {} },
  };
}

/** Format a Date as a local-day `YYYY-MM-DD` IsoDate (NOT UTC). */
export function toIsoDate(d: Date): IsoDate {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Parse an IsoDate back to a Date at local midnight. */
export function fromIsoDate(iso: IsoDate): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

/** Whole local days from `a` to `b` (b - a). Negative if b precedes a. */
export function daysBetween(a: IsoDate, b: IsoDate): number {
  const MS_PER_DAY = 86_400_000;
  const da = fromIsoDate(a).getTime();
  const db = fromIsoDate(b).getTime();
  return Math.round((db - da) / MS_PER_DAY);
}
