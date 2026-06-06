import { describe, expect, it } from "vitest";
import {
  SPEAK_FOLLOW_UP_DEPTH_CAP,
  SPEAK_FOLLOW_UP_PIVOT,
  assessSpeakSentenceCoherence,
  calculateSentenceMatchPercent,
  extractSalientKeyword,
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUp,
  selectSpeakFollowUpByTopicId,
} from "@/lib/tutor/speakFollowups";
import {
  SPEAK_TOPIC_CORRECTION_CANDIDATES,
  SPEAK_TOPIC_LIBRARY,
  buildSpeakTopicCorrectionWeave,
} from "@/lib/tutor/speakTopicLibrary";

const BATCH_1_SEEDS: Array<{ id: string; seed: string }> = [
  { id: "topic-ordering-food", seed: "I want order noodles at the restaurant." },
  { id: "topic-family-relatives", seed: "I visited my aunt and my cousins last weekend." },
  { id: "topic-work", seed: "I had a meeting with my manager this morning." },
  { id: "topic-directions-travel", seed: "I need directions to the bus station." },
  { id: "topic-shopping", seed: "I want to buy a shirt at the store." },
  { id: "topic-doctor-health-visit", seed: "I need call my doctor about my appointment." },
  { id: "topic-phone-calls", seed: "I need call my friend after lunch." },
  { id: "topic-introductions", seed: "Hello, my name is Linh and I am from Vietnam." },
  { id: "topic-daily-routine", seed: "Every morning I brush my teeth before breakfast." },
  { id: "topic-time-appointments-waiting", seed: "I am waiting at three and my turn is late." },
];

const BATCH_1_LEARNER_TURNS: Record<string, string[]> = {
  "topic-ordering-food": [
    "I want order noodles.",
    "I like the soup.",
    "I want chili with it.",
    "I will say thank you to the waiter.",
  ],
  "topic-family-relatives": [
    "I visited my aunt.",
    "My cousins live near me.",
    "We ate dinner together.",
    "My grandmother was happy.",
  ],
  "topic-work": [
    "I had a meeting about the project.",
    "My manager gave me a task.",
    "The deadline is close.",
    "I sent the report.",
  ],
  "topic-directions-travel": [
    "I need directions to the station.",
    "The bus is late.",
    "I will ask the driver.",
    "The hotel is near the airport.",
  ],
  "topic-shopping": [
    "I want to buy a jacket.",
    "The size is medium.",
    "The price is high.",
    "The cashier is friendly.",
  ],
  "topic-doctor-health-visit": [
    "I need call my doctor.",
    "My fever started yesterday.",
    "I bought medicine.",
    "The clinic opens at nine.",
  ],
  "topic-phone-calls": [
    "I need call my friend.",
    "The phone line is busy.",
    "I will leave a message.",
    "My friend can call me later.",
  ],
  "topic-introductions": [
    "My name is Linh.",
    "I am from Vietnam.",
    "I work in accounting.",
    "I want to ask about your job.",
  ],
  "topic-daily-routine": [
    "Every morning I prepare breakfast.",
    "I brush my teeth.",
    "I eat breakfast at seven.",
    "I go home before dinner.",
  ],
  "topic-time-appointments-waiting": [
    "I have an appointment at three.",
    "I wait you.",
    "The doctor is late.",
    "I will confirm the schedule.",
  ],
};

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

  describe("Speak topic library batch 1", () => {
    it("ships exactly the approved 10 everyday topics", () => {
      expect(SPEAK_TOPIC_LIBRARY.map((topic) => topic.labelEn)).toEqual([
        "Ordering Food",
        "Family And Relatives",
        "Work",
        "Directions And Travel",
        "Shopping",
        "Doctor / Health Visit",
        "Phone Calls",
        "Introductions",
        "Daily Routine",
        "Time, Appointments, And Waiting",
      ]);
      for (const topic of SPEAK_TOPIC_LIBRARY) {
        expect(topic.followUps.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("matches deterministic seed inputs for all 10 topics", () => {
      for (const { id, seed } of BATCH_1_SEEDS) {
        expect(resolveSpeakFollowUpTopicId({ seedSentence: seed })).toBe(id);
        expect(selectSpeakFollowUp(seed).topicId).toBe(id);
      }
    });

    it("validates 4+ topic-aware non-pivot rounds for every topic", () => {
      for (const { id } of BATCH_1_SEEDS) {
        const askedQuestions: string[] = [];
        const usedFollowUpIds: string[] = [];
        const turns = BATCH_1_LEARNER_TURNS[id];

        turns.forEach((learnerText, turnsOnTopic) => {
          const selection = selectSpeakFollowUpByTopicId(id, {
            askedQuestions,
            turnsOnTopic,
            learnerText,
          });

          expect(selection.topicId).toBe(id);
          expect(selection.isPivot).toBe(false);
          expect(selection.question).not.toBe(SPEAK_FOLLOW_UP_PIVOT);
          expect(selection.followUpId).toBeTruthy();
          expect(usedFollowUpIds).not.toContain(selection.followUpId);
          usedFollowUpIds.push(selection.followUpId!);
          askedQuestions.push(selection.question);
        });

        expect(new Set(usedFollowUpIds).size).toBeGreaterThanOrEqual(4);
        const capped = selectSpeakFollowUpByTopicId(id, {
          askedQuestions,
          turnsOnTopic: SPEAK_FOLLOW_UP_DEPTH_CAP,
          learnerText: "One more detail.",
        });
        expect(capped).toEqual({
          topicId: id,
          question: SPEAK_FOLLOW_UP_PIVOT,
          isPivot: true,
        });
      }
    });

    it("lets arbitrary learner salience fill topic follow-up slots without leaving the topic", () => {
      const askedQuestions: string[] = [];
      const first = selectSpeakFollowUpByTopicId("topic-shopping", {
        askedQuestions,
        turnsOnTopic: 0,
        learnerText: "I want to buy a jacket.",
      });
      askedQuestions.push(first.question);

      const second = selectSpeakFollowUpByTopicId("topic-shopping", {
        askedQuestions,
        turnsOnTopic: 1,
        learnerText: "I need shoes today.",
      });

      expect(second.topicId).toBe("topic-shopping");
      expect(second.isPivot).toBe(false);
      expect(second.question.toLowerCase()).toContain("shoes");
      expect(second.question.toLowerCase()).toMatch(/size|color|shopping|works/);
    });

    it("does not pivot before 4 completed topic turns even when learner text changes", () => {
      const askedQuestions: string[] = [];
      for (let turnsOnTopic = 0; turnsOnTopic < SPEAK_FOLLOW_UP_DEPTH_CAP; turnsOnTopic++) {
        const selection = selectSpeakFollowUpByTopicId("topic-directions-travel", {
          askedQuestions,
          turnsOnTopic,
          learnerText: BATCH_1_LEARNER_TURNS["topic-directions-travel"][turnsOnTopic],
        });
        expect(selection.isPivot).toBe(false);
        askedQuestions.push(selection.question);
      }
    });

    it("does not regress existing scripted topics", () => {
      expect(selectSpeakFollowUp("I bought a hat yesterday.")).toEqual({
        topicId: "bought-hat-yesterday",
        question: "Where did you buy it?",
        isPivot: false,
      });
      expect(selectSpeakFollowUp("I had dinner with my family.")).toEqual({
        topicId: "dinner-family",
        question: "What did you eat?",
        isPivot: false,
      });
      expect(selectSpeakFollowUpByTopicId("dinner-family", {
        askedQuestions: ["What did you eat?"],
        turnsOnTopic: 1,
        learnerText: "It was very good.",
      })).toEqual({
        topicId: "dinner-family",
        question: "Who cooked dinner?",
        isPivot: false,
      });
      expect(resolveSpeakFollowUpTopicId({
        seedSentence: "I bought a hat yesterday.",
        learnerText: "My wife burned the fish.",
        currentTopicId: "bought-hat-yesterday",
      })).toBe("bought-hat-yesterday");
    });

    it("documents correction candidates with the required precision gate fields", () => {
      for (const candidate of SPEAK_TOPIC_CORRECTION_CANDIDATES) {
        expect(candidate.positives).toHaveLength(3);
        expect(candidate.confusableNegatives).toHaveLength(2);
        expect(candidate.fpRiskNote.length).toBeGreaterThan(20);
        expect(["ship-safe", "hold", "abstain"]).toContain(candidate.status);
      }
    });

    it("weaves only approved ship-safe correction signals into model-line prompts", () => {
      const positives = [
        "I go to work yesterday.",
        "I want order coffee.",
        "I need call my doctor.",
      ];
      for (const text of positives) {
        const weave = buildSpeakTopicCorrectionWeave(text);
        expect(weave?.status).toBe("ship-safe");
        expect(weave?.promptPrefix).toMatch(/^Small model:/);
      }

      const negatives = [
        "I go to work every day.",
        "I will go to the doctor tomorrow.",
        "I want to order coffee.",
        "I ordered coffee yesterday.",
        "I need to call my doctor.",
        "I called my doctor yesterday.",
      ];
      for (const text of negatives) {
        expect(buildSpeakTopicCorrectionWeave(text)).toBeNull();
      }
    });

    it("abstains or holds weak correction candidates and redirects into engaging practice", () => {
      const hold = buildSpeakTopicCorrectionWeave("I wait you.");
      expect(hold).toEqual({
        signalId: "speak-topic-wait-for-person",
        status: "hold",
        promptPrefix: "No need to fix that yet. Let's make the situation clear.",
      });

      const abstainSelection = selectSpeakFollowUpByTopicId("topic-doctor-health-visit", {
        askedQuestions: [],
        turnsOnTopic: 0,
        learnerText: "I sick today.",
      });
      expect(abstainSelection.correctionStatus).toBe("abstain");
      expect(abstainSelection.question).toMatch(/won't guess the correction/i);
      expect(abstainSelection.question).toMatch(/Why do you need to see the doctor\?/);
      expect(abstainSelection.isPivot).toBe(false);
    });
  });

  // ── Issue 1: coherence gate — don't drill a garbled grammar-only fix ───────

  describe("assessSpeakSentenceCoherence", () => {
    it("flags a grammar-only fix that is still word-salad (Chau's S1 case)", () => {
      // Only `buy→bought` was fixed; the sentence is still nonsensical: a bare
      // noun ("bike") dangles right after the time adverb with no connector.
      const result = assessSpeakSentenceCoherence("I bought a pet yesterday bike around a lot.");
      expect(result.coherent).toBe(false);
      expect(result.reason).toContain("yesterday->bike");
    });

    it("passes well-formed sentences, including legitimate time-adverb usage", () => {
      const coherent = [
        "I bought a hat yesterday.",
        "I bought a hat yesterday because summer is coming and it is going to be very sunny.",
        "I saw him yesterday morning.",
        "We will meet tomorrow afternoon.",
        "I went to the market yesterday and bought food.",
        "I need a hat because in the summer the sun is very strong with sunlight so it may burn my skin.",
        "I will wear it at the beach.",
        "The weather is nice today.",
      ];
      for (const sentence of coherent) {
        expect(assessSpeakSentenceCoherence(sentence)).toEqual({
          coherent: true,
          reason: "no_incoherence_signal",
        });
      }
    });
  });
});
