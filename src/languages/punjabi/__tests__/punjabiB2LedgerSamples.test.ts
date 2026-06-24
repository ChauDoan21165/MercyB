import { describe, expect, it } from "vitest";

import punjabiB2LedgerSamples, {
  punjabiB2LedgerSamples as namedPunjabiB2LedgerSamples,
  type PunjabiB2LedgerSamplesFocus,
  type PunjabiB2LedgerSamplesTopic,
} from "../b2LedgerSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2LedgerSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2LedgerSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

const requiredStyles = [
  "pre_a11_ledger",
  "archive_copy",
  "signoff",
  "pre_merge",
  "qa",
  "pre_integration",
  "readiness_check",
] as const;

describe("punjabiB2LedgerSamples", () => {
  it("exports the same compact app-consumable ledger set as default and named exports", () => {
    expect(punjabiB2LedgerSamples).toBe(namedPunjabiB2LedgerSamples);
    expect(punjabiB2LedgerSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2LedgerSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required ledger focuses, practical topics, and style spread", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2LedgerSamples.some((item) => item.ledgerFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2LedgerSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const styles = new Set(punjabiB2LedgerSamples.map((item) => item.style));
    for (const style of requiredStyles) {
      expect(styles.has(style), `missing style ${style}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2LedgerSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_ledger_/);
      expect(item.ledgerPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.ledgerAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.ledgerPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.ledgerAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.ledgerPrompt_vi.length).toBeGreaterThan(40);
      expect(item.ledgerPrompt_en.length).toBeGreaterThan(40);
      expect(item.ledgerAnswer_vi.length).toBeGreaterThan(60);
      expect(item.ledgerAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies ledger, archive, signoff, and pre-integration checks", () => {
    for (const item of punjabiB2LedgerSamples) {
      expect(item.preA11Ledger_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Ledger_en.length).toBe(item.preA11Ledger_vi.length);
      expect(item.archiveChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.archiveChecks_en.length).toBe(item.archiveChecks_vi.length);
      expect(item.signoffChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.signoffChecks_en.length).toBe(item.signoffChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2LedgerSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2LedgerSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
