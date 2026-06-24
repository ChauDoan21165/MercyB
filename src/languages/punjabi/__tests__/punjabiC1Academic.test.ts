import { describe, expect, it } from "vitest";

import { lessons } from "../lessons-c1-academic";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

describe("Punjabi C1 academic batch - size, ids, and level", () => {
  it("contains 10-16 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(16);
  });

  it("uses unique stable ids", () => {
    const ids = lessons.map((lesson) => lesson.id);
    expect(ids.every((id) => id.startsWith("pa_c1_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("tags every lesson as C1", () => {
    expect(lessons.every((lesson) => lesson.level === "C1")).toBe(true);
  });
});

describe("Punjabi C1 academic batch - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi as the primary script with VN and EN titles", () => {
    for (const lesson of lessons) {
      expect(GURMUKHI.test(lesson.title_pa)).toBe(true);
      expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.title_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("provides romanization, Vietnamese, and English for every sentence", () => {
    for (const lesson of lessons) {
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(3);
      for (const sentence of lesson.sentences) {
        expect(GURMUKHI.test(sentence.pa)).toBe(true);
        expect(sentence.rom.trim().length).toBeGreaterThan(0);
        expect(sentence.vi.trim().length).toBeGreaterThan(0);
        expect(sentence.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("provides Gurmukhi vocabulary with romanization, Vietnamese, English, and POS", () => {
    for (const lesson of lessons) {
      expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(3);
      for (const item of lesson.vocabulary) {
        expect(GURMUKHI.test(item.word)).toBe(true);
        expect(item.rom.trim().length).toBeGreaterThan(0);
        expect(item.vi.trim().length).toBeGreaterThan(0);
        expect(item.en.trim().length).toBeGreaterThan(0);
        expect(item.pos.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("has Vietnamese and English notes and tips for every lesson", () => {
    for (const lesson of lessons) {
      expect(lesson.notes_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.notes_en.trim().length).toBeGreaterThan(0);
      expect(lesson.tip_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.tip_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 academic batch - required topic coverage", () => {
  it("covers the requested professional and academic topics", () => {
    const categories = new Set(lessons.map((lesson) => lesson.category));
    expect(categories.has("presentation")).toBe(true);
    expect(categories.has("formal_message")).toBe(true);
    expect(categories.has("meeting")).toBe(true);
    expect(categories.has("policy_discussion")).toBe(true);
    expect(categories.has("summary")).toBe(true);
    expect(categories.has("polite_disagreement")).toBe(true);
    expect(categories.has("evidence")).toBe(true);
    expect(categories.has("recommendation")).toBe(true);
  });

  it("keeps Shahmukhi to awareness only, not course content", () => {
    const allSentences = lessons.flatMap((lesson) => lesson.sentences.map((sentence) => sentence.pa));
    const allVocab = lessons.flatMap((lesson) => lesson.vocabulary.map((item) => item.word));
    expect(allSentences.some((text) => SHAHMUKHI.test(text))).toBe(false);
    expect(allVocab.some((text) => SHAHMUKHI.test(text))).toBe(false);

    const awarenessNotes = lessons
      .flatMap((lesson) => [lesson.notes_vi, lesson.notes_en, lesson.tip_vi, lesson.tip_en])
      .filter((text) => text.includes("Shahmukhi"));
    expect(awarenessNotes.length).toBeGreaterThanOrEqual(1);
    expect(awarenessNotes.length).toBeLessThanOrEqual(2);
  });
});
