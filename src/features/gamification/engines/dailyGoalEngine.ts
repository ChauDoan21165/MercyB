// src/features/gamification/engines/dailyGoalEngine.ts
//
// Lane F — Daily-goal engine (F3). PURE reducer over DailyGoalState.
//
// Never mutates input state; every mutating method returns a fresh state with a
// deep-copied `history` map whenever it writes. The day boundary is the single
// hard primitive (`rollover`); `addProgress` always rolls over first so progress
// can only ever land on `today`.

import {
  type DailyGoalConfig,
  type DailyGoalEngine,
  type DailyGoalState,
  type DailyGoalUpdateResult,
  type IsoDate,
} from "../types";

/** Shallow-clone history so writes never touch the caller's object. */
function cloneHistory(
  history: DailyGoalState["history"],
): DailyGoalState["history"] {
  return { ...history };
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export const dailyGoalEngine: DailyGoalEngine = {
  rollover(state: DailyGoalState, today: IsoDate): DailyGoalState {
    // Never tracked yet → start tracking today, progress untouched (0).
    if (state.date === null) {
      return { ...state, date: today };
    }

    // Already on today → no-op (shallow clone, no mutation of caller).
    if (state.date === today) {
      return { ...state };
    }

    // Stale day → archive the old day, reset progress for today.
    const history = cloneHistory(state.history);
    history[state.date] = {
      progress: state.progress,
      target: state.config.target,
      metric: state.config.metric,
      completed: state.completedToday,
    };

    return {
      ...state,
      history,
      date: today,
      progress: 0,
      completedToday: false,
    };
  },

  addProgress(
    state: DailyGoalState,
    amount: number,
    today: IsoDate,
  ): DailyGoalUpdateResult {
    // Clamp negative/NaN amounts to 0 (no-op increment).
    const delta = amount > 0 ? amount : 0;

    // Roll over first so progress always belongs to `today`.
    const rolled = this.rollover(state, today);

    const wasCompleted = rolled.completedToday;
    const progress = rolled.progress + delta;
    const completedToday = progress >= rolled.config.target;
    const completedNow = completedToday && !wasCompleted;

    const next: DailyGoalState = {
      ...rolled,
      progress,
      completedToday,
    };

    return { state: next, completedNow };
  },

  setGoal(state: DailyGoalState, config: DailyGoalConfig): DailyGoalState {
    // Invalid target (<= 0) is coerced to 1 — the goal must remain achievable
    // and ratio()'s divide-by-zero guard should never have to fire in practice.
    const target = config.target > 0 ? config.target : 1;
    const nextConfig: DailyGoalConfig = { metric: config.metric, target };

    return {
      ...state,
      config: nextConfig,
      completedToday: state.progress >= target,
    };
  },

  ratio(state: DailyGoalState): number {
    const { target } = state.config;
    if (target <= 0) return 0;
    return clamp01(state.progress / target);
  },
};
