// src/languages/punjabi/__tests__/punjabiA2FinalRegressionSamples.test.ts
//
// Structural guards for Punjabi A2 final regression samples. This is Wave 31
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2FinalRegressionSamples } from "@/languages/punjabi/a2FinalRegressionSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routine",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "forms",
  "short_messages",
  "polite_problem_description",
  "interaction_repair",
] as const;

const STYLES = ["final_regression", "sanity", "pre_integration"] as const;

describe("Punjabi A2 final regression samples — batch shape", () => {
  it("ships compact samples for all required scenarios", () => {
    expect(a2FinalRegressionSamples.length).toBeGreaterThanOrEqual(11);
    expect(a2FinalRegressionSamples.length).toBeLessThanOrEqual(14);

    const present = new Set(a2FinalRegressionSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2FinalRegressionSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2FinalRegressionSamples) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 final regression samples — learner contract", () => {
  it("uses Gurmukhi sample lines with romanization and bilingual meaning", () => {
    for (const item of a2FinalRegressionSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.sample_goal_vi)).toBe(true);
      expect(nonEmpty(item.sample_goal_en)).toBe(true);
      expect(nonEmpty(item.review_goal_vi)).toBe(true);
      expect(nonEmpty(item.review_goal_en)).toBe(true);
      expect(nonEmpty(item.regression_goal_vi)).toBe(true);
      expect(nonEmpty(item.regression_goal_en)).toBe(true);
      expect(item.sample_lines.length).toBeGreaterThanOrEqual(2);
      expect(item.evidence_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.sample_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }

      for (const line of item.evidence_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final QA checks, explanations, traps, sanity checks, and readiness checks", () => {
    for (const item of a2FinalRegressionSamples) {
      expect(item.final_qa.length).toBeGreaterThanOrEqual(2);
      for (const qa of item.final_qa) {
        expect(nonEmpty(qa.q_vi)).toBe(true);
        expect(nonEmpty(qa.q_en)).toBe(true);
        expect(hasGurmukhi(qa.answer_pa)).toBe(true);
        expect(nonEmpty(qa.answer_romanization)).toBe(true);
        expect(nonEmpty(qa.answer_vi)).toBe(true);
        expect(nonEmpty(qa.answer_en)).toBe(true);
      }
      expect(nonEmpty(item.explanation_vi)).toBe(true);
      expect(nonEmpty(item.explanation_en)).toBe(true);
      expect(nonEmpty(item.pass_signal_vi)).toBe(true);
      expect(nonEmpty(item.pass_signal_en)).toBe(true);
      expect(nonEmpty(item.sanity_check_vi)).toBe(true);
      expect(nonEmpty(item.sanity_check_en)).toBe(true);
      expect(nonEmpty(item.readiness_check_vi)).toBe(true);
      expect(nonEmpty(item.readiness_check_en)).toBe(true);
      expect(item.traps.length).toBeGreaterThanOrEqual(1);

      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.fix_pa)).toBe(true);
        expect(nonEmpty(trap.fix_romanization)).toBe(true);
      }
    }
  });

  it("includes Shahmukhi awareness only and Canada-practical coverage", () => {
    for (const item of a2FinalRegressionSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2FinalRegressionSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers final-regression, sanity, and pre-integration styles", () => {
    const styles = new Set(a2FinalRegressionSamples.map((item) => item.style));
    expect(styles.has("final_regression")).toBe(true);
    expect(styles.has("sanity")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
