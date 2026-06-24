import { describe, expect, it } from "vitest";

import punjabiB2OwnerAcceptanceSamples, {
  punjabiB2OwnerAcceptanceSamples as namedPunjabiB2OwnerAcceptanceSamples,
  type PunjabiB2OwnerAcceptanceSamplesFocus,
  type PunjabiB2OwnerAcceptanceSamplesTopic,
} from "../b2OwnerAcceptanceSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2OwnerAcceptanceSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2OwnerAcceptanceSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2OwnerAcceptanceSamples", () => {
  it("exports the same compact app-consumable owner-acceptance set as default and named exports", () => {
    expect(punjabiB2OwnerAcceptanceSamples).toBe(namedPunjabiB2OwnerAcceptanceSamples);
    expect(punjabiB2OwnerAcceptanceSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2OwnerAcceptanceSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required owner-acceptance focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2OwnerAcceptanceSamples.some((item) => item.ownerAcceptanceFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2OwnerAcceptanceSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2OwnerAcceptanceSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_owner_acceptance_/);
      expect(item.ownerPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.ownerAcceptedAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.ownerPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.ownerAcceptedAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.ownerPrompt_vi.length).toBeGreaterThan(40);
      expect(item.ownerPrompt_en.length).toBeGreaterThan(40);
      expect(item.ownerAcceptedAnswer_vi.length).toBeGreaterThan(60);
      expect(item.ownerAcceptedAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies owner-acceptance, final-acceptance, ship-candidate, and pre-integration criteria", () => {
    for (const item of punjabiB2OwnerAcceptanceSamples) {
      expect(item.ownerAcceptance_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ownerAcceptance_en.length).toBe(item.ownerAcceptance_vi.length);
      expect(item.finalAcceptance_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalAcceptance_en.length).toBe(item.finalAcceptance_vi.length);
      expect(item.shipCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.shipCandidate_en.length).toBe(item.shipCandidate_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2OwnerAcceptanceSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2OwnerAcceptanceSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
