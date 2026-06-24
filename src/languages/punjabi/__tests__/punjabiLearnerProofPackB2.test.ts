import { describe, expect, it } from "vitest";

import punjabiLearnerProofPackB2, {
  punjabiLearnerProofPackB2 as namedPunjabiLearnerProofPackB2,
  type PunjabiLearnerProofPackB2Focus,
  type PunjabiLearnerProofPackB2Topic,
} from "../learnerProofPackB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiLearnerProofPackB2Focus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiLearnerProofPackB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiLearnerProofPackB2", () => {
  it("exports the same compact app-consumable proof pack as default and named exports", () => {
    expect(punjabiLearnerProofPackB2).toBe(namedPunjabiLearnerProofPackB2);
    expect(punjabiLearnerProofPackB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiLearnerProofPackB2.length).toBeLessThanOrEqual(18);
  });

  it("covers the required proof focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiLearnerProofPackB2.some((item) => item.proofFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiLearnerProofPackB2.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiLearnerProofPackB2) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_proof_/);
      expect(item.proofPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.modelProof_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.proofPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.modelProof_romanization).not.toMatch(gurmukhiPattern);
      expect(item.proofPrompt_vi.length).toBeGreaterThan(40);
      expect(item.proofPrompt_en.length).toBeGreaterThan(40);
      expect(item.modelProof_vi.length).toBeGreaterThan(40);
      expect(item.modelProof_en.length).toBeGreaterThan(40);
    }
  });

  it("includes final-owner-review, final-QA, and Canada-practical proof signals", () => {
    for (const item of punjabiLearnerProofPackB2) {
      expect(item.finalOwnerReview_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalOwnerReview_en.length).toBe(item.finalOwnerReview_vi.length);
      expect(item.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalQa_en.length).toBe(item.finalQa_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(20);
      expect(item.learnerTrap_en.length).toBeGreaterThan(20);
    }

    const canadaExamples = punjabiLearnerProofPackB2.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );
    expect(canadaExamples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiLearnerProofPackB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
