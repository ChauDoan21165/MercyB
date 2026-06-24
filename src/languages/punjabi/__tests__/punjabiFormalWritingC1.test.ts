import { describe, expect, it } from "vitest";

import { formalWritingC1, formalWritingScriptAwareness } from "../formalWritingC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const CATEGORIES = [
  "formal_email",
  "complaint",
  "request",
  "summary",
  "argument_paragraph",
  "application_statement",
  "public_service_note",
  "academic_transitions",
] as const;

describe("Punjabi C1 formal writing pack - app data contract", () => {
  it("contains a compact useful set with unique ids", () => {
    expect(formalWritingC1.length).toBeGreaterThanOrEqual(8);
    expect(formalWritingC1.length).toBeLessThanOrEqual(16);

    const ids = formalWritingC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_fw_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(formalWritingC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers every Wave 6 formal writing category", () => {
    const present = new Set(formalWritingC1.map((entry) => entry.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 formal writing pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const entry of formalWritingC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_en.trim().length).toBeGreaterThan(0);
      expect(entry.register_vi.trim().length).toBeGreaterThan(0);
      expect(entry.register_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes reusable formal writing phrases", () => {
    for (const entry of formalWritingC1) {
      expect(entry.template_phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of entry.template_phrases) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples in both learner languages", () => {
    for (const entry of formalWritingC1) {
      expect(entry.canada_example.context_vi).toMatch(/Canada/i);
      expect(entry.canada_example.context_en).toMatch(/Canada|Canadian/i);
      expect(GURMUKHI.test(entry.canada_example.pa)).toBe(true);
      expect(entry.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.vi.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and practice tasks", () => {
    for (const entry of formalWritingC1) {
      expect(entry.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_en.length).toBeGreaterThanOrEqual(2);
      expect(entry.practice_task_vi.trim().length).toBeGreaterThan(0);
      expect(entry.practice_task_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 formal writing pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not full course content", () => {
    expect(formalWritingScriptAwareness.vi).toContain("Shahmukhi");
    expect(formalWritingScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = formalWritingC1.flatMap((entry) => [
      entry.title_pa,
      entry.canada_example.pa,
      ...entry.template_phrases.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
