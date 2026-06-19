// src/languages/thai/__tests__/thaiCourseMap.test.ts
//
// Guards the Thai course map. Proves:
//   • all six CEFR levels map to learner goals (VI + EN),
//   • every required module is present (survival, vocabulary, tones, review,
//     reading, writing, speaking, quizzes, plus leveled lessons),
//   • suggested orders exist for both VI and EN audiences and reference only
//     real modules,
//   • honest warnings (native review deferred, no audio, no pronunciation
//     scoring) are present,
//   • Thai script appears where expected, and there are NO CJK / Hangul /
//     kana / Cyrillic assumptions anywhere.

import { describe, it, expect } from "vitest";

import {
  THAI_COURSE_MAP,
  THAI_LEVEL_GOALS,
  THAI_MODULES,
  THAI_SUGGESTED_ORDERS,
  THAI_COURSE_WARNINGS,
  type ThaiModuleKey,
} from "../courseMap";

const THAI = /[฀-๿]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_MODULES: ThaiModuleKey[] = [
  "levels",
  "survival",
  "vocabulary",
  "tones",
  "review",
  "reading",
  "writing",
  "speaking",
  "quizzes",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(THAI_COURSE_MAP);
  return out;
}

describe("Thai course map — levels → goals", () => {
  it("covers all six CEFR levels exactly once, in order", () => {
    expect(THAI_LEVEL_GOALS.map((g) => g.level)).toEqual(ALL_LEVELS);
  });

  it("each level has VI and EN goal + can-do text", () => {
    for (const g of THAI_LEVEL_GOALS) {
      expect(g.goal_vi.length).toBeGreaterThan(0);
      expect(g.goal_en.length).toBeGreaterThan(0);
      expect(g.cando_vi.length).toBeGreaterThan(0);
      expect(g.cando_en.length).toBeGreaterThan(0);
      expect(g.label_vi.length).toBeGreaterThan(0);
      expect(g.label_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai course map — modules", () => {
  it("includes every required module", () => {
    const keys = new Set(THAI_MODULES.map((m) => m.key));
    for (const k of REQUIRED_MODULES) expect(keys.has(k)).toBe(true);
  });

  it("module keys are unique", () => {
    const keys = THAI_MODULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each module has VI and EN title + description", () => {
    for (const m of THAI_MODULES) {
      expect(m.title_vi.length).toBeGreaterThan(0);
      expect(m.title_en.length).toBeGreaterThan(0);
      expect(m.desc_vi.length).toBeGreaterThan(0);
      expect(m.desc_en.length).toBeGreaterThan(0);
    }
  });

  it("at least one module shows a Thai-script title", () => {
    expect(THAI_MODULES.some((m) => THAI.test(m.title_th))).toBe(true);
  });
});

describe("Thai course map — suggested orders", () => {
  it("provides an order for both VI and EN audiences", () => {
    const audiences = new Set(THAI_SUGGESTED_ORDERS.map((o) => o.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
  });

  it("every order references only real modules and covers them all", () => {
    const valid = new Set(THAI_MODULES.map((m) => m.key));
    for (const o of THAI_SUGGESTED_ORDERS) {
      for (const k of o.order) expect(valid.has(k)).toBe(true);
      // No duplicates within an order.
      expect(new Set(o.order).size).toBe(o.order.length);
      // Covers every module.
      expect(new Set(o.order)).toEqual(valid);
      expect(o.note_vi.length).toBeGreaterThan(0);
      expect(o.note_en.length).toBeGreaterThan(0);
    }
  });

  it("the VI and EN orders are genuinely different", () => {
    const vi = THAI_SUGGESTED_ORDERS.find((o) => o.audience === "vi")!.order;
    const en = THAI_SUGGESTED_ORDERS.find((o) => o.audience === "en")!.order;
    expect(vi).not.toEqual(en);
  });
});

describe("Thai course map — honest warnings", () => {
  it("surfaces the deferred-native-review, no-audio, and no-scoring caveats", () => {
    const keys = new Set(THAI_COURSE_WARNINGS.map((w) => w.key));
    expect(keys.has("native_review")).toBe(true);
    expect(keys.has("no_audio")).toBe(true);
    expect(keys.has("no_pron_scoring")).toBe(true);
  });

  it("each warning has VI and EN text", () => {
    for (const w of THAI_COURSE_WARNINGS) {
      expect(w.text_vi.length).toBeGreaterThan(0);
      expect(w.text_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Thai course map — no CJK/Hangul/Japanese/Russian assumptions", () => {
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

  it("the course map declares the Thai endonym in Thai script", () => {
    expect(THAI_COURSE_MAP.name_th).toMatch(THAI);
  });
});
