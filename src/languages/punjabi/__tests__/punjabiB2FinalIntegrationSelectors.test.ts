import { describe, expect, it } from "vitest";

import punjabiB2FinalIntegrationSelectors, {
  punjabiB2FinalIntegrationSelectors as namedPunjabiB2FinalIntegrationSelectors,
  type PunjabiB2FinalIntegrationSelectorsFocus,
  type PunjabiB2FinalIntegrationSelectorsTopic,
} from "../b2FinalIntegrationSelectors";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalIntegrationSelectorsFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalIntegrationSelectorsTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalIntegrationSelectors", () => {
  it("exports the same compact app-consumable selectors as default and named exports", () => {
    expect(punjabiB2FinalIntegrationSelectors).toBe(namedPunjabiB2FinalIntegrationSelectors);
    expect(punjabiB2FinalIntegrationSelectors.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalIntegrationSelectors.length).toBeLessThanOrEqual(18);
  });

  it("covers the required selector focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalIntegrationSelectors.some((item) => item.selectorFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalIntegrationSelectors.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalIntegrationSelectors) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_selector_/);
      expect(item.selectorPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.selectedAngle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.selectorPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.selectedAngle_romanization).not.toMatch(gurmukhiPattern);
      expect(item.selectorPrompt_vi.length).toBeGreaterThan(40);
      expect(item.selectorPrompt_en.length).toBeGreaterThan(40);
      expect(item.selectedAngle_vi.length).toBeGreaterThan(40);
      expect(item.selectedAngle_en.length).toBeGreaterThan(40);
    }
  });

  it("includes pre-integration, final-readiness, integration notes, and selector guards", () => {
    for (const item of punjabiB2FinalIntegrationSelectors) {
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.finalReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalReadiness_en.length).toBe(item.finalReadiness_vi.length);
      expect(item.integrationNotes_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.integrationNotes_en.length).toBe(item.integrationNotes_vi.length);
      expect(item.selectorGuard_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.selectorGuard_en.length).toBe(item.selectorGuard_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalIntegrationSelectors.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalIntegrationSelectors);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
