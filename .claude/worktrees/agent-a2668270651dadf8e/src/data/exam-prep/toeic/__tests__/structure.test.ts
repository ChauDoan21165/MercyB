import { describe, it, expect } from "vitest";

import {
  TOEIC_SECTIONS,
  TOEIC_LISTENING_SECTIONS,
  TOEIC_READING_SECTIONS,
  TOEIC_TOTAL_QUESTIONS,
  TOEIC_TOTAL_TIME_MINUTES,
  getSectionById,
} from "../structure";

describe("TOEIC section structure", () => {
  it("has exactly 7 sections", () => {
    expect(TOEIC_SECTIONS).toHaveLength(7);
  });

  it("Listening has 4 parts (1-4)", () => {
    expect(TOEIC_LISTENING_SECTIONS).toHaveLength(4);
    const partNumbers = TOEIC_LISTENING_SECTIONS.map((s) => s.partNumber).sort();
    expect(partNumbers).toEqual([1, 2, 3, 4]);
  });

  it("Reading has 3 parts (5-7)", () => {
    expect(TOEIC_READING_SECTIONS).toHaveLength(3);
    const partNumbers = TOEIC_READING_SECTIONS.map((s) => s.partNumber).sort();
    expect(partNumbers).toEqual([5, 6, 7]);
  });

  it("question counts sum to 200 (real TOEIC total)", () => {
    expect(TOEIC_TOTAL_QUESTIONS).toBe(200);
  });

  it("Listening + Reading question counts each total 100", () => {
    const listeningSum = TOEIC_LISTENING_SECTIONS.reduce(
      (s, x) => s + x.questionCount,
      0,
    );
    const readingSum = TOEIC_READING_SECTIONS.reduce(
      (s, x) => s + x.questionCount,
      0,
    );
    expect(listeningSum).toBe(100);
    expect(readingSum).toBe(100);
  });

  it("recommended total time stays close to the real exam (120 min)", () => {
    expect(TOEIC_TOTAL_TIME_MINUTES).toBeGreaterThanOrEqual(110);
    expect(TOEIC_TOTAL_TIME_MINUTES).toBeLessThanOrEqual(130);
  });

  it("every section has bilingual name + description and a positive time limit", () => {
    for (const s of TOEIC_SECTIONS) {
      expect(s.name_en.length).toBeGreaterThan(0);
      expect(s.name_vi.length).toBeGreaterThan(0);
      expect(s.description_en.length).toBeGreaterThan(0);
      expect(s.description_vi.length).toBeGreaterThan(0);
      expect(s.timeLimitMinutes).toBeGreaterThan(0);
      expect(s.questionCount).toBeGreaterThan(0);
      expect(s.difficultyRange.length).toBeGreaterThan(0);
    }
  });

  it("section ids are unique", () => {
    const ids = TOEIC_SECTIONS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("getSectionById returns the right row or null", () => {
    expect(getSectionById("listening_photographs")?.partNumber).toBe(1);
    expect(getSectionById("reading_comprehension")?.partNumber).toBe(7);
    expect(getSectionById("not_a_section")).toBeNull();
  });
});
