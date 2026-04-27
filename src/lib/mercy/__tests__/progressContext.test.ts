import { describe, expect, it } from "vitest";

import {
  formatProgressContextForPrompt,
  type ProgressContext,
} from "../progressContext";

function fullCtx(): ProgressContext {
  return {
    attemptsThisWeek: 12,
    averageScoreThisWeek: 74,
    scoreDelta: 8,
    mostImprovedPhoneme: {
      phoneme: "th",
      previousScore: 60,
      currentScore: 85,
      delta: 25,
    },
    weakestPhoneme: { phoneme: "r", averageScore: 55 },
    streak: 4,
    heatmapHighlight: null,
    builtAt: Date.now(),
  };
}

describe("formatProgressContextForPrompt", () => {
  it("returns empty string when ctx is null (no-branch concat)", () => {
    expect(formatProgressContextForPrompt(null)).toBe("");
  });

  it("includes the STUDENT_PROGRESS header so the LLM finds the block", () => {
    const text = formatProgressContextForPrompt(fullCtx());
    expect(text.startsWith("STUDENT_PROGRESS")).toBe(true);
  });

  it("includes attempts, score, delta, improved phoneme, weak phoneme, streak", () => {
    const text = formatProgressContextForPrompt(fullCtx());
    expect(text).toContain("Attempts this week: 12");
    expect(text).toContain("Average score this week: 74/100");
    expect(text).toContain("Score change vs last week: +8");
    expect(text).toContain("Most improved phoneme: /th/ went 60 → 85 (+25)");
    expect(text).toContain("Still working on: /r/ (currently 55/100)");
    expect(text).toContain("Current streak: 4 days");
  });

  it("formats negative score delta with leading minus (no double-sign)", () => {
    const text = formatProgressContextForPrompt({ ...fullCtx(), scoreDelta: -5 });
    expect(text).toContain("Score change vs last week: -5");
    expect(text).not.toContain("--5");
  });

  it("omits average score line when null", () => {
    const text = formatProgressContextForPrompt({
      ...fullCtx(),
      averageScoreThisWeek: null,
    });
    expect(text).not.toContain("Average score this week");
  });

  it("omits streak line when streak is 0", () => {
    const text = formatProgressContextForPrompt({ ...fullCtx(), streak: 0 });
    expect(text).not.toContain("Current streak");
  });

  it("omits improved phoneme line when no improvement data", () => {
    const text = formatProgressContextForPrompt({
      ...fullCtx(),
      mostImprovedPhoneme: null,
    });
    expect(text).not.toContain("Most improved phoneme");
  });

  it("omits weak phoneme line when no weakness data", () => {
    const text = formatProgressContextForPrompt({
      ...fullCtx(),
      weakestPhoneme: null,
    });
    expect(text).not.toContain("Still working on");
  });

  it("includes a heatmap highlight line when present", () => {
    const text = formatProgressContextForPrompt({
      ...fullCtx(),
      heatmapHighlight: {
        kind: "most_improved",
        phoneme: "th",
        averageScore: 78,
        delta: 12,
      },
    });
    expect(text).toContain("Heatmap (30-day improving): /th/ at 78/100 (delta +12)");
  });

  it("omits the heatmap line when null", () => {
    const text = formatProgressContextForPrompt({
      ...fullCtx(),
      heatmapHighlight: null,
    });
    expect(text).not.toContain("Heatmap (");
  });
});
