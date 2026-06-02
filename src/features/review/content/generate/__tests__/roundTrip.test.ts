import { describe, it, expect } from "vitest";
import { makeRoundTripChecker, diceSimilarity } from "../roundTrip";
import { staticTranslator } from "../translator";
import type { Translator } from "../translator";
import type { ReviewCandidate } from "../../validate";

function cand(over: Partial<ReviewCandidate> = {}): ReviewCandidate {
  return {
    id: "vi-ja:vocab:x",
    flow: "vi-ja",
    kind: "vocab",
    front: "con mèo",
    back: "ねこ",
    pronunciation: "neko",
    cefr: "A1",
    provenance: "generated",
    source: "japanese/test",
    ...over,
  };
}

describe("diceSimilarity", () => {
  it("identical strings → 1", () => {
    expect(diceSimilarity("ねこ", "ねこ")).toBe(1);
  });
  it("disjoint strings → 0", () => {
    expect(diceSimilarity("ねこ", "いぬ")).toBe(0);
  });
  it("two empty strings → 0 (no signal, never a free pass)", () => {
    expect(diceSimilarity("", "")).toBe(0);
  });
  it("normalizes punctuation/case/whitespace", () => {
    expect(diceSimilarity("Hello, World!", "hello world")).toBe(1);
  });
  it("partial overlap is between 0 and 1", () => {
    const s = diceSimilarity("こんにちは", "こんばんは");
    expect(s).toBeGreaterThan(0);
    expect(s).toBeLessThan(1);
  });
  it("is in [0,1]", () => {
    const s = diceSimilarity("食べる", "飲む");
    expect(s).toBeGreaterThanOrEqual(0);
    expect(s).toBeLessThanOrEqual(1);
  });
});

describe("makeRoundTripChecker", () => {
  it("passes when fromVietnamese recovers back", async () => {
    const t = staticTranslator(
      new Map(),
      new Map([["con mèo", "ねこ"]]),
    );
    const check = makeRoundTripChecker(t);
    const res = await check(cand());
    expect(res.ok).toBe(true);
    expect(res.similarity).toBe(1);
  });

  it("fails (low similarity) when back-translation diverges", async () => {
    const t = staticTranslator(
      new Map(),
      new Map([["con mèo", "いぬ"]]), // dog, not cat
    );
    const check = makeRoundTripChecker(t);
    const res = await check(cand());
    expect(res.similarity).toBe(0);
    expect(res.ok).toBe(false);
  });

  it("honors a custom similarity function", async () => {
    const t: Translator = {
      toVietnamese: async () => "",
      fromVietnamese: async () => "whatever",
    };
    const check = makeRoundTripChecker(t, () => 0.42);
    const res = await check(cand());
    expect(res.similarity).toBe(0.42);
  });

  it("ungoverned flow → similarity 0, not ok", async () => {
    const t: Translator = {
      toVietnamese: async () => "x",
      fromVietnamese: async () => "x",
    };
    const check = makeRoundTripChecker(t);
    // cast to exercise the defensive branch
    const res = await check(cand({ flow: "vi-en" as ReviewCandidate["flow"] }));
    expect(res.ok).toBe(false);
    expect(res.similarity).toBe(0);
  });
});
