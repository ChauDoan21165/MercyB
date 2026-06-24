import { describe, expect, it } from "vitest";

import { normalizeRussianLesson, RUSSIAN_CATEGORIES } from "@/languages/russian";
import { lessons as a1Core } from "@/languages/russian/lessons-a1-core";
import { lessons as foundationA1 } from "@/languages/russian/lessons-a1";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const LATIN_LOOKALIKE_TRAP_RE = /[a-z]/i; // romanization must exist alongside Cyrillic

describe("Russian A1 core lesson batch", () => {
  it("ships a compact batch of 10–15 A1 lessons with unique ids", () => {
    expect(a1Core.length).toBeGreaterThanOrEqual(10);
    expect(a1Core.length).toBeLessThanOrEqual(15);

    const ids = a1Core.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) {
      expect(id).toMatch(/^russian_a1_core_/);
    }
  });

  it("keeps every A1 core lesson in the app-ready content shape", () => {
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));

    for (const lesson of a1Core) {
      expect(lesson.level).toBe("A1");
      expect(categoryIds.has(lesson.category)).toBe(true);
      expect(lesson.title_vi).toContain("A1");
      expect(lesson.title_en).toContain("A1");
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();
      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      expect(lesson.vocabulary?.length).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length).toBeGreaterThanOrEqual(1);
      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();
    }
  });

  it("includes Cyrillic Russian plus transliteration, Vietnamese, and English", () => {
    for (const lesson of a1Core) {
      for (const sentence of lesson.sentences) {
        expect(sentence.russian).toMatch(CYRILLIC_RE);
        expect(sentence.romanization).toMatch(LATIN_LOOKALIKE_TRAP_RE);
        expect(sentence.vi).toBeTruthy();
        expect(sentence.en).toBeTruthy();
        expect(sentence.pronunciation_focus.length).toBeGreaterThan(0);
      }
      for (const entry of lesson.vocabulary ?? []) {
        expect(entry.word).toMatch(CYRILLIC_RE);
        expect(entry.romanization).toBeTruthy();
        expect(entry.vi).toBeTruthy();
        expect(entry.en).toBeTruthy();
      }
    }
  });

  it("provides practice prompts with answers in every lesson", () => {
    for (const lesson of a1Core) {
      const items = (lesson.exercises ?? []).flatMap((exercise) => exercise.items);
      expect(items.length).toBeGreaterThan(0);
      for (const item of items) {
        expect(item.prompt).toBeTruthy();
        expect(item.answer).toBeTruthy();
      }
    }
  });

  it("normalizes every A1 core lesson into the shared renderer shape", () => {
    for (const [index, lesson] of a1Core.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("A1");
      expect(normalized.title).toMatchObject({
        vi: lesson.title_vi,
        en: lesson.title_en,
        native: "Русский",
      });
      expect(normalized.sentences[0]).toMatchObject({
        native: lesson.sentences[0].russian,
        romanization: lesson.sentences[0].romanization,
      });
      expect(normalized.exercises?.length).toBeGreaterThan(0);
    }
  });

  it("does not disturb the existing Russian foundation A1 lessons", () => {
    expect(foundationA1.length).toBeGreaterThanOrEqual(4);
    const foundationIds = new Set(foundationA1.map((lesson) => lesson.id));
    expect(foundationIds.has("russian_a1_cyrillic_stress")).toBe(true);

    // Core batch ids are namespaced and never collide with the foundation batch.
    for (const lesson of a1Core) {
      expect(foundationIds.has(lesson.id)).toBe(false);
    }
  });
});
