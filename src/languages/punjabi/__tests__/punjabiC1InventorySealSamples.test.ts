import { describe, expect, it } from "vitest";

import punjabiC1InventorySealSamples, {
  c1InventorySealSamplesScriptAwareness,
  punjabiC1InventorySealSamples as namedPunjabiC1InventorySealSamples,
} from "../c1InventorySealSamples";

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
  "inventory_seal",
  "pre_a11_inventory_seal",
  "catalog",
  "bundle",
  "receipt",
  "ledger",
  "pre_integration",
  "public_service",
] as const;

describe("Punjabi C1 inventory seal samples - app data contract", () => {
  it("contains a compact inventory seal pack with stable ids", () => {
    expect(punjabiC1InventorySealSamples).toBe(namedPunjabiC1InventorySealSamples);
    expect(punjabiC1InventorySealSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1InventorySealSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1InventorySealSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_inventory_seal_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1InventorySealSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required inventory seal areas and modes", () => {
    const present = new Set(punjabiC1InventorySealSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1InventorySealSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }
  });
});

describe("Punjabi C1 inventory seal samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1InventorySealSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.inventory_seal_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.inventory_seal_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes inventory seal checks, catalog notes, bundle notes, pre-integration notes, and Canada examples", () => {
    for (const sample of punjabiC1InventorySealSamples) {
      expect(sample.inventory_seal_checks_vi.length).toBeGreaterThanOrEqual(6);
      expect(sample.inventory_seal_checks_en.length).toBeGreaterThanOrEqual(6);
      expect(sample.pre_a11_inventory_seal_checks_vi.length).toBeGreaterThanOrEqual(6);
      expect(sample.pre_a11_inventory_seal_checks_en.length).toBeGreaterThanOrEqual(6);
      expect(sample.catalog_notes_vi.length).toBeGreaterThanOrEqual(5);
      expect(sample.catalog_notes_en.length).toBeGreaterThanOrEqual(5);
      expect(sample.bundle_notes_vi.length).toBeGreaterThanOrEqual(4);
      expect(sample.bundle_notes_en.length).toBeGreaterThanOrEqual(4);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(6);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(6);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(8);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(8);
    }
  });
});

describe("Punjabi C1 inventory seal samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1InventorySealSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1InventorySealSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1InventorySealSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1InventorySealSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1InventorySealSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 59 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1InventorySealSamples);
    expect(allText).toContain("pre-A11-inventory-seal");
    expect(allText).toContain("catalog");
    expect(allText).toContain("bundle");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
