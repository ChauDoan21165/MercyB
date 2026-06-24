import { describe, expect, it } from "vitest";

import punjabiB2AuditTrailSamples, {
  punjabiB2AuditTrailSamples as namedPunjabiB2AuditTrailSamples,
  type PunjabiB2AuditTrailSamplesFocus,
  type PunjabiB2AuditTrailSamplesTopic,
} from "../b2AuditTrailSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2AuditTrailSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2AuditTrailSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredStages = [
  "audit_trail",
  "traceability_checked",
  "evidence_receipt_checked",
  "completion_record_checked",
  "pre_integration_hold",
] as const;

describe("punjabiB2AuditTrailSamples", () => {
  it("exports the same compact app-consumable audit-trail set as default and named exports", () => {
    expect(punjabiB2AuditTrailSamples).toBe(namedPunjabiB2AuditTrailSamples);
    expect(punjabiB2AuditTrailSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2AuditTrailSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 audit-trail focuses, stages, and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2AuditTrailSamples.some((item) => item.auditTrailFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2AuditTrailSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const stages = new Set(punjabiB2AuditTrailSamples.map((item) => item.auditTrailStage));
    for (const stage of requiredStages) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2AuditTrailSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_audit_trail_/);
      expect(item.auditTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.auditAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.auditAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.auditTitle_vi.length).toBeGreaterThan(30);
      expect(item.auditTitle_en.length).toBeGreaterThan(30);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.auditAnswer_vi.length).toBeGreaterThan(90);
      expect(item.auditAnswer_en.length).toBeGreaterThan(90);
      expect(item.goalLink_vi.length).toBeGreaterThan(40);
      expect(item.goalLink_en.length).toBeGreaterThan(40);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves audit-trail, traceability, evidence-receipt, and pre-integration checks", () => {
    for (const item of punjabiB2AuditTrailSamples) {
      expect(item.auditTrailChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.auditTrailChecks_en.length).toBe(item.auditTrailChecks_vi.length);
      expect(item.auditTrailChecks_en.join(" ")).toMatch(/audit-trail/i);
      expect(item.traceabilityChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.traceabilityChecks_en.length).toBe(item.traceabilityChecks_vi.length);
      expect(item.evidenceReceiptChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.evidenceReceiptChecks_en.length).toBe(item.evidenceReceiptChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(130);
      expect(item.learnerTrap_en.length).toBeGreaterThan(130);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2AuditTrailSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2AuditTrailSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
