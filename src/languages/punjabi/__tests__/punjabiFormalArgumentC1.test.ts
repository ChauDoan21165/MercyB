import { describe, expect, it } from "vitest";

import { formalArgumentC1, formalArgumentScriptAwareness } from "../formalArgumentC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const CATEGORIES = [
  "thesis",
  "evidence",
  "limitation",
  "counterargument",
  "conclusion",
  "careful_tone",
  "public_example",
  "community_example",
  "academic_example",
] as const;

describe("Punjabi C1 formal argument pack - app data contract", () => {
  it("contains a compact useful set with stable ids", () => {
    expect(formalArgumentC1.length).toBeGreaterThanOrEqual(9);
    expect(formalArgumentC1.length).toBeLessThanOrEqual(16);

    const ids = formalArgumentC1.map((entry) => entry.id);
    expect(ids.every((id) => id.startsWith("pa_c1_arg_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(formalArgumentC1.every((entry) => entry.level === "C1")).toBe(true);
  });

  it("covers all Wave 9 formal argument categories", () => {
    const present = new Set(formalArgumentC1.map((entry) => entry.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 formal argument pack - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const entry of formalArgumentC1) {
      expect(GURMUKHI.test(entry.title_pa)).toBe(true);
      expect(entry.title_rom.trim().length).toBeGreaterThan(0);
      expect(entry.title_vi.trim().length).toBeGreaterThan(0);
      expect(entry.title_en.trim().length).toBeGreaterThan(0);
      expect(entry.argument_goal_vi.trim().length).toBeGreaterThan(0);
      expect(entry.argument_goal_en.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_vi.trim().length).toBeGreaterThan(0);
      expect(entry.register_note_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes reusable formal argument frames", () => {
    for (const entry of formalArgumentC1) {
      expect(entry.argument_frames.length).toBeGreaterThanOrEqual(3);
      for (const frame of entry.argument_frames) {
        expect(GURMUKHI.test(frame.pa)).toBe(true);
        expect(frame.rom.trim().length).toBeGreaterThan(0);
        expect(frame.vi.trim().length).toBeGreaterThan(0);
        expect(frame.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical public, community, and academic examples", () => {
    const categories = new Set(formalArgumentC1.map((entry) => entry.category));
    expect(categories.has("public_example")).toBe(true);
    expect(categories.has("community_example")).toBe(true);
    expect(categories.has("academic_example")).toBe(true);

    for (const entry of formalArgumentC1) {
      expect(entry.canada_example.context_vi).toContain("Canada");
      expect(entry.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(entry.canada_example.pa)).toBe(true);
      expect(entry.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(entry.canada_example.vi).toContain("Canada");
      expect(entry.canada_example.en).toMatch(/Canada|Canadian/);
    }
  });

  it("includes learner traps and practice tasks", () => {
    for (const entry of formalArgumentC1) {
      expect(entry.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(entry.learner_traps_en.length).toBeGreaterThanOrEqual(2);
      expect(entry.practice_task_vi.trim().length).toBeGreaterThan(0);
      expect(entry.practice_task_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 formal argument pack - script scope", () => {
  it("mentions Shahmukhi only as awareness, not course content", () => {
    expect(formalArgumentScriptAwareness.vi).toContain("Gurmukhi");
    expect(formalArgumentScriptAwareness.en).toContain("Gurmukhi");
    expect(formalArgumentScriptAwareness.vi).toContain("Shahmukhi");
    expect(formalArgumentScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = formalArgumentC1.flatMap((entry) => [
      entry.title_pa,
      entry.canada_example.pa,
      ...entry.argument_frames.map((frame) => frame.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
