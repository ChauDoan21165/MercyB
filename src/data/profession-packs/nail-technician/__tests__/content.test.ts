// src/data/profession-packs/nail-technician/__tests__/content.test.ts
//
// Locks the lesson-shape content for the nail-technician profession
// pack. Companion to `nail-technician.test.ts` (which validates the
// vocab/phrase/scenario JSON pack); this file enforces the 50-lesson
// brief and the per-category counts the brief specifies.

import { describe, expect, it } from "vitest";

import {
  NAIL_TECH_CATEGORIES,
  NAIL_TECH_LESSONS,
  getLessonById,
  getLessonsByCategory,
  type NailTechCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: NailTechCategoryId[] = NAIL_TECH_CATEGORIES.map(
  (c) => c.id,
);

describe("NAIL_TECH_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(NAIL_TECH_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(NAIL_TECH_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of NAIL_TECH_CATEGORIES) {
      const actual = getLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = NAIL_TECH_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });
});

describe("NAIL_TECH_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = NAIL_TECH_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with nail_tech_", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      expect(lesson.id.startsWith("nail_tech_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(
          Array.isArray(s.pronunciation_focus),
          lesson.id,
        ).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has non-empty cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of NAIL_TECH_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(20);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(20);
    }
  });
});

describe("getLessonById / getLessonsByCategory", () => {
  it("getLessonById returns the matching lesson", () => {
    const lesson = getLessonById("nail_tech_greeting_walk_in");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("greeting_seating");
  });

  it("getLessonById returns undefined for unknown ids", () => {
    expect(getLessonById("nonexistent")).toBeUndefined();
  });

  it("getLessonsByCategory filters correctly", () => {
    const lessons = getLessonsByCategory("payment_tips");
    expect(lessons.length).toBe(5);
    for (const l of lessons) expect(l.category).toBe("payment_tips");
  });
});
