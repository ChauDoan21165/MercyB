// src/languages/punjabi/__tests__/punjabiSearchGlossary.test.ts
//
// Structural guards for Punjabi search glossary / romanization index.
// Native review is deferred; these are data-shape and search-behavior checks.

import { describe, expect, it } from "vitest";

import {
  findPunjabiSearchEntries,
  PUNJABI_SEARCH_GLOSSARY,
  PUNJABI_SEARCH_SCRIPT_AWARENESS,
} from "@/languages/punjabi/searchGlossary";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;

describe("Punjabi search glossary", () => {
  it("has 200-400 compact searchable entries", () => {
    expect(PUNJABI_SEARCH_GLOSSARY.length).toBeGreaterThanOrEqual(200);
    expect(PUNJABI_SEARCH_GLOSSARY.length).toBeLessThanOrEqual(400);
  });

  it("uses Gurmukhi primary plus romanization, Vietnamese, and English glosses", () => {
    for (const entry of PUNJABI_SEARCH_GLOSSARY) {
      expect(GURMUKHI_RANGE.test(entry.gurmukhi), `Gurmukhi for ${entry.id}`).toBe(true);
      expect(entry.romanization.trim().length, `romanization for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.vi.trim().length, `vi for ${entry.id}`).toBeGreaterThan(0);
      expect(entry.en.trim().length, `en for ${entry.id}`).toBeGreaterThan(0);
    }
  });

  it("includes aliases and topic tags for every entry", () => {
    for (const entry of PUNJABI_SEARCH_GLOSSARY) {
      expect(entry.aliases.length, `aliases for ${entry.id}`).toBeGreaterThanOrEqual(3);
      expect(entry.aliases).toContain(entry.gurmukhi);
      expect(entry.aliases).toContain(entry.romanization);
      expect(entry.topicTags).toContain("punjabi");
      expect(entry.topicTags).toContain("gurmukhi");
    }
  });

  it("keeps search ids and Gurmukhi headwords unique", () => {
    const ids = new Set<string>();
    const headwords = new Set<string>();
    for (const entry of PUNJABI_SEARCH_GLOSSARY) {
      expect(ids.has(entry.id), `duplicate id: ${entry.id}`).toBe(false);
      expect(headwords.has(entry.gurmukhi), `duplicate headword: ${entry.gurmukhi}`).toBe(false);
      ids.add(entry.id);
      headwords.add(entry.gurmukhi);
    }
  });

  it("finds entries by English, Vietnamese, romanization, and Gurmukhi", () => {
    expect(findPunjabiSearchEntries("water").some((entry) => entry.gurmukhi === "ਪਾਣੀ")).toBe(true);
    expect(findPunjabiSearchEntries("nuoc").some((entry) => entry.gurmukhi === "ਪਾਣੀ")).toBe(true);
    expect(findPunjabiSearchEntries("pani").some((entry) => entry.gurmukhi === "ਪਾਣੀ")).toBe(true);
    expect(findPunjabiSearchEntries("ਪਾਣੀ").some((entry) => entry.gurmukhi === "ਪਾਣੀ")).toBe(true);
  });

  it("adds script-awareness notes where useful without audio scoring", () => {
    const noted = PUNJABI_SEARCH_GLOSSARY.filter((entry) => entry.scriptAwarenessNote);
    expect(noted.length).toBeGreaterThanOrEqual(4);
    const blob = [
      PUNJABI_SEARCH_SCRIPT_AWARENESS.vi,
      PUNJABI_SEARCH_SCRIPT_AWARENESS.en,
      ...noted.flatMap((entry) => [entry.scriptAwarenessNote?.vi ?? "", entry.scriptAwarenessNote?.en ?? ""]),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/romanization/);
    expect(blob).toMatch(/no pronunciation scoring|không phải chấm phát âm/);
  });

  it("keeps Shahmukhi as awareness only, not a full course", () => {
    const blob = `${PUNJABI_SEARCH_SCRIPT_AWARENESS.vi} ${PUNJABI_SEARCH_SCRIPT_AWARENESS.en}`.toLowerCase();
    expect(blob).toMatch(/shahmukhi/);
    expect(blob).toMatch(/not as a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
  });
});
