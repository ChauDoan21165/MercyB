import { describe, expect, it } from "vitest";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  SEMANTIC_IMPLAUSIBILITY_SIGNALS,
  STT_ABSTAIN_MESSAGE,
  STT_GARBLE_SIGNALS,
  correctWithTutorRules,
  detectRunOn,
  findAndFixSttGarble,
  findSemanticImplausibility,
  segmentRunOn,
  validateCorrectionChangedWhenNeeded,
} from "@/lib/tutor/correctionEngine";
import { englishCorrectionRules } from "@/lib/tutor/correctionRules/en";

describe("correctionEngine", () => {
  it.each([
    ["I buy a hat yesterday.", "I bought a hat yesterday."],
    ["i buy a hat yesterday", "I bought a hat yesterday."],
    ["She go to school every day.", "She goes to school every day."],
    ["He eat rice yesterday.", "He ate rice yesterday."],
    ["He have a test yesterday.", "He had a test yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
    ["I do homework yesterday.", "I did homework yesterday."],
    ["She eat rice last night.", "She ate rice last night."],
    ["We have a meeting two days ago.", "We had a meeting two days ago."],
    ["He go to school every day.", "He goes to school every day."],
    ["She eat rice every day.", "She eats rice every day."],
    ["It have food every day.", "It has food every day."],
    ["I bought hat yesterday.", "I bought a hat yesterday."],
    ["I bought bicycle yesterday.", "I bought a bicycle yesterday."],
    ["She is teacher.", "She is a teacher."],
    ["I have two book.", "I have two books."],
    ["Many student like English.", "Many students like English."],
    ["I go school.", "I go to school."],
    ["She very happy.", "She is very happy."],
    ["Yesterday I buy a hat.", "Yesterday I bought a hat."],
    ["This book I like.", "I like this book."],
    ["English I study every day.", "I study English every day."],
    ["In my family, my mother I love very much.", "In my family, I love my mother very much."],
    ["He very busy today.", "He is very busy today."],
    ["They very tired.", "They are very tired."],
    ["I yesterday bought a hat.", "I bought a hat yesterday."],
  ])("corrects beginner English fallback: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
    });
  });

  it.each([
    ["I buy a hat yesterday.", "I bought a hat yesterday."],
    ["He eat rice yesterday.", "He ate rice yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
    ["I do homework yesterday.", "I did homework yesterday."],
    ["She go home yesterday.", "She went home yesterday."],
  ])("preserves approved yesterday irregular past correction: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-yesterday-irregular-beginner-past"],
    });
  });

  it.each([
    "Did you eat yesterday?",
    "Did you buy yesterday?",
    "Did you have yesterday?",
    "Did you do yesterday?",
    "Did you go yesterday?",
    "Where did you go yesterday?",
  ])("does not rewrite do-support yesterday questions: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      corrected: input,
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I bought hat yesterday.", "I bought a hat yesterday."],
    ["I bought bicycle yesterday.", "I bought a bicycle yesterday."],
    ["I want apple.", "I want an apple."],
    ["I need book.", "I need a book."],
    ["She bought orange.", "She bought an orange."],
    ["I want student.", "I want a student."],
    ["I need teacher.", "I need a teacher."],
  ])("corrects approved Step 5 article omission for whitelisted count nouns: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-l4-missing-singular-article"]),
    });
  });

  it.each([
    "I drink water.",
    "I bought the bicycle.",
    "I bought my bicycle.",
    "I like music.",
    "I like dogs.",
    "I bought Apple yesterday.",
    "I need book a table.",
    "I need book a flight.",
    "I need book a ticket.",
  ])("does not over-trigger approved Step 5 article omission: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toMatch(/\b(?:a|an)\s+(?:water|the bicycle|my bicycle|music|dogs|Apple)\b/i);
  });

  it.each([
    ["He is teacher.", "He is a teacher."],
    ["She is doctor.", "She is a doctor."],
    ["I am student.", "I am a student."],
    ["He is engineer.", "He is an engineer."],
    ["She is artist.", "She is an artist."],
  ])("corrects approved Step 6 profession-article predicate pattern: %s", (input, expected) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-profession-article"],
    });
    expect(result.appliedRuleIds).not.toContain("en-l4-missing-singular-article");
  });

  it.each([
    "They are teacher.",
    "He is the teacher.",
    "He is my teacher.",
    "He is doctor Smith.",
    "She is nurse Nguyen.",
    "He is Doctor Smith.",
    "He is doctor strange.",
    "He is doctor lee.",
    "She is nurse nguyen.",
    "She is a doctor.",
    "He is happy.",
  ])("does not over-trigger approved Step 6 profession-article predicate pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["My mother car is old.", "My mother's car is old."],
    ["His brother phone is new.", "His brother's phone is new."],
    ["Her friend house is big.", "Her friend's house is big."],
    ["My teacher computer is old.", "My teacher's computer is old."],
    ["My boss office is small.", "My boss's office is small."],
    ["My husband job is hard.", "My husband's job is hard."],
    ["His brother bicycle is new.", "His brother's bicycle is new."],
  ])("corrects approved Step 6 possessive-s pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-possessive-s"],
    });
  });

  it.each([
    "My mother tongue is Vietnamese.",
    "This is a sister city.",
    "My parents car is old.",
    "My friends car is old.",
    "My mother is old.",
  ])("does not over-trigger approved Step 6 possessive-s pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I have two book.", "I have two books."],
    ["Many student like English.", "Many students like English."],
    ["I learned several word today.", "I learned several words today."],
    ["We have many lesson.", "We have many lessons."],
  ])("corrects approved Step 5 plural omission for whitelisted regular nouns: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-l4-quantity-plural-s"]),
    });
  });

  it.each([
    ["I have 4 book.", "I have 4 books."],
    ["She bought 9 apple.", "She bought 9 apples."],
    ["We saw a few lesson.", "We saw a few lessons."],
    ["They need 10 word.", "They need 10 words."],
  ])("corrects narrow numeral/quantifier plural: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-vn-numeral-quantifier-plural"]),
    });
  });

  it.each([
    "I have 4 water.",
    "I have 4 school bus.",
    "We saw a few water.",
    "I have one book.",
    "I have 3 books.",
  ])("does not over-trigger narrow numeral/quantifier plural: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: expect.not.arrayContaining(["en-vn-numeral-quantifier-plural"]),
    });
  });

  it.each([
    "some water",
    "much money",
    "one book",
    "two child",
  ])("does not over-trigger approved Step 5 plural omission: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toContain("childs");
  });

  it.each([
    "My sister phone me.",
    "My sister phone me yesterday.",
    "My friend book a room.",
    "My brother bike to work.",
    "I want book a room.",
    "I want some book a room.",
  ])("does not over-trigger noun rules on B4 likely-verb homographs: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      corrected: input,
      appliedRuleIds: [],
    });
  });

  it("combines approved Step 5 SVA and missing-to rules for one learner sentence", () => {
    expect(correctWithTutorRules("She go school.", "en")).toMatchObject({
      status: "corrected",
      corrected: "She goes to school.",
      appliedRuleIds: ["en-step5-subject-verb-agreement", "en-step5-preposition-pattern"],
    });
  });

  it.each([
    "They go.",
    "My parents cook.",
    "I go.",
    "You go.",
    "He can go.",
    "She will work.",
    "He and she go to work.",
    "She and he work together.",
    "It and he make noise.",
  ])("does not over-trigger approved Step 5 third-person singular: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it("preserves approved daily routine third-person positive", () => {
    expect(correctWithTutorRules("She eat breakfast every day.", "en")).toMatchObject({
      status: "corrected",
      corrected: "She eats breakfast every day.",
      appliedRuleIds: ["en-third-person-daily-go-eat-have"],
    });
  });

  it.each([
    "Does she eat every day?",
    "Does he eat every day?",
    "Does she have breakfast every day?",
    "Does he go to school?",
    "Do they go to school?",
    "Did she eat every day?",
    "Did he have lunch every day?",
    "Did she go every day?",
    "Did she go to school?",
    "Does she go to school every day?",
    "Why does she eat every day?",
    "When does he go to school?",
  ])("does not apply routine third-person corrections inside questions: %s", (input) => {
    const result = correctWithTutorRules(input, "en");

    expect(result).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toMatch(/\b(?:eats|has|goes)\b/i);
  });

  it.each([
    ["He go on Monday.", "He go on Monday."],
    ["He go in 2024.", "He go in 2024."],
    ["She work an hour ago.", "She work an hour ago."],
    ["It make last summer.", "It make last summer."],
  ])("blocks SVA after temporal contexts that are not safe past-tense rewrites: %s", (input, expected) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.appliedRuleIds).not.toContain("en-step5-subject-verb-agreement");
    expect(result.appliedRuleIds).not.toContain("en-yesterday-irregular-beginner-past");
    expect(result.corrected).toBe(expected);
    expect(result.corrected).not.toMatch(/\b(?:goes|works|makes)\b/);
  });

  it.each([
    ["I go school.", "I go to school."],
    ["She goes school.", "She goes to school."],
    ["I am going school.", "I am going to school."],
  ])("corrects approved Step 5 missing-to school pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-step5-preposition-pattern"]),
    });
  });

  it.each([
    "I go to school.",
    "I go home.",
    "I go there.",
    "I go downtown.",
    "I go abroad.",
    "I go upstairs.",
    "I go school bus.",
  ])("does not over-trigger approved Step 5 missing-to school pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I wait you.", "I wait for you."],
    ["She waited me.", "She waited for me."],
    ["They are waiting him.", "They are waiting for him."],
    ["He waits her.", "He waits for her."],
  ])("corrects approved Step 6 wait-for person object pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-wait-for-person-object"],
    });
  });

  it.each([
    "I wait for you.",
    "Please wait here.",
    "Wait a minute.",
    "He waits tables.",
    "Wait them out.",
    "We waited him out.",
    "I will wait you out.",
    "Wait them up.",
    "We waited him up.",
    "I will wait you up.",
    "They are waiting him up.",
  ])("does not over-trigger approved Step 6 wait-for person object pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I listen music.", "I listen to music."],
    ["She listens teacher.", "She listens to teacher."],
    ["They listened song.", "They listened to song."],
  ])("corrects approved Step 6 listen-to object pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-listen-to-object"],
    });
  });

  it.each([
    "I listen to music.",
    "Listen carefully.",
    "Listen!",
    "She hears music.",
  ])("does not over-trigger approved Step 6 listen-to object pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Look me.", "Look at me."],
    ["She looked him.", "She looked at him."],
    ["They are looking us.", "They are looking at us."],
  ])("corrects approved Step 6 look-at pronoun pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-look-at-pronoun"],
    });
  });

  it.each([
    "She looks happy.",
    "I look for my phone.",
    "He looks like his father.",
    "Look at me.",
    "I'll look you up.",
    "Look them over.",
    "Look him in the eye.",
    "Look her in the eyes.",
    "Look me in the eye.",
  ])("does not over-trigger approved Step 6 look-at pronoun pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I in Canada.", "I am in Canada."],
    ["She at school.", "She is at school."],
    ["They in the room.", "They are in the room."],
  ])("corrects approved Step 6 location be-drop pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-location-be-drop"],
    });
  });

  it.each([
    "Are you in Canada?",
    "I am in Canada.",
    "I work in Canada.",
    "She very happy.",
    "John in accounting.",
    "The class on Monday is hard.",
  ])("does not over-trigger approved Step 6 location be-drop pattern: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    if (input === "She very happy.") {
      expect(result).toMatchObject({
        status: "corrected",
        appliedRuleIds: ["en-be-verb-omission"],
      });
      expect(result.appliedRuleIds).not.toContain("en-step6-location-be-drop");
      return;
    }

    expect(result).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Open the light.", "Turn on the light."],
    ["Can you open the TV?", "Can you turn on the TV?"],
    ["I opened the fan.", "I turned on the fan."],
  ])("corrects approved open to turn-on appliance calque: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-calque-open-turn-on-appliance"],
    });
  });

  it.each([
    "Open the door.",
    "Open the window.",
    "Open the box.",
    "Open the laptop.",
    "Open the TV stand.",
  ])("does not over-trigger open to turn-on appliance calque: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Close the light.", "Turn off the light."],
    ["Please close the TV.", "Please turn off the TV."],
    ["She closed the fan.", "She turned off the fan."],
  ])("corrects approved close to turn-off appliance calque: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-calque-close-turn-off-appliance"],
    });
  });

  it.each([
    "Close the door.",
    "Close the window.",
    "Close the box.",
    "Close the laptop.",
    "Close the TV stand.",
  ])("does not over-trigger close to turn-off appliance calque: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I drink medicine.", "I take medicine."],
    ["She ate two pills.", "She took two pills."],
    ["He drinks antibiotics every day.", "He takes antibiotics every day."],
    ["I eat a tablet of medicine.", "I take a tablet of medicine."],
  ])("corrects approved take medicine calque: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-calque-take-medicine"],
    });
  });

  it.each([
    "I drink water.",
    "She eats rice.",
    "He takes medicine.",
    "Drink more water with medicine.",
    "Eat before taking medicine.",
    "I eat a tablet of chocolate.",
  ])("does not over-trigger take medicine calque: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I want to say with you.", "I want to say to you."],
    ["She said with me yesterday.", "She said to me yesterday."],
    ["He says with her every day.", "He says to her every day."],
    ["They are saying with us now.", "They are saying to us now."],
    ["Please say with them after class.", "Please say to them after class."],
    ["I said with him at 5 PM.", "I said to him at 5 PM."],
  ])("corrects tightened say-with-person calque: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-calque-say-with-person"],
    });
  });

  it.each([
    "Say it with me.",
    "She said the truth with him.",
    "I would say, with him, that it is wrong.",
    "What are you saying with them?",
    "Which sentence are you saying with them?",
    "She said with him beside me.",
    "She said with him present.",
    "She said with him gone.",
    "They said with us there.",
    "She said with him sitting near me.",
    "She said with him in the room.",
    "She said with him by my side.",
    "She said with me that he was late.",
    "She said with him who was beside me.",
    "She said with him which was strange.",
    "She said with him when I arrived.",
    "She said with him where we met.",
    "She said with him because he asked.",
    "She said with him so I listened.",
    "Say with me that song.",
    "She talked with him.",
    "I went with you.",
  ])("does not over-trigger tightened say-with-person calque: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["An hour ago I eat lunch.", "An hour ago I ate lunch."],
    ["Last summer she go to Canada.", "Last summer she went to Canada."],
    ["In 2024 they move to Toronto.", "In 2024 they moved to Toronto."],
  ])("corrects approved Step 6 past-marker recall pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-past-marker-recall"],
    });
  });

  it.each([
    "On Monday I go to school.",
    "Every Monday I go to school.",
    "Last summer I went to Canada.",
    "I said an hour ago I was busy.",
  ])("does not over-trigger approved Step 6 past-marker recall pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I was born 2020.", "I was born in 2020."],
    ["She moved here March.", "She moved here in March."],
    ["They arrived 2023.", "They arrived in 2023."],
  ])("corrects approved Step 6 in-month/year pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-in-month-year"],
    });
  });

  it.each([
    "I started 2020 projects.",
    "I was born in 2020.",
    "March is cold.",
    "I have 2020 dollars.",
  ])("does not over-trigger approved Step 6 in-month/year pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I enter to the room.", "I enter the room."],
    ["She entered to the classroom.", "She entered the classroom."],
    ["They enter into the house.", "They enter the house."],
  ])("corrects approved Step 6 enter concrete-place pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-enter-concrete-place"],
    });
  });

  it.each([
    "They enter into an agreement.",
    "I enter the room.",
    "I go to the room.",
    "She entered into a contract.",
  ])("does not over-trigger approved Step 6 enter concrete-place pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["We discuss about homework.", "We discuss homework."],
    ["They discussed about the problem.", "They discussed the problem."],
    ["I want to discuss about this.", "I want to discuss this."],
  ])("corrects approved Step 6 discuss-about pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-discuss-about"],
    });
  });

  it.each([
    "We talk about homework.",
    "We discuss homework.",
    "This is about homework.",
  ])("does not over-trigger approved Step 6 discuss-about pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["She married with him.", "She married him."],
    ["He will marry with her.", "He will marry her."],
    ["I want to marry with you.", "I want to marry you."],
  ])("corrects approved Step 6 marry-with pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-marry-with"],
    });
  });

  it.each([
    "She married him.",
    "She is married to him.",
    "They went with him.",
  ])("does not over-trigger approved Step 6 marry-with pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  // --- Vietlish Step 11 Batch 4 (MR-B) ---

  it.each([
    ["I make homework every day.", "I do homework every day."],
    ["She made her homework.", "She did her homework."],
    ["He makes homework at home.", "He does homework at home."],
  ])("corrects Vietlish Batch 4 do-homework pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vietlish-collocation-do-homework"],
    });
  });

  it.each([
    "The teacher makes homework fun.",
    "She makes a cake.",
    "I do homework every day.",
  ])("does not over-trigger Vietlish Batch 4 do-homework pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I want to mention about the plan.", "I want to mention the plan."],
    ["She mentioned about her trip.", "She mentioned her trip."],
    ["He mentions about it often.", "He mentions it often."],
  ])("corrects Vietlish Batch 4 mention-about pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vietlish-mention-about"],
    });
  });

  it.each([
    "We talk about homework.",
    "There was no mention about it.",
    "He mentioned that he was late.",
  ])("does not over-trigger Vietlish Batch 4 mention-about pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Please contact with me tomorrow.", "Please contact me tomorrow."],
    ["I will contact with him.", "I will contact him."],
    ["She contacted with us last week.", "She contacted us last week."],
  ])("corrects Vietlish Batch 4 contact-with pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vietlish-contact-with"],
    });
  });

  it.each([
    "I am in contact with him.",
    "He made contact with them.",
    "We work with them.",
  ])("does not over-trigger Vietlish Batch 4 contact-with pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Please text to me tonight.", "Please text me tonight."],
    ["He phoned to her yesterday.", "He phoned her yesterday."],
    ["She phones to us every morning.", "She phones us every morning."],
  ])("corrects Vietlish Batch 4 phone/text-to pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vietlish-phone-text-to"],
    });
  });

  it.each([
    "Please send a text to me.",
    "I phoned to confirm the time.",
    "I will call to him.",
  ])("does not over-trigger Vietlish Batch 4 phone/text-to pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I wake up 7 o'clock.", "I wake up at 7 o'clock."],
    ["She starts work 8 AM.", "She starts work at 8 AM."],
    ["We meet 6:30.", "We meet at 6:30."],
    ["I wake up 12 o'clock.", "I wake up at 12 o'clock."],
  ])("corrects approved Step 6 at-clock-time pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-step6-at-clock-time"],
    });
  });

  it.each([
    "I wake up early.",
    "She works 8 hours.",
    "We meet tomorrow.",
    "We meet at 6:30.",
    "I wake up 25:00.",
    "She starts work 19:99.",
  ])("does not over-trigger approved Step 6 at-clock-time pattern: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["She very happy.", "She is very happy."],
    ["I very busy.", "I am very busy."],
    ["They very tired.", "They are very tired."],
  ])("corrects approved Step 5 be-drop with very anchor: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-be-verb-omission"],
    });
  });

  it.each([
    ["I tired.", "I am tired."],
    ["She happy.", "She is happy."],
    ["They busy today.", "They are busy today."],
    ["Anna tired yesterday.", "Anna was tired yesterday."],
    ["He sad.", "He is sad."],
  ])("corrects narrow be-drop adjective predicate: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vn-copula-be-adjective"],
    });
  });

  it.each([
    "I sleep.",
    "She runs.",
    "He is tired.",
    "They are busy.",
    "The dog tired.",
    "Anna runs.",
    "I very kind.",
  ])("does not over-trigger narrow be-drop adjective predicate: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["She very happy yesterday", "She was very happy yesterday."],
    ["they very happy yesterday", "They were very happy yesterday."],
    ["he very tired last night", "He was very tired last night."],
    ["we very tired two days ago", "We were very tired two days ago."],
  ])("uses past copula for be-drop with explicit past-time marker: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-be-verb-omission"],
    });
  });

  it("does not compose be-drop and missing-to into a run-on", () => {
    const result = correctWithTutorRules("he very happy go school", "en");

    expect(result).toMatchObject({
      status: "unchanged",
      // unchanged contract: corrected === trimmed(input), no silent capitalisation or punct.
      corrected: "he very happy go school",
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toBe("He is very happy go to school.");
    expect(result.appliedRuleIds).not.toContain("en-be-verb-omission");
    expect(result.appliedRuleIds).not.toContain("en-step5-preposition-pattern");
  });

  it.each([
    "She is very happy.",
    "Are you very happy?",
    "Is she very tired?",
    "Were they very busy?",
    "Am I late?",
    "Was he sick yesterday?",
    "She very quickly finished.",
    "I very much like it.",
  ])("does not over-trigger approved Step 5 be-drop: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["en-l4-missing-singular-article", "articles"],
    ["en-l4-quantity-plural-s", "plurals"],
    ["en-step5-subject-verb-agreement", "3rd-person singular"],
    ["en-step5-preposition-pattern", "missing to"],
    ["en-be-verb-omission", "be-drop"],
    ["en-step6-profession-article", "profession article"],
    ["en-step6-possessive-s", "possessive s"],
    ["en-step6-wait-for-person-object", "wait-for"],
    ["en-step6-listen-to-object", "listen-to"],
    ["en-step6-look-at-pronoun", "look-at"],
    ["en-step6-location-be-drop", "location be-drop"],
    ["en-calque-open-turn-on-appliance", "open appliance"],
    ["en-calque-close-turn-off-appliance", "close appliance"],
    ["en-calque-take-medicine", "take medicine"],
    ["en-vn-although-even-though-but", "although/even though + but"],
    ["en-calque-say-with-person", "say with person"],
    ["en-vn-numeral-quantifier-plural", "numeral/quantifier plural"],
    ["en-step6-past-marker-recall", "past-marker recall"],
    ["en-step6-in-month-year", "in-month/year"],
    ["en-step6-enter-concrete-place", "enter concrete place"],
    ["en-step6-discuss-about", "discuss-about"],
    ["en-step6-marry-with", "marry-with"],
    ["en-step6-at-clock-time", "at-clock-time"],
    ["en-vn-copula-be-adjective", "copula be adjective"],
    ["en-vietlish-collocation-do-homework", "do homework"],
    ["en-vietlish-mention-about", "mention about"],
    ["en-vietlish-contact-with", "contact with"],
    ["en-vietlish-phone-text-to", "phone/text to"],
  ])("keeps fp_risk_note metadata for approved correction pattern %s (%s)", (ruleId) => {
    const rule = englishCorrectionRules.find((candidate) => candidate.id === ruleId);
    expect(rule?.fpRiskNote).toEqual(expect.any(String));
    expect(rule?.fpRiskNote?.length).toBeGreaterThan(20);
  });

  it.each([
    ["He go to work.", "He goes to work."],
    ["he go every day", "He goes every day."],
    ["she work here", "She works here."],
    ["it make sense", "It makes sense."],
    ["It make noise.", "It makes noise."],
  ])("corrects narrow Step 5 subject-verb agreement: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-step5-subject-verb-agreement"]),
    });
  });

  it.each([
    "he can go",
    "she should work",
    "it will make sense",
  ])("does not trigger Step 5 subject-verb agreement after modals: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["He go last Monday", "He goes last Monday."],
    ["She work last Friday", "She works last Friday."],
    ["He go yesterday", "He goes yesterday."],
    ["She work two days ago", "She works two days ago."],
    ["It make noise last night", "It makes noise last night."],
  ])("does not trigger present-tense Step 5 SVA in past-time context: %s", (input, forbidden) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.appliedRuleIds).not.toContain("en-step5-subject-verb-agreement");
    expect(result.corrected).not.toBe(forbidden);
  });

  it.each([
    ["I depend of my family", "I depend on my family."],
    ["She is interested with English", "She is interested in English."],
    ["He is good in English", "He is good at English."],
    ["I go school every day", "I go to school every day."],
    ["I go school", "I go to school."],
    ["She goes school", "She goes to school."],
  ])("corrects whitelisted Step 5 preposition pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-step5-preposition-pattern"]),
    });
  });

  it.each([
    "I work in English every day.",
    "She is good in class.",
    "I listen to music every day.",
    "I go to school every day.",
    "I go school bus.",
    "It depends on the weather.",
  ])("does not broadly rewrite prepositions: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["She very happy.", "She is very happy."],
    ["He very busy.", "He is very busy."],
    ["It very sad.", "It is very sad."],
    ["They very tired.", "They are very tired."],
  ])("corrects narrow be-verb omission: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-be-verb-omission"]),
    });
  });

  it.each([
    "She is very happy.",
    "They are very happy.",
    "Are you very happy?",
    "Is she very tired?",
    "Were they very busy?",
    "Am I late?",
    "Was he sick yesterday?",
    "She very quickly finished.",
    "I was very happy.",
  ])("does not broadly add be-verbs: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["I yesterday went to school.", "I went to school yesterday."],
    ["She last night watched TV.", "She watched TV last night."],
    ["They on Monday visited grandma.", "They visited grandma on Monday."],
    ["He in 2024 moved to Canada.", "He moved to Canada in 2024."],
    ["We an hour ago finished dinner.", "We finished dinner an hour ago."],
  ])("repairs only the narrow time-expression placement pattern: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-time-expression-placement"],
    });
  });

  it.each([
    "I usually go to school.",
    "She often watches TV at night.",
    "I went to school yesterday.",
    "Yesterday I went to school.",
    "I always go to school.",
    "They every day study English.",
    "The class on Monday is hard.",
    "The meeting on Monday was cancelled.",
    "I yesterday said I was busy.",
    "I yesterday bought a book.",
  ])("does not over-trigger time-expression placement: %s", (input) => {
    const result = correctWithTutorRules(input, "en");

    expect(result.appliedRuleIds).not.toContain("en-time-expression-placement");
    expect(result.corrected).not.toBe("I said I was busy yesterday.");
  });

  it.each([
    ["She eat rice last night.", "She ate rice last night."],
    ["We have a meeting two days ago.", "We had a meeting two days ago."],
    ["He go last Monday.", "He went last Monday."],
  ])("uses generalized past markers only for known beginner past verbs: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-yesterday-irregular-beginner-past"],
    });
  });

  it.each([
    "On Monday I go to school.",
  ])("does not use unaudited past-time markers for beginner irregular-past correction: %s", (input) => {
    const result = correctWithTutorRules(input, "en");

    expect(result).toMatchObject({
      status: "unchanged",
      corrected: input,
      appliedRuleIds: [],
    });
  });

  it.each([
    "She eats rice every night.",
    "I will buy a hat tomorrow.",
    "I go to school on Monday.",
    "I go to Japan in 2024.",
    "I eat lunch an hour ago.",
    "I go to the beach last summer.",
  ])("does not over-trigger generalized past markers: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    "I do not buy a hat yesterday.",
    "I do not have lunch yesterday.",
    "He does not go last Monday.",
  ])("does not rewrite negated beginner past verbs: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.appliedRuleIds).not.toContain("en-yesterday-irregular-beginner-past");
    expect(result.corrected).not.toMatch(/\b(?:bought|had|went)\b/);
  });

  it.each([
    ["I do homework yesterday.", "I did homework yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
  ])("still corrects non-negated beginner past verbs: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-yesterday-irregular-beginner-past"],
    });
  });

  it.each([
    ["This book I like.", "I like this book."],
    ["English I study every day.", "I study English every day."],
    ["In my family, my mother I love very much.", "In my family, I love my mother very much."],
  ])("repairs only whitelisted topic-comment word order: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-l4-topic-comment-word-order"],
    });
  });

  it.each([
    "This book, I like it.",
    "In my family, my mother loves me very much.",
  ])("does not over-trigger topic-comment word order: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Although I was tired, but I went home.", "Although I was tired, I went home."],
    ["Even though it was late, but we stayed.", "Even though it was late, we stayed."],
    ["Although he was busy, but he helped me.", "Although he was busy, he helped me."],
    ["Even though I was hungry, but I waited.", "Even though I was hungry, I waited."],
  ])("removes redundant although/even though + but: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vn-although-even-though-but"],
    });
  });

  it.each([
    "Although I was tired, I went home.",
    "I was tired, but I went home.",
    "Even though I was tired, I went home.",
    "I stayed home although I was tired.",
  ])("does not over-trigger although/even though + but: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Because I was tired, so I went home.", "Because I was tired, I went home."],
    ["Because it was late, so we left.", "Because it was late, we left."],
    ["Because he was sick, so he stayed home.", "Because he was sick, he stayed home."],
    ["Because I was hungry, so I ate dinner.", "Because I was hungry, I ate dinner."],
  ])("removes redundant because/so doubling: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vn-because-so-doubling"],
    });
  });

  it.each([
    "Because I was tired, I went home.",
    "I was tired, so I went home.",
    "Because I was tired, therefore I went home.",
    "I stayed home because I was tired.",
  ])("does not over-trigger because/so doubling: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it("rejects unchanged wrong correction text", () => {
    expect(
      validateCorrectionChangedWhenNeeded(
        "I buy a hat yesterday.",
        "I buy a hat yesterday.",
      ),
    ).toEqual({
      ok: false,
      reason: "unchanged_wrong",
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    });
  });

  it("does not pretend unsupported clearly wrong English is corrected", () => {
    expect(correctWithTutorRules("I run yesterday.", "en")).toEqual({
      status: "needs_ai",
      corrected: "",
      appliedRuleIds: [],
      message: AI_CORRECTION_REQUIRED_MESSAGE,
    });
  });

  it.each([
    "I bought hats yesterday.",
    "I bought Apple yesterday.",
    "She is a teacher.",
    "She eats rice every night.",
    "She is very happy.",
    "They are very tired.",
    "She very quickly finished.",
    "Yesterday I bought a hat.",
    "My mother loves me very much.",
    "I have one book.",
    "I have some rice.",
    "This book, I like it.",
  ])("does not over-trigger obvious L4 negative control: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "unchanged",
      corrected: expect.any(String),
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toBe("I bought an Apple yesterday.");
  });

  it.each([
    "I bought a bike yesterday, summer is hot.",
    "They bought a bicycle yesterday in Canada.",
  ])("does not fabricate hat-biking content: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "unchanged",
      corrected: input,
      appliedRuleIds: [],
    });
    expect(result.corrected).not.toMatch(/^I bought a hat yesterday because summer is coming/i);
  });

  it("repairs capitalization and punctuation in a morning-routine run-on", () => {
    expect(
      correctWithTutorRules(
        "what do you usually do in the morning nice that sounds like a clear morning routine what do you do after that",
        "en",
      ),
    ).toMatchObject({
      status: "corrected",
      corrected: "What do you usually do in the morning? Nice, that sounds like a clear morning routine. What do you do after that?",
    });
  });

  it("repairs the morning-routine subject carryover from speech input", () => {
    expect(
      correctWithTutorRules(
        "In the morning I wake up and they have a breakfast and coffee and then I go to my office.",
        "en",
      ),
    ).toMatchObject({
      status: "corrected",
      corrected: "In the morning, I wake up, have breakfast and coffee, and then go to my office.",
      appliedRuleIds: ["en-morning-routine-subject-carryover"],
    });
  });

  it("adds question punctuation for simple question forms", () => {
    expect(correctWithTutorRules("what do you usually do in the morning", "en")).toMatchObject({
      status: "corrected",
      corrected: "What do you usually do in the morning?",
    });
  });

  it.each([
    ["What is your name.", "What is your name?"],
    ["Where do you live.", "Where do you live?"],
    ["Why are you late.", "Why are you late?"],
    ["How are you.", "How are you?"],
    ["How old are you.", "How old are you?"],
    ["Can you help me.", "Can you help me?"],
    ["Do you like English.", "Do you like English?"],
    ["Where do you live", "Where do you live?"],
  ])("adds question punctuation only for clear question frames: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-question-form-final-mark"],
    });
  });

  it.each([
    ["In my city have many parks.", "There are many parks in my city."],
    ["In the box have a book.", "There is a book in the box."],
    ["Here have a problem.", "There is a problem here."],
  ])("corrects existential have to there is/there are: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-existential-have-there-is"],
    });
  });

  it.each([
    "I have a car.",
    "We have a meeting today.",
    "There are many parks in my city.",
    "I have many parks in my city.",
  ])("does not over-trigger existential have to there is/there are: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    ["You like coffee?", "Do you like coffee?"],
    ["She have a car?", "Does she have a car?"],
    ["They live in Hanoi?", "Do they live in Hanoi?"],
  ])("inserts do-support for VN yes/no question transfer: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vn-yesno-do-support"],
    });
  });

  it.each([
    ["Do you like coffee?", "Do you like coffee?"],
    ["What do you like?", "What do you like?"],
    // unchanged contract: corrected === trimmed(input), no silent punctuation appended.
    ["You like coffee", "You like coffee"],
  ])("does not over-trigger VN yes/no do-support: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      corrected: expected,
      appliedRuleIds: [],
    });
  });

  it.each([
    ["Yesterday I walk to school.", "Yesterday I walked to school."],
    ["Last night they clean the house.", "Last night they cleaned the house."],
    ["Two days ago we visit grandma.", "Two days ago we visited grandma."],
    ["Yesterday I invite my friend to dinner.", "Yesterday I invited my friend to dinner."],
  ])("inserts -ed for VN past-marker regular-verb transfer: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-vn-past-marker-regular-verb"],
    });
  });

  it.each([
    ["I walk to school every day.", "I walk to school every day."],
    ["Every day I invite my friend to dinner.", "Every day I invite my friend to dinner."],
    ["Tomorrow I invite my friend to dinner.", "Tomorrow I invite my friend to dinner."],
    ["I will invite my friend tomorrow.", "I will invite my friend tomorrow."],
    ["Did you walk to school yesterday?", "Did you walk to school yesterday?"],
    ["Did you invite your friend yesterday?", "Did you invite your friend yesterday?"],
    ["Yesterday I walked to school.", "Yesterday I walked to school."],
    ["Yesterday I invited my friend to dinner.", "Yesterday I invited my friend to dinner."],
    ["I did not walk yesterday.", "I did not walk yesterday."],
  ])("does not over-trigger VN past-marker regular-verb: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      corrected: expected,
      appliedRuleIds: [],
    });
  });

  it("leaves irregular yesterday past to the irregular rule, not the regular-verb rule", () => {
    const result = correctWithTutorRules("Yesterday I go to school.", "en");
    expect(result).toMatchObject({
      status: "corrected",
      corrected: "Yesterday I went to school.",
      appliedRuleIds: ["en-yesterday-irregular-beginner-past"],
    });
    expect(result.appliedRuleIds).not.toContain("en-vn-past-marker-regular-verb");
  });

  it("fixes the live yesterday invite dinner run-on without leaving the full sentence unchanged", () => {
    const input =
      "I invite my best friend to come to my house yesterday and we had dinner and yet why and we smoke cigars he had a lot of fun";
    const result = correctWithTutorRules(input, "en");

    expect(result).toMatchObject({
      status: "corrected",
      corrected: "I invited my best friend to come to my house yesterday. We had dinner and smoked cigars. He had a lot of fun.",
      appliedRuleIds: ["en-yesterday-invite-dinner-runon"],
    });
    expect(result.corrected).not.toBe(`${input}.`);
    expect(result.corrected).toContain("invited");
  });

  it.each([
    "What you said is true.",
    "What he did was wrong.",
    "What I need is time.",
    "How beautiful this is!",
    "How nice it looks!",
    "How hard this test was!",
    "How beautiful this is.",
    "The thing that you said is true.",
    "I know what you said.",
    "What is your name?",
  ])("does not add question punctuation to declarative WH clauses or already-punctuated questions: %s", (input) => {
    const result = correctWithTutorRules(input, "en");

    expect(result).toMatchObject({
      status: "unchanged",
      corrected: input,
      appliedRuleIds: [],
    });
  });

  // ─── Eval-pair golden regressions (from a2-leniency-eval.md wrong-correction audit) ─────

  // eval-010: tense guard — "since <N> <unit>" without present perfect
  // The preposition-only fix "I know him for three years." is still wrong; engine must abstain.
  it("eval-010: abstains on since-for when present-perfect aux is absent (tense also wrong)", () => {
    const result = correctWithTutorRules("I know him since three years.");
    expect(result.status).toBe("needs_ai");
    expect(result.corrected).toBe("");
    // Must NOT produce the partial-wrong fix
    expect(result.status === "needs_ai" ? "" : result.corrected).not.toBe("I know him for three years.");
  });

  // Safe path: present perfect already present — only the preposition needs fixing.
  it("eval-010 safe path: fixes since→for when present perfect is already there", () => {
    const result = correctWithTutorRules("I have known him since three years.");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe("I have known him for three years.");
    expect(result.appliedRuleIds).toContain("en-vietlish-duration-since-for");
  });

  // eval-042: object placement — "explain me <NP>" must reorder to "explain <NP> to me"
  it("eval-042: reorders direct object when NP follows the misplaced pronoun", () => {
    const result = correctWithTutorRules("Please explain me this grammar rule.");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe("Please explain this grammar rule to me.");
    expect(result.appliedRuleIds).toContain("en-vietlish-explain-to-me");
  });

  // eval-087: sentence-boundary guard — declarative after "?" must not get "?" appended
  it("eval-087: does not add ? to a declarative sentence that follows an existing ?", () => {
    const result = correctWithTutorRules("Can you close the fan? I am cold.");
    expect(result.status).toBe("unchanged");
    expect(result.corrected).toBe("Can you close the fan? I am cold.");
    expect(result.appliedRuleIds).not.toContain("en-question-form-final-mark");
  });
});

// ─── Unchanged-contract: corrected must equal input verbatim (fix: silent punctuation/case mutation) ─

describe("correctionEngine — unchanged contract: corrected === input, no silent mutation", () => {
  // Exact fixture from the prod incident brief: input ends with `?"` (closing quote after ?).
  // The old code appended `.` via ensureTerminalPunctuation because `"` is not terminal punct.
  it('prod fixture: Where you go yesterday?" — corrected equals input verbatim (no . appended)', () => {
    const input = 'Where you go yesterday?"';
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("unchanged");
    expect(result.corrected).toBe(input);
    expect(result.appliedRuleIds).toHaveLength(0);
  });

  // Input with lowercase first letter and no terminal punctuation.
  // Old code silently capitalised + appended `.` even on unchanged status.
  it.each([
    "i went to school yesterday",
    "did you go there",
    "she likes reading books",
  ])("lowercase / no-punct input: corrected equals trimmed input, not a mutated version: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    if (result.status === "unchanged") {
      expect(result.corrected).toBe(input.trim());
    }
  });

  // Sanity check: a sentence that genuinely changes gets a DIFFERENT corrected value.
  it("corrected sentences still differ from input (no regression on corrected path)", () => {
    const result = correctWithTutorRules("I buy a hat yesterday.", "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).not.toBe("I buy a hat yesterday.");
    expect(result.corrected).toBe("I bought a hat yesterday.");
  });
});

// ─── Golden correction gate: corrected must differ from input in letters, not just punctuation ─

describe("correctionEngine — golden gate: correction must change letters, not only punctuation", () => {
  // These inputs are genuinely corrected (status=corrected).
  // Verify that the corrected form differs from the input in at least one LETTER (not just a
  // punctuation append), and that every such pair has a non-empty appliedRuleIds list.
  const GOLDEN_PAIRS: [string, string][] = [
    ["I buy a hat yesterday.", "I bought a hat yesterday."],
    ["She go to school every day.", "She goes to school every day."],
    ["He eat rice yesterday.", "He ate rice yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
    ["She bought orange.", "She bought an orange."],
    ["She is teacher.", "She is a teacher."],
    ["Many student like English.", "Many students like English."],
    ["She very happy.", "She is very happy."],
  ];

  it.each(GOLDEN_PAIRS)(
    "corrected form differs from input in letters (not only punctuation): %s",
    (input, expectedCorrected) => {
      const result = correctWithTutorRules(input, "en");
      expect(result.status).toBe("corrected");
      expect(result.corrected).toBe(expectedCorrected);

      // Punctuation-masked echo check: strip all non-letter chars and compare.
      const lettersOnly = (s: string) => s.replace(/[^a-z]/gi, "").toLowerCase();
      expect(lettersOnly(result.corrected)).not.toBe(lettersOnly(input));

      // A real correction must have at least one rule ID.
      expect(result.appliedRuleIds.length).toBeGreaterThan(0);
    },
  );
});

describe("correctionEngine — BUG1 semantic plausibility trust floor", () => {
  it("does NOT confidently present a grammar-only fix that is still nonsense (buy a head)", () => {
    // Grammar would fix buy->bought, but "bought a head" is still nonsense -> abstain + clarify.
    const result = correctWithTutorRules("I buy a head yesterday.", "en");
    expect(result.status).toBe("needs_ai");
    expect(result.corrected).toBe("");
    expect(result.status === "needs_ai" && result.semanticHint).toBeTruthy();
    expect(result.status === "needs_ai" ? result.semanticHint : "").toMatch(/hat|mũ/i);
    // Must never have surfaced the confident wrong correction.
    expect(result.corrected).not.toBe("I bought a head yesterday.");
  });

  it("abstains on a grammatically clean but implausible sentence (bought a head)", () => {
    const result = correctWithTutorRules("I bought a head.", "en");
    expect(result.status).toBe("needs_ai");
    expect(result.corrected).toBe("");
    expect(result.status === "needs_ai" ? result.semanticHint : "").toMatch(/hat|mũ/i);
  });

  it.each([
    "I bought a head of lettuce.",
    "I bought a head of cabbage.",
  ])("does NOT flag the plausible 'a head of <vegetable>' phrase: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).not.toBe("needs_ai");
    expect(result.corrected).toContain("head of");
  });

  it("preserves the normal hat correction (no false positive on the real word)", () => {
    expect(correctWithTutorRules("I buy a hat yesterday.", "en")).toMatchObject({
      status: "corrected",
      corrected: "I bought a hat yesterday.",
    });
  });

  it("keeps precision-gate evidence on every semantic implausibility signal", () => {
    for (const signal of SEMANTIC_IMPLAUSIBILITY_SIGNALS) {
      expect(signal.positives.length).toBeGreaterThanOrEqual(3);
      expect(signal.confusableNegatives.length).toBeGreaterThanOrEqual(2);
      expect(signal.fpRiskNote.length).toBeGreaterThan(20);
      expect(signal.clarificationHint.trim().length).toBeGreaterThan(0);
      // Every positive must flag; every confusable negative must not.
      for (const positive of signal.positives) {
        expect(findSemanticImplausibility(positive)?.id, positive).toBe(signal.id);
      }
      for (const negative of signal.confusableNegatives) {
        expect(findSemanticImplausibility(negative), negative).toBeNull();
      }
    }
  });
});

// ─── STT Garble Guard ─────────────────────────────────────────────────────────

describe("correctionEngine — STT garble guard", () => {
  // Regression case: the exact sentence from the prod incident.
  it("regression: 'it's very Sunday in the summer' is NOT approved — proposes sunny", () => {
    const result = correctWithTutorRules("it's very Sunday in the summer", "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toContain("sunny");
    expect(result.corrected).not.toContain("Sunday");
    expect(result.appliedRuleIds).toContain("stt-degree-sunday-to-sunny");
  });

  it.each([
    ["The weather is so Sunday today.", "The weather is so sunny today."],
    ["It is really Sunday outside.", "It is really sunny outside."],
    ["It's quite Sunday today.", "It's quite sunny today."],
    ["It's too Sunday to go out.", "It's too sunny to go out."],
  ])("fixes degree-adverb + Sunday to sunny: %s", (input, expected) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe(expected);
    expect(result.appliedRuleIds).toContain("stt-degree-sunday-to-sunny");
  });

  it.each([
    "It's very Monday outside.",
    "It's very Friday today.",
  ])("abstains on degree-adverb + unknown weekday (no confident fix): %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("needs_ai");
    expect(result.corrected).toBe("");
    expect(result.status === "needs_ai" && result.semanticHint).toBe(STT_ABSTAIN_MESSAGE);
  });

  it.each([
    "I feel week after the workout.",
    "She feels so week.",
  ])("abstains on feel-week STT confusion: %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("needs_ai");
    expect(result.corrected).toBe("");
    expect(result.status === "needs_ai" && result.semanticHint).toBe(STT_ABSTAIN_MESSAGE);
  });

  // No-false-positive: a real sentence containing Sunday must pass through unchanged.
  it("no-FP: 'I love Sunday mornings.' stays approved — unchanged", () => {
    const result = correctWithTutorRules("I love Sunday mornings.", "en");
    expect(result.status).toBe("unchanged");
    expect(result.corrected).toContain("Sunday");
    expect(result.appliedRuleIds).not.toContain("stt-degree-sunday-to-sunny");
  });

  it.each([
    "See you on Sunday.",
    "Every Sunday I go to church.",
    "Have a great Sunday.",
  ])("no-FP: standalone Sunday mentions are left untouched: %s", (input) => {
    const result = findAndFixSttGarble(input);
    expect(result).toBeNull();
  });

  // STT garble: "dishes" ↔ "this is" (Chau's logged case — determiner-gated)
  it.each([
    ["I need to wash the this is after dinner.", "I need to wash the dishes after dinner."],
    ["Can you do the this is please?", "Can you do the dishes please?"],
    ["She cleaned my this is yesterday.", "She cleaned my dishes yesterday."],
  ])("fixes determiner + 'this is' garble to dishes: %s", (input, expected) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe(expected);
    expect(result.appliedRuleIds).toContain("stt-dishes-this-is");
  });

  it.each([
    "I think this is correct.",
    "This is a good idea.",
    "A lot of this is because of him.",
  ])("no-FP: standalone and clausal 'this is' is not flagged as dishes garble: %s", (input) => {
    const garble = findAndFixSttGarble(input);
    if (garble !== null) {
      expect(garble.type === "fix" ? garble.ruleId : "abstain").not.toBe("stt-dishes-this-is");
    }
  });

  it("keeps precision-gate evidence on every STT garble signal", () => {
    for (const signal of STT_GARBLE_SIGNALS) {
      expect(signal.positives.length).toBeGreaterThanOrEqual(3);
      expect(signal.confusableNegatives.length).toBeGreaterThanOrEqual(2);
      expect(signal.fpRiskNote.length).toBeGreaterThan(20);
      // Every positive must trigger; every confusable negative must not.
      for (const positive of signal.positives) {
        const garble = findAndFixSttGarble(positive);
        expect(garble, `positive should fire: ${positive}`).not.toBeNull();
        expect(garble?.type === "fix" ? garble.ruleId : garble?.type, positive).toBeTruthy();
      }
      for (const negative of signal.confusableNegatives) {
        const garble = findAndFixSttGarble(negative);
        if (garble !== null) {
          // A confusable negative is allowed to return abstain for a DIFFERENT signal,
          // but must NOT fire the signal it's guarding against.
          expect(garble.type === "fix" ? garble.ruleId : "abstain", negative).not.toBe(signal.id);
        }
      }
    }
  });
});

// ─── Run-on Segmentation ──────────────────────────────────────────────────────

describe("correctionEngine — run-on detection", () => {
  it.each([
    "I go to school yesterday and I eat lunch yesterday and I do homework yesterday.",
    "She eat rice yesterday and she go to school yesterday and she do homework yesterday.",
    "He buy a hat yesterday and he go to the park yesterday and he eat lunch yesterday.",
    "I study every day and I practice speaking every day and I watch movie every day.",
    "She go to school every day and she eat rice every day and she do her homework.",
    "I have lunch yesterday, I go home yesterday, and I do my homework yesterday.",
  ])("detects run-on: %s", (input) => {
    expect(detectRunOn(input)).toBe(true);
  });

  it.each([
    "I buy a hat yesterday.",
    "She is a teacher.",
    "It's very Monday outside.",
    "I feel week after the workout.",
    "He go to school every day.",
  ])("does not flag short single-clause sentence as run-on: %s", (input) => {
    expect(detectRunOn(input)).toBe(false);
  });
});

describe("correctionEngine — run-on segmentation", () => {
  it("splits 'A and B and C' into three clauses", () => {
    const result = segmentRunOn(
      "I go to school yesterday and I eat lunch yesterday and I do homework yesterday.",
    );
    expect(result).not.toBeNull();
    expect(result!.length).toBe(3);
  });

  it("splits comma-separated clauses", () => {
    const result = segmentRunOn(
      "I have lunch yesterday, I go home yesterday, and I do my homework yesterday.",
    );
    expect(result).not.toBeNull();
    expect(result!.length).toBeGreaterThanOrEqual(2);
  });

  it("returns null for a short, unsplittable sentence", () => {
    expect(segmentRunOn("I buy a hat yesterday.")).toBeNull();
  });

  it("strips leading conjunctions from split segments", () => {
    const result = segmentRunOn(
      "She eat rice yesterday and she go to school yesterday and she do homework yesterday.",
    );
    expect(result).not.toBeNull();
    for (const seg of result!) {
      expect(seg).not.toMatch(/^(?:and|but|so|or)\s/i);
    }
  });
});

describe("correctionEngine — run-on: segmented+corrected, not refused", () => {
  // These inputs are grammar-correct run-ons — no existing specific rule fires, so the
  // generic run-on segmenter engages and the assembled output is returned as "corrected".
  it.each([
    "I study English every day and I practice speaking every day and I listen to music every day.",
    "I like coffee and I like tea and I also like orange juice every morning.",
    "I work at a company every day and I earn good money and I live in a nice city.",
    "I want to learn English fluently and I want to speak with confidence and I want to get a good job.",
    "I go to the park every morning and I exercise for one hour and I feel very healthy.",
    "She studies hard every day, she practices speaking every weekend, and she reads new books monthly.",
  ])("run-on is segmented and corrected (not refused): %s", (input) => {
    const result = correctWithTutorRules(input, "en");
    expect(result.status).toBe("corrected");
    expect(result.appliedRuleIds).toContain("runon-segmented");
    // Assembled output must differ from the original run-on form.
    expect(result.corrected).not.toBe(normalizeInput(input));
  });

  // Abstain-still-works: STT garble on a short non-run-on input still abstains.
  it("abstain still works: STT garble on short input is not confused with run-on", () => {
    const result = correctWithTutorRules("It's very Monday outside.", "en");
    expect(result.status).toBe("needs_ai");
    expect(result.status === "needs_ai" && result.semanticHint).toBe(STT_ABSTAIN_MESSAGE);
  });

  it("abstain still works: feel-week on short input still abstains", () => {
    const result = correctWithTutorRules("I feel week after the workout.", "en");
    expect(result.status).toBe("needs_ai");
    expect(result.status === "needs_ai" && result.semanticHint).toBe(STT_ABSTAIN_MESSAGE);
  });

  // No regression on short inputs.
  it("no regression: short past-tense error still corrected normally", () => {
    const result = correctWithTutorRules("I buy a hat yesterday.", "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe("I bought a hat yesterday.");
    expect(result.appliedRuleIds).not.toContain("runon-segmented");
  });

  it("no regression: short subject-verb error still corrected normally", () => {
    const result = correctWithTutorRules("She is teacher.", "en");
    expect(result.status).toBe("corrected");
    expect(result.corrected).toBe("She is a teacher.");
    expect(result.appliedRuleIds).not.toContain("runon-segmented");
  });
});

/** Normalise for comparison the same way the engine does internally. */
function normalizeInput(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}
