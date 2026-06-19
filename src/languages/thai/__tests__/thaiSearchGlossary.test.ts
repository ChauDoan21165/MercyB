// src/languages/thai/__tests__/thaiSearchGlossary.test.ts
//
// Structural + behavioral guards for the Thai search glossary / romanization
// index (A9, Wave 3). Pins shape, cross-language searchability, and the
// no-audio / no-scoring scope. Does NOT assert linguistic correctness
// (native review is deferred).

import { describe, it, expect } from "vitest";

import {
  THAI_SEARCH_GLOSSARY,
  searchThaiGlossary,
} from "@/languages/thai/searchGlossary";

const THAI_RANGE = /[฀-๿]/;

describe("Thai search glossary — shape", () => {
  it("has 200–400 searchable entries", () => {
    expect(THAI_SEARCH_GLOSSARY.length).toBeGreaterThanOrEqual(200);
    expect(THAI_SEARCH_GLOSSARY.length).toBeLessThanOrEqual(400);
  });

  it("every entry has Thai script, romanization, VI gloss, EN gloss", () => {
    for (const e of THAI_SEARCH_GLOSSARY) {
      expect(THAI_RANGE.test(e.th), `Thai script: ${e.th}`).toBe(true);
      expect(e.rom.trim().length, `rom ${e.th}`).toBeGreaterThan(0);
      expect(e.vi.trim().length, `vi ${e.th}`).toBeGreaterThan(0);
      expect(e.en.trim().length, `en ${e.th}`).toBeGreaterThan(0);
    }
  });

  it("every entry has at least one alias and one tag", () => {
    for (const e of THAI_SEARCH_GLOSSARY) {
      expect(Array.isArray(e.aliases)).toBe(true);
      expect(e.aliases.length, `aliases ${e.th}`).toBeGreaterThanOrEqual(1);
      for (const a of e.aliases) expect(a.trim().length, `alias in ${e.th}`).toBeGreaterThan(0);
      expect(Array.isArray(e.tags)).toBe(true);
      expect(e.tags.length, `tags ${e.th}`).toBeGreaterThanOrEqual(1);
    }
  });

  it("aliases are lowercased (normalized for search)", () => {
    for (const e of THAI_SEARCH_GLOSSARY) {
      for (const a of e.aliases) {
        expect(a, `alias not lowercased in ${e.th}: ${a}`).toBe(a.toLowerCase());
      }
    }
  });

  it("Thai headwords are unique", () => {
    const seen = new Set<string>();
    for (const e of THAI_SEARCH_GLOSSARY) {
      expect(seen.has(e.th), `duplicate th: ${e.th}`).toBe(false);
      seen.add(e.th);
    }
  });

  it("tone notes, when present, are non-empty and bilingual-ish", () => {
    const withNotes = THAI_SEARCH_GLOSSARY.filter((e) => e.toneNote !== undefined);
    expect(withNotes.length).toBeGreaterThanOrEqual(1); // present where useful
    for (const e of withNotes) {
      expect(e.toneNote!.trim().length).toBeGreaterThan(0);
      // reference both audiences (VI: / EN:)
      expect(e.toneNote!).toMatch(/VI:/);
      expect(e.toneNote!).toMatch(/EN:/);
    }
  });

  it("carries no audio/scoring field on any entry (no-audio scope)", () => {
    const allowed = new Set(["th", "rom", "vi", "en", "aliases", "tags", "toneNote"]);
    for (const e of THAI_SEARCH_GLOSSARY) {
      for (const k of Object.keys(e)) {
        expect(allowed.has(k), `unexpected key "${k}" in ${e.th}`).toBe(true);
      }
    }
  });
});

describe("Thai search glossary — search", () => {
  it("empty query returns nothing", () => {
    expect(searchThaiGlossary("")).toEqual([]);
    expect(searchThaiGlossary("   ")).toEqual([]);
  });

  it("finds by English gloss", () => {
    const hits = searchThaiGlossary("water");
    expect(hits.some((e) => e.th === "น้ำ")).toBe(true);
  });

  it("finds by Vietnamese gloss", () => {
    const hits = searchThaiGlossary("nước");
    expect(hits.some((e) => e.th === "น้ำ")).toBe(true);
  });

  it("finds by romanization", () => {
    const hits = searchThaiGlossary("sawatdi");
    expect(hits.some((e) => e.th === "สวัสดี")).toBe(true);
  });

  it("finds by Thai script", () => {
    const hits = searchThaiGlossary("สวัสดี");
    expect(hits.some((e) => e.th === "สวัสดี")).toBe(true);
  });

  it("is case-insensitive", () => {
    expect(searchThaiGlossary("HELLO").length).toBeGreaterThan(0);
    expect(searchThaiGlossary("hello").length).toBeGreaterThan(0);
  });

  it("matches partial / alias terms", () => {
    // 'thank' should reach ขอบคุณ via the English alias token
    const hits = searchThaiGlossary("thank");
    expect(hits.some((e) => e.th === "ขอบคุณ")).toBe(true);
  });
});
