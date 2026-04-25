import { describe, it, expect } from "vitest";

import {
  bandForScore,
  estimateTOEICScore,
  TOEIC_SCORE_BANDS,
} from "../score-bands";

describe("bandForScore", () => {
  it("returns below_a1 at the floor (10)", () => {
    expect(bandForScore(10).id).toBe("below_a1");
  });

  it("returns c2 at the cap (990)", () => {
    expect(bandForScore(990).id).toBe("c2");
  });

  it.each([
    [200, "below_a1"],
    [225, "a1"],
    [400, "a1"],
    [410, "a2"],
    [555, "b1"],
    [785, "b2"],
    [905, "c1"],
    [945, "c2"],
  ])("score %d → band %s", (score, expected) => {
    expect(bandForScore(score).id).toBe(expected);
  });

  it("clamps gracefully above 990 → c2", () => {
    expect(bandForScore(2000).id).toBe("c2");
  });

  it("bands are non-overlapping and cover 10-990", () => {
    // Walk every score; every score lands in exactly one band.
    const seen = new Set<string>();
    for (let s = 10; s <= 990; s += 5) {
      const matches = TOEIC_SCORE_BANDS.filter(
        (b) => s >= b.minScore && s <= b.maxScore,
      );
      expect(matches).toHaveLength(1);
      seen.add(matches[0].id);
    }
    expect(seen.size).toBe(TOEIC_SCORE_BANDS.length);
  });
});

describe("estimateTOEICScore", () => {
  it("returns floors when no rows are passed", () => {
    const r = estimateTOEICScore([]);
    expect(r.listeningScore).toBe(5);
    expect(r.readingScore).toBe(5);
    expect(r.totalScore).toBe(10);
    expect(r.band.id).toBe("below_a1");
  });

  it("perfect Listening only → 495 listening, 5 reading", () => {
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 6, total: 6 },
      { sectionId: "listening_question_response", correct: 25, total: 25 },
      { sectionId: "listening_conversations", correct: 39, total: 39 },
      { sectionId: "listening_talks", correct: 30, total: 30 },
    ]);
    expect(r.listeningScore).toBe(495);
    expect(r.readingScore).toBe(5);
    expect(r.totalScore).toBe(500);
  });

  it("perfect both halves → 990 total, c2 band", () => {
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 6, total: 6 },
      { sectionId: "listening_question_response", correct: 25, total: 25 },
      { sectionId: "listening_conversations", correct: 39, total: 39 },
      { sectionId: "listening_talks", correct: 30, total: 30 },
      { sectionId: "reading_incomplete_sentences", correct: 30, total: 30 },
      { sectionId: "reading_text_completion", correct: 16, total: 16 },
      { sectionId: "reading_comprehension", correct: 54, total: 54 },
    ]);
    expect(r.totalScore).toBe(990);
    expect(r.band.id).toBe("c2");
  });

  it("zero correct in both halves → 5+5 (floors), below_a1", () => {
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 0, total: 6 },
      { sectionId: "reading_incomplete_sentences", correct: 0, total: 30 },
    ]);
    expect(r.listeningScore).toBe(5);
    expect(r.readingScore).toBe(5);
    expect(r.totalScore).toBe(10);
    expect(r.band.id).toBe("below_a1");
  });

  it("rounds to the nearest 5 (matches official TOEIC reporting)", () => {
    // Half score, single section → ratio scaled then clamped to nearest 5.
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 3, total: 6 },
    ]);
    // ratio 0.5 over a section weight (6/100)*495 = 29.7,
    // mean over the 1-section listening half: 29.7 / (6/100) = ~247.5
    // → round to 245 or 250. Either way must end in 0 or 5.
    expect(r.listeningScore % 5).toBe(0);
  });

  it("ignores rows with non-positive total", () => {
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 6, total: 0 },
      { sectionId: "listening_question_response", correct: 25, total: 25 },
    ]);
    // Only the second row contributes; we extrapolate from question_response
    // alone within Listening.
    expect(r.listeningScore).toBe(495);
  });

  it("ignores unknown sectionId rows", () => {
    const r = estimateTOEICScore([
      { sectionId: "listening_photographs", correct: 6, total: 6 },
      { sectionId: "garbage_id", correct: 999, total: 999 },
    ]);
    // Only the photographs row contributes — listening half saturated.
    expect(r.listeningScore).toBe(495);
  });
});
