// src/languages/punjabi/__tests__/punjabiReadinessGateA2.test.ts
//
// Structural guards for Punjabi A2 readiness gate. This is Wave 11 only, not
// A11 integration. These verify app-consumable learner content only; native
// review is deferred.

import { describe, expect, it } from "vitest";

import { readinessGateA2 } from "@/languages/punjabi/readinessGateA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_DOMAINS = [
  "daily_tasks",
  "appointments",
  "housing",
  "school_childcare",
  "public_service",
  "transport",
  "polite_problem_description",
  "gurmukhi_phrase_reading",
  "repair_strategies",
] as const;

const TASK_TYPES = ["checkpoint", "reading", "routing", "roleplay", "repair"] as const;

describe("Punjabi A2 readiness gate — batch shape", () => {
  it("ships a compact readiness gate", () => {
    expect(readinessGateA2.length).toBeGreaterThanOrEqual(9);
    expect(readinessGateA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required readiness domains", () => {
    const present = new Set(readinessGateA2.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) expect(present.has(domain)).toBe(true);
  });

  it("has unique ids and valid domains", () => {
    const ids = readinessGateA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of readinessGateA2) expect(REQUIRED_DOMAINS.includes(item.domain)).toBe(true);
  });
});

describe("Punjabi A2 readiness gate — learner contract", () => {
  it("has bilingual can-do and routing guidance", () => {
    for (const item of readinessGateA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.can_do_vi)).toBe(true);
      expect(nonEmpty(item.can_do_en)).toBe(true);
      expect(nonEmpty(item.route_if_ready_vi)).toBe(true);
      expect(nonEmpty(item.route_if_ready_en)).toBe(true);
      expect(nonEmpty(item.route_if_not_ready_vi)).toBe(true);
      expect(nonEmpty(item.route_if_not_ready_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
    }
  });

  it("includes readiness/checkpoint/routing style prompts with Gurmukhi answers", () => {
    for (const item of readinessGateA2) {
      expect(item.prompts.length).toBeGreaterThanOrEqual(2);
      for (const prompt of item.prompts) {
        expect(TASK_TYPES.includes(prompt.type)).toBe(true);
        expect(nonEmpty(prompt.prompt_vi)).toBe(true);
        expect(nonEmpty(prompt.prompt_en)).toBe(true);
        expect(hasGurmukhi(prompt.expected_pa)).toBe(true);
        expect(nonEmpty(prompt.expected_romanization)).toBe(true);
        expect(nonEmpty(prompt.expected_vi)).toBe(true);
        expect(nonEmpty(prompt.expected_en)).toBe(true);
        expect(nonEmpty(prompt.pass_hint_vi)).toBe(true);
        expect(nonEmpty(prompt.pass_hint_en)).toBe(true);
      }
    }
  });

  it("includes common learner traps", () => {
    for (const item of readinessGateA2) {
      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaItems = readinessGateA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
