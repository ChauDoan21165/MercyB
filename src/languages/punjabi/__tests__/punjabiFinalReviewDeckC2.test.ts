// Punjabi C2 final review deck guards. These validate app-consumable structure
// and scope, not certification, official placement, or native-level authority.

import { describe, expect, it } from "vitest";

import {
  C2_FINAL_REVIEW_DECK_DISCLAIMER,
  finalReviewDeckC2,
  finalReviewDeckC2ByFocus,
  type PunjabiC2FinalReviewCard,
  type PunjabiC2FinalReviewFocus,
} from "@/languages/punjabi/finalReviewDeckC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2FinalReviewFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "deescalation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 final review deck — coverage", () => {
  it("ships a compact app-consumable final review deck", () => {
    expect(finalReviewDeckC2.length).toBeGreaterThanOrEqual(9);
    expect(finalReviewDeckC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 review focus", () => {
    const seen = new Set(finalReviewDeckC2.map((card) => card.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = finalReviewDeckC2.map((card) => card.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("finalReviewDeckC2ByFocus returns only matching cards", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = finalReviewDeckC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((card) => card.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 final review deck — bilingual integrity", () => {
  it("each card has VI+EN prompt, question, and title", () => {
    for (const card of finalReviewDeckC2) {
      expect(card.title_vi.length, `${card.id} title_vi`).toBeGreaterThan(0);
      expect(card.title_en.length, `${card.id} title_en`).toBeGreaterThan(0);
      expect(card.prompt_vi.length, `${card.id} prompt_vi`).toBeGreaterThan(0);
      expect(card.prompt_en.length, `${card.id} prompt_en`).toBeGreaterThan(0);
      expect(card.question_vi.length, `${card.id} question_vi`).toBeGreaterThan(0);
      expect(card.question_en.length, `${card.id} question_en`).toBeGreaterThan(0);
    }
  });

  it("each answer has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const card of finalReviewDeckC2) {
      expect(hasGurmukhi(card.answer_gurmukhi), `${card.id} answer_gurmukhi`).toBe(true);
      expect(card.answer_romanization.length, `${card.id} answer_romanization`).toBeGreaterThan(0);
      expect(card.answer_vi.length, `${card.id} answer_vi`).toBeGreaterThan(0);
      expect(card.answer_en.length, `${card.id} answer_en`).toBeGreaterThan(0);
    }
  });

  it("each useful phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const card of finalReviewDeckC2) {
      expect(card.useful_phrases.length, `${card.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of card.useful_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${card.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${card.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${card.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${card.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes final-review QA and checkpoint style items", () => {
    const modes = new Set(finalReviewDeckC2.map((card) => card.mode));
    expect(modes.has("qa")).toBe(true);
    expect(modes.has("checkpoint")).toBe(true);
    expect(modes.has("rewrite")).toBe(true);
    for (const card of finalReviewDeckC2) {
      expect(card.checkpoints.length, `${card.id} checkpoints`).toBeGreaterThanOrEqual(1);
    }
  });

  it("includes common learner traps and Canada-practical examples where useful", () => {
    expect(finalReviewDeckC2.filter((card) => card.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaCards = finalReviewDeckC2.filter((card) => card.canada_practical);
    expect(canadaCards.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaCards).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 final review deck — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_FINAL_REVIEW_DECK_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_FINAL_REVIEW_DECK_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_FINAL_REVIEW_DECK_DISCLAIMER.vi} ${C2_FINAL_REVIEW_DECK_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in cards", () => {
    const blob = JSON.stringify(finalReviewDeckC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2FinalReviewCard[] = finalReviewDeckC2;
void _typecheck;
