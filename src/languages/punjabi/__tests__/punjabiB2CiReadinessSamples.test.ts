import { describe, expect, it } from "vitest";

import punjabiB2CiReadinessSamples, {
  punjabiB2CiReadinessSamples as namedPunjabiB2CiReadinessSamples,
  type PunjabiB2CiReadinessSamplesFocus,
  type PunjabiB2CiReadinessSamplesTopic,
} from "../b2CiReadinessSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2CiReadinessSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2CiReadinessSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2CiReadinessSamples", () => {
  it("exports the same compact app-consumable CI-readiness set as default and named exports", () => {
    expect(punjabiB2CiReadinessSamples).toBe(namedPunjabiB2CiReadinessSamples);
    expect(punjabiB2CiReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2CiReadinessSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required CI-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2CiReadinessSamples.some((item) => item.ciReadinessFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2CiReadinessSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2CiReadinessSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_ci_readiness_/);
      expect(item.ciReadinessPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.testStableAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.ciReadinessPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.testStableAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.ciReadinessPrompt_vi.length).toBeGreaterThan(40);
      expect(item.ciReadinessPrompt_en.length).toBeGreaterThan(40);
      expect(item.testStableAnswer_vi.length).toBeGreaterThan(60);
      expect(item.testStableAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies CI-readiness, MR-readiness, final-freeze, and pre-integration checks", () => {
    for (const item of punjabiB2CiReadinessSamples) {
      expect(item.ciReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ciReadinessChecks_en.length).toBe(item.ciReadinessChecks_vi.length);
      expect(item.mrReadinessEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.mrReadinessEvidence_en.length).toBe(item.mrReadinessEvidence_vi.length);
      expect(item.finalFreezeEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalFreezeEvidence_en.length).toBe(item.finalFreezeEvidence_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2CiReadinessSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2CiReadinessSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
