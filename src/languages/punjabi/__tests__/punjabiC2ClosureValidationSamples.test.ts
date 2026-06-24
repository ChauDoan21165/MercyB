// Punjabi C2 closure-validation sample guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER,
  c2ClosureValidationSamples,
  c2ClosureValidationSamplesByFocus,
  c2ClosureValidationSamplesByStage,
  type PunjabiC2ClosureValidationFocus,
  type PunjabiC2ClosureValidationSample,
  type PunjabiC2ClosureValidationStage,
} from "@/languages/punjabi/c2ClosureValidationSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2ClosureValidationFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_STAGES: PunjabiC2ClosureValidationStage[] = ["opening", "bridge", "closure"];

describe("Punjabi C2 closure-validation samples - coverage", () => {
  it("ships a compact app-consumable closure-validation set", () => {
    expect(c2ClosureValidationSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2ClosureValidationSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required closure-validation focus", () => {
    const seen = new Set(c2ClosureValidationSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("covers opening, bridge, and closure discourse stages", () => {
    const seen = new Set(c2ClosureValidationSamples.map((item) => item.stage));
    for (const stage of REQUIRED_STAGES) {
      expect(seen.has(stage), `missing stage ${stage}`).toBe(true);
      expect(c2ClosureValidationSamplesByStage(stage).every((item) => item.stage === stage)).toBe(true);
    }
  });

  it("has unique ids and focus filter", () => {
    const ids = c2ClosureValidationSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    for (const focus of REQUIRED_FOCUSES) {
      const subset = c2ClosureValidationSamplesByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 closure-validation samples - bilingual integrity", () => {
  it("each item has VI+EN scenario and closure goal", () => {
    for (const item of c2ClosureValidationSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.closure_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.closure_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each sample and phrase has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2ClosureValidationSamples) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
      expect(item.closure_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.closure_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes closure-validation, final-cross-check, pre-integration, and readiness styles", () => {
    const styles = new Set(c2ClosureValidationSamples.map((item) => item.style));
    expect(styles.has("closure_validation")).toBe(true);
    expect(styles.has("final_cross_check")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
    expect(styles.has("readiness")).toBe(true);
  });

  it("each item carries validation checks", () => {
    for (const item of c2ClosureValidationSamples) {
      expect(item.checks.length, `${item.id} checks`).toBeGreaterThanOrEqual(1);
      for (const check of item.checks) {
        expect(check.check_vi.length, `${item.id} check_vi`).toBeGreaterThan(0);
        expect(check.check_en.length, `${item.id} check_en`).toBeGreaterThan(0);
        expect(check.signal_vi.length, `${item.id} signal_vi`).toBeGreaterThan(0);
        expect(check.signal_en.length, `${item.id} signal_en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(c2ClosureValidationSamples.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaItems = c2ClosureValidationSamples.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 closure-validation samples - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER.vi} ${C2_CLOSURE_VALIDATION_SAMPLES_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(c2ClosureValidationSamples).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2ClosureValidationSample[] = c2ClosureValidationSamples;
void _typecheck;
