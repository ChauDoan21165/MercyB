import { describe, expect, it } from "vitest";

import punjabiPositionRefinementB2, {
  punjabiPositionRefinementB2 as namedPunjabiPositionRefinementB2,
  type PunjabiPositionRefinementB2Focus,
  type PunjabiPositionRefinementB2Topic,
} from "../positionRefinementB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiPositionRefinementB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiPositionRefinementB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiPositionRefinementB2", () => {
  it("exports the same compact app-consumable refinement pack as default and named exports", () => {
    expect(punjabiPositionRefinementB2).toBe(namedPunjabiPositionRefinementB2);
    expect(punjabiPositionRefinementB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiPositionRefinementB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required position-refinement focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiPositionRefinementB2.some((item) => item.refinementFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiPositionRefinementB2.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiPositionRefinementB2) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_refine_/);
      expect(item.weakPosition_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.refinedPosition_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.weakPosition_romanization).not.toMatch(gurmukhiPattern);
      expect(item.refinedPosition_romanization).not.toMatch(gurmukhiPattern);
      expect(item.weakPosition_vi.length).toBeGreaterThan(40);
      expect(item.weakPosition_en.length).toBeGreaterThan(40);
      expect(item.refinedPosition_vi.length).toBeGreaterThan(40);
      expect(item.refinedPosition_en.length).toBeGreaterThan(40);
    }
  });

  it("includes hardening, export-readiness, review, and regression signals", () => {
    for (const item of punjabiPositionRefinementB2) {
      expect(item.finalHardening_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalHardening_en.length).toBe(item.finalHardening_vi.length);
      expect(item.exportReadiness_vi.length).toBeGreaterThan(30);
      expect(item.exportReadiness_en.length).toBeGreaterThan(30);
      expect(item.review_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.review_en.length).toBe(item.review_vi.length);
      expect(item.regressionWarning_vi.length).toBeGreaterThanOrEqual(1);
      expect(item.regressionWarning_en.length).toBe(item.regressionWarning_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiPositionRefinementB2.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiPositionRefinementB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
