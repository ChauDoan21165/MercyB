// Punjabi C2 learner journey guards. These validate app-consumable structure
// and scope, not certification, official placement, or native-level authority.

import { describe, expect, it } from "vitest";

import {
  C2_LEARNER_JOURNEY_DISCLAIMER,
  learnerJourneyC2,
  learnerJourneyC2ByStage,
  type PunjabiC2JourneyStage,
  type PunjabiC2JourneyStep,
} from "@/languages/punjabi/learnerJourneyC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_STAGES: PunjabiC2JourneyStage[] = [
  "advanced_register",
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "deescalation",
  "sensitive_topic_framing",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
  "handoff_readiness",
];

describe("Punjabi C2 learner journey — coverage", () => {
  it("ships a compact app-consumable learner journey", () => {
    expect(learnerJourneyC2.length).toBeGreaterThanOrEqual(10);
    expect(learnerJourneyC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required C2 journey stage", () => {
    const seen = new Set(learnerJourneyC2.map((step) => step.stage));
    for (const stage of REQUIRED_STAGES) {
      expect(seen.has(stage), `missing stage ${stage}`).toBe(true);
    }
  });

  it("has unique non-empty ids and ordered steps", () => {
    const ids = learnerJourneyC2.map((step) => step.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(learnerJourneyC2.map((step) => step.order)).toEqual([...learnerJourneyC2.map((step) => step.order)].sort((a, b) => a - b));
  });

  it("learnerJourneyC2ByStage returns only matching steps", () => {
    for (const stage of REQUIRED_STAGES) {
      const subset = learnerJourneyC2ByStage(stage);
      expect(subset.length, stage).toBeGreaterThan(0);
      expect(subset.every((step) => step.stage === stage), stage).toBe(true);
    }
  });
});

describe("Punjabi C2 learner journey — bilingual integrity", () => {
  it("each step has VI+EN goal and scenario", () => {
    for (const step of learnerJourneyC2) {
      expect(step.title_vi.length, `${step.id} title_vi`).toBeGreaterThan(0);
      expect(step.title_en.length, `${step.id} title_en`).toBeGreaterThan(0);
      expect(step.learner_goal_vi.length, `${step.id} goal_vi`).toBeGreaterThan(0);
      expect(step.learner_goal_en.length, `${step.id} goal_en`).toBeGreaterThan(0);
      expect(step.scenario_vi.length, `${step.id} scenario_vi`).toBeGreaterThan(0);
      expect(step.scenario_en.length, `${step.id} scenario_en`).toBeGreaterThan(0);
    }
  });

  it("each sample has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const step of learnerJourneyC2) {
      expect(hasGurmukhi(step.sample_gurmukhi), `${step.id} sample_gurmukhi`).toBe(true);
      expect(step.sample_romanization.length, `${step.id} sample_romanization`).toBeGreaterThan(0);
      expect(step.sample_vi.length, `${step.id} sample_vi`).toBeGreaterThan(0);
      expect(step.sample_en.length, `${step.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each key phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const step of learnerJourneyC2) {
      expect(step.key_phrases.length, `${step.id} key phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of step.key_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${step.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${step.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${step.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${step.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner-journey handoff and readiness style items", () => {
    const modes = new Set(learnerJourneyC2.map((step) => step.mode));
    expect(modes.has("handoff")).toBe(true);
    expect(modes.has("readiness")).toBe(true);
    for (const step of learnerJourneyC2) {
      expect(step.checkpoints.length, `${step.id} checkpoints`).toBeGreaterThanOrEqual(1);
      expect(step.handoff.next_vi.length, `${step.id} next_vi`).toBeGreaterThan(0);
      expect(step.handoff.next_en.length, `${step.id} next_en`).toBeGreaterThan(0);
      expect(step.handoff.ready_when_vi.length, `${step.id} ready_when_vi`).toBeGreaterThan(0);
      expect(step.handoff.ready_when_en.length, `${step.id} ready_when_en`).toBeGreaterThan(0);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(learnerJourneyC2.filter((step) => step.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaSteps = learnerJourneyC2.filter((step) => step.canada_practical);
    expect(canadaSteps.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaSteps).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 learner journey — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_LEARNER_JOURNEY_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_LEARNER_JOURNEY_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_LEARNER_JOURNEY_DISCLAIMER.vi} ${C2_LEARNER_JOURNEY_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in steps", () => {
    const blob = JSON.stringify(learnerJourneyC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2JourneyStep[] = learnerJourneyC2;
void _typecheck;
