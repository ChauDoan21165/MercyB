// src/languages/punjabi/__tests__/punjabiPracticalCheckpointSetA2.test.ts
//
// Structural guards for Punjabi A2 practical checkpoint set. This is Wave 26
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { practicalCheckpointSetA2 } from "@/languages/punjabi/practicalCheckpointSetA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "forms",
  "short_messages",
  "polite_problem_descriptions",
  "interaction_repair",
  "public_service_follow_up",
] as const;

const STYLES = ["final_stability", "boundary", "checklist", "regression"] as const;

describe("Punjabi A2 practical checkpoint set — batch shape", () => {
  it("ships compact checkpoints for all required scenarios", () => {
    expect(practicalCheckpointSetA2.length).toBeGreaterThanOrEqual(11);
    expect(practicalCheckpointSetA2.length).toBeLessThanOrEqual(14);

    const present = new Set(practicalCheckpointSetA2.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = practicalCheckpointSetA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of practicalCheckpointSetA2) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 practical checkpoint set — learner contract", () => {
  it("uses Gurmukhi checkpoint lines with romanization and bilingual meaning", () => {
    for (const item of practicalCheckpointSetA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.checkpoint_goal_vi)).toBe(true);
      expect(nonEmpty(item.checkpoint_goal_en)).toBe(true);
      expect(item.checkpoint_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.checkpoint_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final QA checks, explanations, traps, and stability checks", () => {
    for (const item of practicalCheckpointSetA2) {
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
      expect(nonEmpty(item.stability_check_vi)).toBe(true);
      expect(nonEmpty(item.stability_check_en)).toBe(true);
      expect(item.traps.length).toBeGreaterThanOrEqual(1);

      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
  });

  it("includes Shahmukhi awareness only and Canada-practical coverage", () => {
    for (const item of practicalCheckpointSetA2) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
    }

    const canadaItems = practicalCheckpointSetA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers final-stability, boundary, checklist, and regression styles", () => {
    const styles = new Set(practicalCheckpointSetA2.map((item) => item.style));
    expect(styles.has("final_stability")).toBe(true);
    expect(styles.has("boundary")).toBe(true);
    expect(styles.has("checklist")).toBe(true);
    expect(styles.has("regression")).toBe(true);
  });
});
