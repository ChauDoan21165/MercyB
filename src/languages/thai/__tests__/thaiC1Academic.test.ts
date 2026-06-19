// Tests for the Thai C1 Academic / Professional lesson batch (A6 track).
//
// These pin the structural contract of lessons-c1-academic.ts so the batch
// stays app-ready: bilingual VN+EN coverage, Thai script present, romanization
// where the field demands it, and unique stable ids. Native review is deferred
// — these tests check shape and completeness, NOT linguistic correctness.

import { describe, it, expect } from "vitest";

import { lessons } from "../lessons-c1-academic";

// Matches at least one character in the Thai Unicode block (U+0E00–U+0E7F).
const THAI = /[฀-๿]/;

describe("Thai C1 academic batch — size & ids", () => {
  it("contains 10–15 compact lessons", () => {
    expect(lessons.length).toBeGreaterThanOrEqual(10);
    expect(lessons.length).toBeLessThanOrEqual(15);
  });

  it("every lesson id is unique and non-empty", () => {
    const ids = lessons.map((l) => l.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every lesson is tagged level C1", () => {
    expect(lessons.every((l) => l.level === "C1")).toBe(true);
  });

  it("every category is one of the academic/professional set", () => {
    const allowed = new Set([
      "presentation",
      "report",
      "academic_reading",
      "professional_writing",
      "structured_argument",
      "meeting",
      "evidence_contrast",
    ]);
    expect(lessons.every((l) => allowed.has(l.category))).toBe(true);
  });
});

describe("Thai C1 academic batch — bilingual + Thai-script contract", () => {
  it("every lesson carries a Thai title plus VN & EN titles", () => {
    for (const l of lessons) {
      expect(THAI.test(l.title_th)).toBe(true);
      expect(l.title_vi.trim().length).toBeGreaterThan(0);
      expect(l.title_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every lesson has notes and tips in BOTH Vietnamese and English", () => {
    for (const l of lessons) {
      expect(l.notes_vi.trim().length).toBeGreaterThan(0);
      expect(l.notes_en.trim().length).toBeGreaterThan(0);
      expect(l.tip_vi.trim().length).toBeGreaterThan(0);
      expect(l.tip_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every sentence has Thai script, romanization, VN and EN", () => {
    for (const l of lessons) {
      expect(l.sentences.length).toBeGreaterThanOrEqual(3);
      for (const s of l.sentences) {
        expect(THAI.test(s.th)).toBe(true);
        expect(s.rom.trim().length).toBeGreaterThan(0);
        expect(s.vi.trim().length).toBeGreaterThan(0);
        expect(s.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("every vocab entry has Thai word, romanization, VN, EN and a POS", () => {
    for (const l of lessons) {
      expect(l.vocabulary.length).toBeGreaterThanOrEqual(3);
      for (const v of l.vocabulary) {
        expect(THAI.test(v.word)).toBe(true);
        expect(v.rom.trim().length).toBeGreaterThan(0);
        expect(v.vi.trim().length).toBeGreaterThan(0);
        expect(v.en.trim().length).toBeGreaterThan(0);
        expect(v.pos.trim().length).toBeGreaterThan(0);
      }
    }
  });
});

describe("Thai C1 academic batch — coverage of target frames", () => {
  it("covers presentation, report, academic reading, professional writing, argument, meeting and evidence/contrast", () => {
    const cats = new Set(lessons.map((l) => l.category));
    expect(cats.has("presentation")).toBe(true);
    expect(cats.has("report")).toBe(true);
    expect(cats.has("academic_reading")).toBe(true);
    expect(cats.has("professional_writing")).toBe(true);
    expect(cats.has("structured_argument")).toBe(true);
    expect(cats.has("meeting")).toBe(true);
    expect(cats.has("evidence_contrast")).toBe(true);
  });
});
