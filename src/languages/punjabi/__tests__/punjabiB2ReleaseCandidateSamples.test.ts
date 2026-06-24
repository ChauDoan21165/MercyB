import { describe, expect, it } from "vitest";

import punjabiB2ReleaseCandidateSamples, {
  punjabiB2ReleaseCandidateSamples as namedPunjabiB2ReleaseCandidateSamples,
  type PunjabiB2ReleaseCandidateSamplesFocus,
  type PunjabiB2ReleaseCandidateSamplesTopic,
} from "../b2ReleaseCandidateSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2ReleaseCandidateSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ReleaseCandidateSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2ReleaseCandidateSamples", () => {
  it("exports the same compact app-consumable release-candidate set as default and named exports", () => {
    expect(punjabiB2ReleaseCandidateSamples).toBe(
      namedPunjabiB2ReleaseCandidateSamples,
    );
    expect(punjabiB2ReleaseCandidateSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ReleaseCandidateSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers the required release focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ReleaseCandidateSamples.some((item) => item.releaseFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ReleaseCandidateSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ReleaseCandidateSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_release_candidate_/);
      expect(item.releasePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.candidateAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.releasePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.candidateAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.releasePrompt_vi.length).toBeGreaterThan(40);
      expect(item.releasePrompt_en.length).toBeGreaterThan(40);
      expect(item.candidateAnswer_vi.length).toBeGreaterThan(60);
      expect(item.candidateAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies release-candidate reasoning readiness and closure validation", () => {
    for (const item of punjabiB2ReleaseCandidateSamples) {
      expect(item.releaseCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.releaseCandidate_en.length).toBe(item.releaseCandidate_vi.length);
      expect(item.closureValidation_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.closureValidation_en.length).toBe(item.closureValidation_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.reasoningReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.reasoningReadiness_en.length).toBe(item.reasoningReadiness_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ReleaseCandidateSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2ReleaseCandidateSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
