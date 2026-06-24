import { describe, expect, it } from "vitest";

import {
  RUSSIAN_CATEGORIES,
  normalizeRussianLesson,
} from "@/languages/russian";
import { lessons as russianA2Core } from "@/languages/russian/lessons-a2-core";
import { lessons as russianA2 } from "@/languages/russian/lessons-a2";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

describe("Russian A2 core lesson batch", () => {
  it("ships 10-15 compact A2 lessons with unique ids", () => {
    expect(russianA2Core.length).toBeGreaterThanOrEqual(10);
    expect(russianA2Core.length).toBeLessThanOrEqual(15);

    const ids = russianA2Core.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not collide with the existing A2 foundation batch", () => {
    const coreIds = new Set(russianA2Core.map((lesson) => lesson.id));
    for (const lesson of russianA2) {
      expect(coreIds.has(lesson.id)).toBe(false);
    }
  });

  it("keeps every lesson in the app-ready A2 content shape", () => {
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));

    for (const lesson of russianA2Core) {
      expect(lesson.level).toBe("A2");
      expect(categoryIds.has(lesson.category)).toBe(true);
      expect(lesson.title_vi).toContain("A2");
      expect(lesson.title_en).toContain("A2");
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
        expect(entry.word).toMatch(CYRILLIC_RE);
        expect(entry.romanization).toBeTruthy();
        expect(entry.en).toBeTruthy();
        expect(entry.vi).toBeTruthy();
      }

      for (const exercise of lesson.exercises ?? []) {
        expect(exercise.items.length).toBeGreaterThan(0);
        for (const item of exercise.items) {
          expect(item.prompt).toBeTruthy();
          expect(item.answer).toBeTruthy();
        }
      }
    }
  });

  it("covers the practical A2 daily-life topics", () => {
    const ids = russianA2Core.map((lesson) => lesson.id).join(" ");
    for (const topic of [
      "daily",
      "accusative",
      "genitive",
      "dative",
      "instrumental",
      "prepositional",
      "past",
      "future",
      "directions",
      "shopping",
      "appointments",
    ]) {
      expect(ids).toContain(topic);
    }
  });

  it("stays Cyrillic and avoids CJK/Hangul/Japanese characters", () => {
    const text = russianA2Core
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");
    expect(text).toMatch(CYRILLIC_RE);
    expect(text).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });

  it("normalizes every A2 core lesson into the shared renderer shape", () => {
    for (const [index, lesson] of russianA2Core.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("A2");
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
