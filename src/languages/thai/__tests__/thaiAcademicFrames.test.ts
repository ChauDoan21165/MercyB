// Tests for the Thai academic / essay frames batch (A6 Wave 3) — TEXT ONLY.
//
// Pins the structural contract of academicFrames.ts: count (40–80), B2–C2
// levels, full coverage of the ten frame categories, bilingual VN+EN fields,
// Thai script in frame + example, and the required pedagogical fields (use
// case, examples, cautions, practice prompt). Native review is deferred.

import { describe, it, expect } from "vitest";

import { academicFrames } from "../academicFrames";

const THAI = /[฀-๿]/;
const LEVELS = ["B2", "C1", "C2"] as const;
const CATEGORIES = [
  "introduce_topic",
  "cite_evidence",
  "contrast",
  "concession",
  "cause_effect",
  "evaluate",
  "define",
  "summarize",
  "conclude",
  "polite_disagree",
] as const;

describe("Thai academic frames — size, ids & levels", () => {
  it("contains 40–80 frames", () => {
    expect(academicFrames.length).toBeGreaterThanOrEqual(40);
    expect(academicFrames.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique and non-empty", () => {
    const ids = academicFrames.map((f) => f.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every frame level is B2, C1 or C2", () => {
    const set = new Set<string>(LEVELS);
    expect(academicFrames.every((f) => set.has(f.level))).toBe(true);
  });

  it("uses all three levels B2–C2", () => {
    const present = new Set(academicFrames.map((f) => f.level));
    for (const lvl of LEVELS) expect(present.has(lvl)).toBe(true);
  });
});

describe("Thai academic frames — category coverage", () => {
  it("every category is one of the ten target topics", () => {
    const set = new Set<string>(CATEGORIES);
    expect(academicFrames.every((f) => set.has(f.category))).toBe(true);
  });

  it("covers all ten target topics", () => {
    const present = new Set(academicFrames.map((f) => f.category));
    for (const cat of CATEGORIES) expect(present.has(cat)).toBe(true);
  });
});

describe("Thai academic frames — bilingual + Thai-script contract", () => {
  it("every frame has Thai-script pattern + romanization + VN & EN gloss", () => {
    for (const f of academicFrames) {
      expect(THAI.test(f.frame_th)).toBe(true);
      expect(f.frame_rom.trim().length).toBeGreaterThan(0);
      expect(f.frame_vi.trim().length).toBeGreaterThan(0);
      expect(f.frame_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has VN + EN use case, cautions and practice prompt", () => {
    for (const f of academicFrames) {
      expect(f.use_case_vi.trim().length).toBeGreaterThan(0);
      expect(f.use_case_en.trim().length).toBeGreaterThan(0);
      expect(f.cautions_vi.trim().length).toBeGreaterThan(0);
      expect(f.cautions_en.trim().length).toBeGreaterThan(0);
      expect(f.practice_vi.trim().length).toBeGreaterThan(0);
      expect(f.practice_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has at least one example with Thai script, romanization, VN and EN", () => {
    for (const f of academicFrames) {
      expect(f.examples.length).toBeGreaterThanOrEqual(1);
      for (const ex of f.examples) {
        expect(THAI.test(ex.th)).toBe(true);
        expect(ex.rom.trim().length).toBeGreaterThan(0);
        expect(ex.vi.trim().length).toBeGreaterThan(0);
        expect(ex.en.trim().length).toBeGreaterThan(0);
      }
    }
  });
});
