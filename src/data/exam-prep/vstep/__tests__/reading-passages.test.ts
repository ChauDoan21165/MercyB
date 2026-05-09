// src/data/exam-prep/vstep/__tests__/reading-passages.test.ts

import { describe, it, expect } from "vitest";
import { VSTEP_READING_PASSAGES } from "../reading-passages";

describe("VSTEP_READING_PASSAGES", () => {
  it("has at least 10 passages", () => {
    expect(VSTEP_READING_PASSAGES.length).toBeGreaterThanOrEqual(10);
  });

  it("every passage has a valid id matching vstep_b[12]_reading_*", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(p.id).toMatch(/^vstep_b[12]_reading_[a-z0-9_]+$/);
    }
  });

  it("every passage has level B1 or B2", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(["B1", "B2"]).toContain(p.level);
    }
  });

  it("every passage has a valid section type", () => {
    const valid = ["email", "notice", "short_article", "academic_text", "opinion_piece", "report"];
    for (const p of VSTEP_READING_PASSAGES) {
      expect(valid).toContain(p.section);
    }
  });

  it("every passage has non-empty passage text", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(p.passage.length).toBeGreaterThan(50);
    }
  });

  it("every passage has at least 3 questions", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(p.questions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every question has number, question_en, question_vi, and answer", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      for (const q of p.questions) {
        expect(typeof q.number).toBe("number");
        expect(q.question_en.length).toBeGreaterThan(5);
        expect(q.question_vi.length).toBeGreaterThan(5);
        expect(q.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it("MCQ questions have exactly 4 options", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      for (const q of p.questions) {
        if (q.options) {
          expect(q.options.length).toBe(4);
          expect(["A", "B", "C", "D"]).toContain(q.answer);
        }
      }
    }
  });

  it("every passage has at least 3 vocabulary items", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(p.vocabulary.length).toBeGreaterThanOrEqual(3);
      for (const v of p.vocabulary) {
        expect(v.word.length).toBeGreaterThan(1);
        expect(v.translation_vi.length).toBeGreaterThan(1);
      }
    }
  });

  it("every passage has non-empty vietnameseLearnerNotes", () => {
    for (const p of VSTEP_READING_PASSAGES) {
      expect(p.vietnameseLearnerNotes.length).toBeGreaterThan(10);
    }
  });

  it("every passage has a valid difficulty", () => {
    const valid = ["easy", "moderate", "challenging"];
    for (const p of VSTEP_READING_PASSAGES) {
      expect(valid).toContain(p.difficulty);
    }
  });
});
