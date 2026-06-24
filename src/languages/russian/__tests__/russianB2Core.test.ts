import { describe, expect, it } from "vitest";

import { RUSSIAN_CATEGORIES, normalizeRussianLesson } from "@/languages/russian";
import { lessons as russianB2Core } from "@/languages/russian/lessons-b2-core";

const CYRILLIC_RE = /[Ѐ-ӿ]/;

describe("Russian B2 core lesson batch", () => {
  it("ships a compact 10-15 lesson batch, all B2 and uniquely identified", () => {
    expect(russianB2Core.length).toBeGreaterThanOrEqual(10);
    expect(russianB2Core.length).toBeLessThanOrEqual(15);

    const ids = new Set<string>();
    for (const lesson of russianB2Core) {
      expect(ids.has(lesson.id)).toBe(false);
      ids.add(lesson.id);
      expect(lesson.id).toMatch(/^russian_b2_/);
      expect(lesson.level).toBe("B2");
    }
  });

  it("covers the B2 focus areas: argument, work/travel, writing, advanced cases", () => {
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));
    for (const lesson of russianB2Core) {
      expect(categoryIds.has(lesson.category)).toBe(true);
    }
    // Argument and natural phrasing live in connected_speech; work/travel and
    // writing correction live in practical_tasks; advanced cases in case_control.
    const usedCategories = new Set(russianB2Core.map((lesson) => lesson.category));
    expect(usedCategories.has("connected_speech")).toBe(true);
    expect(usedCategories.has("practical_tasks")).toBe(true);
    expect(usedCategories.has("case_control")).toBe(true);
  });

  it("keeps every B2 lesson in the app-ready content shape", () => {
    for (const lesson of russianB2Core) {
      expect(lesson.title_vi).toContain("B2");
      expect(lesson.title_en).toContain("B2");
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      expect(lesson.vocabulary?.length).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length).toBeGreaterThanOrEqual(1);
      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();

      for (const sentence of lesson.sentences) {
        expect(sentence.russian).toMatch(CYRILLIC_RE);
        expect(sentence.romanization).toBeTruthy();
        expect(sentence.en).toBeTruthy();
        expect(sentence.vi).toBeTruthy();
        expect(sentence.pronunciation_focus.length).toBeGreaterThan(0);
      }

      for (const entry of lesson.vocabulary ?? []) {
        expect(entry.word).toBeTruthy();
        expect(entry.romanization).toBeTruthy();
        expect(entry.en).toBeTruthy();
        expect(entry.vi).toBeTruthy();
      }
    }
  });

  it("normalizes every B2 lesson into the shared renderer shape", () => {
    for (const [index, lesson] of russianB2Core.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("B2");
      expect(normalized.title).toMatchObject({
        vi: lesson.title_vi,
        en: lesson.title_en,
        native: "Русский",
      });
      expect(normalized.sentences[0]).toMatchObject({
        native: lesson.sentences[0].russian,
        romanization: lesson.sentences[0].romanization,
        en: lesson.sentences[0].en,
        vi: lesson.sentences[0].vi,
      });
      expect(normalized.vocabulary?.[0]?.native).toBe(lesson.vocabulary?.[0]?.word);
      expect(normalized.exercises?.length).toBeGreaterThan(0);
    }
  });
});
