import { describe, expect, it } from "vitest";

import punjabiB2MergeReadinessSamples, {
  punjabiB2MergeReadinessSamples as namedPunjabiB2MergeReadinessSamples,
  type PunjabiB2MergeReadinessSamplesFocus,
  type PunjabiB2MergeReadinessSamplesTopic,
} from "../b2MergeReadinessSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2MergeReadinessSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2MergeReadinessSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2MergeReadinessSamples", () => {
  it("exports the same compact app-consumable merge-readiness set as default and named exports", () => {
    expect(punjabiB2MergeReadinessSamples).toBe(namedPunjabiB2MergeReadinessSamples);
    expect(punjabiB2MergeReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2MergeReadinessSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers the required merge-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2MergeReadinessSamples.some((item) => item.mergeFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2MergeReadinessSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2MergeReadinessSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_merge_readiness_/);
      expect(item.mergePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.modelAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.mergePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.modelAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.mergePrompt_vi.length).toBeGreaterThan(40);
      expect(item.mergePrompt_en.length).toBeGreaterThan(40);
      expect(item.modelAnswer_vi.length).toBeGreaterThan(60);
      expect(item.modelAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("connects opinions, evidence, counterpoints, tradeoffs, recommendations, and checks", () => {
    for (const item of punjabiB2MergeReadinessSamples) {
      expect(item.mergeReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.mergeReadiness_en.length).toBe(item.mergeReadiness_vi.length);
      expect(item.finalRegression_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalRegression_en.length).toBe(item.finalRegression_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.coherenceCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.coherenceCheck_en.length).toBe(item.coherenceCheck_vi.length);
      expect(item.selectorGuard_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.selectorGuard_en.length).toBe(item.selectorGuard_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2MergeReadinessSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2MergeReadinessSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
