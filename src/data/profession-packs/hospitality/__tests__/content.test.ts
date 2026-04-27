// src/data/profession-packs/hospitality/__tests__/content.test.ts
//
// Locks the lesson-shape content for the hospitality profession pack.
// Mirrors the content tests for nail-tech / restaurant / customer-
// service / healthcare / tech-worker.

import { describe, expect, it } from "vitest";

import {
  HOSPITALITY_CATEGORIES,
  HOSPITALITY_LESSONS,
  getHospitalityLessonById,
  getHospitalityLessonsByCategory,
  type HospitalityCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: HospitalityCategoryId[] = HOSPITALITY_CATEGORIES.map(
  (c) => c.id,
);

describe("HOSPITALITY_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(HOSPITALITY_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(HOSPITALITY_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of HOSPITALITY_CATEGORIES) {
      const actual = getHospitalityLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = HOSPITALITY_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });
});

describe("HOSPITALITY_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = HOSPITALITY_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with hospitality_", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      expect(lesson.id.startsWith("hospitality_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of HOSPITALITY_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

// ── Hospitality-specific guards ─────────────────────────────────────────

describe("HOSPITALITY_LESSONS — content guards", () => {
  it("phone_etiquette category surfaces guest privacy", () => {
    const phone = getHospitalityLessonsByCategory("phone_etiquette");
    const corpus = phone
      .flatMap((l) => [...l.sentences.map((s) => s.en), l.cultural_notes_vi])
      .join(" ")
      .toLowerCase();
    const ok =
      corpus.includes("privacy") ||
      corpus.includes("riêng tư") ||
      corpus.includes("can't confirm");
    expect(ok).toBe(true);
  });

  it("complaint_handling category covers escalation", () => {
    const complaints = getHospitalityLessonsByCategory("complaint_handling");
    const corpus = complaints
      .flatMap((l) => [...l.sentences.map((s) => s.en), l.tip_advice_vi])
      .join(" ")
      .toLowerCase();
    const ok =
      corpus.includes("manager") ||
      corpus.includes("quản lý") ||
      corpus.includes("escalate");
    expect(ok).toBe(true);
  });

  it("cultural_awareness category mentions tipping norms", () => {
    const culture = getHospitalityLessonsByCategory("cultural_awareness");
    const corpus = culture
      .flatMap((l) => [...l.sentences.map((s) => s.en), l.cultural_notes_vi])
      .join(" ")
      .toLowerCase();
    const ok =
      corpus.includes("tip") ||
      corpus.includes("housekeeping") ||
      corpus.includes("bellhop");
    expect(ok).toBe(true);
  });
});

// ── Helper functions ─────────────────────────────────────────────────────

describe("getHospitalityLessonById / getHospitalityLessonsByCategory", () => {
  it("getHospitalityLessonById returns the matching lesson", () => {
    const lesson = getHospitalityLessonById("hospitality_checkin_greeting");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("check_in_out");
  });

  it("getHospitalityLessonById returns undefined for unknown ids", () => {
    expect(getHospitalityLessonById("nonexistent")).toBeUndefined();
  });

  it("getHospitalityLessonsByCategory filters correctly", () => {
    const lessons = getHospitalityLessonsByCategory("concierge");
    expect(lessons.length).toBe(5);
    for (const l of lessons) expect(l.category).toBe("concierge");
  });

  it("check_in_out has the largest count (10 lessons)", () => {
    expect(getHospitalityLessonsByCategory("check_in_out").length).toBe(10);
  });

  it("complaint_handling also has 10 lessons", () => {
    expect(getHospitalityLessonsByCategory("complaint_handling").length).toBe(10);
  });
});
