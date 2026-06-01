// src/features/gamification/engines/streakEngine.ts
//
// Lane F — F1: the STREAK engine. A PURE reducer over StreakState.
//
// No I/O, no Date.now() — callers pass `today: IsoDate` so behaviour is
// deterministic and trivially testable. Never mutates the input state; always
// returns a fresh object. Streaks are reckoned per local calendar day.

import type {
  StreakEngine,
  StreakState,
  StreakConfig,
  StreakUpdateResult,
  StreakStatus,
  IsoDate,
} from "../types";
import { DEFAULT_STREAK_CONFIG, daysBetween } from "../defaults";

/** Result for a call that changed nothing. */
function noop(state: StreakState): StreakUpdateResult {
  return {
    state,
    changed: false,
    incremented: false,
    freezeConsumed: false,
    broken: false,
  };
}

export const streakEngine: StreakEngine = {
  recordActivity(
    state: StreakState,
    today: IsoDate,
    config: StreakConfig = DEFAULT_STREAK_CONFIG,
  ): StreakUpdateResult {
    // Same-day → idempotent no-op.
    if (state.lastActiveDate === today) {
      return noop(state);
    }

    // First-ever activity.
    if (state.lastActiveDate === null) {
      const current = 1;
      return {
        state: {
          ...state,
          current,
          longest: Math.max(state.longest, current),
          lastActiveDate: today,
        },
        changed: true,
        incremented: true,
        freezeConsumed: false,
        broken: false,
      };
    }

    const gap = daysBetween(state.lastActiveDate, today);

    // Out-of-order / same-or-earlier day → no-op.
    if (gap <= 0) {
      return noop(state);
    }

    // Consecutive day → continue the streak.
    if (gap === 1) {
      const current = state.current + 1;
      return {
        state: {
          ...state,
          current,
          longest: Math.max(state.longest, current),
          lastActiveDate: today,
        },
        changed: true,
        incremented: true,
        freezeConsumed: false,
        broken: false,
      };
    }

    // gap > 1 → there were missed days.
    const missedDays = gap - 1;

    // Bridgeable with a freeze?
    if (missedDays <= config.graceDays && state.freezesAvailable >= 1) {
      const current = state.current + 1;
      const freezeUsedDates = state.freezeUsedDates.includes(today)
        ? state.freezeUsedDates
        : [...state.freezeUsedDates, today];
      return {
        state: {
          ...state,
          current,
          longest: Math.max(state.longest, current),
          lastActiveDate: today,
          freezesAvailable: state.freezesAvailable - 1,
          freezeUsedDates,
        },
        changed: true,
        incremented: true,
        freezeConsumed: true,
        broken: false,
      };
    }

    // Gap too large (or no freeze) → broken. Today starts a fresh streak.
    const current = 1;
    return {
      state: {
        ...state,
        current,
        longest: Math.max(state.longest, current),
        lastActiveDate: today,
      },
      changed: true,
      incremented: false,
      freezeConsumed: false,
      broken: true,
    };
  },

  status(
    state: StreakState,
    today: IsoDate,
    config: StreakConfig = DEFAULT_STREAK_CONFIG,
  ): StreakStatus {
    if (state.lastActiveDate === null) {
      return { active: false, atRisk: false, daysSinceActive: 0 };
    }

    const daysSinceActive = Math.max(0, daysBetween(state.lastActiveDate, today));
    const active =
      daysSinceActive === 0 || daysSinceActive <= 1 + config.graceDays;
    const atRisk = active && daysSinceActive >= 1;

    return { active, atRisk, daysSinceActive };
  },

  grantFreeze(
    state: StreakState,
    config: StreakConfig = DEFAULT_STREAK_CONFIG,
  ): StreakState {
    return {
      ...state,
      freezesAvailable: Math.min(config.maxFreezes, state.freezesAvailable + 1),
    };
  },
};
