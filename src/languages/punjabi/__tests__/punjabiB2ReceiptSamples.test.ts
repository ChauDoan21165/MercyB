import { describe, expect, it } from "vitest";

import punjabiB2ReceiptSamples, {
  punjabiB2ReceiptSamples as namedPunjabiB2ReceiptSamples,
  type PunjabiB2ReceiptSamplesFocus,
  type PunjabiB2ReceiptSamplesTopic,
} from "../b2ReceiptSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2ReceiptSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ReceiptSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

const requiredStyles = [
  "pre_a11_receipt",
  "archive_copy",
  "signoff",
  "pre_merge",
  "qa",
  "pre_integration",
  "readiness_check",
] as const;

describe("punjabiB2ReceiptSamples", () => {
  it("exports the same compact app-consumable receipt set as default and named exports", () => {
    expect(punjabiB2ReceiptSamples).toBe(namedPunjabiB2ReceiptSamples);
    expect(punjabiB2ReceiptSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ReceiptSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required receipt focuses, practical topics, and style spread", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ReceiptSamples.some((item) => item.receiptFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ReceiptSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const styles = new Set(punjabiB2ReceiptSamples.map((item) => item.style));
    for (const style of requiredStyles) {
      expect(styles.has(style), `missing style ${style}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ReceiptSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_receipt_/);
      expect(item.receiptPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.receiptAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.receiptPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.receiptAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.receiptPrompt_vi.length).toBeGreaterThan(40);
      expect(item.receiptPrompt_en.length).toBeGreaterThan(40);
      expect(item.receiptAnswer_vi.length).toBeGreaterThan(60);
      expect(item.receiptAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies receipt, ledger, archive, and pre-integration checks", () => {
    for (const item of punjabiB2ReceiptSamples) {
      expect(item.preA11Receipt_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Receipt_en.length).toBe(item.preA11Receipt_vi.length);
      expect(item.ledgerChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.ledgerChecks_en.length).toBe(item.ledgerChecks_vi.length);
      expect(item.archiveChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.archiveChecks_en.length).toBe(item.archiveChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ReceiptSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2ReceiptSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});

