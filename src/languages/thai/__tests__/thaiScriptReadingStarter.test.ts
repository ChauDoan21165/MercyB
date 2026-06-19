// src/languages/thai/__tests__/thaiScriptReadingStarter.test.ts
//
// Structural + integrity guards for the Thai script reading starter. Pins the
// data contract an app layer renders against — count, category coverage
// (consonants, vowels, spacing, signs, tone marks, short words, street-sign
// phrases), Thai script + romanization presence, and bilingual VI + EN
// explanations — without hard-coding individual content.
//
// No audio / no pronunciation scoring is implied. Native-speaker review is
// DEFERRED; these tests do NOT assert linguistic correctness, only
// well-formedness.

import { describe, it, expect } from "vitest";

import starter, {
  scriptReadingStarter as named,
  type ThaiReadingItem,
  type ThaiReadingCategory,
} from "@/languages/thai/scriptReadingStarter";

// At least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;
// At least one Latin letter (romanization sanity check).
const LATIN = /[a-zA-Z]/;

const REQUIRED_CATEGORIES: ThaiReadingCategory[] = [
  "consonant",
  "vowel",
  "spacing",
  "sign",
  "tone_mark",
  "short_word",
  "street_phrase",
];

describe("Thai script reading starter — shape", () => {
  it("exports the same array as default and named `scriptReadingStarter`", () => {
    expect(starter).toBe(named);
    expect(Array.isArray(starter)).toBe(true);
  });

  it("contains 40–80 compact reading items", () => {
    expect(starter.length).toBeGreaterThanOrEqual(40);
    expect(starter.length).toBeLessThanOrEqual(80);
  });

  it("uses unique ids", () => {
    const ids = starter.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required category", () => {
    const counts = new Map<ThaiReadingCategory, number>();
    for (const r of starter) counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
    for (const c of REQUIRED_CATEGORIES) {
      expect(counts.get(c) ?? 0, `category ${c} needs >= 3 items`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Thai script reading starter — per-item integrity", () => {
  it.each(starter.map((r) => [r.id, r] as const))(
    "%s has Thai script + romanization + bilingual explanations",
    (_id, r: ThaiReadingItem) => {
      expect(REQUIRED_CATEGORIES).toContain(r.category);
      expect(r.script, `${r.id} needs Thai script`).toMatch(THAI_SCRIPT);
      expect(r.rtgs, `${r.id} needs romanization`).toMatch(LATIN);
      expect(r.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(r.explanation_en.trim().length).toBeGreaterThan(0);
    },
  );

  it("script fields contain no stray HTML entities", () => {
    for (const r of starter) {
      expect(r.script, `${r.id} script has an HTML entity`).not.toMatch(/&[a-z]+;/i);
    }
  });

  it("tone_mark items reference a tone-mark concept in their explanation", () => {
    const toneItems = starter.filter((r) => r.category === "tone_mark");
    for (const r of toneItems) {
      const text = `${r.rtgs} ${r.explanation_vi} ${r.explanation_en}`;
      expect(
        /(เอก|โท|ตรี|จัตวา|èek|thoo|trii|jàt|tone|thanh)/i.test(text),
        `${r.id} should mention a tone concept`,
      ).toBe(true);
    }
  });
});
