import { describe, expect, it } from "vitest";

import punjabiB2FinalRegressionSamples, {
  punjabiB2FinalRegressionSamples as namedPunjabiB2FinalRegressionSamples,
  type PunjabiB2FinalRegressionSamplesFocus,
  type PunjabiB2FinalRegressionSamplesTopic,
} from "../b2FinalRegressionSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalRegressionSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalRegressionSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalRegressionSamples", () => {
  it("exports the same compact app-consumable regression set as default and named exports", () => {
    expect(punjabiB2FinalRegressionSamples).toBe(namedPunjabiB2FinalRegressionSamples);
    expect(punjabiB2FinalRegressionSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalRegressionSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers the required regression focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalRegressionSamples.some((item) => item.regressionFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalRegressionSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalRegressionSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_regression_/);
      expect(item.regressionPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.selectedAngle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.regressionPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.selectedAngle_romanization).not.toMatch(gurmukhiPattern);
      expect(item.regressionPrompt_vi.length).toBeGreaterThan(40);
      expect(item.regressionPrompt_en.length).toBeGreaterThan(40);
      expect(item.selectedAngle_vi.length).toBeGreaterThan(40);
      expect(item.selectedAngle_en.length).toBeGreaterThan(40);
    }
  });

  it("includes final-regression, sanity, pre-integration, readiness, notes, and guards", () => {
    for (const item of punjabiB2FinalRegressionSamples) {
      expect(item.finalRegression_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalRegression_en.length).toBe(item.finalRegression_vi.length);
      expect(item.sanityCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.sanityCheck_en.length).toBe(item.sanityCheck_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.finalReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalReadiness_en.length).toBe(item.finalReadiness_vi.length);
      expect(item.regressionNotes_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.regressionNotes_en.length).toBe(item.regressionNotes_vi.length);
      expect(item.selectorGuard_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.selectorGuard_en.length).toBe(item.selectorGuard_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalRegressionSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalRegressionSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
