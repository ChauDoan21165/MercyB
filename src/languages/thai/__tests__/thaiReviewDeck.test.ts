// src/languages/thai/__tests__/thaiReviewDeck.test.ts
//
// Structure guard for the Thai review-deck SEED DATA (Wave 2).
//
// Pins the task requirements:
//   • 150–300 review cards
//   • Thai script + romanization on every card
//   • Vietnamese gloss + English gloss on every card
//   • level + category + prompt + answer on every card
//   • the 8 required categories all present
//   • distractors, where present, are non-empty Thai-script arrays that
//     never include the answer itself
//
// Everything is derived from the data at runtime, so the suite stays green
// as content is added/refined and fails only on a structural regression.

import { describe, it, expect } from "vitest";

import thaiReviewDeck, {
  thaiReviewDeck as namedExport,
  THAI_REVIEW_CATEGORIES,
  type ThaiReviewCategory,
  type ThaiReviewLevel,
} from "@/languages/thai/reviewDeck";

const THAI_BLOCK = /[฀-๿]/;

const REQUIRED_CATEGORIES: ThaiReviewCategory[] = [
  "vocab",
  "phrase",
  "classifier",
  "particle",
  "word_order",
  "politeness",
  "survival_phrase",
  "tone_awareness",
];

const VALID_LEVELS: ThaiReviewLevel[] = ["A1", "A2", "B1", "B2"];

describe("Thai review deck — exports", () => {
  it("default and named exports are the same array", () => {
    expect(Array.isArray(thaiReviewDeck)).toBe(true);
    expect(namedExport).toBe(thaiReviewDeck);
  });
});

describe("Thai review deck — size and ids", () => {
  it("has 150–300 cards", () => {
    expect(thaiReviewDeck.length).toBeGreaterThanOrEqual(150);
    expect(thaiReviewDeck.length).toBeLessThanOrEqual(300);
  });

  it("every id is unique and non-empty", () => {
    const ids = thaiReviewDeck.map((c) => c.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai review deck — required category coverage", () => {
  it("covers all 8 required categories", () => {
    const present = new Set(thaiReviewDeck.map((c) => c.category));
    for (const cat of REQUIRED_CATEGORIES) {
      expect(present.has(cat), `missing category: ${cat}`).toBe(true);
    }
  });

  it("THAI_REVIEW_CATEGORIES matches the required set", () => {
    expect([...THAI_REVIEW_CATEGORIES].sort()).toEqual(
      [...REQUIRED_CATEGORIES].sort(),
    );
  });
});

describe("Thai review deck — per-card invariants", () => {
  it("every card has Thai script, romanization, VI + EN glosses", () => {
    for (const c of thaiReviewDeck) {
      expect(c.th, `${c.id} missing Thai script`).toMatch(THAI_BLOCK);
      expect(c.rtgs.length, `${c.id} missing romanization`).toBeGreaterThan(0);
      expect(c.vi.length, `${c.id} missing VI gloss`).toBeGreaterThan(0);
      expect(c.en.length, `${c.id} missing EN gloss`).toBeGreaterThan(0);
    }
  });

  it("every card has a valid level, prompts (VI + EN), and an answer", () => {
    for (const c of thaiReviewDeck) {
      expect(VALID_LEVELS, `${c.id} bad level`).toContain(c.level);
      expect(c.prompt_vi.length, `${c.id} missing VI prompt`).toBeGreaterThan(0);
      expect(c.prompt_en.length, `${c.id} missing EN prompt`).toBeGreaterThan(0);
      expect(c.answer.length, `${c.id} missing answer`).toBeGreaterThan(0);
    }
  });

  it("distractors, where present, are Thai-script arrays excluding the answer", () => {
    for (const c of thaiReviewDeck) {
      if (c.distractors === undefined) continue;
      expect(Array.isArray(c.distractors)).toBe(true);
      expect(c.distractors.length).toBeGreaterThan(0);
      for (const d of c.distractors) {
        expect(d, `${c.id} distractor not Thai`).toMatch(THAI_BLOCK);
        expect(d, `${c.id} distractor equals answer`).not.toBe(c.answer);
      }
    }
  });
});

describe("Thai review deck — content breadth sanity", () => {
  it("has at least one multiple-choice card (with distractors)", () => {
    expect(thaiReviewDeck.some((c) => (c.distractors?.length ?? 0) > 0)).toBe(true);
  });

  it("has a meaningful spread across categories (each required cat ≥ 5 cards)", () => {
    for (const cat of REQUIRED_CATEGORIES) {
      const n = thaiReviewDeck.filter((c) => c.category === cat).length;
      expect(n, `too few cards in ${cat}`).toBeGreaterThanOrEqual(5);
    }
  });
});
