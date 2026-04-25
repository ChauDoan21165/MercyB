// src/lib/writing-feedback/__tests__/scoreEssay.test.ts
//
// Tests for the rule-based essay scorer. Pure function — no mocks
// needed. Each block exercises one dimension or one error pattern so
// regressions are easy to localise.

import { describe, it, expect } from "vitest";
import { scoreEssay } from "../scoreEssay";
import { emptyRubric, overallScore, toDimensionScore } from "../rubric";

const SAMPLE_ESSAY = `My favorite hobby is reading books. Every day after work, I sit on the sofa and open a book. Reading helps me relax and learn new things.

For example, last month I read a book about Vietnamese history. I learned many interesting stories about my country. Books also help me improve my English vocabulary.

In conclusion, reading is a wonderful hobby. However, finding time can be difficult. I think everyone should try to read more often.`;

describe("emptyRubric + helpers", () => {
  it("emptyRubric is all zeros", () => {
    const r = emptyRubric();
    expect(r.grammar.score).toBe(0);
    expect(r.vocabulary.score).toBe(0);
    expect(r.structure.score).toBe(0);
    expect(r.spelling_punctuation.score).toBe(0);
    expect(r.coherence.score).toBe(0);
  });

  it("toDimensionScore clamps and rounds", () => {
    expect(toDimensionScore(-1)).toBe(0);
    expect(toDimensionScore(7)).toBe(5);
    expect(toDimensionScore(2.6)).toBe(3);
    expect(toDimensionScore(Number.NaN)).toBe(0);
  });

  it("overallScore averages the five dimensions", () => {
    const r = emptyRubric();
    r.grammar.score = 5;
    r.vocabulary.score = 4;
    r.structure.score = 3;
    r.spelling_punctuation.score = 2;
    r.coherence.score = 1;
    expect(overallScore(r)).toBe(3);
  });
});

describe("scoreEssay — empty / trivial input", () => {
  it("returns the empty rubric for empty string", () => {
    expect(scoreEssay("")).toEqual(emptyRubric());
  });

  it("returns the empty rubric for whitespace only", () => {
    expect(scoreEssay("   \n  \t ")).toEqual(emptyRubric());
  });

  it("very short essay (< 30 tokens) caps grammar at 3", () => {
    const r = scoreEssay("I like to read books. It is fun.");
    expect(r.grammar.score).toBeLessThanOrEqual(3);
  });

  it("very short essay flags vocabulary as too short", () => {
    const r = scoreEssay("Hi.");
    expect(r.vocabulary.score).toBeLessThanOrEqual(1);
    expect(r.vocabulary.notes.join(" ")).toMatch(/quá ngắn/);
  });

  it("very short essay flags coherence as too short", () => {
    const r = scoreEssay("Hi there.");
    expect(r.coherence.notes.join(" ")).toMatch(/quá ngắn/);
  });
});

describe("scoreEssay — grammar L1 detectors", () => {
  it("detects vi_l1_3rd_person_s on 'he go'", () => {
    const r = scoreEssay("My brother is busy. He go to school every day. He always work hard.");
    expect(r.grammar.issues).toContain("vi_l1_3rd_person_s");
  });

  it("detects vi_l1_past_ed on 'yesterday I work'", () => {
    const r = scoreEssay("Yesterday I work very hard. Then I go home late.");
    expect(r.grammar.issues).toContain("vi_l1_past_ed");
  });

  it("detects vi_l1_plural_s on 'two book'", () => {
    const r = scoreEssay("I have two book on my desk. Many friend visited me.");
    expect(r.grammar.issues).toContain("vi_l1_plural_s");
  });

  it("detects vi_l1_missing_be on 'I tired'", () => {
    const r = scoreEssay("After work, I tired. She happy when she sees me.");
    expect(r.grammar.issues).toContain("vi_l1_missing_be");
  });

  it("does NOT flag vi_l1_missing_be when 'am/is/are' is present", () => {
    const r = scoreEssay("After work, I am tired. She is happy when she sees me. We are ready for tomorrow.");
    expect(r.grammar.issues).not.toContain("vi_l1_missing_be");
  });

  it("detects vi_l1_question_no_aux on 'You like coffee?'", () => {
    const r = scoreEssay("You like coffee? I think yes.");
    expect(r.grammar.issues).toContain("vi_l1_question_no_aux");
  });

  it("detects vi_l1_missing_article on 'I have car'", () => {
    const r = scoreEssay("I want apple from the store. He has car.");
    expect(r.grammar.issues).toContain("vi_l1_missing_article");
  });

  it("detects vi_l1_can_no_infinitive on 'can goes'", () => {
    const r = scoreEssay("He can goes to school by himself. She will plays piano tonight.");
    expect(r.grammar.issues).toContain("vi_l1_can_no_infinitive");
  });

  it("detects vi_l1_double_past on 'didn't went'", () => {
    const r = scoreEssay("I didn't went to the party. We did saw the movie last week.");
    expect(r.grammar.issues).toContain("vi_l1_double_past");
  });

  it("detects vi_l1_a_vs_an_vowel on 'a apple'", () => {
    const r = scoreEssay("She gave me a apple. I have a hour to finish.");
    expect(r.grammar.issues).toContain("vi_l1_a_vs_an_vowel");
  });

  it("does NOT flag 'a one' or 'a uniform' (they begin with a consonant sound)", () => {
    const r = scoreEssay("She wore a uniform to work. I have a one-year plan.");
    expect(r.grammar.issues).not.toContain("vi_l1_a_vs_an_vowel");
  });

  it("detects vi_l1_comparative_double on 'more better'", () => {
    const r = scoreEssay("This is more better than yesterday. The car is more bigger now.");
    expect(r.grammar.issues).toContain("vi_l1_comparative_double");
  });

  it("multiple issues: 4+ hits caps grammar at 1", () => {
    const text =
      "He go to work. Yesterday I work hard. I have two book. I tired now. She can goes home.";
    const r = scoreEssay(text);
    expect(r.grammar.issues.length).toBeGreaterThanOrEqual(4);
    expect(r.grammar.score).toBeLessThanOrEqual(1);
  });

  it("clean essay scores grammar 5", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.grammar.score).toBe(5);
    expect(r.grammar.issues).toEqual([]);
  });

  it("issues are deduplicated", () => {
    const text =
      "He go home. She go to school. It go fast. They never go.";
    const r = scoreEssay(text);
    const occurrences = r.grammar.issues.filter((t) => t === "vi_l1_3rd_person_s");
    expect(occurrences.length).toBe(1);
  });
});

describe("scoreEssay — vocabulary dimension", () => {
  it("repetitive essay gets a low variety score", () => {
    const text =
      "I like cat. The cat is good. Cat is good. Cat. Cat. Cat. Cat. Cat is best.";
    const r = scoreEssay(text);
    expect(r.vocabulary.score).toBeLessThanOrEqual(3);
  });

  it("varied essay gets a higher score", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.vocabulary.score).toBeGreaterThanOrEqual(3);
  });

  it("CEFR estimate is in the valid set", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(["A1", "A2", "B1", "B2", "C1", "C2"]).toContain(
      r.vocabulary.level_estimate,
    );
  });

  it("very short essay → A1 estimate", () => {
    const r = scoreEssay("I like food.");
    expect(r.vocabulary.level_estimate).toBe("A1");
  });
});

describe("scoreEssay — structure dimension", () => {
  it("counts paragraphs by blank-line separators", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.structure.paragraph_count).toBe(3);
  });

  it("flags missing intro on a 3-word fragment", () => {
    const r = scoreEssay("Books are fun.");
    expect(r.structure.has_intro).toBe(false);
  });

  it("detects intro when first paragraph has a 6+-word sentence", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.structure.has_intro).toBe(true);
  });

  it("detects conclusion via 'In conclusion'", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.structure.has_conclusion).toBe(true);
  });

  it("missing conclusion when no marker present", () => {
    const text =
      "Reading is great.\n\nBooks teach you many things and help you relax after work.";
    const r = scoreEssay(text);
    expect(r.structure.has_conclusion).toBe(false);
  });

  it("3+ paragraphs + intro + conclusion → high structure score", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.structure.score).toBeGreaterThanOrEqual(4);
  });
});

describe("scoreEssay — spelling + punctuation", () => {
  it("flags 'becouse' as a typo", () => {
    const r = scoreEssay(
      "I love English becouse it is fun. The class is wonderful.",
    );
    expect(r.spelling_punctuation.errors).toContain("becouse");
  });

  it("flags 'tommorow' as a typo", () => {
    const r = scoreEssay("I will study tommorow morning.");
    expect(r.spelling_punctuation.errors).toContain("tommorow");
  });

  it("clean essay → 5", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.spelling_punctuation.score).toBe(5);
    expect(r.spelling_punctuation.errors).toEqual([]);
  });

  it("missing terminal punctuation drops the score", () => {
    const r = scoreEssay("This essay has no terminal punctuation");
    expect(r.spelling_punctuation.score).toBeLessThan(5);
  });

  it("dedupes repeated typos", () => {
    const r = scoreEssay(
      "becouse becouse becouse this is hard.",
    );
    const count = r.spelling_punctuation.errors.filter((e) => e === "becouse").length;
    expect(count).toBe(1);
  });
});

describe("scoreEssay — coherence dimension", () => {
  it("flags zero-transition essay with a note", () => {
    const text =
      "I like sports very much. Sports are good for my health. I run every morning before breakfast. I swim at the local pool on weekends. I play tennis with my friends after school. Tennis is hard but very fun. I work hard at every game I play.";
    const r = scoreEssay(text);
    expect(r.coherence.notes.join(" ")).toMatch(/từ nối/);
  });

  it("rewards essays with multiple transitions", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    expect(r.coherence.score).toBeGreaterThanOrEqual(3);
    expect(r.coherence.notes.some((n) => n.includes("từ nối"))).toBe(true);
  });

  it("warns on very long average sentence length", () => {
    const longSentence =
      "I went to the market and I bought apples and oranges and bananas and rice and chicken and beef and fish and many vegetables and some bread and butter and milk and eggs and cheese and yogurt and jam and honey and tea and coffee and water and juice for my whole family.";
    const r = scoreEssay(longSentence + "\n\n" + longSentence);
    expect(r.coherence.notes.some((n) => n.includes("dài"))).toBe(true);
  });
});

describe("scoreEssay — determinism + idempotency", () => {
  it("same input produces same output", () => {
    const a = scoreEssay(SAMPLE_ESSAY);
    const b = scoreEssay(SAMPLE_ESSAY);
    expect(a).toEqual(b);
  });

  it("trims whitespace identically to the un-trimmed version", () => {
    const a = scoreEssay(SAMPLE_ESSAY);
    const b = scoreEssay(`   \n${SAMPLE_ESSAY}\n  `);
    expect(a).toEqual(b);
  });

  it("sample essay overall score is in [0, 5]", () => {
    const r = scoreEssay(SAMPLE_ESSAY);
    const overall = overallScore(r);
    expect(overall).toBeGreaterThanOrEqual(0);
    expect(overall).toBeLessThanOrEqual(5);
  });
});
