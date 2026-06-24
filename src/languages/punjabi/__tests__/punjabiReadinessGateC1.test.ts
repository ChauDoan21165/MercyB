import { describe, expect, it } from "vitest";

import { readinessGateC1, readinessGateScriptAwareness } from "../readinessGateC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_SKILLS = [
  "formal_writing",
  "source_summary",
  "cautious_argument",
  "presentation_language",
  "academic_register",
  "public_service_text",
  "professional_text",
] as const;

describe("Punjabi C1 readiness gate - app data contract", () => {
  it("contains a compact readiness set with stable ids", () => {
    expect(readinessGateC1.length).toBeGreaterThanOrEqual(7);
    expect(readinessGateC1.length).toBeLessThanOrEqual(12);

    const ids = readinessGateC1.map((item) => item.id);
    expect(ids.every((id) => id.startsWith("pa_c1_gate_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(readinessGateC1.every((item) => item.level === "C1")).toBe(true);
  });

  it("covers all Wave 11 readiness skills", () => {
    const present = new Set(readinessGateC1.map((item) => item.area));
    for (const skill of REQUIRED_SKILLS) {
      expect(present.has(skill)).toBe(true);
    }
  });

  it("includes readiness routing decisions", () => {
    for (const item of readinessGateC1) {
      expect(item.routing.ready_c1_vi.trim().length).toBeGreaterThan(0);
      expect(item.routing.ready_c1_en.trim().length).toBeGreaterThan(0);
      expect(item.routing.review_targeted_vi.trim().length).toBeGreaterThan(0);
      expect(item.routing.review_targeted_en.trim().length).toBeGreaterThan(0);
      expect(item.routing.repeat_foundation_vi.trim().length).toBeGreaterThan(0);
      expect(item.routing.repeat_foundation_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 readiness gate - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English", () => {
    for (const item of readinessGateC1) {
      expect(GURMUKHI.test(item.title_pa)).toBe(true);
      expect(item.title_rom.trim().length).toBeGreaterThan(0);
      expect(item.title_vi.trim().length).toBeGreaterThan(0);
      expect(item.title_en.trim().length).toBeGreaterThan(0);
      expect(item.readiness_goal_vi.trim().length).toBeGreaterThan(0);
      expect(item.readiness_goal_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes gate prompts, sample ready responses, and pass indicators", () => {
    for (const item of readinessGateC1) {
      expect(GURMUKHI.test(item.checkpoint_prompt.pa)).toBe(true);
      expect(item.checkpoint_prompt.rom.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_prompt.vi.trim().length).toBeGreaterThan(0);
      expect(item.checkpoint_prompt.en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(item.sample_ready_response.pa)).toBe(true);
      expect(item.sample_ready_response.rom.trim().length).toBeGreaterThan(0);
      expect(item.sample_ready_response.vi.trim().length).toBeGreaterThan(0);
      expect(item.sample_ready_response.en.trim().length).toBeGreaterThan(0);

      expect(item.passing_response_features_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.passing_response_features_en.length).toBeGreaterThanOrEqual(3);
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const item of readinessGateC1) {
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

describe("Punjabi C1 readiness gate - script scope", () => {
  it("mentions Shahmukhi only as awareness, not readiness content", () => {
    expect(readinessGateScriptAwareness.vi).toContain("Gurmukhi");
    expect(readinessGateScriptAwareness.en).toContain("Gurmukhi");
    expect(readinessGateScriptAwareness.vi).toContain("Shahmukhi");
    expect(readinessGateScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = readinessGateC1.flatMap((item) => [
      item.title_pa,
      item.checkpoint_prompt.pa,
      item.sample_ready_response.pa,
      item.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
