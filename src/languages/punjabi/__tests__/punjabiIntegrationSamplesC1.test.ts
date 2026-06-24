import { describe, expect, it } from "vitest";

import {
  integrationSamplesC1,
  integrationSamplesScriptAwareness,
} from "../integrationSamplesC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
  "presentation_response",
  "public_professional_text_handling",
] as const;

describe("Punjabi C1 integration samples - app data contract", () => {
  it("contains a compact integration pack with stable ids", () => {
    expect(integrationSamplesC1.length).toBeGreaterThanOrEqual(8);
    expect(integrationSamplesC1.length).toBeLessThanOrEqual(12);

    const ids = integrationSamplesC1.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_integration_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(integrationSamplesC1.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 20 integration areas", () => {
    const present = new Set(integrationSamplesC1.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes integration-sample, final-evidence, and final-QA modes", () => {
    const modes = new Set(integrationSamplesC1.map((sample) => sample.mode));
    expect(modes.has("integration_sample")).toBe(true);
    expect(modes.has("final_evidence")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
  });
});

describe("Punjabi C1 integration samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and samples with romanization, Vietnamese, and English", () => {
    for (const sample of integrationSamplesC1) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.integration_goal_vi.trim().length).toBeGreaterThan(0);
      expect(sample.integration_goal_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes final evidence and final QA checks", () => {
    for (const sample of integrationSamplesC1) {
      expect(sample.final_evidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_evidence_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_qa_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_qa_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const sample of integrationSamplesC1) {
      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 integration samples - script scope", () => {
  it("mentions Shahmukhi only as awareness, not integration-sample content", () => {
    expect(integrationSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(integrationSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(integrationSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(integrationSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = integrationSamplesC1.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
