import { describe, expect, it } from "vitest";
import {
  SPEAK_FOLLOW_UP_DEPTH_CAP,
  SPEAK_FOLLOW_UP_PIVOT,
  SPEAK_TRANSCRIPT_ASK_TO_REPEAT,
  assessSpeakSentenceCoherence,
  assessSpeakTranscriptClarity,
  calculateSentenceMatchPercent,
  extractSalientKeyword,
  getSpeakFollowUpTopicId,
  isSpeakTranscriptUnclearForFollowUp,
  resolveSpeakFollowUpTopicId,
  selectSpeakFollowUp,
  selectSpeakFollowUpByTopicId,
} from "@/lib/tutor/speakFollowups";
import {
  SPEAK_TOPIC_CORRECTION_CANDIDATES,
  SPEAK_TOPIC_LIBRARY,
  buildSpeakTopicCorrectionWeave,
  collectSpeakTopicsFromModules,
} from "@/lib/tutor/speakTopicLibrary";
import { speakTopics as bankingSpeakTopics } from "@/lib/tutor/speakTopics/banking";
import { speakTopics as housingDailySpeakTopics } from "@/lib/tutor/speakTopics/housingDaily";
import { speakTopics as introductionSpeakTopics } from "@/lib/tutor/speakTopics/introductions";
import { speakTopics as phoneCustomerServiceSpeakTopics } from "@/lib/tutor/speakTopics/phoneCustomerService";

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

const BATCH_2_SEEDS: Array<{ id: string; seed: string }> = [
  { id: "topic-home-rent-repairs", seed: "My sink is leaking and I need a repair." },
  { id: "topic-banking-bills", seed: "I need to pay my electricity bill today." },
  { id: "topic-mail-package-delivery", seed: "The package delivery has a tracking number." },
  { id: "topic-school-class", seed: "I have English class tonight and homework is due." },
  { id: "topic-social-plans-invitations", seed: "I want to invite my friend to meet tomorrow." },
  { id: "topic-weather-clothes", seed: "It is raining today, so I need a jacket." },
  { id: "topic-exercise-hobbies", seed: "I go for a walk after dinner." },
  { id: "topic-customer-service-problems", seed: "I bought this yesterday, but it does not work." },
  { id: "topic-childcare-school-pickup", seed: "The daycare pickup is this afternoon." },
  { id: "topic-documents-forms", seed: "I need help this form for my application." },
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

const BATCH_2_LEARNER_TURNS: Record<string, string[]> = {
  "topic-home-rent-repairs": [
    "The sink is leaking.",
    "The landlord can visit tomorrow.",
    "The apartment is quiet.",
    "Maintenance can come after lunch.",
  ],
  "topic-banking-bills": [
    "I pay by cash.",
    "The electricity bill is due today.",
    "My account has a fee.",
    "The card is at home.",
  ],
  "topic-mail-package-delivery": [
    "I am waiting for a package.",
    "The delivery should arrive today.",
    "The address is correct.",
    "I can ask the post office.",
  ],
  "topic-school-class": [
    "I have English class tonight.",
    "The homework is difficult.",
    "My teacher can help me.",
    "The lesson starts at seven.",
  ],
  "topic-social-plans-invitations": [
    "I want to invite my friend for coffee.",
    "We can meet downtown.",
    "Tomorrow afternoon is good.",
    "I will confirm the plan.",
  ],
  "topic-weather-clothes": [
    "It is raining today.",
    "I need a jacket.",
    "The umbrella is in my bag.",
    "The weather may change my plan.",
  ],
  "topic-exercise-hobbies": [
    "I go for a walk after dinner.",
    "I like music.",
    "The gym is near my home.",
    "Gardening helps me relax.",
  ],
  "topic-customer-service-problems": [
    "This item does not work.",
    "I have the receipt.",
    "I want a refund.",
    "The cashier can help me.",
  ],
  "topic-childcare-school-pickup": [
    "I need to pick up my son.",
    "The school pickup is at three.",
    "Daycare is near my work.",
    "My sister is the backup plan.",
  ],
  "topic-documents-forms": [
    "I need help this form.",
    "The application is for school.",
    "My signature is missing.",
    "The paperwork is ready.",
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
    expect(selectSpeakFollowUp("The bookshelf is heavy today.")).toEqual({
      topicId: "generic",
      question: "Tell me more about the bookshelf.",
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
    it("does not clarity-gate coherent short or learner-style Speak transcripts", () => {
      const coherentTranscripts = [
        "I want to buy a hat",
        "I bought a hat",
        "I want buy a hat",
        "I need help with my rent",
        "I want order noodles",
        "I wait you",
        "I'm tired but okay",
        "I am from Canada",
      ];

      for (const learnerText of coherentTranscripts) {
        expect(assessSpeakTranscriptClarity(learnerText)).toEqual({
          clear: true,
          reason: "no_unclear_transcript_signal",
        });

        const selection = selectSpeakFollowUp(learnerText);
        expect(selection.isPivot).toBe(false);
        expect(selection.question).not.toBe(SPEAK_TRANSCRIPT_ASK_TO_REPEAT);
        expect(selection.question).not.toBe(SPEAK_FOLLOW_UP_PIVOT);
      }
    });

    it("asks the learner to repeat unclear Speak transcripts before generating follow-ups", () => {
      const unclearTranscripts = [
        "I bought ahead",
        "buy the i'm",
        "I bought the i'm",
        "for the canada",
        "with the i'm",
        "the some",
        "I chose some",
        "I need a head because summer is very sunny in Canada",
        "I like the summer of you guys very sunny and I can wear short",
        "the and of to",
        "I bought the",
      ];

      for (const learnerText of unclearTranscripts) {
        const selection = selectSpeakFollowUpByTopicId("topic-shopping", {
          askedQuestions: [],
          turnsOnTopic: 1,
          learnerText,
        });

        expect(selection).toEqual({
          topicId: "topic-shopping",
          question: SPEAK_TRANSCRIPT_ASK_TO_REPEAT,
          isPivot: false,
        });
        expect(selection.question).toContain("Mercy chưa nghe rõ. Bạn nói lại câu đó nhé.");
        expect(selection.question).toContain("I didn't catch that clearly. Can you say it again?");
        expect(selection.question.toLowerCase()).not.toMatch(/\bhat\b|\bcanada\b|\bi'm\b/);
      }
    });

    it("detects high-confidence bad-STT transcripts without treating normal learner English as unclear", () => {
      expect(assessSpeakTranscriptClarity("I bought ahead")).toMatchObject({
        clear: false,
        reason: "unlikely_buy_object:ahead",
      });
      expect(assessSpeakTranscriptClarity("buy the i'm")).toMatchObject({
        clear: false,
        reason: "broken_buy_object:i'm",
      });
      expect(assessSpeakTranscriptClarity("I bought the i'm").clear).toBe(false);
      expect(assessSpeakTranscriptClarity("for the canada").clear).toBe(false);
      expect(assessSpeakTranscriptClarity("the some")).toMatchObject({
        clear: false,
        reason: "function_word_salad:the_some",
      });
      expect(assessSpeakTranscriptClarity("I need a head because summer is very sunny in Canada")).toMatchObject({
        clear: false,
        reason: "hat_homophone_confusion:head",
      });
      expect(assessSpeakTranscriptClarity("I like the summer of you guys very sunny and I can wear short")).toMatchObject({
        clear: false,
        reason: "weak_pronoun_target_fragment:of_you_guys",
      });
      expect(assessSpeakTranscriptClarity("That question does not make sense.")).toMatchObject({
        clear: false,
        reason: "learner_reports_unclear_follow_up",
      });
      expect(assessSpeakTranscriptClarity("the and of to")).toMatchObject({
        clear: false,
        reason: "function_word_salad:the_and_of_to",
      });

      const ordinaryLearnerSentences = [
        "I like summer because it is sunny.",
        "I want to buy a hat.",
        "I bought a bicycle yesterday.",
        "I bought a hat.",
        "I want buy a hat.",
        "I bought a hat yesterday.",
        "I need a hat because it is sunny.",
        "I bought it at a second-hand shop.",
        "I want to go swimming in summer.",
        "I need help with my rent.",
        "I want order noodles.",
        "I wait you.",
        "I'm tired but okay.",
        "I am from Canada.",
        "I need help this form.",
      ];
      for (const text of ordinaryLearnerSentences) {
        expect(assessSpeakTranscriptClarity(text)).toEqual({
          clear: true,
          reason: "no_unclear_transcript_signal",
        });
      }
    });

    it("extracts the salient content noun, preferring the object after a det/prep", () => {
      expect(extractSalientKeyword("I bought a hat because it is sunny.")).toBe("hat");
      expect(extractSalientKeyword("I bought it at a shop that sells old stuff.")).toBe("shop");
      expect(extractSalientKeyword("The weather is nice today.")).toBe("weather");
      // No concrete content word → null (degrades to "that", never worse).
      expect(extractSalientKeyword("I am very tired.")).toBeNull();
    });

    it("does not promote unsafe STT fragments into salience questions", () => {
      expect(extractSalientKeyword("I'm going to buy a lot.")).toBeNull();
      expect(extractSalientKeyword("I am from Canada.")).toBeNull();
      expect(extractSalientKeyword("some")).toBeNull();
      expect(extractSalientKeyword("I like the summer of you guys very sunny and I can wear short")).not.toBe("guys");
      expect(extractSalientKeyword(
        "don't lie your sunlight because you know I like summer in general because I can swim I can play Spot I can wear shorts and biking around",
      )).not.toBe("general");

      const selection = selectSpeakFollowUpByTopicId("topic-shopping", {
        askedQuestions: ["What do you want to buy?"],
        turnsOnTopic: 1,
        learnerText: "I bought ahead yesterday we got this summer I'm going to buy a lot",
      });

      expect(isSpeakTranscriptUnclearForFollowUp(
        "I bought ahead yesterday we got this summer I'm going to buy a lot",
      )).toBe(true);
      expect(selection.question).not.toBe("Why do you want to buy the i'm?");
      expect(selection.question).not.toBe("What size or color works for the canada?");
      expect(selection.question).not.toBe("Why did you choose the some?");
      expect(selection.question).not.toBe("What do you like about the head?");
      expect(selection.question.toLowerCase()).not.toContain("the i'm");
      expect(selection.question.toLowerCase()).not.toContain("the canada");
      expect(selection.question.toLowerCase()).not.toContain("the guys");
      expect(selection.question.toLowerCase()).not.toContain("the general");
    });

    it("asks for repeat instead of generating invalid noun-target follow-ups", () => {
      const unsafeCases = [
        {
          learnerText: "some",
          forbidden: "Why did you choose the some?",
        },
        {
          learnerText: "I bought ahead yesterday",
          forbidden: "What do you like about the head?",
        },
        {
          learnerText: "I need a head because summer is very sunny in Canada",
          forbidden: "What do you like about the head?",
        },
        {
          learnerText: "I want to buy the i'm",
          forbidden: "Why do you want to buy the i'm?",
        },
        {
          learnerText: "I need the Canada",
          forbidden: "What size or color works for the canada?",
        },
        {
          learnerText: "I like the summer of you guys very sunny and I can wear short",
          forbidden: "Why did you choose the guys?",
        },
        {
          learnerText:
            "don't lie your sunlight because you know I like summer in general because I can swim I can play Spot I can wear shorts and biking around",
          forbidden: "Why did you choose the general?",
        },
      ];

      for (const { learnerText, forbidden } of unsafeCases) {
        const selection = selectSpeakFollowUpByTopicId("generic", {
          askedQuestions: [],
          turnsOnTopic: 1,
          learnerText,
        });
        expect(selection.question).toBe(SPEAK_TRANSCRIPT_ASK_TO_REPEAT);
        expect(selection.question).not.toBe(forbidden);
      }
    });

    it("still creates normal follow-ups for clear Speak sentences", () => {
      const clearCases = [
        "I bought a hat yesterday.",
        "I bought a bicycle yesterday.",
        "I need a hat because it is sunny.",
        "I need a hat because the summer is sunny.",
        "I bought it at a second-hand shop.",
        "I like summer because it is sunny.",
        "I like summer because I can swim and wear shorts.",
        "I want to go swimming in summer.",
        "I like the sunlight in the morning.",
      ];

      for (const learnerText of clearCases) {
        const selection = selectSpeakFollowUpByTopicId(getSpeakFollowUpTopicId(learnerText), {
          askedQuestions: [],
          turnsOnTopic: 0,
          learnerText,
        });
        expect(selection.question).not.toBe(SPEAK_TRANSCRIPT_ASK_TO_REPEAT);
        expect(selection.isPivot).toBe(false);
      }
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
    it("keeps Batch 1 topics first and appends approved Batch 2 everyday topics", () => {
      expect(SPEAK_TOPIC_LIBRARY.slice(0, 20).map((topic) => topic.labelEn)).toEqual([
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
        "Home, Rent, And Repairs",
        "Banking And Bills",
        "Mail And Package Delivery",
        "School Or Class",
        "Social Plans And Invitations",
        "Weather And Clothes",
        "Exercise And Hobbies",
        "Customer Service Problems",
        "Childcare And School Pickup",
        "Documents And Forms",
      ]);
      for (const topic of SPEAK_TOPIC_LIBRARY) {
        expect(topic.followUps.length).toBeGreaterThanOrEqual(4);
      }
    });

    it("ships the introductions scaffold as real content with L1 notes and no correction weaving", () => {
      const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));
      expect(introductionSpeakTopics).toHaveLength(3);

      for (const topic of introductionSpeakTopics) {
        expect(libraryIds.has(topic.id)).toBe(true);
        expect(topic.followUps.length).toBeGreaterThanOrEqual(4);
        expect(topic.l1InterferenceNotes?.length).toBeGreaterThanOrEqual(1);

        const selection = selectSpeakFollowUpByTopicId(topic.id, {
          turnsOnTopic: 0,
          learnerText: topic.seedInputs[0],
        });
        expect(selection.topicId).toBe(topic.id);
        expect(selection.isPivot).toBe(false);
        expect(selection.correctionSignalId).toBeUndefined();
        expect(selection.correctionStatus).toBeUndefined();
      }
    });

    it("auto-registers Speak topic files without per-theme library imports", () => {
      const topicModules = import.meta.glob<{ speakTopics?: readonly typeof SPEAK_TOPIC_LIBRARY[number][] | null }>(
        "@/lib/tutor/speakTopics/*.ts",
        { eager: true },
      );
      const moduleTopics = Object.values(topicModules).flatMap((module) => [...(module.speakTopics ?? [])]);
      const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

      expect(Object.keys(topicModules)).toContain("/src/lib/tutor/speakTopics/introductions.ts");
      for (const topic of moduleTopics) {
        expect(libraryIds.has(topic.id), topic.id).toBe(true);
      }
    });

    it("ships the D3 phone and customer-service theme with scenario metadata", () => {
      const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

      expect(phoneCustomerServiceSpeakTopics).toHaveLength(3);
      for (const topic of phoneCustomerServiceSpeakTopics) {
        expect(libraryIds.has(topic.id), topic.id).toBe(true);
        expect(topic.scenarioDescription?.trim().length).toBeGreaterThan(40);
        expect(topic.aiRoleDefinition?.trim().length).toBeGreaterThan(40);
        expect(topic.conversationDirections?.length).toBeGreaterThanOrEqual(5);
        expect(topic.conversationDirections?.length).toBeLessThanOrEqual(8);
        expect(topic.warmthPatterns?.length).toBeGreaterThanOrEqual(3);
        expect(topic.l1InterferenceNotes?.length).toBeGreaterThanOrEqual(2);
        expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("ships the D3 housing theme with scenario metadata", () => {
      const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

      expect(housingDailySpeakTopics).toHaveLength(3);
      for (const topic of housingDailySpeakTopics) {
        expect(libraryIds.has(topic.id), topic.id).toBe(true);
        expect(topic.scenarioDescription?.trim().length).toBeGreaterThan(40);
        expect(topic.aiRoleDefinition?.trim().length).toBeGreaterThan(40);
        expect(topic.conversationDirections?.length).toBeGreaterThanOrEqual(5);
        expect(topic.conversationDirections?.length).toBeLessThanOrEqual(8);
        expect(topic.warmthPatterns?.length).toBeGreaterThanOrEqual(3);
        expect(topic.l1InterferenceNotes?.length).toBeGreaterThanOrEqual(2);
        expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("ships the D3 banking theme with scenario metadata", () => {
      const libraryIds = new Set(SPEAK_TOPIC_LIBRARY.map((topic) => topic.id));

      expect(bankingSpeakTopics).toHaveLength(3);
      for (const topic of bankingSpeakTopics) {
        expect(libraryIds.has(topic.id), topic.id).toBe(true);
        expect(topic.scenarioDescription?.trim().length).toBeGreaterThan(40);
        expect(topic.aiRoleDefinition?.trim().length).toBeGreaterThan(40);
        expect(topic.conversationDirections?.length).toBeGreaterThanOrEqual(5);
        expect(topic.conversationDirections?.length).toBeLessThanOrEqual(8);
        expect(topic.warmthPatterns?.length).toBeGreaterThanOrEqual(3);
        expect(topic.l1InterferenceNotes?.length).toBeGreaterThanOrEqual(2);
        expect(topic.followUps.length).toBeGreaterThanOrEqual(5);
      }
    });

    it("skips malformed Speak topic modules instead of crashing AiTutor", () => {
      const validTopic = SPEAK_TOPIC_LIBRARY[0];

      expect(
        collectSpeakTopicsFromModules([
          ["./speakTopics/missing.ts", {}],
          ["./speakTopics/null.ts", { speakTopics: null }],
          ["./speakTopics/object.ts", { speakTopics: { id: "not-an-array" } }],
          ["./speakTopics/valid.ts", { speakTopics: [validTopic] }],
        ]),
      ).toEqual([validTopic]);
    });

    it("matches deterministic seed inputs for all 10 Batch 2 topics", () => {
      for (const { id, seed } of BATCH_2_SEEDS) {
        expect(resolveSpeakFollowUpTopicId({ seedSentence: seed })).toBe(id);
        expect(selectSpeakFollowUp(seed).topicId).toBe(id);
      }
    });

    it("validates 4+ topic-aware non-pivot rounds for every Batch 2 topic", () => {
      for (const { id } of BATCH_2_SEEDS) {
        const askedQuestions: string[] = [];
        const usedFollowUpIds: string[] = [];
        const turns = BATCH_2_LEARNER_TURNS[id];

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
        "I pay by cash.",
        "I want to pay by cash.",
        "Can I pay by cash?",
        "I need to fill form.",
        "I want to fill form.",
        "Can you help me fill form?",
        "I need help this form.",
        "I need help my homework.",
        "I need help the package.",
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
        "I pay by card.",
        "I pay with cash.",
        "I need to fill out the form.",
        "I filled the form yesterday.",
        "I need help with this form.",
        "I need help to carry this box.",
      ];
      for (const text of negatives) {
        expect(buildSpeakTopicCorrectionWeave(text)).toBeNull();
      }
    });

    it("keeps held and abstained Batch 2 correction proposals out of the live weave", () => {
      const heldOrAbstained = [
        "I invite my friend go coffee.",
        "I want to invite my coworker eat lunch.",
        "I live in here.",
        "I am waiting my friend.",
        "I'm waiting my mom.",
        "I sick today.",
        "I feel sick today.",
      ];
      for (const text of heldOrAbstained) {
        expect(buildSpeakTopicCorrectionWeave(text)).toBeNull();
      }
    });

    it("uses reviewed Batch 2 correction model lines exactly", () => {
      expect(buildSpeakTopicCorrectionWeave("I pay by cash.")).toEqual({
        signalId: "speak-topic-pay-in-cash",
        status: "ship-safe",
        promptPrefix: "Small model: I pay in cash. Let's make the payment sentence natural.",
      });
      expect(buildSpeakTopicCorrectionWeave("Can you help me fill form?")).toEqual({
        signalId: "speak-topic-fill-out-form",
        status: "ship-safe",
        promptPrefix: "Small model: Can you help me fill out the form? Let's keep the form request clear.",
      });
      expect(buildSpeakTopicCorrectionWeave("I need help the package.")).toEqual({
        signalId: "speak-topic-need-help-with",
        status: "ship-safe",
        promptPrefix: "Small model: I need help with the package. Let's make the help request easy to use.",
      });
    });

    it("does not weave pulled weak correction signals", () => {
      expect(buildSpeakTopicCorrectionWeave("I wait you.")).toBeNull();
      expect(buildSpeakTopicCorrectionWeave("I wait here every morning.")).toBeNull();
      expect(buildSpeakTopicCorrectionWeave("I sick today.")).toBeNull();
      expect(buildSpeakTopicCorrectionWeave("I feel sick today.")).toBeNull();

      const waitSelection = selectSpeakFollowUpByTopicId("topic-time-appointments-waiting", {
        askedQuestions: [],
        turnsOnTopic: 0,
        learnerText: "I wait you.",
      });
      expect(waitSelection.correctionSignalId).toBeUndefined();
      expect(waitSelection.correctionStatus).toBeUndefined();
      expect(waitSelection.question).not.toMatch(/No need to fix|won't guess/i);
      expect(waitSelection.isPivot).toBe(false);

      const healthSelection = selectSpeakFollowUpByTopicId("topic-doctor-health-visit", {
        askedQuestions: [],
        turnsOnTopic: 0,
        learnerText: "I sick today.",
      });
      expect(healthSelection.correctionSignalId).toBeUndefined();
      expect(healthSelection.correctionStatus).toBeUndefined();
      expect(healthSelection.question).not.toMatch(/won't guess the correction/i);
      expect(healthSelection.question).toMatch(/Why do you need to see the doctor\?/);
      expect(healthSelection.isPivot).toBe(false);
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
