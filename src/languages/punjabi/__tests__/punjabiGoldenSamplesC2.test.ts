// Punjabi C2 golden sample guards. These validate app-consumable structure and
// scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_GOLDEN_SAMPLES_DISCLAIMER,
  goldenSamplesC2,
  goldenSamplesC2ByFocus,
  type PunjabiC2GoldenFocus,
  type PunjabiC2GoldenSample,
} from "@/languages/punjabi/goldenSamplesC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2GoldenFocus[] = [
  "nuanced_disagreement",
  "negotiation",
  "diplomacy",
  "mediation",
  "deescalation",
  "sensitive_topic_framing",
  "advanced_register",
  "community_discourse",
  "professional_discourse",
  "public_discourse",
];

describe("Punjabi C2 golden samples — coverage", () => {
  it("ships a compact app-consumable golden sample pack", () => {
    expect(goldenSamplesC2.length).toBeGreaterThanOrEqual(10);
    expect(goldenSamplesC2.length).toBeLessThanOrEqual(14);
  });

  it("covers every required golden sample focus", () => {
    const seen = new Set(goldenSamplesC2.map((sample) => sample.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = goldenSamplesC2.map((sample) => sample.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("goldenSamplesC2ByFocus returns only matching samples", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = goldenSamplesC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((sample) => sample.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 golden samples — bilingual integrity", () => {
  it("each sample has VI+EN use case and prompt", () => {
    for (const sample of goldenSamplesC2) {
      expect(sample.title_vi.length, `${sample.id} title_vi`).toBeGreaterThan(0);
      expect(sample.title_en.length, `${sample.id} title_en`).toBeGreaterThan(0);
      expect(sample.use_case_vi.length, `${sample.id} use_case_vi`).toBeGreaterThan(0);
      expect(sample.use_case_en.length, `${sample.id} use_case_en`).toBeGreaterThan(0);
      expect(sample.prompt_vi.length, `${sample.id} prompt_vi`).toBeGreaterThan(0);
      expect(sample.prompt_en.length, `${sample.id} prompt_en`).toBeGreaterThan(0);
    }
  });

  it("each golden response has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const sample of goldenSamplesC2) {
      expect(hasGurmukhi(sample.golden_gurmukhi), `${sample.id} golden_gurmukhi`).toBe(true);
      expect(sample.golden_romanization.length, `${sample.id} golden_romanization`).toBeGreaterThan(0);
      expect(sample.golden_vi.length, `${sample.id} golden_vi`).toBeGreaterThan(0);
      expect(sample.golden_en.length, `${sample.id} golden_en`).toBeGreaterThan(0);
    }
  });

  it("each reusable phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const sample of goldenSamplesC2) {
      expect(sample.reusable_phrases.length, `${sample.id} reusable phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of sample.reusable_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${sample.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${sample.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${sample.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${sample.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes golden-sample, final-QA, and integration-readiness style items", () => {
    const modes = new Set(goldenSamplesC2.map((sample) => sample.mode));
    expect(modes.has("golden_sample")).toBe(true);
    expect(modes.has("final_qa")).toBe(true);
    expect(modes.has("integration_readiness")).toBe(true);
    for (const sample of goldenSamplesC2) {
      expect(sample.quality_checks.length, `${sample.id} quality checks`).toBeGreaterThanOrEqual(1);
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(goldenSamplesC2.filter((sample) => sample.learner_trap).length).toBeGreaterThanOrEqual(6);
    const canadaSamples = goldenSamplesC2.filter((sample) => sample.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(2);
    expect(JSON.stringify(canadaSamples).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 golden samples — scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_GOLDEN_SAMPLES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_GOLDEN_SAMPLES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_GOLDEN_SAMPLES_DISCLAIMER.vi} ${C2_GOLDEN_SAMPLES_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, or official placement in samples", () => {
    const blob = JSON.stringify(goldenSamplesC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
  });
});

const _typecheck: PunjabiC2GoldenSample[] = goldenSamplesC2;
void _typecheck;
