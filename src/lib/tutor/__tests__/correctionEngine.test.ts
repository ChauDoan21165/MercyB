import { describe, expect, it } from "vitest";
import {
  AI_CORRECTION_REQUIRED_MESSAGE,
  correctWithTutorRules,
  validateCorrectionChangedWhenNeeded,
} from "@/lib/tutor/correctionEngine";

describe("correctionEngine", () => {
  it.each([
    ["I buy a hat yesterday.", "I bought a hat yesterday."],
    ["i buy a hat yesterday", "I bought a hat yesterday."],
    ["She go to school every day.", "She goes to school every day."],
    ["He eat rice yesterday.", "He ate rice yesterday."],
    ["He have a test yesterday.", "He had a test yesterday."],
    ["I have lunch yesterday.", "I had lunch yesterday."],
    ["I do homework yesterday.", "I did homework yesterday."],
    ["He go to school every day.", "He goes to school every day."],
    ["She eat rice every day.", "She eats rice every day."],
    ["It have food every day.", "It has food every day."],
    ["I bought hat yesterday.", "I bought a hat yesterday."],
    ["She is teacher.", "She is a teacher."],
    ["I have two book.", "I have two books."],
    ["Many student like English.", "Many students like English."],
    ["This book I like.", "I like this book."],
    ["English I study every day.", "I study English every day."],
  ])("corrects beginner English fallback: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
    });
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
    ["I listen music every day", "I listen to music every day."],
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
    "It depends on the weather.",
  ])("does not broadly rewrite prepositions: %s", (input) => {
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
    "She is a teacher.",
    "I have one book.",
    "I have some rice.",
    "This book, I like it.",
  ])("does not over-trigger obvious L4 negative control: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      corrected: expect.any(String),
      appliedRuleIds: [],
    });
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
});
