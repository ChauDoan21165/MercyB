import { describe, expect, it } from "vitest";

import punjabiB2ShipCandidateSamples, {
  punjabiB2ShipCandidateSamples as namedPunjabiB2ShipCandidateSamples,
  type PunjabiB2ShipCandidateSamplesFocus,
  type PunjabiB2ShipCandidateSamplesTopic,
} from "../b2ShipCandidateSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2ShipCandidateSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ShipCandidateSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2ShipCandidateSamples", () => {
  it("exports the same compact app-consumable ship-candidate set as default and named exports", () => {
    expect(punjabiB2ShipCandidateSamples).toBe(namedPunjabiB2ShipCandidateSamples);
    expect(punjabiB2ShipCandidateSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ShipCandidateSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required ship-candidate focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ShipCandidateSamples.some((item) => item.shipFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ShipCandidateSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ShipCandidateSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_ship_candidate_/);
      expect(item.shipPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.shipAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.shipPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.shipAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.shipPrompt_vi.length).toBeGreaterThan(40);
      expect(item.shipPrompt_en.length).toBeGreaterThan(40);
      expect(item.shipAnswer_vi.length).toBeGreaterThan(60);
      expect(item.shipAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies ship-candidate, go/no-go, release-candidate, and pre-integration criteria", () => {
    for (const item of punjabiB2ShipCandidateSamples) {
      expect(item.shipCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.shipCandidate_en.length).toBe(item.shipCandidate_vi.length);
      expect(item.goNoGo_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.goNoGo_en.length).toBe(item.goNoGo_vi.length);
      expect(item.releaseCandidate_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.releaseCandidate_en.length).toBe(item.releaseCandidate_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ShipCandidateSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2ShipCandidateSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
