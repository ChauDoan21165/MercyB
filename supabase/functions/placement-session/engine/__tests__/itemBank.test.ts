// supabase/functions/placement-session/engine/__tests__/itemBank.test.ts
//
// Validation + indexing tests for the in-memory item bank (design §6.1
// "itemBank"). Inline fixtures only — no DB (pure-kernel boundary).
// vitest owns this file (excluded from tsconfig.functions.json).

import { describe, it, expect } from "vitest";

import {
  validateItem,
  buildItemBank,
  itemById,
  itemsByType,
  filterItems,
} from "../itemBank";
import type { Item } from "../../types";

const META: Item["meta"] = {
  author: "test",
  cefrDescriptor: "Can do X (CEFR Companion).",
  paramSource: "expert",
  displayPreference: "en_first",
};

function grammar(id: string, over: Partial<Item> = {}): Item {
  return {
    id,
    type: "grammar",
    cefr: "A2",
    difficulty: -1,
    discrimination: 1.0,
    skill: "grammar",
    prompt: { en: "She ___ to school every day.", vi: "Cô ấy ___ đến trường." },
    options: [
      { id: "a", en: "go", vi: "go" },
      { id: "b", en: "goes", vi: "goes" },
      { id: "c", en: "going", vi: "going" },
    ],
    correctOptionId: "b",
    meta: META,
    ...over,
  };
}
const reading = (id: string): Item => ({
  ...grammar(id),
  type: "reading",
  skill: "reading",
  cefr: "B1",
  difficulty: 0,
  passage: { en: "A short passage.", vi: "Một đoạn văn ngắn." },
});
const listening = (id: string): Item => ({
  ...grammar(id),
  type: "listening",
  skill: "listening",
  audio: { key: "plc/li_a2_01.mp3", replayLimit: 2 },
  transcript: { en: "He goes home.", vi: "Anh ấy về nhà." },
});
const writing = (id: string): Item => ({
  id,
  type: "writing_sample",
  cefr: "B1",
  difficulty: 0,
  discrimination: 1,
  skill: "writing",
  prompt: { en: "Write about your day.", vi: "Viết về một ngày của bạn." },
  meta: META,
});

describe("validateItem — valid items pass", () => {
  it("accepts a well-formed MC grammar item", () => {
    expect(validateItem(grammar("gr_a2_01"))).toEqual({ ok: true, errors: [] });
  });
  it("accepts reading (with passage), listening (audio+transcript), writing (no MC)", () => {
    expect(validateItem(reading("rd_b1_01")).ok).toBe(true);
    expect(validateItem(listening("li_a2_01")).ok).toBe(true);
    expect(validateItem(writing("wr_b1_01")).ok).toBe(true);
  });
});

describe("validateItem — rejects malformed items", () => {
  it("missing id", () => {
    const r = validateItem(grammar("x", { id: "" as unknown as string }));
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.startsWith("id:"))).toBe(true);
  });
  it("discrimination must be > 0 (0 and negative rejected)", () => {
    expect(validateItem(grammar("g", { discrimination: 0 })).ok).toBe(false);
    expect(validateItem(grammar("g", { discrimination: -1.2 })).ok).toBe(false);
  });
  it("non-finite difficulty", () => {
    expect(validateItem(grammar("g", { difficulty: NaN })).ok).toBe(false);
  });
  it("MC missing correctOptionId", () => {
    const r = validateItem(grammar("g", { correctOptionId: undefined }));
    expect(r.errors.some((e) => e.includes("correctOptionId"))).toBe(true);
  });
  it("MC correctOptionId not among options", () => {
    const r = validateItem(grammar("g", { correctOptionId: "zzz" }));
    expect(r.errors.some((e) => e.includes("not among options"))).toBe(true);
  });
  it("duplicate option ids", () => {
    const r = validateItem(
      grammar("g", {
        options: [
          { id: "a", en: "go", vi: "go" },
          { id: "a", en: "goes", vi: "goes" },
        ],
        correctOptionId: "a",
      }),
    );
    expect(r.errors.some((e) => e.includes("duplicate option ids"))).toBe(true);
  });
  it("reading without passage", () => {
    const r = validateItem({ ...reading("r"), passage: undefined });
    expect(r.errors.some((e) => e.startsWith("passage:"))).toBe(true);
  });
  it("listening without audio / without transcript", () => {
    expect(
      validateItem({ ...listening("l"), audio: undefined }).errors.some((e) =>
        e.startsWith("audio:"),
      ),
    ).toBe(true);
    expect(
      validateItem({ ...listening("l"), transcript: undefined }).errors.some(
        (e) => e.startsWith("transcript:"),
      ),
    ).toBe(true);
  });
  it("writing_sample needs NO options/correctOptionId (not IRT-scored)", () => {
    expect(validateItem(writing("wr_b1_02"))).toEqual({ ok: true, errors: [] });
  });
});

describe("buildItemBank — index + reject", () => {
  it("indexes valid items; byId, byType (all 5 keys), version", () => {
    const { bank, rejected } = buildItemBank(
      [grammar("g1"), reading("r1"), listening("l1"), writing("w1")],
      "bank.test.1",
    );
    expect(rejected).toEqual([]);
    expect(bank.version).toBe("bank.test.1");
    expect(bank.items).toHaveLength(4);
    expect(itemById(bank, "r1")?.type).toBe("reading");
    expect(itemById(bank, "nope")).toBeNull();
    expect(Object.keys(bank.byType).sort()).toEqual(
      ["grammar", "listening", "reading", "vocabulary", "writing_sample"].sort(),
    );
    expect(itemsByType(bank, "vocabulary")).toEqual([]); // empty, not undefined
    expect(itemsByType(bank, "grammar").map((i) => i.id)).toEqual(["g1"]);
  });

  it("rejects invalid items but still indexes the valid ones", () => {
    const bad = grammar("bad", { discrimination: 0 });
    const { bank, rejected } = buildItemBank([bad, grammar("ok")], "v");
    expect(bank.items.map((i) => i.id)).toEqual(["ok"]);
    expect(rejected).toHaveLength(1);
    expect(rejected[0].id).toBe("bad");
  });

  it("rejects duplicate ids after the first (no last-wins)", () => {
    const { bank, rejected } = buildItemBank(
      [grammar("dup", { difficulty: -2 }), grammar("dup", { difficulty: 2 })],
      "v",
    );
    expect(bank.items).toHaveLength(1);
    expect(itemById(bank, "dup")?.difficulty).toBe(-2); // first kept
    expect(rejected).toEqual([{ id: "dup", errors: ["duplicate id"] }]);
  });

  it("filterItems is a pure predicate filter", () => {
    const { bank } = buildItemBank(
      [grammar("a2", { difficulty: -1 }), reading("b1")],
      "v",
    );
    expect(filterItems(bank, (i) => i.difficulty < 0).map((i) => i.id)).toEqual([
      "a2",
    ]);
  });
});
