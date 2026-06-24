// src/languages/punjabi/__tests__/punjabiReading.test.ts
//
// Structural guards for Punjabi reading practice. They check the UI-facing
// contract only; native review is deferred.

import { describe, expect, it } from "vitest";

import { passages } from "@/languages/punjabi/reading";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const ROMANIZED_LEVELS = new Set(["A1", "A2", "B1"]);

describe("Punjabi reading — batch shape", () => {
  it("ships 20-40 compact passages", () => {
    expect(passages.length).toBeGreaterThanOrEqual(20);
    expect(passages.length).toBeLessThanOrEqual(40);
  });

  it("covers every CEFR level A1-C2", () => {
    const present = new Set(passages.map((p) => p.level));
    for (const level of ALL_LEVELS) expect(present.has(level)).toBe(true);
  });

  it("passage ids are unique and levels are valid", () => {
    const ids = passages.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const passage of passages) expect(ALL_LEVELS.includes(passage.level)).toBe(true);
  });
});

describe("Punjabi reading — script, bilingual support, romanization", () => {
  it("uses Gurmukhi primary passages with VI + EN learner fields", () => {
    for (const passage of passages) {
      expect(hasGurmukhi(passage.passage_pa)).toBe(true);
      expect(nonEmpty(passage.title_vi)).toBe(true);
      expect(nonEmpty(passage.title_en)).toBe(true);
      expect(nonEmpty(passage.translation_vi)).toBe(true);
      expect(nonEmpty(passage.translation_en)).toBe(true);
      expect(nonEmpty(passage.notes_vi)).toBe(true);
      expect(nonEmpty(passage.notes_en)).toBe(true);
      expect(nonEmpty(passage.cultural_note_vi)).toBe(true);
      expect(nonEmpty(passage.cultural_note_en)).toBe(true);
      expect(nonEmpty(passage.common_mistake_vi)).toBe(true);
      expect(nonEmpty(passage.common_mistake_en)).toBe(true);
    }
  });

  it("A1/A2/B1 passages carry whole-passage romanization", () => {
    for (const passage of passages) {
      if (ROMANIZED_LEVELS.has(passage.level)) expect(nonEmpty(passage.romanization)).toBe(true);
    }
  });
});

describe("Punjabi reading — comprehension and vocabulary", () => {
  it("has comprehension questions with VI + EN answers", () => {
    for (const passage of passages) {
      expect(passage.questions.length).toBeGreaterThanOrEqual(2);
      for (const question of passage.questions) {
        expect(nonEmpty(question.q_vi)).toBe(true);
        expect(nonEmpty(question.q_en)).toBe(true);
        expect(nonEmpty(question.answer_vi)).toBe(true);
        expect(nonEmpty(question.answer_en)).toBe(true);
      }
    }
  });

  it("has vocabulary notes with Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const passage of passages) {
      expect(passage.vocab.length).toBeGreaterThanOrEqual(3);
      for (const item of passage.vocab) {
        expect(hasGurmukhi(item.word)).toBe(true);
        expect(nonEmpty(item.romanization)).toBe(true);
        expect(nonEmpty(item.vi)).toBe(true);
        expect(nonEmpty(item.en)).toBe(true);
      }
    }
  });
});
