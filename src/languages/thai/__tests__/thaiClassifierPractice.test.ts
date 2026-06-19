// src/languages/thai/__tests__/thaiClassifierPractice.test.ts
//
// Structural guards for the Thai classifier practice bank (A3 Wave 4).
// These pin the drill-card contract — NOT linguistic correctness (native
// review is deferred; some nouns accept more than one classifier). They check
// item count, category coverage, Thai script + romanization on noun and
// classifier, a worked example, a bilingual common-mistake, and a practice
// prompt with an answer key.

import { describe, it, expect } from "vitest";

import { items } from "@/languages/thai/classifierPractice";

const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const REQUIRED_CATEGORIES = [
  "people",
  "objects",
  "animals",
  "vehicles",
  "books_documents",
  "food_drink",
  "places",
  "general",
] as const;

describe("Thai classifier practice — batch shape", () => {
  it("ships 60–120 compact items", () => {
    expect(items.length).toBeGreaterThanOrEqual(60);
    expect(items.length).toBeLessThanOrEqual(120);
  });

  it("item ids are unique", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required category at least once", () => {
    const present = new Set(items.map((i) => i.category));
    for (const c of REQUIRED_CATEGORIES) expect(present.has(c)).toBe(true);
  });

  it("only uses valid categories", () => {
    for (const i of items) {
      expect(REQUIRED_CATEGORIES.includes(i.category)).toBe(true);
    }
  });
});

describe("Thai classifier practice — card contract", () => {
  it("noun and classifier are Thai script with romanization + EN/VI gloss", () => {
    for (const i of items) {
      expect(hasThai(i.noun)).toBe(true);
      expect(nonEmpty(i.noun_rtgs)).toBe(true);
      expect(nonEmpty(i.noun_en)).toBe(true);
      expect(nonEmpty(i.noun_vi)).toBe(true);
      expect(hasThai(i.classifier)).toBe(true);
      expect(nonEmpty(i.classifier_rtgs)).toBe(true);
      expect(nonEmpty(i.classifier_en)).toBe(true);
      expect(nonEmpty(i.classifier_vi)).toBe(true);
    }
  });

  it("each item has a worked Thai example with romanization + VI/EN", () => {
    for (const i of items) {
      expect(hasThai(i.example_th)).toBe(true);
      expect(nonEmpty(i.example_rtgs)).toBe(true);
      expect(nonEmpty(i.example_vi)).toBe(true);
      expect(nonEmpty(i.example_en)).toBe(true);
    }
  });

  it("each item documents a bilingual common mistake", () => {
    for (const i of items) {
      expect(nonEmpty(i.common_mistake_vi)).toBe(true);
      expect(nonEmpty(i.common_mistake_en)).toBe(true);
    }
  });

  it("each item has a bilingual practice prompt with a Thai answer key", () => {
    for (const i of items) {
      expect(nonEmpty(i.practice_prompt_vi)).toBe(true);
      expect(nonEmpty(i.practice_prompt_en)).toBe(true);
      expect(hasThai(i.practice_answer_th)).toBe(true);
    }
  });

  it("the example and answer key both contain the item's classifier", () => {
    for (const i of items) {
      expect(i.example_th.includes(i.classifier)).toBe(true);
      expect(i.practice_answer_th.includes(i.classifier)).toBe(true);
    }
  });
});
