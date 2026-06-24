import { describe, expect, it } from "vitest";

import punjabiB2ClosurePacketSamples, {
  punjabiB2ClosurePacketSamples as namedPunjabiB2ClosurePacketSamples,
  type PunjabiB2ClosurePacketSamplesFocus,
  type PunjabiB2ClosurePacketSamplesTopic,
} from "../b2ClosurePacketSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2ClosurePacketSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ClosurePacketSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2ClosurePacketSamples", () => {
  it("exports the same compact app-consumable closure-packet set as default and named exports", () => {
    expect(punjabiB2ClosurePacketSamples).toBe(namedPunjabiB2ClosurePacketSamples);
    expect(punjabiB2ClosurePacketSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ClosurePacketSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required closure-packet focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ClosurePacketSamples.some((item) => item.closurePacketFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ClosurePacketSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ClosurePacketSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_closure_packet_/);
      expect(item.closurePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.closureAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.closurePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.closureAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.closurePrompt_vi.length).toBeGreaterThan(40);
      expect(item.closurePrompt_en.length).toBeGreaterThan(40);
      expect(item.closureAnswer_vi.length).toBeGreaterThan(60);
      expect(item.closureAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies closure, pre-merge, CI-readiness, and pre-integration checks", () => {
    for (const item of punjabiB2ClosurePacketSamples) {
      expect(item.preA11Closure_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Closure_en.length).toBe(item.preA11Closure_vi.length);
      expect(item.preMergeChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preMergeChecks_en.length).toBe(item.preMergeChecks_vi.length);
      expect(item.ciReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ciReadinessChecks_en.length).toBe(item.ciReadinessChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ClosurePacketSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2ClosurePacketSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
