// src/languages/thai/__tests__/thaiFamilyDailyLife.test.ts
//
// Structural guards for the Thai family & daily-life pack (A3 Wave 5).
// These pin the scenario-card contract — NOT linguistic correctness (native
// review is deferred). They check item count, topic coverage, bilingual
// scenarios, Thai-script phrases with romanization, a model response, and a
// bilingual common-mistake.

import { describe, it, expect } from "vitest";

import { items } from "@/languages/thai/familyDailyLife";

const THAI_SCRIPT = /[฀-๿]/;
const hasThai = (s: string) => THAI_SCRIPT.test(s);
const nonEmpty = (s: unknown): s is string =>
  typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "family",
  "home",
  "chores",
  "schedule",
  "school_pickup",
  "neighbor",
  "invitation",
  "illness_home",
  "daily_routine",
  "feelings",
] as const;

function checkPhrase(p: { th: string; rtgs: string; vi: string; en: string }) {
  expect(hasThai(p.th)).toBe(true);
  expect(nonEmpty(p.rtgs)).toBe(true);
  expect(nonEmpty(p.vi)).toBe(true);
  expect(nonEmpty(p.en)).toBe(true);
}

describe("Thai family & daily life — batch shape", () => {
  it("ships 50–100 compact items", () => {
    expect(items.length).toBeGreaterThanOrEqual(50);
    expect(items.length).toBeLessThanOrEqual(100);
  });

  it("item ids are unique", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("covers every required topic at least once", () => {
    const present = new Set(items.map((i) => i.topic));
    for (const t of REQUIRED_TOPICS) expect(present.has(t)).toBe(true);
  });

  it("only uses valid topics", () => {
    for (const i of items) {
      expect(REQUIRED_TOPICS.includes(i.topic)).toBe(true);
    }
  });
});

describe("Thai family & daily life — scenario card contract", () => {
  it("each card has a bilingual scenario", () => {
    for (const i of items) {
      expect(nonEmpty(i.scenario_vi)).toBe(true);
      expect(nonEmpty(i.scenario_en)).toBe(true);
    }
  });

  it("each card has useful phrases in Thai script with romanization + VI/EN", () => {
    for (const i of items) {
      expect(i.useful_phrases.length).toBeGreaterThanOrEqual(1);
      for (const p of i.useful_phrases) checkPhrase(p);
    }
  });

  it("each card has a model response in Thai script with romanization + VI/EN", () => {
    for (const i of items) {
      checkPhrase(i.model_response);
    }
  });

  it("each card documents a bilingual common mistake", () => {
    for (const i of items) {
      expect(nonEmpty(i.common_mistake_vi)).toBe(true);
      expect(nonEmpty(i.common_mistake_en)).toBe(true);
    }
  });
});
