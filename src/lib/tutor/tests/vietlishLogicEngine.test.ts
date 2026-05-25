import { describe, expect, it } from "vitest";
import {
  diagnoseVietlishLogic,
  diagnoseVietlishLogicWithMatch,
  getSupportedVietlishLogicPatterns,
} from "@/lib/tutor/vietlishLogicEngine";

describe("vietlishLogicEngine", () => {
  it("explains very before like", () => {
    expect(diagnoseVietlishLogic("I very like English.")).toEqual({
      originalPattern: "I very like English.",
      correctedExample: "I really like English.",
      vietnameseThinking: "Vietnamese can use one intensifier idea before many kinds of words.",
      englishLogic: "Very describes adjectives, but really can strengthen verbs like like.",
      rememberRule: "Use really before verbs; use very before adjectives.",
      retryPrompt: "Write one sentence with really + a verb you like.",
    });
  });

  it("explains missing to before a destination", () => {
    expect(diagnoseVietlishLogic("I go school")).toMatchObject({
      originalPattern: "I go school.",
      correctedExample: "I go to school.",
      englishLogic: "English often needs to for movement toward a place.",
      rememberRule: "Movement verb + to + place.",
    });
  });

  it("explains yesterday with present tense", () => {
    expect(diagnoseVietlishLogic("i buy a hat yesterday")).toMatchObject({
      originalPattern: "I buy a hat yesterday.",
      correctedExample: "I bought a hat yesterday.",
      vietnameseThinking: "Vietnamese can use a time word like yesterday without changing the verb.",
      englishLogic: "Yesterday points to the past, so English changes the verb to past tense.",
      rememberRule: "Past time word + past verb.",
    });
  });

  it("explains interested versus interesting", () => {
    expect(diagnoseVietlishLogic("I am interesting in English.")).toMatchObject({
      originalPattern: "I am interesting in English.",
      correctedExample: "I am interested in English.",
      englishLogic: "Interested describes your feeling; interesting describes the thing.",
      rememberRule: "Use interested for the person who feels it; use interesting for the thing.",
    });
  });

  it("returns a safe beginner fallback for unknown patterns", () => {
    const diagnosis = diagnoseVietlishLogic("My brother want learn more better English.");

    expect(diagnosis.originalPattern).toBe("Unrecognized beginner pattern");
    expect(diagnosis.correctedExample).toMatch(/one clear subject, verb, and time marker/i);
    expect(diagnosis.englishLogic).toMatch(/relationship/);
    expect(diagnosis.retryPrompt).toMatch(/one short sentence/);
  });

  it("marks known and unknown patterns for structured Logic UI", () => {
    expect(diagnoseVietlishLogicWithMatch("I go school")).toMatchObject({
      patternId: "go-school",
      isKnownPattern: true,
      correctedExample: "I go to school.",
    });

    expect(diagnoseVietlishLogicWithMatch("This sentence is not in the beginner list.")).toMatchObject({
      patternId: null,
      isKnownPattern: false,
      fallbackMessage: "Mercy can still explain the English logic. Try a common sentence like: I go school.",
    });
  });

  it("exposes stable supported pattern ids for future lesson planners", () => {
    expect(getSupportedVietlishLogicPatterns()).toEqual([
      "very-like",
      "go-school",
      "yesterday-present",
      "interesting-interested",
    ]);
  });
});
