import { describe, expect, it } from "vitest";
import { summarizeCorrections, type CorrectionRecord } from "../learningMemory";

function makeRecord(overrides: Partial<CorrectionRecord> = {}): CorrectionRecord {
  return {
    id: `rec-${Math.random().toString(36).slice(2, 8)}`,
    original: "test original",
    corrected: "test corrected",
    topic: "present-simple",
    cefr: "A2",
    createdAt: Date.now(),
    practiced: false,
    ...overrides,
  };
}

describe("getMemorySummary", () => {
  it("M3-T1: empty store returns empty summary", async () => {
    const summary = summarizeCorrections([]);
    expect(summary.totalCorrections).toBe(0);
    expect(summary.practicedCount).toBe(0);
    expect(summary.strongestTopic).toBe("");
    expect(summary.lastPracticedAt).toBeNull();
  });

  it("M3-T2: single correction populates summary", async () => {
    const summary = summarizeCorrections([makeRecord({ topic: "past-tense", createdAt: 1000 })]);
    expect(summary.totalCorrections).toBe(1);
    expect(summary.strongestTopic).toBe("past-tense");
    expect(summary.lastPracticedTopic).toBe("past-tense");
    expect(summary.lastPracticedAt).toBe(1000);
  });

  it("M3-T3: multiple topics — strongest identified", async () => {
    const summary = summarizeCorrections([
      makeRecord({ id: "a", topic: "articles", createdAt: 1000 }),
      makeRecord({ id: "b", topic: "articles", createdAt: 2000 }),
      makeRecord({ id: "c", topic: "articles", createdAt: 3000 }),
      makeRecord({ id: "d", topic: "past-tense", createdAt: 4000 }),
      makeRecord({ id: "e", topic: "past-tense", createdAt: 5000 }),
      makeRecord({ id: "f", topic: "prepositions", createdAt: 6000 }),
    ]);
    expect(summary.totalCorrections).toBe(6);
    expect(summary.strongestTopic).toBe("articles");
    expect(summary.strongestTopicCount).toBe(3);
    expect(summary.topicNeedingReview).toBe("prepositions");
    expect(summary.lastPracticedTopic).toBe("prepositions");
  });

  it("M3-T4: practiced count tracked", async () => {
    const summary = summarizeCorrections([
      makeRecord({ id: "a", practiced: true }),
      makeRecord({ id: "b", practiced: true }),
      makeRecord({ id: "c", practiced: false }),
    ]);
    expect(summary.totalCorrections).toBe(3);
    expect(summary.practicedCount).toBe(2);
  });

  it("M3-T5: records with missing topic default to 'general'", async () => {
    const summary = summarizeCorrections([makeRecord({ id: "a", topic: "" })]);
    expect(summary.strongestTopic).toBe("general");
  });

  it("M3-T6: getMemorySummary never returns raw text", async () => {
    const summary = summarizeCorrections([makeRecord({
      original: "I has a secret email test@example.com",
      corrected: "I have a secret email test@example.com",
    })]);
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain("test@example.com");
    expect(serialized).not.toContain("I has a secret");
    expect(summary.totalCorrections).toBe(1);
  });
});
