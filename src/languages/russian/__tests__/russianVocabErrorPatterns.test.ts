import { describe, expect, it } from "vitest";

import {
  RUSSIAN_VOCABULARY,
  RUSSIAN_VOCABULARY_COUNT,
  RUSSIAN_VOCABULARY_TOPICS,
  getRussianVocabularyByLevel,
  getRussianVocabularyByTopic,
  type RussianVocabItem,
} from "@/languages/russian/vocabulary";
import {
  RUSSIAN_ERROR_BUCKETS,
  RUSSIAN_ERROR_PATTERNS,
  RUSSIAN_ERROR_PATTERN_COUNT,
  getRussianErrorPatternsByBucket,
  type RussianErrorPattern,
} from "@/languages/russian/errorPatterns";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;
const VOCAB_LEVELS = ["A1", "A2", "B1"] as const;
const VOCAB_POS = [
  "noun",
  "verb",
  "adjective",
  "pronoun",
  "adverb",
  "function",
  "numeral",
] as const;

describe("Russian vocabulary batch (R10)", () => {
  it("ships 150-300 curated entries", () => {
    expect(RUSSIAN_VOCABULARY_COUNT).toBe(RUSSIAN_VOCABULARY.length);
    expect(RUSSIAN_VOCABULARY_COUNT).toBeGreaterThanOrEqual(150);
    expect(RUSSIAN_VOCABULARY_COUNT).toBeLessThanOrEqual(300);
  });

  it("keeps every entry in the compact bilingual shape", () => {
    for (const item of RUSSIAN_VOCABULARY) {
      expect(item.ru).toMatch(CYRILLIC_RE);
      expect(item.ru.trim()).toBe(item.ru);
      expect(item.translit).toBeTruthy();
      expect(item.translit).not.toMatch(CYRILLIC_RE);
      expect(item.vi.trim().length).toBeGreaterThan(0);
      expect(item.en.trim().length).toBeGreaterThan(0);
      expect(VOCAB_POS).toContain(item.pos);
      expect(VOCAB_LEVELS).toContain(item.level);
      expect(RUSSIAN_VOCABULARY_TOPICS).toContain(item.topic);
    }
  });

  it("has no duplicate headword + part-of-speech pairs", () => {
    const seen = new Set<string>();
    for (const item of RUSSIAN_VOCABULARY) {
      const key = `${item.ru}|${item.pos}`;
      expect(seen.has(key)).toBe(false);
      seen.add(key);
    }
  });

  it("covers every declared topic and CEFR level", () => {
    for (const topic of RUSSIAN_VOCABULARY_TOPICS) {
      expect(getRussianVocabularyByTopic(topic).length).toBeGreaterThan(0);
    }
    for (const level of VOCAB_LEVELS) {
      expect(getRussianVocabularyByLevel(level).length).toBeGreaterThan(0);
    }
  });

  it("stays Cyrillic and never leaks CJK/Hangul/Japanese", () => {
    const allRu = RUSSIAN_VOCABULARY.map((i: RussianVocabItem) => i.ru).join(" ");
    expect(allRu).toMatch(CYRILLIC_RE);
    expect(allRu).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });
});

describe("Russian error patterns batch (R10)", () => {
  it("ships 30-80 curated patterns", () => {
    expect(RUSSIAN_ERROR_PATTERN_COUNT).toBe(RUSSIAN_ERROR_PATTERNS.length);
    expect(RUSSIAN_ERROR_PATTERN_COUNT).toBeGreaterThanOrEqual(30);
    expect(RUSSIAN_ERROR_PATTERN_COUNT).toBeLessThanOrEqual(80);
  });

  it("keeps every pattern in the bilingual wrong/correct shape", () => {
    for (const pattern of RUSSIAN_ERROR_PATTERNS) {
      expect(pattern.id).toMatch(/^R10-E\d{3}$/);
      expect(RUSSIAN_ERROR_BUCKETS).toContain(pattern.bucket);
      expect(pattern.category.trim().length).toBeGreaterThan(0);
      expect(pattern.wrong).toMatch(CYRILLIC_RE);
      expect(pattern.correct).toMatch(CYRILLIC_RE);
      expect(pattern.wrong).not.toBe(pattern.correct);
      expect(pattern.vi.trim().length).toBeGreaterThan(0);
      expect(pattern.en.trim().length).toBeGreaterThan(0);
      expect(pattern.fixVi.trim().length).toBeGreaterThan(0);
    }
  });

  it("has unique pattern ids", () => {
    const ids = RUSSIAN_ERROR_PATTERNS.map((p: RussianErrorPattern) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers the core grammar buckets for Vietnamese learners", () => {
    for (const bucket of ["cases", "aspect", "motion", "agreement"] as const) {
      expect(getRussianErrorPatternsByBucket(bucket).length).toBeGreaterThan(0);
    }
  });
});
