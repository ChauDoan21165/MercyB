// src/languages/punjabi/__tests__/punjabiFormsAppointmentsA2.test.ts
//
// Structural guards for Punjabi A2 forms and appointments. This is Wave 17
// only, not A11 integration. These verify app-consumable learner content only;
// native review is deferred.

import { describe, expect, it } from "vitest";

import { formsAppointmentsA2 } from "@/languages/punjabi/formsAppointmentsA2";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI.test(s);
const nonEmpty = (s: unknown): s is string => typeof s === "string" && s.trim().length > 0;

const REQUIRED_TOPICS = [
  "name",
  "address",
  "date_time",
  "rescheduling",
  "missing_document",
  "interpreter_request",
  "clinic_appointment",
  "school_appointment",
  "public_service_appointment",
  "polite_confirmation",
] as const;

const MODES = ["final_quality", "review", "remediation", "readiness"] as const;

describe("Punjabi A2 forms and appointments — batch shape", () => {
  it("ships a compact useful forms/appointments pack", () => {
    expect(formsAppointmentsA2.length).toBeGreaterThanOrEqual(10);
    expect(formsAppointmentsA2.length).toBeLessThanOrEqual(18);
  });

  it("covers all required form and appointment topics", () => {
    const present = new Set(formsAppointmentsA2.map((item) => item.topic));
    for (const topic of REQUIRED_TOPICS) expect(present.has(topic)).toBe(true);
  });

  it("has unique ids and valid topics/modes", () => {
    const ids = formsAppointmentsA2.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const item of formsAppointmentsA2) {
      expect(REQUIRED_TOPICS.includes(item.topic)).toBe(true);
      expect(MODES.includes(item.mode)).toBe(true);
    }
  });
});

describe("Punjabi A2 forms and appointments — learner contract", () => {
  it("has bilingual tasks, script awareness, checkpoints, and remediation", () => {
    for (const item of formsAppointmentsA2) {
      expect(nonEmpty(item.title_vi)).toBe(true);
      expect(nonEmpty(item.title_en)).toBe(true);
      expect(nonEmpty(item.learner_task_vi)).toBe(true);
      expect(nonEmpty(item.learner_task_en)).toBe(true);
      expect(nonEmpty(item.script_awareness_vi)).toBe(true);
      expect(nonEmpty(item.script_awareness_en)).toBe(true);
      expect(nonEmpty(item.checkpoint.prompt_vi)).toBe(true);
      expect(nonEmpty(item.checkpoint.prompt_en)).toBe(true);
      expect(hasGurmukhi(item.checkpoint.answer_pa)).toBe(true);
      expect(nonEmpty(item.checkpoint.answer_romanization)).toBe(true);
      expect(nonEmpty(item.checkpoint.answer_vi)).toBe(true);
      expect(nonEmpty(item.checkpoint.answer_en)).toBe(true);
      expect(nonEmpty(item.remediation_vi)).toBe(true);
      expect(nonEmpty(item.remediation_en)).toBe(true);
    }
  });

  it("uses Gurmukhi phrases with romanization and bilingual notes", () => {
    for (const item of formsAppointmentsA2) {
      expect(item.phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of item.phrases) {
        expect(hasGurmukhi(phrase.pa)).toBe(true);
        expect(nonEmpty(phrase.romanization)).toBe(true);
        expect(nonEmpty(phrase.vi)).toBe(true);
        expect(nonEmpty(phrase.en)).toBe(true);
        expect(nonEmpty(phrase.note_vi)).toBe(true);
        expect(nonEmpty(phrase.note_en)).toBe(true);
      }
    }
  });

  it("includes common learner traps", () => {
    for (const item of formsAppointmentsA2) {
      expect(item.traps.length).toBeGreaterThanOrEqual(1);
      for (const trap of item.traps) {
        expect(nonEmpty(trap.trap_vi)).toBe(true);
        expect(nonEmpty(trap.trap_en)).toBe(true);
        expect(hasGurmukhi(trap.better_pa)).toBe(true);
        expect(nonEmpty(trap.better_romanization)).toBe(true);
      }
    }
  });

  it("includes Canada-practical and final-quality/review/remediation/readiness style items", () => {
    const presentModes = new Set(formsAppointmentsA2.map((item) => item.mode));
    expect(presentModes.has("final_quality")).toBe(true);
    expect(presentModes.has("review")).toBe(true);
    expect(presentModes.has("remediation")).toBe(true);
    expect(presentModes.has("readiness")).toBe(true);

    const canadaItems = formsAppointmentsA2.filter((item) => item.canada_practical_vi || item.canada_practical_en);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    for (const item of canadaItems) {
      expect(nonEmpty(item.canada_practical_vi)).toBe(true);
      expect(nonEmpty(item.canada_practical_en)).toBe(true);
    }
  });
});
