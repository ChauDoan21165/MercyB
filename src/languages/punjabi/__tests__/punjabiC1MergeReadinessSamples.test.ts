import { describe, expect, it } from "vitest";

import {
  c1MergeReadinessSamples,
  c1MergeReadinessSamplesScriptAwareness,
} from "../c1MergeReadinessSamples";

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

describe("Punjabi C1 merge readiness samples - app data contract", () => {
  it("contains a compact merge-readiness pack with stable ids", () => {
    expect(c1MergeReadinessSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1MergeReadinessSamples.length).toBeLessThanOrEqual(12);

    const ids = c1MergeReadinessSamples.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_merge_readiness_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1MergeReadinessSamples.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 32 merge-readiness areas", () => {
    const present = new Set(c1MergeReadinessSamples.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes merge-readiness, final-regression, and pre-integration modes", () => {
    const modes = new Set(c1MergeReadinessSamples.map((card) => card.mode));
    expect(modes.has("merge_readiness")).toBe(true);
    expect(modes.has("final_regression")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 merge readiness samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const card of c1MergeReadinessSamples) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.readiness_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.readiness_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.sample.pa)).toBe(true);
      expect(card.sample.rom.trim().length).toBeGreaterThan(0);
      expect(card.sample.vi.trim().length).toBeGreaterThan(0);
      expect(card.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes merge checks, regression checks, pre-integration notes, Canada examples, and learner traps", () => {
    for (const card of c1MergeReadinessSamples) {
      expect(card.merge_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.merge_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.regression_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.regression_checks_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 merge readiness samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1MergeReadinessSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1MergeReadinessSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1MergeReadinessSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1MergeReadinessSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1MergeReadinessSamples.flatMap((card) => [
      card.title_pa,
      card.sample.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 32 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1MergeReadinessSamples);
    expect(allText).toContain("merge");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
