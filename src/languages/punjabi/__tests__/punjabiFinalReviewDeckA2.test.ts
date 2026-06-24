// src/languages/punjabi/__tests__/punjabiFinalReviewDeckA2.test.ts
//
// Structural guards for Punjabi A2 final review deck. This is Wave 13 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { finalReviewDeckA2 } from "@/languages/punjabi/finalReviewDeckA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "daily_life",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_descriptions",
  "interaction_repair",
] as const;

const CARD_TYPES = ["checkpoint", "qa", "choose_form", "reading", "roleplay"] as const;

describe("Punjabi A2 final review deck — batch shape", () => {
  it("ships a compact but useful final-review deck", () => {
    expect(finalReviewDeckA2.length).toBeGreaterThanOrEqual(14);
    expect(finalReviewDeckA2.length).toBeLessThanOrEqual(24);
  });

  it("covers all required final-review topics", () => {
    const present = new Set(finalReviewDeckA2.map((card) => card.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics/types", () => {
    const ids = finalReviewDeckA2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of finalReviewDeckA2) {
      expect(REQUIRED_TOPICS.includes(card.topic)).toBe(true);
      expect(CARD_TYPES.includes(card.type)).toBe(true);
    }
  });
});

describe("Punjabi A2 final review deck — learner contract", () => {
  it("uses Gurmukhi answers with romanization and bilingual translations", () => {
    for (const card of finalReviewDeckA2) {
      expect(nonEmpty(card.title_vi)).toBe(true);
      expect(nonEmpty(card.title_en)).toBe(true);
      expect(nonEmpty(card.prompt_vi)).toBe(true);
      expect(nonEmpty(card.prompt_en)).toBe(true);
      expect(hasGurmukhi(card.answer.pa)).toBe(true);
      expect(nonEmpty(card.answer.romanization)).toBe(true);
      expect(nonEmpty(card.answer.vi)).toBe(true);
      expect(nonEmpty(card.answer.en)).toBe(true);
    }
  });

  it("includes bilingual explanations, script awareness, traps, and follow-ups", () => {
    for (const card of finalReviewDeckA2) {
      expect(nonEmpty(card.explanation_vi)).toBe(true);
      expect(nonEmpty(card.explanation_en)).toBe(true);
      expect(nonEmpty(card.script_awareness_vi)).toBe(true);
      expect(nonEmpty(card.script_awareness_en)).toBe(true);
      expect(nonEmpty(card.common_trap_vi)).toBe(true);
      expect(nonEmpty(card.common_trap_en)).toBe(true);
      expect(nonEmpty(card.follow_up_vi)).toBe(true);
      expect(nonEmpty(card.follow_up_en)).toBe(true);
    }
  });

  it("includes final-review/checkpoint/QA style variety", () => {
    const presentTypes = new Set(finalReviewDeckA2.map((card) => card.type));
    expect(presentTypes.has("checkpoint")).toBe(true);
    expect(presentTypes.has("qa")).toBe(true);
    expect(presentTypes.has("choose_form")).toBe(true);
    expect(presentTypes.has("reading")).toBe(true);
    expect(presentTypes.has("roleplay")).toBe(true);
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaCards = finalReviewDeckA2.filter((card) => card.canada_practical_vi || card.canada_practical_en);
    expect(canadaCards.length).toBeGreaterThanOrEqual(7);
    for (const card of canadaCards) {
      expect(nonEmpty(card.canada_practical_vi)).toBe(true);
      expect(nonEmpty(card.canada_practical_en)).toBe(true);
    }
  });
});
