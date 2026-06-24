// src/languages/punjabi/__tests__/punjabiA2MrReadinessEvidence.test.ts
//
// Structural guards for Punjabi A2 MR-readiness evidence. This is Wave 44
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { a2MrReadinessEvidence } from "@/languages/punjabi/a2MrReadinessEvidence";

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
  "polite_problem_descriptions",
  "interaction_repair",
] as const;

const STYLES = ["mr_readiness", "final_freeze", "final_lock", "pre_integration"] as const;

describe("Punjabi A2 MR-readiness evidence - batch shape", () => {
  it("ships compact evidence for all required stability scenarios", () => {
    expect(a2MrReadinessEvidence.length).toBeGreaterThanOrEqual(12);
    expect(a2MrReadinessEvidence.length).toBeLessThanOrEqual(14);

    const present = new Set(a2MrReadinessEvidence.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = a2MrReadinessEvidence.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of a2MrReadinessEvidence) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 MR-readiness evidence - learner contract", () => {
  it("uses Gurmukhi lines with romanization and bilingual meaning", () => {
    for (const item of a2MrReadinessEvidence) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.evidence_goal_vi)).toBe(true);
      expect(nonEmpty(item.evidence_goal_en)).toBe(true);
      expect(nonEmpty(item.mr_ready_signal_vi)).toBe(true);
      expect(nonEmpty(item.mr_ready_signal_en)).toBe(true);
      expect(nonEmpty(item.return_signal_vi)).toBe(true);
      expect(nonEmpty(item.return_signal_en)).toBe(true);
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
    for (const item of a2MrReadinessEvidence) {
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
    for (const item of a2MrReadinessEvidence) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = a2MrReadinessEvidence.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(10);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers MR-readiness, final-freeze, final-lock, and pre-integration styles", () => {
    const styles = new Set(a2MrReadinessEvidence.map((item) => item.style));
    expect(styles.has("mr_readiness")).toBe(true);
    expect(styles.has("final_freeze")).toBe(true);
    expect(styles.has("final_lock")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });
});
