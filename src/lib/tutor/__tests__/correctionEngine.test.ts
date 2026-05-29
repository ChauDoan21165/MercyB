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
    ["he go to work", "He goes to work."],
    ["she work every day", "She works every day."],
    ["it make sense", "It makes sense."],
  ])("corrects narrow Step 5 subject-verb agreement: %s", (input, expected) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "corrected",
      corrected: expected,
      appliedRuleIds: expect.arrayContaining(["en-step5-subject-verb-agreement"]),
    });
  });

  it.each([
    "he can go to work",
    "she will work tomorrow",
    "it should make sense",
  ])("does not trigger Step 5 subject-verb agreement after modals: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
  });

  it.each([
    "He went to work.",
    "She worked yesterday.",
    "It made sense.",
  ])("does not trigger Step 5 subject-verb agreement on past tense: %s", (input) => {
    expect(correctWithTutorRules(input, "en")).toMatchObject({
      status: "unchanged",
      appliedRuleIds: [],
    });
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

  it("adds question punctuation for simple question forms", () => {
    expect(correctWithTutorRules("what do you usually do in the morning", "en")).toMatchObject({
      status: "corrected",
      corrected: "What do you usually do in the morning?",
    });
  });
});
