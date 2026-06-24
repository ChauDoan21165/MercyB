import { describe, expect, it } from "vitest";

import punjabiB2BundleSamples, {
  punjabiB2BundleSamples as namedPunjabiB2BundleSamples,
  type PunjabiB2BundleSamplesFocus,
  type PunjabiB2BundleSamplesTopic,
} from "../b2BundleSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2BundleSamplesFocus[] = [
  "structured_opinion",
  "evidence",
  "counterpoint",
  "tradeoff",
  "recommendation",
  "settlement",
];

const requiredTopics: PunjabiB2BundleSamplesTopic[] = [
  "work",
  "education",
  "healthcare",
  "housing",
  "transport",
  "public_service",
];

describe("punjabiB2BundleSamples", () => {
  it("exports the same compact app-consumable bundle set as default and named exports", () => {
    expect(punjabiB2BundleSamples).toBe(namedPunjabiB2BundleSamples);
    expect(punjabiB2BundleSamples.length).toBeGreaterThanOrEqual(6);
    expect(punjabiB2BundleSamples.length).toBeLessThanOrEqual(14);
  });

  it("covers required B2 bundle focuses and practical discussion topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2BundleSamples.some((item) => item.bundleFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2BundleSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2BundleSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_bundle_/);
      expect(item.prompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.modelAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.prompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.modelAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.prompt_vi.length).toBeGreaterThan(35);
      expect(item.prompt_en.length).toBeGreaterThan(35);
      expect(item.modelAnswer_vi.length).toBeGreaterThan(70);
      expect(item.modelAnswer_en.length).toBeGreaterThan(70);
      expect(item.nativeReview).toBe("deferred");
    }
  });

  it("ships stable reasoning content for later bundle, receipt, ledger, and pre-integration use", () => {
    for (const item of punjabiB2BundleSamples) {
      expect(item.reasoningLines.length).toBeGreaterThanOrEqual(3);
      for (const line of item.reasoningLines) {
        expect(line.line_gurmukhi).toMatch(gurmukhiPattern);
        expect(line.line_romanization).not.toMatch(gurmukhiPattern);
        expect(line.line_vi.length).toBeGreaterThan(20);
        expect(line.line_en.length).toBeGreaterThan(20);
      }

      expect(item.bundleChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.bundleChecks_en.length).toBe(item.bundleChecks_vi.length);
      expect(item.bundleChecks_en.join(" ")).toMatch(/bundle/i);
      expect(item.bundleChecks_en.join(" ")).toMatch(/receipt/i);
      expect(item.bundleChecks_en.join(" ")).toMatch(/ledger/i);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(50);
      expect(item.learnerTrap_en.length).toBeGreaterThan(50);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2BundleSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(5);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2BundleSamples);

    expect(serialized).toContain("Shahmukhi");
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
