// src/languages/thai/__tests__/thaiFoundation.test.ts
//
// Foundation guard for the Thai language pack. Proves:
//   • module metadata is present and correct,
//   • lesson content actually contains Thai script,
//   • every learner-facing item carries BOTH Vietnamese and English explanations,
//   • the normalizer produces the renderer's NormalizedLesson shape,
//   • the content makes NO CJK / Hangul / Japanese-kana / Cyrillic assumptions.

import { describe, it, expect } from "vitest";

import {
  THAI_LANGUAGE,
  THAI_LESSONS_BY_LEVEL,
  allThaiLessons,
  a1Lessons,
  normalizeThaiLesson,
} from "../index";

// ── Unicode-range helpers ───────────────────────────────────────────────
const THAI = /[฀-๿]/; // Thai abugida
const CJK = /[一-鿿]/; // Chinese / Japanese kanji
const HANGUL = /[가-힣]/; // Korean
const KANA = /[぀-ヿ]/; // Japanese hiragana + katakana
const CYRILLIC = /[Ѐ-ӿ]/; // Russian and friends

// Pull every learner-facing string out of the A1 lesson so the "no foreign
// script" guard can scan the whole pack, not just one field.
function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(allThaiLessons);
  return out;
}

describe("Thai foundation — metadata", () => {
  it("exposes correct language metadata", () => {
    expect(THAI_LANGUAGE.code).toBe("th");
    expect(THAI_LANGUAGE.name_vi).toBe("Tiếng Thái");
    expect(THAI_LANGUAGE.name_en).toBe("Thai");
    expect(THAI_LANGUAGE.tonal).toBe(true);
    expect(THAI_LANGUAGE.levels).toContain("A1");
  });

  it("declares the Thai script (abugida), not a borrowed script", () => {
    expect(THAI_LANGUAGE.nativeName).toMatch(THAI);
    expect(THAI_LANGUAGE.script.toLowerCase()).toContain("thai");
    expect(THAI_LANGUAGE.scriptUnicodeRange).toContain("0E00");
  });

  it("ships exactly one starter A1 lesson in the foundation", () => {
    expect(a1Lessons).toHaveLength(1);
    expect(THAI_LESSONS_BY_LEVEL.A1).toHaveLength(1);
    expect(allThaiLessons).toHaveLength(1);
    expect(a1Lessons[0].level).toBe("A1");
  });
});

describe("Thai foundation — Thai script present", () => {
  const lesson = a1Lessons[0];

  it("titles and sentences contain Thai characters", () => {
    expect(lesson.title_vi + lesson.title_en).toMatch(THAI);
    for (const s of lesson.sentences) {
      expect(s.thai).toMatch(THAI);
      expect(s.romanization.length).toBeGreaterThan(0);
    }
  });

  it("vocabulary covers the politeness particles ครับ and ค่ะ", () => {
    const words = lesson.vocabulary.map((v) => v.thai);
    expect(words).toContain("ครับ");
    expect(words).toContain("ค่ะ");
    expect(words).toContain("สวัสดี");
  });
});

describe("Thai foundation — VI + EN explanations", () => {
  const lesson = a1Lessons[0];

  it("the lesson carries both VI and EN intros", () => {
    expect(lesson.intro_vi.length).toBeGreaterThan(0);
    expect(lesson.intro_en.length).toBeGreaterThan(0);
    expect(lesson.intro_vi).not.toBe(lesson.intro_en);
  });

  it("every sentence has both a VI and an EN gloss", () => {
    for (const s of lesson.sentences) {
      expect(s.vi.length).toBeGreaterThan(0);
      expect(s.en.length).toBeGreaterThan(0);
    }
  });

  it("every vocab entry has both a VI and an EN meaning", () => {
    for (const v of lesson.vocabulary) {
      expect(v.vi.length).toBeGreaterThan(0);
      expect(v.en.length).toBeGreaterThan(0);
    }
  });

  it("cultural notes exist in both VI and EN", () => {
    expect(lesson.cultural_notes_vi).toBeTruthy();
    expect(lesson.cultural_notes_en).toBeTruthy();
  });
});

describe("Thai foundation — normalization shape", () => {
  const normalized = normalizeThaiLesson(a1Lessons[0]);

  it("produces a NormalizedLesson with the expected top-level shape", () => {
    expect(typeof normalized.id).toBe("number");
    expect(normalized.level).toBe("A1");
    expect(normalized.title).toMatchObject({ vi: expect.any(String), en: expect.any(String) });
    expect(normalized.introVi).toBeTruthy();
    expect(normalized.introEn).toBeTruthy();
    expect(Array.isArray(normalized.sentences)).toBe(true);
  });

  it("maps Thai source into `native` and keeps `romanization`", () => {
    const s = normalized.sentences[0];
    expect(s.native).toMatch(THAI);
    expect(s.romanization).toBeTruthy();
    expect(s.vi).toBeTruthy();
    expect(s.en).toBeTruthy();
  });

  it("normalizes exercises into renderer `kind`s", () => {
    const kinds = (normalized.exercises ?? []).map((e) => e.kind);
    expect(kinds).toContain("fill-blank");
    expect(kinds).toContain("matching");
    expect(kinds).toContain("translation");
  });

  it("omits audioBase (no Thai audio bundle yet)", () => {
    expect(normalized.audioBase).toBeUndefined();
  });
});

describe("Thai foundation — no CJK/Hangul/Japanese/Russian assumptions", () => {
  const strings = allStrings();

  it("contains no Chinese/Japanese kanji", () => {
    for (const s of strings) expect(s).not.toMatch(CJK);
  });

  it("contains no Korean Hangul", () => {
    for (const s of strings) expect(s).not.toMatch(HANGUL);
  });

  it("contains no Japanese kana", () => {
    for (const s of strings) expect(s).not.toMatch(KANA);
  });

  it("contains no Cyrillic (Russian etc.)", () => {
    for (const s of strings) expect(s).not.toMatch(CYRILLIC);
  });
});
