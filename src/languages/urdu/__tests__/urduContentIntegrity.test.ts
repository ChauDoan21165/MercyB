import { describe, expect, it } from "vitest";

import {
  URDU_LESSONS_BY_LEVEL,
  URDU_VALIDATED_LEVELS,
  allUrduLessons,
  normalizeUrduLesson,
  type UrduLesson,
} from "../index";

const urduScriptRe = /[\p{Script=Arabic}]/u;
const expectedCounts = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 4,
  C2: 5,
} as const;

describe("Urdu curriculum integrity", () => {
  it("imports the validated lesson arrays through the public index in CEFR order", () => {
    expect(Object.keys(URDU_LESSONS_BY_LEVEL)).toEqual([...URDU_VALIDATED_LEVELS]);
    expect(allUrduLessons).toHaveLength(
      Object.values(expectedCounts).reduce((total, count) => total + count, 0),
    );
  });

  it("matches the expected counts by level and keeps lesson ids unique", () => {
    const seenIds = new Set<string>();

    for (const level of URDU_VALIDATED_LEVELS) {
      const lessons = URDU_LESSONS_BY_LEVEL[level];
      expect(lessons).toHaveLength(expectedCounts[level]);

      for (const lesson of lessons) {
        expect(lesson.level).toBe(level);
        expect(seenIds.has(lesson.id)).toBe(false);
        seenIds.add(lesson.id);
      }
    }
  });

  it("keeps the required learner-facing fields and native script in every lesson", () => {
    for (const lesson of allUrduLessons as UrduLesson[]) {
      expect(lesson.title_vi.trim()).not.toBe("");
      expect(lesson.title_en.trim()).not.toBe("");
      expect(lesson.intro_vi.trim()).not.toBe("");
      expect(lesson.intro_en.trim()).not.toBe("");
      expect(lesson.sentences.length).toBeGreaterThan(0);

      const nativeText = [
        ...(lesson.sentences ?? []).map((sentence) => sentence.ur),
        ...(lesson.vocabulary ?? []).map((entry) => entry.ur),
        ...(lesson.dialogue ?? []).map((line) => line.ur),
      ].join(" ");

      expect(nativeText).toMatch(urduScriptRe);

      for (const sentence of lesson.sentences) {
        expect(sentence.ur.trim()).not.toBe("");
        expect(sentence.romanization.trim()).not.toBe("");
        expect(sentence.en.trim()).not.toBe("");
        expect(sentence.vi.trim()).not.toBe("");
      }

      for (const entry of lesson.vocabulary ?? []) {
        expect(entry.ur.trim()).not.toBe("");
        expect(entry.romanization.trim()).not.toBe("");
        expect(entry.en.trim()).not.toBe("");
        expect(entry.vi.trim()).not.toBe("");
      }

      for (const line of lesson.dialogue ?? []) {
        expect(line.ur.trim()).not.toBe("");
        expect(line.romanization.trim()).not.toBe("");
        expect(line.en.trim()).not.toBe("");
        expect(line.vi.trim()).not.toBe("");
      }
    }
  });

  it("normalizes every validated lesson without requiring audio", () => {
    for (const lesson of allUrduLessons as UrduLesson[]) {
      const normalized = normalizeUrduLesson(lesson);

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
