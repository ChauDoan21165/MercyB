import { describe, expect, it } from "vitest";

import {
  c1AcceptanceSamples,
  c1AcceptanceSamplesScriptAwareness,
} from "../c1AcceptanceSamples";

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

describe("Punjabi C1 acceptance samples - app data contract", () => {
  it("contains a compact acceptance pack with stable ids", () => {
    expect(c1AcceptanceSamples.length).toBeGreaterThanOrEqual(8);
    expect(c1AcceptanceSamples.length).toBeLessThanOrEqual(12);

    const ids = c1AcceptanceSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_acceptance_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1AcceptanceSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all Wave 40 acceptance areas", () => {
    const present = new Set(c1AcceptanceSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes acceptance, ship-candidate, go/no-go, and pre-integration modes", () => {
    const modes = new Set(c1AcceptanceSamples.map((sample) => sample.mode));
    expect(modes.has("acceptance")).toBe(true);
    expect(modes.has("ship_candidate")).toBe(true);
    expect(modes.has("go_no_go")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
  });
});

describe("Punjabi C1 acceptance samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of c1AcceptanceSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.acceptance_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.acceptance_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes acceptance checks, ship-candidate checks, go/no-go notes, Canada examples, and traps", () => {
    for (const sample of c1AcceptanceSamples) {
      expect(sample.acceptance_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.acceptance_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.ship_candidate_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.ship_candidate_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.go_no_go_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.go_no_go_notes_en.length).toBeGreaterThanOrEqual(3);

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

describe("Punjabi C1 acceptance samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness, not learner sample content", () => {
    expect(c1AcceptanceSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1AcceptanceSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1AcceptanceSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1AcceptanceSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1AcceptanceSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 40 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(c1AcceptanceSamples);
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/A11 integration|native reviewed|native-review approved/i);
  });
});
