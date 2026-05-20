import { describe, expect, it } from "vitest";
import { buildLessonIndex } from "../lessonIndex";
import { CEFR_LEVELS, type LessonSource } from "../recommenderTypes";

const REQUIRED_SOURCES: LessonSource[] = [
  "daily",
  "rich",
  "profession-pack",
  "vstep",
  "pronunciation",
  "listening",
  "interview",
];

describe("placement v3 lesson index", () => {
  const index = buildLessonIndex();

  it("builds without errors", () => {
    expect(index.length).toBeGreaterThan(0);
  });

  it("normalizes required fields for every lesson", () => {
    for (const lesson of index) {
      expect(lesson.id).toEqual(expect.any(String));
      expect(lesson.id.length).toBeGreaterThan(0);
      expect(lesson.title).toEqual(expect.any(String));
      expect(lesson.title.length).toBeGreaterThan(0);
      expect(lesson.source).toEqual(expect.any(String));
      expect(lesson.category).toEqual(expect.any(String));
      expect(lesson.category.length).toBeGreaterThan(0);
      expect(Array.isArray(lesson.subskills)).toBe(true);
      expect(Array.isArray(lesson.tags)).toBe(true);
      expect(Array.isArray(lesson.l1InterferenceCoverage)).toBe(true);
    }
  });

  it("keeps lesson ids unique across sources", () => {
    const ids = index.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("emits valid CEFR levels or null", () => {
    for (const lesson of index) {
      expect(lesson.cefrLevel === null || CEFR_LEVELS.includes(lesson.cefrLevel)).toBe(true);
    }
  });

  it("includes lessons from every requested source", () => {
    for (const source of REQUIRED_SOURCES) {
      expect(index.filter((lesson) => lesson.source === source).length).toBeGreaterThan(0);
    }
  });
});

