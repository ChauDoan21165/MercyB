// src/lib/weakness/__tests__/micro-lessons.test.ts
//
// Shape + invariants for the micro-lesson content bundle. CC5 will
// render this data in a future task, so CI must guarantee:
//   - every lesson has all required fields with non-empty strings,
//   - every tag used as a lesson key exists in WEAKNESS_CATALOG,
//   - practice items and examples pass a basic sanity check.

import { describe, expect, it } from "vitest";

import {
  MICRO_LESSONS,
  MICRO_LESSON_TAGS,
  getMicroLesson,
  type MicroLesson,
} from "../micro-lessons";
import { isKnownWeaknessTag } from "../weakness-catalog";

const EXPECTED_TAGS = [
  "vi_l1_3rd_person_s",
  "vi_l1_past_ed",
  "vi_l1_plural_s",
  "vi_l1_missing_be",
  "vi_l1_missing_article",
  "vi_l1_to_verb_confusion",
  "vi_l1_double_past",
  "vi_l1_comparative_double",
  "vi_l1_everyone_plural",
  "vi_l1_make_vs_do",
];

function allLessons(): MicroLesson[] {
  return MICRO_LESSON_TAGS.map((t) => {
    const lesson = MICRO_LESSONS[t];
    if (!lesson) throw new Error(`Missing lesson for ${t}`);
    return lesson;
  });
}

describe("MICRO_LESSONS shape", () => {
  it("ships lessons for the 10 highest-impact tags", () => {
    expect([...MICRO_LESSON_TAGS].sort()).toEqual([...EXPECTED_TAGS].sort());
    expect(MICRO_LESSON_TAGS.length).toBe(10);
  });

  it("every lesson tag exists in WEAKNESS_CATALOG", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      expect(isKnownWeaknessTag(tag)).toBe(true);
    }
  });

  it("keeps lesson.tag in sync with its record key", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      expect(MICRO_LESSONS[tag]!.tag).toBe(tag);
    }
  });
});

describe("MICRO_LESSONS content invariants", () => {
  it("title has non-empty EN + VI", () => {
    for (const l of allLessons()) {
      expect(l.title.en.trim().length).toBeGreaterThan(0);
      expect(l.title.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it("concept has non-empty EN + VI", () => {
    for (const l of allLessons()) {
      expect(l.concept.en.trim().length).toBeGreaterThan(0);
      expect(l.concept.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it("tip has non-empty EN + VI", () => {
    for (const l of allLessons()) {
      expect(l.tip.en.trim().length).toBeGreaterThan(0);
      expect(l.tip.vi.trim().length).toBeGreaterThan(0);
    }
  });

  it("each lesson has 3–5 examples with non-empty wrong + right strings", () => {
    for (const l of allLessons()) {
      expect(l.examples.length).toBeGreaterThanOrEqual(3);
      expect(l.examples.length).toBeLessThanOrEqual(5);
      for (const ex of l.examples) {
        expect(typeof ex.wrong).toBe("string");
        expect(typeof ex.right).toBe("string");
        expect(ex.wrong.trim().length).toBeGreaterThan(0);
        expect(ex.right.trim().length).toBeGreaterThan(0);
        if (ex.note) {
          expect(ex.note.en.trim().length).toBeGreaterThan(0);
          expect(ex.note.vi.trim().length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("each lesson has 5–8 practice items with string answers", () => {
    for (const l of allLessons()) {
      expect(l.practice.length).toBeGreaterThanOrEqual(5);
      expect(l.practice.length).toBeLessThanOrEqual(8);
      for (const p of l.practice) {
        expect(typeof p.prompt).toBe("string");
        expect(typeof p.answer).toBe("string");
        expect(p.prompt.trim().length).toBeGreaterThan(0);
        expect(p.answer.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every practice prompt contains a `___` blank marker", () => {
    for (const l of allLessons()) {
      for (const p of l.practice) {
        expect(p.prompt).toContain("___");
      }
    }
  });
});

describe("getMicroLesson", () => {
  it("returns the matching lesson for each known tag", () => {
    for (const tag of MICRO_LESSON_TAGS) {
      const lesson = getMicroLesson(tag);
      expect(lesson).not.toBeNull();
      expect(lesson!.tag).toBe(tag);
    }
  });

  it("returns null for a catalog tag that has no lesson", () => {
    // vi_l1_tag_question is in the catalog but NOT in MICRO_LESSONS.
    expect(getMicroLesson("vi_l1_tag_question")).toBeNull();
  });

  it("returns null for a completely unknown tag", () => {
    expect(getMicroLesson("")).toBeNull();
    expect(getMicroLesson("vi_l1_ghost_tag")).toBeNull();
  });
});
