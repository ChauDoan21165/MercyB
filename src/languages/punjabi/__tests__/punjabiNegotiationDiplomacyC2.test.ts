// Punjabi C2 negotiation/diplomacy guards. These validate app-consumable
// structure and scope, not native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  NEGOTIATION_DIPLOMACY_C2_DISCLAIMER,
  negotiationDiplomacyC2ByFocus,
  negotiationDiplomacyC2Entries,
  type PunjabiNegotiationDiplomacyEntry,
  type PunjabiNegotiationDiplomacyFocus,
} from "@/languages/punjabi/negotiationDiplomacyC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiNegotiationDiplomacyFocus[] = [
  "soften_demands",
  "preserve_respect",
  "reframe_disagreement",
  "propose_compromise",
  "repair_tension",
  "sensitive_workplace",
  "sensitive_community",
  "public_service_topics",
];

describe("Punjabi C2 negotiation/diplomacy — coverage", () => {
  it("ships a compact app-consumable pack", () => {
    expect(negotiationDiplomacyC2Entries.length).toBeGreaterThanOrEqual(8);
    expect(negotiationDiplomacyC2Entries.length).toBeLessThanOrEqual(14);
  });

  it("covers every required focus", () => {
    const seen = new Set(negotiationDiplomacyC2Entries.map((entry) => entry.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = negotiationDiplomacyC2Entries.map((entry) => entry.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("negotiationDiplomacyC2ByFocus returns only matching entries", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = negotiationDiplomacyC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((entry) => entry.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 negotiation/diplomacy — bilingual integrity", () => {
  it("each entry has VI+EN title, scenario, and strategy", () => {
    for (const entry of negotiationDiplomacyC2Entries) {
      expect(entry.title_vi.length, `${entry.id} title_vi`).toBeGreaterThan(0);
      expect(entry.title_en.length, `${entry.id} title_en`).toBeGreaterThan(0);
      expect(entry.scenario_vi.length, `${entry.id} scenario_vi`).toBeGreaterThan(0);
      expect(entry.scenario_en.length, `${entry.id} scenario_en`).toBeGreaterThan(0);
      expect(entry.diplomacy_strategy_vi.length, `${entry.id} strategy_vi`).toBeGreaterThan(0);
      expect(entry.diplomacy_strategy_en.length, `${entry.id} strategy_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const entry of negotiationDiplomacyC2Entries) {
      expect(hasGurmukhi(entry.model_gurmukhi), `${entry.id} model_gurmukhi`).toBe(true);
      expect(entry.model_romanization.length, `${entry.id} model_romanization`).toBeGreaterThan(0);
      expect(entry.model_vi.length, `${entry.id} model_vi`).toBeGreaterThan(0);
      expect(entry.model_en.length, `${entry.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each phrase block has Gurmukhi, romanization, VI, and EN", () => {
    for (const entry of negotiationDiplomacyC2Entries) {
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
    const withTrap = negotiationDiplomacyC2Entries.filter((entry) => entry.learner_trap).length;
    expect(withTrap).toBeGreaterThanOrEqual(5);
  });

  it("includes Canada-practical examples", () => {
    const canadaEntries = negotiationDiplomacyC2Entries.filter((entry) => entry.canada_practical);
    expect(canadaEntries.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaEntries).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 negotiation/diplomacy — scope framing", () => {
  it("exposes Gurmukhi-primary, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(NEGOTIATION_DIPLOMACY_C2_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(NEGOTIATION_DIPLOMACY_C2_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${NEGOTIATION_DIPLOMACY_C2_DISCLAIMER.vi} ${NEGOTIATION_DIPLOMACY_C2_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in entry text", () => {
    const blob = JSON.stringify(negotiationDiplomacyC2Entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiNegotiationDiplomacyEntry[] = negotiationDiplomacyC2Entries;
void _typecheck;
