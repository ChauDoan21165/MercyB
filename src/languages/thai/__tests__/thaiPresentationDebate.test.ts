// Tests for the Thai presentation / debate pack (A6 Wave 6) — TEXT ONLY.
//
// Pins the structural contract of presentationDebate.ts: count (40–80), full
// coverage of the seven support categories (opening, transition, evidence,
// counterargument, polite disagreement, audience question, conclusion),
// bilingual VN+EN fields, Thai script in frame + example, and the use-case /
// example / note fields. Generic study support — no current-news claim. Native
// review is deferred.

import { describe, it, expect } from "vitest";

import { presentationDebate } from "../presentationDebate";

const THAI = /[฀-๿]/;
const CATEGORIES = [
  "opening",
  "transition",
  "evidence",
  "counterargument",
  "polite_disagreement",
  "audience_question",
  "conclusion",
] as const;

describe("Thai presentation/debate — size & ids", () => {
  it("contains 40–80 frames", () => {
    expect(presentationDebate.length).toBeGreaterThanOrEqual(40);
    expect(presentationDebate.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique and non-empty", () => {
    const ids = presentationDebate.map((f) => f.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai presentation/debate — category coverage", () => {
  it("every category is one of the seven support functions", () => {
    const set = new Set<string>(CATEGORIES);
    expect(presentationDebate.every((f) => set.has(f.category))).toBe(true);
  });

  it("covers all seven support functions", () => {
    const present = new Set(presentationDebate.map((f) => f.category));
    for (const cat of CATEGORIES) expect(present.has(cat)).toBe(true);
  });
});

describe("Thai presentation/debate — bilingual + Thai-script contract", () => {
  it("every frame has Thai-script pattern + romanization + VN & EN gloss", () => {
    for (const f of presentationDebate) {
      expect(THAI.test(f.frame_th)).toBe(true);
      expect(f.frame_rom.trim().length).toBeGreaterThan(0);
      expect(f.frame_vi.trim().length).toBeGreaterThan(0);
      expect(f.frame_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has VN + EN use case and note", () => {
    for (const f of presentationDebate) {
      expect(f.use_case_vi.trim().length).toBeGreaterThan(0);
      expect(f.use_case_en.trim().length).toBeGreaterThan(0);
      expect(f.note_vi.trim().length).toBeGreaterThan(0);
      expect(f.note_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has an example with Thai script, romanization, VN and EN", () => {
    for (const f of presentationDebate) {
      const ex = f.example;
      expect(THAI.test(ex.th)).toBe(true);
      expect(ex.rom.trim().length).toBeGreaterThan(0);
      expect(ex.vi.trim().length).toBeGreaterThan(0);
      expect(ex.en.trim().length).toBeGreaterThan(0);
    }
  });
});
