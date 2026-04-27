import { describe, expect, it } from "vitest";
import {
  IELTS_READING_BY_MODULE,
  IELTS_READING_ITEMS,
  getIELTSReadingItemById,
  readingRawToBand,
} from "../reading-items";

describe("IELTS_READING_ITEMS catalogue", () => {
  it("ships 12 passages — Option A scope-cut from spec's 24 (quality > count)", () => {
    expect(IELTS_READING_ITEMS).toHaveLength(12);
  });

  it("module distribution matches design (4 academic + 4 GT + 4 mixed-band tagged academic)", () => {
    expect(IELTS_READING_BY_MODULE.academic.length).toBeGreaterThanOrEqual(4);
    expect(IELTS_READING_BY_MODULE.general_training).toHaveLength(4);
    expect(
      IELTS_READING_BY_MODULE.academic.length +
        IELTS_READING_BY_MODULE.general_training.length,
    ).toBe(IELTS_READING_ITEMS.length);
  });

  it("all 4 difficulty bands appear at least once", () => {
    const bands = new Set(IELTS_READING_ITEMS.map((i) => i.difficulty_band));
    expect(bands.has(5.5)).toBe(true);
    expect(bands.has(6.5)).toBe(true);
    expect(bands.has(7.5)).toBe(true);
    expect(bands.has(8.5)).toBe(true);
  });

  it("every item id is unique and prefixed correctly", () => {
    const ids = new Set<string>();
    for (const item of IELTS_READING_ITEMS) {
      expect(item.id).toMatch(/^ielts_reading_/);
      expect(ids.has(item.id)).toBe(false);
      ids.add(item.id);
    }
  });

  it("every passage carries bilingual title + substantial passage text", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      // ~500+ word passage = roughly 3000+ chars (lower bound; most are longer)
      expect(item.passage_text.length).toBeGreaterThan(3000);
    }
  });

  it("every passage uses paragraph-letter labels for matching-headings questions", () => {
    for (const item of IELTS_READING_ITEMS) {
      // Each passage should have at least 5 paragraph labels [A]..[E]
      expect(item.passage_text).toMatch(/\[A\]/);
      expect(item.passage_text).toMatch(/\[B\]/);
      expect(item.passage_text).toMatch(/\[C\]/);
      expect(item.passage_text).toMatch(/\[D\]/);
      expect(item.passage_text).toMatch(/\[E\]/);
    }
  });

  it("every item carries 13 questions", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect(item.questions).toHaveLength(13);
    }
  });

  it("every question has bilingual explanation, valid type, and answer", () => {
    const validTypes = [
      "multiple_choice",
      "true_false_not_given",
      "matching_headings",
      "matching_information",
      "sentence_completion",
      "summary_completion",
      "short_answer",
    ];
    for (const item of IELTS_READING_ITEMS) {
      for (const q of item.questions) {
        expect(validTypes).toContain(q.type);
        expect(q.question_text.trim().length).toBeGreaterThan(0);
        expect(q.correct_answer.trim().length).toBeGreaterThan(0);
        expect(q.explanation_vi.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("question numbers are 1-based and ascending", () => {
    for (const item of IELTS_READING_ITEMS) {
      for (let i = 0; i < item.questions.length; i++) {
        expect(item.questions[i].number).toBe(i + 1);
      }
    }
  });

  it("every passage covers at least 4 distinct question types (variety check)", () => {
    for (const item of IELTS_READING_ITEMS) {
      const types = new Set(item.questions.map((q) => q.type));
      expect(types.size).toBeGreaterThanOrEqual(4);
    }
  });

  it("every passage includes at least one True/False/Not Given question (signature IELTS type)", () => {
    for (const item of IELTS_READING_ITEMS) {
      const hasTfng = item.questions.some((q) => q.type === "true_false_not_given");
      expect(hasTfng).toBe(true);
    }
  });

  it("every vocab entry has IPA, VI translation, and a valid band level", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect(item.vocabulary_focus.length).toBeGreaterThanOrEqual(8);
      for (const v of item.vocabulary_focus) {
        expect(v.word.trim().length).toBeGreaterThan(0);
        expect(v.vi_translation.trim().length).toBeGreaterThan(0);
        expect(v.ipa).toMatch(/^\/.+\/$/);
        expect([5, 6, 7, 8, 9]).toContain(v.band_level);
      }
    }
  });

  it("every passage carries 5+ VN strategies and 3+ common mistakes", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect(item.vietnamese_speaker_strategies.length).toBeGreaterThanOrEqual(5);
      expect(item.common_mistakes_vi.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("estimated time is 20 minutes per passage (IELTS spec)", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect(item.estimated_time_minutes).toBe(20);
    }
  });

  it("difficulty bands are valid IELTS half-band values", () => {
    for (const item of IELTS_READING_ITEMS) {
      expect([5.5, 6.5, 7.5, 8.5]).toContain(item.difficulty_band);
    }
  });
});

describe("getIELTSReadingItemById", () => {
  it("returns the item when id exists", () => {
    const item = getIELTSReadingItemById("ielts_reading_academic_history_of_cartography");
    expect(item).toBeDefined();
    expect(item?.module).toBe("academic");
  });

  it("returns undefined for unknown id", () => {
    expect(getIELTSReadingItemById("ielts_reading_nope")).toBeUndefined();
  });
});

describe("readingRawToBand", () => {
  it("Academic: 39+ → band 9", () => {
    expect(readingRawToBand(40, "academic")).toBe(9.0);
    expect(readingRawToBand(39, "academic")).toBe(9.0);
  });

  it("Academic: known midpoints", () => {
    expect(readingRawToBand(33, "academic")).toBe(7.5);
    expect(readingRawToBand(30, "academic")).toBe(7.0);
    expect(readingRawToBand(23, "academic")).toBe(6.0);
  });

  it("GT requires higher raw for same band (GT module is easier)", () => {
    // At raw 33, Academic = 7.5; GT = below 7.0 because more correct needed
    expect(readingRawToBand(33, "academic")).toBeGreaterThan(
      readingRawToBand(33, "general_training"),
    );
  });

  it("clamps out-of-range and NaN inputs", () => {
    expect(readingRawToBand(-5, "academic")).toBe(0);
    expect(readingRawToBand(99, "academic")).toBe(9.0);
    expect(readingRawToBand(NaN, "academic")).toBe(0);
  });

  it("monotonic across both modules", () => {
    let lastA = 0;
    let lastG = 0;
    for (let r = 0; r <= 40; r++) {
      const a = readingRawToBand(r, "academic");
      const g = readingRawToBand(r, "general_training");
      expect(a).toBeGreaterThanOrEqual(lastA);
      expect(g).toBeGreaterThanOrEqual(lastG);
      lastA = a;
      lastG = g;
    }
  });
});
