// src/languages/thai/__tests__/thaiBeginnerPhrasebook.test.ts
//
// Structural + integrity guards for the A1–A2 Thai beginner phrasebook.
// Pins the data contract an app layer renders against — count, category
// coverage, Thai script + romanization presence, bilingual VI + EN meanings,
// and well-formed politeness flags — without hard-coding individual content,
// so the phrasebook can grow within the WAVE4 bounds and stay green.
//
// Native-speaker review is DEFERRED; these tests do NOT assert linguistic
// correctness, only well-formedness.

import { describe, it, expect } from "vitest";

import phrasebook, {
  beginnerPhrasebook as named,
  type ThaiPhrase,
  type ThaiPhraseCategory,
} from "@/languages/thai/beginnerPhrasebook";

// At least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;
// At least one Latin letter (romanization sanity check).
const LATIN = /[a-zA-Z]/;
// Politeness particles.
const PARTICLE = /(ครับ|ค่ะ|คะ)/;

const REQUIRED_CATEGORIES: ThaiPhraseCategory[] = [
  "greeting",
  "food",
  "shopping",
  "transport",
  "hotel",
  "help",
  "yes_no",
  "apology",
  "thanks",
  "numbers",
  "directions",
  "time",
];

describe("Thai beginner phrasebook — shape", () => {
  it("exports the same array as default and named `beginnerPhrasebook`", () => {
    expect(phrasebook).toBe(named);
    expect(Array.isArray(phrasebook)).toBe(true);
  });

  it("contains 100–180 compact entries", () => {
    expect(phrasebook.length).toBeGreaterThanOrEqual(100);
    expect(phrasebook.length).toBeLessThanOrEqual(180);
  });

  it("uses unique ids", () => {
    const ids = phrasebook.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required category with a few entries each", () => {
    const counts = new Map<ThaiPhraseCategory, number>();
    for (const p of phrasebook) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    for (const c of REQUIRED_CATEGORIES) {
      expect(counts.get(c) ?? 0, `category ${c} needs >= 3 entries`).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes some entries with politeness particles", () => {
    const polite = phrasebook.filter((p) => p.polite);
    expect(polite.length).toBeGreaterThanOrEqual(5);
  });
});

describe("Thai beginner phrasebook — per-entry integrity", () => {
  it.each(phrasebook.map((p) => [p.id, p] as const))(
    "%s has Thai script + romanization + bilingual meanings",
    (_id, p: ThaiPhrase) => {
      expect(REQUIRED_CATEGORIES).toContain(p.category);
      expect(p.th, `${p.id} needs Thai script`).toMatch(THAI_SCRIPT);
      expect(p.rtgs, `${p.id} needs romanization`).toMatch(LATIN);
      expect(p.vi.trim().length).toBeGreaterThan(0);
      expect(p.en.trim().length).toBeGreaterThan(0);
    },
  );

  it("entries flagged polite actually contain a particle in the Thai", () => {
    for (const p of phrasebook.filter((x) => x.polite)) {
      expect(p.th, `${p.id} is flagged polite but has no particle`).toMatch(PARTICLE);
    }
  });

  it("optional notes, when present, are bilingual", () => {
    for (const p of phrasebook) {
      if (p.note_vi || p.note_en) {
        expect(p.note_vi && p.note_vi.trim().length, `${p.id} note_vi`).toBeGreaterThan(0);
        expect(p.note_en && p.note_en.trim().length, `${p.id} note_en`).toBeGreaterThan(0);
      }
    }
  });
});
