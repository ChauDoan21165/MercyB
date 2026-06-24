import { describe, expect, it } from "vitest";

import punjabiC1CatalogSamples, {
  c1CatalogSamplesScriptAwareness,
  punjabiC1CatalogSamples as namedPunjabiC1CatalogSamples,
} from "../c1CatalogSamples";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_AREAS = [
  "source_summary",
  "cautious_claim",
  "evidence_comparison",
  "formal_correspondence",
  "executive_summary",
  "register_calibration",
  "presentation_response",
  "public_professional_tone",
] as const;

const REQUIRED_MODES = [
  "catalog",
  "pre_a11_catalog",
  "bundle",
  "receipt",
  "ledger",
  "archive_copy",
  "pre_integration",
  "public_service",
] as const;

describe("Punjabi C1 catalog samples - app data contract", () => {
  it("contains a compact catalog pack with stable ids", () => {
    expect(punjabiC1CatalogSamples).toBe(namedPunjabiC1CatalogSamples);
    expect(punjabiC1CatalogSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1CatalogSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1CatalogSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_catalog_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1CatalogSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required catalog areas and modes", () => {
    const present = new Set(punjabiC1CatalogSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1CatalogSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }
  });
});

describe("Punjabi C1 catalog samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1CatalogSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.catalog_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.catalog_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes catalog checks, pre-A11 catalog checks, bundle notes, receipt notes, and Canada examples", () => {
    for (const sample of punjabiC1CatalogSamples) {
      expect(sample.catalog_checks_vi.length).toBeGreaterThanOrEqual(5);
      expect(sample.catalog_checks_en.length).toBeGreaterThanOrEqual(5);
      expect(sample.pre_a11_catalog_checks_vi.length).toBeGreaterThanOrEqual(5);
      expect(sample.pre_a11_catalog_checks_en.length).toBeGreaterThanOrEqual(5);
      expect(sample.bundle_notes_vi.length).toBeGreaterThanOrEqual(4);
      expect(sample.bundle_notes_en.length).toBeGreaterThanOrEqual(4);
      expect(sample.receipt_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.receipt_notes_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(5);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(5);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(6);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(6);
    }
  });
});

describe("Punjabi C1 catalog samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1CatalogSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1CatalogSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1CatalogSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1CatalogSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1CatalogSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 58 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1CatalogSamples);
    expect(allText).toContain("pre-A11-catalog");
    expect(allText).toContain("bundle");
    expect(allText).toContain("receipt");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
