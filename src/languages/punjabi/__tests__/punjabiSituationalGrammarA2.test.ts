// src/languages/punjabi/__tests__/punjabiSituationalGrammarA2.test.ts
//
// Structural guards for Punjabi A2 situational grammar. These verify
// app-consumable learner data only; native review is deferred.

import { describe, expect, it } from "vitest";

import { situationalGrammarA2 } from "@/languages/punjabi/situationalGrammarA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "time",
  "location",
  "postpositions",
  "routine",
  "past_actions",
  "future_actions",
  "polite_questions",
  "errands",
  "appointments",
  "housing",
  "school_work",
] as const;

describe("Punjabi A2 situational grammar — batch shape", () => {
  it("ships a compact useful grammar pack", () => {
    expect(situationalGrammarA2.length).toBeGreaterThanOrEqual(10);
    expect(situationalGrammarA2.length).toBeLessThanOrEqual(18);
  });

  it("covers all required situation topics", () => {
    const present = new Set(situationalGrammarA2.map((card) => card.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics", () => {
    const ids = situationalGrammarA2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of situationalGrammarA2) expect(REQUIRED_TOPICS.includes(card.topic)).toBe(true);
  });
});

describe("Punjabi A2 situational grammar — learner contract", () => {
  it("has bilingual titles, situations, rules, and script awareness", () => {
    for (const card of situationalGrammarA2) {
      expect(nonEmpty(card.title_vi)).toBe(true);
      expect(nonEmpty(card.title_en)).toBe(true);
      expect(nonEmpty(card.situation_vi)).toBe(true);
      expect(nonEmpty(card.situation_en)).toBe(true);
      expect(nonEmpty(card.rule_vi)).toBe(true);
      expect(nonEmpty(card.rule_en)).toBe(true);
      expect(nonEmpty(card.script_awareness_vi)).toBe(true);
      expect(nonEmpty(card.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi examples with romanization and VI/EN grammar notes", () => {
    for (const card of situationalGrammarA2) {
      expect(card.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of card.examples) {
        expect(hasGurmukhi(example.pa)).toBe(true);
        expect(nonEmpty(example.romanization)).toBe(true);
        expect(nonEmpty(example.vi)).toBe(true);
        expect(nonEmpty(example.en)).toBe(true);
        expect(nonEmpty(example.grammar_vi)).toBe(true);
        expect(nonEmpty(example.grammar_en)).toBe(true);
      }
    }
  });

  it("includes common traps and practice prompts", () => {
    for (const card of situationalGrammarA2) {
      expect(card.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(card.practice.prompt_vi)).toBe(true);
      expect(nonEmpty(card.practice.prompt_en)).toBe(true);
      expect(hasGurmukhi(card.practice.answer_pa)).toBe(true);
      expect(nonEmpty(card.practice.answer_romanization)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaCards = situationalGrammarA2.filter((card) => card.canada_practical_vi || card.canada_practical_en);
    expect(canadaCards.length).toBeGreaterThanOrEqual(5);
    for (const card of canadaCards) {
      expect(nonEmpty(card.canada_practical_vi)).toBe(true);
      expect(nonEmpty(card.canada_practical_en)).toBe(true);
    }
  });
});
