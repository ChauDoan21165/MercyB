// src/languages/punjabi/__tests__/punjabiCanDoStatementsA2.test.ts
//
// Structural guards for Punjabi A2 can-do statements. This is Wave 12 only,
// not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { canDoStatementsA2 } from "@/languages/punjabi/canDoStatementsA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_DOMAINS = [
  "daily_routines",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_descriptions",
  "basic_interaction_repair",
] as const;

const CHECKPOINT_TYPES = ["say_it", "choose_form", "read_it", "repair_it", "roleplay"] as const;

describe("Punjabi A2 can-do statements — batch shape", () => {
  it("ships a compact can-do set", () => {
    expect(canDoStatementsA2.length).toBeGreaterThanOrEqual(9);
    expect(canDoStatementsA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required A2 domains", () => {
    const present = new Set(canDoStatementsA2.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) expect(present.has(domain)).toBe(true);
  });

  it("has unique ids and valid domains", () => {
    const ids = canDoStatementsA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of canDoStatementsA2) expect(REQUIRED_DOMAINS.includes(item.domain)).toBe(true);
  });
});

describe("Punjabi A2 can-do statements — learner contract", () => {
  it("has bilingual can-do evidence, routing, and script awareness", () => {
    for (const item of canDoStatementsA2) {
      expect(nonEmpty(item.can_do_vi)).toBe(true);
      expect(nonEmpty(item.can_do_en)).toBe(true);
      expect(nonEmpty(item.learner_evidence_vi)).toBe(true);
      expect(nonEmpty(item.learner_evidence_en)).toBe(true);
      expect(nonEmpty(item.readiness_route_vi)).toBe(true);
      expect(nonEmpty(item.readiness_route_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi models with romanization and VI/EN explanations", () => {
    for (const item of canDoStatementsA2) {
      expect(item.models.length).toBeGreaterThanOrEqual(2);
      for (const model of item.models) {
        expect(hasGurmukhi(model.pa)).toBe(true);
        expect(nonEmpty(model.romanization)).toBe(true);
        expect(nonEmpty(model.vi)).toBe(true);
        expect(nonEmpty(model.en)).toBe(true);
        expect(nonEmpty(model.note_vi)).toBe(true);
        expect(nonEmpty(model.note_en)).toBe(true);
      }
    }
  });

  it("includes can-do/checkpoint/readiness style items", () => {
    for (const item of canDoStatementsA2) {
      expect(item.checkpoints.length).toBeGreaterThanOrEqual(2);
      for (const checkpoint of item.checkpoints) {
        expect(CHECKPOINT_TYPES.includes(checkpoint.type)).toBe(true);
        expect(nonEmpty(checkpoint.prompt_vi)).toBe(true);
        expect(nonEmpty(checkpoint.prompt_en)).toBe(true);
        expect(hasGurmukhi(checkpoint.expected_pa)).toBe(true);
        expect(nonEmpty(checkpoint.expected_romanization)).toBe(true);
        expect(nonEmpty(checkpoint.expected_vi)).toBe(true);
        expect(nonEmpty(checkpoint.expected_en)).toBe(true);
      }
    }
  });

  it("includes common learner traps and Canada-practical examples where useful", () => {
    for (const item of canDoStatementsA2) {
      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
    const canadaItems = canDoStatementsA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
