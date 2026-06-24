import { describe, expect, it } from "vitest";

import {
  c1ClosureValidationSamples,
  c1ClosureValidationSamplesScriptAwareness,
} from "../c1ClosureValidationSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "formal_correspondence",
  "executive_summary",
  "presentation_response",
  "public_service_register",
] as const;

describe("Punjabi C1 closure-validation samples - app data contract", () => {
  it("contains a compact closure-validation pack with stable ids", () => {
    expect(c1ClosureValidationSamples.length).toBeGreaterThanOrEqual(7);
    expect(c1ClosureValidationSamples.length).toBeLessThanOrEqual(10);

    const ids = c1ClosureValidationSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_closure_validation_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1ClosureValidationSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 36 closure-validation areas", () => {
    const present = new Set(c1ClosureValidationSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes closure-validation, final-cross-check, and pre-integration modes", () => {
    const modes = new Set(c1ClosureValidationSamples.map((sample) => sample.mode));
    expect(modes.has("closure_validation")).toBe(true);
    expect(modes.has("final_cross_check")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 closure-validation samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1ClosureValidationSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.closure_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.closure_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes closure checks, final cross-checks, pre-integration notes, Canada examples, and learner traps", () => {
    for (const sample of c1ClosureValidationSamples) {
      expect(sample.closure_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.closure_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_cross_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_cross_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(3);

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

describe("Punjabi C1 closure-validation samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1ClosureValidationSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1ClosureValidationSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1ClosureValidationSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1ClosureValidationSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1ClosureValidationSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 36 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1ClosureValidationSamples);
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
