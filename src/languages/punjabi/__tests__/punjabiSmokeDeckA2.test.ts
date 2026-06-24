// src/languages/punjabi/__tests__/punjabiSmokeDeckA2.test.ts
//
// Structural guards for Punjabi A2 smoke deck. This is Wave 19 only, not A11
// integration. These verify app-consumable learner content only; native review
// is deferred.

import { describe, expect, it } from "vitest";

import { smokeDeckA2 } from "@/languages/punjabi/smokeDeckA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "daily_routine",
  "appointment",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_explanation",
  "interaction_repair",
] as const;

const MODES = ["smoke_check", "final_qa", "integration_readiness"] as const;

describe("Punjabi A2 smoke deck — batch shape", () => {
  it("ships one quick check per required scenario", () => {
    expect(smokeDeckA2.length).toBeGreaterThanOrEqual(9);
    expect(smokeDeckA2.length).toBeLessThanOrEqual(14);
  });

  it("covers all required smoke scenarios", () => {
    const present = new Set(smokeDeckA2.map((card) => card.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/modes", () => {
    const ids = smokeDeckA2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of smokeDeckA2) {
      expect(REQUIRED_SCENARIOS.includes(card.scenario)).toBe(true);
      expect(MODES.includes(card.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 smoke deck — learner contract", () => {
  it("uses Gurmukhi answers with romanization and bilingual explanations", () => {
    for (const card of smokeDeckA2) {
      expect(nonEmpty(card.title_vi)).toBe(true);
      expect(nonEmpty(card.title_en)).toBe(true);
      expect(nonEmpty(card.prompt_vi)).toBe(true);
      expect(nonEmpty(card.prompt_en)).toBe(true);
      expect(hasGurmukhi(card.answer.pa)).toBe(true);
      expect(nonEmpty(card.answer.romanization)).toBe(true);
      expect(nonEmpty(card.answer.vi)).toBe(true);
      expect(nonEmpty(card.answer.en)).toBe(true);
      expect(nonEmpty(card.explanation_vi)).toBe(true);
      expect(nonEmpty(card.explanation_en)).toBe(true);
    }
  });

  it("includes script awareness, traps, pass signals, and retry hints", () => {
    for (const card of smokeDeckA2) {
      expect(nonEmpty(card.script_awareness_vi)).toBe(true);
      expect(nonEmpty(card.script_awareness_en)).toBe(true);
      expect(card.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(card.pass_signal_vi)).toBe(true);
      expect(nonEmpty(card.pass_signal_en)).toBe(true);
      expect(nonEmpty(card.retry_hint_vi)).toBe(true);
      expect(nonEmpty(card.retry_hint_en)).toBe(true);
    }
  });

  it("includes smoke-check/final-QA/integration-readiness modes and Canada examples", () => {
    const presentModes = new Set(smokeDeckA2.map((card) => card.mode));
    expect(presentModes.has("smoke_check")).toBe(true);
    expect(presentModes.has("final_qa")).toBe(true);
    expect(presentModes.has("integration_readiness")).toBe(true);

    const canadaCards = smokeDeckA2.filter((card) => card.canada_practical_vi || card.canada_practical_en);
    expect(canadaCards.length).toBeGreaterThanOrEqual(6);
    for (const card of canadaCards) {
      expect(nonEmpty(card.canada_practical_vi)).toBe(true);
      expect(nonEmpty(card.canada_practical_en)).toBe(true);
    }
  });
});
