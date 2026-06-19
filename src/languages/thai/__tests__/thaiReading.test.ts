// src/languages/thai/__tests__/thaiReading.test.ts
//
// Structural guards for the Thai reading-practice batch (A3 Wave 2).
// These pin the contract the reading UI relies on — NOT linguistic
// correctness (native review is deferred). They check level coverage,
// bilingual support (VI + EN), Thai script, romanization for the lower
// levels, comprehension Q&A, and vocabulary notes.

import { describe, it, expect } from "vitest";

import { passages } from "@/languages/thai/reading";

const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
const ROMANIZED_LEVELS = new Set(["A1", "A2", "B1"]);

describe("Thai reading — batch shape", () => {
  it("ships 30–60 passages", () => {
    expect(passages.length).toBeGreaterThanOrEqual(30);
    expect(passages.length).toBeLessThanOrEqual(60);
  });

  it("covers every CEFR level A1–C2", () => {
    const present = new Set(passages.map((p) => p.level));
    for (const lvl of ALL_LEVELS) expect(present.has(lvl)).toBe(true);
  });

  it("passage ids are unique", () => {
    const ids = passages.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("only uses valid CEFR levels", () => {
    for (const p of passages) {
      expect(ALL_LEVELS.includes(p.level)).toBe(true);
    }
  });
});

describe("Thai reading — script, bilingual, romanization", () => {
  it("every passage body is Thai script with VI + EN titles and translations", () => {
    for (const p of passages) {
      expect(hasThai(p.passage_th)).toBe(true);
      expect(nonEmpty(p.title_vi)).toBe(true);
      expect(nonEmpty(p.title_en)).toBe(true);
      expect(nonEmpty(p.translation_vi)).toBe(true);
      expect(nonEmpty(p.translation_en)).toBe(true);
      expect(nonEmpty(p.notes_vi)).toBe(true);
      expect(nonEmpty(p.notes_en)).toBe(true);
    }
  });

  it("A1/A2/B1 passages carry whole-passage romanization", () => {
    for (const p of passages) {
      if (ROMANIZED_LEVELS.has(p.level)) {
        expect(nonEmpty(p.romanization)).toBe(true);
      }
    }
  });
});

describe("Thai reading — comprehension + vocabulary", () => {
  it("every passage has comprehension questions with VI + EN answers", () => {
    for (const p of passages) {
      expect(p.questions.length).toBeGreaterThanOrEqual(2);
      for (const q of p.questions) {
        expect(nonEmpty(q.q_vi)).toBe(true);
        expect(nonEmpty(q.q_en)).toBe(true);
        expect(nonEmpty(q.answer_vi)).toBe(true);
        expect(nonEmpty(q.answer_en)).toBe(true);
      }
    }
  });

  it("every passage has vocabulary notes (Thai script + romanization + EN/VI gloss)", () => {
    for (const p of passages) {
      expect(p.vocab.length).toBeGreaterThanOrEqual(3);
      for (const v of p.vocab) {
        expect(hasThai(v.word)).toBe(true);
        expect(nonEmpty(v.rtgs)).toBe(true);
        expect(nonEmpty(v.en)).toBe(true);
        expect(nonEmpty(v.vi)).toBe(true);
      }
    }
  });
});
