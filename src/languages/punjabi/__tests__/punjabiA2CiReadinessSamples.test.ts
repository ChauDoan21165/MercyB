// src/languages/punjabi/__tests__/punjabiA2CiReadinessSamples.test.ts
//
// Structural guards for Punjabi A2 CI-readiness samples. This is Wave 45 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2CiReadinessSamples } from "@/languages/punjabi/a2CiReadinessSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routines",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "forms",
  "short_messages",
  "service_flow",
  "polite_problem_descriptions",
  "interaction_repair",
] as const;

const STYLES = ["ci_readiness", "mr_readiness", "final_freeze", "pre_integration"] as const;

describe("Punjabi A2 CI-readiness samples - batch shape", () => {
  it("ships compact test-stable samples for all required scenarios", () => {
    expect(a2CiReadinessSamples.length).toBeGreaterThanOrEqual(12);
    expect(a2CiReadinessSamples.length).toBeLessThanOrEqual(14);

    const present = new Set(a2CiReadinessSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2CiReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2CiReadinessSamples) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 CI-readiness samples - learner contract", () => {
  it("uses Gurmukhi lines with romanization and bilingual meaning", () => {
    for (const item of a2CiReadinessSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.ci_goal_vi)).toBe(true);
      expect(nonEmpty(item.ci_goal_en)).toBe(true);
      expect(nonEmpty(item.stable_signal_vi)).toBe(true);
      expect(nonEmpty(item.stable_signal_en)).toBe(true);
      expect(item.lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes checks and common learner traps", () => {
    for (const item of a2CiReadinessSamples) {
      expect(item.checks.length).toBeGreaterThanOrEqual(2);
      for (const check of item.checks) {
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
    for (const item of a2CiReadinessSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2CiReadinessSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers CI-readiness, MR-readiness, final-freeze, and pre-integration styles", () => {
    const styles = new Set(a2CiReadinessSamples.map((item) => item.style));
    expect(styles.has("ci_readiness")).toBe(true);
    expect(styles.has("mr_readiness")).toBe(true);
    expect(styles.has("final_freeze")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
