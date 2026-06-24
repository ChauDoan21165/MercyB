import { describe, expect, it } from "vitest";

import punjabiB2SnapshotSamples, {
  punjabiB2SnapshotSamples as namedPunjabiB2SnapshotSamples,
  type PunjabiB2SnapshotSamplesFocus,
  type PunjabiB2SnapshotSamplesTopic,
} from "../b2SnapshotSamples";

const gurmukhiPattern = /[\u0A00-\u0A7F]/u;
const nativeReviewClaimPattern =
  /\b(native[- ]reviewed|reviewed by native|native approved|native speaker reviewed)\b/i;
const forbiddenSystemsPattern =
  /\b(audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config)\b/i;
const a11IntegrationClaimPattern = /\bA11 integration\b/i;

const requiredFocuses: PunjabiB2SnapshotSamplesFocus[] = [
  "structured_opinion",
  "comparison",
  "counterpoint",
  "recommendation",
  "workplace_fairness",
];

const requiredTopics: PunjabiB2SnapshotSamplesTopic[] = [
  "settlement",
  "education",
  "healthcare_access",
  "housing",
  "transport",
  "public_service",
  "work",
];

describe("punjabiB2SnapshotSamples", () => {
  it("exports the same compact app-consumable snapshot set as default and named exports", () => {
    expect(punjabiB2SnapshotSamples).toBe(namedPunjabiB2SnapshotSamples);
    expect(punjabiB2SnapshotSamples.length).toBeGreaterThanOrEqual(11);
    expect(punjabiB2SnapshotSamples.length).toBeLessThanOrEqual(18);
  });

  it("covers required snapshot focuses and practical topics", () => {
    for (const focus of requiredFocuses) {
      expect(
        punjabiB2SnapshotSamples.some((item) => item.snapshotFocus === focus),
        `missing focus ${focus}`,
      ).toBe(true);
    }

    for (const topic of requiredTopics) {
      expect(
        punjabiB2SnapshotSamples.some((item) => item.topic === topic),
        `missing topic ${topic}`,
      ).toBe(true);
    }
  });

  it("keeps Gurmukhi primary with romanization plus Vietnamese and English support", () => {
    for (const item of punjabiB2SnapshotSamples) {
      expect(item.level).toBe("B2");
      expect(item.id).toMatch(/^pa_b2_snapshot_/);
      expect(item.snapshotPrompt_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.snapshotAnswer_gurmukhi).toMatch(gurmukhiPattern);
      expect(item.snapshotPrompt_romanization).not.toMatch(gurmukhiPattern);
      expect(item.snapshotAnswer_romanization).not.toMatch(gurmukhiPattern);
      expect(item.snapshotPrompt_vi.length).toBeGreaterThan(40);
      expect(item.snapshotPrompt_en.length).toBeGreaterThan(40);
      expect(item.snapshotAnswer_vi.length).toBeGreaterThan(60);
      expect(item.snapshotAnswer_en.length).toBeGreaterThan(60);
    }
  });

  it("verifies snapshot, closure-packet, pre-merge, and pre-integration checks", () => {
    for (const item of punjabiB2SnapshotSamples) {
      expect(item.preA11Snapshot_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preA11Snapshot_en.length).toBe(item.preA11Snapshot_vi.length);
      expect(item.closurePacketChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.closurePacketChecks_en.length).toBe(item.closurePacketChecks_vi.length);
      expect(item.preMergeChecks_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preMergeChecks_en.length).toBe(item.preMergeChecks_vi.length);
      expect(item.preIntegration_vi.length).toBeGreaterThanOrEqual(3);
      expect(item.preIntegration_en.length).toBe(item.preIntegration_vi.length);
      expect(item.learnerTrap_vi.length).toBeGreaterThan(40);
      expect(item.learnerTrap_en.length).toBeGreaterThan(40);
    }
  });

  it("includes Canada-practical examples where useful", () => {
    const examples = punjabiB2SnapshotSamples.filter(
      (item) => item.canadaPracticalExample_vi && item.canadaPracticalExample_en,
    );

    expect(examples.length).toBeGreaterThanOrEqual(6);
  });

  it("keeps script awareness, deferred review, and boundary claims within scope", () => {
    const serialized = JSON.stringify(punjabiB2SnapshotSamples);
    const shahmukhiMentions = serialized.match(/Shahmukhi/g) ?? [];

    expect(shahmukhiMentions.length).toBeLessThanOrEqual(1);
    expect(serialized).toContain("awareness only");
    expect(serialized).toContain("deferred");
    expect(serialized).not.toMatch(nativeReviewClaimPattern);
    expect(serialized).not.toMatch(forbiddenSystemsPattern);
    expect(serialized).not.toMatch(a11IntegrationClaimPattern);
  });
});
