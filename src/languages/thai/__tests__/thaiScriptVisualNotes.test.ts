// src/languages/thai/__tests__/thaiScriptVisualNotes.test.ts
//
// Structural + integrity guards for the Thai script visual notes. Pins the
// data contract an app layer renders against — count, category coverage
// (similar letters, vowel placement, spacing, signs, tone marks), Thai script
// presence, and bilingual VI + EN explanations — without hard-coding content.
//
// No audio / no pronunciation scoring is implied. Native-speaker review is
// DEFERRED; these tests assert well-formedness only, not linguistic
// correctness.

import { describe, it, expect } from "vitest";

import notes, {
  scriptVisualNotes as named,
  type ThaiVisualNote,
  type ThaiVisualCategory,
} from "@/languages/thai/scriptVisualNotes";

// At least one character in the Thai Unicode block.
const THAI_SCRIPT = /[฀-๿]/;

const REQUIRED_CATEGORIES: ThaiVisualCategory[] = [
  "similar_letters",
  "vowel_placement",
  "spacing",
  "sign",
  "tone_mark",
];

describe("Thai script visual notes — shape", () => {
  it("exports the same array as default and named `scriptVisualNotes`", () => {
    expect(notes).toBe(named);
    expect(Array.isArray(notes)).toBe(true);
  });

  it("contains 40–80 compact notes", () => {
    expect(notes.length).toBeGreaterThanOrEqual(40);
    expect(notes.length).toBeLessThanOrEqual(80);
  });

  it("uses unique ids", () => {
    const ids = notes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required category", () => {
    const counts = new Map<ThaiVisualCategory, number>();
    for (const n of notes) counts.set(n.category, (counts.get(n.category) ?? 0) + 1);
    for (const c of REQUIRED_CATEGORIES) {
      expect(counts.get(c) ?? 0, `category ${c} needs >= 3 notes`).toBeGreaterThanOrEqual(3);
    }
  });
});

describe("Thai script visual notes — per-note integrity", () => {
  it.each(notes.map((n) => [n.id, n] as const))(
    "%s has Thai script + bilingual explanations + a valid category",
    (_id, n: ThaiVisualNote) => {
      expect(REQUIRED_CATEGORIES).toContain(n.category);
      expect(n.script, `${n.id} needs Thai script`).toMatch(THAI_SCRIPT);
      expect(n.rtgs.trim().length).toBeGreaterThan(0);
      expect(n.explanation_vi.trim().length).toBeGreaterThan(0);
      expect(n.explanation_en.trim().length).toBeGreaterThan(0);
    },
  );

  it("optional tips, when present, are bilingual", () => {
    for (const n of notes) {
      if (n.tip_vi || n.tip_en) {
        expect(n.tip_vi && n.tip_vi.trim().length, `${n.id} tip_vi`).toBeGreaterThan(0);
        expect(n.tip_en && n.tip_en.trim().length, `${n.id} tip_en`).toBeGreaterThan(0);
      }
    }
  });

  it("similar_letters notes contrast more than one form", () => {
    // A "confusable" note should reference at least two Thai forms — detected
    // either by a separator (vs / slash) or by multiple Thai runs in `script`.
    for (const n of notes.filter((x) => x.category === "similar_letters")) {
      const thaiRuns = n.script.match(/[฀-๿]+/g) ?? [];
      const hasSeparator = /(vs|\/|–|,)/i.test(n.script);
      expect(
        thaiRuns.length >= 2 || hasSeparator,
        `${n.id} should contrast at least two forms`,
      ).toBe(true);
    }
  });
});
