import { describe, expect, it } from "vitest";

import punjabiB2PreA11ChecksumSamples, {
  punjabiB2PreA11ChecksumSamples as namedPunjabiB2PreA11ChecksumSamples,
  type PunjabiB2PreA11ChecksumSamplesFocus,
  type PunjabiB2PreA11ChecksumSamplesTopic,
} from "../b2PreA11ChecksumSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2PreA11ChecksumSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2PreA11ChecksumSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2PreA11ChecksumSamples", () => {
  it("exports the same compact app-consumable pre-A11 checksum set as default and named exports", () => {
    expect(punjabiB2PreA11ChecksumSamples).toBe(namedPunjabiB2PreA11ChecksumSamples);
    expect(punjabiB2PreA11ChecksumSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2PreA11ChecksumSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required checksum focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2PreA11ChecksumSamples.some((item) => item.checksumFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2PreA11ChecksumSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2PreA11ChecksumSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_pre_a11_checksum_/);
      expect(item.checksumPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.checksumAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.checksumPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.checksumAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.checksumPrompt_vi.length).toBeGreaterThan(40);
      expect(item.checksumPrompt_en.length).toBeGreaterThan(40);
      expect(item.checksumAnswer_vi.length).toBeGreaterThan(60);
      expect(item.checksumAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies pre-A11 checksum, runner, pipeline, and pre-integration checks", () => {
    for (const item of punjabiB2PreA11ChecksumSamples) {
      expect(item.preA11Checksum_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Checksum_en.length).toBe(item.preA11Checksum_vi.length);
      expect(item.runnerReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.runnerReadinessChecks_en.length).toBe(item.runnerReadinessChecks_vi.length);
      expect(item.pipelineReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.pipelineReadinessChecks_en.length).toBe(item.pipelineReadinessChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2PreA11ChecksumSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and A11 scope within the allowed boundary", () => {
    const serialized = JSON.stringify(punjabiB2PreA11ChecksumSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
