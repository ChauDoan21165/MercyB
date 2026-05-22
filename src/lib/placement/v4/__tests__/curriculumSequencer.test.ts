import { describe, expect, it } from "vitest";
import type { CEFRAssessment } from "@/types/placement-v3";
import { generateCurriculumPlan, type CurriculumLearnerState } from "../curriculumSequencer";

const balancedAssessment: CEFRAssessment = {
  overallCefr: "B1",
  skillCefr: {
    grammar: "B1",
    vocabulary: "B1",
    pronunciation: "B1",
    listening: "B1",
    speaking: "B1",
    reading: "B1",
    writing: "B1",
  },
  gaps: [],
  l1InterferenceFlags: [],
};

function state(overrides: Partial<CurriculumLearnerState> = {}): CurriculumLearnerState {
  return {
    assessment: balancedAssessment,
    ...overrides,
  };
}

function allActivities(plan: ReturnType<typeof generateCurriculumPlan>) {
  return plan.days.flatMap((day) => day.activities);
}

describe("placement v4 curriculum sequencer", () => {
  it("prevents burnout by reducing daily load and suppressing frequent challenges", () => {
    const fresh = generateCurriculumPlan(state({ fatigue: { score: 0.1 } }), 7);
    const fatigued = generateCurriculumPlan(state({ fatigue: { score: 0.82, missedDaysLast14: 7 } }), 7);

    expect(fresh.days[0].activities.length).toBe(4);
    expect(fatigued.days[0].activities.length).toBe(2);
    expect(fatigued.days.every((day) => day.intensity === "light")).toBe(true);
    expect(allActivities(fatigued).filter((activity) => activity.kind === "challenge").length).toBeLessThanOrEqual(1);
  });

  it("avoids over-review loops by limiting review to the first daily slot", () => {
    const completedLessons = Array.from({ length: 8 }, (_, index) => ({
      lessonId: `completed:${index}`,
      completedDay: index % 2 === 0 ? 0 : -2,
      skill: "grammar",
    }));

    const plan = generateCurriculumPlan(state({ completedLessons, startDay: 1 }), 7);
    const reviewDays = plan.days.filter((day) => day.activities.some((activity) => activity.kind === "review"));

    expect(reviewDays.length).toBeGreaterThan(0);
    expect(reviewDays.every((day) => day.activities[0].kind === "review")).toBe(true);
    expect(reviewDays.every((day) => day.activities.filter((activity) => activity.kind === "review").length === 1)).toBe(true);
    expect(allActivities(plan).filter((activity) => activity.kind !== "review").length).toBeGreaterThan(0);
  });

  it("does not starve weak skills across longer plans", () => {
    const plan = generateCurriculumPlan(
      state({
        assessment: {
          ...balancedAssessment,
          skillCefr: { ...balancedAssessment.skillCefr, pronunciation: "A2", writing: "A2" },
          gaps: ["final consonants", "writing emails"],
          l1InterferenceFlags: [{ id: "final-consonants", severity: "high" }],
        },
        weakSkills: ["pronunciation", "writing"],
      }),
      28,
    );

    const activities = allActivities(plan);
    const pronunciationDays = new Set(activities.filter((activity) => activity.targetSkill === "pronunciation").map((activity) => activity.day));
    const writingDays = new Set(activities.filter((activity) => activity.targetSkill === "writing").map((activity) => activity.day));

    expect(pronunciationDays.size).toBeGreaterThanOrEqual(6);
    expect(writingDays.size).toBeGreaterThanOrEqual(6);
    expect(plan.diagnostics.weakSkills).toEqual(expect.arrayContaining(["pronunciation", "writing"]));
  });

  it("paces speaking practice so low confidence does not become speaking avoidance", () => {
    const plan = generateCurriculumPlan(
      state({
        speaking: { confidence: 0.18, avoidanceDays: 8, recentAttempts: 0 },
        skillProgress: { speaking: { mastery: 0.42, confidence: 0.18 } },
        weakSkills: ["speaking"],
      }),
      28,
    );

    const speakingDays = [...new Set(allActivities(plan).filter((activity) => activity.kind === "speaking").map((activity) => activity.day))];
    const gaps = speakingDays.slice(1).map((day, index) => day - speakingDays[index]);

    expect(speakingDays.length).toBeGreaterThanOrEqual(10);
    expect(Math.max(...gaps)).toBeLessThanOrEqual(2);
  });

  it("generates deterministic 7-day, 28-day, and 90-day plans", () => {
    const learner = state({
      assessment: {
        ...balancedAssessment,
        gaps: ["articles", "interview answers"],
        l1InterferenceFlags: [{ id: "missing-articles", severity: "medium" }],
      },
      recentLessonHistory: ["daily:alphabet-basics"],
      completedLessons: [{ lessonId: "daily:greetings", completedDay: -2, skill: "speaking", score: 0.7 }],
      weakSkills: ["grammar", "speaking"],
    });

    for (const length of [7, 28, 90] as const) {
      const first = generateCurriculumPlan(learner, length);
      const second = generateCurriculumPlan(learner, length);
      expect(second).toEqual(first);
      expect(first.days).toHaveLength(length);
    }
  });

  it("recalibrates progression and challenge levels when learner mastery improves", () => {
    const base = state({
      assessment: {
        ...balancedAssessment,
        skillCefr: { ...balancedAssessment.skillCefr, grammar: "A2" },
      },
      weakSkills: ["grammar"],
    });
    const improved = state({
      assessment: {
        ...balancedAssessment,
        overallCefr: "B2",
        skillCefr: { ...balancedAssessment.skillCefr, grammar: "B2" },
      },
      skillProgress: { grammar: { mastery: 0.82 } },
      weakSkills: ["grammar"],
    });

    const baseChallenges = allActivities(generateCurriculumPlan(base, 28)).filter((activity) => activity.kind === "challenge");
    const improvedChallenges = allActivities(generateCurriculumPlan(improved, 28)).filter((activity) => activity.kind === "challenge");

    expect(baseChallenges.some((activity) => ["A2", "B1"].includes(activity.cefrLevel))).toBe(true);
    expect(improvedChallenges.some((activity) => ["B2", "C1"].includes(activity.cefrLevel))).toBe(true);
  });
});
