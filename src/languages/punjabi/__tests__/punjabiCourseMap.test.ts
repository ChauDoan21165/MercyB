// src/languages/punjabi/__tests__/punjabiCourseMap.test.ts
//
// Guards the Punjabi course map/navigation data.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_COURSE_MAP,
  PUNJABI_COURSE_WARNINGS,
  PUNJABI_LEVEL_GOALS,
  PUNJABI_MODULES,
  PUNJABI_SUGGESTED_ORDERS,
  type PunjabiModuleKey,
} from "../courseMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_MODULES: PunjabiModuleKey[] = [
  "levels",
  "survival",
  "vocabulary",
  "gurmukhi_script",
  "review",
  "reading",
  "writing",
  "speaking",
  "quizzes",
  "diagnostics",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_COURSE_MAP);
  return out;
}

describe("Punjabi course map - CEFR goals", () => {
  it("maps A1-C2 to learner goals in order", () => {
    expect(PUNJABI_LEVEL_GOALS.map((g) => g.level)).toEqual(ALL_LEVELS);
  });

  it("each level has VI, EN, Gurmukhi, and romanization", () => {
    for (const g of PUNJABI_LEVEL_GOALS) {
      expect(g.label_vi.length).toBeGreaterThan(0);
      expect(g.label_en.length).toBeGreaterThan(0);
      expect(g.goal_vi.length).toBeGreaterThan(0);
      expect(g.goal_en.length).toBeGreaterThan(0);
      expect(g.cando_vi.length).toBeGreaterThan(0);
      expect(g.cando_en.length).toBeGreaterThan(0);
      expect(g.sample_gurmukhi).toMatch(GURMUKHI);
      expect(g.romanization.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi course map - modules", () => {
  it("includes every required module", () => {
    const keys = new Set(PUNJABI_MODULES.map((m) => m.key));
    for (const key of REQUIRED_MODULES) expect(keys.has(key)).toBe(true);
  });

  it("module keys are unique", () => {
    const keys = PUNJABI_MODULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each module has Gurmukhi labels, romanization, VI, and EN descriptions", () => {
    for (const m of PUNJABI_MODULES) {
      expect(m.title_pa).toMatch(GURMUKHI);
      expect(m.romanization.length).toBeGreaterThan(0);
      expect(m.title_vi.length).toBeGreaterThan(0);
      expect(m.title_en.length).toBeGreaterThan(0);
      expect(m.desc_vi.length).toBeGreaterThan(0);
      expect(m.desc_en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi course map - suggested orders", () => {
  it("provides suggested orders for Vietnamese-speaking and English-speaking learners", () => {
    const audiences = new Set(PUNJABI_SUGGESTED_ORDERS.map((o) => o.audience));
    expect(audiences.has("vi")).toBe(true);
    expect(audiences.has("en")).toBe(true);
  });

  it("each suggested order references real modules and covers all modules", () => {
    const valid = new Set(PUNJABI_MODULES.map((m) => m.key));
    for (const o of PUNJABI_SUGGESTED_ORDERS) {
      expect(new Set(o.order).size).toBe(o.order.length);
      expect(new Set(o.order)).toEqual(valid);
      for (const key of o.order) expect(valid.has(key)).toBe(true);
      expect(o.note_vi.length).toBeGreaterThan(0);
      expect(o.note_en.length).toBeGreaterThan(0);
    }
  });

  it("the VI and EN audience orders differ", () => {
    const vi = PUNJABI_SUGGESTED_ORDERS.find((o) => o.audience === "vi")!.order;
    const en = PUNJABI_SUGGESTED_ORDERS.find((o) => o.audience === "en")!.order;
    expect(vi).not.toEqual(en);
  });
});

describe("Punjabi course map - warnings and script scope", () => {
  it("surfaces native-review, audio, pronunciation scoring, certification, and Shahmukhi caveats", () => {
    const keys = new Set(PUNJABI_COURSE_WARNINGS.map((w) => w.key));
    expect(keys.has("native_review_deferred")).toBe(true);
    expect(keys.has("no_audio")).toBe(true);
    expect(keys.has("no_pronunciation_scoring")).toBe(true);
    expect(keys.has("no_certification")).toBe(true);
    expect(keys.has("shahmukhi_awareness_only")).toBe(true);
  });

  it("each warning has VI and EN text", () => {
    for (const w of PUNJABI_COURSE_WARNINGS) {
      expect(w.text_vi.length).toBeGreaterThan(0);
      expect(w.text_en.length).toBeGreaterThan(0);
    }
  });

  it("declares Gurmukhi primary and Punjabi endonym in Gurmukhi", () => {
    expect(PUNJABI_COURSE_MAP.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_COURSE_MAP.name_pa).toMatch(GURMUKHI);
  });
});

describe("Punjabi course map - no unrelated script assumptions", () => {
  const strings = allStrings();

  it("mentions Shahmukhi without including Shahmukhi-script content", () => {
    expect(PUNJABI_COURSE_MAP.script_note_en.toLowerCase()).toContain("shahmukhi");
    for (const s of strings) expect(s).not.toMatch(SHAHMUKHI);
  });

  it("contains no CJK, Hangul, kana, or Cyrillic script", () => {
    for (const s of strings) {
      expect(s).not.toMatch(CJK);
      expect(s).not.toMatch(HANGUL);
      expect(s).not.toMatch(KANA);
      expect(s).not.toMatch(CYRILLIC);
    }
  });
});
