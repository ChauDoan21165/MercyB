import { describe, expect, it } from "vitest";
import { getTutorMemoryKey, summarizeCorrections, type CorrectionRecord } from "../learningMemory";

function makeRecord(overrides: Partial<CorrectionRecord> = {}): CorrectionRecord {
  return {
    id: `rec-${Math.random().toString(36).slice(2, 8)}`,
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
    const legacyRecord = {
      ...makeRecord(),
      original: "I has a secret email test@example.com",
      corrected: "I have a secret email test@example.com",
    };
    const summary = summarizeCorrections([legacyRecord]);
    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain("test@example.com");
    expect(serialized).not.toContain("I has a secret");
    expect(summary.totalCorrections).toBe(1);
  });

  it("A7-T1: English memory is separate from French memory", () => {
    const records = [
      makeRecord({ id: "en-1", targetLanguage: "en", topic: "articles" }),
      makeRecord({ id: "fr-1", targetLanguage: "fr", topic: "gender-agreement" }),
    ];

    const english = summarizeCorrections(records, "ai-tutor", "en");
    const french = summarizeCorrections(records, "ai-tutor", "fr");

    expect(english.totalCorrections).toBe(1);
    expect(english.strongestTopic).toBe("articles");
    expect(french.totalCorrections).toBe(1);
    expect(french.strongestTopic).toBe("gender-agreement");
  });

  it("A7-T2: AI Tutor memory is separate from Việt Kids English memory", () => {
    const records = [
      makeRecord({ id: "ai-1", tutorProduct: "ai-tutor", targetLanguage: "en", topic: "articles" }),
      makeRecord({ id: "kids-1", tutorProduct: "vi-kids-english", targetLanguage: "en", topic: "third-person-s" }),
    ];

    const aiTutor = summarizeCorrections(records, "ai-tutor", "en");
    const kidsTutor = summarizeCorrections(records, "vi-kids-english", "en");

    expect(aiTutor.totalCorrections).toBe(1);
    expect(aiTutor.strongestTopic).toBe("articles");
    expect(kidsTutor.totalCorrections).toBe(1);
    expect(kidsTutor.strongestTopic).toBe("third-person-s");
  });

  it("A7-T3: clear French targets only the French product-language key", () => {
    expect(getTutorMemoryKey("ai-tutor", "fr")).not.toBe(getTutorMemoryKey("ai-tutor", "en"));
  });

  it("A7-T4: no email or user ID leaks through safe summary tags", () => {
    const summary = summarizeCorrections([
      makeRecord({
        topic: "learner@example.com 550e8400-e29b-41d4-a716-446655440000 articles",
      }),
    ]);

    const serialized = JSON.stringify(summary);
    expect(serialized).not.toContain("learner@example.com");
    expect(serialized).not.toContain("550e8400-e29b-41d4-a716-446655440000");
    expect(serialized).not.toContain("My email is");
  });

  it("A7-T5: sentence-like raw learner text and JWTs collapse to a safe aggregate tag", () => {
    const summary = summarizeCorrections([
      makeRecord({
        topic: "I bought a private ticket yesterday.",
      }),
      makeRecord({
        id: "jwt",
        topic: "past tense eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VyIn0.signature",
      }),
    ]);

    const serialized = JSON.stringify(summary);
    expect(summary.commonMistakePatterns).toEqual(["general"]);
    expect(serialized).not.toContain("I bought a private ticket yesterday");
    expect(serialized).not.toContain("eyJhbGci");
    expect(serialized).not.toContain("signature");
  });
});
