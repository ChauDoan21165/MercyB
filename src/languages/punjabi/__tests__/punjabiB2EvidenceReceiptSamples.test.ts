import { describe, expect, it } from "vitest";

import punjabiB2EvidenceReceiptSamples, {
  punjabiB2EvidenceReceiptSamples as namedPunjabiB2EvidenceReceiptSamples,
  type PunjabiB2EvidenceReceiptSamplesFocus,
  type PunjabiB2EvidenceReceiptSamplesTopic,
} from "../b2EvidenceReceiptSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2EvidenceReceiptSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2EvidenceReceiptSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredStatuses = [
  "evidence_receipt",
  "completion_record_checked",
  "inventory_seal_checked",
  "catalog_chain_checked",
  "pre_integration_hold",
] as const;

describe("punjabiB2EvidenceReceiptSamples", () => {
  it("exports the same compact app-consumable evidence-receipt set as default and named exports", () => {
    expect(punjabiB2EvidenceReceiptSamples).toBe(namedPunjabiB2EvidenceReceiptSamples);
    expect(punjabiB2EvidenceReceiptSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2EvidenceReceiptSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 evidence-receipt focuses, statuses, and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2EvidenceReceiptSamples.some((item) => item.evidenceReceiptFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2EvidenceReceiptSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const statuses = new Set(punjabiB2EvidenceReceiptSamples.map((item) => item.evidenceReceiptStatus));
    for (const status of requiredStatuses) {
      expect(statuses.has(status), `missing status ${status}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2EvidenceReceiptSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_evidence_receipt_/);
      expect(item.receiptTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.receiptAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.receiptAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.receiptTitle_vi.length).toBeGreaterThan(30);
      expect(item.receiptTitle_en.length).toBeGreaterThan(30);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.receiptAnswer_vi.length).toBeGreaterThan(90);
      expect(item.receiptAnswer_en.length).toBeGreaterThan(90);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves evidence-receipt, completion-record, inventory-seal, and pre-integration checks", () => {
    for (const item of punjabiB2EvidenceReceiptSamples) {
      expect(item.evidenceReceiptChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.evidenceReceiptChecks_en.length).toBe(item.evidenceReceiptChecks_vi.length);
      expect(item.evidenceReceiptChecks_en.join(" ")).toMatch(/evidence-receipt/i);
      expect(item.completionRecordChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.completionRecordChecks_en.length).toBe(item.completionRecordChecks_vi.length);
      expect(item.inventorySealChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.inventorySealChecks_en.length).toBe(item.inventorySealChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(100);
      expect(item.learnerTrap_en.length).toBeGreaterThan(100);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2EvidenceReceiptSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2EvidenceReceiptSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
