import { describe, expect, it } from "vitest";

import punjabiB2FinalFreezeSamples, {
  punjabiB2FinalFreezeSamples as namedPunjabiB2FinalFreezeSamples,
  type PunjabiB2FinalFreezeSamplesFocus,
  type PunjabiB2FinalFreezeSamplesTopic,
} from "../b2FinalFreezeSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalFreezeSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalFreezeSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalFreezeSamples", () => {
  it("exports the same compact app-consumable final-freeze set as default and named exports", () => {
    expect(punjabiB2FinalFreezeSamples).toBe(namedPunjabiB2FinalFreezeSamples);
    expect(punjabiB2FinalFreezeSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalFreezeSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required final-freeze focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalFreezeSamples.some((item) => item.finalFreezeFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalFreezeSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalFreezeSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_final_freeze_/);
      expect(item.finalFreezePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.frozenAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.finalFreezePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.frozenAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.finalFreezePrompt_vi.length).toBeGreaterThan(40);
      expect(item.finalFreezePrompt_en.length).toBeGreaterThan(40);
      expect(item.frozenAnswer_vi.length).toBeGreaterThan(60);
      expect(item.frozenAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies final-freeze, final-lock, owner-acceptance, and pre-integration evidence", () => {
    for (const item of punjabiB2FinalFreezeSamples) {
      expect(item.finalFreezeCriteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalFreezeCriteria_en.length).toBe(item.finalFreezeCriteria_vi.length);
      expect(item.finalLockEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalLockEvidence_en.length).toBe(item.finalLockEvidence_vi.length);
      expect(item.ownerAcceptance_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ownerAcceptance_en.length).toBe(item.ownerAcceptance_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalFreezeSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalFreezeSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
