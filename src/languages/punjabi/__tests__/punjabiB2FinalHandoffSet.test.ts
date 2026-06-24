import { describe, expect, it } from "vitest";

import punjabiB2FinalHandoffSet, {
  punjabiB2FinalHandoffSet as namedPunjabiB2FinalHandoffSet,
  type PunjabiB2FinalHandoffSetFocus,
  type PunjabiB2FinalHandoffSetTopic,
} from "../b2FinalHandoffSet";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;

const requiredFocuses: PunjabiB2FinalHandoffSetFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2FinalHandoffSetTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2FinalHandoffSet", () => {
  it("exports the same compact app-consumable handoff set as default and named exports", () => {
    expect(punjabiB2FinalHandoffSet).toBe(namedPunjabiB2FinalHandoffSet);
    expect(punjabiB2FinalHandoffSet.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2FinalHandoffSet.length).toBeLessThanOrEqual(18);
  });

  it("covers the required handoff focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2FinalHandoffSet.some((item) => item.handoffFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2FinalHandoffSet.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2FinalHandoffSet) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_handoff_/);
      expect(item.handoffPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.selectedAngle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.handoffPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.selectedAngle_romanization).not.toMatch(gurmukhiPattern);
      expect(item.handoffPrompt_vi.length).toBeGreaterThan(40);
      expect(item.handoffPrompt_en.length).toBeGreaterThan(40);
      expect(item.selectedAngle_vi.length).toBeGreaterThan(40);
      expect(item.selectedAngle_en.length).toBeGreaterThan(40);
    }
  });

  it("includes pre-integration, final-readiness, handoff notes, and selector guards", () => {
    for (const item of punjabiB2FinalHandoffSet) {
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.finalReadiness_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.finalReadiness_en.length).toBe(item.finalReadiness_vi.length);
      expect(item.handoffNotes_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.handoffNotes_en.length).toBe(item.handoffNotes_vi.length);
      expect(item.selectorGuard_vi.length).toBeGreaterThanOrEqual(2);
      expect(item.selectorGuard_en.length).toBe(item.selectorGuard_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2FinalHandoffSet.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness and deferred review within the allowed scope", () => {
    const serialized = JSON.stringify(punjabiB2FinalHandoffSet);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
  });
});
