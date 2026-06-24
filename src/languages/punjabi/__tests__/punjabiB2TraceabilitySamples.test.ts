import { describe, expect, it } from "vitest";

import punjabiB2TraceabilitySamples, {
  punjabiB2TraceabilitySamples as namedPunjabiB2TraceabilitySamples,
  type PunjabiB2TraceabilitySamplesFocus,
  type PunjabiB2TraceabilitySamplesTopic,
} from "../b2TraceabilitySamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2TraceabilitySamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2TraceabilitySamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredGoals = [
  "goal_opinion",
  "goal_evidence",
  "goal_counterpoint",
  "goal_tradeoff",
  "goal_recommendation",
  "goal_settlement",
] as const;

describe("punjabiB2TraceabilitySamples", () => {
  it("exports the same compact app-consumable traceability set as default and named exports", () => {
    expect(punjabiB2TraceabilitySamples).toBe(namedPunjabiB2TraceabilitySamples);
    expect(punjabiB2TraceabilitySamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2TraceabilitySamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 traceability focuses, goals, and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2TraceabilitySamples.some((item) => item.traceabilityFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2TraceabilitySamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const goals = new Set(punjabiB2TraceabilitySamples.map((item) => item.traceabilityGoal));
    for (const goal of requiredGoals) {
      expect(goals.has(goal), `missing goal ${goal}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2TraceabilitySamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_traceability_/);
      expect(item.traceTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.traceAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.traceAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.traceTitle_vi.length).toBeGreaterThan(30);
      expect(item.traceTitle_en.length).toBeGreaterThan(30);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.traceAnswer_vi.length).toBeGreaterThan(90);
      expect(item.traceAnswer_en.length).toBeGreaterThan(90);
      expect(item.goalLink_vi.length).toBeGreaterThan(40);
      expect(item.goalLink_en.length).toBeGreaterThan(40);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves traceability, evidence-receipt, completion-record, and pre-integration checks", () => {
    for (const item of punjabiB2TraceabilitySamples) {
      expect(item.traceabilityChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.traceabilityChecks_en.length).toBe(item.traceabilityChecks_vi.length);
      expect(item.traceabilityChecks_en.join(" ")).toMatch(/traceability/i);
      expect(item.evidenceReceiptChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.evidenceReceiptChecks_en.length).toBe(item.evidenceReceiptChecks_vi.length);
      expect(item.completionRecordChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.completionRecordChecks_en.length).toBe(item.completionRecordChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(120);
      expect(item.learnerTrap_en.length).toBeGreaterThan(120);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2TraceabilitySamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2TraceabilitySamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
