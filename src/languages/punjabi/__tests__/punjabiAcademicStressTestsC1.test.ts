import { describe, expect, it } from "vitest";

import {
  academicStressTestsC1,
  academicStressTestsScriptAwarenessC1,
} from "../academicStressTestsC1";

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
  "public_service_text_handling",
] as const;

describe("Punjabi C1 academic stress tests - app data contract", () => {
  it("contains a compact stress-test pack with stable ids", () => {
    expect(academicStressTestsC1.length).toBeGreaterThanOrEqual(8);
    expect(academicStressTestsC1.length).toBeLessThanOrEqual(12);

    const ids = academicStressTestsC1.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_stress_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(academicStressTestsC1.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 23 stress-test areas", () => {
    const present = new Set(academicStressTestsC1.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes stress-test, final-risk, and final-QA modes", () => {
    const modes = new Set(academicStressTestsC1.map((card) => card.mode));
    expect(modes.has("stress_test")).toBe(true);
    expect(modes.has("final_risk")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
  });
});

describe("Punjabi C1 academic stress tests - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and response frames with romanization, Vietnamese, and English", () => {
    for (const card of academicStressTestsC1) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);
      expect(card.stress_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(card.stress_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.response_frame.pa)).toBe(true);
      expect(card.response_frame.rom.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.vi.trim().length).toBeGreaterThan(0);
      expect(card.response_frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes risk signals and final QA checks", () => {
    for (const card of academicStressTestsC1) {
      expect(card.risk_signals_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.risk_signals_en.length).toBeGreaterThanOrEqual(3);
      expect(card.final_qa_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.final_qa_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const card of academicStressTestsC1) {
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

describe("Punjabi C1 academic stress tests - script scope", () => {
  it("mentions Shahmukhi only as awareness, not stress-test content", () => {
    expect(academicStressTestsScriptAwarenessC1.vi).toContain("Gurmukhi");
    expect(academicStressTestsScriptAwarenessC1.en).toContain("Gurmukhi");
    expect(academicStressTestsScriptAwarenessC1.vi).toContain("Shahmukhi");
    expect(academicStressTestsScriptAwarenessC1.en).toContain("Shahmukhi");

    const learnerPunjabi = academicStressTestsC1.flatMap((card) => [
      card.title_pa,
      card.response_frame.pa,
      card.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
