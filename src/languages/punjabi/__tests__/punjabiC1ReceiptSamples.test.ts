import { describe, expect, it } from "vitest";

import punjabiC1ReceiptSamples, {
  c1ReceiptSamplesScriptAwareness,
  punjabiC1ReceiptSamples as namedPunjabiC1ReceiptSamples,
} from "../c1ReceiptSamples";

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
  "receipt",
  "pre_a11_receipt",
  "ledger",
  "archive_copy",
  "signoff",
  "pre_merge",
  "pre_integration",
] as const;

describe("Punjabi C1 receipt samples - app data contract", () => {
  it("contains a compact receipt pack with stable ids", () => {
    expect(punjabiC1ReceiptSamples).toBe(namedPunjabiC1ReceiptSamples);
    expect(punjabiC1ReceiptSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1ReceiptSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1ReceiptSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_receipt_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1ReceiptSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required receipt areas and modes", () => {
    const present = new Set(punjabiC1ReceiptSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1ReceiptSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }
  });
});

describe("Punjabi C1 receipt samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1ReceiptSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.receipt_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.receipt_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes receipt checks, pre-A11-receipt checks, archive-copy notes, and pre-integration notes", () => {
    for (const sample of punjabiC1ReceiptSamples) {
      expect(sample.ledger_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.ledger_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_receipt_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_receipt_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.archive_copy_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.archive_copy_notes_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(3);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(2);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(2);
    }
  });
});

describe("Punjabi C1 receipt samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1ReceiptSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1ReceiptSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1ReceiptSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1ReceiptSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1ReceiptSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 56 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1ReceiptSamples);
    expect(allText).toContain("pre-A11-receipt");
    expect(allText).toContain("Ledger");
    expect(allText).toContain("Archive");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});

