// src/languages/punjabi/__tests__/punjabiInteractionRepairA2.test.ts
//
// Structural guards for Punjabi A2 interaction-repair data. These verify
// app-consumable learner content only; native review is deferred.

import { describe, expect, it } from "vitest";

import { interactionRepairA2 } from "@/languages/punjabi/interactionRepairA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "ask_repetition",
  "ask_slower",
  "clarify_meaning",
  "correct_misunderstanding",
  "confirm_details",
  "appointments",
  "transport",
  "housing",
  "school_confusion",
  "workplace_confusion",
] as const;

describe("Punjabi A2 interaction repair — batch shape", () => {
  it("ships a compact useful repair pack", () => {
    expect(interactionRepairA2.length).toBeGreaterThanOrEqual(10);
    expect(interactionRepairA2.length).toBeLessThanOrEqual(18);
  });

  it("covers all required repair topics", () => {
    const present = new Set(interactionRepairA2.map((card) => card.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics", () => {
    const ids = interactionRepairA2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of interactionRepairA2) expect(REQUIRED_TOPICS.includes(card.topic)).toBe(true);
  });
});

describe("Punjabi A2 interaction repair — learner contract", () => {
  it("has bilingual titles, situations, strategies, and script awareness", () => {
    for (const card of interactionRepairA2) {
      expect(nonEmpty(card.title_vi)).toBe(true);
      expect(nonEmpty(card.title_en)).toBe(true);
      expect(nonEmpty(card.situation_vi)).toBe(true);
      expect(nonEmpty(card.situation_en)).toBe(true);
      expect(nonEmpty(card.strategy_vi)).toBe(true);
      expect(nonEmpty(card.strategy_en)).toBe(true);
      expect(nonEmpty(card.script_awareness_vi)).toBe(true);
      expect(nonEmpty(card.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi repair phrases with romanization and bilingual guidance", () => {
    for (const card of interactionRepairA2) {
      expect(card.phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of card.phrases) {
        expect(hasGurmukhi(phrase.pa)).toBe(true);
        expect(nonEmpty(phrase.romanization)).toBe(true);
        expect(nonEmpty(phrase.vi)).toBe(true);
        expect(nonEmpty(phrase.en)).toBe(true);
        expect(nonEmpty(phrase.when_vi)).toBe(true);
        expect(nonEmpty(phrase.when_en)).toBe(true);
      }
    }
  });

  it("includes common traps and mini dialogues", () => {
    for (const card of interactionRepairA2) {
      expect(card.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(hasGurmukhi(card.mini_dialogue.a_pa)).toBe(true);
      expect(nonEmpty(card.mini_dialogue.a_romanization)).toBe(true);
      expect(hasGurmukhi(card.mini_dialogue.b_pa)).toBe(true);
      expect(nonEmpty(card.mini_dialogue.b_romanization)).toBe(true);
      expect(nonEmpty(card.mini_dialogue.vi)).toBe(true);
      expect(nonEmpty(card.mini_dialogue.en)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaCards = interactionRepairA2.filter((card) => card.canada_practical_vi || card.canada_practical_en);
    expect(canadaCards.length).toBeGreaterThanOrEqual(5);
    for (const card of canadaCards) {
      expect(nonEmpty(card.canada_practical_vi)).toBe(true);
      expect(nonEmpty(card.canada_practical_en)).toBe(true);
    }
  });
});
