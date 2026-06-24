import { describe, expect, it } from "vitest";

import punjabiB2CrossCheckSamples, {
  punjabiB2CrossCheckSamples as namedPunjabiB2CrossCheckSamples,
  type PunjabiB2CrossCheckSamplesFocus,
  type PunjabiB2CrossCheckSamplesTopic,
} from "../b2CrossCheckSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2CrossCheckSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2CrossCheckSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2CrossCheckSamples", () => {
  it("exports the same compact app-consumable cross-check set as default and named exports", () => {
    expect(punjabiB2CrossCheckSamples).toBe(namedPunjabiB2CrossCheckSamples);
    expect(punjabiB2CrossCheckSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2CrossCheckSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers the required cross-check focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2CrossCheckSamples.some((item) => item.crossCheckFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2CrossCheckSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2CrossCheckSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_cross_check_/);
      expect(item.crossCheckPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.verifiedAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.crossCheckPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.verifiedAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.crossCheckPrompt_vi.length).toBeGreaterThan(40);
      expect(item.crossCheckPrompt_en.length).toBeGreaterThan(40);
      expect(item.verifiedAnswer_vi.length).toBeGreaterThan(60);
      expect(item.verifiedAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies opinion, evidence, counterpoint, tradeoff, recommendation, and pre-integration checks", () => {
    for (const item of punjabiB2CrossCheckSamples) {
      expect(item.crossCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.crossCheck_en.length).toBe(item.crossCheck_vi.length);
      expect(item.verification_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.verification_en.length).toBe(item.verification_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.coherenceCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.coherenceCheck_en.length).toBe(item.coherenceCheck_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2CrossCheckSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2CrossCheckSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
