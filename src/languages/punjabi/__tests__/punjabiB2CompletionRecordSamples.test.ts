import { describe, expect, it } from "vitest";

import punjabiB2CompletionRecordSamples, {
  punjabiB2CompletionRecordSamples as namedPunjabiB2CompletionRecordSamples,
  type PunjabiB2CompletionRecordSamplesFocus,
  type PunjabiB2CompletionRecordSamplesTopic,
} from "../b2CompletionRecordSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2CompletionRecordSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2CompletionRecordSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredStatuses = [
  "completion_record",
  "inventory_seal_verified",
  "catalog_verified",
  "bundle_verified",
  "pre_integration_ready",
] as const;

describe("punjabiB2CompletionRecordSamples", () => {
  it("exports the same compact app-consumable completion-record set as default and named exports", () => {
    expect(punjabiB2CompletionRecordSamples).toBe(namedPunjabiB2CompletionRecordSamples);
    expect(punjabiB2CompletionRecordSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2CompletionRecordSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 completion focuses, statuses, and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2CompletionRecordSamples.some((item) => item.completionFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2CompletionRecordSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const statuses = new Set(punjabiB2CompletionRecordSamples.map((item) => item.completionStatus));
    for (const status of requiredStatuses) {
      expect(statuses.has(status), `missing status ${status}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2CompletionRecordSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_completion_record_/);
      expect(item.recordTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.completionAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.completionAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.recordTitle_vi.length).toBeGreaterThan(30);
      expect(item.recordTitle_en.length).toBeGreaterThan(30);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.completionAnswer_vi.length).toBeGreaterThan(90);
      expect(item.completionAnswer_en.length).toBeGreaterThan(90);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves completion-record, inventory-seal, catalog, and pre-integration checks", () => {
    for (const item of punjabiB2CompletionRecordSamples) {
      expect(item.completionRecordChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.completionRecordChecks_en.length).toBe(item.completionRecordChecks_vi.length);
      expect(item.completionRecordChecks_en.join(" ")).toMatch(/completion-record/i);
      expect(item.inventorySealChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.inventorySealChecks_en.length).toBe(item.inventorySealChecks_vi.length);
      expect(item.catalogChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.catalogChecks_en.length).toBe(item.catalogChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(80);
      expect(item.learnerTrap_en.length).toBeGreaterThan(80);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2CompletionRecordSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2CompletionRecordSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
