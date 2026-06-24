import { describe, expect, it } from "vitest";

import punjabiB2ArchiveSamples, {
  punjabiB2ArchiveSamples as namedPunjabiB2ArchiveSamples,
  type PunjabiB2ArchiveSamplesFocus,
  type PunjabiB2ArchiveSamplesTopic,
} from "../b2ArchiveSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2ArchiveSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2ArchiveSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2ArchiveSamples", () => {
  it("exports the same compact app-consumable archive set as default and named exports", () => {
    expect(punjabiB2ArchiveSamples).toBe(namedPunjabiB2ArchiveSamples);
    expect(punjabiB2ArchiveSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2ArchiveSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required archive focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2ArchiveSamples.some((item) => item.archiveFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2ArchiveSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2ArchiveSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_archive_/);
      expect(item.archivePrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.archiveAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.archivePrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.archiveAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.archivePrompt_vi.length).toBeGreaterThan(40);
      expect(item.archivePrompt_en.length).toBeGreaterThan(40);
      expect(item.archiveAnswer_vi.length).toBeGreaterThan(60);
      expect(item.archiveAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies archive, signoff, seal, and pre-integration checks", () => {
    for (const item of punjabiB2ArchiveSamples) {
      expect(item.preA11Archive_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Archive_en.length).toBe(item.preA11Archive_vi.length);
      expect(item.signoffChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.signoffChecks_en.length).toBe(item.signoffChecks_vi.length);
      expect(item.sealChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.sealChecks_en.length).toBe(item.sealChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2ArchiveSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2ArchiveSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
