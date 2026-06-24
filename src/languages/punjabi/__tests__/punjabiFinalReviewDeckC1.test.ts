import { describe, expect, it } from "vitest";

import { finalReviewDeckC1, finalReviewDeckScriptAwareness } from "../finalReviewDeckC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "source_summary",
  "cautious_claim",
  "compare_evidence",
  "formal_writing",
  "academic_register",
  "presentation_response",
  "public_text_handling",
  "professional_text_handling",
] as const;

describe("Punjabi C1 final review deck - app data contract", () => {
  it("contains a compact useful deck with stable ids", () => {
    expect(finalReviewDeckC1.length).toBeGreaterThanOrEqual(8);
    expect(finalReviewDeckC1.length).toBeLessThanOrEqual(14);

    const ids = finalReviewDeckC1.map((card) => card.id);
    expect(ids.every((id) => id.startsWith("pa_c1_review_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(finalReviewDeckC1.every((card) => card.level === "C1")).toBe(true);
  });

  it("covers all Wave 13 final review areas", () => {
    const present = new Set(finalReviewDeckC1.map((card) => card.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }
  });

  it("includes review, QA, and final checkpoint modes", () => {
    const modes = new Set(finalReviewDeckC1.map((card) => card.mode));
    expect(modes.has("quick_check")).toBe(true);
    expect(modes.has("qa_prompt")).toBe(true);
    expect(modes.has("final_checkpoint")).toBe(true);
  });
});

describe("Punjabi C1 final review deck - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles and review prompts with romanization, Vietnamese, and English", () => {
    for (const card of finalReviewDeckC1) {
      expect(GURMUKHI.test(card.title_pa)).toBe(true);
      expect(card.title_rom.trim().length).toBeGreaterThan(0);
      expect(card.title_vi.trim().length).toBeGreaterThan(0);
      expect(card.title_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(card.review_question.pa)).toBe(true);
      expect(card.review_question.rom.trim().length).toBeGreaterThan(0);
      expect(card.review_question.vi.trim().length).toBeGreaterThan(0);
      expect(card.review_question.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes model answers, checkpoints, success markers, and quick-fix language", () => {
    for (const card of finalReviewDeckC1) {
      expect(GURMUKHI.test(card.model_answer.pa)).toBe(true);
      expect(card.model_answer.rom.trim().length).toBeGreaterThan(0);
      expect(card.model_answer.vi.trim().length).toBeGreaterThan(0);
      expect(card.model_answer.en.trim().length).toBeGreaterThan(0);

      expect(card.checkpoint_vi.trim().length).toBeGreaterThan(0);
      expect(card.checkpoint_en.trim().length).toBeGreaterThan(0);
      expect(card.success_markers_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.success_markers_en.length).toBeGreaterThanOrEqual(3);
      expect(card.quick_fix_language.length).toBeGreaterThanOrEqual(2);

      for (const phrase of card.quick_fix_language) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const card of finalReviewDeckC1) {
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

describe("Punjabi C1 final review deck - script scope", () => {
  it("mentions Shahmukhi only as awareness, not final-review content", () => {
    expect(finalReviewDeckScriptAwareness.vi).toContain("Gurmukhi");
    expect(finalReviewDeckScriptAwareness.en).toContain("Gurmukhi");
    expect(finalReviewDeckScriptAwareness.vi).toContain("Shahmukhi");
    expect(finalReviewDeckScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = finalReviewDeckC1.flatMap((card) => [
      card.title_pa,
      card.review_question.pa,
      card.model_answer.pa,
      card.canada_example.pa,
      ...card.quick_fix_language.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
