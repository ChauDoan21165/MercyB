// src/data/profession-packs/customer-service/__tests__/content.test.ts
//
// Locks the lesson-shape content for the customer-service profession
// pack. Companion to the nail-technician content tests — same shape,
// different vertical. Enforces the 50-lesson brief and per-category
// counts.

import { describe, expect, it } from "vitest";

import {
  CUSTOMER_SERVICE_CATEGORIES,
  CUSTOMER_SERVICE_LESSONS,
  CUSTOMER_SERVICE_PACK,
  getLessonById,
  getLessonsByCategory,
  type CustomerServiceCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: CustomerServiceCategoryId[] =
  CUSTOMER_SERVICE_CATEGORIES.map((c) => c.id);

describe("CUSTOMER_SERVICE_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(CUSTOMER_SERVICE_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(CUSTOMER_SERVICE_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of CUSTOMER_SERVICE_CATEGORIES) {
      const actual = getLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = CUSTOMER_SERVICE_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });

  it("de_escalation and policy_no_kindly are the heaviest categories at 10 lessons each", () => {
    expect(getLessonsByCategory("de_escalation")).toHaveLength(10);
    expect(getLessonsByCategory("policy_no_kindly")).toHaveLength(10);
  });
});

describe("CUSTOMER_SERVICE_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = CUSTOMER_SERVICE_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with customer_service_", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      expect(lesson.id.startsWith("customer_service_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of CUSTOMER_SERVICE_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

describe("CUSTOMER_SERVICE_PACK — pack-level metadata", () => {
  it("has the canonical slug 'customer-service'", () => {
    expect(CUSTOMER_SERVICE_PACK.slug).toBe("customer-service");
  });

  it("has bilingual title and a non-empty Vietnamese intro", () => {
    expect(CUSTOMER_SERVICE_PACK.title_vi.length).toBeGreaterThan(0);
    expect(CUSTOMER_SERVICE_PACK.title_en.length).toBeGreaterThan(0);
    expect(CUSTOMER_SERVICE_PACK.intro_vi.length).toBeGreaterThan(40);
  });
});

describe("getLessonById / getLessonsByCategory", () => {
  it("getLessonById returns the matching lesson", () => {
    const lesson = getLessonById("customer_service_opening_standard_greeting");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("opening_verification");
  });

  it("getLessonById returns undefined for unknown ids", () => {
    expect(getLessonById("nonexistent")).toBeUndefined();
  });

  it("getLessonsByCategory filters correctly for de_escalation (10 lessons)", () => {
    const lessons = getLessonsByCategory("de_escalation");
    expect(lessons).toHaveLength(10);
    for (const l of lessons) expect(l.category).toBe("de_escalation");
  });

  it("getLessonsByCategory filters correctly for closing_satisfaction (5 lessons)", () => {
    const lessons = getLessonsByCategory("closing_satisfaction");
    expect(lessons).toHaveLength(5);
    for (const l of lessons) expect(l.category).toBe("closing_satisfaction");
  });
});
