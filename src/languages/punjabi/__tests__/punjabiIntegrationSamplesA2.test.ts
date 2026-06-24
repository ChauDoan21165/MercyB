// src/languages/punjabi/__tests__/punjabiIntegrationSamplesA2.test.ts
//
// Structural guards for Punjabi A2 integration samples. This is Wave 20 only,
// not A11 integration. These tests verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { integrationSamplesA2 } from "@/languages/punjabi/integrationSamplesA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routine",
  "appointment",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_explanation",
  "interaction_repair",
] as const;

const STYLES = ["integration_sample", "final_evidence", "final_qa"] as const;

describe("Punjabi A2 integration samples — batch shape", () => {
  it("ships compact samples for all required scenarios", () => {
    expect(integrationSamplesA2.length).toBeGreaterThanOrEqual(9);
    expect(integrationSamplesA2.length).toBeLessThanOrEqual(14);

    const present = new Set(integrationSamplesA2.map((sample) => sample.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/styles", () => {
    const ids = integrationSamplesA2.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const sample of integrationSamplesA2) {
      expect(REQUIRED_SCENARIOS.includes(sample.scenario)).toBe(true);
      expect(STYLES.includes(sample.style)).toBe(true);
    }
  });
});

describe("Punjabi A2 integration samples — learner contract", () => {
  it("uses Gurmukhi sample lines with romanization and bilingual meaning", () => {
    for (const sample of integrationSamplesA2) {
      expect(nonEmpty(sample.title_vi)).toBe(true);
      expect(nonEmpty(sample.title_en)).toBe(true);
      expect(nonEmpty(sample.learner_task_vi)).toBe(true);
      expect(nonEmpty(sample.learner_task_en)).toBe(true);
      expect(nonEmpty(sample.input_context_vi)).toBe(true);
      expect(nonEmpty(sample.input_context_en)).toBe(true);
      expect(sample.sample_lines.length).toBeGreaterThanOrEqual(2);

      for (const line of sample.sample_lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
      }
    }
  });

  it("includes final evidence checks and integration notes", () => {
    for (const sample of integrationSamplesA2) {
      expect(sample.final_evidence.length).toBeGreaterThanOrEqual(2);
      for (const evidence of sample.final_evidence) {
        expect(nonEmpty(evidence.cue_vi)).toBe(true);
        expect(nonEmpty(evidence.cue_en)).toBe(true);
        expect(hasGurmukhi(evidence.expected_pa)).toBe(true);
        expect(nonEmpty(evidence.expected_romanization)).toBe(true);
        expect(nonEmpty(evidence.expected_vi)).toBe(true);
        expect(nonEmpty(evidence.expected_en)).toBe(true);
      }
      expect(nonEmpty(sample.integration_note_vi)).toBe(true);
      expect(nonEmpty(sample.integration_note_en)).toBe(true);
    }
  });

  it("includes Shahmukhi awareness only, traps, and Canada-practical coverage", () => {
    for (const sample of integrationSamplesA2) {
      expect(sample.script_awareness_vi).toContain("Shahmukhi");
      expect(sample.script_awareness_en).toContain("Shahmukhi");
      expect(sample.script_awareness_en.toLowerCase()).toContain("not as a separate course");
      expect(sample.traps.length).toBeGreaterThanOrEqual(1);

      for (const trap of sample.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.fix_pa)).toBe(true);
        expect(nonEmpty(trap.fix_romanization)).toBe(true);
      }
    }

    const canadaSamples = integrationSamplesA2.filter((sample) => sample.canada_practical_vi || sample.canada_practical_en);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(6);
    for (const sample of canadaSamples) {
      expect(nonEmpty(sample.canada_practical_vi)).toBe(true);
      expect(nonEmpty(sample.canada_practical_en)).toBe(true);
    }
  });

  it("covers integration-sample, final-evidence, and final-QA styles", () => {
    const styles = new Set(integrationSamplesA2.map((sample) => sample.style));
    expect(styles.has("integration_sample")).toBe(true);
    expect(styles.has("final_evidence")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });
});
