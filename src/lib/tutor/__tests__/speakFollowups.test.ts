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

    it("after the first scripted question, follows the learner's OWN words across 3+ rounds (Chau's hat scenario)", () => {
      // F1 — posed off the seed: the scripted lead-in question.
      const f1 = selectSpeakFollowUpByTopicId("hat-biking-summer", {
        askedQuestions: [],
        turnsOnTopic: 0,
        learnerText: "I bought a hat yesterday because summer is coming and it is going to be very sunny.",
      });
      expect(f1.isPivot).toBe(false);
      expect(f1.question).toBe("Why do you need the hat?");

      // F2 — the learner is now answering: follow THEIR word, not canned trivia.
      const f2 = selectSpeakFollowUpByTopicId("hat-biking-summer", {
        askedQuestions: [f1.question],
        turnsOnTopic: 1,
        learnerText: "I will wear it at the beach.",
      });
      expect(f2.isPivot).toBe(false);
      expect(f2.question.toLowerCase()).toContain("beach");

      // F3 — still following the learner.
      const f3 = selectSpeakFollowUpByTopicId("hat-biking-summer", {
        askedQuestions: [f1.question, f2.question],
        turnsOnTopic: 2,
        learnerText: "I will go with my friends.",
      });
      expect(f3.isPivot).toBe(false);
      expect(f3.question.toLowerCase()).toContain("friends");

      // No premature move-on, and all three are distinct.
      const questions = [f1.question, f2.question, f3.question];
      expect(questions).not.toContain(SPEAK_FOLLOW_UP_PIVOT);
      expect(new Set(questions).size).toBe(3);
    });

    it("keeps the strong scripted question when the learner's answer has no concrete noun", () => {
      const reply = selectSpeakFollowUpByTopicId("dinner-family", {
        askedQuestions: ["What did you eat?"],
        turnsOnTopic: 1,
        learnerText: "It was very good.",
      });
      expect(reply.isPivot).toBe(false);
      expect(reply.question).toBe("Who cooked dinner?");
    });
  });
});
