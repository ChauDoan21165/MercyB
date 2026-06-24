// Punjabi C2 integrated discourse task guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER,
  integratedDiscourseTasksC2,
  integratedDiscourseTasksC2ByFocus,
  type PunjabiC2IntegratedFocus,
  type PunjabiC2IntegratedTask,
} from "@/languages/punjabi/integratedDiscourseTasksC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2IntegratedFocus[] = [
  "negotiation_diplomacy",
  "deescalation_register",
  "sensitive_community",
  "professional_repair",
  "public_notice",
  "nuanced_disagreement",
  "community_mediation",
  "handoff_readiness",
];

describe("Punjabi C2 integrated discourse tasks — coverage", () => {
  it("ships a compact app-consumable integrated task pack", () => {
    expect(integratedDiscourseTasksC2.length).toBeGreaterThanOrEqual(8);
    expect(integratedDiscourseTasksC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required integrated focus", () => {
    const seen = new Set(integratedDiscourseTasksC2.map((task) => task.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = integratedDiscourseTasksC2.map((task) => task.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("integratedDiscourseTasksC2ByFocus returns only matching tasks", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = integratedDiscourseTasksC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((task) => task.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 integrated discourse tasks — bilingual integrity", () => {
  it("each task has VI+EN scenario and task instructions", () => {
    for (const task of integratedDiscourseTasksC2) {
      expect(task.title_vi.length, `${task.id} title_vi`).toBeGreaterThan(0);
      expect(task.title_en.length, `${task.id} title_en`).toBeGreaterThan(0);
      expect(task.scenario_vi.length, `${task.id} scenario_vi`).toBeGreaterThan(0);
      expect(task.scenario_en.length, `${task.id} scenario_en`).toBeGreaterThan(0);
      expect(task.task_vi.length, `${task.id} task_vi`).toBeGreaterThan(0);
      expect(task.task_en.length, `${task.id} task_en`).toBeGreaterThan(0);
    }
  });

  it("each model has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const task of integratedDiscourseTasksC2) {
      expect(hasGurmukhi(task.model_gurmukhi), `${task.id} model_gurmukhi`).toBe(true);
      expect(task.model_romanization.length, `${task.id} romanization`).toBeGreaterThan(0);
      expect(task.model_vi.length, `${task.id} model_vi`).toBeGreaterThan(0);
      expect(task.model_en.length, `${task.id} model_en`).toBeGreaterThan(0);
    }
  });

  it("each task integrates multiple C2 discourse skills", () => {
    for (const task of integratedDiscourseTasksC2) {
      expect(task.skills.length, `${task.id} skills`).toBeGreaterThanOrEqual(3);
    }
    const allSkills = new Set(integratedDiscourseTasksC2.flatMap((task) => task.skills));
    expect(allSkills.has("negotiation")).toBe(true);
    expect(allSkills.has("diplomacy")).toBe(true);
    expect(allSkills.has("deescalation")).toBe(true);
    expect(allSkills.has("sensitive_topic_framing")).toBe(true);
    expect(allSkills.has("advanced_register")).toBe(true);
    expect(allSkills.has("public_discourse")).toBe(true);
  });

  it("each useful phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const task of integratedDiscourseTasksC2) {
      expect(task.useful_phrases.length, `${task.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of task.useful_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${task.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${task.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${task.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${task.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes integration-readiness review and routing items", () => {
    const modes = new Set(integratedDiscourseTasksC2.map((task) => task.mode));
    expect(modes.has("readiness")).toBe(true);
    expect(modes.has("review")).toBe(true);
    expect(modes.has("routing")).toBe(true);
    for (const task of integratedDiscourseTasksC2) {
      expect(task.checkpoints.length, `${task.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(task.routing.route_vi.length, `${task.id} routing vi`).toBeGreaterThan(0);
      expect(task.routing.route_en.length, `${task.id} routing en`).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(integratedDiscourseTasksC2.filter((task) => task.learner_trap).length).toBeGreaterThanOrEqual(5);
    const canadaTasks = integratedDiscourseTasksC2.filter((task) => task.canada_practical);
    expect(canadaTasks.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaTasks).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 integrated discourse tasks — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER.vi} ${C2_INTEGRATED_DISCOURSE_TASKS_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in tasks", () => {
    const blob = JSON.stringify(integratedDiscourseTasksC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2IntegratedTask[] = integratedDiscourseTasksC2;
void _typecheck;
