// src/features/gamification/hooks/useGamification.ts
//
// Lane F — F6: the React I/O + clock boundary for the gamification module.
//
// The engines are PURE and never read the clock; this hook is the ONLY place
// that calls `new Date()` / `Date.now()` and that touches the store. Every
// action composes the relevant engine call(s), re-evaluates achievements,
// persists the fresh full state, and updates React state. The latest state is
// also kept in a ref so successive actions in the same tick compose correctly.
//
// Fail soft: store I/O is wrapped in try/catch so a failed save never throws
// out of an event handler. The route is already flag-gated, so the hook does
// NOT re-gate on isGamificationEnabled() — it works regardless.

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  AchievementDefinition,
  DailyGoalConfig,
  GamificationState,
  XpAward,
  XpReason,
} from "../types";
import { createDefaultState, toIsoDate } from "../defaults";
import { GAMIFICATION_XP } from "../config";
import { createGamificationStore } from "../store/createGamificationStore";
import { streakEngine } from "../engines/streakEngine";
import { xpEngine } from "../engines/xpEngine";
import { dailyGoalEngine } from "../engines/dailyGoalEngine";
import { achievementEngine } from "../engines/achievementEngine";

export interface UseGamificationResult {
  state: GamificationState;
  loading: boolean;
  /** Achievements that flipped to unlocked on the most recent action. */
  newlyUnlocked: AchievementDefinition[];
  recordActivity: () => Promise<void>;
  awardXp: (amount: number, reason: XpReason) => Promise<XpAward>;
  addGoalProgress: (amount: number) => Promise<{ completedNow: boolean }>;
  setGoal: (config: DailyGoalConfig) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useGamification(): UseGamificationResult {
  const store = useMemo(createGamificationStore, []);
  const [state, setStateRaw] = useState<GamificationState>(createDefaultState);
  const [loading, setLoading] = useState(true);
  const [newlyUnlocked, setNewlyUnlocked] = useState<AchievementDefinition[]>([]);

  // Latest state mirror so chained actions read the freshest value, not a
  // stale closure capture.
  const stateRef = useRef<GamificationState>(state);

  const commit = useCallback((next: GamificationState) => {
    stateRef.current = next;
    setStateRaw(next);
  }, []);

  /** Persist the full state, failing soft. */
  const persist = useCallback(
    async (next: GamificationState) => {
      try {
        await store.save(next);
      } catch {
        // Swallow — never throw out of the hook. In-memory React state stays
        // correct for this session even if persistence is unavailable.
      }
    },
    [store],
  );

  const refresh = useCallback(async () => {
    try {
      const loaded = await store.load();
      commit(loaded);
    } catch {
      commit(createDefaultState());
    } finally {
      setLoading(false);
    }
  }, [store, commit]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const loaded = await store.load();
        if (!cancelled) commit(loaded);
      } catch {
        if (!cancelled) commit(createDefaultState());
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [store, commit]);

  const recordActivity = useCallback(async () => {
    const today = toIsoDate(new Date());
    const prev = stateRef.current;
    const streakResult = streakEngine.recordActivity(prev.streak, today);
    const withStreak: GamificationState = { ...prev, streak: streakResult.state };
    const evalResult = achievementEngine.evaluate(
      withStreak.achievements,
      withStreak,
      Date.now(),
    );
    const next: GamificationState = {
      ...withStreak,
      achievements: evalResult.state,
    };
    commit(next);
    setNewlyUnlocked(evalResult.newlyUnlocked);
    await persist(next);
  }, [commit, persist]);

  const awardXp = useCallback(
    async (amount: number, reason: XpReason): Promise<XpAward> => {
      const prev = stateRef.current;
      const award = xpEngine.award(prev.xp, amount, reason);
      const withXp: GamificationState = { ...prev, xp: award.state };
      const evalResult = achievementEngine.evaluate(
        withXp.achievements,
        withXp,
        Date.now(),
      );
      const next: GamificationState = {
        ...withXp,
        achievements: evalResult.state,
      };
      commit(next);
      setNewlyUnlocked(evalResult.newlyUnlocked);
      await persist(next);
      return award;
    },
    [commit, persist],
  );

  const addGoalProgress = useCallback(
    async (amount: number): Promise<{ completedNow: boolean }> => {
      const today = toIsoDate(new Date());
      const prev = stateRef.current;
      const goalResult = dailyGoalEngine.addProgress(
        prev.dailyGoal,
        amount,
        today,
      );
      let working: GamificationState = {
        ...prev,
        dailyGoal: goalResult.state,
      };
      // Crossing the daily goal awards goal_complete XP exactly once.
      if (goalResult.completedNow) {
        const award = xpEngine.award(
          working.xp,
          GAMIFICATION_XP.goal_complete,
          "goal_complete",
        );
        working = { ...working, xp: award.state };
      }
      const evalResult = achievementEngine.evaluate(
        working.achievements,
        working,
        Date.now(),
      );
      const next: GamificationState = {
        ...working,
        achievements: evalResult.state,
      };
      commit(next);
      setNewlyUnlocked(evalResult.newlyUnlocked);
      await persist(next);
      return { completedNow: goalResult.completedNow };
    },
    [commit, persist],
  );

  const setGoal = useCallback(
    async (config: DailyGoalConfig) => {
      const prev = stateRef.current;
      const next: GamificationState = {
        ...prev,
        dailyGoal: dailyGoalEngine.setGoal(prev.dailyGoal, config),
      };
      commit(next);
      await persist(next);
    },
    [commit, persist],
  );

  return {
    state,
    loading,
    newlyUnlocked,
    recordActivity,
    awardXp,
    addGoalProgress,
    setGoal,
    refresh,
  };
}
