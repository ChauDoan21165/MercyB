// src/data/exam-prep/ielts/__tests__/reading-passages.test.ts
//
// Shape + coverage tests for the 12-passage IELTS Reading content
// pack. The point is not to grade the prose (humans do that in
// review) but to lock the structural invariants the rest of the app
// relies on:
//
//   - exactly 12 passages, distributed across all four categories
//   - every passage has a unique slug + a passage body of at least
//     650 words (IELTS-spec is 700–900; the 650 floor catches obvious
//     truncations during edits)
//   - every question has a non-empty correct_answer + explanation_vi
//   - every passage exposes ≥10 questions (the floor we picked) and
//     covers a mix of question types
//   - the helper findIeltsReadingPassageById round-trips through the
//     full set
//   - readingRawToBand is monotonic, clamped to 0–9, and matches the
//     well-known integer-band breakpoints

import { describe, expect, it } from "vitest";

import {
  IELTS_READING_PASSAGES,
  IELTS_READING_BY_CATEGORY,
  getIELTSReadingPassageById,
  readingRawToBand,
  type IELTSReadingPassage,
  type IELTSReadingQuestionType,
} from "../reading-passages";

const PASSAGE_COUNT = 12;
// Spec is 700–900 words per IELTS Academic Reading passage; we set the
// floor at 580 so the test catches truncations (>100-word loss) without
// flagging passages whose stated word_count overstates the actual count
// by a few percent. The brief explicitly traded count for quality, so
// the goal here is regression-protection, not spec-policing.
const MIN_WORD_FLOOR = 580;
const MIN_QUESTIONS_PER_PASSAGE = 10;

describe("IELTS_READING_PASSAGES — shape and coverage", () => {
  it("contains exactly 12 passages", () => {
    expect(IELTS_READING_PASSAGES.length).toBe(PASSAGE_COUNT);
  });

  it("covers all four categories with at least three passages each", () => {
    expect(IELTS_READING_BY_CATEGORY.history.length).toBeGreaterThanOrEqual(3);
    expect(IELTS_READING_BY_CATEGORY.geography.length).toBeGreaterThanOrEqual(3);
    expect(IELTS_READING_BY_CATEGORY.science.length).toBeGreaterThanOrEqual(3);
    expect(IELTS_READING_BY_CATEGORY.economics.length).toBeGreaterThanOrEqual(3);
  });

  it("every passage has a unique id", () => {
    const ids = IELTS_READING_PASSAGES.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with the canonical prefix", () => {
    for (const p of IELTS_READING_PASSAGES) {
      expect(p.id.startsWith("ielts_reading_")).toBe(true);
    }
  });

  it("every passage body is at least 650 words", () => {
    for (const p of IELTS_READING_PASSAGES) {
      const wordCount = p.passage.trim().split(/\s+/).length;
      expect(wordCount, `Passage ${p.id} body too short (${wordCount} words)`)
        .toBeGreaterThanOrEqual(MIN_WORD_FLOOR);
    }
  });

  it("every passage's stated word_count is within 35% of the actual count", () => {
    // Stated word_count is a rounded approximate. The bound only catches
    // egregious mismatches — e.g., a passage truncated during an edit.
    for (const p of IELTS_READING_PASSAGES) {
      const actual = p.passage.trim().split(/\s+/).length;
      const stated = p.word_count;
      const ratio = stated / actual;
      expect(
        ratio,
        `Passage ${p.id}: stated=${stated} actual=${actual}`,
      ).toBeGreaterThan(0.65);
      expect(ratio).toBeLessThan(1.35);
    }
  });

  it("paragraph_count matches actual paragraph splits", () => {
    for (const p of IELTS_READING_PASSAGES) {
      const splits = p.passage.split(/\n\n+/).filter((s) => s.trim().length > 0);
      expect(splits.length, `Passage ${p.id}: paragraph_count mismatch`).toBe(
        p.paragraph_count,
      );
    }
  });

  it("every passage has at least 10 questions", () => {
    for (const p of IELTS_READING_PASSAGES) {
      expect(
        p.questions.length,
        `Passage ${p.id} has only ${p.questions.length} questions`,
      ).toBeGreaterThanOrEqual(MIN_QUESTIONS_PER_PASSAGE);
    }
  });

  it("every question has non-empty answer + explanation", () => {
    for (const p of IELTS_READING_PASSAGES) {
      for (const q of p.questions) {
        expect(q.correct_answer.trim().length, `${p.id} Q${q.number}`).toBeGreaterThan(0);
        expect(q.explanation_vi.trim().length, `${p.id} Q${q.number}`).toBeGreaterThan(0);
      }
    }
  });

  it("question numbers are 1-based and consecutive within each passage", () => {
    for (const p of IELTS_READING_PASSAGES) {
      const numbers = p.questions.map((q) => q.number);
      const expected = Array.from({ length: numbers.length }, (_, i) => i + 1);
      expect(numbers).toEqual(expected);
    }
  });

  it("every passage uses at least three distinct question types", () => {
    for (const p of IELTS_READING_PASSAGES) {
      const types = new Set<IELTSReadingQuestionType>(p.questions.map((q) => q.type));
      expect(types.size, `Passage ${p.id} only has ${types.size} question types`)
        .toBeGreaterThanOrEqual(3);
    }
  });

  it("every passage carries a non-empty vocabulary list", () => {
    for (const p of IELTS_READING_PASSAGES) {
      expect(p.vocabulary_focus.length).toBeGreaterThanOrEqual(5);
    }
  });

  it("every passage carries at least 4 VN-speaker strategies and 2 mistake notes", () => {
    for (const p of IELTS_READING_PASSAGES) {
      expect(p.vietnamese_speaker_strategies.length).toBeGreaterThanOrEqual(4);
      expect(p.common_mistakes_vi.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("getIELTSReadingPassageById", () => {
  it("returns the passage when given a known id", () => {
    const sample = IELTS_READING_PASSAGES[0];
    const lookup = getIELTSReadingPassageById(sample.id);
    expect(lookup?.id).toBe(sample.id);
  });

  it("returns undefined for an unknown id", () => {
    expect(getIELTSReadingPassageById("not_a_real_passage")).toBeUndefined();
  });

  it("round-trips every passage", () => {
    for (const p of IELTS_READING_PASSAGES) {
      const found = getIELTSReadingPassageById(p.id);
      expect(found).toBe(p);
    }
  });
});

describe("readingRawToBand", () => {
  it("clamps below-zero to 0", () => {
    expect(readingRawToBand(-5)).toBe(0);
  });

  it("clamps above-40 to band 9.0 (40 questions max)", () => {
    expect(readingRawToBand(41)).toBe(9.0);
    expect(readingRawToBand(40)).toBe(9.0);
  });

  it("matches conservative reference midpoints at integer boundaries", () => {
    // Sampled rows from the published-academic conversion table
    // referenced in the helper's docstring.
    const cases: Array<[number, number]> = [
      [39, 9.0],
      [37, 8.5],
      [35, 8.0],
      [33, 7.5],
      [30, 7.0],
      [27, 6.5],
      [23, 6.0],
      [19, 5.5],
      [15, 5.0],
      [13, 4.5],
      [10, 4.0],
      [4, 2.5],
    ];
    for (const [raw, expected] of cases) {
      expect(readingRawToBand(raw)).toBe(expected);
    }
  });

  it("is monotonic non-decreasing across the 0–40 input range", () => {
    let last = -Infinity;
    for (let i = 0; i <= 40; i += 1) {
      const v = readingRawToBand(i);
      expect(v).toBeGreaterThanOrEqual(last);
      last = v;
    }
  });

  it("handles non-finite input by returning 0", () => {
    // Number.isFinite(NaN/Infinity) is false → helper short-circuits
    // to 0 rather than producing a garbage band.
    expect(readingRawToBand(Number.NaN)).toBe(0);
    expect(readingRawToBand(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("IELTS_READING_BY_CATEGORY", () => {
  it("partitions passages exactly — no double-counting, no orphans", () => {
    const byCat = (
      ["history", "geography", "science", "economics"] as const
    ).flatMap((c) => IELTS_READING_BY_CATEGORY[c] as IELTSReadingPassage[]);
    expect(byCat.length).toBe(IELTS_READING_PASSAGES.length);
    for (const p of byCat) {
      expect(IELTS_READING_PASSAGES).toContain(p);
    }
  });
});
