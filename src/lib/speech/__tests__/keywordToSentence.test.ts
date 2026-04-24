import { describe, it, expect } from "vitest";

import { keywordToSentence, keywordsToSentences } from "../keywordToSentence";

describe("keywordToSentence", () => {
  it("wraps a single word in 'The word is X.' / 'Từ này là X.'", () => {
    const r = keywordToSentence("pronunciation");
    expect(r).toEqual({
      target_en: "The word is pronunciation.",
      target_vi: "Từ này là pronunciation.",
      keyword: "pronunciation",
    });
  });

  it("strips trailing period from the keyword before wrapping", () => {
    const r = keywordToSentence("hello.");
    expect(r?.target_en).toBe("The word is hello.");
  });

  it("preserves multi-word phrases as-is, adding a final period if missing", () => {
    const r = keywordToSentence("good morning");
    expect(r?.target_en).toBe("good morning.");
    expect(r?.target_vi).toBe("good morning.");
  });

  it("does not double-punctuate a multi-word phrase that already ends with .?!", () => {
    expect(keywordToSentence("How are you?")?.target_en).toBe("How are you?");
    expect(keywordToSentence("Stop the bus!")?.target_en).toBe("Stop the bus!");
    expect(keywordToSentence("That's all.")?.target_en).toBe("That's all.");
  });

  it("strips trailing punctuation from a single-word keyword before wrapping", () => {
    // Single words always go through the carrier-sentence path, even if
    // the source keyword had stray punctuation.
    expect(keywordToSentence("Run!")?.target_en).toBe("The word is Run.");
    expect(keywordToSentence("hello?")?.target_en).toBe("The word is hello.");
  });

  it("returns null for empty / whitespace input", () => {
    expect(keywordToSentence("")).toBeNull();
    expect(keywordToSentence("   ")).toBeNull();
    expect(keywordToSentence("\n")).toBeNull();
  });
});

describe("keywordsToSentences", () => {
  it("maps a list of keywords through keywordToSentence", () => {
    const r = keywordsToSentences(["hello", "world"]);
    expect(r).toHaveLength(2);
    expect(r[0].target_en).toBe("The word is hello.");
    expect(r[1].target_en).toBe("The word is world.");
  });

  it("dedupes case-insensitive duplicates", () => {
    const r = keywordsToSentences(["hello", "Hello", "HELLO"]);
    expect(r).toHaveLength(1);
  });

  it("skips empty / whitespace entries silently", () => {
    const r = keywordsToSentences(["hello", "", "  ", "world"]);
    expect(r.map((c) => c.keyword)).toEqual(["hello", "world"]);
  });

  it("returns [] for non-array / empty input", () => {
    expect(keywordsToSentences([])).toEqual([]);
    // @ts-expect-error — defensive against caller passing junk
    expect(keywordsToSentences(null)).toEqual([]);
    // @ts-expect-error — defensive
    expect(keywordsToSentences(undefined)).toEqual([]);
  });
});
