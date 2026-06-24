import { describe, expect, it } from "vitest";

import punjabiConsistencyReviewB2, {
  punjabiConsistencyReviewB2 as namedPunjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Topic,
} from "../consistencyReviewB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiConsistencyReviewB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiConsistencyReviewB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiConsistencyReviewB2", () => {
  it("exports the same compact app-consumable review set as default and named exports", () => {
    expect(punjabiConsistencyReviewB2).toBe(namedPunjabiConsistencyReviewB2);
    expect(punjabiConsistencyReviewB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiConsistencyReviewB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required consistency focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiConsistencyReviewB2.some((item) => item.consistencyFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiConsistencyReviewB2.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiConsistencyReviewB2) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_consistency_/);
      expect(item.consistencyPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.consistentOpinion_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.consistencyPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.consistentOpinion_romanization).not.toMatch(gurmukhiPattern);
      expect(item.consistencyPrompt_vi.length).toBeGreaterThan(40);
      expect(item.consistencyPrompt_en.length).toBeGreaterThan(40);
      expect(item.consistentOpinion_vi.length).toBeGreaterThan(40);
      expect(item.consistentOpinion_en.length).toBeGreaterThan(40);
    }
  });

  it("includes final-consistency, final-guardrail, integration-readiness, review, and regression fields", () => {
    for (const item of punjabiConsistencyReviewB2) {
      expect(item.finalConsistency_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalConsistency_en.length).toBe(item.finalConsistency_vi.length);
      expect(item.finalGuardrail_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.finalGuardrail_en.length).toBe(item.finalGuardrail_vi.length);
      expect(item.reviewNotes_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.reviewNotes_en.length).toBe(item.reviewNotes_vi.length);
      expect(item.regressionWarnings_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.regressionWarnings_en.length).toBe(item.regressionWarnings_vi.length);
      expect(item.integrationReadiness_vi.length).toBeGreaterThan(30);
      expect(item.integrationReadiness_en.length).toBeGreaterThan(30);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiConsistencyReviewB2.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiConsistencyReviewB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
