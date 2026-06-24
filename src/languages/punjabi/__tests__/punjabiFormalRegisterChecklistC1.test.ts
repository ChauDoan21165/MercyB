import { describe, expect, it } from "vitest";

import {
  formalRegisterChecklistC1,
  formalRegisterChecklistScriptAwarenessC1,
} from "../formalRegisterChecklistC1";

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
  "professional_register_safety",
] as const;

describe("Punjabi C1 formal register checklist - app data contract", () => {
  it("contains a compact checklist pack with stable ids", () => {
    expect(formalRegisterChecklistC1.length).toBeGreaterThanOrEqual(8);
    expect(formalRegisterChecklistC1.length).toBeLessThanOrEqual(12);

    const ids = formalRegisterChecklistC1.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_checklist_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(formalRegisterChecklistC1.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 26 checklist areas", () => {
    const present = new Set(formalRegisterChecklistC1.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes checklist, final-stability, boundary-check, and regression-check modes", () => {
    const modes = new Set(formalRegisterChecklistC1.map((card) => card.mode));
    expect(modes.has("checklist")).toBe(true);
    expect(modes.has("final_stability")).toBe(true);
    expect(modes.has("boundary_check")).toBe(true);
    expect(modes.has("regression_check")).toBe(true);
  });
});

describe("Punjabi C1 formal register checklist - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and response frames with romanization, Vietnamese, and English", () => {
    for (const card of formalRegisterChecklistC1) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.checklist_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.checklist_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.response_frame.pa)).toBe(true);
      expect(card.response_frame.rom.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.vi.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes stability checks, boundary checks, export readiness, regression checks, Canada examples, and learner traps", () => {
    for (const card of formalRegisterChecklistC1) {
      expect(card.stability_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.stability_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.boundary_checks_vi.length).toBeGreaterThanOrEqual(2);
      expect(card.boundary_checks_en.length).toBeGreaterThanOrEqual(2);
      expect(card.export_readiness_vi.length).toBeGreaterThanOrEqual(2);
      expect(card.export_readiness_en.length).toBeGreaterThanOrEqual(2);
      expect(card.regression_checks_vi.length).toBeGreaterThanOrEqual(2);
      expect(card.regression_checks_en.length).toBeGreaterThanOrEqual(2);

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

describe("Punjabi C1 formal register checklist - script scope", () => {
  it("mentions Shahmukhi only as awareness, not pack content", () => {
    expect(formalRegisterChecklistScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(formalRegisterChecklistScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(formalRegisterChecklistScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(formalRegisterChecklistScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = formalRegisterChecklistC1.flatMap((card) => [
      card.title_pa,
      card.response_frame.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
