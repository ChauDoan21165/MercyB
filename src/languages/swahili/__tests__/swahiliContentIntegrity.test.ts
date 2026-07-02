import { describe, expect, it } from "vitest";

import {
  SWAHILI_LESSONS_BY_LEVEL,
  allSwahiliLessons,
} from "../index";

describe("Swahili content integrity", () => {
  it("registers A1 through C2 levels", () => {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
    expect(Object.keys(SWAHILI_LESSONS_BY_LEVEL)).toEqual(levels);
  });

  it("all six levels A1 through C2 have lessons", () => {
    expect(SWAHILI_LESSONS_BY_LEVEL.A1.length).toBeGreaterThan(0);
    expect(SWAHILI_LESSONS_BY_LEVEL.A2.length).toBeGreaterThan(0);
    expect(SWAHILI_LESSONS_BY_LEVEL.B1.length).toBeGreaterThan(0);
    expect(SWAHILI_LESSONS_BY_LEVEL.B2.length).toBeGreaterThan(0);
    expect(SWAHILI_LESSONS_BY_LEVEL.C1.length).toBeGreaterThan(0);
    expect(SWAHILI_LESSONS_BY_LEVEL.C2.length).toBeGreaterThan(0);
  });

  it("has exactly 7 A1 lessons covering all A1 categories", () => {
    const a1 = SWAHILI_LESSONS_BY_LEVEL.A1;
    expect(a1.length).toBe(7);

    const categories = a1.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "directions",
      "family",
      "food",
      "greetings",
      "introductions",
      "numbers",
      "questions",
    ]);
  });

  it("has exactly 6 A2 lessons", () => {
    const a2 = SWAHILI_LESSONS_BY_LEVEL.A2;
    expect(a2.length).toBe(6);

    const categories = a2.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "daily_routine",
      "housing",
      "shopping",
      "time",
      "transport",
      "weather",
    ]);
  });

  it("has exactly 5 B1 lessons", () => {
    const b1 = SWAHILI_LESSONS_BY_LEVEL.B1;
    expect(b1.length).toBe(5);

    const categories = b1.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "health_pharmacy",
      "opinions_reasons",
      "past_narration",
      "public_services",
      "work_tasks",
    ]);
  });

  it("has exactly 5 B2 lessons", () => {
    const b2 = SWAHILI_LESSONS_BY_LEVEL.B2;
    expect(b2.length).toBe(5);

    const categories = b2.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "debate",
      "media",
      "reported_speech",
      "verb_extensions",
      "workplace",
    ]);
  });

  it("has exactly 14 C1 lessons covering all C1 categories", () => {
    const c1 = SWAHILI_LESSONS_BY_LEVEL.C1;
    expect(c1.length).toBe(14);

    const categories = c1.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "academic",
      "business",
      "complex_sentences",
      "conditional",
      "cultural_nuances",
      "debate",
      "idioms_proverbs",
      "literary",
      "narrative",
      "noun_classes",
      "opinions",
      "register",
      "relative_clauses",
      "verb_extensions",
    ]);
  });

  it("has exactly 10 C2 lessons", () => {
    const c2 = SWAHILI_LESSONS_BY_LEVEL.C2;
    expect(c2.length).toBe(10);

    const categories = c2.map((l: unknown) => l.category).sort();
    expect(categories).toEqual([
      "academic_discourse",
      "advanced_grammar",
      "debate",
      "formal_register",
      "idioms_proverbs",
      "legal_admin",
      "literary_analysis",
      "news_editorial",
      "philosophical",
      "political_diplomacy",
    ]);
  });

  it("total flattened matches sum of levels", () => {
    const total = Object.values(SWAHILI_LESSONS_BY_LEVEL).reduce(
      (sum, arr) => sum + arr.length,
      0,
    );
    expect(allSwahiliLessons.length).toBe(total);
  });

  it("all lesson IDs are unique across all levels", () => {
    const ids = allSwahiliLessons.map((l: unknown) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each lesson has required fields", () => {
    for (const lesson of allSwahiliLessons) {
      const l = lesson as unknown;
      expect(l.id).toBeTruthy();
      expect(l.id).toMatch(/^swahili_/);
      expect(l.level).toBeTruthy();
      expect(l.title_vi).toBeTruthy();
      expect(l.title_en).toBeTruthy();
      expect(l.sentences).toBeTruthy();
      expect(l.sentences.length).toBeGreaterThan(0);
      expect(l.category).toBeTruthy();
    }
  });

  it("every A1 sentence has vi field", () => {
    for (const s of SWAHILI_LESSONS_BY_LEVEL.A1.flatMap((l: unknown) => l.sentences)) {
      expect(s.vi).toBeTruthy();
    }
  });

  it("every B1/B2/C1/C2 sentence has sw, vi, en fields", () => {
    for (const level of ["B1", "B2", "C1", "C2"] as const) {
      for (const lesson of SWAHILI_LESSONS_BY_LEVEL[level]) {
        for (const s of (lesson as unknown).sentences) {
          expect(s.sw).toBeTruthy();
          expect(s.vi).toBeTruthy();
          expect(s.en).toBeTruthy();
        }
      }
    }
  });

  it("every B1/B2/C1/C2 lesson has vocabulary", () => {
    for (const level of ["B1", "B2", "C1", "C2"] as const) {
      for (const lesson of SWAHILI_LESSONS_BY_LEVEL[level]) {
        const l = lesson as unknown;
        expect(l.vocabulary).toBeTruthy();
        expect(l.vocabulary.length).toBeGreaterThanOrEqual(3);
      }
    }
  });

  it("every lesson normalizes without throwing", async () => {
    const { normalizeSwahiliLesson } = await import("../normalize");
    for (const lesson of allSwahiliLessons) {
      expect(() => normalizeSwahiliLesson(lesson)).not.toThrow();
    }
  });
});
