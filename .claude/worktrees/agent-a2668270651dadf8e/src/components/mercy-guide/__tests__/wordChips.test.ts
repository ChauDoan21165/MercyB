import { describe, expect, it } from "vitest";

import { deriveWordChips } from "../wordChips";

/**
 * Tests for the pure chip derivation. The actual rendering + click
 * handler in MercySpeakTab is verified in the browser; here we lock
 * down the data layer so future regressions to caps, trouble-word
 * priority, or de-duplication trip CI.
 */

describe("deriveWordChips", () => {
  describe("trouble words take priority", () => {
    it("returns trouble words when present, capped to 4 in kids mode", () => {
      const trouble = ["apple", "banana", "cherry", "date", "elderberry"];
      expect(deriveWordChips(trouble, "irrelevant text", true)).toEqual([
        "apple",
        "banana",
        "cherry",
        "date",
      ]);
    });

    it("returns trouble words capped to 8 in adult mode", () => {
      const trouble = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
      expect(deriveWordChips(trouble, "irrelevant", false)).toEqual([
        "a", "b", "c", "d", "e", "f", "g", "h",
      ]);
    });

    it("ignores practiceText entirely when trouble words exist", () => {
      // Even if practice text would yield different chips, trouble words win.
      const trouble = ["focus", "word"];
      const result = deriveWordChips(trouble, "the quick brown fox", false);
      expect(result).toEqual(["focus", "word"]);
    });
  });

  describe("falls back to practice text", () => {
    it("derives chips from practice text when trouble words is empty", () => {
      const result = deriveWordChips([], "Hello world how are you", false);
      expect(result).toEqual(["hello", "world", "how", "are", "you"]);
    });

    it("normalises (lowercase + strip punctuation)", () => {
      const result = deriveWordChips([], "Hello, world! How're you?", false);
      expect(result).toContain("hello");
      expect(result).toContain("world");
      expect(result).toContain("how're".replace("'", ""));
      expect(result).toContain("you");
    });

    it("de-duplicates repeated words", () => {
      const result = deriveWordChips([], "the cat sat on the mat", false);
      // 'the' appears twice in input but should appear once in chips.
      const theCount = result.filter((w) => w === "the").length;
      expect(theCount).toBe(1);
    });

    it("respects the kids cap of 4 even with a long practice line", () => {
      const text = "one two three four five six seven eight nine ten";
      const result = deriveWordChips([], text, true);
      expect(result).toHaveLength(4);
      expect(result).toEqual(["one", "two", "three", "four"]);
    });

    it("respects the adult cap of 8 with a long practice line", () => {
      const text = "one two three four five six seven eight nine ten";
      const result = deriveWordChips([], text, false);
      expect(result).toHaveLength(8);
    });
  });

  describe("empty/edge inputs", () => {
    it("returns [] when practice text is empty and no trouble words", () => {
      expect(deriveWordChips([], "", false)).toEqual([]);
      expect(deriveWordChips([], "", true)).toEqual([]);
    });

    it("returns [] when practice text is whitespace and no trouble words", () => {
      expect(deriveWordChips([], "   \n\t   ", false)).toEqual([]);
    });

    it("returns trouble words even when practice text is empty", () => {
      expect(deriveWordChips(["a", "b"], "", false)).toEqual(["a", "b"]);
    });
  });
});
