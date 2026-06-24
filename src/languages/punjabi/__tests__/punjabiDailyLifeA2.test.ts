// src/languages/punjabi/__tests__/punjabiDailyLifeA2.test.ts
//
// Structural guards for Punjabi A2 daily-life pack. These check app-consumable
// learner data only; native review is deferred.

import { describe, expect, it } from "vitest";

import { dailyLifeA2 } from "@/languages/punjabi/dailyLifeA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "errands",
  "home",
  "meals",
  "weather",
  "appointments",
  "simple_problems",
  "schedule_changes",
  "transport",
  "school_family_routines",
] as const;

describe("Punjabi A2 daily life — batch shape", () => {
  it("ships a compact useful daily-life pack", () => {
    expect(dailyLifeA2.length).toBeGreaterThanOrEqual(9);
    expect(dailyLifeA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required daily-life topics", () => {
    const present = new Set(dailyLifeA2.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics", () => {
    const ids = dailyLifeA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of dailyLifeA2) expect(REQUIRED_TOPICS.includes(item.topic)).toBe(true);
  });
});

describe("Punjabi A2 daily life — bilingual Gurmukhi content", () => {
  it("has Vietnamese and English learner-facing explanations", () => {
    for (const item of dailyLifeA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.use_case_vi)).toBe(true);
      expect(nonEmpty(item.use_case_en)).toBe(true);
      expect(nonEmpty(item.grammar_focus_vi)).toBe(true);
      expect(nonEmpty(item.grammar_focus_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi primary lines with romanization and VI/EN notes", () => {
    for (const item of dailyLifeA2) {
      expect(item.lines.length).toBeGreaterThanOrEqual(3);
      for (const line of item.lines) {
        expect(hasGurmukhi(line.pa)).toBe(true);
        expect(nonEmpty(line.romanization)).toBe(true);
        expect(nonEmpty(line.vi)).toBe(true);
        expect(nonEmpty(line.en)).toBe(true);
        expect(nonEmpty(line.note_vi)).toBe(true);
        expect(nonEmpty(line.note_en)).toBe(true);
      }
    }
  });

  it("includes common learner traps and mini tasks", () => {
    for (const item of dailyLifeA2) {
      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.issue_vi)).toBe(true);
        expect(nonEmpty(trap.issue_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(item.mini_task.prompt_vi)).toBe(true);
      expect(nonEmpty(item.mini_task.prompt_en)).toBe(true);
      expect(hasGurmukhi(item.mini_task.model_pa)).toBe(true);
      expect(nonEmpty(item.mini_task.model_romanization)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaItems = dailyLifeA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
