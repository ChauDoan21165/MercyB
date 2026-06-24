// Punjabi C2 pre-seal sample guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_PRE_SEAL_SAMPLES_DISCLAIMER,
  c2SealSamples,
  c2SealSamplesByContext,
  c2SealSamplesByFocus,
  type PunjabiC2SealContext,
  type PunjabiC2SealFocus,
  type PunjabiC2SealSample,
} from "@/languages/punjabi/c2SealSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2SealFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2SealContext[] = ["public", "professional", "community"];

describe("Punjabi C2 pre-seal samples - coverage", () => {
  it("ships a compact app-consumable pre-seal sample set", () => {
    expect(c2SealSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2SealSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required pre-seal focus", () => {
    const seen = new Set(c2SealSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2SealSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
      expect(c2SealSamplesByContext(context).every((item) => item.context === context)).toBe(true);
    }
  });

  it("has unique ids and focus filter", () => {
    const ids = c2SealSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    for (const focus of REQUIRED_FOCUSES) {
      const subset = c2SealSamplesByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 pre-seal samples - bilingual integrity", () => {
  it("each item has VI+EN scenario and pre-seal goal", () => {
    for (const item of c2SealSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.readiness_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.readiness_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each sample and phrase has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2SealSamples) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
      expect(item.pre_seal_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.pre_seal_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes pre-seal, runner-readiness, pipeline-readiness, and pre-integration styles", () => {
    const styles = new Set(c2SealSamples.map((item) => item.style));
    expect(styles.has("pre_seal")).toBe(true);
    expect(styles.has("runner_readiness")).toBe(true);
    expect(styles.has("pipeline_readiness")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });

  it("each item carries pre-seal checks", () => {
    for (const item of c2SealSamples) {
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
    expect(c2SealSamples.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaItems = c2SealSamples.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 pre-seal samples - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_PRE_SEAL_SAMPLES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_PRE_SEAL_SAMPLES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_PRE_SEAL_SAMPLES_DISCLAIMER.vi} ${C2_PRE_SEAL_SAMPLES_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(c2SealSamples).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2SealSample[] = c2SealSamples;
void _typecheck;
