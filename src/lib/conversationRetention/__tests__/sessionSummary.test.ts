import { describe, it, expect } from "vitest";

import { buildSessionSummary } from "@/lib/conversationRetention/sessionSummary";

describe("buildSessionSummary — recap stats", () => {
  it("counts turns, errors caught, and distinct words practiced", () => {
    const s = buildSessionSummary({
      turnsCompleted: 12,
      errorsCaught: 3,
      wordsPracticed: ["order", "order", "menu", "bill"], // 3 distinct
    });
    expect(s.turnsCompleted).toBe(12);
    expect(s.errorsCaught).toBe(3);
    expect(s.wordsPracticedCount).toBe(3);
  });

  it("clamps negative / non-finite inputs to 0", () => {
    const s = buildSessionSummary({ turnsCompleted: -5, errorsCaught: NaN as unknown as number });
    expect(s.turnsCompleted).toBe(0);
    expect(s.errorsCaught).toBe(0);
  });

  it("headline affirms effort (errors framed as wins), never shames", () => {
    const s = buildSessionSummary({ turnsCompleted: 8, errorsCaught: 2 });
    expect(s.headline.en.toLowerCase()).toContain("caught");
    expect(s.headline.en.toLowerCase()).not.toMatch(/wrong|fail|bad/);
    expect(s.headline.vi).toContain("giỏi");
  });
});

describe("buildSessionSummary — tomorrow hook is SPECIFIC (never generic)", () => {
  it("prefers a pattern the learner is improving", () => {
    const s = buildSessionSummary({
      turnsCompleted: 10,
      errorsCaught: 1,
      patternsImproving: ["thì quá khứ -ed"],
      nextScenarioEn: "ordering at a café",
      topicLabelEn: "Food",
      streakCurrent: 4,
    });
    expect(s.tomorrowHookKind).toBe("pattern");
    expect(s.tomorrowHook.vi).toContain("thì quá khứ -ed");
    expect(s.tomorrowHook.en).toContain("thì quá khứ -ed");
  });

  it("falls to a queued next scenario when no pattern", () => {
    const s = buildSessionSummary({
      turnsCompleted: 10,
      errorsCaught: 0,
      nextScenarioEn: "returning a wrong order",
      topicLabelEn: "Food",
      streakCurrent: 4,
    });
    expect(s.tomorrowHookKind).toBe("next_scenario");
    expect(s.tomorrowHook.en).toContain("returning a wrong order");
  });

  it("falls to going deeper on today's topic when no pattern/scenario", () => {
    const s = buildSessionSummary({
      turnsCompleted: 7,
      errorsCaught: 0,
      topicLabelEn: "Phone calls",
      topicLabelVi: "Gọi điện thoại",
      streakCurrent: 4,
    });
    expect(s.tomorrowHookKind).toBe("topic_deeper");
    expect(s.tomorrowHook.vi).toContain("Gọi điện thoại");
  });

  it("uses streak as the last specific hook, naming the next day count", () => {
    const s = buildSessionSummary({ turnsCompleted: 7, errorsCaught: 0, streakCurrent: 4 });
    expect(s.tomorrowHookKind).toBe("streak_keep");
    expect(s.tomorrowHook.en).toContain("5-day"); // streak+1
  });

  it("even with no signals, the hook names a concrete first step (not generic)", () => {
    const s = buildSessionSummary({ turnsCompleted: 5, errorsCaught: 0 });
    expect(s.tomorrowHook.en.length).toBeGreaterThan(0);
    expect(s.tomorrowHook.vi.length).toBeGreaterThan(0);
    // concrete: it talks about starting the streak, not a bare "come back"
    expect(s.tomorrowHook.en.toLowerCase()).toContain("streak");
  });
});
