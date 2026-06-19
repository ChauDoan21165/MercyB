import { describe, expect, it } from "vitest";

import a1Lessons from "../lessons-a1";
import a2Lessons from "../lessons-a2";
import b1Lessons from "../lessons-b1";
import b2Lessons from "../lessons-b2";
import c1Lessons from "../lessons-c1";
import c2Lessons from "../lessons-c2";
import {
  PORTUGUESE_CATEGORIES,
  PORTUGUESE_TOTAL_LESSONS,
  PORTUGUESE_VALIDATED_LEVELS,
  type PortugueseCategoryId,
  type PortugueseLesson,
} from "../lessons";
import { normalizePortugueseLesson } from "../normalize";
import {
  PORTUGUESE_LESSONS_BY_LEVEL,
  allPortugueseLessons,
} from "../index";

const lessonGroups = {
  A1: a1Lessons,
  A2: a2Lessons,
  B1: b1Lessons,
  B2: b2Lessons,
  C1: c1Lessons,
  C2: c2Lessons,
} as const;

const expectedCounts = {
  A1: 5,
  A2: 6,
  B1: 5,
  B2: 5,
  C1: 4,
  C2: 5,
} as const;

const categoryIds = new Set(PORTUGUESE_CATEGORIES.map((category) => category.id));

describe("Portuguese top-level curriculum integrity", () => {
  it("imports only validated top-level lesson files in the expected CEFR order", () => {
    expect(Object.keys(lessonGroups)).toEqual([...PORTUGUESE_VALIDATED_LEVELS]);
    expect(PORTUGUESE_LESSONS_BY_LEVEL.B1).toHaveLength(5);
    expect(allPortugueseLessons).toHaveLength(PORTUGUESE_TOTAL_LESSONS);
  });

  it("matches the metadata counts by level and category", () => {
    const categoryCounts = new Map<PortugueseCategoryId, number>();
    let total = 0;

    for (const [level, lessons] of Object.entries(lessonGroups)) {
      expect(lessons).toHaveLength(expectedCounts[level as keyof typeof expectedCounts]);
      total += lessons.length;

      for (const lesson of lessons as PortugueseLesson[]) {
        expect(lesson.level).toBe(level);
        expect(categoryIds.has(lesson.category)).toBe(true);
        categoryCounts.set(lesson.category, (categoryCounts.get(lesson.category) ?? 0) + 1);
      }
    }

    expect(total).toBe(PORTUGUESE_TOTAL_LESSONS);
    for (const category of PORTUGUESE_CATEGORIES) {
      expect(categoryCounts.get(category.id)).toBe(category.expected_count);
    }
  });

  it("has unique ids and required learner-facing fields", () => {
    const seenIds = new Set<string>();

    for (const lessons of Object.values(lessonGroups)) {
      for (const lesson of lessons as PortugueseLesson[]) {
        expect(lesson.id).toMatch(/^portuguese_|^la|^lo/);
        expect(seenIds.has(lesson.id)).toBe(false);
        seenIds.add(lesson.id);
        expect(lesson.title_vi.trim()).not.toBe("");
        expect(lesson.title_en.trim()).not.toBe("");
        const sentences = lesson.sentences ?? [];
        expect(sentences.length).toBeGreaterThan(0);
        expect(lesson.cultural_notes_vi?.trim()).not.toBe("");
        expect(lesson.tip_advice_vi?.trim()).not.toBe("");

        for (const sentence of sentences) {
          expect(sentence.vi.trim()).not.toBe("");
          expect((sentence.pt ?? sentence.en ?? "").trim()).not.toBe("");
        }
      }
    }
  });

  it("normalizes every validated top-level lesson without requiring audio", () => {
    for (const lesson of allPortugueseLessons as PortugueseLesson[]) {
      const normalized = normalizePortugueseLesson(lesson);
      const sentences = lesson.sentences ?? [];
      expect(normalized.id).toEqual(expect.any(Number));
      expect(normalized.level).toBe(lesson.level);
      expect(normalized.title).toEqual({
        vi: lesson.title_vi,
        en: lesson.title_en,
      });
      expect(normalized.sentences).toHaveLength(sentences.length);
      expect(normalized.audioBase).toBeUndefined();
    }
  });
});
