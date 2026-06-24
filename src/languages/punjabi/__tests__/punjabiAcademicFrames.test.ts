import { describe, expect, it } from "vitest";

import { academicFrames } from "../academicFrames";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const LEVELS = ["B2", "C1", "C2"] as const;
const CATEGORIES = [
  "introduce_topic",
  "cite_evidence",
  "contrast",
  "concession",
  "cause_effect",
  "evaluate",
  "define",
  "summarize",
  "conclude",
  "polite_disagree",
] as const;

describe("Punjabi academic frames - size, ids, and levels", () => {
  it("contains 40-80 compact frames", () => {
    expect(academicFrames.length).toBeGreaterThanOrEqual(40);
    expect(academicFrames.length).toBeLessThanOrEqual(80);
  });

  it("uses unique stable ids", () => {
    const ids = academicFrames.map((frame) => frame.id);
    expect(ids.every((id) => id.startsWith("pa_af_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only B2-C2 levels and includes each level", () => {
    const allowed = new Set<string>(LEVELS);
    expect(academicFrames.every((frame) => allowed.has(frame.level))).toBe(true);

    const present = new Set(academicFrames.map((frame) => frame.level));
    for (const level of LEVELS) {
      expect(present.has(level)).toBe(true);
    }
  });
});

describe("Punjabi academic frames - category coverage", () => {
  it("uses only the requested categories", () => {
    const allowed = new Set<string>(CATEGORIES);
    expect(academicFrames.every((frame) => allowed.has(frame.category))).toBe(true);
  });

  it("covers all requested academic and essay topics", () => {
    const present = new Set(academicFrames.map((frame) => frame.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi academic frames - bilingual Gurmukhi contract", () => {
  it("has Gurmukhi frames with romanization, Vietnamese, and English", () => {
    for (const frame of academicFrames) {
      expect(GURMUKHI.test(frame.frame_pa)).toBe(true);
      expect(frame.frame_rom.trim().length).toBeGreaterThan(0);
      expect(frame.frame_vi.trim().length).toBeGreaterThan(0);
      expect(frame.frame_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("has use cases, cautions, and practice prompts in Vietnamese and English", () => {
    for (const frame of academicFrames) {
      expect(frame.use_case_vi.trim().length).toBeGreaterThan(0);
      expect(frame.use_case_en.trim().length).toBeGreaterThan(0);
      expect(frame.cautions_vi.trim().length).toBeGreaterThan(0);
      expect(frame.cautions_en.trim().length).toBeGreaterThan(0);
      expect(frame.practice_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(frame.practice_prompt_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("has at least one fully bilingual Gurmukhi example per frame", () => {
    for (const frame of academicFrames) {
      expect(frame.examples.length).toBeGreaterThanOrEqual(1);
      for (const example of frame.examples) {
        expect(GURMUKHI.test(example.pa)).toBe(true);
        expect(example.rom.trim().length).toBeGreaterThan(0);
        expect(example.vi.trim().length).toBeGreaterThan(0);
        expect(example.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("keeps Shahmukhi out of learner frame content", () => {
    const learnerContent = academicFrames.flatMap((frame) => [
      frame.frame_pa,
      ...frame.examples.map((example) => example.pa),
    ]);
    expect(learnerContent.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
