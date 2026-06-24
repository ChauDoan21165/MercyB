import { describe, expect, it } from "vitest";

import {
  c1ArchiveSamples,
  c1ArchiveSamplesScriptAwareness,
} from "../c1ArchiveSamples";

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

describe("Punjabi C1 archive samples - app data contract", () => {
  it("contains a compact archive pack with stable ids", () => {
    expect(c1ArchiveSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1ArchiveSamples.length).toBeLessThanOrEqual(10);

    const ids = c1ArchiveSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_archive_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1ArchiveSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 54 archive areas", () => {
    const present = new Set(c1ArchiveSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes archive, pre-A11-archive, signoff, and pre-integration modes", () => {
    const modes = new Set(c1ArchiveSamples.map((sample) => sample.mode));
    expect(modes.has("archive")).toBe(true);
    expect(modes.has("pre_a11_archive")).toBe(true);
    expect(modes.has("signoff")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 archive samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1ArchiveSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.archive_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.archive_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes archive checks, pre-A11-archive checks, signoff notes, pre-integration notes, Canada examples, and learner traps", () => {
    for (const sample of c1ArchiveSamples) {
      expect(sample.archive_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.archive_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_archive_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_archive_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.signoff_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.signoff_notes_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 archive samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1ArchiveSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1ArchiveSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1ArchiveSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1ArchiveSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1ArchiveSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 54 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1ArchiveSamples);
    expect(allText).toContain("pre-A11-archive");
    expect(allText).toContain("signoff");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
