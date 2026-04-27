// src/data/profession-packs/drivers/__tests__/content.test.ts
//
// Locks the lesson-shape content for the drivers profession pack.
// Mirrors the nail-tech / customer-service / tech-worker test shape;
// enforces the 50-lesson brief and per-category counts.

import { describe, expect, it } from "vitest";

import {
  DRIVER_CATEGORIES,
  DRIVER_LESSONS,
  DRIVER_PACK,
  getLessonById,
  getLessonsByCategory,
  type DriverCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: DriverCategoryId[] = DRIVER_CATEGORIES.map((c) => c.id);

describe("DRIVER_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(DRIVER_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(DRIVER_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of DRIVER_CATEGORIES) {
      const actual = getLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = DRIVER_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });

  it("pickup_confirmation and trucking_specific are the heaviest categories at 10 lessons each", () => {
    expect(getLessonsByCategory("pickup_confirmation")).toHaveLength(10);
    expect(getLessonsByCategory("trucking_specific")).toHaveLength(10);
  });
});

describe("DRIVER_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = DRIVER_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with driver_", () => {
    for (const lesson of DRIVER_LESSONS) {
      expect(lesson.id.startsWith("driver_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of DRIVER_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of DRIVER_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of DRIVER_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of DRIVER_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of DRIVER_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

describe("DRIVER_PACK — pack-level metadata", () => {
  it("has the canonical slug 'drivers'", () => {
    expect(DRIVER_PACK.slug).toBe("drivers");
  });

  it("has bilingual title and a non-empty Vietnamese intro", () => {
    expect(DRIVER_PACK.title_vi.length).toBeGreaterThan(0);
    expect(DRIVER_PACK.title_en.length).toBeGreaterThan(0);
    expect(DRIVER_PACK.intro_vi.length).toBeGreaterThan(40);
  });

  it("intro avoids superlative claims like 'duy nhất'", () => {
    expect(DRIVER_PACK.intro_vi).not.toMatch(/duy nhất/i);
  });
});

describe("getLessonById / getLessonsByCategory", () => {
  it("getLessonById returns the matching lesson", () => {
    const lesson = getLessonById("driver_pickup_name_check");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("pickup_confirmation");
  });

  it("getLessonById returns undefined for unknown ids", () => {
    expect(getLessonById("nonexistent")).toBeUndefined();
  });

  it("getLessonsByCategory filters correctly for safety_emergency (5 lessons)", () => {
    const lessons = getLessonsByCategory("safety_emergency");
    expect(lessons).toHaveLength(5);
    for (const l of lessons) expect(l.category).toBe("safety_emergency");
  });

  it("getLessonsByCategory filters correctly for trucking_specific (10 lessons)", () => {
    const lessons = getLessonsByCategory("trucking_specific");
    expect(lessons).toHaveLength(10);
    for (const l of lessons) expect(l.category).toBe("trucking_specific");
  });
});
