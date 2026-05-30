import { describe, expect, it } from "vitest";
import {
  SPEAK_FOLLOW_UP_PIVOT,
  calculateSentenceMatchPercent,
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUp,
  selectSpeakFollowUpByTopicId,
} from "@/lib/tutor/speakFollowups";

describe("speakFollowups", () => {
  it("selects a deterministic follow-up for bought-hat sentences", () => {
    expect(selectSpeakFollowUp("I bought a hat yesterday.")).toEqual({
      topicId: "bought-hat-yesterday",
      question: "Where did you buy it?",
      isPivot: false,
    });
  });

  it("selects English follow-ups for hat biking practice", () => {
    expect(selectSpeakFollowUp("I bought a hat yesterday because I plan to bike a lot this summer.")).toEqual({
      topicId: "hat-biking-summer",
      question: "Why do you need the hat?",
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

  it("lets the latest learner topic override the corrected seed and then persist", () => {
    expect(resolveSpeakFollowUpTopicId({
      seedSentence: "I bought a hat yesterday.",
      learnerText: "I had dinner with my family.",
      currentTopicId: "bought-hat-yesterday",
    })).toBe("dinner-family");

    expect(resolveSpeakFollowUpTopicId({
      seedSentence: "I bought a hat yesterday.",
      learnerText: "It was very good.",
      currentTopicId: "dinner-family",
    })).toBe("dinner-family");

    expect(selectSpeakFollowUpByTopicId("dinner-family", {
      askedQuestions: ["What did you eat?"],
      turnsOnTopic: 1,
    })).toEqual({
      topicId: "dinner-family",
      question: "Who cooked dinner?",
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
      question: "Do you want to practice another sentence?",
      isPivot: true,
    });
    expect(SPEAK_FOLLOW_UP_PIVOT).not.toMatch(/[ăâđêôơưàáạảãằắặẳẵầấậẩẫèéẹẻẽềếệểễìíịỉĩòóọỏõồốộổỗờớợởỡùúụủũừứựửữỳýỵỷỹ]/i);
  });

  it("calculates exact sentence-match as 100", () => {
    expect(calculateSentenceMatchPercent("I bought a hat yesterday.", "I bought a hat yesterday.")).toBe(100);
  });

  it("calculates partial sentence-match without calling it pronunciation", () => {
    expect(calculateSentenceMatchPercent("I bought a hat", "I bought a hat yesterday.")).toBe(89);
  });
});
