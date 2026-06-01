import { describe, expect, it } from "vitest";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
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
  ])("corrects approved Step 5 plural omission for whitelisted regular nouns: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-l4-quantity-plural-s"]),
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
  ])("does not over-trigger approved Step 5 third-person singular: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    "Does she eat every day?",
    "Does he eat every day?",
    "Does she have breakfast every day?",
    "Does he go to school?",
    "Do they go to school?",
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

  it.each([
    ["I wake up 7 o'clock.", "I wake up at 7 o'clock."],
    ["She starts work 8 AM.", "She starts work at 8 AM."],
    ["We meet 6:30.", "We meet at 6:30."],
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
      corrected: "He very happy go school.",
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
    ["en-calque-say-with-person", "say with person"],
    ["en-step6-past-marker-recall", "past-marker recall"],
    ["en-step6-in-month-year", "in-month/year"],
    ["en-step6-enter-concrete-place", "enter concrete place"],
    ["en-step6-discuss-about", "discuss-about"],
    ["en-step6-marry-with", "marry-with"],
    ["en-step6-at-clock-time", "at-clock-time"],
  ])("keeps fp_risk_note metadata for approved correction pattern %s (%s)", (ruleId) => {
    const rule = englishCorrectionRules.find((candidate) => candidate.id === ruleId);
    expect(rule?.fpRiskNote).toEqual(expect.any(String));
    expect(rule?.fpRiskNote?.length).toBeGreaterThan(20);
  });

  it.each([
    ["he go every day", "He goes every day."],
    ["she work here", "She works here."],
    ["it make sense", "It makes sense."],
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
    [
      "They bought a hat yesterday Because summer sucks coming and it's very sunny I need a hat.",
      "I bought a hat yesterday because summer is coming, and it is very sunny.",
    ],
    [
      "I bought a hat yesterday because summer is coming and I will bike a lot I need a hat.",
      "I bought a hat yesterday because I plan to bike a lot this summer.",
    ],
    [
      "I bought a hat yesterday because it is summer Canada is very sunny very hot so and I win bike everywhere I need a hat.",
      "I bought a hat yesterday because I plan to bike a lot this summer, and it is very sunny in Canada.",
    ],
    [
      "I bought a hat yesterday because summer is coming and it is very hot I need a hat since I've been bike a lot.",
      "I bought a hat yesterday because I plan to bike a lot this summer.",
    ],
    [
      "I bought a bicycle yesterday someone's coming and I've been a bike a lot I also buy a hat because it's very sunny in the summer in Canada.",
      "I bought a bicycle yesterday because summer is coming, and I plan to bike a lot. I also bought a hat because it is very sunny in Canada.",
    ],
  ])("repairs hat, summer, Canada, and biking run-on output: %s", (input, expected) => {
    const result = correctWithTutorRules(input, "en");
    expect(result).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: ["en-hat-biking-summer-runon"],
    });
    expect(result.corrected).not.toMatch(/summer sucks coming|someone'?s coming|I'?ve been a bike|I win bike|they\b/i);
  });

  it("repairs bicycle, hat, summer, Canada, and biking run-on output", () => {
    expect(
      correctWithTutorRules(
        "I bought a bicycle yesterday someone's coming and I've been a bike a lot I also buy a hat because it's very sunny in the summer in Canada.",
        "en",
      ),
    ).toMatchObject({
      status: "corrected",
      corrected: "I bought a bicycle yesterday because summer is coming, and I plan to bike a lot. I also bought a hat because it is very sunny in Canada.",
      appliedRuleIds: ["en-hat-biking-summer-runon"],
    });
  });

  it("does not rewrite clear negative biking plans in bicycle and hat sentences", () => {
    const result = correctWithTutorRules(
      "I bought a bicycle yesterday. I also bought a hat because it was sunny. I do not plan to bike a lot this summer in Canada.",
      "en",
    );

    expect(result.appliedRuleIds).not.toContain("en-hat-biking-summer-runon");
    expect(result.corrected).not.toBe(
      "I bought a bicycle yesterday because summer is coming, and I plan to bike a lot. I also bought a hat because it is very sunny in Canada.",
    );
    expect(result.corrected).not.toContain("I plan to bike a lot");
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
});
