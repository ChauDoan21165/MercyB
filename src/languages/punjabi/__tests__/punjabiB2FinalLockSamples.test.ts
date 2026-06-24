import { describe, expect, it } from "vitest";

import punjabiB2FinalLockSamples, {
  punjabiB2FinalLockSamples as namedPunjabiB2FinalLockSamples,
  type PunjabiB2FinalLockSamplesFocus,
  type PunjabiB2FinalLockSamplesTopic,
} from "../b2FinalLockSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalLockSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalLockSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalLockSamples", () => {
  it("exports the same compact app-consumable final-lock set as default and named exports", () => {
    expect(punjabiB2FinalLockSamples).toBe(namedPunjabiB2FinalLockSamples);
    expect(punjabiB2FinalLockSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalLockSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required final-lock focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalLockSamples.some((item) => item.finalLockFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalLockSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalLockSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_final_lock_/);
      expect(item.finalLockPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.lockedAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.finalLockPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.lockedAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.finalLockPrompt_vi.length).toBeGreaterThan(40);
      expect(item.finalLockPrompt_en.length).toBeGreaterThan(40);
      expect(item.lockedAnswer_vi.length).toBeGreaterThan(60);
      expect(item.lockedAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies final-lock, owner-acceptance, final-acceptance, and pre-integration criteria", () => {
    for (const item of punjabiB2FinalLockSamples) {
      expect(item.finalLockCriteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalLockCriteria_en.length).toBe(item.finalLockCriteria_vi.length);
      expect(item.ownerAcceptance_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ownerAcceptance_en.length).toBe(item.ownerAcceptance_vi.length);
      expect(item.finalAcceptance_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalAcceptance_en.length).toBe(item.finalAcceptance_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalLockSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalLockSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
