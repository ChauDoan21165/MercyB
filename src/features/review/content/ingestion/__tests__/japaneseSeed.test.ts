// Unit prove-out for the authored vi→ja seed batch + its generation.
//
// Asserts: (1) generateCandidates over the authored items yields
// provenance:"generated" candidates with kana/kanji backs, non-empty romaji
// readings (via wanakana), and namespaced ids; (2) the toVi/fromVi maps are
// internally consistent — every back has a toVi entry, and the authored vi it
// yields round-trips back to the same Japanese through fromVi.

import { describe, it, expect } from "vitest";

import {
  AUTHORED_JA_ITEMS,
  RAW_ITEMS,
  toVi,
  fromVi,
} from "../japaneseSeed.authored";
import { generateCandidates, staticTranslator } from "../../generate";
import { hasJapanese } from "../../validate";

const translator = staticTranslator(toVi, fromVi);

describe("japaneseSeed.authored — toVi/fromVi map consistency", () => {
  it("has a curated A1 batch of ~22 items", () => {
    expect(AUTHORED_JA_ITEMS.length).toBeGreaterThanOrEqual(20);
    expect(RAW_ITEMS.length).toBe(AUTHORED_JA_ITEMS.length);
  });

  it("every back has a toVi entry, and that vi round-trips back via fromVi", () => {
    for (const it of AUTHORED_JA_ITEMS) {
      const vi = toVi.get(it.back);
      expect(vi, `toVi missing for ${it.back}`).toBe(it.vi);
      expect((vi ?? "").trim().length).toBeGreaterThan(0);
      // round-trip closes: authored vi → original Japanese back
      expect(fromVi.get(vi!), `fromVi missing for ${vi}`).toBe(it.back);
    }
  });

  it("RAW_ITEMS carry no pre-authored front (front is GENERATED)", () => {
    for (const raw of RAW_ITEMS) {
      expect(raw.flow).toBe("vi-ja");
      expect(raw.cefr).toBe("A1");
      expect(raw.source).toBe("japanese/lessons+authored-vi");
      expect((raw as { front?: string }).front).toBeUndefined();
      expect(hasJapanese(raw.back)).toBe(true);
    }
  });
});

describe("generateCandidates(authored) — generation provenance + readings", () => {
  it("produces provenance:generated cards with kana/kanji backs and romaji", async () => {
    const cands = await generateCandidates(RAW_ITEMS, { translator });

    expect(cands.length).toBe(RAW_ITEMS.length);
    for (const c of cands) {
      expect(c.provenance).toBe("generated");
      expect(c.flow).toBe("vi-ja");
      // back keeps Japanese script
      expect(hasJapanese(c.back)).toBe(true);
      // front is the authored Vietnamese (generated via toVietnamese), non-empty
      expect(c.front.trim().length).toBeGreaterThan(0);
      expect(hasJapanese(c.front)).toBe(false);
      // romaji reading derived via wanakana — present and Latin
      expect((c.pronunciation ?? "").trim().length).toBeGreaterThan(0);
      expect(/[a-z]/i.test(c.pronunciation ?? "")).toBe(true);
      // namespaced, stable id
      expect(c.id.startsWith("vi-ja:")).toBe(true);
    }
  });

  it("generated front matches the authored toVi gloss", async () => {
    const cands = await generateCandidates(RAW_ITEMS, { translator });
    for (const c of cands) {
      expect(c.front).toBe(toVi.get(c.back));
    }
  });
});
