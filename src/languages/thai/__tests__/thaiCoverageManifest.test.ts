// src/languages/thai/__tests__/thaiCoverageManifest.test.ts
//
// Guards the Thai coverage manifest for integration/QA. Proves:
//   • every expected module is present (A1–C2, survival, vocabulary, tone
//     awareness, grammar, reading, writing, speaking prompts, diagnostics,
//     emergency, business, culture/register),
//   • each module has VI + EN titles and learning purposes; keys are unique,
//   • the four honest flags are all set true and documented in VI + EN,
//   • Thai endonym in Thai script, with NO CJK / Hangul / kana / Cyrillic
//     assumptions anywhere.

import { describe, it, expect } from "vitest";

import {
  THAI_COVERAGE_MANIFEST,
  THAI_COVERAGE_MODULES,
  THAI_COVERAGE_FLAGS,
  type ThaiCoverageKey,
} from "../coverageManifest";

const THAI = /[฀-๿]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const REQUIRED_MODULES: ThaiCoverageKey[] = [
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
  "survival",
  "vocabulary",
  "tone_awareness",
  "grammar",
  "reading",
  "writing",
  "speaking_prompts",
  "diagnostics",
  "emergency",
  "business",
  "culture_register",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(THAI_COVERAGE_MANIFEST);
  return out;
}

describe("Thai coverage manifest — modules", () => {
  it("includes every expected module", () => {
    const keys = new Set(THAI_COVERAGE_MODULES.map((m) => m.key));
    for (const k of REQUIRED_MODULES) expect(keys.has(k)).toBe(true);
  });

  it("contains exactly the required modules (no extras, no gaps)", () => {
    const keys = THAI_COVERAGE_MODULES.map((m) => m.key);
    expect(new Set(keys)).toEqual(new Set(REQUIRED_MODULES));
    expect(keys.length).toBe(REQUIRED_MODULES.length);
  });

  it("module keys are unique", () => {
    const keys = THAI_COVERAGE_MODULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each module has VI + EN titles and learning purposes", () => {
    for (const m of THAI_COVERAGE_MODULES) {
      expect(m.title_vi.length).toBeGreaterThan(0);
      expect(m.title_en.length).toBeGreaterThan(0);
      expect(m.purpose_vi.length).toBeGreaterThan(0);
      expect(m.purpose_en.length).toBeGreaterThan(0);
    }
  });

  it("covers all six CEFR levels", () => {
    const keys = new Set(THAI_COVERAGE_MODULES.map((m) => m.key));
    for (const lvl of ["a1", "a2", "b1", "b2", "c1", "c2"] as ThaiCoverageKey[]) {
      expect(keys.has(lvl)).toBe(true);
    }
  });
});

describe("Thai coverage manifest — honest flags", () => {
  it("sets all four limitation flags true", () => {
    expect(THAI_COVERAGE_FLAGS.nativeReviewDeferred).toBe(true);
    expect(THAI_COVERAGE_FLAGS.noAudioScoring).toBe(true);
    expect(THAI_COVERAGE_FLAGS.noPronunciationScoring).toBe(true);
    expect(THAI_COVERAGE_FLAGS.noOfficialCertification).toBe(true);
  });

  it("documents the flags in VI + EN", () => {
    expect(THAI_COVERAGE_FLAGS.notes_vi.length).toBeGreaterThan(0);
    expect(THAI_COVERAGE_FLAGS.notes_en.length).toBeGreaterThan(0);
    const en = THAI_COVERAGE_FLAGS.notes_en.toLowerCase();
    expect(en).toContain("native");
    expect(en).toContain("audio");
    expect(en).toContain("pronunciation");
    expect(en).toContain("certification");
  });
});

describe("Thai coverage manifest — no CJK/Hangul/Japanese/Russian assumptions", () => {
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

  it("declares the Thai endonym in Thai script", () => {
    expect(THAI_COVERAGE_MANIFEST.name_th).toMatch(THAI);
  });
});
