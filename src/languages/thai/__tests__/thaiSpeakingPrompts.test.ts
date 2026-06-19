// Tests for the Thai speaking-prompt batch (A6 Wave 2) — TEXT ONLY.
//
// Pins the structural contract of speakingPrompts.ts: count, level coverage,
// bilingual VN+EN guidance, Thai script presence, and the required pedagogical
// fields (scenario, target phrases, expected shape, sample answer, register
// notes). No audio / mic / scoring is referenced — these tests check data
// shape, not pronunciation. Native review is deferred.

import { describe, it, expect } from "vitest";

import { speakingPrompts } from "../speakingPrompts";

// At least one character in the Thai Unicode block (U+0E00–U+0E7F).
const THAI = /[฀-๿]/;
const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;

describe("Thai speaking prompts — size, ids & levels", () => {
  it("contains 50–100 prompts", () => {
    expect(speakingPrompts.length).toBeGreaterThanOrEqual(50);
    expect(speakingPrompts.length).toBeLessThanOrEqual(100);
  });

  it("every id is unique and non-empty", () => {
    const ids = speakingPrompts.map((p) => p.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every prompt level is a valid CEFR level", () => {
    const set = new Set<string>(LEVELS);
    expect(speakingPrompts.every((p) => set.has(p.level))).toBe(true);
  });

  it("covers all six levels A1–C2", () => {
    const present = new Set(speakingPrompts.map((p) => p.level));
    for (const lvl of LEVELS) {
      expect(present.has(lvl)).toBe(true);
    }
  });
});

describe("Thai speaking prompts — bilingual + Thai-script contract", () => {
  it("every prompt has a VN and EN scenario", () => {
    for (const p of speakingPrompts) {
      expect(p.scenario_vi.trim().length).toBeGreaterThan(0);
      expect(p.scenario_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every prompt has VN + EN expected shape and register notes", () => {
    for (const p of speakingPrompts) {
      expect(p.expected_shape_vi.trim().length).toBeGreaterThan(0);
      expect(p.expected_shape_en.trim().length).toBeGreaterThan(0);
      expect(p.register_notes_vi.trim().length).toBeGreaterThan(0);
      expect(p.register_notes_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every prompt has at least two target phrases, each fully bilingual with Thai script + romanization", () => {
    for (const p of speakingPrompts) {
      expect(p.target_phrases.length).toBeGreaterThanOrEqual(2);
      for (const ph of p.target_phrases) {
        expect(THAI.test(ph.th)).toBe(true);
        expect(ph.rom.trim().length).toBeGreaterThan(0);
        expect(ph.vi.trim().length).toBeGreaterThan(0);
        expect(ph.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every prompt has a sample answer with Thai script, romanization, VN and EN", () => {
    for (const p of speakingPrompts) {
      const s = p.sample_answer;
      expect(THAI.test(s.th)).toBe(true);
      expect(s.rom.trim().length).toBeGreaterThan(0);
      expect(s.vi.trim().length).toBeGreaterThan(0);
      expect(s.en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Thai speaking prompts — level distribution", () => {
  it("has at least 4 prompts at every level (balanced coverage)", () => {
    for (const lvl of LEVELS) {
      const n = speakingPrompts.filter((p) => p.level === lvl).length;
      expect(n).toBeGreaterThanOrEqual(4);
    }
  });
});
