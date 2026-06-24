import { describe, expect, it } from "vitest";

import punjabiArgumentStressTestsB2, {
  punjabiArgumentStressTestsB2 as namedPunjabiArgumentStressTestsB2,
  type PunjabiArgumentStressTestsB2Focus,
  type PunjabiArgumentStressTestsB2Topic,
} from "../argumentStressTestsB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiArgumentStressTestsB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiArgumentStressTestsB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiArgumentStressTestsB2", () => {
  it("exports the same compact app-consumable stress test set as default and named exports", () => {
    expect(punjabiArgumentStressTestsB2).toBe(namedPunjabiArgumentStressTestsB2);
    expect(punjabiArgumentStressTestsB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiArgumentStressTestsB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required stress focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiArgumentStressTestsB2.some((item) => item.stressFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiArgumentStressTestsB2.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiArgumentStressTestsB2) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_stress_/);
      expect(item.stressPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.weakEvidence_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.stressResponse_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.stressPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.weakEvidence_romanization).not.toMatch(gurmukhiPattern);
      expect(item.stressResponse_romanization).not.toMatch(gurmukhiPattern);
      expect(item.stressPrompt_vi.length).toBeGreaterThan(40);
      expect(item.stressPrompt_en.length).toBeGreaterThan(40);
      expect(item.stressResponse_vi.length).toBeGreaterThan(40);
      expect(item.stressResponse_en.length).toBeGreaterThan(40);
    }
  });

  it("includes final-risk, final-QA, and Canada-practical stress signals", () => {
    for (const item of punjabiArgumentStressTestsB2) {
      expect(item.finalRisk_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.finalRisk_en.length).toBe(item.finalRisk_vi.length);
      expect(item.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalQa_en.length).toBe(item.finalQa_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(20);
      expect(item.learnerTrap_en.length).toBeGreaterThan(20);
    }

    const canadaExamples = punjabiArgumentStressTestsB2.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );
    expect(canadaExamples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiArgumentStressTestsB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
