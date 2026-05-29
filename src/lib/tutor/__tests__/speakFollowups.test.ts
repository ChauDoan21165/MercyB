import { describe, expect, it } from "vitest";
import {
  SPEAK_FOLLOW_UP_PIVOT,
  calculateSentenceMatchPercent,
  selectSpeakFollowUp,
} from "@/lib/tutor/speakFollowups";

describe("speakFollowups", () => {
  it("selects a deterministic follow-up for bought-hat sentences", () => {
    expect(selectSpeakFollowUp("I bought a hat yesterday.")).toEqual({
      topicId: "bought-hat-yesterday",
      question: "Where did you buy it?",
      isPivot: false,
    });
  });

  it("selects a dinner follow-up grounded in the target sentence", () => {
    expect(selectSpeakFollowUp("I had dinner with my family.")).toEqual({
      topicId: "dinner-family",
      question: "What did you eat?",
      isPivot: false,
    });
  });

  it("falls back gently for unmatched sentences", () => {
    expect(selectSpeakFollowUp("The weather is nice today.")).toEqual({
      topicId: "generic",
      question: "Can you tell me one more detail about that?",
      isPivot: false,
    });
  });

  it("pivots after the same-topic depth cap", () => {
    expect(selectSpeakFollowUp("I bought a hat yesterday.", { turnsOnTopic: 4 })).toEqual({
      topicId: "bought-hat-yesterday",
      question: SPEAK_FOLLOW_UP_PIVOT,
      isPivot: true,
    });
  });

  it("calculates exact sentence-match as 100", () => {
    expect(calculateSentenceMatchPercent("I bought a hat yesterday.", "I bought a hat yesterday.")).toBe(100);
  });

  it("calculates partial sentence-match without calling it pronunciation", () => {
    expect(calculateSentenceMatchPercent("I bought a hat", "I bought a hat yesterday.")).toBe(89);
  });
});
