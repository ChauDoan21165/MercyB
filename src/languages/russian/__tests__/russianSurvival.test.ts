import { describe, expect, it } from "vitest";

import { normalizeRussianLesson } from "@/languages/russian";
import type { RussianLesson } from "@/languages/russian";
import {
  lessons as survivalLessons,
  SURVIVAL_LESSON_COUNT,
} from "@/languages/russian/lessons-survival";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

// Categories survival lessons may reuse from the shared RussianLesson shape.
const ALLOWED_CATEGORIES = new Set(["daily_survival", "practical_tasks"]);
const ALLOWED_LEVELS = new Set(["A1", "A2"]);

// Priority survival domains required by the task brief. Each maps to a
// substring that must appear in at least one lesson id.
const REQUIRED_DOMAINS = [
  "emergency",
  "food",
  "money",
  "doctor",
  "pharmacy",
  "police",
  "housing",
  "work",
  "immigration",
  "phone",
];

describe("Russian survival lesson batch", () => {
  it("ships 12-20 compact survival lessons", () => {
    expect(survivalLessons.length).toBe(SURVIVAL_LESSON_COUNT);
    expect(survivalLessons.length).toBeGreaterThanOrEqual(12);
    expect(survivalLessons.length).toBeLessThanOrEqual(20);
  });

  it("covers every priority survival domain at least once", () => {
    const ids = survivalLessons.map((lesson) => lesson.id).join(" ");
    for (const domain of REQUIRED_DOMAINS) {
      expect(ids).toContain(domain);
    }
  });

  it("keeps every survival lesson in the app-ready content shape", () => {
    const seen = new Set<string>();

    for (const lesson of survivalLessons as RussianLesson[]) {
      expect(lesson.id.startsWith("russian_survival_")).toBe(true);
      expect(seen.has(lesson.id)).toBe(false);
      seen.add(lesson.id);

      expect(ALLOWED_LEVELS.has(lesson.level)).toBe(true);
      expect(ALLOWED_CATEGORIES.has(lesson.category)).toBe(true);

      // Survival titles carry the CEFR marker, matching house style.
      expect(lesson.title_vi).toContain(lesson.level);
      expect(lesson.title_en).toContain(lesson.level);

      // Vietnamese + English explanations are both present.
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();
      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();

      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      expect(lesson.vocabulary?.length).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length).toBeGreaterThanOrEqual(1);

      for (const sentence of lesson.sentences) {
        expect(sentence.russian).toMatch(CYRILLIC_RE);
        expect(sentence.romanization).toBeTruthy();
        expect(sentence.en).toBeTruthy();
        expect(sentence.vi).toBeTruthy();
        expect(sentence.pronunciation_focus.length).toBeGreaterThan(0);
      }

      for (const entry of lesson.vocabulary ?? []) {
        expect(entry.word).toMatch(CYRILLIC_RE);
        expect(entry.en).toBeTruthy();
        expect(entry.vi).toBeTruthy();
      }
    }
  });

  it("keeps survival Russian in Cyrillic and free of CJK/Hangul/Japanese", () => {
    const russianText = survivalLessons
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");

    expect(russianText).toMatch(CYRILLIC_RE);
    expect(russianText).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });

  it("normalizes every survival lesson into the shared renderer shape", () => {
    for (const [index, lesson] of survivalLessons.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe(lesson.level);
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
      expect(normalized.vocabulary?.[0]?.native).toBe(
        lesson.vocabulary?.[0]?.word,
      );
      expect(normalized.exercises?.length).toBeGreaterThan(0);
      expect(normalized.audioBase).toBeUndefined();
    }
  });
});
