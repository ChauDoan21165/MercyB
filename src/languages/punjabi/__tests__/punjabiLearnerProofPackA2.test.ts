// src/languages/punjabi/__tests__/punjabiLearnerProofPackA2.test.ts
//
// Structural guards for Punjabi A2 learner proof pack. This is Wave 22 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { learnerProofPackA2 } from "@/languages/punjabi/learnerProofPackA2";

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
  "short_message_comprehension",
  "polite_repair_phrases",
] as const;

const STYLES = ["proof_pack", "final_owner_review", "final_qa"] as const;

describe("Punjabi A2 learner proof pack — batch shape", () => {
  it("ships compact proof items for all required scenarios", () => {
    expect(learnerProofPackA2.length).toBeGreaterThanOrEqual(9);
    expect(learnerProofPackA2.length).toBeLessThanOrEqual(14);

    const present = new Set(learnerProofPackA2.map((item) => item.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = learnerProofPackA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const item of learnerProofPackA2) {
      expect(REQUIRED_SCENARIOS.includes(item.scenario)).toBe(true);
      expect(STYLES.includes(item.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 learner proof pack — learner contract", () => {
  it("uses Gurmukhi evidence lines with romanization and bilingual meaning", () => {
    for (const item of learnerProofPackA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.owner_review_vi)).toBe(true);
      expect(nonEmpty(item.owner_review_en)).toBe(true);
      expect(item.learner_can_prove_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.learner_can_prove_en.length).toBeGreaterThanOrEqual(2);
      expect(item.evidence_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of item.evidence_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final QA and owner acceptance checks", () => {
    for (const item of learnerProofPackA2) {
      expect(item.final_qa.length).toBeGreaterThanOrEqual(2);
      for (const qa of item.final_qa) {
        expect(nonEmpty(qa.q_vi)).toBe(true);
        expect(nonEmpty(qa.q_en)).toBe(true);
        expect(hasGurmukhi(qa.answer_pa)).toBe(true);
        expect(nonEmpty(qa.answer_romanization)).toBe(true);
        expect(nonEmpty(qa.answer_vi)).toBe(true);
        expect(nonEmpty(qa.answer_en)).toBe(true);
      }
      expect(nonEmpty(item.owner_acceptance_vi)).toBe(true);
      expect(nonEmpty(item.owner_acceptance_en)).toBe(true);
      expect(nonEmpty(item.explanation_vi)).toBe(true);
      expect(nonEmpty(item.explanation_en)).toBe(true);
    }
  });

  it("includes Shahmukhi awareness only, learner traps, and Canada-practical coverage", () => {
    for (const item of learnerProofPackA2) {
      expect(item.script_awareness_vi).toContain("Shahmukhi");
      expect(item.script_awareness_en).toContain("Shahmukhi");
      expect(item.script_awareness_en.toLowerCase()).toContain("not as a separate course");
      expect(item.traps.length).toBeGreaterThanOrEqual(1);

      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.repair_pa)).toBe(true);
        expect(nonEmpty(trap.repair_romanization)).toBe(true);
      }
    }

    const canadaItems = learnerProofPackA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });

  it("covers proof-pack, final-owner-review, and final-QA styles", () => {
    const styles = new Set(learnerProofPackA2.map((item) => item.style));
    expect(styles.has("proof_pack")).toBe(true);
    expect(styles.has("final_owner_review")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });
});
