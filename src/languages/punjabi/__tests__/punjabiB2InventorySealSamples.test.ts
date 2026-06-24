import { describe, expect, it } from "vitest";

import punjabiB2InventorySealSamples, {
  punjabiB2InventorySealSamples as namedPunjabiB2InventorySealSamples,
  type PunjabiB2InventorySealSamplesFocus,
  type PunjabiB2InventorySealSamplesTopic,
} from "../b2InventorySealSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2InventorySealSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2InventorySealSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

const requiredStages = [
  "inventory_seal",
  "catalog_lock",
  "bundle_lock",
  "receipt_lock",
  "pre_integration_hold",
] as const;

describe("punjabiB2InventorySealSamples", () => {
  it("exports the same compact app-consumable inventory-seal set as default and named exports", () => {
    expect(punjabiB2InventorySealSamples).toBe(namedPunjabiB2InventorySealSamples);
    expect(punjabiB2InventorySealSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2InventorySealSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 inventory-seal focuses, stages, and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2InventorySealSamples.some((item) => item.inventorySealFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2InventorySealSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }

    const stages = new Set(punjabiB2InventorySealSamples.map((item) => item.inventorySealStage));
    for (const stage of requiredStages) {
      expect(stages.has(stage), `missing stage ${stage}`).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2InventorySealSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_inventory_seal_/);
      expect(item.sealTitle_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.sealedAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.sealedAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.sealTitle_vi.length).toBeGreaterThan(25);
      expect(item.sealTitle_en.length).toBeGreaterThan(25);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.sealedAnswer_vi.length).toBeGreaterThan(80);
      expect(item.sealedAnswer_en.length).toBeGreaterThan(80);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("preserves inventory-seal, catalog, bundle, and pre-integration checks", () => {
    for (const item of punjabiB2InventorySealSamples) {
      expect(item.inventorySealChecks_vi.length).toBeGreaterThanOrEqual(4);
      expect(item.inventorySealChecks_en.length).toBe(item.inventorySealChecks_vi.length);
      expect(item.inventorySealChecks_en.join(" ")).toMatch(/inventory-seal/i);
      expect(item.catalogChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.catalogChecks_en.length).toBe(item.catalogChecks_vi.length);
      expect(item.bundleChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.bundleChecks_en.length).toBe(item.bundleChecks_vi.length);
      expect(item.preIntegrationChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegrationChecks_en.length).toBe(item.preIntegrationChecks_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(50);
      expect(item.learnerTrap_en.length).toBeGreaterThan(50);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2InventorySealSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2InventorySealSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
