import { describe, expect, it } from "vitest";

import punjabiC1TraceabilitySamples, {
  c1TraceabilitySamplesScriptAwareness,
  punjabiC1TraceabilitySamples as namedPunjabiC1TraceabilitySamples,
} from "../c1TraceabilitySamples";

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
  "traceability",
  "pre_a11_traceability",
  "evidence_receipt",
  "completion_record",
  "inventory_seal",
  "catalog",
  "pre_integration",
  "public_service",
] as const;

describe("Punjabi C1 traceability samples - app data contract", () => {
  it("contains a compact traceability pack with stable ids", () => {
    expect(punjabiC1TraceabilitySamples).toBe(namedPunjabiC1TraceabilitySamples);
    expect(punjabiC1TraceabilitySamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1TraceabilitySamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1TraceabilitySamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_traceability_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1TraceabilitySamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required traceability areas, modes, and goal tags", () => {
    const present = new Set(punjabiC1TraceabilitySamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1TraceabilitySamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }

    for (const sample of punjabiC1TraceabilitySamples) {
      expect(sample.goal_tag).toMatch(/^goal:c1-/);
      expect(sample.traceability_prompt_en).toContain(sample.goal_tag);
      expect(sample.traceability_prompt_vi).toContain(sample.goal_tag);
    }
  });
});

describe("Punjabi C1 traceability samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1TraceabilitySamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.traceability_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.traceability_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes traceability checks, evidence notes, completion notes, pre-integration notes, and Canada examples", () => {
    for (const sample of punjabiC1TraceabilitySamples) {
      expect(sample.traceability_checks_vi.length).toBeGreaterThanOrEqual(9);
      expect(sample.traceability_checks_en.length).toBeGreaterThanOrEqual(9);
      expect(sample.pre_a11_traceability_checks_vi.length).toBeGreaterThanOrEqual(9);
      expect(sample.pre_a11_traceability_checks_en.length).toBeGreaterThanOrEqual(9);
      expect(sample.evidence_receipt_notes_vi.length).toBeGreaterThanOrEqual(8);
      expect(sample.evidence_receipt_notes_en.length).toBeGreaterThanOrEqual(8);
      expect(sample.completion_record_notes_vi.length).toBeGreaterThanOrEqual(7);
      expect(sample.completion_record_notes_en.length).toBeGreaterThanOrEqual(7);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(9);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(9);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(15);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(15);
    }
  });
});

describe("Punjabi C1 traceability samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1TraceabilitySamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1TraceabilitySamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1TraceabilitySamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1TraceabilitySamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1TraceabilitySamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 62 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1TraceabilitySamples);
    expect(allText).toContain("pre-A11-traceability");
    expect(allText).toContain("evidence-receipt");
    expect(allText).toContain("completion_record");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
