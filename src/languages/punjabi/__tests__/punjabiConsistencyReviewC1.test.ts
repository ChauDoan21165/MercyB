import { describe, expect, it } from "vitest";

import {
  consistencyReviewC1,
  consistencyReviewScriptAwarenessC1,
} from "../consistencyReviewC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "formal_writing",
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "professional_correspondence",
  "executive_summary",
  "presentation_response",
  "public_professional_register",
] as const;

describe("Punjabi C1 consistency review - app data contract", () => {
  it("contains a compact consistency pack with stable ids", () => {
    expect(consistencyReviewC1.length).toBeGreaterThanOrEqual(8);
    expect(consistencyReviewC1.length).toBeLessThanOrEqual(12);

    const ids = consistencyReviewC1.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_consistency_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(consistencyReviewC1.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 27 consistency areas", () => {
    const present = new Set(consistencyReviewC1.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes consistency-review, final-guardrail, and integration-ready modes", () => {
    const modes = new Set(consistencyReviewC1.map((card) => card.mode));
    expect(modes.has("consistency_review")).toBe(true);
    expect(modes.has("final_guardrail")).toBe(true);
    expect(modes.has("integration_ready")).toBe(true);
  });
});

describe("Punjabi C1 consistency review - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and response frames with romanization, Vietnamese, and English", () => {
    for (const card of consistencyReviewC1) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.review_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.review_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.response_frame.pa)).toBe(true);
      expect(card.response_frame.rom.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.vi.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes consistency checks, final guardrails, integration readiness, Canada examples, and learner traps", () => {
    for (const card of consistencyReviewC1) {
      expect(card.consistency_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.consistency_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(card.final_guardrail_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.final_guardrail_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 consistency review - script scope", () => {
  it("mentions Shahmukhi only as awareness, not pack content", () => {
    expect(consistencyReviewScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(consistencyReviewScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(consistencyReviewScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(consistencyReviewScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = consistencyReviewC1.flatMap((card) => [
      card.title_pa,
      card.response_frame.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
