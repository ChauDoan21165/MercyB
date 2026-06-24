// src/languages/punjabi/__tests__/punjabiGrammarMiniBook.test.ts
//
// Structural guards for the Punjabi grammar mini-book. These verify the
// learner-facing data contract only; native review is deferred.

import { describe, expect, it } from "vitest";

import { notes } from "@/languages/punjabi/grammarMiniBook";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "word_order",
  "postpositions",
  "gender_number",
  "verb_agreement",
  "pronouns",
  "honorifics",
  "negation",
  "questions",
  "tense_aspect",
  "possession",
  "comparison",
  "sentence_linking",
] as const;

describe("Punjabi grammar mini-book — batch shape", () => {
  it("ships 30-60 grammar notes", () => {
    expect(notes.length).toBeGreaterThanOrEqual(30);
    expect(notes.length).toBeLessThanOrEqual(60);
  });

  it("note ids are unique", () => {
    const ids = notes.map((note) => note.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required grammar topic", () => {
    const present = new Set(notes.map((note) => note.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("only uses valid topics", () => {
    for (const note of notes) expect(REQUIRED_TOPICS.includes(note.topic)).toBe(true);
  });
});

describe("Punjabi grammar mini-book — bilingual explanations and examples", () => {
  it("each note has Vietnamese and English titles/explanations", () => {
    for (const note of notes) {
      expect(nonEmpty(note.title_vi)).toBe(true);
      expect(nonEmpty(note.title_en)).toBe(true);
      expect(nonEmpty(note.explanation_vi)).toBe(true);
      expect(nonEmpty(note.explanation_en)).toBe(true);
    }
  });

  it("each note has Gurmukhi examples with romanization and VI/EN glosses", () => {
    for (const note of notes) {
      expect(note.examples.length).toBeGreaterThanOrEqual(1);
      for (const example of note.examples) {
        expect(hasGurmukhi(example.pa)).toBe(true);
        expect(nonEmpty(example.romanization)).toBe(true);
        expect(nonEmpty(example.vi)).toBe(true);
        expect(nonEmpty(example.en)).toBe(true);
      }
    }
  });

  it("each note documents a common mistake with VI + EN explanations", () => {
    for (const note of notes) {
      expect(note.mistakes.length).toBeGreaterThanOrEqual(1);
      for (const mistake of note.mistakes) {
        expect(nonEmpty(mistake.wrong)).toBe(true);
        expect(nonEmpty(mistake.right)).toBe(true);
        expect(nonEmpty(mistake.why_vi)).toBe(true);
        expect(nonEmpty(mistake.why_en)).toBe(true);
      }
    }
  });

  it("keeps Shahmukhi as awareness only", () => {
    const fileText = JSON.stringify(notes);
    expect(fileText.includes("Shahmukhi")).toBe(false);
  });
});
