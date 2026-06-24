import { describe, expect, it } from "vitest";

import punjabiB2ImportReadinessSamples, {
  punjabiB2ImportReadinessSamples as namedPunjabiB2ImportReadinessSamples,
  type PunjabiB2ImportReadinessSamplesFocus,
  type PunjabiB2ImportReadinessSamplesTopic,
} from "../b2ImportReadinessSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2ImportReadinessSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ImportReadinessSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2ImportReadinessSamples", () => {
  it("exports the same compact app-consumable import-readiness set as default and named exports", () => {
    expect(punjabiB2ImportReadinessSamples).toBe(namedPunjabiB2ImportReadinessSamples);
    expect(punjabiB2ImportReadinessSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ImportReadinessSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers the required import-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ImportReadinessSamples.some((item) => item.importFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ImportReadinessSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ImportReadinessSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_import_readiness_/);
      expect(item.importPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.sampleAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.importPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.sampleAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.importPrompt_vi.length).toBeGreaterThan(40);
      expect(item.importPrompt_en.length).toBeGreaterThan(40);
      expect(item.sampleAnswer_vi.length).toBeGreaterThan(60);
      expect(item.sampleAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("connects opinions, evidence, counterpoints, tradeoffs, recommendations, and checks", () => {
    for (const item of punjabiB2ImportReadinessSamples) {
      expect(item.importReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.importReadiness_en.length).toBe(item.importReadiness_vi.length);
      expect(item.finalRegression_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalRegression_en.length).toBe(item.finalRegression_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.coherenceCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.coherenceCheck_en.length).toBe(item.coherenceCheck_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ImportReadinessSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2ImportReadinessSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
