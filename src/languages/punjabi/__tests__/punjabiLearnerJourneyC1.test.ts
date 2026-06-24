import { describe, expect, it } from "vitest";

import { learnerJourneyC1, learnerJourneyScriptAwareness } from "../learnerJourneyC1";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_STAGES = [
  "formal_writing",
  "source_summary",
  "cautious_claims",
  "evidence_comparison",
  "academic_register",
  "presentation_response",
  "public_service_text",
  "professional_text",
] as const;

describe("Punjabi C1 learner journey - app data contract", () => {
  it("contains a compact learner journey with stable ids", () => {
    expect(learnerJourneyC1.length).toBeGreaterThanOrEqual(8);
    expect(learnerJourneyC1.length).toBeLessThanOrEqual(14);

    const ids = learnerJourneyC1.map((step) => step.id);
    expect(ids.every((id) => id.startsWith("pa_c1_journey_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(learnerJourneyC1.every((step) => step.level === "C1")).toBe(true);
  });

  it("covers the full Wave 15 journey", () => {
    const present = new Set(learnerJourneyC1.map((step) => step.stage));
    for (const stage of REQUIRED_STAGES) {
      expect(present.has(stage)).toBe(true);
    }
  });

  it("includes build, bridge, and handoff readiness stages", () => {
    const readiness = new Set(learnerJourneyC1.map((step) => step.readiness));
    expect(readiness.has("build")).toBe(true);
    expect(readiness.has("bridge")).toBe(true);
    expect(readiness.has("handoff")).toBe(true);
  });
});

describe("Punjabi C1 learner journey - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi journey titles and outcomes with romanization, Vietnamese, and English", () => {
    for (const step of learnerJourneyC1) {
      expect(GURMUKHI.test(step.title_pa)).toBe(true);
      expect(step.title_rom.trim().length).toBeGreaterThan(0);
      expect(step.title_vi.trim().length).toBeGreaterThan(0);
      expect(step.title_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(step.learner_outcome.pa)).toBe(true);
      expect(step.learner_outcome.rom.trim().length).toBeGreaterThan(0);
      expect(step.learner_outcome.vi.trim().length).toBeGreaterThan(0);
      expect(step.learner_outcome.en.trim().length).toBeGreaterThan(0);
      expect(step.handoff_vi.trim().length).toBeGreaterThan(0);
      expect(step.handoff_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes checkpoint tasks, readiness evidence, and support language", () => {
    for (const step of learnerJourneyC1) {
      expect(GURMUKHI.test(step.checkpoint_task.pa)).toBe(true);
      expect(step.checkpoint_task.rom.trim().length).toBeGreaterThan(0);
      expect(step.checkpoint_task.vi.trim().length).toBeGreaterThan(0);
      expect(step.checkpoint_task.en.trim().length).toBeGreaterThan(0);

      expect(step.readiness_evidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(step.readiness_evidence_en.length).toBeGreaterThanOrEqual(3);
      expect(step.support_language.length).toBeGreaterThanOrEqual(2);
      for (const phrase of step.support_language) {
        expect(GURMUKHI.test(phrase.pa)).toBe(true);
        expect(phrase.rom.trim().length).toBeGreaterThan(0);
        expect(phrase.vi.trim().length).toBeGreaterThan(0);
        expect(phrase.en.trim().length).toBeGreaterThan(0);
      }
    }
  });

  it("includes Canada-practical examples and learner traps", () => {
    for (const step of learnerJourneyC1) {
      expect(step.canada_example.context_vi).toContain("Canada");
      expect(step.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(step.canada_example.pa)).toBe(true);
      expect(step.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(step.canada_example.vi).toContain("Canada");
      expect(step.canada_example.en).toMatch(/Canada|Canadian/);
      expect(step.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(step.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 learner journey - script scope", () => {
  it("mentions Shahmukhi only as awareness, not learner-journey content", () => {
    expect(learnerJourneyScriptAwareness.vi).toContain("Gurmukhi");
    expect(learnerJourneyScriptAwareness.en).toContain("Gurmukhi");
    expect(learnerJourneyScriptAwareness.vi).toContain("Shahmukhi");
    expect(learnerJourneyScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = learnerJourneyC1.flatMap((step) => [
      step.title_pa,
      step.learner_outcome.pa,
      step.checkpoint_task.pa,
      step.canada_example.pa,
      ...step.support_language.map((phrase) => phrase.pa),
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });
});
