// src/data/exam-prep/ielts/__tests__/reading-passages.test.ts
//
// Shape + integrity tests for the IELTS Reading content pack.
// The passages themselves are content-reviewed by hand — what we lock
// here are properties that should never silently regress: count,
// length window, ID format, question shape, answer type contracts,
// and the "every TFNG answer is in the canonical set" rule.

import { describe, expect, it } from "vitest";

import {
  ALL_IELTS_READING_IDS,
  IELTS_READING_PASSAGES,
  getIeltsReadingPassageById,
  listIeltsReadingByBand,
  listIeltsReadingByTopic,
  listIeltsReadingPassages,
  wordCount,
  type IELTSReadingPassage,
} from "../reading-passages";

const VALID_TOPIC_FAMILIES = [
  "history",
  "economics",
  "earth_science",
  "atmospheric_science",
  "life_science",
  "medical_science",
  "agriculture",
  "ecology",
];

const VALID_BANDS = [5.5, 6.5, 7.5, 8.5];

const VALID_QUESTION_TYPES = [
  "true_false_not_given",
  "multiple_choice",
  "sentence_completion",
  "matching_headings",
  "matching_information",
  "short_answer",
  "summary_completion",
];

const VALID_TFNG = ["TRUE", "FALSE", "NOT GIVEN"];

describe("IELTS_READING_PASSAGES — registry", () => {
  it("ships exactly twelve passages", () => {
    expect(IELTS_READING_PASSAGES.length).toBe(12);
    expect(ALL_IELTS_READING_IDS.length).toBe(12);
  });

  it("ids are unique", () => {
    const set = new Set(ALL_IELTS_READING_IDS);
    expect(set.size).toBe(ALL_IELTS_READING_IDS.length);
  });

  it("ids are URL-safe (lowercase + dashes + alphanumerics)", () => {
    for (const id of ALL_IELTS_READING_IDS) {
      expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("listIeltsReadingPassages returns the same items as the registry", () => {
    const list = listIeltsReadingPassages();
    expect(list.length).toBe(IELTS_READING_PASSAGES.length);
    for (const p of list) {
      expect(getIeltsReadingPassageById(p.id)).toBe(p);
    }
  });

  it("getIeltsReadingPassageById returns null for unknown ids", () => {
    expect(getIeltsReadingPassageById("does-not-exist")).toBeNull();
  });

  it("filters by band correctly", () => {
    for (const band of [5.5, 6.5, 7.5, 8.5] as const) {
      const filtered = listIeltsReadingByBand(band);
      for (const p of filtered) {
        expect(p.band).toBe(band);
      }
    }
  });

  it("filters by topic family correctly", () => {
    for (const family of VALID_TOPIC_FAMILIES as IELTSReadingPassage["topic_family"][]) {
      const filtered = listIeltsReadingByTopic(family);
      for (const p of filtered) {
        expect(p.topic_family).toBe(family);
      }
    }
  });
});

describe("IELTS_READING_PASSAGES — shape", () => {
  it.each(IELTS_READING_PASSAGES)(
    "$id has every required top-level field",
    (passage) => {
      expect(passage.id).toBeTruthy();
      expect(passage.title_en).toBeTruthy();
      expect(passage.title_vi).toBeTruthy();
      expect(passage.passage_en).toBeTruthy();
      expect(passage.summary_vi).toBeTruthy();
      expect(passage.questions).toBeDefined();
      expect(Array.isArray(passage.questions)).toBe(true);
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id band and topic family are valid",
    (passage) => {
      expect(VALID_BANDS).toContain(passage.band);
      expect(VALID_TOPIC_FAMILIES).toContain(passage.topic_family);
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id estimated time is between 15 and 30 minutes",
    (passage) => {
      expect(passage.time_minutes).toBeGreaterThanOrEqual(15);
      expect(passage.time_minutes).toBeLessThanOrEqual(30);
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id passage_en is within the IELTS-spec word window (650–950)",
    (passage) => {
      const w = wordCount(passage);
      expect(w).toBeGreaterThanOrEqual(650);
      expect(w).toBeLessThanOrEqual(950);
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id has exactly thirteen questions",
    (passage) => {
      expect(passage.questions.length).toBe(13);
    },
  );
});

describe("IELTS_READING_PASSAGES — questions", () => {
  it.each(IELTS_READING_PASSAGES)(
    "$id question numbers are 1..13 in order",
    (passage) => {
      const numbers = passage.questions.map((q) => q.number);
      expect(numbers).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id every question has a valid type and non-empty fields",
    (passage) => {
      for (const q of passage.questions) {
        expect(VALID_QUESTION_TYPES).toContain(q.type);
        expect(q.question_text.trim().length).toBeGreaterThan(0);
        expect(q.correct_answer.trim().length).toBeGreaterThan(0);
        expect(q.explanation_vi.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id TFNG questions use the canonical answer set",
    (passage) => {
      const tfng = passage.questions.filter(
        (q) => q.type === "true_false_not_given",
      );
      expect(tfng.length).toBeGreaterThan(0);
      for (const q of tfng) {
        expect(VALID_TFNG).toContain(q.correct_answer);
      }
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id MCQ questions provide options that include the correct answer",
    (passage) => {
      const mcqs = passage.questions.filter(
        (q) => q.type === "multiple_choice",
      );
      expect(mcqs.length).toBeGreaterThan(0);
      for (const q of mcqs) {
        expect(q.options).toBeDefined();
        expect(Array.isArray(q.options)).toBe(true);
        expect(q.options!.length).toBeGreaterThanOrEqual(3);
        expect(q.options!.length).toBeLessThanOrEqual(5);
        expect(q.options).toContain(q.correct_answer);
      }
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id sentence-completion answers are short (<=4 words)",
    (passage) => {
      const sc = passage.questions.filter(
        (q) => q.type === "sentence_completion",
      );
      expect(sc.length).toBeGreaterThan(0);
      for (const q of sc) {
        const words = q.correct_answer.trim().split(/\s+/).length;
        expect(words).toBeLessThanOrEqual(4);
      }
    },
  );

  it.each(IELTS_READING_PASSAGES)(
    "$id uses at least three distinct question types",
    (passage) => {
      const types = new Set(passage.questions.map((q) => q.type));
      expect(types.size).toBeGreaterThanOrEqual(3);
    },
  );
});

describe("IELTS_READING_PASSAGES — answer recoverability (sanity)", () => {
  // For sentence-completion questions, the answer should appear
  // somewhere in the passage text. This is a *necessary but not
  // sufficient* check — it catches typos in the answer key, not
  // semantic mismatches.
  it.each(IELTS_READING_PASSAGES)(
    "$id sentence-completion answers appear in the passage text",
    (passage) => {
      const sc = passage.questions.filter(
        (q) => q.type === "sentence_completion",
      );
      const haystack = passage.passage_en.toLowerCase();
      for (const q of sc) {
        const needle = q.correct_answer.toLowerCase();
        expect(
          haystack,
          `${passage.id} Q${q.number}: "${q.correct_answer}" not found in passage`,
        ).toContain(needle);
      }
    },
  );
});

describe("IELTS_READING_PASSAGES — coverage across topics and bands", () => {
  it("covers at least four distinct topic families", () => {
    const families = new Set(IELTS_READING_PASSAGES.map((p) => p.topic_family));
    expect(families.size).toBeGreaterThanOrEqual(4);
  });

  it("includes passages at multiple bands (not all one level)", () => {
    const bands = new Set(IELTS_READING_PASSAGES.map((p) => p.band));
    expect(bands.size).toBeGreaterThanOrEqual(2);
  });

  it("titles are unique across the registry", () => {
    const titles = IELTS_READING_PASSAGES.map((p) => p.title_en);
    expect(new Set(titles).size).toBe(titles.length);
  });
});
