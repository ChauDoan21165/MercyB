import { describe, expect, it } from "vitest";

import { goldenSamplesC1, goldenSamplesScriptAwareness } from "../goldenSamplesC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_SKILLS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "comparing_evidence",
  "professional_correspondence",
  "executive_summary",
  "presentation_response",
  "public_professional_text_handling",
] as const;

describe("Punjabi C1 golden samples - app data contract", () => {
  it("contains a compact useful pack with stable ids", () => {
    expect(goldenSamplesC1.length).toBeGreaterThanOrEqual(8);
    expect(goldenSamplesC1.length).toBeLessThanOrEqual(12);

    const ids = goldenSamplesC1.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_golden_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(goldenSamplesC1.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 18 golden-sample skills", () => {
    const present = new Set(goldenSamplesC1.map((sample) => sample.skill));
    for (const skill of REQUIRED_SKILLS) {
      expect(present.has(skill)).toBe(true);
    }
  });

  it("includes golden sample, final QA, and integration readiness modes", () => {
    const modes = new Set(goldenSamplesC1.map((sample) => sample.mode));
    expect(modes.has("golden_sample")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
    expect(modes.has("integration_readiness")).toBe(true);
  });
});

describe("Punjabi C1 golden samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and samples with romanization, Vietnamese, and English", () => {
    for (const sample of goldenSamplesC1) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.task_context_vi.trim().length).toBeGreaterThan(0);
      expect(sample.task_context_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.golden_sample.pa)).toBe(true);
      expect(sample.golden_sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.golden_sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.golden_sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes why-it-works guidance and final QA checks", () => {
    for (const sample of goldenSamplesC1) {
      expect(sample.why_it_works_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.why_it_works_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_qa_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_qa_checks_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const sample of goldenSamplesC1) {
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

describe("Punjabi C1 golden samples - script scope", () => {
  it("mentions Shahmukhi only as awareness, not golden-sample content", () => {
    expect(goldenSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(goldenSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(goldenSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(goldenSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = goldenSamplesC1.flatMap((sample) => [
      sample.title_pa,
      sample.golden_sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
