import { describe, expect, it } from "vitest";

import punjabiB2PipelineReadinessSamples, {
  punjabiB2PipelineReadinessSamples as namedPunjabiB2PipelineReadinessSamples,
  type PunjabiB2PipelineReadinessSamplesFocus,
  type PunjabiB2PipelineReadinessSamplesTopic,
} from "../b2PipelineReadinessSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2PipelineReadinessSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2PipelineReadinessSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2PipelineReadinessSamples", () => {
  it("exports the same compact app-consumable pipeline-readiness set as default and named exports", () => {
    expect(punjabiB2PipelineReadinessSamples).toBe(namedPunjabiB2PipelineReadinessSamples);
    expect(punjabiB2PipelineReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2PipelineReadinessSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required pipeline-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2PipelineReadinessSamples.some((item) => item.pipelineReadinessFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2PipelineReadinessSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2PipelineReadinessSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_pipeline_readiness_/);
      expect(item.pipelinePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.pipelineStableAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.pipelinePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.pipelineStableAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.pipelinePrompt_vi.length).toBeGreaterThan(40);
      expect(item.pipelinePrompt_en.length).toBeGreaterThan(40);
      expect(item.pipelineStableAnswer_vi.length).toBeGreaterThan(60);
      expect(item.pipelineStableAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies pipeline-readiness, CI-readiness, MR-readiness, and pre-integration checks", () => {
    for (const item of punjabiB2PipelineReadinessSamples) {
      expect(item.pipelineReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.pipelineReadinessChecks_en.length).toBe(item.pipelineReadinessChecks_vi.length);
      expect(item.ciReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ciReadinessChecks_en.length).toBe(item.ciReadinessChecks_vi.length);
      expect(item.mrReadinessEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.mrReadinessEvidence_en.length).toBe(item.mrReadinessEvidence_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2PipelineReadinessSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2PipelineReadinessSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
