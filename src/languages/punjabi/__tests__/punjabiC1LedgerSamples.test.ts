import { describe, expect, it } from "vitest";

import punjabiC1LedgerSamples, {
  c1LedgerSamplesScriptAwareness,
  punjabiC1LedgerSamples as namedPunjabiC1LedgerSamples,
} from "../c1LedgerSamples";

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
  "ledger",
  "pre_a11_ledger",
  "snapshot",
  "archive_copy",
  "signoff",
  "pre_merge",
  "pre_integration",
] as const;

describe("Punjabi C1 ledger samples - app data contract", () => {
  it("contains a compact ledger pack with stable ids", () => {
    expect(punjabiC1LedgerSamples).toBe(namedPunjabiC1LedgerSamples);
    expect(punjabiC1LedgerSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1LedgerSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1LedgerSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_ledger_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1LedgerSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required ledger areas and modes", () => {
    const present = new Set(punjabiC1LedgerSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1LedgerSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }
  });
});

describe("Punjabi C1 ledger samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1LedgerSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.ledger_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.ledger_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes ledger checks, pre-A11-ledger checks, archive-copy notes, and pre-integration notes", () => {
    for (const sample of punjabiC1LedgerSamples) {
      expect(sample.ledger_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.ledger_checks_en.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_ledger_checks_vi.length).toBeGreaterThanOrEqual(3);
      expect(sample.pre_a11_ledger_checks_en.length).toBeGreaterThanOrEqual(3);
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

describe("Punjabi C1 ledger samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1LedgerSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1LedgerSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1LedgerSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1LedgerSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1LedgerSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 55 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1LedgerSamples);
    expect(allText).toContain("pre-A11-ledger");
    expect(allText).toContain("snapshot");
    expect(allText).toContain("Archive");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
