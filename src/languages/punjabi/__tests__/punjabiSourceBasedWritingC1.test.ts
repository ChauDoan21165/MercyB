import { describe, expect, it } from "vitest";

import { sourceBasedWritingC1, sourceBasedWritingScriptAwareness } from "../sourceBasedWritingC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CATEGORIES = [
  "summarize_source",
  "compare_two_views",
  "cite_cautiously",
  "synthesize_evidence",
  "identify_limitation",
  "structured_response",
] as const;

describe("Punjabi C1 source-based writing pack - app data contract", () => {
  it("contains a compact useful set with stable ids", () => {
    expect(sourceBasedWritingC1.length).toBeGreaterThanOrEqual(7);
    expect(sourceBasedWritingC1.length).toBeLessThanOrEqual(14);

    const ids = sourceBasedWritingC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_sbw_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(sourceBasedWritingC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers all Wave 8 source-based writing categories", () => {
    const present = new Set(sourceBasedWritingC1.map((entry) => entry.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 source-based writing pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const entry of sourceBasedWritingC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.writing_goal_en.trim().length).toBeGreaterThan(0);
      expect(entry.practice_task_vi.trim().length).toBeGreaterThan(0);
      expect(entry.practice_task_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes source excerpts and reusable writing frames", () => {
    for (const entry of sourceBasedWritingC1) {
      expect(GURMUKHI.test(entry.source_excerpt.pa)).toBe(true);
      expect(entry.source_excerpt.rom.trim().length).toBeGreaterThan(0);
      expect(entry.source_excerpt.vi.trim().length).toBeGreaterThan(0);
      expect(entry.source_excerpt.en.trim().length).toBeGreaterThan(0);

      expect(entry.writing_frames.length).toBeGreaterThanOrEqual(3);
      for (const frame of entry.writing_frames) {
        expect(GURMUKHI.test(frame.pa)).toBe(true);
        expect(frame.rom.trim().length).toBeGreaterThan(0);
        expect(frame.vi.trim().length).toBeGreaterThan(0);
        expect(frame.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes academic and public-service Canada-practical examples", () => {
    const textTypes = new Set(sourceBasedWritingC1.map((entry) => entry.text_type));
    expect(textTypes.has("academic")).toBe(true);
    expect(textTypes.has("public_service")).toBe(true);

    for (const entry of sourceBasedWritingC1) {
      expect(entry.canada_example.context_vi).toContain("Canada");
      expect(entry.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(entry.canada_example.pa)).toBe(true);
      expect(entry.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.vi).toContain("Canada");
      expect(entry.canada_example.en).toMatch(/Canada|Canadian/);
    }
  });

  it("includes learner traps", () => {
    for (const entry of sourceBasedWritingC1) {
      expect(entry.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_en.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_vi.every((trap) => trap.trim().length > 0)).toBe(true);
      expect(entry.learner_traps_en.every((trap) => trap.trim().length > 0)).toBe(true);
    }
  });
});

describe("Punjabi C1 source-based writing pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not course content", () => {
    expect(sourceBasedWritingScriptAwareness.vi).toContain("Gurmukhi");
    expect(sourceBasedWritingScriptAwareness.en).toContain("Gurmukhi");
    expect(sourceBasedWritingScriptAwareness.vi).toContain("Shahmukhi");
    expect(sourceBasedWritingScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = sourceBasedWritingC1.flatMap((entry) => [
      entry.title_pa,
      entry.source_excerpt.pa,
      entry.canada_example.pa,
      ...entry.writing_frames.map((frame) => frame.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
