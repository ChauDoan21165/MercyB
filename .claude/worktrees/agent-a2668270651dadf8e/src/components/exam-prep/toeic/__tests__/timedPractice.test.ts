// Pure-logic tests for the practice scorer. The component itself relies
// on Supabase + react-router; here we test the scoreAttempt helper that
// drives the result block — that's the bit a future regression is most
// likely to break.

import { describe, it, expect } from "vitest";
import { scoreAttempt } from "../TOEICTimedPractice";

describe("scoreAttempt", () => {
  it("counts a single-question correct answer", () => {
    const questions = [
      {
        id: "q1",
        sectionId: "reading_incomplete_sentences",
        difficulty: "easy" as const,
        choices: ["a", "b", "c", "d"],
        correctIndex: 2,
      },
    ];
    const answers = { q1: { 0: 2 } };
    expect(scoreAttempt(questions, answers)).toEqual({ score: 1, totalAnswerable: 1 });
  });

  it("misses single-question wrong answer", () => {
    const questions = [
      {
        id: "q1",
        sectionId: "reading_incomplete_sentences",
        difficulty: "easy" as const,
        choices: ["a", "b"],
        correctIndex: 0,
      },
    ];
    const answers = { q1: { 0: 1 } };
    expect(scoreAttempt(questions, answers)).toEqual({ score: 0, totalAnswerable: 1 });
  });

  it("scores composite questions sub by sub", () => {
    const questions = [
      {
        id: "p3-001",
        sectionId: "listening_conversations",
        difficulty: "medium" as const,
        questions: [
          { prompt: "?", choices: ["a", "b"], correctIndex: 1, explanation_en: "", explanation_vi: "" },
          { prompt: "?", choices: ["a", "b"], correctIndex: 0, explanation_en: "", explanation_vi: "" },
          { prompt: "?", choices: ["a", "b"], correctIndex: 1, explanation_en: "", explanation_vi: "" },
        ],
      },
    ];
    const answers = { "p3-001": { 0: 1, 1: 1, 2: 1 } }; // 1, 0, 1 expected → 2 right
    expect(scoreAttempt(questions, answers)).toEqual({ score: 2, totalAnswerable: 3 });
  });

  it("handles missing answers as wrong", () => {
    const questions = [
      {
        id: "q1",
        sectionId: "reading_incomplete_sentences",
        difficulty: "easy" as const,
        choices: ["a", "b"],
        correctIndex: 1,
      },
    ];
    expect(scoreAttempt(questions, {})).toEqual({ score: 0, totalAnswerable: 1 });
  });

  it("ignores questions missing both correctIndex and sub-questions", () => {
    const questions = [
      {
        id: "weird",
        sectionId: "listening_photographs",
        difficulty: "easy" as const,
        // No correctIndex, no questions array — shouldn't count toward totalAnswerable.
      },
    ];
    expect(scoreAttempt(questions, {})).toEqual({ score: 0, totalAnswerable: 0 });
  });
});
