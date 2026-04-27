import { describe, expect, it } from "vitest";

import {
  generateInsights,
  perPhonemeStats,
} from "../heatmapInsights";
import type { HeatmapData } from "../phonemeHeatmap";

// Build a heatmap fixture programmatically. We bypass the aggregator
// here to control the exact (phoneme, day, score, count) shape so each
// insight kind can be triggered deterministically.
function makeHeatmap(args: {
  daysBack: number;
  cells: Array<{ phoneme: string; dayIndex: number; averageScore: number; attemptCount: number }>;
}): HeatmapData {
  const days: string[] = [];
  for (let i = 0; i < args.daysBack; i += 1) {
    const d = new Date(Date.UTC(2026, 3, 27, 0, 0, 0, 0));
    d.setUTCDate(d.getUTCDate() - (args.daysBack - 1 - i));
    days.push(d.toISOString().slice(0, 10));
  }
  const phonemes = Array.from(new Set(args.cells.map((c) => c.phoneme))).sort();
  const cells = args.cells.map((c) => ({
    phoneme: c.phoneme,
    day: days[c.dayIndex],
    averageScore: c.averageScore,
    attemptCount: c.attemptCount,
  }));
  return {
    phonemes,
    days,
    cells,
    totalAttempts: cells.reduce((s, c) => s + c.attemptCount, 0),
    builtAt: Date.now(),
    daysBack: args.daysBack,
  };
}

// ── perPhonemeStats: half-vs-half delta math ─────────────────────────────

describe("perPhonemeStats", () => {
  it("computes window average weighted by attempt count", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        // /th/: day 0 → 60 (count 5), day 3 → 80 (count 5). Equal weight → avg 70.
        { phoneme: "th", dayIndex: 0, averageScore: 60, attemptCount: 5 },
        { phoneme: "th", dayIndex: 3, averageScore: 80, attemptCount: 5 },
      ],
    });
    const stats = perPhonemeStats(data);
    const th = stats.find((s) => s.phoneme === "th")!;
    expect(th.averageScore).toBe(70);
    expect(th.attemptCount).toBe(10);
  });

  it("computes a positive delta when the second half outperforms the first", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "th", dayIndex: 0, averageScore: 60, attemptCount: 4 },
        { phoneme: "th", dayIndex: 1, averageScore: 60, attemptCount: 4 },
        { phoneme: "th", dayIndex: 2, averageScore: 80, attemptCount: 4 },
        { phoneme: "th", dayIndex: 3, averageScore: 80, attemptCount: 4 },
      ],
    });
    const stats = perPhonemeStats(data);
    const th = stats.find((s) => s.phoneme === "th")!;
    expect(th.delta).toBe(20);
    expect(th.firstHalfMean).toBe(60);
    expect(th.secondHalfMean).toBe(80);
  });

  it("returns null delta when one half has no samples", () => {
    const data = makeHeatmap({
      daysBack: 4,
      // Only second-half data
      cells: [
        { phoneme: "th", dayIndex: 2, averageScore: 80, attemptCount: 4 },
        { phoneme: "th", dayIndex: 3, averageScore: 80, attemptCount: 4 },
      ],
    });
    const stats = perPhonemeStats(data);
    expect(stats[0].delta).toBeNull();
  });
});

// ── generateInsights: each kind in isolation ─────────────────────────────

describe("generateInsights — most_improved", () => {
  it("fires when a phoneme's second-half mean clears the +5 floor", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "th", dayIndex: 0, averageScore: 55, attemptCount: 5 },
        { phoneme: "th", dayIndex: 1, averageScore: 55, attemptCount: 5 },
        { phoneme: "th", dayIndex: 2, averageScore: 80, attemptCount: 5 },
        { phoneme: "th", dayIndex: 3, averageScore: 80, attemptCount: 5 },
      ],
    });
    const insights = generateInsights(data);
    const improved = insights.find((i) => i.kind === "most_improved");
    expect(improved).toBeDefined();
    expect(improved?.phoneme).toBe("th");
    expect(improved?.copy_vi).toContain("/th/");
    expect(improved?.copy_en).toContain("/th/");
  });

  it("does not fire when the delta is below the floor", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "th", dayIndex: 0, averageScore: 70, attemptCount: 5 },
        { phoneme: "th", dayIndex: 3, averageScore: 73, attemptCount: 5 },
      ],
    });
    const insights = generateInsights(data);
    expect(insights.find((i) => i.kind === "most_improved")).toBeUndefined();
  });
});

describe("generateInsights — plateau", () => {
  it("fires when a phoneme has many attempts but a near-zero delta", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        // /v/ plateau at 70, 8 attempts each half
        { phoneme: "v", dayIndex: 0, averageScore: 70, attemptCount: 4 },
        { phoneme: "v", dayIndex: 1, averageScore: 71, attemptCount: 4 },
        { phoneme: "v", dayIndex: 2, averageScore: 70, attemptCount: 4 },
        { phoneme: "v", dayIndex: 3, averageScore: 71, attemptCount: 4 },
      ],
    });
    const insights = generateInsights(data);
    const plateau = insights.find((i) => i.kind === "plateau");
    expect(plateau?.phoneme).toBe("v");
  });

  it("does not flag plateau for a phoneme with too few attempts", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        // 4 attempts total — below the 6-attempt floor
        { phoneme: "v", dayIndex: 0, averageScore: 70, attemptCount: 2 },
        { phoneme: "v", dayIndex: 3, averageScore: 70, attemptCount: 2 },
      ],
    });
    const insights = generateInsights(data);
    expect(insights.find((i) => i.kind === "plateau")).toBeUndefined();
  });
});

describe("generateInsights — needs_work", () => {
  it("flags the lowest-scoring phoneme in the window", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "th", dayIndex: 0, averageScore: 30, attemptCount: 8 },
        { phoneme: "th", dayIndex: 3, averageScore: 30, attemptCount: 8 },
        { phoneme: "iy", dayIndex: 0, averageScore: 90, attemptCount: 6 },
        { phoneme: "iy", dayIndex: 3, averageScore: 90, attemptCount: 6 },
      ],
    });
    const insights = generateInsights(data);
    const needs = insights.find((i) => i.kind === "needs_work");
    expect(needs?.phoneme).toBe("th");
    expect(needs?.averageScore).toBeLessThan(60);
  });
});

describe("generateInsights — doing_well", () => {
  it("flags the highest scorer when ≥ 80", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "iy", dayIndex: 0, averageScore: 90, attemptCount: 6 },
        { phoneme: "iy", dayIndex: 3, averageScore: 92, attemptCount: 6 },
        { phoneme: "r", dayIndex: 0, averageScore: 60, attemptCount: 6 },
      ],
    });
    const insights = generateInsights(data);
    const wins = insights.find((i) => i.kind === "doing_well");
    expect(wins?.phoneme).toBe("iy");
  });

  it("does not fire when no phoneme clears 80", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "iy", dayIndex: 0, averageScore: 70, attemptCount: 6 },
        { phoneme: "iy", dayIndex: 3, averageScore: 75, attemptCount: 6 },
      ],
    });
    const insights = generateInsights(data);
    expect(insights.find((i) => i.kind === "doing_well")).toBeUndefined();
  });
});

describe("generateInsights — null + empty data", () => {
  it("returns [] when input is null", () => {
    expect(generateInsights(null)).toEqual([]);
  });

  it("returns [] when there are no cells", () => {
    const data = makeHeatmap({ daysBack: 30, cells: [] });
    expect(generateInsights(data)).toEqual([]);
  });
});

describe("generateInsights — bilingual + actionable", () => {
  it("every emitted insight has VI + EN copy and an action target", () => {
    const data = makeHeatmap({
      daysBack: 4,
      cells: [
        { phoneme: "th", dayIndex: 0, averageScore: 55, attemptCount: 5 },
        { phoneme: "th", dayIndex: 3, averageScore: 80, attemptCount: 5 },
        { phoneme: "iy", dayIndex: 0, averageScore: 90, attemptCount: 5 },
        { phoneme: "iy", dayIndex: 3, averageScore: 92, attemptCount: 5 },
      ],
    });
    const insights = generateInsights(data);
    expect(insights.length).toBeGreaterThan(0);
    for (const ins of insights) {
      expect(ins.copy_vi.length).toBeGreaterThan(0);
      expect(ins.copy_en.length).toBeGreaterThan(0);
      expect(ins.action_target.startsWith("/")).toBe(true);
    }
  });
});
