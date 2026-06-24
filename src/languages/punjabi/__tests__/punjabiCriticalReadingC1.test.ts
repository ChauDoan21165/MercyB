import { describe, expect, it } from "vitest";

import { criticalReadingC1, criticalReadingScriptAwareness } from "../criticalReadingC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CATEGORIES = [
  "identify_claim",
  "identify_evidence",
  "identify_limitation",
  "identify_bias",
  "contrast",
  "implied_meaning",
  "summary",
  "response_frames",
] as const;

describe("Punjabi C1 critical reading pack - app data contract", () => {
  it("contains a compact useful set with stable ids", () => {
    expect(criticalReadingC1.length).toBeGreaterThanOrEqual(9);
    expect(criticalReadingC1.length).toBeLessThanOrEqual(16);

    const ids = criticalReadingC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_cr_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(criticalReadingC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers all Wave 7 critical reading categories", () => {
    const present = new Set(criticalReadingC1.map((entry) => entry.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 critical reading pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const entry of criticalReadingC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);
      expect(entry.reading_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.reading_goal_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes bilingual sample text and analysis prompts", () => {
    for (const entry of criticalReadingC1) {
      expect(GURMUKHI.test(entry.sample_text.pa)).toBe(true);
      expect(entry.sample_text.rom.trim().length).toBeGreaterThan(0);
      expect(entry.sample_text.vi.trim().length).toBeGreaterThan(0);
      expect(entry.sample_text.en.trim().length).toBeGreaterThan(0);

      expect(entry.analysis_prompts.length).toBeGreaterThanOrEqual(2);
      for (const prompt of entry.analysis_prompts) {
        expect(GURMUKHI.test(prompt.pa)).toBe(true);
        expect(prompt.rom.trim().length).toBeGreaterThan(0);
        expect(prompt.vi.trim().length).toBeGreaterThan(0);
        expect(prompt.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes reusable Gurmukhi response frames with bilingual support", () => {
    for (const entry of criticalReadingC1) {
      expect(GURMUKHI.test(entry.response_frame.pa)).toBe(true);
      expect(entry.response_frame.rom.trim().length).toBeGreaterThan(0);
      expect(entry.response_frame.vi.trim().length).toBeGreaterThan(0);
      expect(entry.response_frame.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes academic or public-service Canada-practical examples", () => {
    const textTypes = new Set(criticalReadingC1.map((entry) => entry.text_type));
    expect(textTypes.has("academic")).toBe(true);
    expect(textTypes.has("public_service")).toBe(true);

    for (const entry of criticalReadingC1) {
      expect(entry.canada_example.context_vi).toContain("Canada");
      expect(entry.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(entry.canada_example.pa)).toBe(true);
      expect(entry.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.vi).toContain("Canada");
      expect(entry.canada_example.en).toMatch(/Canada|Canadian/);
    }
  });

  it("includes learner traps and practice tasks", () => {
    for (const entry of criticalReadingC1) {
      expect(entry.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 critical reading pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not course content", () => {
    expect(criticalReadingScriptAwareness.vi).toContain("Gurmukhi");
    expect(criticalReadingScriptAwareness.en).toContain("Gurmukhi");
    expect(criticalReadingScriptAwareness.vi).toContain("Shahmukhi");
    expect(criticalReadingScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = criticalReadingC1.flatMap((entry) => [
      entry.title_pa,
      entry.sample_text.pa,
      entry.canada_example.pa,
      entry.response_frame.pa,
      ...entry.analysis_prompts.map((prompt) => prompt.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
