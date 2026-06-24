import { describe, expect, it } from "vitest";

import { normalizeRussianLesson } from "@/languages/russian";
import { lessons as russianB1Core } from "@/languages/russian/lessons-b1-core";
import { lessons as russianB1 } from "@/languages/russian/lessons-b1";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

const FOCUS_KEYWORDS = [
  "case_control",
  "connected_speech",
  "practical_tasks",
];

describe("Russian B1 core lesson batch", () => {
  it("ships 10–15 compact B1 lessons with unique ids", () => {
    expect(russianB1Core.length).toBeGreaterThanOrEqual(10);
    expect(russianB1Core.length).toBeLessThanOrEqual(15);

    const ids = russianB1Core.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id.startsWith("russian_b1_core_")).toBe(true);
    }
  });

  it("does not collide with the existing foundation B1 batch", () => {
    const existing = new Set(russianB1.map((lesson) => lesson.id));
    for (const lesson of russianB1Core) {
      expect(existing.has(lesson.id)).toBe(false);
    }
  });

  it("keeps every lesson at B1 and in an allowed category", () => {
    for (const lesson of russianB1Core) {
      expect(lesson.level).toBe("B1");
      expect(FOCUS_KEYWORDS).toContain(lesson.category);
    }
  });

  it("covers cases, aspect, motion, and connected/practical B1 communication", () => {
    const ids = russianB1Core.map((lesson) => lesson.id).join(" ");
    expect(ids).toMatch(/genitive|dative|instrumental|prepositional|accusative/);
    expect(ids).toMatch(/aspect/);
    expect(ids).toMatch(/motion/);
    expect(ids).toMatch(/relative|conjunctions/);
    expect(ids).toMatch(/practical/);

    // At least three distinct cases must be taught.
    const caseLessons = russianB1Core.filter((lesson) =>
      /genitive|dative|instrumental|prepositional|accusative/.test(lesson.id),
    );
    expect(caseLessons.length).toBeGreaterThanOrEqual(3);
  });

  it("keeps every lesson in the app-ready bilingual content shape", () => {
    for (const lesson of russianB1Core) {
      expect(lesson.title_vi).toContain("B1");
      expect(lesson.title_en).toContain("B1");
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
        expect(sentence.russian).not.toMatch(CJK_HANGUL_JAPANESE_RE);
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

      for (const exercise of lesson.exercises ?? []) {
        expect(exercise.items.length).toBeGreaterThan(0);
        expect(exercise.instruction_vi).toBeTruthy();
      }
    }
  });

  it("normalizes every B1 core lesson into the shared renderer shape", () => {
    for (const [index, lesson] of russianB1Core.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("B1");
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
      expect(normalized.audioBase).toBeUndefined();
    }
  });
});
