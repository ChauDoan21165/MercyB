// src/languages/punjabi/__tests__/punjabiScriptDrills.test.ts
//
// Structural guards for Punjabi Gurmukhi script drills.
// These tests do not assert native-level linguistic review; that is deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_DRILLS,
  type PunjabiScriptDrillType,
} from "@/languages/punjabi/scriptDrills";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const DRILL_TYPES = new Set<PunjabiScriptDrillType>([
  "letter_recognition",
  "vowel_sign",
  "similar_letters",
  "word_reading",
  "sign_text_reading",
  "romanization_warning",
  "shahmukhi_awareness",
]);

describe("Punjabi Gurmukhi script drills", () => {
  it("has 60-120 compact drills", () => {
    expect(PUNJABI_SCRIPT_DRILLS.length).toBeGreaterThanOrEqual(60);
    expect(PUNJABI_SCRIPT_DRILLS.length).toBeLessThanOrEqual(120);
  });

  it("uses Gurmukhi primary with bilingual prompts and answers", () => {
    for (const drill of PUNJABI_SCRIPT_DRILLS) {
      expect(GURMUKHI_RANGE.test(drill.gurmukhi), `Gurmukhi for ${drill.id}`).toBe(true);
      expect(drill.prompt_vi.trim().length, `prompt_vi for ${drill.id}`).toBeGreaterThan(0);
      expect(drill.prompt_en.trim().length, `prompt_en for ${drill.id}`).toBeGreaterThan(0);
      expect(drill.answer_vi.trim().length, `answer_vi for ${drill.id}`).toBeGreaterThan(15);
      expect(drill.answer_en.trim().length, `answer_en for ${drill.id}`).toBeGreaterThan(15);
    }
  });

  it("keeps drill ids unique and known types", () => {
    const ids = new Set<string>();
    for (const drill of PUNJABI_SCRIPT_DRILLS) {
      expect(ids.has(drill.id), `duplicate id: ${drill.id}`).toBe(false);
      ids.add(drill.id);
      expect(DRILL_TYPES.has(drill.type), `type for ${drill.id}`).toBe(true);
    }
  });

  it("covers the required script practice areas", () => {
    const used = new Set(PUNJABI_SCRIPT_DRILLS.map((drill) => drill.type));
    for (const type of DRILL_TYPES) {
      expect(used.has(type), `missing ${type}`).toBe(true);
    }
  });

  it("includes romanization where useful without treating it as scoring", () => {
    const romanized = PUNJABI_SCRIPT_DRILLS.filter((drill) => drill.romanization && drill.romanization.trim().length > 0);
    expect(romanized.length).toBeGreaterThan(45);
    const blob = PUNJABI_SCRIPT_DRILLS.map((drill) => `${drill.answer_vi} ${drill.answer_en}`).join(" ").toLowerCase();
    expect(blob).toMatch(/không phải phát âm chấm điểm|not scored pronunciation/);
  });

  it("keeps Shahmukhi as awareness only", () => {
    const shahmukhi = PUNJABI_SCRIPT_DRILLS.filter((drill) => drill.type === "shahmukhi_awareness");
    expect(shahmukhi.length).toBeGreaterThanOrEqual(1);
    const blob = shahmukhi.map((drill) => `${drill.answer_vi} ${drill.answer_en}`).join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
  });
});
