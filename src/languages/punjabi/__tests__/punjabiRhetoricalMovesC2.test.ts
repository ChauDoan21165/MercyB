// Punjabi C2 rhetorical moves guards. These validate structure and scope, not
// native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  RHETORICAL_MOVES_C2_DISCLAIMER,
  rhetoricalMovesC2ByFocus,
  rhetoricalMovesC2Entries,
  type PunjabiRhetoricalMoveEntry,
  type PunjabiRhetoricalMoveFocus,
} from "@/languages/punjabi/rhetoricalMovesC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiRhetoricalMoveFocus[] = [
  "framing",
  "concession",
  "reframing",
  "softening",
  "careful_intensifying",
  "audience_awareness",
  "community_speech",
  "persuasive_respectful_sequence",
];

describe("Punjabi C2 rhetorical moves — coverage", () => {
  it("ships a compact app-consumable pack", () => {
    expect(rhetoricalMovesC2Entries.length).toBeGreaterThanOrEqual(8);
    expect(rhetoricalMovesC2Entries.length).toBeLessThanOrEqual(14);
  });

  it("covers every required rhetorical move focus", () => {
    const seen = new Set(rhetoricalMovesC2Entries.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = rhetoricalMovesC2Entries.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("rhetoricalMovesC2ByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = rhetoricalMovesC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 rhetorical moves — bilingual integrity", () => {
  it("each entry has VI+EN title, purpose, and rhetorical pattern", () => {
    for (const entry of rhetoricalMovesC2Entries) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.purpose_vi.length, `${entry.id} purpose_vi`).toBeGreaterThan(0);
      expect(entry.purpose_en.length, `${entry.id} purpose_en`).toBeGreaterThan(0);
      expect(entry.rhetorical_pattern_vi.length, `${entry.id} pattern_vi`).toBeGreaterThan(0);
      expect(entry.rhetorical_pattern_en.length, `${entry.id} pattern_en`).toBeGreaterThan(0);
    }
  });

  it("each entry has a Gurmukhi example with romanization and VI+EN rendering", () => {
    for (const entry of rhetoricalMovesC2Entries) {
      expect(hasGurmukhi(entry.example_gurmukhi), `${entry.id} example_gurmukhi`).toBe(true);
      expect(entry.example_romanization.length, `${entry.id} example_romanization`).toBeGreaterThan(0);
      expect(entry.example_vi.length, `${entry.id} example_vi`).toBeGreaterThan(0);
      expect(entry.example_en.length, `${entry.id} example_en`).toBeGreaterThan(0);
    }
  });

  it("each phrase block has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const entry of rhetoricalMovesC2Entries) {
      expect(entry.phrases.length, `${entry.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps where useful", () => {
    const withTrap = rhetoricalMovesC2Entries.filter((entry) => entry.learner_trap).length;
    expect(withTrap).toBeGreaterThanOrEqual(5);
  });

  it("includes Canada-practical examples", () => {
    const canadaEntries = rhetoricalMovesC2Entries.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 rhetorical moves — scope framing", () => {
  it("exposes Gurmukhi-primary, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(RHETORICAL_MOVES_C2_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(RHETORICAL_MOVES_C2_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${RHETORICAL_MOVES_C2_DISCLAIMER.vi} ${RHETORICAL_MOVES_C2_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in entry text", () => {
    const blob = JSON.stringify(rhetoricalMovesC2Entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiRhetoricalMoveEntry[] = rhetoricalMovesC2Entries;
void _typecheck;
