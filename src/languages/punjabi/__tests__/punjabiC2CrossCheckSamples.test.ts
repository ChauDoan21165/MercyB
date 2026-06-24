// Punjabi C2 cross-check sample guards. These validate app-consumable
// structure and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_CROSS_CHECK_SAMPLES_DISCLAIMER,
  c2CrossCheckSamples,
  c2CrossCheckSamplesByContext,
  c2CrossCheckSamplesByFocus,
  type PunjabiC2CrossCheckContext,
  type PunjabiC2CrossCheckFocus,
  type PunjabiC2CrossCheckSample,
} from "@/languages/punjabi/c2CrossCheckSamples";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2CrossCheckFocus[] = [
  "nuanced_disagreement",
  "diplomacy",
  "mediation",
  "deescalation",
  "audience_adaptation",
  "sensitive_topic_framing",
  "public_communication_calibration",
  "register_safety",
];

const REQUIRED_CONTEXTS: PunjabiC2CrossCheckContext[] = ["public", "professional", "community"];

describe("Punjabi C2 cross-check samples - coverage", () => {
  it("ships a compact app-consumable cross-check set", () => {
    expect(c2CrossCheckSamples.length).toBeGreaterThanOrEqual(8);
    expect(c2CrossCheckSamples.length).toBeLessThanOrEqual(12);
  });

  it("covers every required cross-check focus", () => {
    const seen = new Set(c2CrossCheckSamples.map((item) => item.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("covers public, professional, and community contexts", () => {
    const seen = new Set(c2CrossCheckSamples.map((item) => item.context));
    for (const context of REQUIRED_CONTEXTS) {
      expect(seen.has(context), `missing context ${context}`).toBe(true);
      expect(c2CrossCheckSamplesByContext(context).every((item) => item.context === context)).toBe(true);
    }
  });

  it("has unique non-empty ids and focus filter", () => {
    const ids = c2CrossCheckSamples.map((item) => item.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    for (const focus of REQUIRED_FOCUSES) {
      const subset = c2CrossCheckSamplesByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((item) => item.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 cross-check samples - bilingual integrity", () => {
  it("each item has VI+EN scenario and cross-check goal", () => {
    for (const item of c2CrossCheckSamples) {
      expect(item.title_vi.length, `${item.id} title_vi`).toBeGreaterThan(0);
      expect(item.title_en.length, `${item.id} title_en`).toBeGreaterThan(0);
      expect(item.scenario_vi.length, `${item.id} scenario_vi`).toBeGreaterThan(0);
      expect(item.scenario_en.length, `${item.id} scenario_en`).toBeGreaterThan(0);
      expect(item.cross_check_goal_vi.length, `${item.id} goal_vi`).toBeGreaterThan(0);
      expect(item.cross_check_goal_en.length, `${item.id} goal_en`).toBeGreaterThan(0);
    }
  });

  it("each sample and phrase has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const item of c2CrossCheckSamples) {
      expect(hasGurmukhi(item.sample_gurmukhi), `${item.id} sample_gurmukhi`).toBe(true);
      expect(item.sample_romanization.length, `${item.id} sample_romanization`).toBeGreaterThan(0);
      expect(item.sample_vi.length, `${item.id} sample_vi`).toBeGreaterThan(0);
      expect(item.sample_en.length, `${item.id} sample_en`).toBeGreaterThan(0);
      expect(item.cross_check_phrases.length, `${item.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of item.cross_check_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${item.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${item.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${item.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${item.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes cross-check, verification, pre-integration, and readiness styles", () => {
    const styles = new Set(c2CrossCheckSamples.map((item) => item.style));
    expect(styles.has("cross_check")).toBe(true);
    expect(styles.has("verification")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
    expect(styles.has("readiness")).toBe(true);
  });

  it("each item carries register-safety guards", () => {
    for (const item of c2CrossCheckSamples) {
      expect(item.guards.length, `${item.id} guards`).toBeGreaterThanOrEqual(1);
      for (const guard of item.guards) {
        expect(guard.check_vi.length, `${item.id} check_vi`).toBeGreaterThan(0);
        expect(guard.check_en.length, `${item.id} check_en`).toBeGreaterThan(0);
        expect(guard.safe_signal_vi.length, `${item.id} signal_vi`).toBeGreaterThan(0);
        expect(guard.safe_signal_en.length, `${item.id} signal_en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(c2CrossCheckSamples.filter((item) => item.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaItems = c2CrossCheckSamples.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaItems).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 cross-check samples - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_CROSS_CHECK_SAMPLES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_CROSS_CHECK_SAMPLES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_CROSS_CHECK_SAMPLES_DISCLAIMER.vi} ${C2_CROSS_CHECK_SAMPLES_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(c2CrossCheckSamples).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2CrossCheckSample[] = c2CrossCheckSamples;
void _typecheck;
