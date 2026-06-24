import { describe, expect, it } from "vitest";

import punjabiB2PreMergeSamples, {
  punjabiB2PreMergeSamples as namedPunjabiB2PreMergeSamples,
  type PunjabiB2PreMergeSamplesFocus,
  type PunjabiB2PreMergeSamplesTopic,
} from "../b2PreMergeSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2PreMergeSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2PreMergeSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2PreMergeSamples", () => {
  it("exports the same compact app-consumable pre-merge set as default and named exports", () => {
    expect(punjabiB2PreMergeSamples).toBe(namedPunjabiB2PreMergeSamples);
    expect(punjabiB2PreMergeSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2PreMergeSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required pre-merge focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2PreMergeSamples.some((item) => item.preMergeFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2PreMergeSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2PreMergeSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_pre_merge_/);
      expect(item.preMergePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.preMergeAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.preMergePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.preMergeAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.preMergePrompt_vi.length).toBeGreaterThan(40);
      expect(item.preMergePrompt_en.length).toBeGreaterThan(40);
      expect(item.preMergeAnswer_vi.length).toBeGreaterThan(60);
      expect(item.preMergeAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies pre-merge, checksum, runner-readiness, and pre-integration checks", () => {
    for (const item of punjabiB2PreMergeSamples) {
      expect(item.preMergeChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preMergeChecks_en.length).toBe(item.preMergeChecks_vi.length);
      expect(item.preA11Checksum_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Checksum_en.length).toBe(item.preA11Checksum_vi.length);
      expect(item.runnerReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.runnerReadinessChecks_en.length).toBe(item.runnerReadinessChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2PreMergeSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2PreMergeSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
