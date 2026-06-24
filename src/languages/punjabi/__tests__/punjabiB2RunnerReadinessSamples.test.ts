import { describe, expect, it } from "vitest";

import punjabiB2RunnerReadinessSamples, {
  punjabiB2RunnerReadinessSamples as namedPunjabiB2RunnerReadinessSamples,
  type PunjabiB2RunnerReadinessSamplesFocus,
  type PunjabiB2RunnerReadinessSamplesTopic,
} from "../b2RunnerReadinessSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2RunnerReadinessSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2RunnerReadinessSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2RunnerReadinessSamples", () => {
  it("exports the same compact app-consumable runner-readiness set as default and named exports", () => {
    expect(punjabiB2RunnerReadinessSamples).toBe(namedPunjabiB2RunnerReadinessSamples);
    expect(punjabiB2RunnerReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2RunnerReadinessSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required runner-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2RunnerReadinessSamples.some((item) => item.runnerReadinessFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2RunnerReadinessSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2RunnerReadinessSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_runner_readiness_/);
      expect(item.runnerPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.runnerStableAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.runnerPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.runnerStableAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.runnerPrompt_vi.length).toBeGreaterThan(40);
      expect(item.runnerPrompt_en.length).toBeGreaterThan(40);
      expect(item.runnerStableAnswer_vi.length).toBeGreaterThan(60);
      expect(item.runnerStableAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies runner-readiness, pipeline-readiness, test-readiness, and pre-integration checks", () => {
    for (const item of punjabiB2RunnerReadinessSamples) {
      expect(item.runnerReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.runnerReadinessChecks_en.length).toBe(item.runnerReadinessChecks_vi.length);
      expect(item.pipelineReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.pipelineReadinessChecks_en.length).toBe(item.pipelineReadinessChecks_vi.length);
      expect(item.ciReadinessChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ciReadinessChecks_en.length).toBe(item.ciReadinessChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2RunnerReadinessSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2RunnerReadinessSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
