import { describe, expect, it } from "vitest";

import punjabiB2GoNoGoSamples, {
  punjabiB2GoNoGoSamples as namedPunjabiB2GoNoGoSamples,
  type PunjabiB2GoNoGoSamplesFocus,
  type PunjabiB2GoNoGoSamplesTopic,
} from "../b2GoNoGoSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2GoNoGoSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2GoNoGoSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2GoNoGoSamples", () => {
  it("exports the same compact app-consumable go/no-go set as default and named exports", () => {
    expect(punjabiB2GoNoGoSamples).toBe(namedPunjabiB2GoNoGoSamples);
    expect(punjabiB2GoNoGoSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2GoNoGoSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required go/no-go focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2GoNoGoSamples.some((item) => item.goNoGoFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2GoNoGoSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2GoNoGoSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_go_no_go_/);
      expect(item.goNoGoPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.readyAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.goNoGoPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.readyAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.goNoGoPrompt_vi.length).toBeGreaterThan(40);
      expect(item.goNoGoPrompt_en.length).toBeGreaterThan(40);
      expect(item.readyAnswer_vi.length).toBeGreaterThan(60);
      expect(item.readyAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies go/no-go, release-candidate, closure-validation, and pre-integration criteria", () => {
    for (const item of punjabiB2GoNoGoSamples) {
      expect(item.goCriteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.goCriteria_en.length).toBe(item.goCriteria_vi.length);
      expect(item.noGoCriteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.noGoCriteria_en.length).toBe(item.noGoCriteria_vi.length);
      expect(item.releaseCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.releaseCandidate_en.length).toBe(item.releaseCandidate_vi.length);
      expect(item.closureValidation_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.closureValidation_en.length).toBe(item.closureValidation_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2GoNoGoSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2GoNoGoSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
