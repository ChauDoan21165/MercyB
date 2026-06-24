import { describe, expect, it } from "vitest";

import punjabiB2AcceptanceSamples, {
  punjabiB2AcceptanceSamples as namedPunjabiB2AcceptanceSamples,
  type PunjabiB2AcceptanceSamplesFocus,
  type PunjabiB2AcceptanceSamplesTopic,
} from "../b2AcceptanceSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2AcceptanceSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2AcceptanceSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2AcceptanceSamples", () => {
  it("exports the same compact app-consumable acceptance set as default and named exports", () => {
    expect(punjabiB2AcceptanceSamples).toBe(namedPunjabiB2AcceptanceSamples);
    expect(punjabiB2AcceptanceSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2AcceptanceSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required acceptance focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2AcceptanceSamples.some((item) => item.acceptanceFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2AcceptanceSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2AcceptanceSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_acceptance_/);
      expect(item.acceptancePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.acceptedAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.acceptancePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.acceptedAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.acceptancePrompt_vi.length).toBeGreaterThan(40);
      expect(item.acceptancePrompt_en.length).toBeGreaterThan(40);
      expect(item.acceptedAnswer_vi.length).toBeGreaterThan(60);
      expect(item.acceptedAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies acceptance, ship-candidate, go/no-go, and pre-integration criteria", () => {
    for (const item of punjabiB2AcceptanceSamples) {
      expect(item.acceptanceCriteria_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.acceptanceCriteria_en.length).toBe(item.acceptanceCriteria_vi.length);
      expect(item.shipCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.shipCandidate_en.length).toBe(item.shipCandidate_vi.length);
      expect(item.goNoGo_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.goNoGo_en.length).toBe(item.goNoGo_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2AcceptanceSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2AcceptanceSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
