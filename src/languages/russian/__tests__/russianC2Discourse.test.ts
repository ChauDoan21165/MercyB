import { describe, expect, it } from "vitest";

import { lessons as c2Discourse } from "@/languages/russian/lessons-c2-discourse";
import { normalizeRussianLesson } from "@/languages/russian/normalize";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;
const VALID_CATEGORIES = new Set([
  "script_foundation",
  "daily_survival",
  "case_control",
  "connected_speech",
  "practical_tasks",
]);

describe("Russian C2 discourse batch", () => {
  it("ships a compact 12–18 lesson batch with unique C2 ids", () => {
    expect(c2Discourse.length).toBeGreaterThanOrEqual(12);
    expect(c2Discourse.length).toBeLessThanOrEqual(18);

    const seen = new Set<string>();
    for (const lesson of c2Discourse) {
      expect(seen.has(lesson.id)).toBe(false);
      seen.add(lesson.id);
      expect(lesson.id.startsWith("russian_c2")).toBe(true);
      expect(lesson.level).toBe("C2");
      expect(VALID_CATEGORIES.has(lesson.category)).toBe(true);
    }
  });

  it("keeps every C2 discourse lesson in the app-ready bilingual shape", () => {
    for (const lesson of c2Discourse) {
      expect(lesson.title_vi).toContain("C2");
      expect(lesson.title_en).toContain("C2");
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();

      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      for (const sentence of lesson.sentences) {
        expect(sentence.russian).toMatch(CYRILLIC_RE);
        expect(sentence.romanization).toBeTruthy();
        expect(sentence.en).toBeTruthy();
        expect(sentence.vi).toBeTruthy();
      }

      expect(lesson.vocabulary?.length ?? 0).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length ?? 0).toBeGreaterThanOrEqual(1);
      for (const exercise of lesson.exercises ?? []) {
        expect(exercise.items.length).toBeGreaterThanOrEqual(1);
      }

      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();
    }
  });

  it("focuses on discourse: nuance, argumentation, register, pragmatics", () => {
    const ids = c2Discourse.map((lesson) => lesson.id).join(" ");
    for (const marker of ["argument", "register", "pragmatic", "nuance", "discourse"]) {
      expect(ids).toContain(marker);
    }
  });

  it("normalizes every C2 discourse lesson into the shared renderer shape", () => {
    for (const [index, lesson] of c2Discourse.entries()) {
      const normalized = normalizeRussianLesson(lesson, index + 1);

      expect(normalized.id).toBe(index + 1);
      expect(normalized.level).toBe("C2");
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
      expect((normalized.exercises?.length ?? 0)).toBeGreaterThan(0);
    }
  });

  it("stays Cyrillic and never leaks CJK, Hangul, or Japanese script", () => {
    const russianText = c2Discourse
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");

    expect(russianText).toMatch(CYRILLIC_RE);
    expect(russianText).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });
});
