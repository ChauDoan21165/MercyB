// src/data/profession-packs/restaurant/__tests__/content.test.ts
//
// Locks the lesson-shape content for the restaurant profession pack.
// Mirrors the nail-tech content test (PR #169) to keep both verticals
// on the same schema bar.

import { describe, expect, it } from "vitest";

import {
  RESTAURANT_CATEGORIES,
  RESTAURANT_LESSONS,
  getRestaurantLessonById,
  getRestaurantLessonsByCategory,
  type RestaurantCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: RestaurantCategoryId[] = RESTAURANT_CATEGORIES.map(
  (c) => c.id,
);

describe("RESTAURANT_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(RESTAURANT_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(RESTAURANT_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of RESTAURANT_CATEGORIES) {
      const actual = getRestaurantLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = RESTAURANT_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });
});

describe("RESTAURANT_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = RESTAURANT_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with restaurant_", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      expect(lesson.id.startsWith("restaurant_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of RESTAURANT_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

describe("getRestaurantLessonById / getRestaurantLessonsByCategory", () => {
  it("getRestaurantLessonById returns the matching lesson", () => {
    const lesson = getRestaurantLessonById("restaurant_greeting_walk_in");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("greeting_seating");
  });

  it("getRestaurantLessonById returns undefined for unknown ids", () => {
    expect(getRestaurantLessonById("nonexistent")).toBeUndefined();
  });

  it("getRestaurantLessonsByCategory filters correctly", () => {
    const lessons = getRestaurantLessonsByCategory("payment_tipping");
    expect(lessons.length).toBe(5);
    for (const l of lessons) expect(l.category).toBe("payment_tipping");
  });

  it("menu_explanation has the largest category (10 lessons)", () => {
    expect(getRestaurantLessonsByCategory("menu_explanation").length).toBe(10);
  });

  it("special_requests covers 10 dietary scenarios", () => {
    expect(getRestaurantLessonsByCategory("special_requests").length).toBe(10);
  });
});
