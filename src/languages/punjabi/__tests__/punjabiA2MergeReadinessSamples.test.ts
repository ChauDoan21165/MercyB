// src/languages/punjabi/__tests__/punjabiA2MergeReadinessSamples.test.ts
//
// Structural guards for Punjabi A2 merge-readiness samples. This is Wave 32
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2MergeReadinessSamples } from "@/languages/punjabi/a2MergeReadinessSamples";

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

const STYLES = ["merge_readiness", "final_regression", "pre_integration"] as const;

describe("Punjabi A2 merge-readiness samples - batch shape", () => {
  it("ships compact samples for all required scenarios", () => {
    expect(a2MergeReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(a2MergeReadinessSamples.length).toBeLessThanOrEqual(14);

    const present = new Set(a2MergeReadinessSamples.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2MergeReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2MergeReadinessSamples) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 merge-readiness samples - learner contract", () => {
  it("uses Gurmukhi sample and evidence lines with romanization and bilingual meaning", () => {
    for (const item of a2MergeReadinessSamples) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.sample_goal_vi)).toBe(true);
      expect(nonEmpty(item.sample_goal_en)).toBe(true);
      expect(nonEmpty(item.review_goal_vi)).toBe(true);
      expect(nonEmpty(item.review_goal_en)).toBe(true);
      expect(nonEmpty(item.merge_goal_vi)).toBe(true);
      expect(nonEmpty(item.merge_goal_en)).toBe(true);
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

  it("includes merge QA checks, explanations, traps, merge checks, and readiness checks", () => {
    for (const item of a2MergeReadinessSamples) {
      expect(item.merge_qa.length).toBeGreaterThanOrEqual(2);
      for (const qa of item.merge_qa) {
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
      expect(nonEmpty(item.merge_check_vi)).toBe(true);
      expect(nonEmpty(item.merge_check_en)).toBe(true);
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

  it("keeps Shahmukhi as awareness only and includes Canada-practical coverage", () => {
    for (const item of a2MergeReadinessSamples) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2MergeReadinessSamples.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers merge-readiness, final-regression, and pre-integration styles", () => {
    const styles = new Set(a2MergeReadinessSamples.map((item) => item.style));
    expect(styles.has("merge_readiness")).toBe(true);
    expect(styles.has("final_regression")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
