import { describe, expect, it } from "vitest";

import punjabiC1CompletionRecordSamples, {
  c1CompletionRecordSamplesScriptAwareness,
  punjabiC1CompletionRecordSamples as namedPunjabiC1CompletionRecordSamples,
} from "../c1CompletionRecordSamples";

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
  "completion_record",
  "pre_a11_completion_record",
  "inventory_seal",
  "catalog",
  "bundle",
  "receipt",
  "pre_integration",
  "public_service",
] as const;

describe("Punjabi C1 completion record samples - app data contract", () => {
  it("contains a compact completion record pack with stable ids", () => {
    expect(punjabiC1CompletionRecordSamples).toBe(namedPunjabiC1CompletionRecordSamples);
    expect(punjabiC1CompletionRecordSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1CompletionRecordSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1CompletionRecordSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_completion_record_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1CompletionRecordSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required completion record areas and modes", () => {
    const present = new Set(punjabiC1CompletionRecordSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1CompletionRecordSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }
  });
});

describe("Punjabi C1 completion record samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1CompletionRecordSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.completion_record_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.completion_record_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes completion checks, inventory notes, catalog notes, pre-integration notes, and Canada examples", () => {
    for (const sample of punjabiC1CompletionRecordSamples) {
      expect(sample.completion_record_checks_vi.length).toBeGreaterThanOrEqual(7);
      expect(sample.completion_record_checks_en.length).toBeGreaterThanOrEqual(7);
      expect(sample.pre_a11_completion_record_checks_vi.length).toBeGreaterThanOrEqual(7);
      expect(sample.pre_a11_completion_record_checks_en.length).toBeGreaterThanOrEqual(7);
      expect(sample.inventory_seal_notes_vi.length).toBeGreaterThanOrEqual(6);
      expect(sample.inventory_seal_notes_en.length).toBeGreaterThanOrEqual(6);
      expect(sample.catalog_notes_vi.length).toBeGreaterThanOrEqual(5);
      expect(sample.catalog_notes_en.length).toBeGreaterThanOrEqual(5);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(7);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(7);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(10);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(10);
    }
  });
});

describe("Punjabi C1 completion record samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1CompletionRecordSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1CompletionRecordSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1CompletionRecordSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1CompletionRecordSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1CompletionRecordSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 60 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1CompletionRecordSamples);
    expect(allText).toContain("pre-A11-completion-record");
    expect(allText).toContain("inventory-seal");
    expect(allText).toContain("catalog");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
