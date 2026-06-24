import { describe, expect, it } from "vitest";

import punjabiArgumentQualityGuardsB2, {
  punjabiArgumentQualityGuardsB2 as namedPunjabiArgumentQualityGuardsB2,
  type PunjabiArgumentQualityGuardsB2Focus,
  type PunjabiArgumentQualityGuardsB2Topic,
} from "../argumentQualityGuardsB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiArgumentQualityGuardsB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiArgumentQualityGuardsB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiArgumentQualityGuardsB2", () => {
  it("exports the same compact app-consumable quality guards as default and named exports", () => {
    expect(punjabiArgumentQualityGuardsB2).toBe(namedPunjabiArgumentQualityGuardsB2);
    expect(punjabiArgumentQualityGuardsB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiArgumentQualityGuardsB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required guard focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiArgumentQualityGuardsB2.some((item) => item.guardFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiArgumentQualityGuardsB2.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiArgumentQualityGuardsB2) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_guard_/);
      expect(item.weakArgument_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.guardedArgument_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.weakArgument_romanization).not.toMatch(gurmukhiPattern);
      expect(item.guardedArgument_romanization).not.toMatch(gurmukhiPattern);
      expect(item.weakArgument_vi.length).toBeGreaterThan(40);
      expect(item.weakArgument_en.length).toBeGreaterThan(40);
      expect(item.guardedArgument_vi.length).toBeGreaterThan(40);
      expect(item.guardedArgument_en.length).toBeGreaterThan(40);
    }
  });

  it("includes final-safety, export-readiness, quality-check, and regression fields", () => {
    for (const item of punjabiArgumentQualityGuardsB2) {
      expect(item.finalSafety_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalSafety_en.length).toBe(item.finalSafety_vi.length);
      expect(item.exportReadiness_vi.length).toBeGreaterThan(30);
      expect(item.exportReadiness_en.length).toBeGreaterThan(30);
      expect(item.qualityCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.qualityCheck_en.length).toBe(item.qualityCheck_vi.length);
      expect(item.regressionCheck_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.regressionCheck_en.length).toBe(item.regressionCheck_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiArgumentQualityGuardsB2.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiArgumentQualityGuardsB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
