import { describe, expect, it } from "vitest";

import punjabiC1AuditTrailSamples, {
  c1AuditTrailSamplesScriptAwareness,
  punjabiC1AuditTrailSamples as namedPunjabiC1AuditTrailSamples,
} from "../c1AuditTrailSamples";

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
  "audit_trail",
  "pre_a11_audit_trail",
  "traceability",
  "evidence_receipt",
  "completion_record",
  "inventory_seal",
  "pre_integration",
  "public_service",
] as const;

describe("Punjabi C1 audit-trail samples - app data contract", () => {
  it("contains a compact audit-trail pack with stable ids", () => {
    expect(punjabiC1AuditTrailSamples).toBe(namedPunjabiC1AuditTrailSamples);
    expect(punjabiC1AuditTrailSamples.length).toBeGreaterThanOrEqual(8);
    expect(punjabiC1AuditTrailSamples.length).toBeLessThanOrEqual(10);

    const ids = punjabiC1AuditTrailSamples.map((sample) => sample.id);
    expect(ids.every((id) => id.startsWith("pa_c1_audit_trail_"))).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
    expect(punjabiC1AuditTrailSamples.every((sample) => sample.level === "C1")).toBe(true);
  });

  it("covers all required audit-trail areas, modes, goal tags, and audit tags", () => {
    const present = new Set(punjabiC1AuditTrailSamples.map((sample) => sample.area));
    for (const area of REQUIRED_AREAS) {
      expect(present.has(area)).toBe(true);
    }

    const modes = new Set(punjabiC1AuditTrailSamples.map((sample) => sample.mode));
    for (const mode of REQUIRED_MODES) {
      expect(modes.has(mode)).toBe(true);
    }

    for (const sample of punjabiC1AuditTrailSamples) {
      expect(sample.goal_tag).toMatch(/^goal:c1-/);
      expect(sample.audit_tag).toBe(`audit:${sample.goal_tag.replace("goal:", "")}`);
      expect(sample.audit_trail_prompt_en).toContain(sample.goal_tag);
      expect(sample.audit_trail_prompt_vi).toContain(sample.goal_tag);
    }
  });
});

describe("Punjabi C1 audit-trail samples - bilingual Gurmukhi contract", () => {
  it("uses Gurmukhi samples with romanization, Vietnamese, and English support", () => {
    for (const sample of punjabiC1AuditTrailSamples) {
      expect(GURMUKHI.test(sample.title_pa)).toBe(true);
      expect(sample.title_rom.trim().length).toBeGreaterThan(0);
      expect(sample.title_vi.trim().length).toBeGreaterThan(0);
      expect(sample.title_en.trim().length).toBeGreaterThan(0);
      expect(sample.audit_trail_prompt_vi.trim().length).toBeGreaterThan(0);
      expect(sample.audit_trail_prompt_en.trim().length).toBeGreaterThan(0);

      expect(GURMUKHI.test(sample.sample.pa)).toBe(true);
      expect(sample.sample.rom.trim().length).toBeGreaterThan(0);
      expect(sample.sample.vi.trim().length).toBeGreaterThan(0);
      expect(sample.sample.en.trim().length).toBeGreaterThan(0);
    }
  });

  it("includes audit checks, traceability notes, evidence notes, pre-integration notes, and Canada examples", () => {
    for (const sample of punjabiC1AuditTrailSamples) {
      expect(sample.audit_trail_checks_vi.length).toBeGreaterThanOrEqual(10);
      expect(sample.audit_trail_checks_en.length).toBeGreaterThanOrEqual(10);
      expect(sample.pre_a11_audit_trail_checks_vi.length).toBeGreaterThanOrEqual(10);
      expect(sample.pre_a11_audit_trail_checks_en.length).toBeGreaterThanOrEqual(10);
      expect(sample.traceability_notes_vi.length).toBeGreaterThanOrEqual(9);
      expect(sample.traceability_notes_en.length).toBeGreaterThanOrEqual(9);
      expect(sample.evidence_receipt_notes_vi.length).toBeGreaterThanOrEqual(8);
      expect(sample.evidence_receipt_notes_en.length).toBeGreaterThanOrEqual(8);
      expect(sample.pre_integration_notes_vi.length).toBeGreaterThanOrEqual(10);
      expect(sample.pre_integration_notes_en.length).toBeGreaterThanOrEqual(10);

      expect(sample.canada_example.context_vi).toContain("Canada");
      expect(sample.canada_example.context_en).toMatch(/Canada|Canadian/);
      expect(GURMUKHI.test(sample.canada_example.pa)).toBe(true);
      expect(sample.canada_example.rom.trim().length).toBeGreaterThan(0);
      expect(sample.canada_example.vi).toContain("Canada");
      expect(sample.canada_example.en).toMatch(/Canada|Canadian/);
      expect(sample.learner_traps_vi.length).toBeGreaterThanOrEqual(18);
      expect(sample.learner_traps_en.length).toBeGreaterThanOrEqual(18);
    }
  });
});

describe("Punjabi C1 audit-trail samples - script and scope", () => {
  it("mentions Shahmukhi only as awareness and not learner sample content", () => {
    expect(c1AuditTrailSamplesScriptAwareness.vi).toContain("Gurmukhi");
    expect(c1AuditTrailSamplesScriptAwareness.en).toContain("Gurmukhi");
    expect(c1AuditTrailSamplesScriptAwareness.vi).toContain("Shahmukhi");
    expect(c1AuditTrailSamplesScriptAwareness.en).toContain("Shahmukhi");

    const learnerPunjabi = punjabiC1AuditTrailSamples.flatMap((sample) => [
      sample.title_pa,
      sample.sample.pa,
      sample.canada_example.pa,
    ]);
    expect(learnerPunjabi.some((text) => SHAHMUKHI.test(text))).toBe(false);
  });

  it("keeps Wave 63 scoped away from A11 integration and native-review claims", () => {
    const allText = JSON.stringify(punjabiC1AuditTrailSamples);
    expect(allText).toContain("pre-A11-audit-trail");
    expect(allText).toContain("traceability");
    expect(allText).toContain("evidence_receipt");
    expect(allText).toContain("pre-integration");
    expect(allText).not.toMatch(/native reviewed|native-review approved/i);
  });
});
