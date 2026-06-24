import { describe, expect, it } from "vitest";

import {
  c1CrossCheckSamples,
  c1CrossCheckSamplesScriptAwareness,
} from "../c1CrossCheckSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
] as const;

describe("Punjabi C1 cross-check samples - app data contract", () => {
  it("contains a compact cross-check pack with stable ids", () => {
    expect(c1CrossCheckSamples.length).toBeGreaterThanOrEqual(6);
    expect(c1CrossCheckSamples.length).toBeLessThanOrEqual(10);

    const ids = c1CrossCheckSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_crosscheck_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1CrossCheckSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers the Wave 34 cross-check areas", () => {
    const present = new Set(c1CrossCheckSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes cross-check, verification, and pre-integration modes", () => {
    const modes = new Set(c1CrossCheckSamples.map((sample) => sample.mode));
    expect(modes.has("cross_check")).toBe(true);
    expect(modes.has("verification")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 cross-check samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1CrossCheckSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.check_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.check_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes coherence checks, verification steps, pre-integration notes, Canada contexts, and learner traps", () => {
    for (const sample of c1CrossCheckSamples) {
      expect(sample.coherence_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.coherence_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.verification_steps_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.verification_steps_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(3);

      expect(sample.canada_context.context_vi).toContain("Canada");
      expect(sample.canada_context.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_context.pa)).toBe(true);
      expect(sample.canada_context.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_context.vi).toContain("Canada");
      expect(sample.canada_context.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 cross-check samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1CrossCheckSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1CrossCheckSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1CrossCheckSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1CrossCheckSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1CrossCheckSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_context.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 34 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1CrossCheckSamples);
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
