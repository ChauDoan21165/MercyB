// src/languages/punjabi/__tests__/punjabiA2Core.test.ts
//
// Structural guards for the Punjabi A2 core lesson batch. These tests check
// batch shape and bilingual learner support; they do not assert native review.

import { describe, expect, it } from "vitest";

import { lessons } from "@/languages/punjabi/lessons-a2-core";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const FOCUS_CATEGORIES = [
  "daily_routine",
  "directions",
  "time",
  "weather",
  "simple_past",
  "simple_future",
  "requests",
  "preferences",
  "health",
  "school_work",
] as const;

describe("Punjabi A2 core - batch shape", () => {
  it("ships 10-16 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(16);
  });

  it("every lesson is level A2", () => {
    for (const lesson of lessons) expect(lesson.level).toBe("A2");
  });

  it("lesson ids are unique and namespaced to punjabi_a2", () => {
    const ids = lessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id.startsWith("punjabi_a2")).toBe(true);
  });

  it("covers every required A2 focus area at least once", () => {
    const present = new Set(lessons.map((lesson) => lesson.category));
    for (const category of FOCUS_CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi A2 core - bilingual and script contract", () => {
  it("uses Gurmukhi as the primary script with romanization", () => {
    for (const lesson of lessons) {
      for (const sentence of lesson.sentences) {
        expect(hasGurmukhi(sentence.pa)).toBe(true);
        expect(nonEmpty(sentence.romanization)).toBe(true);
        expect(sentence.romanization).not.toMatch(GURMUKHI_SCRIPT);
      }
    }
  });

  it("each lesson has Vietnamese and English learner support", () => {
    for (const lesson of lessons) {
      expect(nonEmpty(lesson.title_vi)).toBe(true);
      expect(nonEmpty(lesson.title_en)).toBe(true);
      expect(nonEmpty(lesson.grammar_notes_vi)).toBe(true);
      expect(nonEmpty(lesson.grammar_notes_en)).toBe(true);
      expect(nonEmpty(lesson.cultural_notes_vi)).toBe(true);
      expect(nonEmpty(lesson.cultural_notes_en)).toBe(true);
      expect(nonEmpty(lesson.script_awareness_vi)).toBe(true);
      expect(nonEmpty(lesson.script_awareness_en)).toBe(true);
    }
  });

  it("every lesson has 3+ sentences with VI, EN, and grammar notes", () => {
    for (const lesson of lessons) {
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(3);
      for (const sentence of lesson.sentences) {
        expect(hasGurmukhi(sentence.pa)).toBe(true);
        expect(nonEmpty(sentence.vi)).toBe(true);
        expect(nonEmpty(sentence.en)).toBe(true);
        expect(sentence.grammar_vi.length).toBeGreaterThan(0);
        expect(sentence.grammar_en.length).toBeGreaterThan(0);
      }
    }
  });

  it("vocabulary entries include Gurmukhi, romanization, VI, and EN", () => {
    for (const lesson of lessons) {
      expect(lesson.vocabulary.length).toBeGreaterThan(0);
      for (const item of lesson.vocabulary) {
        expect(hasGurmukhi(item.word)).toBe(true);
        expect(nonEmpty(item.romanization)).toBe(true);
        expect(nonEmpty(item.vi)).toBe(true);
        expect(nonEmpty(item.en)).toBe(true);
        expect(nonEmpty(item.pos)).toBe(true);
      }
    }
  });

  it("common mistakes include Vietnamese and English fixes", () => {
    for (const lesson of lessons) {
      expect(lesson.common_mistakes.length).toBeGreaterThan(0);
      for (const note of lesson.common_mistakes) {
        expect(nonEmpty(note.mistake)).toBe(true);
        expect(nonEmpty(note.fix_vi)).toBe(true);
        expect(nonEmpty(note.fix_en)).toBe(true);
      }
    }
  });

  it("mentions Shahmukhi only as awareness, not as a full course", () => {
    for (const lesson of lessons) {
      expect(lesson.script_awareness_vi).toContain("Shahmukhi");
      expect(lesson.script_awareness_en).toContain("Shahmukhi");
      expect(lesson.script_awareness_en.toLowerCase()).toMatch(/awareness|not the focus|only/);
    }
  });
});

