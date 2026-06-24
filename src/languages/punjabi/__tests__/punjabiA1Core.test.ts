// src/languages/punjabi/__tests__/punjabiA1Core.test.ts
//
// Structural + content-integrity guards for the Punjabi A1 core lesson batch.
// These tests confirm Gurmukhi-first content, practical romanization, bilingual
// Vietnamese/English explanations, and L1 learner-mistake support. Native
// review is deferred; these tests do not assert native-speaker review.

import { describe, expect, it } from "vitest";

import lessons, {
  lessons as namedLessons,
  type PunjabiCategoryId,
  type PunjabiLesson,
} from "@/languages/punjabi/lessons-a1-core";

const GURMUKHI_SCRIPT = /[\u0A00-\u0A7F]/;
const LATIN = /[a-zA-Z]/;

describe("Punjabi A1 core - batch shape", () => {
  it("exports the same array as default and named `lessons`", () => {
    expect(lessons).toBe(namedLessons);
    expect(Array.isArray(lessons)).toBe(true);
  });

  it("contains 10-16 compact A1 lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(16);
  });

  it("uses unique Punjabi A1 ids and A1 level", () => {
    const ids = lessons.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const lesson of lessons) {
      expect(lesson.id).toMatch(/^punjabi_a1_/);
      expect(lesson.level).toBe("A1");
    }
  });

  it("covers every required A1 core topic", () => {
    const required: PunjabiCategoryId[] = [
      "greetings",
      "names",
      "family",
      "numbers",
      "food_drink",
      "shopping",
      "transport",
      "simple_questions",
      "yes_no",
      "thanks_apology",
      "polite_basics",
      "pronouns_copula",
    ];
    const present = new Set(lessons.map((lesson) => lesson.category));

    for (const category of required) {
      expect(present, `missing required category: ${category}`).toContain(category);
    }
  });

  it("keeps Shahmukhi as awareness only", () => {
    const allText = JSON.stringify(lessons);
    expect(allText).toContain("Shahmukhi");
    expect(allText).toContain("awareness only");
    expect(allText).not.toMatch(/Shahmukhi course|full Shahmukhi/i);
  });
});

describe("Punjabi A1 core - per-lesson integrity", () => {
  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s has bilingual titles",
    (_id, lesson: PunjabiLesson) => {
      expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.title_en.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s has examples, vocabulary, dialogue, practice, and learner notes",
    (_id, lesson: PunjabiLesson) => {
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(3);
      expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(4);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);
      expect(lesson.l1_notes.length).toBeGreaterThanOrEqual(1);
    },
  );

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s sentences carry Gurmukhi + romanization + VI + EN",
    (_id, lesson: PunjabiLesson) => {
      for (const sentence of lesson.sentences) {
        expect(sentence.pa, `Gurmukhi missing in ${sentence.romanization}`).toMatch(GURMUKHI_SCRIPT);
        expect(sentence.romanization, `romanization missing for ${sentence.pa}`).toMatch(LATIN);
        expect(sentence.vi.trim().length, `VI missing for ${sentence.pa}`).toBeGreaterThan(0);
        expect(sentence.en.trim().length, `EN missing for ${sentence.pa}`).toBeGreaterThan(0);
        expect(sentence.pronunciation_focus.length).toBeGreaterThanOrEqual(1);
        expect(sentence.pronunciation_focus_en?.length ?? 0).toBeGreaterThanOrEqual(1);
      }
    },
  );

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s vocabulary entries are complete",
    (_id, lesson: PunjabiLesson) => {
      for (const vocab of lesson.vocabulary) {
        expect(vocab.word).toMatch(GURMUKHI_SCRIPT);
        expect(vocab.romanization).toMatch(LATIN);
        expect(vocab.vi.trim().length).toBeGreaterThan(0);
        expect(vocab.en.trim().length).toBeGreaterThan(0);
        expect(vocab.pos.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s dialogue lines carry Gurmukhi + romanization + VI + EN",
    (_id, lesson: PunjabiLesson) => {
      for (const line of lesson.dialogue) {
        expect(line.speaker.trim().length).toBeGreaterThan(0);
        expect(line.pa).toMatch(GURMUKHI_SCRIPT);
        expect(line.romanization).toMatch(LATIN);
        expect(line.vi.trim().length).toBeGreaterThan(0);
        expect(line.en.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(lessons.map((lesson) => [lesson.id, lesson] as const))(
    "%s learner mistake notes are bilingual",
    (_id, lesson: PunjabiLesson) => {
      for (const note of lesson.l1_notes) {
        expect(["vi", "en", "both"]).toContain(note.audience);
        expect(note.mistake.trim().length).toBeGreaterThan(0);
        expect(note.fix_vi.trim().length).toBeGreaterThan(0);
        expect(note.fix_en.trim().length).toBeGreaterThan(0);
      }
    },
  );
});

describe("Punjabi A1 core - learner audience coverage", () => {
  it("includes common mistakes for Vietnamese and English speakers", () => {
    const audiences = new Set(lessons.flatMap((lesson) => lesson.l1_notes.map((note) => note.audience)));

    expect(audiences.has("vi") || audiences.has("both")).toBe(true);
    expect(audiences.has("en") || audiences.has("both")).toBe(true);
  });
});
