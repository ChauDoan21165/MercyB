// src/languages/punjabi/__tests__/punjabiScriptVocabularyLearnerJourney.test.ts
//
// Structural guards for the Punjabi script vocabulary learner journey.
// Native linguistic review is intentionally deferred.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY,
  PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_SCOPE,
  PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS,
  type PunjabiJourneyStage,
} from "@/languages/punjabi/scriptVocabularyLearnerJourney";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const REQUIRED_STAGES: ReadonlyArray<PunjabiJourneyStage> = [
  "gurmukhi_letters",
  "vowel_signs",
  "addak_tippi_bindi",
  "survival_signage",
  "thematic_vocabulary",
  "verbs",
  "collocations",
  "romanization_bridge",
  "shahmukhi_awareness",
];

describe("Punjabi script vocabulary learner journey", () => {
  it("is app-consumable sectioned TypeScript data", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY.length).toBe(REQUIRED_STAGES.length);
    for (const section of PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY) {
      expect(section.title_vi.trim().length).toBeGreaterThan(0);
      expect(section.title_en.trim().length).toBeGreaterThan(0);
      expect(section.journeyPurpose_vi.trim().length).toBeGreaterThan(30);
      expect(section.journeyPurpose_en.trim().length).toBeGreaterThan(30);
      expect(section.steps.length).toBeGreaterThan(0);
    }
  });

  it("covers all Wave 15 journey stages", () => {
    const stages = new Set(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY.map((section) => section.stage));
    for (const stage of REQUIRED_STAGES) {
      expect(stages.has(stage), `missing ${stage}`).toBe(true);
    }
  });

  it("has enough compact learner-journey steps to be useful", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.length).toBeGreaterThanOrEqual(24);
    expect(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.length).toBeLessThanOrEqual(60);
  });

  it("uses Gurmukhi primary with bilingual goals, practice, handoff, and readiness checks", () => {
    for (const step of PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS) {
      expect(GURMUKHI_RANGE.test(step.gurmukhiAnchor), `Gurmukhi for ${step.id}`).toBe(true);
      expect(step.learnerGoal_vi.trim().length, `goal vi for ${step.id}`).toBeGreaterThan(25);
      expect(step.learnerGoal_en.trim().length, `goal en for ${step.id}`).toBeGreaterThan(25);
      expect(step.practice_vi.trim().length, `practice vi for ${step.id}`).toBeGreaterThan(20);
      expect(step.practice_en.trim().length, `practice en for ${step.id}`).toBeGreaterThan(20);
      expect(step.handoff_vi.trim().length, `handoff vi for ${step.id}`).toBeGreaterThan(25);
      expect(step.handoff_en.trim().length, `handoff en for ${step.id}`).toBeGreaterThan(25);
      expect(step.readinessCheck_vi.trim().length, `readiness vi for ${step.id}`).toBeGreaterThan(20);
      expect(step.readinessCheck_en.trim().length, `readiness en for ${step.id}`).toBeGreaterThan(20);
    }
  });

  it("keeps ids unique and stages aligned", () => {
    const ids = new Set<string>();
    for (const section of PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY) {
      for (const step of section.steps) {
        expect(ids.has(step.id), `duplicate id: ${step.id}`).toBe(false);
        expect(step.stage).toBe(section.stage);
        ids.add(step.id);
      }
    }
  });

  it("includes romanization, traps, Canada examples, journey checkpoints, and handoff readiness", () => {
    const romanized = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.romanization);
    const traps = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.learnerTrap);
    const canada = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.canadaPractical);
    const checkpoints = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.journeyCheckpoint);
    const handoff = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.handoffReady);
    expect(romanized.length).toBeGreaterThanOrEqual(20);
    expect(traps.length).toBeGreaterThanOrEqual(12);
    expect(canada.length).toBeGreaterThanOrEqual(10);
    expect(checkpoints.length).toBeGreaterThanOrEqual(6);
    expect(handoff.length).toBeGreaterThanOrEqual(8);
  });

  it("walks through the requested script and vocabulary domains", () => {
    const blob = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS
      .map((step) => `${step.stage} ${step.gurmukhiAnchor} ${step.romanization ?? ""} ${step.learnerGoal_vi} ${step.learnerGoal_en} ${step.practice_vi} ${step.practice_en}`)
      .join(" ");
    expect(blob).toMatch(/ਕ \/ ਖ|ਤ \/ ਟ|ਸ \/ ਸ਼/);
    expect(blob).toMatch(/ਕਿ \/ ਕੀ|ਕੁ \/ ਕੂ|ਕੇ \/ ਕੈ \/ ਕੌ/);
    expect(blob).toMatch(/ਬੱਸ ਅੱਡਾ|ਮਾਂ|ਪੰਜਾਬ/);
    expect(blob).toMatch(/ਨਿਕਾਸ|ਐਮਰਜੈਂਸੀ|ਫਾਰਮੇਸੀ/);
    expect(blob).toMatch(/ਪਰਿਵਾਰ|ਦਵਾਈ|ਕਿਰਾਇਆ/);
    expect(blob).toMatch(/ਕਰਨਾ|ਲੈਣਾ|ਸਮਝਣਾ/);
    expect(blob).toMatch(/ਮਦਦ ਚਾਹੀਦੀ ਹੈ|ਫਾਰਮ ਭਰਨਾ|ਗਲਤੀ ਠੀਕ ਕਰਨਾ/);
    expect(blob).toMatch(/phal\/fal|vadda\/wadda|shahir\/shehar/);
  });

  it("models a real learner journey with ordered statuses", () => {
    const statuses = new Set(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.map((step) => step.status));
    expect(statuses.has("start")).toBe(true);
    expect(statuses.has("practice")).toBe(true);
    expect(statuses.has("handoff")).toBe(true);
    expect(statuses.has("ready")).toBe(true);
  });

  it("keeps Shahmukhi awareness only and native review deferred", () => {
    const shahmukhi = PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_STEPS.filter((step) => step.stage === "shahmukhi_awareness");
    expect(shahmukhi.length).toBe(1);
    const blob = [
      PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_SCOPE.vi,
      PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_SCOPE.en,
      ...shahmukhi.map((step) => `${step.learnerGoal_vi} ${step.learnerGoal_en} ${step.practice_vi} ${step.practice_en} ${step.readinessCheck_vi} ${step.readinessCheck_en}`),
    ].join(" ").toLowerCase();
    expect(blob).toMatch(/not a full shahmukhi course|không phải khóa shahmukhi đầy đủ/);
    expect(blob).toMatch(/native review .*deferred|native review được hoãn/);
    expect(blob).not.toMatch(/native reviewed|reviewed by native|đã được native review/);
  });

  it("does not introduce forbidden integration or scoring concepts", () => {
    expect(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY_SCOPE.noAudioScoringOrIntegration).toBe(true);
    const blob = JSON.stringify(PUNJABI_SCRIPT_VOCABULARY_LEARNER_JOURNEY).toLowerCase();
    expect(blob).not.toMatch(/azure|supabase|auth|billing|rls|pronunciation scoring|audio/);
  });
});
