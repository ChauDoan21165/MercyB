// src/lib/weakness/__tests__/richLessonSchema.test.ts
//
// Shape + invariants for the Step 4 RichLesson format and the legacy
// MicroLesson → RichLesson adapter. These tests are the contract that
// lets FocusAreasMicroLessonDialog render either shape from a single
// code path without breaking old content.

import { describe, expect, it } from "vitest";

import { MICRO_LESSONS, MICRO_LESSON_TAGS } from "../micro-lessons";
import {
  RICH_LESSON_QUIZ_LENGTH,
  fromMicroLesson,
  isRichLesson,
} from "../richLessonSchema";

describe("fromMicroLesson adapter", () => {
  it("converts every shipped MicroLesson into a renderable RichLesson", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const ml = MICRO_LESSONS[tag];
      expect(ml, `MicroLesson missing for ${tag}`).toBeDefined();
      const rich = fromMicroLesson(ml!);

      expect(isRichLesson(rich)).toBe(true);
      expect(rich.tag).toBe(tag);

      // Every section has non-empty EN + VI.
      for (const sectionName of [
        "hook",
        "why",
        "pattern",
        "practice",
        "takeaway",
      ] as const) {
        const section = rich.sections[sectionName];
        expect(
          section.en.trim().length,
          `${tag}.sections.${sectionName}.en empty`,
        ).toBeGreaterThan(0);
        expect(
          section.vi.trim().length,
          `${tag}.sections.${sectionName}.vi empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("preserves the tag identifier through the adapter", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      expect(rich.tag).toBe(tag);
    }
  });
});

describe("RichLesson quiz invariants", () => {
  it("every adapted lesson has exactly RICH_LESSON_QUIZ_LENGTH questions", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      expect(
        rich.quiz.length,
        `${tag} quiz length not ${RICH_LESSON_QUIZ_LENGTH}`,
      ).toBe(RICH_LESSON_QUIZ_LENGTH);
    }
  });

  it("every quiz question has VN + EN with non-empty content", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const rich = fromMicroLesson(MICRO_LESSONS[tag]!);
      for (let i = 0; i < rich.quiz.length; i++) {
        const q = rich.quiz[i];
        expect(
          q.question.en.trim().length,
          `${tag} quiz[${i}].question.en empty`,
        ).toBeGreaterThan(0);
        expect(
          q.question.vi.trim().length,
          `${tag} quiz[${i}].question.vi empty`,
        ).toBeGreaterThan(0);
        expect(
          q.correctAnswer.trim().length,
          `${tag} quiz[${i}].correctAnswer empty`,
        ).toBeGreaterThan(0);
      }
    }
  });
});

describe("isRichLesson type guard", () => {
  it("returns true for a fully-formed RichLesson", () => {
    const rich = fromMicroLesson(MICRO_LESSONS.vi_l1_3rd_person_s!);
    expect(isRichLesson(rich)).toBe(true);
  });

  it("returns false for a legacy MicroLesson", () => {
    expect(isRichLesson(MICRO_LESSONS.vi_l1_3rd_person_s!)).toBe(false);
  });

  it("returns false for null / non-objects", () => {
    expect(isRichLesson(null)).toBe(false);
    expect(isRichLesson(undefined)).toBe(false);
    expect(isRichLesson("not a lesson")).toBe(false);
    expect(isRichLesson(42)).toBe(false);
  });

  it("returns false when sections are missing", () => {
    expect(
      isRichLesson({
        tag: "vi_l1_3rd_person_s",
        title: { en: "x", vi: "x" },
        quiz: [],
      }),
    ).toBe(false);
  });
});
