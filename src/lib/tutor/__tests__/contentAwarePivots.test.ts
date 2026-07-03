import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { classifyContentAwarePivot } from "@/lib/tutor/contentAwarePivots";

describe("contentAwarePivots", () => {
  it("deepens dinner for a clear dinner answer", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I eat dinner at home with rice and vegetables.",
      currentTopicId: "dinner",
      topicLabel: "Dinner",
      turnCountOnTopic: 2,
      followUpIds: ["dinner-food"],
    });

    expect(decision.contentType).toBe("clear_answer");
    expect(decision.pivotAction).toBe("deepen_same_topic");
    expect(decision.topicId).toBe("dinner");
    expect(decision.suggestedFollowUpIntent).toBe("deepen-dinner");
  });

  it("switches from work to family when the learner introduces family", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "My family visits me on Sunday.",
      currentTopicId: "work",
      topicLabel: "Work",
      turnCountOnTopic: 1,
    });

    expect(decision.contentType).toBe("new_topic");
    expect(decision.pivotAction).toBe("switch_topic");
    expect(decision.topicId).toBe("family");
    expect(decision.topicLabel).toBe("Family");
  });

  it("asks clarification for a short answer", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "Yes.",
      currentTopicId: "dinner",
      topicLabel: "Dinner",
    });

    expect(decision.contentType).toBe("too_short");
    expect(decision.pivotAction).toBe("clarify");
    expect(decision.topicId).toBe("dinner");
    expect(decision.reason).toBe("answer_too_short");
  });

  it("offers help for I don't know", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I don't know how to say it.",
      currentTopicId: "family",
      topicLabel: "Family",
    });

    expect(decision.contentType).toBe("help_request");
    expect(decision.pivotAction).toBe("encourage_expand");
    expect(decision.safeTeacherMove).toMatch(/model sentence/i);
  });

  it("offers help for uncertainty phrased as not sure", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I'm not sure what should I say.",
      currentTopicId: "family",
      topicLabel: "Family",
    });

    expect(decision.contentType).toBe("help_request");
    expect(decision.pivotAction).toBe("encourage_expand");
    expect(decision.safeTeacherMove).toMatch(/model sentence/i);
  });

  it("invites expansion for emotion or opinion", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I feel tired after work.",
      currentTopicId: "work",
      topicLabel: "Work",
    });

    expect(decision.contentType).toBe("emotion_or_opinion");
    expect(decision.pivotAction).toBe("encourage_expand");
    expect(decision.safeTeacherMove).toMatch(/invite one more detail/i);
  });

  it("does not falsely correct a normal answer", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I bought a hat yesterday.",
      currentTopicId: "general",
      topicLabel: "General practice",
    });

    expect(decision.contentType).not.toBe("correction_opportunity");
    expect(decision.pivotAction).not.toBe("gentle_correction");
  });

  it("surfaces an optional deterministic correction signal", () => {
    const decision = classifyContentAwarePivot({
      learnerText: "I buy a hat yesterday.",
      currentTopicId: "general",
      correctionSignal: {
        hasCorrection: true,
        issueId: "past-tense-yesterday",
        suggestedTeacherMove: "Show: I bought a hat yesterday.",
      },
    });

    expect(decision.contentType).toBe("correction_opportunity");
    expect(decision.pivotAction).toBe("gentle_correction");
    expect(decision.suggestedFollowUpIntent).toBe("past-tense-yesterday");
    expect(decision.safeTeacherMove).toBe("Show: I bought a hat yesterday.");
  });

  it("has no LLM or provider dependency", () => {
    const source = readFileSync("src/lib/tutor/contentAwarePivots.ts", "utf8");

    expect(source).not.toMatch(/openai|anthropic|llm|provider|fetch\(/i);
  });

  it("does not import Azure or pronunciation code", () => {
    const source = readFileSync("src/lib/tutor/contentAwarePivots.ts", "utf8");

    expect(source).not.toMatch(/azure|pronunciation/i);
  });
});
