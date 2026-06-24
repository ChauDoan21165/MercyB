// src/languages/punjabi/__tests__/punjabiRetentionReviewA2.test.ts
//
// Structural guards for Punjabi A2 retention review. This is Wave 24 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { retentionReviewA2 } from "@/languages/punjabi/retentionReviewA2";

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
  "forms",
  "polite_repair_phrases",
  "service_counter_follow_up",
] as const;

const STYLES = ["final_hardening", "export_readiness", "review", "regression"] as const;

describe("Punjabi A2 retention review — batch shape", () => {
  it("ships compact review items for all required scenarios", () => {
    expect(retentionReviewA2.length).toBeGreaterThanOrEqual(11);
    expect(retentionReviewA2.length).toBeLessThanOrEqual(14);

    const present = new Set(retentionReviewA2.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = retentionReviewA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of retentionReviewA2) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 retention review — learner contract", () => {
  it("uses Gurmukhi evidence lines with romanization and bilingual meaning", () => {
    for (const item of retentionReviewA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.review_goal_vi)).toBe(true);
      expect(nonEmpty(item.review_goal_en)).toBe(true);
      expect(item.evidence_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.evidence_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final QA checks, explanations, traps, and export checks", () => {
    for (const item of retentionReviewA2) {
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
      expect(nonEmpty(item.export_check_vi)).toBe(true);
      expect(nonEmpty(item.export_check_en)).toBe(true);
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
    for (const item of retentionReviewA2) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = retentionReviewA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers final-hardening, export-readiness, review, and regression styles", () => {
    const styles = new Set(retentionReviewA2.map((item) => item.style));
    expect(styles.has("final_hardening")).toBe(true);
    expect(styles.has("export_readiness")).toBe(true);
    expect(styles.has("review")).toBe(true);
    expect(styles.has("regression")).toBe(true);
  });
});
