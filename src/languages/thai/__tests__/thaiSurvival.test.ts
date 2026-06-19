// src/languages/thai/__tests__/thaiSurvival.test.ts
//
// Structure + content guard for the Thai SURVIVAL lesson pack.
//
// These tests pin the task requirements (A8: Thai Survival):
//   • 12–20 compact survival lessons
//   • Thai script + romanization on every phrase/vocab
//   • Vietnamese AND English explanations everywhere
//   • copy-paste phrases + practice prompts on every lesson
//   • coverage of the required survival domains
//
// They derive everything from the data at runtime (no hard-coded content
// beyond the required-category list), so the suite stays green as content
// is refined — it fails only if a structural requirement regresses.

import { describe, it, expect } from "vitest";

import thaiSurvivalLessons, {
  thaiSurvivalLessons as namedExport,
  type ThaiSurvivalCategory,
} from "@/languages/thai/lessons-survival";

// Thai script lives in the U+0E00–U+0E7F Unicode block.
const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_CATEGORIES: ThaiSurvivalCategory[] = [
  "emergency",
  "hospital_pharmacy",
  "police_documents",
  "taxi_transport",
  "hotel",
  "food_allergy",
  "money_bank",
  "sim_phone",
  "immigration",
  "work_first_day",
];

describe("Thai survival pack — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiSurvivalLessons)).toBe(true);
    expect(namedExport).toBe(thaiSurvivalLessons);
  });
});

describe("Thai survival pack — size and ids", () => {
  it("has 12–20 lessons", () => {
    expect(thaiSurvivalLessons.length).toBeGreaterThanOrEqual(12);
    expect(thaiSurvivalLessons.length).toBeLessThanOrEqual(20);
  });

  it("every lesson id is unique and non-empty", () => {
    const ids = thaiSurvivalLessons.map((l) => l.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai survival pack — required domain coverage", () => {
  it("covers every required survival category", () => {
    const present = new Set(thaiSurvivalLessons.map((l) => l.category));
    for (const cat of REQUIRED_CATEGORIES) {
      expect(present.has(cat), `missing required category: ${cat}`).toBe(true);
    }
  });
});

describe("Thai survival pack — bilingual + script invariants", () => {
  for (const lesson of thaiSurvivalLessons) {
    describe(`${lesson.id} — ${lesson.title_en}`, () => {
      it("has Thai-script + VI + EN titles", () => {
        expect(lesson.title_th).toMatch(THAI_BLOCK);
        expect(lesson.title_vi.length).toBeGreaterThan(0);
        expect(lesson.title_en.length).toBeGreaterThan(0);
      });

      it("has VI + EN scenario explanations", () => {
        expect(lesson.scenario_vi.length).toBeGreaterThan(0);
        expect(lesson.scenario_en.length).toBeGreaterThan(0);
      });

      it("has at least 4 phrases, each with Thai script, romanization, VI + EN", () => {
        expect(lesson.phrases.length).toBeGreaterThanOrEqual(4);
        for (const p of lesson.phrases) {
          expect(p.th, `${lesson.id} phrase missing Thai`).toMatch(THAI_BLOCK);
          expect(p.rtgs.length, `${lesson.id} phrase missing romanization`).toBeGreaterThan(0);
          expect(p.vi.length, `${lesson.id} phrase missing VI`).toBeGreaterThan(0);
          expect(p.en.length, `${lesson.id} phrase missing EN`).toBeGreaterThan(0);
        }
      });

      it("has vocab with Thai script, romanization, VI + EN", () => {
        expect(lesson.vocab.length).toBeGreaterThanOrEqual(3);
        for (const v of lesson.vocab) {
          expect(v.th).toMatch(THAI_BLOCK);
          expect(v.rtgs.length).toBeGreaterThan(0);
          expect(v.vi.length).toBeGreaterThan(0);
          expect(v.en.length).toBeGreaterThan(0);
        }
      });

      it("has copy-paste Thai phrases", () => {
        expect(lesson.copy_paste.length).toBeGreaterThanOrEqual(1);
        for (const line of lesson.copy_paste) {
          expect(line).toMatch(THAI_BLOCK);
        }
      });

      it("has matching VI + EN practice prompts", () => {
        expect(lesson.practice_prompts_vi.length).toBeGreaterThanOrEqual(1);
        expect(lesson.practice_prompts_en.length).toBe(
          lesson.practice_prompts_vi.length,
        );
      });
    });
  }
});
