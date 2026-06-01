// src/features/gamification/engines/__tests__/achievementEngine.test.ts
import { describe, expect, it } from "vitest";
import { createDefaultState } from "../../defaults";
import type { GamificationState } from "../../types";
import { ACHIEVEMENTS, achievementEngine } from "../achievementEngine";

const NOW = 1_700_000_000_000;

function ids(defs: { id: string }[]): string[] {
  return defs.map((d) => d.id).sort();
}

describe("ACHIEVEMENTS catalog", () => {
  it("has stable, unique ids", () => {
    const seen = new Set<string>();
    for (const def of ACHIEVEMENTS) {
      expect(def.id).toBeTruthy();
      expect(seen.has(def.id)).toBe(false);
      seen.add(def.id);
    }
    expect(seen.size).toBe(ACHIEVEMENTS.length);
  });

  it("every entry has a non-empty Vietnamese title and description", () => {
    // Vietnamese uses diacritics on most words; assert each title/description
    // is present, non-trivial, and not pure ASCII English (carries diacritics).
    const hasVietnameseDiacritics = (s: string) =>
      /[àáảãạâầấẩẫậăằắẳẵặèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđÀÁẢÃẠÂĂÈÉÊÌÍÒÓÔƠÙÚƯỲÝĐ]/.test(
        s,
      );
    for (const def of ACHIEVEMENTS) {
      expect(def.title.trim().length).toBeGreaterThan(0);
      expect(def.description.trim().length).toBeGreaterThan(0);
      expect(hasVietnameseDiacritics(def.title)).toBe(true);
      expect(hasVietnameseDiacritics(def.description)).toBe(true);
    }
  });
});

describe("achievementEngine.evaluate — default state", () => {
  it("unlocks nothing on a fresh default state (all first_* thresholds require >0)", () => {
    const state = createDefaultState();
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(res.newlyUnlocked).toHaveLength(0);
    expect(Object.keys(res.state.unlocked)).toHaveLength(0);
  });
});

describe("achievementEngine.evaluate — streak", () => {
  it("longest=7 unlocks streak_3 and streak_7 but not streak_30", () => {
    const state = createDefaultState();
    state.streak.longest = 7;
    state.streak.current = 7;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    const unlockedIds = ids(res.newlyUnlocked);
    expect(unlockedIds).toContain("streak_3");
    expect(unlockedIds).toContain("streak_7");
    expect(unlockedIds).not.toContain("streak_30");
  });

  it("streak achievements use longest, not current (stay unlocked after a reset)", () => {
    const state = createDefaultState();
    state.streak.longest = 30;
    state.streak.current = 1; // reset, but longest preserved
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("streak_30");
  });

  it("first_day unlocks at current >= 1", () => {
    const state = createDefaultState();
    state.streak.current = 1;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("first_day");
  });
});

describe("achievementEngine.evaluate — xp", () => {
  it("level >= 5 unlocks xp_level_5", () => {
    const state = createDefaultState();
    state.xp.level = 5;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("xp_level_5");
  });

  it("level 4 does not unlock xp_level_5", () => {
    const state = createDefaultState();
    state.xp.level = 4;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).not.toContain("xp_level_5");
  });

  it("totalXp >= 1000 unlocks xp_1000", () => {
    const state = createDefaultState();
    state.xp.totalXp = 1000;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("xp_1000");
  });

  it("any positive totalXp unlocks first_xp; zero does not", () => {
    const zero = createDefaultState();
    expect(
      ids(achievementEngine.evaluate(zero.achievements, zero, NOW).newlyUnlocked),
    ).not.toContain("first_xp");

    const some = createDefaultState();
    some.xp.totalXp = 1;
    expect(
      ids(achievementEngine.evaluate(some.achievements, some, NOW).newlyUnlocked),
    ).toContain("first_xp");
  });
});

describe("achievementEngine.evaluate — goal", () => {
  it("goal_first unlocks via completedToday", () => {
    const state = createDefaultState();
    state.dailyGoal.completedToday = true;
    state.dailyGoal.date = "2026-06-01";
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("goal_first");
  });

  it("goal_first unlocks via a completed history entry", () => {
    const state = createDefaultState();
    state.dailyGoal.history["2026-05-30"] = {
      progress: 10,
      target: 10,
      metric: "minutes",
      completed: true,
    };
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("goal_first");
  });

  it("goal_7 counts history entries plus today, without double-counting today", () => {
    const state = createDefaultState();
    // 6 completed history days
    for (let i = 1; i <= 6; i += 1) {
      state.dailyGoal.history[`2026-05-0${i}`] = {
        progress: 10,
        target: 10,
        metric: "minutes",
        completed: true,
      };
    }
    // plus today completed but NOT yet in history => 7 total
    state.dailyGoal.completedToday = true;
    state.dailyGoal.date = "2026-06-01";
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).toContain("goal_7");
  });

  it("goal_7 does not double-count today already present in history", () => {
    const state = createDefaultState();
    // 6 completed history days including today
    for (let i = 1; i <= 5; i += 1) {
      state.dailyGoal.history[`2026-05-0${i}`] = {
        progress: 10,
        target: 10,
        metric: "minutes",
        completed: true,
      };
    }
    state.dailyGoal.history["2026-06-01"] = {
      progress: 10,
      target: 10,
      metric: "minutes",
      completed: true,
    };
    // today === a completed history entry => must NOT be counted twice (6 total, not 7)
    state.dailyGoal.completedToday = true;
    state.dailyGoal.date = "2026-06-01";
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).not.toContain("goal_7");
    expect(ids(res.newlyUnlocked)).toContain("goal_first");
  });

  it("incomplete history entries do not count", () => {
    const state = createDefaultState();
    state.dailyGoal.history["2026-05-30"] = {
      progress: 3,
      target: 10,
      metric: "minutes",
      completed: false,
    };
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(res.newlyUnlocked)).not.toContain("goal_first");
  });
});

describe("achievementEngine.evaluate — idempotency & immutability", () => {
  it("records `now` as unlockedAt", () => {
    const state = createDefaultState();
    state.xp.totalXp = 1;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(res.state.unlocked.first_xp.unlockedAt).toBe(NOW);
  });

  it("a second evaluate yields no new unlocks and preserves original unlockedAt", () => {
    const state = createDefaultState();
    state.xp.totalXp = 1;
    const first = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(first.newlyUnlocked.length).toBeGreaterThan(0);

    const LATER = NOW + 999_999;
    const second = achievementEngine.evaluate(first.state, state, LATER);
    expect(second.newlyUnlocked).toHaveLength(0);
    expect(second.state.unlocked.first_xp.unlockedAt).toBe(NOW);
  });

  it("does not mutate the input achState or fullState", () => {
    const state = createDefaultState();
    state.xp.totalXp = 1;
    const snapshotUnlocked = JSON.stringify(state.achievements.unlocked);
    const snapshotState = JSON.stringify(state);

    achievementEngine.evaluate(state.achievements, state, NOW);

    expect(JSON.stringify(state.achievements.unlocked)).toBe(snapshotUnlocked);
    expect(JSON.stringify(state)).toBe(snapshotState);
  });

  it("only newly-crossed thresholds are reported on incremental evaluate", () => {
    const state: GamificationState = createDefaultState();
    state.streak.longest = 3;
    const first = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(ids(first.newlyUnlocked)).toContain("streak_3");

    // streak grows to 7; only streak_7 should be newly reported
    state.streak.longest = 7;
    const second = achievementEngine.evaluate(first.state, state, NOW + 1);
    expect(ids(second.newlyUnlocked)).toEqual(["streak_7"]);
    expect(second.state.unlocked.streak_3.unlockedAt).toBe(NOW);
    expect(second.state.unlocked.streak_7.unlockedAt).toBe(NOW + 1);
  });
});

describe("achievementEngine.isUnlocked", () => {
  it("reflects the achievement state", () => {
    const state = createDefaultState();
    state.xp.totalXp = 1;
    const res = achievementEngine.evaluate(state.achievements, state, NOW);
    expect(achievementEngine.isUnlocked(res.state, "first_xp")).toBe(true);
    expect(achievementEngine.isUnlocked(res.state, "streak_30")).toBe(false);
    expect(achievementEngine.isUnlocked(state.achievements, "first_xp")).toBe(false);
  });
});
