// src/languages/thai/__tests__/thaiIndex.test.ts
//
// Guards the learner-facing Thai module index. Proves:
//   • all six CEFR levels are listed,
//   • every required module is present (survival, vocab, tones, review,
//     scenarios, reading, writing, speaking, diagnostics),
//   • every entry has VI + EN descriptions; keys are unique,
//   • learning paths reference only real entry keys,
//   • the honest note flags deferred native review + no audio/scoring,
//   • Thai script appears where expected, with NO CJK / Hangul / kana /
//     Cyrillic assumptions anywhere.

import { describe, it, expect } from "vitest";

import {
  THAI_INDEX,
  THAI_INDEX_LEVELS,
  THAI_INDEX_MODULES,
  THAI_INDEX_PATHS,
  THAI_INDEX_ENTRIES,
  THAI_INDEX_NOTE,
} from "../thaiIndex";

const THAI = /[฀-๿]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_MODULE_KEYS = [
  "survival",
  "vocab",
  "tones",
  "review",
  "scenarios",
  "reading",
  "writing",
  "speaking",
  "diagnostics",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(THAI_INDEX);
  return out;
}

describe("Thai index — levels", () => {
  it("lists all six CEFR levels in order", () => {
    expect(THAI_INDEX_LEVELS.map((e) => e.level)).toEqual(ALL_LEVELS);
  });

  it("every level entry has VI + EN title and description", () => {
    for (const e of THAI_INDEX_LEVELS) {
      expect(e.kind).toBe("level");
      expect(e.title_vi.length).toBeGreaterThan(0);
      expect(e.title_en.length).toBeGreaterThan(0);
      expect(e.desc_vi.length).toBeGreaterThan(0);
      expect(e.desc_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai index — modules", () => {
  it("includes every required module", () => {
    const keys = new Set(THAI_INDEX_MODULES.map((m) => m.key));
    for (const k of REQUIRED_MODULE_KEYS) expect(keys.has(k)).toBe(true);
  });

  it("every module entry has VI + EN title and description", () => {
    for (const m of THAI_INDEX_MODULES) {
      expect(m.kind).toBe("module");
      expect(m.title_vi.length).toBeGreaterThan(0);
      expect(m.title_en.length).toBeGreaterThan(0);
      expect(m.desc_vi.length).toBeGreaterThan(0);
      expect(m.desc_en.length).toBeGreaterThan(0);
    }
  });

  it("at least one module shows a Thai-script title", () => {
    expect(THAI_INDEX_MODULES.some((m) => THAI.test(m.title_th))).toBe(true);
  });
});

describe("Thai index — keys and entries", () => {
  it("all entry keys are unique", () => {
    const keys = THAI_INDEX_ENTRIES.map((e) => e.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("the flat aggregate is levels + modules", () => {
    expect(THAI_INDEX_ENTRIES.length).toBe(
      THAI_INDEX_LEVELS.length + THAI_INDEX_MODULES.length,
    );
  });
});

describe("Thai index — learning paths", () => {
  it("each path references only real entry keys", () => {
    const valid = new Set(THAI_INDEX_ENTRIES.map((e) => e.key));
    expect(THAI_INDEX_PATHS.length).toBeGreaterThan(0);
    for (const p of THAI_INDEX_PATHS) {
      expect(p.steps.length).toBeGreaterThan(0);
      for (const step of p.steps) expect(valid.has(step)).toBe(true);
      expect(p.title_vi.length).toBeGreaterThan(0);
      expect(p.title_en.length).toBeGreaterThan(0);
      expect(p.desc_vi.length).toBeGreaterThan(0);
      expect(p.desc_en.length).toBeGreaterThan(0);
    }
  });

  it("path keys are unique", () => {
    const keys = THAI_INDEX_PATHS.map((p) => p.key);
    expect(new Set(keys).size).toBe(keys.length);
  });
});

describe("Thai index — honest note", () => {
  it("flags deferred native review and missing audio/scoring in VI + EN", () => {
    expect(THAI_INDEX_NOTE.text_vi.length).toBeGreaterThan(0);
    expect(THAI_INDEX_NOTE.text_en.length).toBeGreaterThan(0);
    expect(THAI_INDEX_NOTE.text_en.toLowerCase()).toContain("native review");
    expect(THAI_INDEX_NOTE.text_en.toLowerCase()).toContain("audio");
  });
});

describe("Thai index — no CJK/Hangul/Japanese/Russian assumptions", () => {
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
    expect(THAI_INDEX.name_th).toMatch(THAI);
  });
});
