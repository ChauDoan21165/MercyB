// src/languages/punjabi/__tests__/punjabiCapstoneReviewA2.test.ts
//
// Structural guards for Punjabi A2 capstone review. These verify
// app-consumable learner content only; native review is deferred.

import { describe, expect, it } from "vitest";

import { capstoneReviewA2 } from "@/languages/punjabi/capstoneReviewA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_SKILLS = [
  "daily_actions",
  "past_future_basics",
  "appointments",
  "errands",
  "housing",
  "school",
  "childcare",
  "transport",
  "workplace_small_talk",
  "polite_problem_descriptions",
] as const;

const CHECKPOINT_TYPES = ["translate", "choose_form", "repair", "reading_check", "roleplay_prompt"] as const;

describe("Punjabi A2 capstone review — batch shape", () => {
  it("ships a compact but complete capstone", () => {
    expect(capstoneReviewA2.length).toBeGreaterThanOrEqual(10);
    expect(capstoneReviewA2.length).toBeLessThanOrEqual(16);
  });

  it("covers all required A2 capstone skills", () => {
    const present = new Set(capstoneReviewA2.map((section) => section.skill));
    for (const skill of REQUIRED_SKILLS) expect(present.has(skill)).toBe(true);
  });

  it("has unique ids and valid skills", () => {
    const ids = capstoneReviewA2.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const section of capstoneReviewA2) expect(REQUIRED_SKILLS.includes(section.skill)).toBe(true);
  });
});

describe("Punjabi A2 capstone review — learner contract", () => {
  it("has bilingual goals, review notes, and script awareness", () => {
    for (const section of capstoneReviewA2) {
      expect(nonEmpty(section.title_vi)).toBe(true);
      expect(nonEmpty(section.title_en)).toBe(true);
      expect(nonEmpty(section.goal_vi)).toBe(true);
      expect(nonEmpty(section.goal_en)).toBe(true);
      expect(nonEmpty(section.review_note_vi)).toBe(true);
      expect(nonEmpty(section.review_note_en)).toBe(true);
      expect(nonEmpty(section.script_awareness_vi)).toBe(true);
      expect(nonEmpty(section.script_awareness_en)).toBe(true);
    }
  });

  it("uses Gurmukhi examples with romanization and bilingual explanations", () => {
    for (const section of capstoneReviewA2) {
      expect(section.examples.length).toBeGreaterThanOrEqual(2);
      for (const example of section.examples) {
        expect(hasGurmukhi(example.pa)).toBe(true);
        expect(nonEmpty(example.romanization)).toBe(true);
        expect(nonEmpty(example.vi)).toBe(true);
        expect(nonEmpty(example.en)).toBe(true);
        expect(nonEmpty(example.explanation_vi)).toBe(true);
        expect(nonEmpty(example.explanation_en)).toBe(true);
      }
    }
  });

  it("includes traps and capstone/checkpoint items", () => {
    for (const section of capstoneReviewA2) {
      expect(section.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of section.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }

      expect(section.checkpoints.length).toBeGreaterThanOrEqual(2);
      for (const checkpoint of section.checkpoints) {
        expect(CHECKPOINT_TYPES.includes(checkpoint.type)).toBe(true);
        expect(nonEmpty(checkpoint.prompt_vi)).toBe(true);
        expect(nonEmpty(checkpoint.prompt_en)).toBe(true);
        expect(hasGurmukhi(checkpoint.answer_pa)).toBe(true);
        expect(nonEmpty(checkpoint.answer_romanization)).toBe(true);
        expect(nonEmpty(checkpoint.answer_vi)).toBe(true);
        expect(nonEmpty(checkpoint.answer_en)).toBe(true);
      }
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const canadaSections = capstoneReviewA2.filter((section) => section.canada_practical_vi || section.canada_practical_en);
    expect(canadaSections.length).toBeGreaterThanOrEqual(6);
    for (const section of canadaSections) {
      expect(nonEmpty(section.canada_practical_vi)).toBe(true);
      expect(nonEmpty(section.canada_practical_en)).toBe(true);
    }
  });
});
