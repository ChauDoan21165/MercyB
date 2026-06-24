import { describe, expect, it } from "vitest";

import { integratedAcademicTasksC1, integratedAcademicTasksScriptAwareness } from "../integratedAcademicTasksC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_FOCUS = [
  "source_summary",
  "evidence_comparison",
  "cautious_claim",
  "formal_writing",
  "presentation_response",
  "public_professional_text",
] as const;

describe("Punjabi C1 integrated academic tasks - app data contract", () => {
  it("contains a compact useful set with stable ids", () => {
    expect(integratedAcademicTasksC1.length).toBeGreaterThanOrEqual(5);
    expect(integratedAcademicTasksC1.length).toBeLessThanOrEqual(12);

    const ids = integratedAcademicTasksC1.map((task) => task.id);
    expect(ids.every((id) => id.startsWith("pa_c1_integrated_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(integratedAcademicTasksC1.every((task) => task.level === "C1")).toBe(true);
  });

  it("covers all Wave 14 integration focus areas", () => {
    const present = new Set(integratedAcademicTasksC1.map((task) => task.focus));
    for (const focus of REQUIRED_FOCUS) {
      expect(present.has(focus)).toBe(true);
    }
  });

  it("includes integration routing decisions", () => {
    const routes = new Set(integratedAcademicTasksC1.map((task) => task.route_if_weak));
    expect(routes.has("capstone_ready")).toBe(true);
    expect(routes.has("review_then_try")).toBe(true);
    expect(routes.has("targeted_practice")).toBe(true);

    for (const task of integratedAcademicTasksC1) {
      expect(task.routing_note_vi.trim().length).toBeGreaterThan(0);
      expect(task.routing_note_en.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi C1 integrated academic tasks - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi task titles and input briefs with romanization, Vietnamese, and English", () => {
    for (const task of integratedAcademicTasksC1) {
      expect(GURMUKHI.test(task.title_pa)).toBe(true);
      expect(task.title_rom.trim().length).toBeGreaterThan(0);
      expect(task.title_vi.trim().length).toBeGreaterThan(0);
      expect(task.title_en.trim().length).toBeGreaterThan(0);
      expect(task.integrated_goal_vi.trim().length).toBeGreaterThan(0);
      expect(task.integrated_goal_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(task.input_brief.pa)).toBe(true);
      expect(task.input_brief.rom.trim().length).toBeGreaterThan(0);
      expect(task.input_brief.vi.trim().length).toBeGreaterThan(0);
      expect(task.input_brief.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes required moves, output formats, and reusable language frames", () => {
    for (const task of integratedAcademicTasksC1) {
      expect(task.required_moves_vi.length).toBeGreaterThanOrEqual(3);
      expect(task.required_moves_en.length).toBeGreaterThanOrEqual(3);
      expect(task.output_format_vi.trim().length).toBeGreaterThan(0);
      expect(task.output_format_en.trim().length).toBeGreaterThan(0);

      expect(task.language_frames.length).toBeGreaterThanOrEqual(3);
      for (const frame of task.language_frames) {
        expect(GURMUKHI.test(frame.pa)).toBe(true);
        expect(frame.rom.trim().length).toBeGreaterThan(0);
        expect(frame.vi.trim().length).toBeGreaterThan(0);
        expect(frame.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const task of integratedAcademicTasksC1) {
      expect(task.canada_example.context_vi).toContain("Canada");
      expect(task.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(task.canada_example.pa)).toBe(true);
      expect(task.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(task.canada_example.vi).toContain("Canada");
      expect(task.canada_example.en).toMatch(/Canada|Canadian/);
      expect(task.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(task.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 integrated academic tasks - script scope", () => {
  it("mentions Shahmukhi only as awareness, not integration content", () => {
    expect(integratedAcademicTasksScriptAwareness.vi).toContain("Gurmukhi");
    expect(integratedAcademicTasksScriptAwareness.en).toContain("Gurmukhi");
    expect(integratedAcademicTasksScriptAwareness.vi).toContain("Shahmukhi");
    expect(integratedAcademicTasksScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = integratedAcademicTasksC1.flatMap((task) => [
      task.title_pa,
      task.input_brief.pa,
      task.canada_example.pa,
      ...task.language_frames.map((frame) => frame.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
