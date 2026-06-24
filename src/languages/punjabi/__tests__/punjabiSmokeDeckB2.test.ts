import { describe, expect, it } from "vitest";

import punjabiSmokeDeckB2, {
  punjabiSmokeDeckB2 as namedPunjabiSmokeDeckB2,
  type PunjabiSmokeDeckB2Focus,
  type PunjabiSmokeDeckB2Topic,
} from "../smokeDeckB2";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiSmokeDeckB2Focus[] = [
  "opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiSmokeDeckB2Topic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiSmokeDeckB2", () => {
  it("exports the same compact app-consumable smoke deck as default and named exports", () => {
    expect(punjabiSmokeDeckB2).toBe(namedPunjabiSmokeDeckB2);
    expect(punjabiSmokeDeckB2.length).toBeGreaterThanOrEqual(11);
    expect(punjabiSmokeDeckB2.length).toBeLessThanOrEqual(18);
  });

  it("covers B2 smoke focuses and practical discussion topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiSmokeDeckB2.some((card) => card.focus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiSmokeDeckB2.some((card) => card.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const card of punjabiSmokeDeckB2) {
      expect(card.level).toBe("B2");
      expect(card.id).toMatch(/^pa_b2_smoke_/);
      expect(card.task_gurmukhi).toMatch(gurmukhiPattern);
      expect(card.modelMove_gurmukhi).toMatch(gurmukhiPattern);
      expect(card.task_romanization).not.toMatch(gurmukhiPattern);
      expect(card.modelMove_romanization).not.toMatch(gurmukhiPattern);
      expect(card.task_vi.length).toBeGreaterThan(20);
      expect(card.task_en.length).toBeGreaterThan(20);
      expect(card.modelMove_vi.length).toBeGreaterThan(40);
      expect(card.modelMove_en.length).toBeGreaterThan(40);
    }
  });

  it("includes smoke-check, final-QA, and integration-readiness fields", () => {
    for (const card of punjabiSmokeDeckB2) {
      expect(card.smokeCheck_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.smokeCheck_en.length).toBe(card.smokeCheck_vi.length);
      expect(card.finalQa_vi.length).toBeGreaterThanOrEqual(3);
      expect(card.finalQa_en.length).toBe(card.finalQa_vi.length);
      expect(card.integrationReadiness_vi.length).toBeGreaterThan(20);
      expect(card.integrationReadiness_en.length).toBeGreaterThan(20);
      expect(card.learnerTrap_vi.length).toBeGreaterThan(20);
      expect(card.learnerTrap_en.length).toBeGreaterThan(20);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiSmokeDeckB2.filter(
      (card) => card.canadaPracticalExample_vi && card.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and review language within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiSmokeDeckB2);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
