// Punjabi placement test guards. These tests validate structure and scope,
// not native-level linguistic authority; native review is deferred.

import { describe, expect, it } from "vitest";

import {
  LEVEL_ORDER,
  PLACEMENT_DISCLAIMER,
  answerKey,
  questions,
  recommendLevel,
  type PunjabiCefrLevel,
  type PunjabiPlacementQuestion,
  type PunjabiPlacementType,
} from "@/languages/punjabi/placement";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const ALL_LEVELS: PunjabiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

const ALL_TYPES: PunjabiPlacementType[] = [
  "reading",
  "vocabulary",
  "grammar",
  "register",
  "survival",
  "writing",
  "speaking",
];

describe("Punjabi placement — coverage", () => {
  it("contains a compact diagnostic bank", () => {
    expect(questions.length).toBeGreaterThanOrEqual(36);
    expect(questions.length).toBeLessThanOrEqual(72);
  });

  it("covers every CEFR level A1-C2", () => {
    const seen = new Set(questions.map((question) => question.level));
    for (const level of ALL_LEVELS) {
      expect(seen.has(level), `missing level ${level}`).toBe(true);
    }
  });

  it("covers all required placement item types", () => {
    const seen = new Set(questions.map((question) => question.type));
    for (const type of ALL_TYPES) {
      expect(seen.has(type), `missing type ${type}`).toBe(true);
    }
  });

  it("LEVEL_ORDER is canonical", () => {
    expect(LEVEL_ORDER).toEqual(ALL_LEVELS);
  });
});

describe("Punjabi placement — question integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = questions.map((question) => question.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each item has VI+EN prompts, explanations, and at least three options", () => {
    for (const question of questions) {
      expect(question.prompt_vi.length, `${question.id} prompt_vi`).toBeGreaterThan(0);
      expect(question.prompt_en.length, `${question.id} prompt_en`).toBeGreaterThan(0);
      expect(question.explanation_vi.length, `${question.id} explanation_vi`).toBeGreaterThan(0);
      expect(question.explanation_en.length, `${question.id} explanation_en`).toBeGreaterThan(0);
      expect(question.options.length, `${question.id} options`).toBeGreaterThanOrEqual(3);
    }
  });

  it("uses Gurmukhi as the primary Punjabi script", () => {
    for (const question of questions) {
      const blob = [
        question.stem_gurmukhi,
        ...question.options.map((option) => option.gurmukhi),
      ]
        .filter(Boolean)
        .join(" ");
      expect(hasGurmukhi(blob), `${question.id} has Gurmukhi`).toBe(true);
    }
  });

  it("includes romanization for A1/A2 Punjabi stems and options", () => {
    for (const question of questions.filter(
      (item) => item.level === "A1" || item.level === "A2",
    )) {
      if (question.stem_gurmukhi && hasGurmukhi(question.stem_gurmukhi)) {
        expect(question.stem_romanization?.length, `${question.id} stem romanization`).toBeTruthy();
      }

      for (const [index, option] of question.options.entries()) {
        if (option.gurmukhi && hasGurmukhi(option.gurmukhi)) {
          expect(option.romanization?.length, `${question.id} option ${index}`).toBeTruthy();
        }
      }
    }
  });

  it("every option contains learner-facing text", () => {
    for (const question of questions) {
      for (const [index, option] of question.options.entries()) {
        expect(
          Boolean(option.gurmukhi || option.vi || option.en),
          `${question.id} option ${index}`,
        ).toBe(true);
      }
    }
  });
});

describe("Punjabi placement — answer key and recommendation", () => {
  it("answerKey has one in-range answer per question", () => {
    expect(Object.keys(answerKey).length).toBe(questions.length);

    for (const question of questions) {
      expect(answerKey[question.id], `${question.id} answer`).toBe(question.answer_index);
      expect(question.answer_index).toBeGreaterThanOrEqual(0);
      expect(question.answer_index).toBeLessThan(question.options.length);
    }
  });

  it("recommends the highest contiguously passed level", () => {
    expect(recommendLevel({})).toBe("A1");
    expect(recommendLevel({ A1: 0.9, A2: 0.8, B1: 0.7, B2: 0.4, C1: 1 })).toBe("B1");
    expect(recommendLevel({ A1: 1, A2: 1, B1: 1, B2: 1, C1: 1, C2: 1 })).toBe("C2");
  });
});

describe("Punjabi placement — scope framing", () => {
  it("states study-support only, not official certification", () => {
    expect(PLACEMENT_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(PLACEMENT_DISCLAIMER.en.length).toBeGreaterThan(0);
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("study support");
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("not official certification");
    expect(PLACEMENT_DISCLAIMER.en.toLowerCase()).toContain("native review is deferred");
  });

  it("mentions Shahmukhi only for awareness", () => {
    const disclaimer = `${PLACEMENT_DISCLAIMER.vi} ${PLACEMENT_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("shahmukhi course");
  });

  it("does not claim native review or official accreditation in question text", () => {
    const blob = JSON.stringify(questions).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("officially certified");
    expect(blob).not.toContain("accredited");
  });
});

const _typecheck: PunjabiPlacementQuestion[] = questions;
void _typecheck;
