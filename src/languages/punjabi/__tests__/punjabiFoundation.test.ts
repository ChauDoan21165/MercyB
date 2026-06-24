// src/languages/punjabi/__tests__/punjabiFoundation.test.ts
//
// Foundation guard for the Punjabi language pack.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_LANGUAGE,
  PUNJABI_LESSONS_BY_LEVEL,
  a1Lessons,
  allPunjabiLessons,
  normalizePunjabiLesson,
} from "../index";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(allPunjabiLessons);
  return out;
}

describe("Punjabi foundation - metadata", () => {
  it("exposes Punjabi language metadata with Gurmukhi primary", () => {
    expect(PUNJABI_LANGUAGE.code).toBe("pa");
    expect(PUNJABI_LANGUAGE.name_vi).toBe("Tiếng Punjabi");
    expect(PUNJABI_LANGUAGE.name_en).toBe("Punjabi");
    expect(PUNJABI_LANGUAGE.nativeName).toMatch(GURMUKHI);
    expect(PUNJABI_LANGUAGE.primaryScript).toBe("Gurmukhi");
    expect(PUNJABI_LANGUAGE.scriptUnicodeRange).toContain("0A00");
    expect(PUNJABI_LANGUAGE.tonal).toBe(true);
    expect(PUNJABI_LANGUAGE.levels).toContain("A1");
  });

  it("mentions Shahmukhi only as awareness metadata", () => {
    expect(PUNJABI_LANGUAGE.shahmukhiAwarenessOnly).toBe(true);
    expect(PUNJABI_LANGUAGE.script.toLowerCase()).toContain("awareness");
  });

  it("ships exactly one starter A1 lesson in the foundation", () => {
    expect(a1Lessons).toHaveLength(1);
    expect(PUNJABI_LESSONS_BY_LEVEL.A1).toHaveLength(1);
    expect(allPunjabiLessons).toHaveLength(1);
    expect(a1Lessons[0].level).toBe("A1");
  });
});

describe("Punjabi foundation - Gurmukhi content", () => {
  const lesson = a1Lessons[0];

  it("uses Gurmukhi in titles, sentences, vocabulary, and dialogue", () => {
    expect(lesson.title_vi + lesson.title_en).toMatch(GURMUKHI);
    for (const s of lesson.sentences) expect(s.gurmukhi).toMatch(GURMUKHI);
    for (const v of lesson.vocabulary) expect(v.gurmukhi).toMatch(GURMUKHI);
    for (const d of lesson.dialogue ?? []) expect(d.gurmukhi).toMatch(GURMUKHI);
  });

  it("keeps romanization beside learner-facing Punjabi items", () => {
    for (const s of lesson.sentences) expect(s.romanization.length).toBeGreaterThan(0);
    for (const v of lesson.vocabulary) expect(v.romanization.length).toBeGreaterThan(0);
    for (const d of lesson.dialogue ?? []) expect(d.romanization.length).toBeGreaterThan(0);
  });

  it("does not include Shahmukhi-script lesson content", () => {
    for (const s of allStrings()) expect(s).not.toMatch(SHAHMUKHI);
  });
});

describe("Punjabi foundation - VI and EN explanations", () => {
  const lesson = a1Lessons[0];

  it("the lesson carries both Vietnamese and English intros", () => {
    expect(lesson.intro_vi.length).toBeGreaterThan(0);
    expect(lesson.intro_en.length).toBeGreaterThan(0);
    expect(lesson.intro_vi).not.toBe(lesson.intro_en);
  });

  it("every sentence has Vietnamese and English glosses", () => {
    for (const s of lesson.sentences) {
      expect(s.vi.length).toBeGreaterThan(0);
      expect(s.en.length).toBeGreaterThan(0);
    }
  });

  it("every vocab entry has Vietnamese and English meanings", () => {
    for (const v of lesson.vocabulary) {
      expect(v.vi.length).toBeGreaterThan(0);
      expect(v.en.length).toBeGreaterThan(0);
    }
  });

  it("cultural notes and tips exist in both languages", () => {
    expect(lesson.cultural_notes_vi).toBeTruthy();
    expect(lesson.cultural_notes_en).toBeTruthy();
    expect(lesson.tip_advice_vi).toBeTruthy();
    expect(lesson.tip_advice_en).toBeTruthy();
  });
});

describe("Punjabi foundation - normalization shape", () => {
  const normalized = normalizePunjabiLesson(a1Lessons[0]);

  it("produces a NormalizedLesson", () => {
    expect(typeof normalized.id).toBe("number");
    expect(normalized.level).toBe("A1");
    expect(normalized.title).toMatchObject({ vi: expect.any(String), en: expect.any(String) });
    expect(normalized.introVi).toBeTruthy();
    expect(normalized.introEn).toBeTruthy();
    expect(Array.isArray(normalized.sentences)).toBe(true);
  });

  it("maps Gurmukhi source into native and keeps romanization", () => {
    const sentence = normalized.sentences[0];
    expect(sentence.native).toMatch(GURMUKHI);
    expect(sentence.romanization).toBeTruthy();
    expect(sentence.vi).toBeTruthy();
    expect(sentence.en).toBeTruthy();
  });

  it("normalizes all expected exercise kinds", () => {
    const kinds = (normalized.exercises ?? []).map((e) => e.kind);
    expect(kinds).toContain("fill-blank");
    expect(kinds).toContain("matching");
    expect(kinds).toContain("translation");
  });

  it("omits audioBase because Punjabi audio is out of scope", () => {
    expect(normalized.audioBase).toBeUndefined();
  });
});

describe("Punjabi foundation - no unrelated language assumptions", () => {
  const strings = allStrings();

  it("contains no Chinese or Japanese kanji", () => {
    for (const s of strings) expect(s).not.toMatch(CJK);
  });

  it("contains no Korean Hangul", () => {
    for (const s of strings) expect(s).not.toMatch(HANGUL);
  });

  it("contains no Japanese kana", () => {
    for (const s of strings) expect(s).not.toMatch(KANA);
  });

  it("contains no Cyrillic", () => {
    for (const s of strings) expect(s).not.toMatch(CYRILLIC);
  });
});
