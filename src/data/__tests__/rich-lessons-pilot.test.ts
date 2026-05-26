// src/data/__tests__/rich-lessons-pilot.test.ts
//
// Validates the hand-authored RichLesson pilot bundle. Three concrete
// lessons land in this round (vi_l1_3rd_person_s, vi_l1_past_ed,
// vi_l1_missing_be); CI guards their shape so future authoring rounds
// can't silently drift away from the schema.

import { describe, expect, it } from "vitest";

import {
  RICH_LESSONS_PILOT,
  RICH_LESSON_PILOT_TAGS,
  getRichLessonPilot,
} from "../richLessonsPilot";
import {
  RICH_LESSON_QUIZ_LENGTH,
  isRichLesson,
} from "@/lib/weakness/richLessonSchema";
import { isKnownWeaknessTag } from "@/lib/weakness/weakness-catalog";

const EXPECTED_PILOT_TAGS = [
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_missing_be",
] as const;

describe("rich-lessons-pilot.json shape", () => {
  it("ships exactly the 3 expected pilot lessons", () => {
    expect([...RICH_LESSON_PILOT_TAGS].sort()).toEqual(
      [...EXPECTED_PILOT_TAGS].sort(),
    );
    expect(RICH_LESSONS_PILOT.length).toBe(3);
  });

  it("every pilot lesson tag exists in WEAKNESS_CATALOG", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      expect(
        isKnownWeaknessTag(lesson.tag),
        `${lesson.tag} not in WEAKNESS_CATALOG`,
      ).toBe(true);
    }
  });

  it("every pilot lesson passes the RichLesson type guard", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      expect(isRichLesson(lesson), `${lesson.tag} failed isRichLesson`).toBe(
        true,
      );
    }
  });
});

describe("rich-lessons-pilot section content", () => {
  it("every section has non-empty EN + VI", () => {
    const sectionNames = ["hook", "why", "pattern", "practice", "takeaway"] as const;
    for (const lesson of RICH_LESSONS_PILOT) {
      for (const name of sectionNames) {
        const section = lesson.sections[name];
        expect(
          section.en.trim().length,
          `${lesson.tag}.sections.${name}.en empty`,
        ).toBeGreaterThan(0);
        expect(
          section.vi.trim().length,
          `${lesson.tag}.sections.${name}.vi empty`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it("title has non-empty EN + VI", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      expect(lesson.title.en.trim().length).toBeGreaterThan(0);
      expect(lesson.title.vi.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("rich-lessons-pilot quiz invariants", () => {
  it("every pilot lesson has exactly RICH_LESSON_QUIZ_LENGTH questions", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      expect(
        lesson.quiz.length,
        `${lesson.tag} quiz length`,
      ).toBe(RICH_LESSON_QUIZ_LENGTH);
    }
  });

  it("every quiz question has VN + EN and a non-empty correct answer", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      lesson.quiz.forEach((q, i) => {
        expect(
          q.question.en.trim().length,
          `${lesson.tag} quiz[${i}].question.en empty`,
        ).toBeGreaterThan(0);
        expect(
          q.question.vi.trim().length,
          `${lesson.tag} quiz[${i}].question.vi empty`,
        ).toBeGreaterThan(0);
        expect(
          q.correctAnswer.trim().length,
          `${lesson.tag} quiz[${i}].correctAnswer empty`,
        ).toBeGreaterThan(0);
      });
    }
  });

  it("multiple-choice questions list the correct answer in their options", () => {
    for (const lesson of RICH_LESSONS_PILOT) {
      lesson.quiz.forEach((q, i) => {
        if (q.options && q.options.length > 0) {
          expect(
            q.options,
            `${lesson.tag} quiz[${i}] options missing correctAnswer`,
          ).toContain(q.correctAnswer);
        }
      });
    }
  });
});

describe("getRichLessonPilot", () => {
  it("returns a pilot lesson for each pilot tag", () => {
    for (const tag of EXPECTED_PILOT_TAGS) {
      const lesson = getRichLessonPilot(tag);
      expect(lesson, `pilot missing for ${tag}`).not.toBeNull();
      expect(lesson!.tag).toBe(tag);
    }
  });

  it("returns null for tags without a pilot", () => {
    expect(getRichLessonPilot("vi_l1_plural_s")).toBeNull();
    expect(getRichLessonPilot("vi_l1_ghost_tag")).toBeNull();
    expect(getRichLessonPilot("")).toBeNull();
  });
});
