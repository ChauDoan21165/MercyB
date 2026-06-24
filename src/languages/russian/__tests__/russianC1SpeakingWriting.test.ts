import { describe, expect, it } from "vitest";

import {
  RUSSIAN_CATEGORIES,
  normalizeRussianLesson,
} from "@/languages/russian";
import { lessons as russianC1SpeakingWriting } from "@/languages/russian/lessons-c1-speaking-writing";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

describe("Russian C1 speaking + writing batch", () => {
  it("ships 10-15 compact C1 lessons with unique ids", () => {
    expect(russianC1SpeakingWriting.length).toBeGreaterThanOrEqual(10);
    expect(russianC1SpeakingWriting.length).toBeLessThanOrEqual(15);

    const ids = russianC1SpeakingWriting.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps every lesson at C1 and in the app-ready content shape", () => {
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));

    for (const lesson of russianC1SpeakingWriting) {
      expect(lesson.level).toBe("C1");
      expect(lesson.id.startsWith("russian_c1_")).toBe(true);
      expect(categoryIds.has(lesson.category)).toBe(true);
      expect(lesson.title_vi).toContain("C1");
      expect(lesson.title_en).toContain("C1");
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
    }
  });

  it("covers formal speech, essays, collocations, argument, and register", () => {
    const ids = russianC1SpeakingWriting.map((lesson) => lesson.id).join(" ");
    expect(ids).toContain("self_presentation");
    expect(ids).toContain("essay");
    expect(ids).toContain("report");
    expect(ids).toContain("argument");
    expect(ids).toContain("collocations");
    expect(ids).toContain("register");
  });

  it("normalizes every C1 lesson into the shared renderer shape", () => {
    for (const [index, lesson] of russianC1SpeakingWriting.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("C1");
      expect(normalized.title).toMatchObject({
        vi: lesson.title_vi,
        en: lesson.title_en,
        native: "Русский",
      });
      expect(normalized.sentences[0]).toMatchObject({
        native: lesson.sentences[0].russian,
        romanization: lesson.sentences[0].romanization,
      });
      expect(normalized.vocabulary?.[0]?.native).toBe(lesson.vocabulary?.[0]?.word);
      expect(normalized.exercises?.length).toBeGreaterThan(0);
    }
  });

  it("uses Cyrillic only, with no CJK/Hangul/Japanese leakage", () => {
    const russianText = russianC1SpeakingWriting
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");

    expect(russianText).toMatch(CYRILLIC_RE);
    expect(russianText).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });
});
