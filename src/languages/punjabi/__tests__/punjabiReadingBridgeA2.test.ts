// src/languages/punjabi/__tests__/punjabiReadingBridgeA2.test.ts
//
// Structural guards for Punjabi A2 short reading bridge. These verify
// app-consumable learner content only; native review is deferred.

import { describe, expect, it } from "vitest";

import { readingBridgeA2 } from "@/languages/punjabi/readingBridgeA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TYPES = [
  "notice",
  "appointment_reminder",
  "school_note",
  "workplace_message",
  "housing_repair_message",
  "transport_sign",
  "service_sign",
] as const;

describe("Punjabi A2 reading bridge — batch shape", () => {
  it("ships a compact useful bridge pack", () => {
    expect(readingBridgeA2.length).toBeGreaterThanOrEqual(9);
    expect(readingBridgeA2.length).toBeLessThanOrEqual(16);
  });

  it("covers required short-reading types", () => {
    const present = new Set(readingBridgeA2.map((item) => item.type));
    for (const type of REQUIRED_TYPES) expect(present.has(type)).toBe(true);
  });

  it("has unique ids and valid types", () => {
    const ids = readingBridgeA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of readingBridgeA2) expect(REQUIRED_TYPES.includes(item.type)).toBe(true);
  });
});

describe("Punjabi A2 reading bridge — learner contract", () => {
  it("uses Gurmukhi primary text with romanization and VI/EN translations", () => {
    for (const item of readingBridgeA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(hasGurmukhi(item.text_pa)).toBe(true);
      expect(nonEmpty(item.romanization)).toBe(true);
      expect(nonEmpty(item.translation_vi)).toBe(true);
      expect(nonEmpty(item.translation_en)).toBe(true);
      expect(nonEmpty(item.reading_tip_vi)).toBe(true);
      expect(nonEmpty(item.reading_tip_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
    }
  });

  it("includes comprehension questions and vocabulary support", () => {
    for (const item of readingBridgeA2) {
      expect(item.questions.length).toBeGreaterThanOrEqual(2);
      for (const question of item.questions) {
        expect(nonEmpty(question.q_vi)).toBe(true);
        expect(nonEmpty(question.q_en)).toBe(true);
        expect(nonEmpty(question.answer_vi)).toBe(true);
        expect(nonEmpty(question.answer_en)).toBe(true);
      }
      expect(item.vocab.length).toBeGreaterThanOrEqual(3);
      for (const vocab of item.vocab) {
        expect(hasGurmukhi(vocab.word)).toBe(true);
        expect(nonEmpty(vocab.romanization)).toBe(true);
        expect(nonEmpty(vocab.vi)).toBe(true);
        expect(nonEmpty(vocab.en)).toBe(true);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    for (const item of readingBridgeA2) {
      expect(nonEmpty(item.learner_trap_vi)).toBe(true);
      expect(nonEmpty(item.learner_trap_en)).toBe(true);
    }
    const canadaItems = readingBridgeA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(6);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
