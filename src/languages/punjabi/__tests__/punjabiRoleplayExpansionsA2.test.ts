// src/languages/punjabi/__tests__/punjabiRoleplayExpansionsA2.test.ts
//
// Structural guards for Punjabi A2 roleplay expansions. These verify
// app-consumable learner content only; native review is deferred.

import { describe, expect, it } from "vitest";

import { roleplayExpansionsA2 } from "@/languages/punjabi/roleplayExpansionsA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SCENARIOS = [
  "appointments",
  "shopping_returns",
  "transport_delay",
  "housing_repair",
  "school_office",
  "childcare",
  "workplace_check_in",
  "public_service_counter",
] as const;

describe("Punjabi A2 roleplay expansions — batch shape", () => {
  it("ships a compact useful roleplay pack", () => {
    expect(roleplayExpansionsA2.length).toBeGreaterThanOrEqual(8);
    expect(roleplayExpansionsA2.length).toBeLessThanOrEqual(14);
  });

  it("covers all required scenarios", () => {
    const present = new Set(roleplayExpansionsA2.map((roleplay) => roleplay.scenario));
    for (const scenario of REQUIRED_SCENARIOS) expect(present.has(scenario)).toBe(true);
  });

  it("has unique ids and valid scenarios", () => {
    const ids = roleplayExpansionsA2.map((roleplay) => roleplay.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const roleplay of roleplayExpansionsA2) expect(REQUIRED_SCENARIOS.includes(roleplay.scenario)).toBe(true);
  });
});

describe("Punjabi A2 roleplay expansions — learner contract", () => {
  it("has bilingual role, goal, and script-awareness fields", () => {
    for (const roleplay of roleplayExpansionsA2) {
      expect(nonEmpty(roleplay.title_vi)).toBe(true);
      expect(nonEmpty(roleplay.title_en)).toBe(true);
      expect(nonEmpty(roleplay.learner_goal_vi)).toBe(true);
      expect(nonEmpty(roleplay.learner_goal_en)).toBe(true);
      expect(nonEmpty(roleplay.role_a_vi)).toBe(true);
      expect(nonEmpty(roleplay.role_a_en)).toBe(true);
      expect(nonEmpty(roleplay.role_b_vi)).toBe(true);
      expect(nonEmpty(roleplay.role_b_en)).toBe(true);
      expect(nonEmpty(roleplay.script_awareness_vi)).toBe(true);
      expect(nonEmpty(roleplay.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi turns with romanization and VI/EN translations", () => {
    for (const roleplay of roleplayExpansionsA2) {
      expect(roleplay.useful_phrases.length).toBeGreaterThanOrEqual(3);
      expect(roleplay.model_dialogue.length).toBeGreaterThanOrEqual(4);
      for (const turn of [...roleplay.useful_phrases, ...roleplay.model_dialogue]) {
        expect(["A", "B"].includes(turn.speaker)).toBe(true);
        expect(hasGurmukhi(turn.pa)).toBe(true);
        expect(nonEmpty(turn.romanization)).toBe(true);
        expect(nonEmpty(turn.vi)).toBe(true);
        expect(nonEmpty(turn.en)).toBe(true);
      }
    }
  });

  it("includes common traps and variation prompts", () => {
    for (const roleplay of roleplayExpansionsA2) {
      expect(roleplay.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of roleplay.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(roleplay.variation_prompt_vi)).toBe(true);
      expect(nonEmpty(roleplay.variation_prompt_en)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaRoleplays = roleplayExpansionsA2.filter((roleplay) => roleplay.canada_practical_vi || roleplay.canada_practical_en);
    expect(canadaRoleplays.length).toBeGreaterThanOrEqual(6);
    for (const roleplay of canadaRoleplays) {
      expect(nonEmpty(roleplay.canada_practical_vi)).toBe(true);
      expect(nonEmpty(roleplay.canada_practical_en)).toBe(true);
    }
  });
});
