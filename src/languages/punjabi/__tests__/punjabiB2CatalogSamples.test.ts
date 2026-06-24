import { describe, expect, it } from "vitest";

import punjabiB2CatalogSamples, {
  punjabiB2CatalogSamples as namedPunjabiB2CatalogSamples,
  type PunjabiB2CatalogSamplesFocus,
  type PunjabiB2CatalogSamplesTopic,
} from "../b2CatalogSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2CatalogSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2CatalogSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredSections = [
  "opinion_catalog",
  "evidence_catalog",
  "counterpoint_catalog",
  "tradeoff_catalog",
  "recommendation_catalog",
  "settlement_catalog",
] as const;

describe("punjabiB2CatalogSamples", () => {
  it("exports the same compact app-consumable catalog set as default and named exports", () => {
    expect(punjabiB2CatalogSamples).toBe(namedPunjabiB2CatalogSamples);
    expect(punjabiB2CatalogSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2CatalogSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 catalog focuses, sections, and practical discussion topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2CatalogSamples.some((item) => item.catalogFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2CatalogSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const sections = new Set(punjabiB2CatalogSamples.map((item) => item.catalogSection));
    for (const section of requiredSections) {
      expect(sections.has(section), `missing section ${section}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2CatalogSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_catalog_/);
      expect(item.catalogTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.modelAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.modelAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.catalogTitle_vi.length).toBeGreaterThan(20);
      expect(item.catalogTitle_en.length).toBeGreaterThan(20);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.modelAnswer_vi.length).toBeGreaterThan(70);
      expect(item.modelAnswer_en.length).toBeGreaterThan(70);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves reasoning content for later catalog, bundle, receipt, and pre-integration use", () => {
    for (const item of punjabiB2CatalogSamples) {
      expect(item.reasoningLines.length).toBeGreaterThanOrEqual(3);
      for (const line of item.reasoningLines) {
        expect(line.line_gurmukhi).toMatch(gurmukhiPattern);
        expect(line.line_romanization).not.toMatch(gurmukhiPattern);
        expect(line.line_vi.length).toBeGreaterThan(20);
        expect(line.line_en.length).toBeGreaterThan(20);
      }

      expect(item.preA11CatalogChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11CatalogChecks_en.length).toBe(item.preA11CatalogChecks_vi.length);
      expect(item.bundleChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.bundleChecks_en.length).toBe(item.bundleChecks_vi.length);
      expect(item.receiptChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.receiptChecks_en.length).toBe(item.receiptChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(50);
      expect(item.learnerTrap_en.length).toBeGreaterThan(50);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2CatalogSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2CatalogSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
