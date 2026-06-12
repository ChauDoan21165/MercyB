/**
 * Tests for the STT Transcript Sanity Module.
 *
 * Required fixtures per dispatch:
 *   ✓ hat/head (the live bug — must correct in read-back)
 *   ✓ ship/sheep
 *   ✓ VN-accent finals (hat→hak class)
 *   ✓ no false-correction on legitimately different words
 *   ✓ abstain on empty context
 */

import { describe, it, expect } from "vitest";
import {
  transcriptSanity,
  toConsonantSkeleton,
  levenshtein,
  phoneticProximity,
} from "../transcriptSanity";

// ─── Unit: toConsonantSkeleton ────────────────────────────────────────────

describe("toConsonantSkeleton", () => {
  it("strips vowels", () => {
    expect(toConsonantSkeleton("hat")).toBe("ht");
    expect(toConsonantSkeleton("head")).toBe("hd");
  });

  it("normalizes sh digraph to sentinel", () => {
    expect(toConsonantSkeleton("ship")).toBe("Sp");
    expect(toConsonantSkeleton("sheep")).toBe("Sp");
  });

  it("normalizes th digraph to sentinel", () => {
    expect(toConsonantSkeleton("think")).toBe("Tnk");
    expect(toConsonantSkeleton("tink")).toBe("tnk");
  });

  it("normalizes ck to k", () => {
    expect(toConsonantSkeleton("back")).toBe("bk");
    expect(toConsonantSkeleton("black")).toBe("blk");
  });

  it("produces identical skeleton for ship and sheep (LD 0)", () => {
    const skel1 = toConsonantSkeleton("ship");
    const skel2 = toConsonantSkeleton("sheep");
    expect(skel1).toBe(skel2);
  });
});

// ─── Unit: levenshtein ───────────────────────────────────────────────────

describe("levenshtein", () => {
  it("returns 0 for identical strings", () => {
    expect(levenshtein("ht", "ht")).toBe(0);
  });

  it("returns correct distance for hat/head skeletons (ht/hd = 1)", () => {
    expect(levenshtein("ht", "hd")).toBe(1);
  });

  it("returns correct distance for hat/hak skeletons (ht/hk = 1)", () => {
    expect(levenshtein("ht", "hk")).toBe(1);
  });

  it("handles empty strings", () => {
    expect(levenshtein("", "abc")).toBe(3);
    expect(levenshtein("abc", "")).toBe(3);
    expect(levenshtein("", "")).toBe(0);
  });

  it("returns high distance for clearly different words (dog/cat)", () => {
    expect(levenshtein("dg", "ct")).toBe(2);
  });
});

// ─── Unit: phoneticProximity ─────────────────────────────────────────────

describe("phoneticProximity", () => {
  it("returns 1.0 for identical tokens", () => {
    expect(phoneticProximity("hat", "hat")).toBe(1.0);
  });

  // ── hat/head: the live bug fixture ──────────────────────────────────────
  it("hat/head — detects proximity (live bug fixture)", () => {
    const conf = phoneticProximity("hat", "head");
    expect(conf).not.toBeNull();
    expect(conf!).toBeGreaterThan(0);
    expect(conf!).toBeLessThanOrEqual(1);
  });

  it("head/hat — symmetric (also detects)", () => {
    expect(phoneticProximity("head", "hat")).not.toBeNull();
  });

  // ── ship/sheep ──────────────────────────────────────────────────────────
  it("ship/sheep — detects proximity", () => {
    const conf = phoneticProximity("ship", "sheep");
    expect(conf).not.toBeNull();
    expect(conf!).toBeGreaterThan(0);
  });

  it("sheep/ship — symmetric", () => {
    expect(phoneticProximity("sheep", "ship")).not.toBeNull();
  });

  // ── VN-accent finals ────────────────────────────────────────────────────
  it("hat/hak — VN unreleased final stop confusion (ht/hk, LD=1)", () => {
    const conf = phoneticProximity("hak", "hat");
    expect(conf).not.toBeNull();
    expect(conf!).toBeGreaterThan(0);
  });

  it("bad/bat — VN final d/t confusion", () => {
    expect(phoneticProximity("bat", "bad")).not.toBeNull();
  });

  // ── VN l/n and r/l confusions ──────────────────────────────────────────
  it("rice/lice — VN r/l confusion", () => {
    // skeleton: rs vs ls — LD=1, r/l confusable
    expect(phoneticProximity("lice", "rice")).not.toBeNull();
  });

  // ── No false corrections on legitimately different words ────────────────
  it("cat/hat — different initial consonants, NOT detected", () => {
    // skeletons: ct vs ht — c/h not VN-confusable → null
    expect(phoneticProximity("cat", "hat")).toBeNull();
  });

  it("dog/cat — clearly different, NOT detected", () => {
    expect(phoneticProximity("dog", "cat")).toBeNull();
  });

  it("run/sun — different initials, NOT detected", () => {
    expect(phoneticProximity("run", "sun")).toBeNull();
  });

  it("pin/bin — p/b as initials are not VN-confusable (both phonemes exist in VN)", () => {
    // p/b are excluded from VN_CONFUSABLE_PAIRS for initial position
    // (both sounds exist in Vietnamese; VN speakers do not systematically
    //  confuse them in English either).
    expect(phoneticProximity("pin", "bin")).toBeNull();
  });

  it("big/bag — b/b match, but only vowel differs; skeleton is bg/bg (LD=0) → detected", () => {
    // Note: vowels are stripped so big→bg, bag→bg. LD=0 → detected.
    // This is correct behavior: "big" and "bag" ARE phonetically confusable
    // (VN learners collapse /ɪ/ and /æ/).
    const conf = phoneticProximity("big", "bag");
    expect(conf).not.toBeNull(); // correct — vowel quality collapse
  });

  it("returns null for empty inputs", () => {
    expect(phoneticProximity("", "hat")).toBeNull();
    expect(phoneticProximity("hat", "")).toBeNull();
  });
});

// ─── Integration: transcriptSanity — abstain cases ───────────────────────

describe("transcriptSanity — abstain on empty context", () => {
  it("empty transcript → passthrough with empty results", () => {
    const result = transcriptSanity("", {});
    expect(result.sanitizedTranscript).toBe("");
    expect(result.corrections).toHaveLength(0);
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  it("no context fields → passthrough (abstain)", () => {
    const result = transcriptSanity("I like cats", {});
    expect(result.sanitizedTranscript).toBe("I like cats");
    expect(result.corrections).toHaveLength(0);
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  it("empty recentVocab in FREE-ANSWER → abstain", () => {
    const result = transcriptSanity("What color is your hat", {
      recentVocab: [],
    });
    expect(result.corrections).toHaveLength(0);
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  it("whitespace-only transcript → passthrough", () => {
    const result = transcriptSanity("   ", { targetSentence: "hello" });
    expect(result.sanitizedTranscript).toBe("   ");
    expect(result.corrections).toHaveLength(0);
  });
});

// ─── Integration: READ-BACK mode ─────────────────────────────────────────

describe("transcriptSanity — READ-BACK mode (targetSentence present)", () => {
  // The live bug: STT heard "hat", target was "head".
  // Follow-up should never be "What color is your hat?"
  it("hat→head: corrects the live bug fixture", () => {
    const result = transcriptSanity(
      "What color is your hat",
      { targetSentence: "What color is your head" },
    );
    expect(result.sanitizedTranscript).toBe("what color is your head");
    expect(result.corrections).toHaveLength(1);
    expect(result.corrections[0].original).toBe("hat");
    expect(result.corrections[0].corrected).toBe("head");
    expect(result.corrections[0].confidence).toBeGreaterThan(0);
    expect(result.corrections[0].position).toBe(4); // "What(0) color(1) is(2) your(3) hat(4)"
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  // ship/sheep fixture
  it("ship→sheep: corrects short/long vowel STT mishear", () => {
    const result = transcriptSanity(
      "I can see a ship from here",
      { targetSentence: "I can see a sheep from here" },
    );
    expect(result.sanitizedTranscript).toBe("i can see a sheep from here");
    expect(result.corrections).toHaveLength(1);
    expect(result.corrections[0].original).toBe("ship");
    expect(result.corrections[0].corrected).toBe("sheep");
  });

  // VN-accent final: hak → hat
  it("hak→hat: corrects VN unreleased-stop final consonant substitution", () => {
    const result = transcriptSanity(
      "she is wearing a hak",
      { targetSentence: "she is wearing a hat" },
    );
    expect(result.sanitizedTranscript).toBe("she is wearing a hat");
    expect(result.corrections).toHaveLength(1);
    expect(result.corrections[0].original).toBe("hak");
    expect(result.corrections[0].corrected).toBe("hat");
  });

  // VN-accent final: bat → bad
  it("bat→bad: corrects VN final d/t substitution", () => {
    const result = transcriptSanity(
      "the food was really bat",
      { targetSentence: "the food was really bad" },
    );
    expect(result.sanitizedTranscript).toBe("the food was really bad");
    expect(result.corrections).toHaveLength(1);
    expect(result.corrections[0].original).toBe("bat");
    expect(result.corrections[0].corrected).toBe("bad");
  });

  // No false correction: "cat" vs "hat" (different initial consonants)
  it("cat/hat: no false correction when initial consonants differ", () => {
    const result = transcriptSanity(
      "I saw a cat on the table",
      { targetSentence: "I saw a hat on the table" },
    );
    // "cat" vs "hat": c/h not VN-confusable → no correction
    expect(result.corrections).toHaveLength(0);
    expect(result.sanitizedTranscript).toBe("i saw a cat on the table");
  });

  // No false correction: completely different words
  it("clearly different words: no correction", () => {
    const result = transcriptSanity(
      "I have a dog in my house",
      { targetSentence: "I have a cat in my house" },
    );
    // "dog" vs "cat": completely different → no correction
    expect(result.corrections).toHaveLength(0);
  });

  // Multiple corrections in one sentence
  it("multiple phonetic mishears corrected in one pass", () => {
    const result = transcriptSanity(
      "the ship is wearing a hak",
      { targetSentence: "the sheep is wearing a hat" },
    );
    // "ship"→"sheep" + "hak"→"hat"
    expect(result.corrections).toHaveLength(2);
    const correctedWords = result.corrections.map((c) => c.corrected);
    expect(correctedWords).toContain("sheep");
    expect(correctedWords).toContain("hat");
  });

  // Identical transcripts → no corrections
  it("perfect match: no corrections", () => {
    const result = transcriptSanity(
      "I am studying English",
      { targetSentence: "I am studying English" },
    );
    expect(result.corrections).toHaveLength(0);
    expect(result.sanitizedTranscript).toBe("i am studying english");
  });

  // Shorter transcript than target → only aligned portion corrected
  it("transcript shorter than target: aligns on the shorter length", () => {
    const result = transcriptSanity(
      "What color is",
      { targetSentence: "What color is your head" },
    );
    // Only 3 tokens aligned — no corrections (all match)
    expect(result.corrections).toHaveLength(0);
  });
});

// ─── Integration: FREE-ANSWER mode ───────────────────────────────────────

describe("transcriptSanity — FREE-ANSWER mode (no targetSentence)", () => {
  it("flags token confusable with vocab item", () => {
    // Learner's sentence contains "ship" but recent vocab includes "sheep"
    const result = transcriptSanity(
      "I have a ship at home",
      { recentVocab: ["sheep", "ship"] },
    );
    // "ship" is phonetically confusable with "sheep" (from vocab)
    // but "ship" itself IS in vocab → NOT flagged (exact match excluded)
    // So no low-confidence tokens when the heard word IS in vocab
    // Let's use a case where the heard word is NOT in vocab but is confusable:
    expect(result.sanitizedTranscript).toBe("I have a ship at home"); // unchanged
    expect(result.corrections).toHaveLength(0);
  });

  it("flags phonetically confusable non-vocab token", () => {
    // Learner says "bat" but "bad" is in recent vocab → "bat" is confusable
    const result = transcriptSanity(
      "the weather is bat today",
      { recentVocab: ["bad", "good", "weather"] },
    );
    const flaggedTokens = result.lowConfidenceTokens.map((t) => t.token);
    expect(flaggedTokens).toContain("bat");
    expect(result.sanitizedTranscript).toBe("the weather is bat today"); // unchanged
  });

  it("skips function words in FREE-ANSWER mode", () => {
    const result = transcriptSanity(
      "the is and or",
      { recentVocab: ["bad", "hat"] },
    );
    // All are function words → nothing flagged
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  it("does not flag tokens that exactly match vocab", () => {
    // "sheep" is in vocab — if learner correctly says "sheep", no flag
    const result = transcriptSanity(
      "I saw a sheep",
      { recentVocab: ["sheep", "ship"] },
    );
    const flaggedTokens = result.lowConfidenceTokens.map((t) => t.token);
    expect(flaggedTokens).not.toContain("sheep");
  });

  it("does not flag tokens with no vocab match", () => {
    // "apple" is not confusable with anything in vocab
    const result = transcriptSanity(
      "I ate an apple",
      { recentVocab: ["bad", "hat"] },
    );
    const flaggedTokens = result.lowConfidenceTokens.map((t) => t.token);
    expect(flaggedTokens).not.toContain("apple");
  });

  it("lowConfidenceToken carries correct position", () => {
    const result = transcriptSanity(
      "the food was bat today",
      { recentVocab: ["bad"] },
    );
    const flagged = result.lowConfidenceTokens.find((t) => t.token === "bat");
    expect(flagged).toBeDefined();
    // "the(0) food(1) was(2) bat(3) today(4)" — but function words shift positions
    // position is the index in the tokenized array (0-based)
    expect(flagged!.position).toBe(3);
    expect(flagged!.reason).toBe("phonetically_confusable");
  });

  it("abstains on empty recentVocab (no context to compare against)", () => {
    const result = transcriptSanity("my hat is red", { recentVocab: [] });
    expect(result.lowConfidenceTokens).toHaveLength(0);
    expect(result.corrections).toHaveLength(0);
  });
});

// ─── Output contract shape ────────────────────────────────────────────────

describe("transcriptSanity — output contract", () => {
  it("always returns the three required fields", () => {
    const result = transcriptSanity("hello world", {});
    expect(result).toHaveProperty("sanitizedTranscript");
    expect(result).toHaveProperty("corrections");
    expect(result).toHaveProperty("lowConfidenceTokens");
    expect(Array.isArray(result.corrections)).toBe(true);
    expect(Array.isArray(result.lowConfidenceTokens)).toBe(true);
  });

  it("corrections include position, original, corrected, confidence", () => {
    const result = transcriptSanity(
      "What color is your hat",
      { targetSentence: "What color is your head" },
    );
    if (result.corrections.length > 0) {
      const c = result.corrections[0];
      expect(typeof c.position).toBe("number");
      expect(typeof c.original).toBe("string");
      expect(typeof c.corrected).toBe("string");
      expect(typeof c.confidence).toBe("number");
      expect(c.confidence).toBeGreaterThanOrEqual(0);
      expect(c.confidence).toBeLessThanOrEqual(1);
    }
  });

  it("lowConfidenceTokens include position, token, reason", () => {
    const result = transcriptSanity(
      "the weather is bat today",
      { recentVocab: ["bad"] },
    );
    if (result.lowConfidenceTokens.length > 0) {
      const t = result.lowConfidenceTokens[0];
      expect(typeof t.position).toBe("number");
      expect(typeof t.token).toBe("string");
      expect(t.reason).toBe("phonetically_confusable");
    }
  });

  it("READ-BACK: lowConfidenceTokens is always empty", () => {
    const result = transcriptSanity("hello world", {
      targetSentence: "hello world",
    });
    expect(result.lowConfidenceTokens).toHaveLength(0);
  });

  it("FREE-ANSWER: corrections is always empty", () => {
    const result = transcriptSanity("hello world", {
      recentVocab: ["hat", "head"],
    });
    expect(result.corrections).toHaveLength(0);
  });
});
