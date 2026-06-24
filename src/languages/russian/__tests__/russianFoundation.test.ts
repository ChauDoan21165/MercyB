import { describe, expect, it } from "vitest";

import {
  RUSSIAN_CATEGORIES,
  RUSSIAN_LANGUAGE_META,
  RUSSIAN_LEVEL_COUNTS,
  RUSSIAN_TOTAL_LESSONS,
  loadAllLessons,
  loadLessonsForLevel,
  normalizeRussianLesson,
} from "@/languages/russian";
import { lessons as russianA1 } from "@/languages/russian/lessons-a1";
import { lessons as russianA2 } from "@/languages/russian/lessons-a2";
import { lessons as russianB1 } from "@/languages/russian/lessons-b1";
import { normalizeChineseLesson } from "@/languages/chinese/normalize";
import { lessons as chineseA1 } from "@/languages/chinese/lessons-a1";
import { normalizeJapaneseLesson } from "@/languages/japanese/normalize";
import { lessons as japaneseA1 } from "@/languages/japanese/lessons-a1";
import { normalizeKoreanLesson } from "@/languages/korean/normalize";
import { lessons as koreanA1 } from "@/languages/korean/lessons-a1";
import { isPhonicsOnly } from "@/lib/lessonAudio";

const CYRILLIC_RE = /[\u0400-\u04FF]/;
const CJK_HANGUL_JAPANESE_RE = /[\u3040-\u30FF\u3400-\u9FFF\uAC00-\uD7AF]/;

const allStaticRussianLessons = [...russianA1, ...russianA2, ...russianB1];

describe("Russian TS lesson batch 1", () => {
  it("registers Russian metadata, batch categories, and level counts", () => {
    expect(RUSSIAN_LANGUAGE_META).toMatchObject({
      code: "ru",
      slug: "russian",
      name_en: "Russian",
      name_vi: "Tiếng Nga",
      native_name: "Русский",
      script: "Cyrillic",
    });
    expect(RUSSIAN_CATEGORIES.map((category) => category.id)).toEqual([
      "script_foundation",
      "daily_survival",
      "case_control",
      "connected_speech",
      "practical_tasks",
    ]);
    expect(RUSSIAN_LEVEL_COUNTS).toEqual({
      A1: russianA1.length,
      A2: russianA2.length,
      B1: russianB1.length,
      B2: 0,
      C1: 0,
      C2: 0,
    });
    expect(RUSSIAN_TOTAL_LESSONS).toBe(allStaticRussianLessons.length);
  });

  it("loads A1, A2, and B1 while leaving B2/C1/C2 unconverted", async () => {
    await expect(loadLessonsForLevel("A1")).resolves.toEqual(russianA1);
    await expect(loadLessonsForLevel("A2")).resolves.toEqual(russianA2);
    await expect(loadLessonsForLevel("B1")).resolves.toEqual(russianB1);
    await expect(loadLessonsForLevel("B2")).resolves.toEqual([]);
    await expect(loadLessonsForLevel("C1")).resolves.toEqual([]);
    await expect(loadLessonsForLevel("C2")).resolves.toEqual([]);
    await expect(loadAllLessons()).resolves.toHaveLength(allStaticRussianLessons.length);
  });

  it("keeps every converted lesson in the app-ready content shape", () => {
    const seen = new Set<string>();
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));

    for (const lesson of allStaticRussianLessons) {
      expect(seen.has(lesson.id)).toBe(false);
      seen.add(lesson.id);
      expect(["A1", "A2", "B1"]).toContain(lesson.level);
      expect(categoryIds.has(lesson.category)).toBe(true);
      expect(lesson.title_vi).toContain(lesson.level);
      expect(lesson.title_en).toContain(lesson.level);
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      expect(lesson.vocabulary?.length).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length).toBeGreaterThanOrEqual(1);
      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();
      expect(lesson.sentences.map((sentence) => sentence.russian).join(" ")).toMatch(CYRILLIC_RE);
    }
  });

  it("normalizes every Russian lesson into the shared renderer shape", () => {
    for (const [index, lesson] of allStaticRussianLessons.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe(lesson.level);
      expect(normalized.title).toMatchObject({
        vi: lesson.title_vi,
        en: lesson.title_en,
        native: "Русский",
      });
      expect(normalized.introVi).toBe(lesson.intro_vi);
      expect(normalized.introEn).toBe(lesson.intro_en);
      expect(normalized.sentences[0]).toMatchObject({
        native: lesson.sentences[0].russian,
        romanization: lesson.sentences[0].romanization,
        en: lesson.sentences[0].en,
        vi: lesson.sentences[0].vi,
      });
      expect(normalized.vocabulary?.[0]?.native).toBe(lesson.vocabulary?.[0]?.word);
      expect(normalized.exercises?.length).toBeGreaterThan(0);
      expect(normalized.audioBase).toBeUndefined();
    }
  });

  it("keeps Russian Cyrillic separate from CJK, Hangul, and Japanese assumptions", () => {
    const russianText = allStaticRussianLessons
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");

    expect(russianText).toMatch(CYRILLIC_RE);
    expect(russianText).not.toMatch(CJK_HANGUL_JAPANESE_RE);
    expect(isPhonicsOnly("П")).toBe(false);

    const chinese = normalizeChineseLesson(chineseA1[0]);
    const japanese = normalizeJapaneseLesson(japaneseA1[0]);
    const korean = normalizeKoreanLesson(koreanA1[0]);

    expect(chinese.title.native ?? chinese.sentences[0]?.native ?? "").toMatch(CJK_HANGUL_JAPANESE_RE);
    expect(japanese.title.native ?? japanese.sentences[0]?.native ?? "").toMatch(CJK_HANGUL_JAPANESE_RE);
    expect(korean.sentences[0]?.native ?? korean.vocabulary?.[0]?.native ?? "").toMatch(CJK_HANGUL_JAPANESE_RE);
    expect(russianText).not.toBe(chinese.sentences[0]?.native);
    expect(russianText).not.toBe(japanese.sentences[0]?.native);
    expect(russianText).not.toBe(korean.sentences[0]?.native);
  });
});
