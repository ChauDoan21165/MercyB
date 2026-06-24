import { describe, expect, it } from "vitest";

import punjabiB2FinalValidationSet, {
  punjabiB2FinalValidationSet as namedPunjabiB2FinalValidationSet,
  type PunjabiB2FinalValidationSetFocus,
  type PunjabiB2FinalValidationSetTopic,
} from "../b2FinalValidationSet";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalValidationSetFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalValidationSetTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalValidationSet", () => {
  it("exports the same compact app-consumable final-validation set as default and named exports", () => {
    expect(punjabiB2FinalValidationSet).toBe(namedPunjabiB2FinalValidationSet);
    expect(punjabiB2FinalValidationSet.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalValidationSet.length).toBeLessThanOrEqual(18);
  });

  it("covers the required validation focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalValidationSet.some((item) => item.validationFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalValidationSet.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalValidationSet) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_final_validation_/);
      expect(item.validationPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.finalAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.validationPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.finalAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.validationPrompt_vi.length).toBeGreaterThan(40);
      expect(item.validationPrompt_en.length).toBeGreaterThan(40);
      expect(item.finalAnswer_vi.length).toBeGreaterThan(60);
      expect(item.finalAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("confirms opinion, evidence, counterpoint, tradeoff, recommendation, and public-service links", () => {
    for (const item of punjabiB2FinalValidationSet) {
      expect(item.finalValidation_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalValidation_en.length).toBe(item.finalValidation_vi.length);
      expect(item.crossCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.crossCheck_en.length).toBe(item.crossCheck_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.publicServiceLink_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.publicServiceLink_en.length).toBe(item.publicServiceLink_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalValidationSet.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalValidationSet);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
