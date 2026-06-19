import { describe, expect, it } from "vitest";

import {
  HINDI_LESSONS_BY_LEVEL,
  HINDI_VALIDATED_LEVELS,
  allHindiLessons,
  normalizeHindiLesson,
  type HindiLesson,
} from "../index";

const devanagariRe = /[\p{Script=Devanagari}]/u;
const expectedCounts = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 5,
  C2: 4,
} as const;

describe("Hindi curriculum integrity", () => {
  it("imports the validated lesson arrays through the public index in CEFR order", () => {
    expect(Object.keys(HINDI_LESSONS_BY_LEVEL)).toEqual([...HINDI_VALIDATED_LEVELS]);
    expect(allHindiLessons).toHaveLength(
      Object.values(expectedCounts).reduce((total, count) => total + count, 0),
    );
  });

  it("matches the expected counts by level and keeps lesson ids unique", () => {
    const seenIds = new Set<string>();

    for (const level of HINDI_VALIDATED_LEVELS) {
      const lessons = HINDI_LESSONS_BY_LEVEL[level];
      expect(lessons).toHaveLength(expectedCounts[level]);

      for (const lesson of lessons) {
        expect(lesson.level).toBe(level);
        expect(seenIds.has(lesson.id)).toBe(false);
        seenIds.add(lesson.id);
      }
    }
  });

  it("keeps the required learner-facing fields and native script in every lesson", () => {
    for (const lesson of allHindiLessons as HindiLesson[]) {
      expect(lesson.title_vi.trim()).not.toBe("");
      expect(lesson.title_en.trim()).not.toBe("");
      expect(lesson.intro_vi.trim()).not.toBe("");
      expect(lesson.intro_en.trim()).not.toBe("");
      expect(lesson.sentences.length).toBeGreaterThan(0);

      const nativeText = [
        ...(lesson.sentences ?? []).map((sentence) => sentence.hi),
        ...(lesson.vocabulary ?? []).map((entry) => entry.hi),
        ...(lesson.dialogue ?? []).map((line) => line.hi),
      ].join(" ");

      expect(nativeText).toMatch(devanagariRe);

      for (const sentence of lesson.sentences) {
        expect(sentence.hi.trim()).not.toBe("");
        expect(sentence.romanization.trim()).not.toBe("");
        expect(sentence.en.trim()).not.toBe("");
        expect(sentence.vi.trim()).not.toBe("");
      }

      for (const entry of lesson.vocabulary ?? []) {
        expect(entry.hi.trim()).not.toBe("");
        expect(entry.romanization.trim()).not.toBe("");
        expect(entry.en.trim()).not.toBe("");
        expect(entry.vi.trim()).not.toBe("");
      }

      for (const line of lesson.dialogue ?? []) {
        expect(line.hi.trim()).not.toBe("");
        expect(line.romanization.trim()).not.toBe("");
        expect(line.en.trim()).not.toBe("");
        expect(line.vi.trim()).not.toBe("");
      }
    }
  });

  it("normalizes every validated lesson without requiring audio", () => {
    for (const lesson of allHindiLessons as HindiLesson[]) {
      const normalized = normalizeHindiLesson(lesson);

      expect(normalized.id).toEqual(expect.any(Number));
      expect(normalized.level).toBe(lesson.level);
      expect(normalized.title).toEqual({
        vi: lesson.title_vi,
        en: lesson.title_en,
      });
      expect(normalized.sentences).toHaveLength(lesson.sentences.length);
      expect(normalized.audioBase).toBeUndefined();
      expect(normalized.audioKinds).toBeUndefined();
    }
  });
});
