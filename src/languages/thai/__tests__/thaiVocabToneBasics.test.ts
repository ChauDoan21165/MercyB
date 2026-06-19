// src/languages/thai/__tests__/thaiVocabToneBasics.test.ts
//
// Structural guards for the Thai vocabulary + tone-basics reference data
// (A9, Wave 1). These tests pin shape and the no-audio / no-scoring scope;
// they do NOT assert linguistic correctness (native review is deferred).

import { describe, it, expect } from "vitest";

import { THAI_VOCABULARY } from "@/languages/thai/vocabulary";
import type { ThaiVocabEntry } from "@/languages/thai/vocabulary";
import {
  THAI_TONE_OVERVIEW,
  THAI_TONES,
  THAI_TONE_MARKS,
  THAI_TONE_LEARNER_WARNINGS,
  VI_THAI_TONE_CONTRASTS,
  WRITTEN_TONE_CONTRASTS,
} from "@/languages/thai/toneBasics";

const THAI_RANGE = /[฀-๿]/;
const LEVELS = new Set(["A1", "A2", "B1"]);
const CATEGORIES = new Set([
  "greetings", "pronouns", "numbers", "time", "family", "food", "verbs",
  "adjectives", "questions", "places", "colors", "body", "money", "function",
]);

describe("Thai vocabulary", () => {
  it("has 150–300 curated entries", () => {
    expect(THAI_VOCABULARY.length).toBeGreaterThanOrEqual(150);
    expect(THAI_VOCABULARY.length).toBeLessThanOrEqual(300);
  });

  it("every entry has Thai script, romanization, VI gloss, EN gloss", () => {
    for (const e of THAI_VOCABULARY) {
      expect(THAI_RANGE.test(e.th), `Thai script: ${e.th}`).toBe(true);
      expect(e.rom.trim().length, `rom for ${e.th}`).toBeGreaterThan(0);
      expect(e.vi.trim().length, `vi for ${e.th}`).toBeGreaterThan(0);
      expect(e.en.trim().length, `en for ${e.th}`).toBeGreaterThan(0);
    }
  });

  it("every entry has a known category and level", () => {
    for (const e of THAI_VOCABULARY) {
      expect(CATEGORIES.has(e.category), `category ${e.category}`).toBe(true);
      expect(LEVELS.has(e.level), `level ${e.level} for ${e.th}`).toBe(true);
    }
  });

  it("Thai script forms are unique (no duplicate headwords)", () => {
    const seen = new Set<string>();
    for (const e of THAI_VOCABULARY) {
      expect(seen.has(e.th), `duplicate th: ${e.th}`).toBe(false);
      seen.add(e.th);
    }
  });

  it("romanization carries no tone diacritics (it is a plain reading aid)", () => {
    // rom must be ASCII letters/spaces only — tone lives in the Thai script,
    // not in the romanization (guards the no-fake-tone-encoding rule).
    for (const e of THAI_VOCABULARY) {
      expect(/^[a-z ]+$/.test(e.rom), `rom should be plain ascii: "${e.rom}" (${e.th})`).toBe(true);
    }
  });

  it("covers a useful spread of topics", () => {
    const used = new Set<ThaiVocabEntry["category"]>(THAI_VOCABULARY.map((e) => e.category));
    // expect broad coverage, not every single bucket
    expect(used.size).toBeGreaterThanOrEqual(10);
    expect(used.has("greetings")).toBe(true);
    expect(used.has("numbers")).toBe(true);
    expect(used.has("verbs")).toBe(true);
  });
});

describe("Thai tone basics", () => {
  it("overview is bilingual and non-empty", () => {
    expect(THAI_TONE_OVERVIEW.vi.trim().length).toBeGreaterThan(40);
    expect(THAI_TONE_OVERVIEW.en.trim().length).toBeGreaterThan(40);
  });

  it("defines exactly the 5 Thai tones with distinct ids", () => {
    expect(THAI_TONES.length).toBe(5);
    const ids = new Set(THAI_TONES.map((t) => t.id));
    expect(ids).toEqual(new Set(["mid", "low", "falling", "high", "rising"]));
  });

  it("each tone has Thai name, bilingual contour, and a Thai example", () => {
    for (const t of THAI_TONES) {
      expect(THAI_RANGE.test(t.name_th), `tone name_th ${t.id}`).toBe(true);
      expect(t.contour_vi.trim().length, `contour_vi ${t.id}`).toBeGreaterThan(0);
      expect(t.contour_en.trim().length, `contour_en ${t.id}`).toBeGreaterThan(0);
      expect(THAI_RANGE.test(t.example_th), `example_th ${t.id}`).toBe(true);
    }
  });

  it("defines the 4 tone marks as Thai combining symbols", () => {
    expect(THAI_TONE_MARKS.length).toBe(4);
    for (const m of THAI_TONE_MARKS) {
      expect(THAI_RANGE.test(m.symbol), `mark symbol ${m.name_rtgs}`).toBe(true);
      expect(m.vi.trim().length).toBeGreaterThan(0);
      expect(m.en.trim().length).toBeGreaterThan(0);
    }
    const names = new Set(THAI_TONE_MARKS.map((m) => m.name_rtgs));
    expect(names).toEqual(new Set(["mai ek", "mai tho", "mai tri", "mai chattawa"]));
  });

  it("includes honest learner warnings about the no-audio limit", () => {
    expect(THAI_TONE_LEARNER_WARNINGS.length).toBeGreaterThanOrEqual(3);
    const blob = THAI_TONE_LEARNER_WARNINGS.map((w) => `${w.vi} ${w.en}`).join(" ").toLowerCase();
    // must acknowledge that text cannot teach production / no scoring
    expect(blob).toMatch(/text cannot teach|produce a tone|written/);
    for (const w of THAI_TONE_LEARNER_WARNINGS) {
      expect(w.vi.trim().length).toBeGreaterThan(0);
      expect(w.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("contrasts Thai tones with Vietnamese tones (bilingual)", () => {
    expect(VI_THAI_TONE_CONTRASTS.length).toBeGreaterThanOrEqual(3);
    const blob = VI_THAI_TONE_CONTRASTS.map((c) => `${c.vi} ${c.en}`).join(" ").toLowerCase();
    expect(blob).toMatch(/6 tones|5 tones|6 thanh|5 thanh/);
    for (const c of VI_THAI_TONE_CONTRASTS) {
      expect(c.vi.trim().length).toBeGreaterThan(0);
      expect(c.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("written minimal contrasts use Thai script and differ in tone", () => {
    expect(WRITTEN_TONE_CONTRASTS.length).toBeGreaterThanOrEqual(3);
    for (const c of WRITTEN_TONE_CONTRASTS) {
      expect(THAI_RANGE.test(c.a_th)).toBe(true);
      expect(THAI_RANGE.test(c.b_th)).toBe(true);
      expect(c.a_tone).not.toBe(c.b_tone);
      expect(c.a_gloss_vi).not.toBe(c.b_gloss_vi);
    }
  });
});
