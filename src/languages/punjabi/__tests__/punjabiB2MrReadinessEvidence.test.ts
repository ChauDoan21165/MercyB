import { describe, expect, it } from "vitest";

import punjabiB2MrReadinessEvidence, {
  punjabiB2MrReadinessEvidence as namedPunjabiB2MrReadinessEvidence,
  type PunjabiB2MrReadinessEvidenceFocus,
  type PunjabiB2MrReadinessEvidenceTopic,
} from "../b2MrReadinessEvidence";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2MrReadinessEvidenceFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2MrReadinessEvidenceTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2MrReadinessEvidence", () => {
  it("exports the same compact app-consumable MR-readiness set as default and named exports", () => {
    expect(punjabiB2MrReadinessEvidence).toBe(namedPunjabiB2MrReadinessEvidence);
    expect(punjabiB2MrReadinessEvidence.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2MrReadinessEvidence.length).toBeLessThanOrEqual(18);
  });

  it("covers required MR-readiness focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2MrReadinessEvidence.some((item) => item.mrReadinessFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2MrReadinessEvidence.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2MrReadinessEvidence) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_mr_readiness_/);
      expect(item.mrReadinessPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.evidenceAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.mrReadinessPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.evidenceAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.mrReadinessPrompt_vi.length).toBeGreaterThan(40);
      expect(item.mrReadinessPrompt_en.length).toBeGreaterThan(40);
      expect(item.evidenceAnswer_vi.length).toBeGreaterThan(60);
      expect(item.evidenceAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies MR-readiness, final-freeze, final-lock, and pre-integration evidence", () => {
    for (const item of punjabiB2MrReadinessEvidence) {
      expect(item.mrReadinessEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.mrReadinessEvidence_en.length).toBe(item.mrReadinessEvidence_vi.length);
      expect(item.finalFreezeEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalFreezeEvidence_en.length).toBe(item.finalFreezeEvidence_vi.length);
      expect(item.finalLockEvidence_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalLockEvidence_en.length).toBe(item.finalLockEvidence_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2MrReadinessEvidence.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2MrReadinessEvidence);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
