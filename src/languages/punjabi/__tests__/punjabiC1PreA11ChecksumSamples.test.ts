import { describe, expect, it } from "vitest";

import {
  c1PreA11ChecksumSamples,
  c1PreA11ChecksumSamplesScriptAwareness,
} from "../c1PreA11ChecksumSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "formal_correspondence",
  "executive_summary",
  "register_calibration",
  "presentation_response",
  "public_professional_tone",
] as const;

describe("Punjabi C1 Pre-A11-checksum samples - app data contract", () => {
  it("contains a compact Pre-A11-checksum pack with stable ids", () => {
    expect(c1PreA11ChecksumSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1PreA11ChecksumSamples.length).toBeLessThanOrEqual(12);

    const ids = c1PreA11ChecksumSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_pre_a11_checksum_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1PreA11ChecksumSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 48 Pre-A11-checksum areas", () => {
    const present = new Set(c1PreA11ChecksumSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes pre-A11-checksum, runner-readiness, pipeline-readiness, and pre-integration modes", () => {
    const modes = new Set(c1PreA11ChecksumSamples.map((sample) => sample.mode));
    expect(modes.has("pre_a11_checksum")).toBe(true);
    expect(modes.has("runner_readiness")).toBe(true);
    expect(modes.has("pipeline_readiness")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 Pre-A11-checksum samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1PreA11ChecksumSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.checksum_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.checksum_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes checksum checks, pipeline checks, pre-integration notes, Canada examples, and learner traps", () => {
    for (const sample of c1PreA11ChecksumSamples) {
      expect(sample.pre_a11_checksum_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_checksum_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pipeline_readiness_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pipeline_readiness_checks_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 Pre-A11-checksum samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1PreA11ChecksumSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1PreA11ChecksumSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1PreA11ChecksumSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1PreA11ChecksumSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1PreA11ChecksumSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 48 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1PreA11ChecksumSamples);
    expect(allText).toContain("pre-integration");
    expect(allText).toContain("pre-A11 checksum");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
