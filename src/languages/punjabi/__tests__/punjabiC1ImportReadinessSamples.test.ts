import { describe, expect, it } from "vitest";

import {
  c1ImportReadinessSamples,
  c1ImportReadinessSamplesScriptAwareness,
} from "../c1ImportReadinessSamples";

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

describe("Punjabi C1 import-readiness samples - app data contract", () => {
  it("contains a compact import-readiness pack with stable ids", () => {
    expect(c1ImportReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1ImportReadinessSamples.length).toBeLessThanOrEqual(12);

    const ids = c1ImportReadinessSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_import_readiness_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1ImportReadinessSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 33 import-readiness areas", () => {
    const present = new Set(c1ImportReadinessSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes import-readiness, final-regression, and pre-integration modes", () => {
    const modes = new Set(c1ImportReadinessSamples.map((sample) => sample.mode));
    expect(modes.has("import_readiness")).toBe(true);
    expect(modes.has("final_regression")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 import-readiness samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1ImportReadinessSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.import_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.import_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes import checks, final regression checks, pre-integration notes, Canada examples, and learner traps", () => {
    for (const sample of c1ImportReadinessSamples) {
      expect(sample.import_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.import_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_regression_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.final_regression_checks_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 import-readiness samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1ImportReadinessSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1ImportReadinessSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1ImportReadinessSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1ImportReadinessSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1ImportReadinessSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 33 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1ImportReadinessSamples);
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
