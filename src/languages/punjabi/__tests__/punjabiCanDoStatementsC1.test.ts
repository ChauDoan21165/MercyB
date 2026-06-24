import { describe, expect, it } from "vitest";

import { canDoStatementsC1, canDoStatementsScriptAwareness } from "../canDoStatementsC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_SKILLS = [
  "summarize_sources",
  "cautious_claims",
  "compare_evidence",
  "formal_writing",
  "academic_register",
  "presentation_response",
  "public_text_handling",
  "professional_text_handling",
] as const;

describe("Punjabi C1 can-do statements - app data contract", () => {
  it("contains a compact useful set with stable ids", () => {
    expect(canDoStatementsC1.length).toBeGreaterThanOrEqual(7);
    expect(canDoStatementsC1.length).toBeLessThanOrEqual(12);

    const ids = canDoStatementsC1.map((item) => item.id);
    expect(ids.every((id) => id.startsWith("pa_c1_cando_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(canDoStatementsC1.every((item) => item.level === "C1")).toBe(true);
  });

  it("covers all Wave 12 can-do skill areas", () => {
    const present = new Set(canDoStatementsC1.map((item) => item.area));
    for (const skill of REQUIRED_SKILLS) {
      expect(present.has(skill)).toBe(true);
    }
  });

  it("includes checkpoint and readiness progression states", () => {
    const readiness = new Set(canDoStatementsC1.map((item) => item.readiness));
    expect(readiness.has("checkpoint")).toBe(true);
    expect(readiness.has("practice_ready")).toBe(true);
    expect(readiness.has("capstone_ready")).toBe(true);
  });
});

describe("Punjabi C1 can-do statements - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi statements with romanization, Vietnamese, and English", () => {
    for (const item of canDoStatementsC1) {
      expect(GURMUKHI.test(item.statement_pa)).toBe(true);
      expect(item.statement_rom.trim().length).toBeGreaterThan(0);
      expect(item.statement_vi.trim().length).toBeGreaterThan(0);
      expect(item.statement_en.trim().length).toBeGreaterThan(0);
      expect(item.learner_evidence_vi.trim().length).toBeGreaterThan(0);
      expect(item.learner_evidence_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes checkpoint tasks, success markers, and useful language", () => {
    for (const item of canDoStatementsC1) {
      expect(GURMUKHI.test(item.checkpoint_task.pa)).toBe(true);
      expect(item.checkpoint_task.rom.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_task.vi.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_task.en.trim().length).toBeGreaterThan(0);

      expect(item.success_markers_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.success_markers_en.length).toBeGreaterThanOrEqual(3);

      expect(item.useful_language.length).toBeGreaterThanOrEqual(3);
      for (const phrase of item.useful_language) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const item of canDoStatementsC1) {
      expect(item.canada_example.context_vi).toContain("Canada");
      expect(item.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(item.canada_example.pa)).toBe(true);
      expect(item.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(item.canada_example.vi).toContain("Canada");
      expect(item.canada_example.en).toMatch(/Canada|Canadian/);

      expect(item.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 can-do statements - script scope", () => {
  it("mentions Shahmukhi only as awareness, not can-do content", () => {
    expect(canDoStatementsScriptAwareness.vi).toContain("Gurmukhi");
    expect(canDoStatementsScriptAwareness.en).toContain("Gurmukhi");
    expect(canDoStatementsScriptAwareness.vi).toContain("Shahmukhi");
    expect(canDoStatementsScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = canDoStatementsC1.flatMap((item) => [
      item.statement_pa,
      item.checkpoint_task.pa,
      item.canada_example.pa,
      ...item.useful_language.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
