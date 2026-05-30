import { describe, expect, it } from "vitest";

import { detectBilingualSaliencePivot } from "@/lib/tutor/bilingualSalienceDetector";

describe("detectBilingualSaliencePivot", () => {
  it("returns ordinary salience for an English evaluative/emotional word", () => {
    expect(detectBilingualSaliencePivot("my wife burned the fish")).toMatchObject({
      signalType: "ordinary_salience",
      matchedText: "burned",
      highStakes: false,
    });
  });

  it("returns ordinary salience for a Vietnamese evaluative word", () => {
    expect(detectBilingualSaliencePivot("my wife rất giỏi")).toMatchObject({
      signalType: "ordinary_salience",
      matchedText: "giỏi",
      highStakes: false,
    });
  });

  it("returns high-stakes salience for scared", () => {
    expect(detectBilingualSaliencePivot("I was scared")).toMatchObject({
      signalType: "high_stakes",
      matchedText: "scared",
      highStakes: true,
    });
  });

  it("returns highStakes true for English family loss", () => {
    expect(detectBilingualSaliencePivot("my father passed away")).toMatchObject({
      signalType: "high_stakes",
      matchedText: "passed away",
      highStakes: true,
    });
  });

  it("returns highStakes true for Vietnamese family loss", () => {
    expect(detectBilingualSaliencePivot("ba tôi mất rồi")).toMatchObject({
      signalType: "high_stakes",
      matchedText: "mất",
      highStakes: true,
    });
  });

  it("returns null for a plain answer", () => {
    expect(detectBilingualSaliencePivot("we ate fish and rice")).toBeNull();
  });

  it.each([
    ["actually no", "actually"],
    ["nhưng", "nhưng"],
  ])("returns contradiction salience for %s", (input, matchedText) => {
    expect(detectBilingualSaliencePivot(input)).toMatchObject({
      signalType: "contradiction",
      matchedText,
      highStakes: false,
    });
  });

  it("prioritizes high-stakes over ordinary salience", () => {
    expect(detectBilingualSaliencePivot("the dinner was fun but my father died")).toMatchObject({
      signalType: "high_stakes",
      matchedText: "died",
      highStakes: true,
    });
  });
});
