import { describe, expect, it } from "vitest";
import { gradeConversation } from "../conversationGrader";
import { cefrToNumeric } from "../signalExtractor";
import { transcriptFixtures } from "./fixtures/sampleTranscripts";

describe("conversationGrader", () => {
  it.each(transcriptFixtures)("grades fixture $id within one CEFR band", (fixture) => {
    const assessment = gradeConversation(fixture.transcript);
    expect(Math.abs(cefrToNumeric(assessment.cefr) - cefrToNumeric(fixture.expected))).toBeLessThanOrEqual(1);
  });

  it("A1 transcript produces A1/A2 profile", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "a1-survival")!.transcript);
    expect(["A1", "A2"]).toContain(assessment.cefr);
  });

  it("B1 transcript produces B1-ish profile", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "b1-everyday-narrative")!.transcript);
    expect(["A2", "B1", "B2"]).toContain(assessment.cefr);
  });

  it("C2 transcript produces advanced profile", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "c2-nuanced")!.transcript);
    expect(cefrToNumeric(assessment.cefr)).toBeGreaterThanOrEqual(5);
  });

  it("mixed improving transcript includes trajectory note", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "b1-improving-warmup")!.transcript);
    expect(["improving", "mixed", "steady"]).toContain(assessment.trajectory.pattern);
    expect(assessment.trajectory.note.length).toBeGreaterThan(10);
  });

  it("rich vocab plus weak grammar captures per-skill divergence", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "b2-rich-vocab-weak-grammar")!.transcript);
    expect(assessment.perSkill.vocab.score).toBeGreaterThan(assessment.perSkill.grammar.score);
  });

  it("code-switching transcript is graded on English portions and flags interaction", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "a2-code-switch")!.transcript);
    expect(assessment.interaction.codeSwitchTurns).toBeGreaterThan(0);
    expect(assessment.cefr).not.toBe("C1");
  });

  it("tired-user transcript tracks late decline", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "c1-tired-decline")!.transcript);
    expect(["declining", "mixed"]).toContain(assessment.trajectory.pattern);
  });

  it("conversational but shallow transcript has confidence caveat", () => {
    const assessment = gradeConversation(transcriptFixtures.find((f) => f.id === "wrong-language-repair")!.transcript);
    expect(assessment.confidence).toBeLessThan(0.9);
    expect(assessment.interaction.comprehension).not.toBe("strong");
  });

  it("holistic differs from naive average in trajectory-sensitive fixtures", () => {
    const results = ["b1-improving-warmup", "c1-tired-decline"].map((id) =>
      gradeConversation(transcriptFixtures.find((f) => f.id === id)!.transcript)
    );
    expect(results.filter((r) => r.holisticNotAverage).length).toBeGreaterThanOrEqual(1);
  });
});
