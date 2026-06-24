// src/languages/punjabi/__tests__/punjabiA2FinalValidationSet.test.ts
//
// Structural guards for Punjabi A2 final validation set. This is Wave 35 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2FinalValidationSet } from "@/languages/punjabi/a2FinalValidationSet";

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
  "service_flow",
  "interaction_repair",
] as const;

const STYLES = ["final_validation", "cross_check", "pre_integration"] as const;

describe("Punjabi A2 final validation set - batch shape", () => {
  it("ships compact validation items for all required scenarios", () => {
    expect(a2FinalValidationSet.length).toBeGreaterThanOrEqual(11);
    expect(a2FinalValidationSet.length).toBeLessThanOrEqual(13);

    const present = new Set(a2FinalValidationSet.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2FinalValidationSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2FinalValidationSet) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 final validation set - learner contract", () => {
  it("uses Gurmukhi scenario lines with romanization and bilingual meaning", () => {
    for (const item of a2FinalValidationSet) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.validation_goal_vi)).toBe(true);
      expect(nonEmpty(item.validation_goal_en)).toBe(true);
      expect(nonEmpty(item.coherence_check_vi)).toBe(true);
      expect(nonEmpty(item.coherence_check_en)).toBe(true);
      expect(item.scenario_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.scenario_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final checks and common learner traps", () => {
    for (const item of a2FinalValidationSet) {
      expect(item.final_checks.length).toBeGreaterThanOrEqual(2);
      for (const check of item.final_checks) {
        expect(nonEmpty(check.prompt_vi)).toBe(true);
        expect(nonEmpty(check.prompt_en)).toBe(true);
        expect(hasGurmukhi(check.expected_pa)).toBe(true);
        expect(nonEmpty(check.expected_romanization)).toBe(true);
        expect(nonEmpty(check.expected_vi)).toBe(true);
        expect(nonEmpty(check.expected_en)).toBe(true);
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
    for (const item of a2FinalValidationSet) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2FinalValidationSet.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(9);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers final-validation, cross-check, and pre-integration styles", () => {
    const styles = new Set(a2FinalValidationSet.map((item) => item.style));
    expect(styles.has("final_validation")).toBe(true);
    expect(styles.has("cross_check")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
