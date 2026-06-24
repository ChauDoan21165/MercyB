// Structure + content guard for the Punjabi survival lesson pack.

import { describe, expect, it } from "vitest";

import punjabiSurvivalLessons, {
  punjabiSurvivalLessons as namedExport,
  type PunjabiSurvivalCategory,
} from "@/languages/punjabi/lessons-survival";

// Gurmukhi block: U+0A00-U+0A7F.
const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_CATEGORIES: PunjabiSurvivalCategory[] = [
  "emergency",
  "clinic_pharmacy",
  "school",
  "workplace",
  "transit",
  "housing",
  "bank",
  "public_office",
  "interpreter_request",
  "forms",
  "food_allergy",
  "lost_documents",
];

describe("Punjabi survival pack — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(punjabiSurvivalLessons)).toBe(true);
    expect(namedExport).toBe(punjabiSurvivalLessons);
  });
});

describe("Punjabi survival pack — size and ids", () => {
  it("has 12-20 compact lessons", () => {
    expect(punjabiSurvivalLessons.length).toBeGreaterThanOrEqual(12);
    expect(punjabiSurvivalLessons.length).toBeLessThanOrEqual(20);
  });

  it("uses unique non-empty ids", () => {
    const ids = punjabiSurvivalLessons.map((lesson) => lesson.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Punjabi survival pack — required domain coverage", () => {
  it("covers every required survival category", () => {
    const present = new Set(punjabiSurvivalLessons.map((lesson) => lesson.category));
    for (const category of REQUIRED_CATEGORIES) {
      expect(present.has(category), `missing required category: ${category}`).toBe(true);
    }
  });
});

describe("Punjabi survival pack — bilingual + script invariants", () => {
  for (const lesson of punjabiSurvivalLessons) {
    describe(`${lesson.id} — ${lesson.title_en}`, () => {
      it("has Gurmukhi + VI + EN titles", () => {
        expect(lesson.title_pa).toMatch(GURMUKHI_BLOCK);
        expect(lesson.title_vi.length).toBeGreaterThan(0);
        expect(lesson.title_en.length).toBeGreaterThan(0);
      });

      it("has VI + EN scenario explanations", () => {
        expect(lesson.scenario_vi.length).toBeGreaterThan(0);
        expect(lesson.scenario_en.length).toBeGreaterThan(0);
      });

      it("has phrases with Gurmukhi, romanization, VI, and EN", () => {
        expect(lesson.phrases.length).toBeGreaterThanOrEqual(4);
        for (const phrase of lesson.phrases) {
          expect(phrase.pa).toMatch(GURMUKHI_BLOCK);
          expect(phrase.roman.length).toBeGreaterThan(0);
          expect(phrase.vi.length).toBeGreaterThan(0);
          expect(phrase.en.length).toBeGreaterThan(0);
        }
      });

      it("has vocab with Gurmukhi, romanization, VI, and EN", () => {
        expect(lesson.vocab.length).toBeGreaterThanOrEqual(3);
        for (const vocab of lesson.vocab) {
          expect(vocab.pa).toMatch(GURMUKHI_BLOCK);
          expect(vocab.roman.length).toBeGreaterThan(0);
          expect(vocab.vi.length).toBeGreaterThan(0);
          expect(vocab.en.length).toBeGreaterThan(0);
        }
      });

      it("has copy-paste Gurmukhi lines", () => {
        expect(lesson.copy_paste.length).toBeGreaterThanOrEqual(1);
        for (const line of lesson.copy_paste) {
          expect(line).toMatch(GURMUKHI_BLOCK);
        }
      });

      it("has matching VI + EN practice prompts", () => {
        expect(lesson.practice_prompts_vi.length).toBeGreaterThanOrEqual(1);
        expect(lesson.practice_prompts_en.length).toBe(lesson.practice_prompts_vi.length);
      });
    });
  }
});
