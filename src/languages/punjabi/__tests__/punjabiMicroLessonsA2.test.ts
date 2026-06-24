// src/languages/punjabi/__tests__/punjabiMicroLessonsA2.test.ts
//
// Structural guards for Punjabi A2 micro-lessons. These verify app-consumable
// learner data only; native review is deferred.

import { describe, expect, it } from "vitest";

import { microLessonsA2 } from "@/languages/punjabi/microLessonsA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "past_daily_actions",
  "future_daily_actions",
  "shopping",
  "appointments",
  "transport",
  "housing",
  "school",
  "childcare",
  "workplace_small_talk",
  "polite_problem_description",
] as const;

describe("Punjabi A2 micro lessons — batch shape", () => {
  it("ships a compact useful batch", () => {
    expect(microLessonsA2.length).toBeGreaterThanOrEqual(10);
    expect(microLessonsA2.length).toBeLessThanOrEqual(18);
  });

  it("covers all required A2 daily-communication topics", () => {
    const present = new Set(microLessonsA2.map((lesson) => lesson.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics", () => {
    const ids = microLessonsA2.map((lesson) => lesson.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const lesson of microLessonsA2) expect(REQUIRED_TOPICS.includes(lesson.topic)).toBe(true);
  });
});

describe("Punjabi A2 micro lessons — bilingual learner support", () => {
  it("has Vietnamese and English titles, situations, grammar notes, and script awareness", () => {
    for (const lesson of microLessonsA2) {
      expect(nonEmpty(lesson.title_vi)).toBe(true);
      expect(nonEmpty(lesson.title_en)).toBe(true);
      expect(nonEmpty(lesson.situation_vi)).toBe(true);
      expect(nonEmpty(lesson.situation_en)).toBe(true);
      expect(nonEmpty(lesson.grammar_vi)).toBe(true);
      expect(nonEmpty(lesson.grammar_en)).toBe(true);
      expect(nonEmpty(lesson.script_awareness_vi)).toBe(true);
      expect(nonEmpty(lesson.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi primary phrases with romanization, Vietnamese, and English", () => {
    for (const lesson of microLessonsA2) {
      expect(lesson.phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of lesson.phrases) {
        expect(hasGurmukhi(phrase.pa)).toBe(true);
        expect(nonEmpty(phrase.romanization)).toBe(true);
        expect(nonEmpty(phrase.vi)).toBe(true);
        expect(nonEmpty(phrase.en)).toBe(true);
        expect(nonEmpty(phrase.usage_vi)).toBe(true);
        expect(nonEmpty(phrase.usage_en)).toBe(true);
      }
    }
  });

  it("includes common learner traps and quick practice", () => {
    for (const lesson of microLessonsA2) {
      expect(lesson.learner_traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of lesson.learner_traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
      expect(nonEmpty(lesson.quick_practice.prompt_vi)).toBe(true);
      expect(nonEmpty(lesson.quick_practice.prompt_en)).toBe(true);
      expect(hasGurmukhi(lesson.quick_practice.answer_pa)).toBe(true);
      expect(nonEmpty(lesson.quick_practice.answer_romanization)).toBe(true);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaLessons = microLessonsA2.filter((lesson) => lesson.canada_practical_vi || lesson.canada_practical_en);
    expect(canadaLessons.length).toBeGreaterThanOrEqual(5);
    for (const lesson of canadaLessons) {
      expect(nonEmpty(lesson.canada_practical_vi)).toBe(true);
      expect(nonEmpty(lesson.canada_practical_en)).toBe(true);
    }
  });
});
