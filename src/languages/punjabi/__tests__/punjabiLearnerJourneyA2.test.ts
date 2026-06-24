// src/languages/punjabi/__tests__/punjabiLearnerJourneyA2.test.ts
//
// Structural guards for Punjabi A2 learner journey. This is Wave 15 only, not
// A11 integration. These verify app-consumable learner content only; native
// review is deferred.

import { describe, expect, it } from "vitest";

import { learnerJourneyA2 } from "@/languages/punjabi/learnerJourneyA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_STAGES = [
  "daily_routines",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "repair_phrases",
  "polite_problem_descriptions",
] as const;

const MODES = ["learn", "practice", "handoff", "readiness"] as const;

describe("Punjabi A2 learner journey — batch shape", () => {
  it("ships a compact complete learner journey", () => {
    expect(learnerJourneyA2.length).toBeGreaterThanOrEqual(9);
    expect(learnerJourneyA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required journey stages", () => {
    const present = new Set(learnerJourneyA2.map((step) => step.stage));
    for (const stage of REQUIRED_STAGES) expect(present.has(stage)).toBe(true);
  });

  it("has unique ids and valid stages/modes", () => {
    const ids = learnerJourneyA2.map((step) => step.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const step of learnerJourneyA2) {
      expect(REQUIRED_STAGES.includes(step.stage)).toBe(true);
      expect(MODES.includes(step.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 learner journey — learner contract", () => {
  it("has bilingual goals, handoff, readiness, and routing fields", () => {
    for (const step of learnerJourneyA2) {
      expect(nonEmpty(step.title_vi)).toBe(true);
      expect(nonEmpty(step.title_en)).toBe(true);
      expect(nonEmpty(step.learner_goal_vi)).toBe(true);
      expect(nonEmpty(step.learner_goal_en)).toBe(true);
      expect(nonEmpty(step.handoff_vi)).toBe(true);
      expect(nonEmpty(step.handoff_en)).toBe(true);
      expect(nonEmpty(step.readiness_check_vi)).toBe(true);
      expect(nonEmpty(step.readiness_check_en)).toBe(true);
      expect(nonEmpty(step.next_if_ready_vi)).toBe(true);
      expect(nonEmpty(step.next_if_ready_en)).toBe(true);
      expect(nonEmpty(step.review_if_stuck_vi)).toBe(true);
      expect(nonEmpty(step.review_if_stuck_en)).toBe(true);
    }
  });

  it("uses Gurmukhi can-do models with romanization and bilingual explanations", () => {
    for (const step of learnerJourneyA2) {
      expect(step.can_do.length).toBeGreaterThanOrEqual(2);
      for (const model of step.can_do) {
        expect(hasGurmukhi(model.pa)).toBe(true);
        expect(nonEmpty(model.romanization)).toBe(true);
        expect(nonEmpty(model.vi)).toBe(true);
        expect(nonEmpty(model.en)).toBe(true);
        expect(nonEmpty(model.explanation_vi)).toBe(true);
        expect(nonEmpty(model.explanation_en)).toBe(true);
      }
    }
  });

  it("includes script awareness and common learner traps", () => {
    for (const step of learnerJourneyA2) {
      expect(nonEmpty(step.script_awareness_vi)).toBe(true);
      expect(nonEmpty(step.script_awareness_en)).toBe(true);
      expect(step.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of step.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
  });

  it("includes learner-journey/handoff/readiness style modes and Canada examples", () => {
    const presentModes = new Set(learnerJourneyA2.map((step) => step.mode));
    expect(presentModes.has("learn")).toBe(true);
    expect(presentModes.has("practice")).toBe(true);
    expect(presentModes.has("handoff")).toBe(true);
    expect(presentModes.has("readiness")).toBe(true);

    const canadaSteps = learnerJourneyA2.filter((step) => step.canada_practical_vi || step.canada_practical_en);
    expect(canadaSteps.length).toBeGreaterThanOrEqual(6);
    for (const step of canadaSteps) {
      expect(nonEmpty(step.canada_practical_vi)).toBe(true);
      expect(nonEmpty(step.canada_practical_en)).toBe(true);
    }
  });
});
