import { describe, expect, it } from "vitest";

import punjabiIntegrationSamplesB2, {
  punjabiIntegrationSamplesB2 as namedPunjabiIntegrationSamplesB2,
  type PunjabiIntegrationSamplesB2Focus,
  type PunjabiIntegrationSamplesB2Topic,
} from "../integrationSamplesB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiIntegrationSamplesB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiIntegrationSamplesB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiIntegrationSamplesB2", () => {
  it("exports the same compact app-consumable integration fixtures as default and named exports", () => {
    expect(punjabiIntegrationSamplesB2).toBe(namedPunjabiIntegrationSamplesB2);
    expect(punjabiIntegrationSamplesB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiIntegrationSamplesB2.length).toBeLessThanOrEqual(18);
  });

  it("covers B2 integration focuses and later-wiring topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiIntegrationSamplesB2.some((sample) => sample.integrationFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiIntegrationSamplesB2.some((sample) => sample.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary and includes learner bridge fields", () => {
    for (const sample of punjabiIntegrationSamplesB2) {
      expect(sample.level).toBe("B2");
      expect(sample.id).toMatch(/^pa_b2_integration_/);
      expect(sample.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(sample.sampleResponse_gurmukhi).toMatch(gurmukhiPattern);
      expect(sample.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(sample.sampleResponse_romanization).not.toMatch(gurmukhiPattern);
      expect(sample.prompt_vi.length).toBeGreaterThan(20);
      expect(sample.prompt_en.length).toBeGreaterThan(20);
      expect(sample.sampleResponse_vi.length).toBeGreaterThan(80);
      expect(sample.sampleResponse_en.length).toBeGreaterThan(80);
    }
  });

  it("includes integration-sample, final-evidence, and final-QA checks", () => {
    for (const sample of punjabiIntegrationSamplesB2) {
      expect(sample.integrationSample_vi.length).toBeGreaterThan(30);
      expect(sample.integrationSample_en.length).toBeGreaterThan(30);
      expect(sample.finalEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.finalEvidence_en.length).toBe(sample.finalEvidence_vi.length);
      expect(sample.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.finalQa_en.length).toBe(sample.finalQa_vi.length);
      expect(sample.learnerTrap_vi.length).toBeGreaterThan(20);
      expect(sample.learnerTrap_en.length).toBeGreaterThan(20);
    }
  });

  it("retains Canada-practical examples where useful", () => {
    const examples = punjabiIntegrationSamplesB2.filter(
      (sample) => sample.canadaPracticalExample_vi && sample.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiIntegrationSamplesB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
