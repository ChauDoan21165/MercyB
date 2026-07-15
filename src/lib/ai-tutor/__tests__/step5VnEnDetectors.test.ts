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
      weaknessTag: "vi_l1_profession_article_copula",
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

describe("detectStep5VnEnError — subject-verb agreement", () => {
  it("flags narrow third-person present-simple SVA omissions", () => {
    expect(detect("he go every day", "he goes every day")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_3rd_person_s",
    });
    expect(detect("she work here", "she works here")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_3rd_person_s",
    });
    expect(detect("it make sense", "it makes sense")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_3rd_person_s",
    });
  });

  it("does not flag modal, future, past-time, or question contexts as SVA", () => {
    expect(detect("he can go", "he can go").weaknessTag).not.toBe("vi_l1_3rd_person_s");
    expect(detect("she will work", "she will work").weaknessTag).not.toBe("vi_l1_3rd_person_s");
    expect(detect("he go last Monday", "he went last Monday").weaknessTag).not.toBe("vi_l1_3rd_person_s");
    expect(detect("she work yesterday", "she worked yesterday").weaknessTag).not.toBe("vi_l1_3rd_person_s");
    expect(detect("does he go every day", "does he goes every day").weaknessTag).not.toBe("vi_l1_3rd_person_s");
  });
});

describe("detectStep5VnEnError — preposition transfer", () => {
  it("flags only whitelisted Step 5 preposition patterns", () => {
    expect(detect("I depend of my family", "I depend on my family")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_preposition_transfer",
    });
    expect(detect("She is interested with English", "She is interested in English")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_preposition_transfer",
    });
    expect(detect("He is good in English", "He is good at English")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_preposition_transfer",
    });
    expect(detect("I listen music every day", "I listen to music every day")).toMatchObject({
      matched: true,
      weaknessTag: "vi_l1_preposition_transfer",
    });
  });

  it("does not broadly replace prepositions outside the whitelist", () => {
    expect(detect("I am in Monday", "I am on Monday").weaknessTag).not.toBe("vi_l1_preposition_transfer");
    expect(detect("I am in Hanoi", "I am on Hanoi").matched).toBe(false);
    expect(detect("I wait bus", "I wait for bus").matched).toBe(false);
    expect(detect("I look the board", "I look at the board").matched).toBe(false);
    expect(detect("I listen to music", "I listen to music").matched).toBe(false);
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
