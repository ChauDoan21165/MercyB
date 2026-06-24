// src/languages/punjabi/__tests__/punjabiMessageComprehensionA2.test.ts
//
// Structural guards for Punjabi A2 short-message comprehension. This is Wave
// 16 only, not A11 integration. These verify app-consumable learner content
// only; native review is deferred.

import { describe, expect, it } from "vitest";

import { messageComprehensionA2 } from "@/languages/punjabi/messageComprehensionA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TYPES = [
  "appointment_reminder",
  "transport_notice",
  "school_note",
  "housing_repair_message",
  "workplace_schedule_note",
  "service_counter_instruction",
  "polite_follow_up_response",
] as const;

const MODES = ["navigation", "review", "remediation", "readiness"] as const;

describe("Punjabi A2 message comprehension — batch shape", () => {
  it("ships a compact useful message pack", () => {
    expect(messageComprehensionA2.length).toBeGreaterThanOrEqual(12);
    expect(messageComprehensionA2.length).toBeLessThanOrEqual(22);
  });

  it("covers all required message types", () => {
    const present = new Set(messageComprehensionA2.map((item) => item.type));
    for (const type of REQUIRED_TYPES) expect(present.has(type)).toBe(true);
  });

  it("has unique ids and valid types/modes", () => {
    const ids = messageComprehensionA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of messageComprehensionA2) {
      expect(REQUIRED_TYPES.includes(item.type)).toBe(true);
      expect(MODES.includes(item.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 message comprehension — learner contract", () => {
  it("uses Gurmukhi messages with romanization and bilingual translations", () => {
    for (const item of messageComprehensionA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(hasGurmukhi(item.message_pa)).toBe(true);
      expect(nonEmpty(item.romanization)).toBe(true);
      expect(nonEmpty(item.translation_vi)).toBe(true);
      expect(nonEmpty(item.translation_en)).toBe(true);
      expect(nonEmpty(item.comprehension_goal_vi)).toBe(true);
      expect(nonEmpty(item.comprehension_goal_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
    }
  });

  it("includes questions, suggested replies, traps, and remediation", () => {
    for (const item of messageComprehensionA2) {
      expect(item.questions.length).toBeGreaterThanOrEqual(2);
      for (const question of item.questions) {
        expect(nonEmpty(question.q_vi)).toBe(true);
        expect(nonEmpty(question.q_en)).toBe(true);
        expect(nonEmpty(question.answer_vi)).toBe(true);
        expect(nonEmpty(question.answer_en)).toBe(true);
      }
      expect(hasGurmukhi(item.suggested_reply.pa)).toBe(true);
      expect(nonEmpty(item.suggested_reply.romanization)).toBe(true);
      expect(nonEmpty(item.suggested_reply.vi)).toBe(true);
      expect(nonEmpty(item.suggested_reply.en)).toBe(true);
      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.focus_pa)).toBe(true);
        expect(nonEmpty(trap.focus_romanization)).toBe(true);
      }
      expect(nonEmpty(item.navigation_hint_vi)).toBe(true);
      expect(nonEmpty(item.navigation_hint_en)).toBe(true);
      expect(nonEmpty(item.remediation_vi)).toBe(true);
      expect(nonEmpty(item.remediation_en)).toBe(true);
    }
  });

  it("includes navigation/review/remediation/readiness style items and Canada examples", () => {
    const presentModes = new Set(messageComprehensionA2.map((item) => item.mode));
    expect(presentModes.has("navigation")).toBe(true);
    expect(presentModes.has("review")).toBe(true);
    expect(presentModes.has("remediation")).toBe(true);
    expect(presentModes.has("readiness")).toBe(true);

    const canadaItems = messageComprehensionA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
