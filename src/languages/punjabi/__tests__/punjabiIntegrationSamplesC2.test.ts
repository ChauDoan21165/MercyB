// Punjabi C2 integration sample guards. These validate app-consumable structure
// and scope, not certification, official placement, or native review.

import { describe, expect, it } from "vitest";

import {
  C2_INTEGRATION_SAMPLES_DISCLAIMER,
  integrationSamplesC2,
  integrationSamplesC2ByFocus,
  type PunjabiC2IntegrationFocus,
  type PunjabiC2IntegrationSample,
} from "@/languages/punjabi/integrationSamplesC2";

const GURMUKHI_RANGE = /[\u0A00-\u0A7F]/;
const hasGurmukhi = (s: string) => GURMUKHI_RANGE.test(s);

const REQUIRED_FOCUSES: PunjabiC2IntegrationFocus[] = [
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

describe("Punjabi C2 integration samples - coverage", () => {
  it("ships compact app-consumable samples", () => {
    expect(integrationSamplesC2.length).toBeGreaterThanOrEqual(10);
    expect(integrationSamplesC2.length).toBeLessThanOrEqual(12);
  });

  it("covers required C2 integration focuses", () => {
    const seen = new Set(integrationSamplesC2.map((sample) => sample.focus));
    for (const focus of REQUIRED_FOCUSES) {
      expect(seen.has(focus), `missing focus ${focus}`).toBe(true);
    }
  });

  it("has unique non-empty ids", () => {
    const ids = integrationSamplesC2.map((sample) => sample.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("integrationSamplesC2ByFocus returns only matching samples", () => {
    for (const focus of REQUIRED_FOCUSES) {
      const subset = integrationSamplesC2ByFocus(focus);
      expect(subset.length, focus).toBeGreaterThan(0);
      expect(subset.every((sample) => sample.focus === focus), focus).toBe(true);
    }
  });
});

describe("Punjabi C2 integration samples - bilingual integrity", () => {
  it("each sample has VI+EN context and learner task", () => {
    for (const sample of integrationSamplesC2) {
      expect(sample.title_vi.length, `${sample.id} title_vi`).toBeGreaterThan(0);
      expect(sample.title_en.length, `${sample.id} title_en`).toBeGreaterThan(0);
      expect(sample.context_vi.length, `${sample.id} context_vi`).toBeGreaterThan(0);
      expect(sample.context_en.length, `${sample.id} context_en`).toBeGreaterThan(0);
      expect(sample.learner_task_vi.length, `${sample.id} task_vi`).toBeGreaterThan(0);
      expect(sample.learner_task_en.length, `${sample.id} task_en`).toBeGreaterThan(0);
    }
  });

  it("each sample has Gurmukhi, romanization, Vietnamese, and English", () => {
    for (const sample of integrationSamplesC2) {
      expect(hasGurmukhi(sample.sample_gurmukhi), `${sample.id} sample_gurmukhi`).toBe(true);
      expect(sample.sample_romanization.length, `${sample.id} sample_romanization`).toBeGreaterThan(0);
      expect(sample.sample_vi.length, `${sample.id} sample_vi`).toBeGreaterThan(0);
      expect(sample.sample_en.length, `${sample.id} sample_en`).toBeGreaterThan(0);
    }
  });

  it("each reusable phrase has Gurmukhi, romanization, VI, and EN", () => {
    for (const sample of integrationSamplesC2) {
      expect(sample.reusable_phrases.length, `${sample.id} phrases`).toBeGreaterThanOrEqual(2);
      for (const phrase of sample.reusable_phrases) {
        expect(hasGurmukhi(phrase.gurmukhi), `${sample.id} phrase Gurmukhi`).toBe(true);
        expect(phrase.romanization.length, `${sample.id} phrase romanization`).toBeGreaterThan(0);
        expect(phrase.vi.length, `${sample.id} phrase vi`).toBeGreaterThan(0);
        expect(phrase.en.length, `${sample.id} phrase en`).toBeGreaterThan(0);
      }
    }
  });

  it("includes integration-sample, final-evidence, and final-QA styles", () => {
    const styles = new Set(integrationSamplesC2.map((sample) => sample.style));
    expect(styles.has("integration_sample")).toBe(true);
    expect(styles.has("final_evidence")).toBe(true);
    expect(styles.has("final_qa")).toBe(true);
  });

  it("each sample carries final evidence signals", () => {
    for (const sample of integrationSamplesC2) {
      expect(sample.evidence.length, `${sample.id} evidence`).toBeGreaterThanOrEqual(1);
      for (const evidence of sample.evidence) {
        expect(evidence.evidence_vi.length, `${sample.id} evidence_vi`).toBeGreaterThan(0);
        expect(evidence.evidence_en.length, `${sample.id} evidence_en`).toBeGreaterThan(0);
        expect(hasGurmukhi(evidence.signal_gurmukhi), `${sample.id} signal_gurmukhi`).toBe(true);
        expect(evidence.signal_romanization.length, `${sample.id} signal_romanization`).toBeGreaterThan(0);
      }
    }
  });

  it("includes learner traps and Canada-practical examples where useful", () => {
    expect(integrationSamplesC2.filter((sample) => sample.learner_trap).length).toBeGreaterThanOrEqual(8);
    const canadaSamples = integrationSamplesC2.filter((sample) => sample.canada_practical);
    expect(canadaSamples.length).toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(canadaSamples).toLowerCase()).toContain("canada");
  });
});

describe("Punjabi C2 integration samples - scope framing", () => {
  it("exposes study-support, deferred-review, Shahmukhi-awareness disclaimer", () => {
    expect(C2_INTEGRATION_SAMPLES_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(C2_INTEGRATION_SAMPLES_DISCLAIMER.en.length).toBeGreaterThan(0);
    const disclaimer =
      `${C2_INTEGRATION_SAMPLES_DISCLAIMER.vi} ${C2_INTEGRATION_SAMPLES_DISCLAIMER.en}`.toLowerCase();
    expect(disclaimer).toContain("gurmukhi");
    expect(disclaimer).toContain("native review is deferred");
    expect(disclaimer).toContain("not certification");
    expect(disclaimer).toContain("official placement");
    expect(disclaimer).toContain("shahmukhi");
    expect(disclaimer).toContain("awareness");
    expect(disclaimer).not.toContain("full shahmukhi course");
  });

  it("does not claim native review, certification, official placement, or legal authority", () => {
    const blob = JSON.stringify(integrationSamplesC2).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
    expect(blob).not.toContain("official placement");
    expect(blob).not.toContain("legal advice");
  });
});

const _typecheck: PunjabiC2IntegrationSample[] = integrationSamplesC2;
void _typecheck;
