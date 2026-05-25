import { describe, expect, it } from "vitest";
import {
  buildMasteryGraph,
  getNextMasteryFocus,
} from "@/lib/tutor/masteryGraph";

describe("masteryGraph", () => {
  it("converts safe memory summary fields into topic mastery signals", () => {
    const graph = buildMasteryGraph({
      practiceCount: 4,
      strongestTopic: "present simple",
      topicNeedingReview: "past tense",
      suggestedNextFocus: "past tense",
      topicCounts: {
        "present simple": 3,
        "past tense": 1,
      },
      confidenceTrend: "steady",
      updatedAt: 12345,
    });

    expect(graph[0]).toMatchObject({
      topicId: "past-tense",
      needsReview: true,
      confidenceLevel: "low",
      recommendedMode: "grammar",
      updatedAt: 12345,
    });
    expect(graph[0].masteryScore).toBeGreaterThanOrEqual(0);
    expect(graph[0].masteryScore).toBeLessThanOrEqual(100);
    expect(graph[0].nextPracticeReason).toContain("past-tense needs review");

    expect(graph).toEqual(expect.arrayContaining([
      expect.objectContaining({
        topicId: "present-simple",
        needsReview: false,
        confidenceLevel: "high",
      }),
    ]));
  });

  it("uses weak pattern and correction category tags when topic fields are sparse", () => {
    const graph = buildMasteryGraph({
      practiceCount: 1,
      weakPattern: "article",
      correctionCategories: ["preposition"],
      topicTags: ["daily routine"],
      confidenceTrend: "needs-review",
    });

    expect(graph[0].topicId).toBe("article");
    expect(graph.map((signal) => signal.topicId)).toEqual(expect.arrayContaining([
      "article",
      "preposition",
      "daily-routine",
    ]));
    expect(graph[0]).toMatchObject({
      topicId: "article",
      needsReview: true,
      recommendedMode: "grammar",
    });
  });

  it("recommends Logic and Speak modes from safe topic hints", () => {
    expect(getNextMasteryFocus({
      practiceCount: 2,
      topicNeedingReview: "vietlish logic",
      confidenceTrend: "steady",
    })).toMatchObject({
      topicId: "vietlish-logic",
      recommendedMode: "logic",
      needsReview: true,
    });

    expect(getNextMasteryFocus({
      practiceCount: 2,
      topicNeedingReview: "pronunciation",
      confidenceTrend: "steady",
    })).toMatchObject({
      topicId: "pronunciation",
      recommendedMode: "speak",
      needsReview: true,
    });
  });

  it("returns a starter signal when there is no summary data yet", () => {
    expect(getNextMasteryFocus(null)).toEqual({
      topicId: "starter-sentence",
      masteryScore: 35,
      confidenceLevel: "not-enough-data",
      needsReview: true,
      nextPracticeReason: "starter-sentence needs review because the safe summary marks it as weak or below mastery.",
      recommendedMode: "grammar",
      updatedAt: 0,
    });
  });

  it("sanitizes learner-like text, ids, and contact details from topic ids", () => {
    const graph = buildMasteryGraph({
      practiceCount: 3,
      topicNeedingReview: "past tense user@example.com 123456789 I bought a private ticket yesterday",
      topicCounts: {
        "550e8400-e29b-41d4-a716-446655440000 article": 2,
      },
      updatedAt: 99.8,
    });

    const topicIds = graph.map((signal) => signal.topicId);
    expect(topicIds.join(" ")).not.toContain("user@example.com");
    expect(topicIds.join(" ")).not.toContain("123456789");
    expect(topicIds.join(" ")).not.toContain("550e8400");
    expect(topicIds[0].length).toBeLessThanOrEqual(48);
    expect(graph[0].updatedAt).toBe(99);
  });

  it("keeps mastery scoring deterministic and bounded", () => {
    const first = buildMasteryGraph({
      practiceCount: 50,
      strongestTopic: "introductions",
      topicCounts: { introductions: 20 },
      confidenceTrend: "improving",
      updatedAt: 1,
    });
    const second = buildMasteryGraph({
      practiceCount: 50,
      strongestTopic: "introductions",
      topicCounts: { introductions: 20 },
      confidenceTrend: "improving",
      updatedAt: 1,
    });

    expect(first).toEqual(second);
    expect(first[0]).toMatchObject({
      topicId: "introductions",
      masteryScore: 100,
      confidenceLevel: "high",
      needsReview: false,
      recommendedMode: "journey",
    });
  });
});
