import { describe, expect, it } from "vitest";

import { capstoneTasksC1, capstoneTasksScriptAwareness } from "../capstoneTasksC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const TASK_TYPES = [
  "summarize_source",
  "present_argument",
  "compare_evidence",
  "cautious_claims",
  "formal_writing",
  "presentation_response",
  "public_service_text_handling",
  "academic_text_handling",
] as const;

describe("Punjabi C1 capstone tasks - app data contract", () => {
  it("contains a compact useful capstone set with stable ids", () => {
    expect(capstoneTasksC1.length).toBeGreaterThanOrEqual(8);
    expect(capstoneTasksC1.length).toBeLessThanOrEqual(14);

    const ids = capstoneTasksC1.map((task) => task.id);
    expect(ids.every((id) => id.startsWith("pa_c1_capstone_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(capstoneTasksC1.every((task) => task.level === "C1")).toBe(true);
  });

  it("covers every Wave 10 capstone skill area", () => {
    const present = new Set(capstoneTasksC1.map((task) => task.skill));
    for (const taskType of TASK_TYPES) {
      expect(present.has(taskType)).toBe(true);
    }
  });

  it("uses capstone and checkpoint modes for integrated assessment", () => {
    const modes = new Set(capstoneTasksC1.map((task) => task.mode));
    expect(modes.has("checkpoint")).toBe(true);
    expect(modes.has("integrated_task")).toBe(true);
    expect(modes.has("final_task")).toBe(true);
  });
});

describe("Punjabi C1 capstone tasks - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi titles with romanization, Vietnamese, and English support", () => {
    for (const task of capstoneTasksC1) {
      expect(GURMUKHI.test(task.title_pa)).toBe(true);
      expect(task.title_rom.trim().length).toBeGreaterThan(0);
      expect(task.title_vi.trim().length).toBeGreaterThan(0);
      expect(task.title_en.trim().length).toBeGreaterThan(0);
      expect(task.task_goal_vi.trim().length).toBeGreaterThan(0);
      expect(task.task_goal_en.trim().length).toBeGreaterThan(0);
      expect(task.expected_output_vi.trim().length).toBeGreaterThan(0);
      expect(task.expected_output_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes source prompts and reusable response frames", () => {
    for (const task of capstoneTasksC1) {
      expect(GURMUKHI.test(task.input_context.pa)).toBe(true);
      expect(task.input_context.rom.trim().length).toBeGreaterThan(0);
      expect(task.input_context.vi.trim().length).toBeGreaterThan(0);
      expect(task.input_context.en.trim().length).toBeGreaterThan(0);

      expect(task.useful_frames.length).toBeGreaterThanOrEqual(3);
      for (const frame of task.useful_frames) {
        expect(GURMUKHI.test(frame.pa)).toBe(true);
        expect(frame.rom.trim().length).toBeGreaterThan(0);
        expect(frame.vi.trim().length).toBeGreaterThan(0);
        expect(frame.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes checkpoint criteria and learner traps", () => {
    for (const task of capstoneTasksC1) {
      expect(task.success_criteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(task.success_criteria_en.length).toBeGreaterThanOrEqual(3);
      expect(task.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(task.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("includes Canada-practical scenarios for learners", () => {
    for (const task of capstoneTasksC1) {
      expect(task.canada_example.context_vi).toContain("Canada");
      expect(task.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(task.canada_example.pa)).toBe(true);
      expect(task.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(task.canada_example.vi).toContain("Canada");
      expect(task.canada_example.en).toMatch(/Canada|Canadian/);
    }
  });
});

describe("Punjabi C1 capstone tasks - script scope", () => {
  it("mentions Shahmukhi only as awareness, not learner course content", () => {
    expect(capstoneTasksScriptAwareness.vi).toContain("Gurmukhi");
    expect(capstoneTasksScriptAwareness.en).toContain("Gurmukhi");
    expect(capstoneTasksScriptAwareness.vi).toContain("Shahmukhi");
    expect(capstoneTasksScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = capstoneTasksC1.flatMap((task) => [
      task.title_pa,
      task.input_context.pa,
      task.canada_example.pa,
      ...task.useful_frames.map((frame) => frame.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
