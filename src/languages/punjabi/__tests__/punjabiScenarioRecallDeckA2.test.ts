// src/languages/punjabi/__tests__/punjabiScenarioRecallDeckA2.test.ts
//
// Structural guards for Punjabi A2 scenario recall deck. This is Wave 14 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { scenarioRecallDeckA2 } from "@/languages/punjabi/scenarioRecallDeckA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "appointments",
  "shopping",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_descriptions",
  "repair_phrases",
] as const;

const MODES = ["recall", "review", "routing", "integration_readiness"] as const;

describe("Punjabi A2 scenario recall deck — batch shape", () => {
  it("ships a compact useful recall deck", () => {
    expect(scenarioRecallDeckA2.length).toBeGreaterThanOrEqual(12);
    expect(scenarioRecallDeckA2.length).toBeLessThanOrEqual(22);
  });

  it("covers all required scenarios", () => {
    const present = new Set(scenarioRecallDeckA2.map((card) => card.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios/modes", () => {
    const ids = scenarioRecallDeckA2.map((card) => card.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const card of scenarioRecallDeckA2) {
      expect(REQUIRED_SCENARIOS.includes(card.scenario)).toBe(true);
      expect(MODES.includes(card.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 scenario recall deck — learner contract", () => {
  it("uses Gurmukhi expected responses with romanization and bilingual explanations", () => {
    for (const card of scenarioRecallDeckA2) {
      expect(nonEmpty(card.title_vi)).toBe(true);
      expect(nonEmpty(card.title_en)).toBe(true);
      expect(nonEmpty(card.cue_vi)).toBe(true);
      expect(nonEmpty(card.cue_en)).toBe(true);
      expect(hasGurmukhi(card.expected.pa)).toBe(true);
      expect(nonEmpty(card.expected.romanization)).toBe(true);
      expect(nonEmpty(card.expected.vi)).toBe(true);
      expect(nonEmpty(card.expected.en)).toBe(true);
      expect(nonEmpty(card.expected.explanation_vi)).toBe(true);
      expect(nonEmpty(card.expected.explanation_en)).toBe(true);
    }
  });

  it("includes script awareness, traps, and routing guidance", () => {
    for (const card of scenarioRecallDeckA2) {
      expect(nonEmpty(card.script_awareness_vi)).toBe(true);
      expect(nonEmpty(card.script_awareness_en)).toBe(true);
      expect(card.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of card.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(card.route_if_easy_vi)).toBe(true);
      expect(nonEmpty(card.route_if_easy_en)).toBe(true);
      expect(nonEmpty(card.route_if_hard_vi)).toBe(true);
      expect(nonEmpty(card.route_if_hard_en)).toBe(true);
    }
  });

  it("includes integration-readiness/review/routing style items", () => {
    const presentModes = new Set(scenarioRecallDeckA2.map((card) => card.mode));
    expect(presentModes.has("recall")).toBe(true);
    expect(presentModes.has("review")).toBe(true);
    expect(presentModes.has("routing")).toBe(true);
    expect(presentModes.has("integration_readiness")).toBe(true);
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaCards = scenarioRecallDeckA2.filter((card) => card.canada_practical_vi || card.canada_practical_en);
    expect(canadaCards.length).toBeGreaterThanOrEqual(8);
    for (const card of canadaCards) {
      expect(nonEmpty(card.canada_practical_vi)).toBe(true);
      expect(nonEmpty(card.canada_practical_en)).toBe(true);
    }
  });
});
