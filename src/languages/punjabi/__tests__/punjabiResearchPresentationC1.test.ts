import { describe, expect, it } from "vitest";

import { researchPresentationC1, researchPresentationScriptAwareness } from "../researchPresentationC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const CATEGORIES = [
  "introduce_research",
  "define_scope",
  "cite_evidence",
  "compare_findings",
  "present_limitations",
  "transition_sections",
  "answer_questions",
] as const;

describe("Punjabi C1 research presentation pack - app data contract", () => {
  it("contains a compact set with unique ids", () => {
    expect(researchPresentationC1.length).toBeGreaterThanOrEqual(9);
    expect(researchPresentationC1.length).toBeLessThanOrEqual(16);

    const ids = researchPresentationC1.map((move) => move.id);
    expect(ids.every((id) => id.startsWith("pa_c1_rp_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(researchPresentationC1.every((move) => move.level === "C1")).toBe(true);
  });

  it("covers all Wave 5 presentation categories", () => {
    const present = new Set(researchPresentationC1.map((move) => move.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 research presentation pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const move of researchPresentationC1) {
      expect(GURMUKHI.test(move.title_pa)).toBe(true);
      expect(move.title_rom.trim().length).toBeGreaterThan(0);
      expect(move.title_vi.trim().length).toBeGreaterThan(0);
      expect(move.title_en.trim().length).toBeGreaterThan(0);
      expect(move.purpose_vi.trim().length).toBeGreaterThan(0);
      expect(move.purpose_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes reusable presentation phrases with bilingual support", () => {
    for (const move of researchPresentationC1) {
      expect(move.presentation_phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of move.presentation_phrases) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples", () => {
    for (const move of researchPresentationC1) {
      expect(move.canada_example.context_vi).toMatch(/Canada|Canada/i);
      expect(move.canada_example.context_en).toMatch(/Canada|Canadian/i);
      expect(GURMUKHI.test(move.canada_example.pa)).toBe(true);
      expect(move.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(move.canada_example.vi.trim().length).toBeGreaterThan(0);
      expect(move.canada_example.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and practice prompts", () => {
    for (const move of researchPresentationC1) {
      expect(move.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(move.learner_traps_en.length).toBeGreaterThanOrEqual(2);
      expect(move.practice_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(move.practice_prompt_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 research presentation pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not full course content", () => {
    expect(researchPresentationScriptAwareness.vi).toContain("Shahmukhi");
    expect(researchPresentationScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = researchPresentationC1.flatMap((move) => [
      move.title_pa,
      move.canada_example.pa,
      ...move.presentation_phrases.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
