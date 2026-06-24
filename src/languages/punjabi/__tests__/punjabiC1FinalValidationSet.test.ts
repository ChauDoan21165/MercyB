import { describe, expect, it } from "vitest";

import {
  c1FinalValidationSet,
  c1FinalValidationSetScriptAwareness,
} from "../c1FinalValidationSet";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
  "register_calibration",
  "presentation_response",
] as const;

describe("Punjabi C1 final validation set - app data contract", () => {
  it("contains a compact final-validation pack with stable ids", () => {
    expect(c1FinalValidationSet.length).toBeGreaterThanOrEqual(8);
    expect(c1FinalValidationSet.length).toBeLessThanOrEqual(12);

    const ids = c1FinalValidationSet.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_final_validation_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1FinalValidationSet.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 35 validation areas", () => {
    const present = new Set(c1FinalValidationSet.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes final-validation, cross-check, and pre-integration modes", () => {
    const modes = new Set(c1FinalValidationSet.map((card) => card.mode));
    expect(modes.has("final_validation")).toBe(true);
    expect(modes.has("cross_check")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 final validation set - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi final samples with romanization, Vietnamese, and English support", () => {
    for (const card of c1FinalValidationSet) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.validation_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.validation_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.final_sample.pa)).toBe(true);
      expect(card.final_sample.rom.trim().length).toBeGreaterThan(0);
      expect(card.final_sample.vi.trim().length).toBeGreaterThan(0);
      expect(card.final_sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes register checks, tone checks, pre-integration notes, Canada examples, and learner traps", () => {
    for (const card of c1FinalValidationSet) {
      expect(card.register_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.register_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.tone_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.tone_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.pre_integration_notes_en.length).toBeGreaterThanOrEqual(3);

      expect(card.canada_example.context_vi).toContain("Canada");
      expect(card.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(card.canada_example.pa)).toBe(true);
      expect(card.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(card.canada_example.vi).toContain("Canada");
      expect(card.canada_example.en).toMatch(/Canada|Canadian/);
      expect(card.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(card.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 final validation set - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1FinalValidationSetScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1FinalValidationSetScriptAwareness.en).toContain("Gurmukhi");
    expect(c1FinalValidationSetScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1FinalValidationSetScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1FinalValidationSet.flatMap((card) => [
      card.title_pa,
      card.final_sample.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 35 scoped away from integration runs and native-review claims", () => {
    const allText = JSON.stringify(c1FinalValidationSet);
    expect(allText).toContain("final validation");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
