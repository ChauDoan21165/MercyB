import { describe, expect, it } from "vitest";

import punjabiB2SignoffSamples, {
  punjabiB2SignoffSamples as namedPunjabiB2SignoffSamples,
  type PunjabiB2SignoffSamplesFocus,
  type PunjabiB2SignoffSamplesTopic,
} from "../b2SignoffSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2SignoffSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2SignoffSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2SignoffSamples", () => {
  it("exports the same compact app-consumable signoff set as default and named exports", () => {
    expect(punjabiB2SignoffSamples).toBe(namedPunjabiB2SignoffSamples);
    expect(punjabiB2SignoffSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2SignoffSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required signoff focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2SignoffSamples.some((item) => item.signoffFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2SignoffSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2SignoffSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_signoff_/);
      expect(item.signoffPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.signoffAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.signoffPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.signoffAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.signoffPrompt_vi.length).toBeGreaterThan(40);
      expect(item.signoffPrompt_en.length).toBeGreaterThan(40);
      expect(item.signoffAnswer_vi.length).toBeGreaterThan(60);
      expect(item.signoffAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies signoff, seal, snapshot, closure-packet, and pre-integration checks", () => {
    for (const item of punjabiB2SignoffSamples) {
      expect(item.preA11Signoff_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Signoff_en.length).toBe(item.preA11Signoff_vi.length);
      expect(item.sealChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.sealChecks_en.length).toBe(item.sealChecks_vi.length);
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
    const examples = punjabiB2SignoffSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2SignoffSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
