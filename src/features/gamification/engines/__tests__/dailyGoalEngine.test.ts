// src/features/gamification/engines/__tests__/dailyGoalEngine.test.ts

import { describe, expect, it } from "vitest";
import { dailyGoalEngine } from "../dailyGoalEngine";
import { DEFAULT_DAILY_GOAL, createDefaultState } from "../../defaults";
import type { DailyGoalState } from "../../types";

function freshGoal(): DailyGoalState {
  return createDefaultState().dailyGoal;
}

describe("dailyGoalEngine", () => {
  describe("rollover", () => {
    it("starts tracking on first call (date null → today), progress unchanged", () => {
      const state = freshGoal();
      const out = dailyGoalEngine.rollover(state, "2026-06-01");
      expect(out.date).toBe("2026-06-01");
      expect(out.progress).toBe(0);
      expect(out.completedToday).toBe(false);
      expect(out.history).toEqual({});
    });

    it("is a no-op when already on today", () => {
      const state: DailyGoalState = {
        ...freshGoal(),
        date: "2026-06-01",
        progress: 5,
        completedToday: false,
      };
      const out = dailyGoalEngine.rollover(state, "2026-06-01");
      expect(out.date).toBe("2026-06-01");
      expect(out.progress).toBe(5);
      expect(out.history).toEqual({});
    });

    it("archives a stale day into history and resets progress", () => {
      const state: DailyGoalState = {
        config: { metric: "minutes", target: 10 },
        date: "2026-05-31",
        progress: 7,
        completedToday: false,
        history: {},
      };
      const out = dailyGoalEngine.rollover(state, "2026-06-01");
      expect(out.date).toBe("2026-06-01");
      expect(out.progress).toBe(0);
      expect(out.completedToday).toBe(false);
      expect(out.history["2026-05-31"]).toEqual({
        progress: 7,
        target: 10,
        metric: "minutes",
        completed: false,
      });
    });

    it("archives the completed flag of the stale day", () => {
      const state: DailyGoalState = {
        config: { metric: "xp", target: 50 },
        date: "2026-05-31",
        progress: 60,
        completedToday: true,
        history: {},
      };
      const out = dailyGoalEngine.rollover(state, "2026-06-01");
      expect(out.history["2026-05-31"]).toEqual({
        progress: 60,
        target: 50,
        metric: "xp",
        completed: true,
      });
    });
  });

  describe("addProgress", () => {
    it("first call sets date=today", () => {
      const state = freshGoal();
      const { state: out } = dailyGoalEngine.addProgress(state, 3, "2026-06-01");
      expect(out.date).toBe("2026-06-01");
      expect(out.progress).toBe(3);
    });

    it("accumulates across calls on the same day", () => {
      let s = freshGoal();
      s = dailyGoalEngine.addProgress(s, 3, "2026-06-01").state;
      s = dailyGoalEngine.addProgress(s, 4, "2026-06-01").state;
      expect(s.progress).toBe(7);
      expect(s.completedToday).toBe(false);
    });

    it("fires completedNow exactly once when crossing the target", () => {
      let s = freshGoal(); // target 10
      let r = dailyGoalEngine.addProgress(s, 6, "2026-06-01");
      expect(r.completedNow).toBe(false);
      s = r.state;

      r = dailyGoalEngine.addProgress(s, 5, "2026-06-01"); // 6 → 11, crosses
      expect(r.completedNow).toBe(true);
      expect(r.state.completedToday).toBe(true);
      s = r.state;

      r = dailyGoalEngine.addProgress(s, 5, "2026-06-01"); // already complete
      expect(r.completedNow).toBe(false);
      expect(r.state.progress).toBe(16);
    });

    it("fires completedNow when reaching the target exactly", () => {
      const s = freshGoal();
      const r = dailyGoalEngine.addProgress(s, 10, "2026-06-01");
      expect(r.completedNow).toBe(true);
      expect(r.state.completedToday).toBe(true);
    });

    it("auto-rolls-over on a new day: prior day archived, today starts fresh", () => {
      let s = freshGoal();
      s = dailyGoalEngine.addProgress(s, 8, "2026-05-31").state;
      const r = dailyGoalEngine.addProgress(s, 2, "2026-06-01");
      expect(r.state.date).toBe("2026-06-01");
      expect(r.state.progress).toBe(2); // fresh day
      expect(r.state.history["2026-05-31"]).toEqual({
        progress: 8,
        target: 10,
        metric: "minutes",
        completed: false,
      });
    });

    it("re-fires completedNow on a new day after completing the prior day", () => {
      let s = freshGoal();
      let r = dailyGoalEngine.addProgress(s, 10, "2026-05-31");
      expect(r.completedNow).toBe(true);
      s = r.state;
      r = dailyGoalEngine.addProgress(s, 10, "2026-06-01");
      expect(r.completedNow).toBe(true); // new day, fresh completion
    });

    it("treats a negative amount as a no-op increment", () => {
      let s = freshGoal();
      s = dailyGoalEngine.addProgress(s, 5, "2026-06-01").state;
      const r = dailyGoalEngine.addProgress(s, -3, "2026-06-01");
      expect(r.state.progress).toBe(5);
      expect(r.completedNow).toBe(false);
    });

    it("a negative amount on first call still starts tracking with progress 0", () => {
      const s = freshGoal();
      const r = dailyGoalEngine.addProgress(s, -10, "2026-06-01");
      expect(r.state.date).toBe("2026-06-01");
      expect(r.state.progress).toBe(0);
    });
  });

  describe("setGoal", () => {
    it("changes the target and recomputes completedToday", () => {
      const state: DailyGoalState = {
        ...freshGoal(),
        date: "2026-06-01",
        progress: 8,
        completedToday: false,
      };
      const out = dailyGoalEngine.setGoal(state, { metric: "minutes", target: 5 });
      expect(out.config.target).toBe(5);
      expect(out.completedToday).toBe(true); // 8 >= 5
      expect(out.progress).toBe(8); // progress preserved
      expect(out.date).toBe("2026-06-01"); // date preserved
    });

    it("recomputes completedToday to false when raising the target above progress", () => {
      const state: DailyGoalState = {
        ...freshGoal(),
        date: "2026-06-01",
        progress: 8,
        completedToday: true,
      };
      const out = dailyGoalEngine.setGoal(state, { metric: "minutes", target: 20 });
      expect(out.completedToday).toBe(false);
    });

    it("coerces an invalid target (<= 0) to 1", () => {
      const state: DailyGoalState = {
        ...freshGoal(),
        progress: 0,
      };
      const out = dailyGoalEngine.setGoal(state, { metric: "lessons", target: 0 });
      expect(out.config.target).toBe(1);
      const outNeg = dailyGoalEngine.setGoal(state, { metric: "lessons", target: -5 });
      expect(outNeg.config.target).toBe(1);
    });

    it("changes the metric", () => {
      const out = dailyGoalEngine.setGoal(freshGoal(), { metric: "rooms", target: 3 });
      expect(out.config.metric).toBe("rooms");
      expect(out.config.target).toBe(3);
    });
  });

  describe("ratio", () => {
    it("returns progress / target", () => {
      const state: DailyGoalState = { ...freshGoal(), progress: 5 }; // target 10
      expect(dailyGoalEngine.ratio(state)).toBe(0.5);
    });

    it("clamps to 1 when over target", () => {
      const state: DailyGoalState = { ...freshGoal(), progress: 25 };
      expect(dailyGoalEngine.ratio(state)).toBe(1);
    });

    it("clamps to 0 when progress is somehow negative", () => {
      const state: DailyGoalState = { ...freshGoal(), progress: -4 };
      expect(dailyGoalEngine.ratio(state)).toBe(0);
    });

    it("guards divide-by-zero (target <= 0 → 0)", () => {
      const state: DailyGoalState = {
        ...freshGoal(),
        config: { metric: "minutes", target: 0 },
        progress: 5,
      };
      expect(dailyGoalEngine.ratio(state)).toBe(0);
    });
  });

  describe("immutability", () => {
    it("does not mutate the input state on addProgress", () => {
      const state = freshGoal();
      const snapshot = JSON.parse(JSON.stringify(state));
      dailyGoalEngine.addProgress(state, 5, "2026-06-01");
      expect(state).toEqual(snapshot);
    });

    it("does not mutate input history on rollover", () => {
      const state: DailyGoalState = {
        config: { ...DEFAULT_DAILY_GOAL },
        date: "2026-05-31",
        progress: 7,
        completedToday: false,
        history: {},
      };
      const historyRef = state.history;
      dailyGoalEngine.rollover(state, "2026-06-01");
      expect(historyRef).toEqual({}); // original map untouched
      expect(state.date).toBe("2026-05-31"); // original state untouched
    });

    it("does not mutate the input state on setGoal", () => {
      const state = freshGoal();
      const snapshot = JSON.parse(JSON.stringify(state));
      dailyGoalEngine.setGoal(state, { metric: "xp", target: 99 });
      expect(state).toEqual(snapshot);
    });
  });
});
