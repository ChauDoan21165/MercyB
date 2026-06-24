// src/languages/punjabi/__tests__/punjabiGoldenSamplesA2.test.ts
//
// Structural guards for Punjabi A2 golden samples. This is Wave 18 only, not
// A11 integration. These verify app-consumable learner content only; native
// review is deferred.

import { describe, expect, it } from "vitest";

import { goldenSamplesA2 } from "@/languages/punjabi/goldenSamplesA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routine",
  "appointment",
  "housing",
  "transport",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_explanation",
  "interaction_repair",
] as const;

const MODES = ["golden_sample", "final_qa", "integration_readiness"] as const;

describe("Punjabi A2 golden samples — batch shape", () => {
  it("ships a compact useful golden-sample pack", () => {
    expect(goldenSamplesA2.length).toBeGreaterThanOrEqual(9);
    expect(goldenSamplesA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required golden sample scenarios", () => {
    const present = new Set(goldenSamplesA2.map((sample) => sample.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/modes", () => {
    const ids = goldenSamplesA2.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const sample of goldenSamplesA2) {
      expect(REQUIRED_SCENARIOS.includes(sample.scenario)).toBe(true);
      expect(MODES.includes(sample.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 golden samples — learner contract", () => {
  it("has bilingual task, rationale, readiness, and script awareness", () => {
    for (const sample of goldenSamplesA2) {
      expect(nonEmpty(sample.title_vi)).toBe(true);
      expect(nonEmpty(sample.title_en)).toBe(true);
      expect(nonEmpty(sample.task_vi)).toBe(true);
      expect(nonEmpty(sample.task_en)).toBe(true);
      expect(nonEmpty(sample.why_it_works_vi)).toBe(true);
      expect(nonEmpty(sample.why_it_works_en)).toBe(true);
      expect(nonEmpty(sample.readiness_next_vi)).toBe(true);
      expect(nonEmpty(sample.readiness_next_en)).toBe(true);
      expect(nonEmpty(sample.script_awareness_vi)).toBe(true);
      expect(nonEmpty(sample.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi sample lines with romanization and bilingual translations", () => {
    for (const sample of goldenSamplesA2) {
      expect(sample.sample.length).toBeGreaterThanOrEqual(3);
      for (const line of sample.sample) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final-QA checks and common learner traps", () => {
    for (const sample of goldenSamplesA2) {
      expect(sample.final_qa.length).toBeGreaterThanOrEqual(2);
      for (const qa of sample.final_qa) {
        expect(nonEmpty(qa.q_vi)).toBe(true);
        expect(nonEmpty(qa.q_en)).toBe(true);
        expect(hasGurmukhi(qa.answer_pa)).toBe(true);
        expect(nonEmpty(qa.answer_romanization)).toBe(true);
        expect(nonEmpty(qa.answer_vi)).toBe(true);
        expect(nonEmpty(qa.answer_en)).toBe(true);
      }
      expect(sample.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of sample.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
  });

  it("includes golden-sample/final-QA/integration-readiness style modes and Canada examples", () => {
    const presentModes = new Set(goldenSamplesA2.map((sample) => sample.mode));
    expect(presentModes.has("golden_sample")).toBe(true);
    expect(presentModes.has("final_qa")).toBe(true);
    expect(presentModes.has("integration_readiness")).toBe(true);

    const canadaSamples = goldenSamplesA2.filter((sample) => sample.canada_practical_vi || sample.canada_practical_en);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(6);
    for (const sample of canadaSamples) {
      expect(nonEmpty(sample.canada_practical_vi)).toBe(true);
      expect(nonEmpty(sample.canada_practical_en)).toBe(true);
    }
  });
});
