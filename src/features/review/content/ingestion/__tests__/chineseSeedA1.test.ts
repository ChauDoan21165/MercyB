// Unit prove-out for the authored vi→zh A1 seed batch + its generation.
//
// Asserts: (1) generateCandidates over the authored items yields
// provenance:"generated" candidates with hanzi backs, tone-marked pinyin
// readings (carried from the source), and namespaced ids; (2) the toVi/fromVi
// maps are internally consistent — every back has a toVi entry, and the authored
// vi it yields round-trips back to the same hanzi through fromVi.

import { describe, it, expect } from "vitest";

import {
  AUTHORED_ZH_ITEMS,
  RAW_ITEMS,
  toVi,
  fromVi,
} from "../chineseSeedA1.authored";
import { generateCandidates, staticTranslator } from "../../generate";
import { hasHanzi, pinyinHasTone } from "../../validate";

const translator = staticTranslator(toVi, fromVi);

describe("chineseSeedA1.authored — toVi/fromVi map consistency", () => {
  it("has a curated A1 batch of ~24 items", () => {
    expect(AUTHORED_ZH_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(RAW_ITEMS.length).toBe(AUTHORED_ZH_ITEMS.length);
  });

  it("every back has a toVi entry, and that vi round-trips back via fromVi", () => {
    for (const it of AUTHORED_ZH_ITEMS) {
      const vi = toVi.get(it.back);
      expect(vi, `toVi missing for ${it.back}`).toBe(it.vi);
      expect((vi ?? "").trim().length).toBeGreaterThan(0);
      // round-trip closes: authored vi → original hanzi back
      expect(fromVi.get(vi!), `fromVi missing for ${vi}`).toBe(it.back);
    }
  });

  it("RAW_ITEMS carry no pre-authored front, supply tone-marked pinyin readings", () => {
    for (const raw of RAW_ITEMS) {
      expect(raw.flow).toBe("vi-zh");
      expect(raw.cefr).toBe("A1");
      expect(raw.source).toBe("chinese/lessons-a1+authored-vi");
      expect((raw as { front?: string }).front).toBeUndefined();
      expect(hasHanzi(raw.back)).toBe(true);
      // reading is supplied (no deterministic zh transliterator in the generator)
      expect((raw.reading ?? "").trim().length).toBeGreaterThan(0);
      expect(pinyinHasTone(raw.reading ?? "")).toBe(true);
    }
  });
});

describe("generateCandidates(authored) — generation provenance + readings", () => {
  it("produces provenance:generated cards with hanzi backs and tone-marked pinyin", async () => {
    const cands = await generateCandidates(RAW_ITEMS, { translator });

    expect(cands.length).toBe(RAW_ITEMS.length);
    for (const c of cands) {
      expect(c.provenance).toBe("generated");
      expect(c.flow).toBe("vi-zh");
      // back keeps hanzi
      expect(hasHanzi(c.back)).toBe(true);
      // front is the authored Vietnamese (generated via toVietnamese), non-empty,
      // and carries NO hanzi
      expect(c.front.trim().length).toBeGreaterThan(0);
      expect(hasHanzi(c.front)).toBe(false);
      // pinyin reading present and tone-marked
      expect((c.pronunciation ?? "").trim().length).toBeGreaterThan(0);
      expect(pinyinHasTone(c.pronunciation ?? "")).toBe(true);
      // namespaced, stable id
      expect(c.id.startsWith("vi-zh:")).toBe(true);
    }
  });

  it("generated front matches the authored toVi gloss", async () => {
    const cands = await generateCandidates(RAW_ITEMS, { translator });
    for (const c of cands) {
      expect(c.front).toBe(toVi.get(c.back));
    }
  });
});
