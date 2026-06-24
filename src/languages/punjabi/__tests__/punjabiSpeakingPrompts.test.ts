import { describe, expect, it } from "vitest";

import { speakingPrompts } from "../speakingPrompts";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const LEVELS = new Set(["A2", "B1", "B2", "C1"]);

describe("Punjabi speaking prompts - size, ids, and levels", () => {
  it("contains 40-80 prompts", () => {
    expect(speakingPrompts.length).toBeGreaterThanOrEqual(40);
    expect(speakingPrompts.length).toBeLessThanOrEqual(80);
  });

  it("uses unique Punjabi speaking ids", () => {
    const ids = speakingPrompts.map((prompt) => prompt.id);
    expect(ids.every((id) => id.startsWith("pa_sp_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses the expected learner levels", () => {
    expect(speakingPrompts.every((prompt) => LEVELS.has(prompt.level))).toBe(true);
    for (const level of LEVELS) {
      expect(speakingPrompts.some((prompt) => prompt.level === level)).toBe(true);
    }
  });
});

describe("Punjabi speaking prompts - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi prompt text with romanization, Vietnamese, and English", () => {
    for (const prompt of speakingPrompts) {
      expect(GURMUKHI.test(prompt.prompt_pa)).toBe(true);
      expect(prompt.prompt_rom.trim().length).toBeGreaterThan(0);
      expect(prompt.prompt_vi.trim().length).toBeGreaterThan(0);
      expect(prompt.prompt_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes learner goal, model answer outline, and follow-up question", () => {
    for (const prompt of speakingPrompts) {
      expect(prompt.learner_goal_vi.trim().length).toBeGreaterThan(0);
      expect(prompt.learner_goal_en.trim().length).toBeGreaterThan(0);
      expect(prompt.model_answer_outline_vi.trim().length).toBeGreaterThan(0);
      expect(prompt.model_answer_outline_en.trim().length).toBeGreaterThan(0);
      expect(GURMUKHI.test(prompt.follow_up_pa)).toBe(true);
      expect(prompt.follow_up_rom.trim().length).toBeGreaterThan(0);
      expect(prompt.follow_up_vi.trim().length).toBeGreaterThan(0);
      expect(prompt.follow_up_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes useful phrases with Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const prompt of speakingPrompts) {
      expect(prompt.useful_phrases.length).toBeGreaterThanOrEqual(2);
      for (const phrase of prompt.useful_phrases) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Shahmukhi to awareness only", () => {
    const punjabiCourseText = speakingPrompts.flatMap((prompt) => [
      prompt.prompt_pa,
      prompt.follow_up_pa,
      ...prompt.useful_phrases.map((phrase) => phrase.pa),
    ]);
    expect(punjabiCourseText.some((text) => SHAHMUKHI.test(text))).toBe(false);

    const awarenessText = speakingPrompts
      .flatMap((prompt) => [
        prompt.prompt_vi,
        prompt.prompt_en,
        prompt.learner_goal_vi,
        prompt.learner_goal_en,
        prompt.model_answer_outline_vi,
        prompt.model_answer_outline_en,
      ])
      .filter((text) => text.includes("Shahmukhi"));
    expect(awarenessText.length).toBeGreaterThanOrEqual(1);
    expect(awarenessText.length).toBeLessThanOrEqual(6);
  });
});
