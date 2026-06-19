// src/languages/thai/__tests__/thaiGrammarMiniBook.test.ts
//
// Structural guards for the Thai grammar mini-book (A3 Wave 3).
// These pin the card contract the grammar UI relies on — NOT linguistic
// correctness (no native authority is claimed). They check note count,
// topic coverage, bilingual explanations, Thai-script examples with
// romanization, and a common-mistake entry per note.

import { describe, it, expect } from "vitest";

import { notes } from "@/languages/thai/grammarMiniBook";

const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "word_order",
  "no_conjugation",
  "tense_time_markers",
  "particles",
  "classifiers",
  "questions",
  "negation",
  "pronouns",
  "politeness",
  "comparison",
  "aspect",
  "sentence_linking",
] as const;

describe("Thai grammar mini-book — batch shape", () => {
  it("ships 30–60 grammar notes", () => {
    expect(notes.length).toBeGreaterThanOrEqual(30);
    expect(notes.length).toBeLessThanOrEqual(60);
  });

  it("note ids are unique", () => {
    const ids = notes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required grammar topic at least once", () => {
    const present = new Set(notes.map((n) => n.topic));
    for (const t of REQUIRED_TOPICS) expect(present.has(t)).toBe(true);
  });

  it("only uses valid topics", () => {
    for (const n of notes) {
      expect(REQUIRED_TOPICS.includes(n.topic)).toBe(true);
    }
  });
});

describe("Thai grammar mini-book — bilingual + examples", () => {
  it("each note has VI + EN titles and explanations", () => {
    for (const n of notes) {
      expect(nonEmpty(n.title_vi)).toBe(true);
      expect(nonEmpty(n.title_en)).toBe(true);
      expect(nonEmpty(n.explanation_vi)).toBe(true);
      expect(nonEmpty(n.explanation_en)).toBe(true);
    }
  });

  it("each note has Thai-script examples with romanization + VI/EN gloss", () => {
    for (const n of notes) {
      expect(n.examples.length).toBeGreaterThanOrEqual(1);
      for (const e of n.examples) {
        expect(hasThai(e.th)).toBe(true);
        expect(nonEmpty(e.rtgs)).toBe(true);
        expect(nonEmpty(e.vi)).toBe(true);
        expect(nonEmpty(e.en)).toBe(true);
      }
    }
  });

  it("each note documents at least one common mistake (with VI + EN why)", () => {
    for (const n of notes) {
      expect(n.mistakes.length).toBeGreaterThanOrEqual(1);
      for (const m of n.mistakes) {
        expect(nonEmpty(m.wrong)).toBe(true);
        expect(nonEmpty(m.right)).toBe(true);
        expect(nonEmpty(m.why_vi)).toBe(true);
        expect(nonEmpty(m.why_en)).toBe(true);
      }
    }
  });
});
