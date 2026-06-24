// Punjabi C2 smoke deck guards. These validate app-consumable structure and
// scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_SMOKE_DECK_DISCLAIMER,
  smokeDeckC2,
  smokeDeckC2ByFocus,
  type PunjabiC2SmokeCard,
  type PunjabiC2SmokeFocus,
} from "@/languages/punjabi/smokeDeckC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2SmokeFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "mediation",
  "deescalation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 smoke deck — coverage", () => {
  it("ships a compact app-consumable smoke deck", () => {
    expect(smokeDeckC2.length).toBeGreaterThanOrEqual(10);
    expect(smokeDeckC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 smoke focus", () => {
    const seen = new Set(smokeDeckC2.map((card) => card.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = smokeDeckC2.map((card) => card.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("smokeDeckC2ByFocus returns only matching cards", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = smokeDeckC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((card) => card.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 smoke deck — bilingual integrity", () => {
  it("each card has VI+EN scenario and prompt", () => {
    for (const card of smokeDeckC2) {
      expect(card.title_vi.length, `${card.id} title_vi`).toBeGreaterThan(0);
      expect(card.title_en.length, `${card.id} title_en`).toBeGreaterThan(0);
      expect(card.scenario_vi.length, `${card.id} scenario_vi`).toBeGreaterThan(0);
      expect(card.scenario_en.length, `${card.id} scenario_en`).toBeGreaterThan(0);
      expect(card.prompt_vi.length, `${card.id} prompt_vi`).toBeGreaterThan(0);
      expect(card.prompt_en.length, `${card.id} prompt_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const card of smokeDeckC2) {
      expect(hasGurmukhi(card.model_gurmukhi), `${card.id} model_gurmukhi`).toBe(true);
      expect(card.model_romanization.length, `${card.id} model_romanization`).toBeGreaterThan(0);
      expect(card.model_vi.length, `${card.id} model_vi`).toBeGreaterThan(0);
      expect(card.model_en.length, `${card.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each quick phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const card of smokeDeckC2) {
      expect(card.quick_phrases.length, `${card.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of card.quick_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${card.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${card.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${card.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${card.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes smoke-check, final-QA, and integration-readiness style items", () => {
    const modes = new Set(smokeDeckC2.map((card) => card.mode));
    expect(modes.has("smoke_check")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
    expect(modes.has("integration_readiness")).toBe(true);
    for (const card of smokeDeckC2) {
      expect(card.expected.must_include_vi.length, `${card.id} expected vi`).toBeGreaterThan(0);
      expect(card.expected.must_include_en.length, `${card.id} expected en`).toBeGreaterThan(0);
      expect(card.expected.avoid_vi.length, `${card.id} avoid vi`).toBeGreaterThan(0);
      expect(card.expected.avoid_en.length, `${card.id} avoid en`).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(smokeDeckC2.filter((card) => card.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaCards = smokeDeckC2.filter((card) => card.canada_practical);
    expect(canadaCards.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaCards).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 smoke deck — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_SMOKE_DECK_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_SMOKE_DECK_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_SMOKE_DECK_DISCLAIMER.vi} ${C2_SMOKE_DECK_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in cards", () => {
    const blob = JSON.stringify(smokeDeckC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2SmokeCard[] = smokeDeckC2;
void _typecheck;
