import { describe, expect, it } from "vitest";
import {
  exportProgressionTrace,
  simulateProgression,
  type PlacementV3ProgressionInput,
} from "../progressionSimulator";
// Direct relative import — @/types/placement-v3 is intercepted by an ambient
// declare module in v3/placement-v3-types.d.ts that only exposes the legacy v3
// surface. Use the same path as progressionSimulator.ts itself.
import type { CEFRLevel, PlacementV3PerSkillProfile } from "../../../../types/placement-v3";

function placement(
  level: CEFRLevel,
  perSkill: PlacementV3PerSkillProfile = {},
): PlacementV3ProgressionInput {
  return {
    cefr_overall: level,
    cefr_overall_confidence: 0.86,
    cefr_per_skill: perSkill,
    l1_interference_flags: [
      {
        patternId: "vi-final-consonant-clusters",
        severity: "medium",
        evidence: "pronunciation and speaking transfer risk",
      },
    ],
  };
}

describe("Placement V4 progression simulator", () => {
  it("projects A1 to A2 progression across a sustained 180-day plan", () => {
    const result = simulateProgression(placement("A1"), {
      timelineDays: [30, 90, 180],
      weeklyStudyDays: 6,
      minutesPerStudyDay: 75,
      lessonsPerStudyDay: 2,
      lessonCompletionVariance: [1, 0.95, 0.9, 1],
      dropoutVariance: [0, 0.05, 0.1, 0],
      spacedReviewRate: 0.82,
      speakingPracticeShare: 0.34,
      seedLabel: "a1-to-a2",
    });

    expect(result.final.overallCefr).toBe("A2");
    expect(result.final.completedLessons).toBeGreaterThan(250);
    expect(result.final.subskills.reading.score).toBeGreaterThan(
      result.final.subskills.speaking.score,
    );
    expect(result.trace.some((event) => event.type === "milestone")).toBe(true);
  });

  it("projects A2 to B1 when completion, review, and study volume are strong", () => {
    const result = simulateProgression(placement("A2"), {
      timelineDays: [90, 180],
      weeklyStudyDays: 6,
      minutesPerStudyDay: 90,
      lessonsPerStudyDay: 2.4,
      lessonCompletionVariance: [1, 0.98, 0.94, 1, 0.96],
      dropoutVariance: [0, 0.04, 0.08, 0.02],
      spacedReviewRate: 0.9,
      speakingPracticeShare: 0.42,
      seedLabel: "a2-to-b1",
    });

    expect(result.final.overallCefr).toBe("B1");
    expect(result.final.subskills.reading.cefr).toBe("B1");
    expect(result.final.subskills.pronunciation.score).toBeLessThan(
      result.final.subskills.reading.score,
    );
  });

  it("keeps plateau cases below advancement when study volume and completion are weak", () => {
    const result = simulateProgression(placement("A2"), {
      timelineDays: [90, 180],
      weeklyStudyDays: 2,
      minutesPerStudyDay: 20,
      lessonsPerStudyDay: 0.6,
      lessonCompletionVariance: [0.35, 0.25, 0.4, 0.2],
      dropoutVariance: [0.35, 0.45, 0.5, 0.3],
      spacedReviewRate: 0.12,
      speakingPracticeShare: 0.08,
      seedLabel: "plateau",
    });

    expect(result.final.overallCefr).toBe("A2");
    expect(result.final.overallScore).toBeLessThan(1.45);
    expect(result.trace.some((event) => event.type === "plateau")).toBe(true);
  });

  it("models regression when dropout pressure dominates the timeline", () => {
    const result = simulateProgression(placement("B1"), {
      timelineDays: [30, 90, 180],
      weeklyStudyDays: 1,
      minutesPerStudyDay: 10,
      lessonsPerStudyDay: 0.2,
      lessonCompletionVariance: [0, 0.05, 0.1],
      dropoutVariance: [0.84, 0.9, 0.78, 0.88],
      spacedReviewRate: 0,
      speakingPracticeShare: 0,
      seedLabel: "regression",
    });

    expect(result.final.overallScore).toBeLessThan(result.start.overallScore);
    expect(result.final.subskills.speaking.regression).toBeGreaterThan(
      result.final.subskills.reading.regression,
    );
    expect(result.trace.some((event) => event.type === "dropout")).toBe(true);
  });

  it("keeps inconsistent study behavior replayable and visibly different from steady study", () => {
    const inconsistent = simulateProgression(placement("A2"), {
      timelineDays: [30, 90, 180],
      weeklyStudyDays: 5,
      minutesPerStudyDay: 45,
      lessonsPerStudyDay: 1.4,
      lessonCompletionVariance: [1, 0.15, 0.85, 0.05, 0.65],
      dropoutVariance: [0, 0.78, 0.2, 0.82, 0.1],
      spacedReviewRate: 0.48,
      speakingPracticeShare: 0.2,
      seedLabel: "inconsistent",
    });
    const replay = simulateProgression(placement("A2"), {
      timelineDays: [30, 90, 180],
      weeklyStudyDays: 5,
      minutesPerStudyDay: 45,
      lessonsPerStudyDay: 1.4,
      lessonCompletionVariance: [1, 0.15, 0.85, 0.05, 0.65],
      dropoutVariance: [0, 0.78, 0.2, 0.82, 0.1],
      spacedReviewRate: 0.48,
      speakingPracticeShare: 0.2,
      seedLabel: "inconsistent",
    });
    const steady = simulateProgression(placement("A2"), {
      timelineDays: [30, 90, 180],
      weeklyStudyDays: 5,
      minutesPerStudyDay: 45,
      lessonsPerStudyDay: 1.4,
      lessonCompletionVariance: [0.85],
      dropoutVariance: [0.1],
      spacedReviewRate: 0.48,
      speakingPracticeShare: 0.2,
      seedLabel: "steady",
    });

    expect(exportProgressionTrace(inconsistent)).toBe(exportProgressionTrace(replay));
    expect(inconsistent.inputHash).toBe(replay.inputHash);
    expect(inconsistent.final.completedLessons).toBeLessThan(steady.final.completedLessons);
    expect(inconsistent.trace.some((event) => event.type === "dropout")).toBe(true);
  });
});
