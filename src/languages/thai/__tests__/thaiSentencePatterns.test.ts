// src/languages/thai/__tests__/thaiSentencePatterns.test.ts
//
// Structural + integrity guards for the Thai sentence-pattern bank. These pin
// the data contract an app layer renders/grades against — counts, topic
// coverage, level weighting (A1–B2 primarily, some C1/C2), Thai script,
// romanization, bilingual VI + EN fields, and the presence of the required
// per-pattern pieces (slots, examples, common mistake) — without hard-coding
// individual content, so the bank can grow within the WAVE3 bounds and stay
// green.
//
// Native-speaker review is DEFERRED; these tests do NOT assert linguistic
// correctness, only well-formedness.

import { describe, it, expect } from "vitest";

import sentencePatterns, {
  sentencePatterns as named,
  type ThaiSentencePattern,
  type ThaiPatternTopic,
  type ThaiCefrLevel,
} from "@/languages/thai/sentencePatterns";

// At least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;
// At least one Latin letter (romanization sanity check).
const LATIN = /[a-zA-Z]/;

const LEVELS: ThaiCefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_TOPICS: ThaiPatternTopic[] = [
  "greeting",
  "want_need",
  "can_cannot",
  "location",
  "time",
  "buying",
  "asking",
  "giving_reason",
  "comparing",
  "polite_request",
  "complaint",
  "opinion",
];

describe("Thai sentence patterns — bank shape", () => {
  it("exports the same array as default and named `sentencePatterns`", () => {
    expect(sentencePatterns).toBe(named);
    expect(Array.isArray(sentencePatterns)).toBe(true);
  });

  it("contains 80–150 compact patterns", () => {
    expect(sentencePatterns.length).toBeGreaterThanOrEqual(80);
    expect(sentencePatterns.length).toBeLessThanOrEqual(150);
  });

  it("uses unique ids", () => {
    const ids = sentencePatterns.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers all required topics", () => {
    const present = new Set(sentencePatterns.map((p) => p.topic));
    for (const t of REQUIRED_TOPICS) {
      expect(present, `missing topic: ${t}`).toContain(t);
    }
  });

  it("is weighted A1–B2 with some C1/C2", () => {
    // All four lower levels present.
    const present = new Set(sentencePatterns.map((p) => p.level));
    for (const lv of ["A1", "A2", "B1", "B2"] as ThaiCefrLevel[]) {
      expect(present, `missing level: ${lv}`).toContain(lv);
    }
    // The lower band is the clear majority.
    const lower = sentencePatterns.filter((p) =>
      (["A1", "A2", "B1", "B2"] as ThaiCefrLevel[]).includes(p.level),
    ).length;
    expect(lower / sentencePatterns.length).toBeGreaterThanOrEqual(0.7);
    // ...and there is at least some advanced (C1/C2) coverage.
    const advanced = sentencePatterns.filter((p) =>
      (["C1", "C2"] as ThaiCefrLevel[]).includes(p.level),
    ).length;
    expect(advanced).toBeGreaterThanOrEqual(1);
  });
});

describe("Thai sentence patterns — per-pattern integrity", () => {
  it.each(sentencePatterns.map((p) => [p.id, p] as const))(
    "%s has a valid level + topic and bilingual meaning/explanation",
    (_id, p: ThaiSentencePattern) => {
      expect(LEVELS).toContain(p.level);
      expect(REQUIRED_TOPICS).toContain(p.topic);
      expect(p.meaning_vi.trim().length).toBeGreaterThan(0);
      expect(p.meaning_en.trim().length).toBeGreaterThan(0);
      expect(p.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(p.explanation_en.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(sentencePatterns.map((p) => [p.id, p] as const))(
    "%s carries Thai script in the frame + romanization",
    (_id, p: ThaiSentencePattern) => {
      expect(p.pattern_th, `${p.id} frame needs Thai script`).toMatch(THAI_SCRIPT);
      expect(p.romanization.trim().length).toBeGreaterThan(0);
    },
  );

  it.each(sentencePatterns.map((p) => [p.id, p] as const))(
    "%s has at least one substitution slot, well-formed",
    (_id, p: ThaiSentencePattern) => {
      expect(p.slots.length).toBeGreaterThanOrEqual(1);
      for (const s of p.slots) {
        expect(s.name.trim().length).toBeGreaterThan(0);
        expect(s.fills_th.length).toBeGreaterThanOrEqual(1);
        expect(s.fills_th.every((f) => THAI_SCRIPT.test(f))).toBe(true);
        expect(s.gloss_vi.trim().length).toBeGreaterThan(0);
        expect(s.gloss_en.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(sentencePatterns.map((p) => [p.id, p] as const))(
    "%s has examples with Thai + romanization + VI + EN",
    (_id, p: ThaiSentencePattern) => {
      expect(p.examples.length).toBeGreaterThanOrEqual(1);
      for (const ex of p.examples) {
        expect(ex.th, `${p.id} example needs Thai script`).toMatch(THAI_SCRIPT);
        expect(ex.rtgs).toMatch(LATIN);
        expect(ex.vi.trim().length).toBeGreaterThan(0);
        expect(ex.en.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it.each(sentencePatterns.map((p) => [p.id, p] as const))(
    "%s documents a common mistake with a bilingual fix",
    (_id, p: ThaiSentencePattern) => {
      expect(p.common_mistake.wrong.trim().length).toBeGreaterThan(0);
      expect(p.common_mistake.fix_vi.trim().length).toBeGreaterThan(0);
      expect(p.common_mistake.fix_en.trim().length).toBeGreaterThan(0);
    },
  );
});
