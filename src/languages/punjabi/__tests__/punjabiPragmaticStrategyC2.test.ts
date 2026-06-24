// Punjabi C2 pragmatic strategy guards. These validate app-consumable structure
// and scope, not native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  PRAGMATIC_STRATEGY_C2_DISCLAIMER,
  pragmaticStrategyC2ByFocus,
  pragmaticStrategyC2Entries,
  type PunjabiPragmaticStrategyEntry,
  type PunjabiPragmaticStrategyFocus,
} from "@/languages/punjabi/pragmaticStrategyC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiPragmaticStrategyFocus[] = [
  "indirectness",
  "face_saving",
  "strategic_warmth",
  "respectful_disagreement",
  "changing_topic",
  "calming_conflict",
  "formal_public_communication",
  "community_communication",
];

describe("Punjabi C2 pragmatic strategy — coverage", () => {
  it("ships a compact app-consumable strategy pack", () => {
    expect(pragmaticStrategyC2Entries.length).toBeGreaterThanOrEqual(8);
    expect(pragmaticStrategyC2Entries.length).toBeLessThanOrEqual(14);
  });

  it("covers every required pragmatic focus", () => {
    const seen = new Set(pragmaticStrategyC2Entries.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = pragmaticStrategyC2Entries.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("pragmaticStrategyC2ByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = pragmaticStrategyC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 pragmatic strategy — bilingual integrity", () => {
  it("each entry has VI+EN title, situation, and strategy", () => {
    for (const entry of pragmaticStrategyC2Entries) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.situation_vi.length, `${entry.id} situation_vi`).toBeGreaterThan(0);
      expect(entry.situation_en.length, `${entry.id} situation_en`).toBeGreaterThan(0);
      expect(entry.strategy_vi.length, `${entry.id} strategy_vi`).toBeGreaterThan(0);
      expect(entry.strategy_en.length, `${entry.id} strategy_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const entry of pragmaticStrategyC2Entries) {
      expect(hasGurmukhi(entry.model_gurmukhi), `${entry.id} model_gurmukhi`).toBe(true);
      expect(entry.model_romanization.length, `${entry.id} model_romanization`).toBeGreaterThan(0);
      expect(entry.model_vi.length, `${entry.id} model_vi`).toBeGreaterThan(0);
      expect(entry.model_en.length, `${entry.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each phrase block has Gurmukhi, romanization, VI, and EN", () => {
    for (const entry of pragmaticStrategyC2Entries) {
      expect(entry.phrases.length, `${entry.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of entry.phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${entry.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${entry.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${entry.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${entry.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes common learner traps where useful", () => {
    const withTrap = pragmaticStrategyC2Entries.filter((entry) => entry.learner_trap).length;
    expect(withTrap).toBeGreaterThanOrEqual(5);
  });

  it("includes Canada-practical examples", () => {
    const canadaEntries = pragmaticStrategyC2Entries.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 pragmatic strategy — scope framing", () => {
  it("exposes Gurmukhi-primary, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(PRAGMATIC_STRATEGY_C2_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(PRAGMATIC_STRATEGY_C2_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${PRAGMATIC_STRATEGY_C2_DISCLAIMER.vi} ${PRAGMATIC_STRATEGY_C2_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in entry text", () => {
    const blob = JSON.stringify(pragmaticStrategyC2Entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiPragmaticStrategyEntry[] = pragmaticStrategyC2Entries;
void _typecheck;
