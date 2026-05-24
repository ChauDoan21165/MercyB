import { describe, expect, it } from "vitest";
import {
  planTodayLesson,
  type TodayLessonMemorySummary,
} from "@/lib/tutor/todayLessonPlanner";

function memory(overrides: Partial<NonNullable<TodayLessonMemorySummary>>): NonNullable<TodayLessonMemorySummary> {
  return {
    totalCorrections: 0,
    practicedCount: 0,
    strongestTopic: "",
    topicNeedingReview: "",
    lastPracticedTopic: "",
    suggestedNextFocus: "",
    nextRecommendedFocus: "",
    needsReview: [],
    strengths: [],
    commonMistakePatterns: [],
    confidenceTrend: "not-enough-data",
    ...overrides,
  };
}

describe("planTodayLesson", () => {
  it("returns a beginner starter lesson when no memory exists", () => {
    const plan = planTodayLesson(null);

    expect(plan.lessonTitle).toBe("Start with one clear daily sentence");
    expect(plan.targetSkill).toBe("starter sentence");
    expect(plan.suggestedMode).toBe("grammar");
    expect(plan.nextFocus).toBe("starter sentence");
    expect(plan.estimatedMinutes).toBeGreaterThan(0);
    expect(plan.steps).toEqual([
      "Write one simple sentence about your day.",
      "Fix one sentence with Mercy.",
      "Read the corrected sentence.",
      "Notice one English pattern.",
      "Save the next focus.",
    ]);
  });

  it("recommends the weak topic from safe local memory summary", () => {
    const plan = planTodayLesson(memory({
      totalCorrections: 6,
      practicedCount: 4,
      topicNeedingReview: "past tense",
      strongestTopic: "daily life",
      confidenceTrend: "steady",
    }));

    expect(plan.lessonTitle).toBe("Practice past tense in daily life");
    expect(plan.targetSkill).toBe("past tense");
    expect(plan.nextFocus).toBe("past tense");
    expect(plan.reason).toContain("4 practiced items");
    expect(plan.reason).toContain("daily life");
    expect(plan.steps).toEqual([
      "Fix one sentence.",
      "Review Mercy's correction or explanation.",
      "Retry the mistake once.",
      "Apply one pattern in a new example.",
      "Save the next focus.",
    ]);
  });

  it("uses grammar mode for grammar review topics", () => {
    const plan = planTodayLesson(memory({
      totalCorrections: 2,
      practicedCount: 1,
      topicNeedingReview: "preposition",
      confidenceTrend: "steady",
    }));

    expect(plan.suggestedMode).toBe("grammar");
  });

  it("uses journey mode when the next focus is conversation practice", () => {
    const plan = planTodayLesson(memory({
      totalCorrections: 4,
      practicedCount: 3,
      topicNeedingReview: "daily routine",
      strongestTopic: "introductions",
      confidenceTrend: "improving",
    }));

    expect(plan.suggestedMode).toBe("journey");
    expect(plan.steps[0]).toBe("Answer one short question.");
  });

  it("does not carry raw learner-like text into the lesson focus", () => {
    const plan = planTodayLesson(memory({
      totalCorrections: 1,
      practicedCount: 1,
      topicNeedingReview: "past tense user@example.com 123456789 I bought a private ticket yesterday",
      confidenceTrend: "needs-review",
    }));

    expect(plan.nextFocus).not.toContain("user@example.com");
    expect(plan.nextFocus).not.toContain("123456789");
    expect(plan.nextFocus.length).toBeLessThanOrEqual(48);
  });
});
