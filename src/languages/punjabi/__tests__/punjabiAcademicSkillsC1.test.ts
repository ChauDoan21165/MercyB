import { describe, expect, it } from "vitest";

import { academicSkillsC1, scriptAwareness } from "../academicSkillsC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const CATEGORIES = [
  "summarize_argument",
  "compare_sources",
  "cautious_claims",
  "cause_effect",
  "evidence",
  "academic_disagreement",
  "essay_paragraph_frames",
  "presentation_phrases",
] as const;

describe("Punjabi C1 academic skills - app data contract", () => {
  it("contains a compact useful C1 skill set with unique ids", () => {
    expect(academicSkillsC1.length).toBeGreaterThanOrEqual(8);
    expect(academicSkillsC1.length).toBeLessThanOrEqual(16);

    const ids = academicSkillsC1.map((skill) => skill.id);
    expect(ids.every((id) => id.startsWith("pa_c1_skill_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(academicSkillsC1.every((skill) => skill.level === "C1")).toBe(true);
  });

  it("covers every required Wave 4 skill area", () => {
    const present = new Set(academicSkillsC1.map((skill) => skill.category));
    for (const category of CATEGORIES) {
      expect(present.has(category)).toBe(true);
    }
  });
});

describe("Punjabi C1 academic skills - bilingual Gurmukhi fields", () => {
  it("uses Gurmukhi primary titles with romanization, Vietnamese, and English", () => {
    for (const skill of academicSkillsC1) {
      expect(GURMUKHI.test(skill.title_pa)).toBe(true);
      expect(skill.title_rom.trim().length).toBeGreaterThan(0);
      expect(skill.title_vi.trim().length).toBeGreaterThan(0);
      expect(skill.title_en.trim().length).toBeGreaterThan(0);
      expect(skill.skill_goal_vi.trim().length).toBeGreaterThan(0);
      expect(skill.skill_goal_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes usable phrases with romanization, Vietnamese, and English", () => {
    for (const skill of academicSkillsC1) {
      expect(skill.core_phrases.length).toBeGreaterThanOrEqual(3);
      for (const phrase of skill.core_phrases) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples in both learner languages", () => {
    for (const skill of academicSkillsC1) {
      expect(skill.canada_example.context_vi).toMatch(/Canada|Canada/i);
      expect(skill.canada_example.context_en).toMatch(/Canada|Canadian/i);
      expect(GURMUKHI.test(skill.canada_example.pa)).toBe(true);
      expect(skill.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(skill.canada_example.vi.trim().length).toBeGreaterThan(0);
      expect(skill.canada_example.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps and practice tasks", () => {
    for (const skill of academicSkillsC1) {
      expect(skill.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(skill.learner_traps_en.length).toBeGreaterThanOrEqual(2);
      expect(skill.practice_task_vi.trim().length).toBeGreaterThan(0);
      expect(skill.practice_task_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 academic skills - script scope", () => {
  it("mentions Shahmukhi only as awareness, not as full course content", () => {
    expect(scriptAwareness.vi).toContain("Shahmukhi");
    expect(scriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = academicSkillsC1.flatMap((skill) => [
      skill.title_pa,
      skill.canada_example.pa,
      ...skill.core_phrases.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
