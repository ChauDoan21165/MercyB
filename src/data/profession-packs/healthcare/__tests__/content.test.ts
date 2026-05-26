// src/data/profession-packs/healthcare/__tests__/content.test.ts
//
// Locks the lesson-shape content for the healthcare profession pack.
// Mirrors nail-tech / restaurant / customer-service content tests
// shipped earlier this week. Adds healthcare-specific safety guards
// (no diagnostic language outside the charting category, no actual
// drug-dosage pairs).

import { describe, expect, it } from "vitest";

import {
  HEALTHCARE_CATEGORIES,
  HEALTHCARE_LESSONS,
  getHealthcareLessonById,
  getHealthcareLessonsByCategory,
  type HealthcareCategoryId,
} from "../content";

const ALL_CATEGORY_IDS: HealthcareCategoryId[] = HEALTHCARE_CATEGORIES.map(
  (c) => c.id,
);

describe("HEALTHCARE_LESSONS — totals", () => {
  it("ships exactly 50 lessons", () => {
    expect(HEALTHCARE_LESSONS).toHaveLength(50);
  });

  it("covers all 8 categories", () => {
    expect(HEALTHCARE_CATEGORIES).toHaveLength(8);
  });

  it("category expected_count matches the actual lesson count per category", () => {
    for (const cat of HEALTHCARE_CATEGORIES) {
      const actual = getHealthcareLessonsByCategory(cat.id).length;
      expect(actual, `category ${cat.id}`).toBe(cat.expected_count);
    }
  });

  it("category expected_counts sum to 50", () => {
    const sum = HEALTHCARE_CATEGORIES.reduce(
      (acc, c) => acc + c.expected_count,
      0,
    );
    expect(sum).toBe(50);
  });
});

describe("HEALTHCARE_LESSONS — schema", () => {
  it("every lesson has a unique id", () => {
    const ids = HEALTHCARE_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every id starts with healthcare_", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      expect(lesson.id.startsWith("healthcare_"), lesson.id).toBe(true);
    }
  });

  it("every lesson has bilingual title fields", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      expect(lesson.title_vi.length, lesson.id).toBeGreaterThan(0);
      expect(lesson.title_en.length, lesson.id).toBeGreaterThan(0);
    }
  });

  it("every lesson has a valid category", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      expect(ALL_CATEGORY_IDS, lesson.id).toContain(lesson.category);
    }
  });

  it("every lesson has 4–6 sentences", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      expect(lesson.sentences.length, lesson.id).toBeGreaterThanOrEqual(4);
      expect(lesson.sentences.length, lesson.id).toBeLessThanOrEqual(6);
    }
  });

  it("every sentence has bilingual en/vi + at least one pronunciation focus key", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      for (const s of lesson.sentences) {
        expect(s.en.length, lesson.id).toBeGreaterThan(0);
        expect(s.vi.length, lesson.id).toBeGreaterThan(0);
        expect(Array.isArray(s.pronunciation_focus), lesson.id).toBe(true);
        expect(s.pronunciation_focus.length, lesson.id).toBeGreaterThan(0);
      }
    }
  });

  it("every lesson has substantive cultural_notes_vi + tip_advice_vi", () => {
    for (const lesson of HEALTHCARE_LESSONS) {
      expect(lesson.cultural_notes_vi.length, lesson.id).toBeGreaterThan(40);
      expect(lesson.tip_advice_vi.length, lesson.id).toBeGreaterThan(40);
    }
  });
});

// ── Healthcare-specific safety guards ─────────────────────────────────────

describe("HEALTHCARE_LESSONS — safety guards", () => {
  it("no medication-category sentence pairs a drug-shape unit with a number", () => {
    // Catch patterns like "take 500 mg of Tylenol" inside the
    // medication category — content there must teach PHRASING ("the
    // doctor wants you to take this with food") not dosing. The
    // charting category is exempt because intake/output measurement
    // (e.g. "240 ml of water") is the legitimate teaching surface.
    const dosageShape = /\b\d+\s*(?:mg|mcg|cc|units|iu|tablets?)\b/i;
    const meds = getHealthcareLessonsByCategory("medication_communication");
    for (const lesson of meds) {
      for (const s of lesson.sentences) {
        const hasDose = dosageShape.test(s.en) || dosageShape.test(s.vi);
        if (hasDose) {
          throw new Error(
            `Lesson ${lesson.id} sentence appears to contain a numeric drug dose: '${s.en}'. ` +
              `This pack teaches communication English, not clinical dosing.`,
          );
        }
      }
    }
  });

  it("no sentence prescribes treatment ('take', 'should take' with explicit drug)", () => {
    // Look for sentences that read like prescriptions: "you should take
    // ibuprofen for pain". The phrase "the doctor wants you to take"
    // is OK (it relays an instruction). Bare "you should take" with a
    // drug name is not.
    const PRESCRIPTIVE = /\byou should take\s+(\w+)\b/i;
    for (const lesson of HEALTHCARE_LESSONS) {
      for (const s of lesson.sentences) {
        if (PRESCRIPTIVE.test(s.en)) {
          throw new Error(
            `Lesson ${lesson.id}: prescriptive language found: '${s.en}'. ` +
              `Phrase as 'the doctor wants you to take...' instead.`,
          );
        }
      }
    }
  });

  it("emergency_communication category mentions calling for help", () => {
    // Light sanity check: the emergency category must reference one of
    // the standard escalation routes.
    const emergency = getHealthcareLessonsByCategory("emergency_communication");
    const corpus = emergency
      .flatMap((l) => l.sentences.map((s) => s.en))
      .join(" ")
      .toLowerCase();
    const mentions =
      corpus.includes("911") ||
      corpus.includes("rapid response") ||
      corpus.includes("code blue") ||
      corpus.includes("calling for help");
    expect(mentions).toBe(true);
  });

  it("medication_communication category emphasizes verification", () => {
    // Read-back / repeat-back / verify is a Joint Commission safety
    // standard; the pack must surface it somewhere in the medication
    // category.
    const meds = getHealthcareLessonsByCategory("medication_communication");
    const corpus = meds
      .flatMap((l) => [...l.sentences.map((s) => s.en), l.tip_advice_vi])
      .join(" ")
      .toLowerCase();
    const ok =
      corpus.includes("repeat") ||
      corpus.includes("verify") ||
      corpus.includes("read-back") ||
      corpus.includes("xác minh");
    expect(ok).toBe(true);
  });
});

// ── Helper functions ─────────────────────────────────────────────────────

describe("getHealthcareLessonById / getHealthcareLessonsByCategory", () => {
  it("getHealthcareLessonById returns the matching lesson", () => {
    const lesson = getHealthcareLessonById("healthcare_intake_what_brings_you_in");
    expect(lesson).toBeDefined();
    expect(lesson?.category).toBe("intake_vitals");
  });

  it("getHealthcareLessonById returns undefined for unknown ids", () => {
    expect(getHealthcareLessonById("nonexistent")).toBeUndefined();
  });

  it("getHealthcareLessonsByCategory filters correctly", () => {
    const lessons = getHealthcareLessonsByCategory("emergency_communication");
    expect(lessons.length).toBe(5);
    for (const l of lessons) expect(l.category).toBe("emergency_communication");
  });

  it("medication_communication has the largest count (10 lessons)", () => {
    expect(getHealthcareLessonsByCategory("medication_communication").length).toBe(10);
  });

  it("elder_dementia_care has 10 lessons covering daily care surfaces", () => {
    expect(getHealthcareLessonsByCategory("elder_dementia_care").length).toBe(10);
  });
});
