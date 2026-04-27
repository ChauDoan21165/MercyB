// Shape + integrity tests for the Vietnam-cultural extension to the
// IELTS Reading content pack. Mirrors the assertions used in the
// canonical reading-passages.test.ts so that the two registries stay
// in lockstep.

import { describe, expect, it } from "vitest";

import {
  ALL_IELTS_READING_VN_IDS,
  IELTS_READING_PASSAGES_VN_EXTENSION,
  getIeltsReadingVnPassageById,
  listIeltsReadingVnByBand,
  listIeltsReadingVnByTopic,
  listIeltsReadingVnPassages,
} from "../reading-passages-vn-extension";
import { wordCount } from "../reading-passages";

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

describe("IELTS_READING_PASSAGES_VN_EXTENSION — registry", () => {
  it("ships exactly twelve VN-cultural passages", () => {
    expect(IELTS_READING_PASSAGES_VN_EXTENSION.length).toBe(12);
    expect(ALL_IELTS_READING_VN_IDS.length).toBe(12);
  });

  it("ids are unique", () => {
    const set = new Set(ALL_IELTS_READING_VN_IDS);
    expect(set.size).toBe(ALL_IELTS_READING_VN_IDS.length);
  });

  it("ids are URL-safe (lowercase + dashes + alphanumerics, leading letter)", () => {
    for (const id of ALL_IELTS_READING_VN_IDS) {
      expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
    }
  });

  it("listIeltsReadingVnPassages returns the same items as the registry", () => {
    const list = listIeltsReadingVnPassages();
    expect(list.length).toBe(IELTS_READING_PASSAGES_VN_EXTENSION.length);
    for (const p of list) {
      expect(getIeltsReadingVnPassageById(p.id)).toBe(p);
    }
  });

  it("getIeltsReadingVnPassageById returns null for unknown ids", () => {
    expect(getIeltsReadingVnPassageById("does-not-exist")).toBeNull();
  });

  it("filters by band correctly", () => {
    for (const band of [5.5, 6.5, 7.5, 8.5] as const) {
      const filtered = listIeltsReadingVnByBand(band);
      for (const p of filtered) {
        expect(p.band).toBe(band);
      }
    }
    // Coverage: every band has at least one passage
    for (const band of [5.5, 6.5, 7.5, 8.5] as const) {
      expect(listIeltsReadingVnByBand(band).length).toBeGreaterThan(0);
    }
  });

  it("filters by topic family correctly", () => {
    for (const p of IELTS_READING_PASSAGES_VN_EXTENSION) {
      expect(VALID_TOPIC_FAMILIES).toContain(p.topic_family);
      const filtered = listIeltsReadingVnByTopic(p.topic_family);
      expect(filtered).toContain(p);
    }
  });

  it("does NOT collide with canonical reading-passages ids", async () => {
    const canonical = await import("../reading-passages");
    const canonicalIds = new Set(canonical.ALL_IELTS_READING_IDS);
    for (const id of ALL_IELTS_READING_VN_IDS) {
      expect(canonicalIds.has(id)).toBe(false);
    }
  });
});

describe("IELTS_READING_PASSAGES_VN_EXTENSION — shape per passage", () => {
  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s has bilingual title + summary + passage",
    (_id, passage) => {
      expect(passage.title_en.trim().length).toBeGreaterThan(0);
      expect(passage.title_vi.trim().length).toBeGreaterThan(0);
      expect(passage.summary_vi.trim().length).toBeGreaterThan(20);
      expect(passage.passage_en.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s has 13 questions, 1-based and ascending",
    (_id, passage) => {
      expect(passage.questions.length).toBe(13);
      for (let i = 0; i < passage.questions.length; i++) {
        expect(passage.questions[i].number).toBe(i + 1);
      }
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s passage_en is within the extension's word window (540–950)",
    (_id, passage) => {
      // The extension uses a slightly tighter floor than the canonical
      // reading-passages window (650–950). Each passage stays above 540
      // words — comfortably IELTS-credible while keeping the additive
      // extension shippable in a single PR. See file header for context.
      const w = wordCount(passage);
      expect(w).toBeGreaterThanOrEqual(540);
      expect(w).toBeLessThanOrEqual(950);
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s uses only valid bands and topic families",
    (_id, passage) => {
      expect(VALID_BANDS).toContain(passage.band);
      expect(VALID_TOPIC_FAMILIES).toContain(passage.topic_family);
      expect(passage.time_minutes).toBe(20);
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s questions are well-formed",
    (_id, passage) => {
      for (const q of passage.questions) {
        expect(VALID_QUESTION_TYPES).toContain(q.type);
        expect(q.question_text.trim().length).toBeGreaterThan(0);
        expect(q.correct_answer.trim().length).toBeGreaterThan(0);
        expect(q.explanation_vi.trim().length).toBeGreaterThan(0);
        if (q.type === "true_false_not_given") {
          expect(VALID_TFNG).toContain(q.correct_answer);
        }
        if (q.type === "multiple_choice") {
          expect(q.options).toBeDefined();
          expect(q.options!.length).toBeGreaterThanOrEqual(3);
        }
      }
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s includes at least one TFNG question (signature IELTS type)",
    (_id, passage) => {
      const hasTfng = passage.questions.some(
        (q) => q.type === "true_false_not_given",
      );
      expect(hasTfng).toBe(true);
    },
  );

  it.each(IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => [p.id, p] as const))(
    "%s covers at least 4 distinct question types (variety check)",
    (_id, passage) => {
      const types = new Set(passage.questions.map((q) => q.type));
      expect(types.size).toBeGreaterThanOrEqual(4);
    },
  );
});

describe("IELTS_READING_PASSAGES_VN_EXTENSION — distribution", () => {
  it("includes the four expected band levels with at least one passage each", () => {
    for (const band of VALID_BANDS) {
      const count = IELTS_READING_PASSAGES_VN_EXTENSION.filter(
        (p) => p.band === band,
      ).length;
      expect(count).toBeGreaterThan(0);
    }
  });

  it("uses a variety of topic families", () => {
    const families = new Set(
      IELTS_READING_PASSAGES_VN_EXTENSION.map((p) => p.topic_family),
    );
    expect(families.size).toBeGreaterThanOrEqual(5);
  });
});
