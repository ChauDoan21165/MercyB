// src/languages/thai/__tests__/thaiA1Core.test.ts
//
// Structural + content-integrity guards for the Thai A1 core lesson batch.
// These pin the contract the lesson page UI relies on (Thai script present,
// romanization present, bilingual VI + EN explanations everywhere) without
// hard-coding individual lesson content, so the batch can grow within the
// A1 band and stay green.
//
// Native-speaker review is DEFERRED; these tests do NOT assert linguistic
// correctness, only that each required field exists and is well-formed.

import { describe, it, expect } from "vitest";

import lessons, {
  lessons as namedLessons,
  type ThaiLesson,
  type ThaiCategoryId,
} from "@/languages/thai/lessons-a1-core";

// Matches at least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;
// Matches at least one Latin letter (romanization sanity check).
const LATIN = /[a-zA-Z]/;

describe("Thai A1 core — batch shape", () => {
  it("exports the same array as default and named `lessons`", () => {
    expect(lessons).toBe(namedLessons);
    expect(Array.isArray(lessons)).toBe(true);
  });

  it("contains 10–15 lessons (compact A1 batch)", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(15);
  });

  it("uses unique ids, all at level A1", () => {
    const ids = lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const l of lessons) {
      expect(l.level).toBe("A1");
      expect(l.id).toMatch(/^thai_a1_/);
    }
  });

  it("covers every required A1 core topic", () => {
    const required: ThaiCategoryId[] = [
      "greetings",
      "particles",
      "pronouns",
      "yes_no",
      "numbers",
      "food_drink",
      "buying",
      "directions",
      "time_day",
      "basic_verbs",
      "polite_requests",
      "introductions",
    ];
    const present = new Set(lessons.map((l) => l.category));
    for (const cat of required) {
      expect(present, `missing required category: ${cat}`).toContain(cat);
    }
  });
});

describe("Thai A1 core — per-lesson integrity", () => {
  it.each(lessons.map((l) => [l.id, l] as const))(
    "%s has bilingual titles",
    (_id, lesson: ThaiLesson) => {
      expect(lesson.title_vi.trim().length).toBeGreaterThan(0);
      expect(lesson.title_en.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(lessons.map((l) => [l.id, l] as const))(
    "%s has examples, a mini-dialogue, and practice prompts",
    (_id, lesson: ThaiLesson) => {
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(3);
      expect(lesson.dialogue.length).toBeGreaterThanOrEqual(2);
      expect(lesson.exercises.length).toBeGreaterThanOrEqual(1);
      expect(lesson.vocabulary.length).toBeGreaterThanOrEqual(4);
    },
  );

  it.each(lessons.map((l) => [l.id, l] as const))(
    "%s sentences carry Thai script + romanization + VI + EN",
    (_id, lesson: ThaiLesson) => {
      for (const s of lesson.sentences) {
        expect(s.th, `Thai script missing in: ${s.rtgs}`).toMatch(THAI_SCRIPT);
        expect(s.rtgs, `romanization missing for: ${s.th}`).toMatch(LATIN);
        expect(s.vi.trim().length, `VI missing for: ${s.th}`).toBeGreaterThan(0);
        expect(s.en.trim().length, `EN missing for: ${s.th}`).toBeGreaterThan(0);
        expect(s.pronunciation_focus.length).toBeGreaterThanOrEqual(1);
      }
    },
  );

  it.each(lessons.map((l) => [l.id, l] as const))(
    "%s vocabulary entries are complete (word/rtgs/vi/en/pos)",
    (_id, lesson: ThaiLesson) => {
      for (const v of lesson.vocabulary) {
        expect(v.word).toMatch(THAI_SCRIPT);
        expect(v.rtgs).toMatch(LATIN);
        expect(v.vi.trim().length).toBeGreaterThan(0);
        expect(v.en.trim().length).toBeGreaterThan(0);
        expect(v.pos.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(lessons.map((l) => [l.id, l] as const))(
    "%s dialogue lines carry Thai + romanization + VI + EN",
    (_id, lesson: ThaiLesson) => {
      for (const d of lesson.dialogue) {
        expect(d.speaker.trim().length).toBeGreaterThan(0);
        expect(d.th).toMatch(THAI_SCRIPT);
        expect(d.rtgs).toMatch(LATIN);
        expect(d.vi.trim().length).toBeGreaterThan(0);
        expect(d.en.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(
    lessons.filter((l) => l.l1_notes_vi?.length).map((l) => [l.id, l] as const),
  )("%s L1 interference notes are bilingual when present", (_id, lesson: ThaiLesson) => {
    for (const n of lesson.l1_notes_vi ?? []) {
      expect(n.mistake.trim().length).toBeGreaterThan(0);
      expect(n.fix_vi.trim().length).toBeGreaterThan(0);
      expect(n.fix_en.trim().length).toBeGreaterThan(0);
    }
  });
});
