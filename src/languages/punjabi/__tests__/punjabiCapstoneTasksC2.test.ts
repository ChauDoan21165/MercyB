// Punjabi C2 capstone task guards. These validate app-consumable structure and
// scope, not native-level linguistic authority.

import { describe, expect, it } from "vitest";

import {
  C2_CAPSTONE_TASKS_DISCLAIMER,
  capstoneTasksC2,
  capstoneTasksC2ByFocus,
  type PunjabiC2CapstoneFocus,
  type PunjabiC2CapstoneTask,
} from "@/languages/punjabi/capstoneTasksC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2CapstoneFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "deescalation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_discourse",
  "public_discourse",
  "professional_discourse",
];

describe("Punjabi C2 capstone tasks — coverage", () => {
  it("ships a compact app-consumable capstone pack", () => {
    expect(capstoneTasksC2.length).toBeGreaterThanOrEqual(8);
    expect(capstoneTasksC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 capstone focus", () => {
    const seen = new Set(capstoneTasksC2.map((task) => task.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = capstoneTasksC2.map((task) => task.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("capstoneTasksC2ByFocus returns only matching tasks", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = capstoneTasksC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((task) => task.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 capstone tasks — bilingual integrity", () => {
  it("each task has VI+EN scenario and task instructions", () => {
    for (const task of capstoneTasksC2) {
      expect(task.title_vi.length, `${task.id} title_vi`).toBeGreaterThan(0);
      expect(task.title_en.length, `${task.id} title_en`).toBeGreaterThan(0);
      expect(task.scenario_vi.length, `${task.id} scenario_vi`).toBeGreaterThan(0);
      expect(task.scenario_en.length, `${task.id} scenario_en`).toBeGreaterThan(0);
      expect(task.task_vi.length, `${task.id} task_vi`).toBeGreaterThan(0);
      expect(task.task_en.length, `${task.id} task_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const task of capstoneTasksC2) {
      expect(hasGurmukhi(task.model_gurmukhi), `${task.id} model_gurmukhi`).toBe(true);
      expect(task.model_romanization.length, `${task.id} model_romanization`).toBeGreaterThan(0);
      expect(task.model_vi.length, `${task.id} model_vi`).toBeGreaterThan(0);
      expect(task.model_en.length, `${task.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each task includes useful phrases and checkpoint criteria", () => {
    for (const task of capstoneTasksC2) {
      expect(task.useful_phrases.length, `${task.id} phrases`).toBeGreaterThanOrEqual(2);
      expect(task.checkpoints.length, `${task.id} checkpoints`).toBeGreaterThanOrEqual(1);
      for (const phrase of task.useful_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${task.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${task.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${task.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${task.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(capstoneTasksC2.filter((task) => task.learner_trap).length).toBeGreaterThanOrEqual(4);
    const canadaTasks = capstoneTasksC2.filter((task) => task.canada_practical);
    expect(canadaTasks.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaTasks).toLowerCase()).toContain("canada");
  });

  it("includes capstone/checkpoint style items", () => {
    expect(capstoneTasksC2.some((task) => task.mode === "checkpoint")).toBe(true);
    expect(capstoneTasksC2.every((task) => task.checkpoints.length > 0)).toBe(true);
  });
});

describe("Punjabi C2 capstone tasks — scope framing", () => {
  it("exposes Gurmukhi-primary, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_CAPSTONE_TASKS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_CAPSTONE_TASKS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_CAPSTONE_TASKS_DISCLAIMER.vi} ${C2_CAPSTONE_TASKS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review or certification in task text", () => {
    const blob = JSON.stringify(capstoneTasksC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});

const _typecheck: PunjabiC2CapstoneTask[] = capstoneTasksC2;
void _typecheck;
