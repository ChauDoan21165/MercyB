import { describe, expect, it } from "vitest";

import punjabiB2SealSamples, {
  punjabiB2SealSamples as namedPunjabiB2SealSamples,
  type PunjabiB2SealSamplesFocus,
  type PunjabiB2SealSamplesTopic,
} from "../b2SealSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2SealSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2SealSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2SealSamples", () => {
  it("exports the same compact app-consumable seal set as default and named exports", () => {
    expect(punjabiB2SealSamples).toBe(namedPunjabiB2SealSamples);
    expect(punjabiB2SealSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2SealSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required seal focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2SealSamples.some((item) => item.sealFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2SealSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2SealSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_seal_/);
      expect(item.sealPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.sealAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.sealPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.sealAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.sealPrompt_vi.length).toBeGreaterThan(40);
      expect(item.sealPrompt_en.length).toBeGreaterThan(40);
      expect(item.sealAnswer_vi.length).toBeGreaterThan(60);
      expect(item.sealAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies seal, snapshot, closure-packet, and pre-integration checks", () => {
    for (const item of punjabiB2SealSamples) {
      expect(item.preA11Seal_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Seal_en.length).toBe(item.preA11Seal_vi.length);
      expect(item.snapshotChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.snapshotChecks_en.length).toBe(item.snapshotChecks_vi.length);
      expect(item.closurePacketChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.closurePacketChecks_en.length).toBe(item.closurePacketChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2SealSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2SealSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
