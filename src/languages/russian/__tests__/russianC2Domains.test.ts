import { describe, expect, it } from "vitest";

import { RUSSIAN_CATEGORIES, normalizeRussianLesson } from "@/languages/russian";
import { lessons as russianC2Domains } from "@/languages/russian/lessons-c2-domains";

const CYRILLIC_RE = /[Ѐ-ӿ]/;
const CJK_HANGUL_JAPANESE_RE = /[぀-ヿ㐀-鿿가-힯]/;

describe("Russian C2 specialized-domain batch", () => {
  it("ships a compact C2 domain batch of 12–18 lessons", () => {
    expect(russianC2Domains.length).toBeGreaterThanOrEqual(12);
    expect(russianC2Domains.length).toBeLessThanOrEqual(18);
  });

  it("keeps every C2 domain lesson in the app-ready content shape", () => {
    const seen = new Set<string>();
    const categoryIds = new Set(RUSSIAN_CATEGORIES.map((category) => category.id));

    for (const lesson of russianC2Domains) {
      expect(seen.has(lesson.id)).toBe(false);
      seen.add(lesson.id);

      expect(lesson.level).toBe("C2");
      expect(categoryIds.has(lesson.category)).toBe(true);
      expect(lesson.title_vi).toContain("C2");
      expect(lesson.title_en).toContain("C2");
      expect(lesson.intro_vi).toBeTruthy();
      expect(lesson.intro_en).toBeTruthy();

      expect(lesson.sentences.length).toBeGreaterThanOrEqual(4);
      expect(lesson.vocabulary?.length).toBeGreaterThanOrEqual(4);
      expect(lesson.exercises?.length).toBeGreaterThanOrEqual(1);

      expect(lesson.cultural_notes_vi).toBeTruthy();
      expect(lesson.cultural_notes_en).toBeTruthy();
      expect(lesson.tip_advice_vi).toBeTruthy();
      expect(lesson.tip_advice_en).toBeTruthy();

      // Every sentence carries Russian + romanization + both glosses.
      for (const sentence of lesson.sentences) {
        expect(sentence.russian).toMatch(CYRILLIC_RE);
        expect(sentence.romanization).toBeTruthy();
        expect(sentence.en).toBeTruthy();
        expect(sentence.vi).toBeTruthy();
      }
    }
  });

  it("covers the required specialized domains", () => {
    const ids = russianC2Domains.map((lesson) => lesson.id).join(" ");
    for (const domain of [
      "law",
      "policy",
      "economics",
      "finance",
      "history",
      "science",
      "philosophy",
      "psychology",
      "medicine",
      "computer_science",
    ]) {
      expect(ids).toContain(domain);
    }
  });

  it("normalizes every C2 domain lesson into the shared renderer shape", () => {
    for (const [index, lesson] of russianC2Domains.entries()) {
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
      expect(normalized.exercises?.length).toBeGreaterThan(0);
      expect(normalized.audioBase).toBeUndefined();
    }
  });

  it("stays Cyrillic and never leaks CJK, Hangul, or Japanese assumptions", () => {
    const russianText = russianC2Domains
      .flatMap((lesson) => lesson.sentences.map((sentence) => sentence.russian))
      .join(" ");

    expect(russianText).toMatch(CYRILLIC_RE);
    expect(russianText).not.toMatch(CJK_HANGUL_JAPANESE_RE);
  });
});
