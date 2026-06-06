import { describe, expect, it } from "vitest";
import {
  SPEAK_FOLLOW_UP_DEPTH_CAP,
  SPEAK_FOLLOW_UP_PIVOT,
  calculateSentenceMatchPercent,
  extractSalientKeyword,
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

  it("follows the learner's own words for unmatched sentences (no generic dead-end)", () => {
    // NEW behavior: an unmatched ("generic") sentence no longer dead-ends on a
    // canned "...about that?" — it references the learner's salient word.
    expect(selectSpeakFollowUp("The weather is nice today.")).toEqual({
      topicId: "generic",
      question: "Tell me more about the weather.",
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

  // ── Path B: topic-following via the learner's own words ───────────────────

  describe("salience-following follow-ups", () => {
    it("extracts the salient content noun, preferring the object after a det/prep", () => {
      expect(extractSalientKeyword("I bought a hat because it is sunny.")).toBe("hat");
      expect(extractSalientKeyword("I bought it at a shop that sells old stuff.")).toBe("shop");
      expect(extractSalientKeyword("The weather is nice today.")).toBe("weather");
      // No concrete content word → null (degrades to "that", never worse).
      expect(extractSalientKeyword("I am very tired.")).toBeNull();
    });

    it("follows an arbitrary (non-bucket) topic for 4+ rounds, referencing the learner's words, no repeats, no premature pivot", () => {
      const learnerTurns = [
        "The weather is nice today.",
        "My garden has many flowers.",
        "I painted the fence blue.",
        "The fence looks better now.",
      ];
      const asked: string[] = [];
      learnerTurns.forEach((text, index) => {
        const selection = selectSpeakFollowUpByTopicId("generic", {
          askedQuestions: asked,
          turnsOnTopic: index, // sameTopic "generic" → increments each round
          learnerText: text,
        });
        // Never the premature dead-end pivot within the first 4 rounds.
        expect(selection.isPivot).toBe(false);
        expect(selection.question).not.toBe(SPEAK_FOLLOW_UP_PIVOT);
        // Follows the learner's salient word.
        const keyword = extractSalientKeyword(text)!;
        expect(selection.question.toLowerCase()).toContain(keyword);
        // No repeated question across the conversation.
        expect(asked).not.toContain(selection.question);
        asked.push(selection.question);
      });
      expect(new Set(asked).size).toBe(asked.length); // all four distinct

      // Only AFTER the depth cap does it offer to move on.
      const capped = selectSpeakFollowUpByTopicId("generic", {
        askedQuestions: asked,
        turnsOnTopic: SPEAK_FOLLOW_UP_DEPTH_CAP,
        learnerText: "We will plant more next year.",
      });
      expect(capped.isPivot).toBe(true);
      expect(capped.question).toBe(SPEAK_FOLLOW_UP_PIVOT);
    });

    it("does not regress scripted topics — the canned pattern question still leads", () => {
      expect(selectSpeakFollowUp("I bought a hat yesterday.")).toEqual({
        topicId: "bought-hat-yesterday",
        question: "Where did you buy it?",
        isPivot: false,
      });
      expect(selectSpeakFollowUp("I had dinner with my family.").question).toBe("What did you eat?");
    });
  });
});
