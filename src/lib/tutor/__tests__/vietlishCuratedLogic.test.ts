import { describe, expect, it } from "vitest";
import {
  VIETLISH_CURATED_PATTERNS,
  buildLongTailLogicFallback,
  findCuratedLogicPattern,
} from "@/lib/tutor/vietlishCuratedLogic";

describe("vietlishCuratedLogic", () => {
  it("ships the curated pattern ids in order", () => {
    expect(VIETLISH_CURATED_PATTERNS.map((pattern) => pattern.id)).toEqual([
      "missing-articles",
      "unmarked-past-tense",
      "plural-s",
      "topic-comment-fronting",
      "preposition-in-on-at",
      "interesting-interested",
      "word-for-word-order",
      "countable-uncountable",
      "mention-about",
      "very-like",
      "discuss-about",
      "say-tell-person",
      "contact-with",
      "research-about",
      "explain-to-me",
      "marry-with",
      "go-home",
      "since-for-duration",
      "age-have-be",
      "double-comparative",
    ]);
  });

  it("matches missing article transfer", () => {
    const pattern = findCuratedLogicPattern("I bought hat yesterday.");

    expect(pattern?.id).toBe("missing-articles");
    expect(pattern?.explanationVi).toContain("Tiếng Việt không dùng mạo từ");
    expect(pattern?.correctExample).toBe("I bought a hat yesterday.");
    expect(pattern?.trapExample).toBe("I bought hat yesterday.");
  });

  it("matches topic-comment fronting", () => {
    expect(findCuratedLogicPattern("This book I like.")?.id).toBe("topic-comment-fronting");
  });

  it("does not force a curated match for unrelated input", () => {
    expect(findCuratedLogicPattern("My project feels ready but strange.")).toBeNull();
  });

  it.each([
    ["mention-about", "She mentioned about the schedule."],
    ["very-like", "I very like this song."],
    ["discuss-about", "We discussed about the plan."],
    ["say-tell-person", "She said me the truth."],
    ["say-tell-person", "Please say me the truth."],
    ["contact-with", "Please contact with the manager."],
    ["research-about", "They researched about the market."],
    ["explain-to-me", "Can you explain me the rule?"],
    ["marry-with", "She married with her classmate."],
    ["go-home", "I went to home after class."],
    ["since-for-duration", "I have lived here since two years."],
    ["age-have-be", "I have 20 years old."],
    ["double-comparative", "This exercise is more easier than the last one."],
  ])("matches new curated pattern %s", (id, input) => {
    expect(findCuratedLogicPattern(input)?.id).toBe(id);
  });

  it.each([
    ["mention-about", "She mentioned the schedule."],
    ["mention-about", "She talked about the schedule."],
    ["very-like", "I really like this song."],
    ["very-like", "I like this song very much."],
    ["discuss-about", "We discussed the plan."],
    ["discuss-about", "We had a discussion about the plan."],
    ["say-tell-person", "She told me the truth."],
    ["say-tell-person", "She said to me that it was true."],
    ["say-tell-person", "I say you understand."],
    ["say-tell-person", "I say you agree."],
    ["say-tell-person", "Say what you mean."],
    ["contact-with", "Please contact the manager."],
    ["contact-with", "Please get in contact with the manager."],
    ["research-about", "They researched the market."],
    ["research-about", "They did research about the market."],
    ["explain-to-me", "Can you explain the rule to me?"],
    ["explain-to-me", "Can you explain to me why this works?"],
    ["marry-with", "She married her classmate."],
    ["marry-with", "She got married to her classmate."],
    ["go-home", "I went home after class."],
    ["go-home", "I went to my home after class."],
    ["since-for-duration", "I have lived here for two years."],
    ["since-for-duration", "She has been here since two years ago."],
    ["age-have-be", "I am 20 years old."],
    ["age-have-be", "I have 20 years of experience."],
    ["double-comparative", "This exercise is easier than the last one."],
    ["double-comparative", "This explanation is more clever than the last one."],
  ])("does not match %s on correct confusable input", (id, input) => {
    const pattern = findCuratedLogicPattern(input);

    expect(pattern?.id).not.toBe(id);
    expect(pattern).toBeNull();
  });

  it("builds the long-tail fallback for unmatched sentences", () => {
    const fallback = buildLongTailLogicFallback("My project feels ready but strange.");

    expect(fallback.explanationVi).toContain("đường dự phòng");
    expect(fallback.memoryAid).toContain("nâng cấp thành thẻ curated");
  });
});
