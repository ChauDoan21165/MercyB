import { describe, expect, it } from "vitest";

import { detectStep5VnEnError } from "../step5VnEnDetectors";

function detect(userAnswer: string, expectedAnswer: string) {
  return detectStep5VnEnError({ userAnswer, expectedAnswer });
}

describe("detectStep5VnEnError — article omission", () => {
  it("flags narrow concrete/role article omissions", () => {
    expect(detect("I have car", "I have a car")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_missing_article",
    });
    expect(detect("She is teacher", "She is a teacher")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_missing_article",
    });
  });

  it("does not flag abstract, mass, or already-correct article contexts", () => {
    expect(detect("I like music", "I like music").matched).toBe(false);
    expect(detect("I want water", "I want the water").matched).toBe(false);
    expect(detect("I need advice", "I need some advice").matched).toBe(false);
    expect(detect("She is a teacher", "She is a teacher").matched).toBe(false);
  });
});

describe("detectStep5VnEnError — plural -s omission", () => {
  it("flags regular plural omissions after strong number cues", () => {
    expect(detect("two book", "two books")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_plural_s",
    });
    expect(detect("many student", "many students")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_plural_s",
    });
    expect(detect("three friend", "three friends")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_plural_s",
    });
  });

  it("does not flag singular, uncountable, irregular, or already-correct plural contexts", () => {
    expect(detect("one book", "one book").matched).toBe(false);
    expect(detect("many information", "many information").matched).toBe(false);
    expect(detect("many child", "many children").matched).toBe(false);
    expect(detect("two books", "two books").matched).toBe(false);
  });
});

describe("detectStep5VnEnError — existing behavior", () => {
  it("preserves the shipped past-tense omission detector", () => {
    expect(detect("yesterday i walk to school", "yesterday i walked to school")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_past_ed",
    });
  });
});
