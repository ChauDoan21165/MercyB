// src/languages/punjabi/__tests__/punjabiRetentionBoostersA2.test.ts
//
// Structural guards for Punjabi A2 retention boosters. This is Wave 23 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { retentionBoostersA2 } from "@/languages/punjabi/retentionBoostersA2";

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
  "short_messages",
  "polite_repair_phrases",
  "service_counter_follow_up",
] as const;

const STYLES = ["retention_booster", "stress_test", "final_risk", "final_qa"] as const;

describe("Punjabi A2 retention boosters — batch shape", () => {
  it("ships compact boosters for all required scenarios", () => {
    expect(retentionBoostersA2.length).toBeGreaterThanOrEqual(10);
    expect(retentionBoostersA2.length).toBeLessThanOrEqual(14);

    const present = new Set(retentionBoostersA2.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = retentionBoostersA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of retentionBoostersA2) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 retention boosters — learner contract", () => {
  it("uses Gurmukhi clue lines with romanization and bilingual meaning", () => {
    for (const item of retentionBoostersA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.retrieval_practice_vi)).toBe(true);
      expect(nonEmpty(item.retrieval_practice_en)).toBe(true);
      expect(item.clue_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.clue_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final QA checks, explanations, traps, and owner checks", () => {
    for (const item of retentionBoostersA2) {
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
      expect(nonEmpty(item.owner_check_vi)).toBe(true);
      expect(nonEmpty(item.owner_check_en)).toBe(true);
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
    for (const item of retentionBoostersA2) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = retentionBoostersA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers retention-booster, stress-test, final-risk, and final-QA styles", () => {
    const styles = new Set(retentionBoostersA2.map((item) => item.style));
    expect(styles.has("retention_booster")).toBe(true);
    expect(styles.has("stress_test")).toBe(true);
    expect(styles.has("final_risk")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });
});
