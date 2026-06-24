// src/languages/punjabi/__tests__/punjabiProgressionMatrix.test.ts
//
// Guards the Punjabi Wave 5 progression matrix.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_PROGRESSION,
  PUNJABI_PROGRESSION_MATRIX,
  PUNJABI_PROGRESSION_REVIEW_CHECKPOINTS,
  PUNJABI_PROGRESSION_SCRIPT_NOTE,
  PUNJABI_PROGRESSION_SKILLS,
  PUNJABI_PROGRESSION_WARNINGS,
  type PunjabiMatrixSkill,
} from "../progressionMatrix";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_SKILLS: PunjabiMatrixSkill[] = [
  "script",
  "grammar",
  "vocabulary",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
  "review",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_PROGRESSION);
  return out;
}

describe("Punjabi progression matrix - CEFR coverage", () => {
  it("covers A1-C2 in order", () => {
    expect(PUNJABI_PROGRESSION_MATRIX.map((level) => level.level)).toEqual(ALL_LEVELS);
  });

  it("each level has bilingual labels and review checkpoint text", () => {
    for (const level of PUNJABI_PROGRESSION_MATRIX) {
      expect(level.label_vi.length).toBeGreaterThan(0);
      expect(level.label_en.length).toBeGreaterThan(0);
      expect(level.checkpoint_vi.length).toBeGreaterThan(0);
      expect(level.checkpoint_en.length).toBeGreaterThan(0);
      expect(level.cells.length).toBeGreaterThanOrEqual(4);
    }
  });
});

describe("Punjabi progression matrix - skills and cells", () => {
  it("declares the required skill axes", () => {
    expect(new Set(PUNJABI_PROGRESSION_SKILLS)).toEqual(new Set(REQUIRED_SKILLS));
  });

  it("connects each cell to examples with Gurmukhi, romanization, VI, and EN", () => {
    for (const level of PUNJABI_PROGRESSION_MATRIX) {
      for (const cell of level.cells) {
        expect(PUNJABI_PROGRESSION_SKILLS).toContain(cell.skill);
        expect(cell.focus_vi.length).toBeGreaterThan(0);
        expect(cell.focus_en.length).toBeGreaterThan(0);
        expect(cell.can_do_vi.length).toBeGreaterThan(0);
        expect(cell.can_do_en.length).toBeGreaterThan(0);
        expect(cell.examples.length).toBeGreaterThan(0);
        for (const example of cell.examples) {
          expect(example.gurmukhi).toMatch(GURMUKHI);
          expect(example.romanization.length).toBeGreaterThan(0);
          expect(example.vi.length).toBeGreaterThan(0);
          expect(example.en.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it("includes common learner traps where useful", () => {
    const cells = PUNJABI_PROGRESSION_MATRIX.flatMap((level) => level.cells);
    expect(cells.filter((cell) => cell.learner_trap_vi && cell.learner_trap_en).length).toBeGreaterThanOrEqual(10);
  });
});

describe("Punjabi progression matrix - practical domains", () => {
  it("covers script, grammar, vocabulary, survival, workplace, healthcare, public service, and review", () => {
    const present = new Set(PUNJABI_PROGRESSION_MATRIX.flatMap((level) => level.cells.map((cell) => cell.skill)));
    for (const skill of REQUIRED_SKILLS) expect(present.has(skill)).toBe(true);
  });

  it("includes Canada-practical examples across settlement/work/health/public-service style tasks", () => {
    const canadaCells = PUNJABI_PROGRESSION_MATRIX.flatMap((level) => level.cells).filter((cell) => cell.canada_practical);
    expect(canadaCells.length).toBeGreaterThanOrEqual(6);
    const text = canadaCells.map((cell) => `${cell.focus_en} ${cell.can_do_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public-service");
  });

  it("has one review checkpoint per CEFR level", () => {
    expect(PUNJABI_PROGRESSION_REVIEW_CHECKPOINTS.map((checkpoint) => checkpoint.after_level)).toEqual(ALL_LEVELS);
    for (const checkpoint of PUNJABI_PROGRESSION_REVIEW_CHECKPOINTS) {
      expect(checkpoint.vi.length).toBeGreaterThan(0);
      expect(checkpoint.en.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi progression matrix - scope and warnings", () => {
  it("declares Gurmukhi primary and Shahmukhi awareness-only", () => {
    expect(PUNJABI_PROGRESSION.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_PROGRESSION.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_PROGRESSION_SCRIPT_NOTE.en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_PROGRESSION_SCRIPT_NOTE.en.toLowerCase()).toContain("not a full course");
  });

  it("states native review is deferred and no audio/scoring is included", () => {
    expect(PUNJABI_PROGRESSION_WARNINGS.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_PROGRESSION_WARNINGS.native_review_en.toLowerCase()).toContain("not claimed");
    expect(PUNJABI_PROGRESSION_WARNINGS.no_audio_en.toLowerCase()).toContain("no audio");
    expect(PUNJABI_PROGRESSION_WARNINGS.no_audio_en.toLowerCase()).toContain("pronunciation scoring");
  });
});

describe("Punjabi progression matrix - no unrelated scripts", () => {
  const strings = allStrings();

  it("does not include Shahmukhi-script content", () => {
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
