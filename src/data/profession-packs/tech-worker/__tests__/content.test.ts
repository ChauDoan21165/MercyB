// src/data/profession-packs/tech-worker/__tests__/content.test.ts
//
// Locks the lesson-shape content for the tech-worker profession pack.
// Mirrors the nail-tech / customer-service test shape; enforces the
// 50-lesson brief and per-category counts.

import { describe, expect, it } from "vitest";

import {
  TECH_WORKER_CATEGORIES,
  TECH_WORKER_LESSONS,
  TECH_WORKER_PACK,
  getLessonById,
  getLessonsByCategory,
  type TechWorkerCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: TechWorkerCategoryId[] = TECH_WORKER_CATEGORIES.map(
  (c) => c.id,
);

describe("TECH_WORKER_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(TECH_WORKER_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(TECH_WORKER_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of TECH_WORKER_CATEGORIES) {
      const actual = getLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = TECH_WORKER_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });

  it("technical_interviews and pr_reviews are the heaviest categories at 10 lessons each", () => {
    expect(getLessonsByCategory("technical_interviews")).toHaveLength(10);
    expect(getLessonsByCategory("pr_reviews")).toHaveLength(10);
  });
});

describe("TECH_WORKER_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = TECH_WORKER_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with tech_worker_", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      expect(lesson.id.startsWith("tech_worker_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of TECH_WORKER_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

describe("TECH_WORKER_PACK — pack-level metadata", () => {
  it("has the canonical slug 'tech-worker'", () => {
    expect(TECH_WORKER_PACK.slug).toBe("tech-worker");
  });

  it("has bilingual title and a non-empty Vietnamese intro", () => {
    expect(TECH_WORKER_PACK.title_vi.length).toBeGreaterThan(0);
    expect(TECH_WORKER_PACK.title_en.length).toBeGreaterThan(0);
    expect(TECH_WORKER_PACK.intro_vi.length).toBeGreaterThan(40);
  });

  it("intro avoids superlative claims like 'duy nhất'", () => {
    expect(TECH_WORKER_PACK.intro_vi).not.toMatch(/duy nhất/i);
  });
});

describe("getLessonById / getLessonsByCategory", () => {
  it("getLessonById returns the matching lesson", () => {
    const lesson = getLessonById("tech_worker_interview_tell_me_about_yourself");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("technical_interviews");
  });

  it("getLessonById returns undefined for unknown ids", () => {
    expect(getLessonById("nonexistent")).toBeUndefined();
  });

  it("getLessonsByCategory filters correctly for technical_interviews (10 lessons)", () => {
    const lessons = getLessonsByCategory("technical_interviews");
    expect(lessons).toHaveLength(10);
    for (const l of lessons) expect(l.category).toBe("technical_interviews");
  });

  it("getLessonsByCategory filters correctly for oncall_incidents (5 lessons)", () => {
    const lessons = getLessonsByCategory("oncall_incidents");
    expect(lessons).toHaveLength(5);
    for (const l of lessons) expect(l.category).toBe("oncall_incidents");
  });
});
