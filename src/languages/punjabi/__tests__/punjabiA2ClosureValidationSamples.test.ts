// src/languages/punjabi/__tests__/punjabiA2ClosureValidationSamples.test.ts
//
// Structural guards for Punjabi A2 closure-validation samples. This is Wave 36
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2ClosureValidationSamples } from "@/languages/punjabi/a2ClosureValidationSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "forms",
  "short_messages",
  "workplace_small_talk",
  "polite_problem_descriptions",
  "interaction_repair",
] as const;

const STYLES = ["closure_validation", "final_cross_check", "pre_integration"] as const;

describe("Punjabi A2 closure-validation samples - batch shape", () => {
  it("ships compact samples for all required practical-flow scenarios", () => {
    expect(a2ClosureValidationSamples.length).toBeGreaterThanOrEqual(10);
    expect(a2ClosureValidationSamples.length).toBeLessThanOrEqual(12);

    const present = new Set(a2ClosureValidationSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2ClosureValidationSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2ClosureValidationSamples) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 closure-validation samples - learner contract", () => {
  it("uses Gurmukhi lines with romanization and bilingual meaning", () => {
    for (const item of a2ClosureValidationSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.closure_goal_vi)).toBe(true);
      expect(nonEmpty(item.closure_goal_en)).toBe(true);
      expect(nonEmpty(item.flow_check_vi)).toBe(true);
      expect(nonEmpty(item.flow_check_en)).toBe(true);
      expect(item.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes validation checks and common learner traps", () => {
    for (const item of a2ClosureValidationSamples) {
      expect(item.validation_checks.length).toBeGreaterThanOrEqual(2);
      for (const check of item.validation_checks) {
        expect(nonEmpty(check.q_vi)).toBe(true);
        expect(nonEmpty(check.q_en)).toBe(true);
        expect(hasGurmukhi(check.answer_pa)).toBe(true);
        expect(nonEmpty(check.answer_romanization)).toBe(true);
        expect(nonEmpty(check.answer_vi)).toBe(true);
        expect(nonEmpty(check.answer_en)).toBe(true);
      }

      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.fix_pa)).toBe(true);
        expect(nonEmpty(trap.fix_romanization)).toBe(true);
      }
    }
  });

  it("keeps Shahmukhi as awareness only and includes Canada-practical coverage", () => {
    for (const item of a2ClosureValidationSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2ClosureValidationSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers closure-validation, final-cross-check, and pre-integration styles", () => {
    const styles = new Set(a2ClosureValidationSamples.map((item) => item.style));
    expect(styles.has("closure_validation")).toBe(true);
    expect(styles.has("final_cross_check")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
