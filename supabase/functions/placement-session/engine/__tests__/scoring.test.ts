// supabase/functions/placement-session/engine/__tests__/scoring.test.ts
//
// Golden tests for PR 8 scoring — the single Response→ScoredItem mapping.
// Asserts the two locked policies exactly: decision #3 (writing_sample /
// null-correct → excluded from θ) and the L1-revealed discount (a
// crutch-assisted correct scores u=0). vitest owns this file (excluded
// from tsconfig.functions.json — same split as the rest).

import { describe, expect, it } from "vitest";

import { buildItemBank } from "../itemBank";
import { scoreResponse, toScoredItems } from "../scoring";
import type { Item, ItemType, Response } from "../../types";

const META: Item["meta"] = {
  author: "t",
  cefrDescriptor: "x",
  paramSource: "expert",
  displayPreference: "en_first",
};

function mkItem(
  id: string,
  type: ItemType,
  over: Partial<Item> = {},
): Item {
  const base: Item = {
    id,
    type,
    cefr: "B1",
    difficulty: 0.5,
    discrimination: 1.25,
    skill: type === "writing_sample" ? "writing" : type,
    prompt: { en: "Q?", vi: "Câu?" },
    options: [
      { id: "a", en: "x", vi: "x" },
      { id: "b", en: "y", vi: "y" },
    ],
    correctOptionId: "a",
    meta: META,
    ...over,
  };
  if (type === "reading") base.passage = { en: "p", vi: "p" };
  if (type === "listening") {
    base.audio = { key: "k.mp3", replayLimit: 1 };
    base.transcript = { en: "t", vi: "t" };
  }
  return base;
}

function mkResp(itemId: string, over: Partial<Response> = {}): Response {
  return {
    itemId,
    correct: true,
    responseMs: 4000,
    timedOut: false,
    l1RevealedUsed: false,
    shownAt: "2026-05-18T10:00:00.000Z",
    answeredAt: "2026-05-18T10:00:04.000Z",
    ...over,
  };
}

describe("scoreResponse — decision #3 (writing_sample / null-correct)", () => {
  it("writing_sample item → null (never enters θ)", () => {
    const ws = mkItem("ws1", "writing_sample", { correctOptionId: undefined });
    expect(scoreResponse(ws, mkResp("ws1", { correct: null }))).toBeNull();
  });

  it("correct === null on ANY type → null (sentinel belt-and-braces)", () => {
    const rd = mkItem("rd1", "reading");
    expect(scoreResponse(rd, mkResp("rd1", { correct: null }))).toBeNull();
  });
});

describe("scoreResponse — dichotomous score + L1-revealed discount", () => {
  const item = mkItem("rd1", "reading", {
    discrimination: 1.7,
    difficulty: -0.4,
  });

  it("clean correct (no crutch) → u=1, a/b from the item", () => {
    expect(scoreResponse(item, mkResp("rd1"))).toEqual({
      a: 1.7,
      b: -0.4,
      u: 1,
    });
  });

  it("correct WITH the L1 crutch → discounted to u=0", () => {
    const s = scoreResponse(item, mkResp("rd1", { l1RevealedUsed: true }));
    expect(s).toEqual({ a: 1.7, b: -0.4, u: 0 });
  });

  it("incorrect → u=0 (crutch irrelevant either way)", () => {
    expect(scoreResponse(item, mkResp("rd1", { correct: false }))).toEqual({
      a: 1.7,
      b: -0.4,
      u: 0,
    });
    expect(
      scoreResponse(
        item,
        mkResp("rd1", { correct: false, l1RevealedUsed: true }),
      ),
    ).toEqual({ a: 1.7, b: -0.4, u: 0 });
  });
});

describe("toScoredItems — the session→kernel bridge", () => {
  const bank = buildItemBank(
    [
      mkItem("rd1", "reading", { discrimination: 1, difficulty: 0 }),
      mkItem("gr1", "grammar", { discrimination: 2, difficulty: 1 }),
      mkItem("ws1", "writing_sample", { correctOptionId: undefined }),
    ],
    "bank.score.1",
  ).bank;

  it("drops writing_sample, null-correct, and unknown ids; preserves order; applies the discount", () => {
    const administered: Response[] = [
      mkResp("rd1", { correct: true }), // → u=1
      mkResp("ws1", { correct: null }), // decision #3 → dropped
      mkResp("zzz", { correct: true }), // not in bank → dropped
      mkResp("gr1", { correct: true, l1RevealedUsed: true }), // discount → u=0
    ];
    expect(toScoredItems(bank, administered)).toEqual([
      { a: 1, b: 0, u: 1 },
      { a: 2, b: 1, u: 0 },
    ]);
  });

  it("empty log → []", () => {
    expect(toScoredItems(bank, [])).toEqual([]);
  });
});
