// src/data/exam-prep/vstep/__tests__/listening-items.test.ts

import { describe, it, expect } from "vitest";
import { VSTEP_LISTENING_ITEMS } from "../listening-items";

describe("VSTEP_LISTENING_ITEMS", () => {
  it("has at least 10 items", () => {
    expect(VSTEP_LISTENING_ITEMS.length).toBeGreaterThanOrEqual(10);
  });

  it("every item has a valid id matching vstep_b[12]_listening_*", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.id).toMatch(/^vstep_b[12]_listening_[a-z0-9_]+$/);
    }
  });

  it("every item has level B1 or B2", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(["B1", "B2"]).toContain(item.level);
    }
  });

  it("every item has a valid section type", () => {
    const validSections = ["short_conversation", "announcement", "talk", "lecture", "discussion", "news_report"];
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(validSections).toContain(item.section);
    }
  });

  it("every item has a non-empty transcript", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.transcript.length).toBeGreaterThan(10);
    }
  });

  it("every item has at least 3 questions", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.questions.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every question has number, question_en, question_vi, and answer", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      for (const q of item.questions) {
        expect(typeof q.number).toBe("number");
        expect(q.question_en.length).toBeGreaterThan(5);
        expect(q.question_vi.length).toBeGreaterThan(5);
        expect(q.answer.length).toBeGreaterThan(0);
      }
    }
  });

  it("MCQ questions have exactly 4 options", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      for (const q of item.questions) {
        if (q.options) {
          expect(q.options.length).toBe(4);
          expect(["A", "B", "C", "D"]).toContain(q.answer);
        }
      }
    }
  });

  it("every item has a valid audioKey", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.audioKey).toMatch(/^vstep-listening\/vstep_b[12]_listening_.+\.mp3$/);
    }
  });

  it("every item has at least 3 vietnameseLearnerTips", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.vietnameseLearnerTips.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("every item has a valid estimatedDurationSec", () => {
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(item.estimatedDurationSec).toBeGreaterThan(0);
    }
  });

  it("every item has a valid difficulty", () => {
    const validDifficulties = ["easy", "moderate", "challenging"];
    for (const item of VSTEP_LISTENING_ITEMS) {
      expect(validDifficulties).toContain(item.difficulty);
    }
  });
});
