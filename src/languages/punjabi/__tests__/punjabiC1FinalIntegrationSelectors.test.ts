import { describe, expect, it } from "vitest";

import {
  c1FinalIntegrationSelectors,
  c1FinalIntegrationSelectorsScriptAwareness,
} from "../c1FinalIntegrationSelectors";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "academic_frames",
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "professional_correspondence",
  "executive_summary",
  "register_calibration",
  "presentation_response",
] as const;

describe("Punjabi C1 final integration selectors - app data contract", () => {
  it("contains a compact selector pack with stable ids", () => {
    expect(c1FinalIntegrationSelectors.length).toBeGreaterThanOrEqual(8);
    expect(c1FinalIntegrationSelectors.length).toBeLessThanOrEqual(12);

    const ids = c1FinalIntegrationSelectors.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_selector_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(c1FinalIntegrationSelectors.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 28 selector areas", () => {
    const present = new Set(c1FinalIntegrationSelectors.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes selector, pre-integration, and final-readiness modes", () => {
    const modes = new Set(c1FinalIntegrationSelectors.map((card) => card.mode));
    expect(modes.has("selector")).toBe(true);
    expect(modes.has("pre_integration")).toBe(true);
    expect(modes.has("final_readiness")).toBe(true);
  });
});

describe("Punjabi C1 final integration selectors - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and response frames with romanization, Vietnamese, and English", () => {
    for (const card of c1FinalIntegrationSelectors) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.selector_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.selector_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.response_frame.pa)).toBe(true);
      expect(card.response_frame.rom.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.vi.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes decision checks, final readiness, integration readiness, Canada examples, and learner traps", () => {
    for (const card of c1FinalIntegrationSelectors) {
      expect(card.decision_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.decision_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.final_readiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.final_readiness_en.length).toBeGreaterThanOrEqual(3);
      expect(card.integration_readiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.integration_readiness_en.length).toBeGreaterThanOrEqual(3);

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

describe("Punjabi C1 final integration selectors - script scope", () => {
  it("mentions Shahmukhi only as awareness, not pack content", () => {
    expect(c1FinalIntegrationSelectorsScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1FinalIntegrationSelectorsScriptAwareness.en).toContain("Gurmukhi");
    expect(c1FinalIntegrationSelectorsScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1FinalIntegrationSelectorsScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = c1FinalIntegrationSelectors.flatMap((card) => [
      card.title_pa,
      card.response_frame.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
