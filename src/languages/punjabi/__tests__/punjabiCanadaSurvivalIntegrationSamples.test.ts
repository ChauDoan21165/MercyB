import { describe, expect, it } from "vitest";

import samples, {
  PUNJABI_CANADA_SURVIVAL_INTEGRATION_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE,
  type PunjabiCanadaSurvivalIntegrationDomain,
} from "@/languages/punjabi/canadaSurvivalIntegrationSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalIntegrationDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "service_desk",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada survival integration samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(samples).toBe(PUNJABI_CANADA_SURVIVAL_INTEGRATION_SAMPLES);
    expect(Array.isArray(samples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE.name).toContain("Punjabi");
  });

  it("covers every required Canada survival domain compactly", () => {
    expect(samples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(samples.length).toBeLessThanOrEqual(18);

    const present = new Set(samples.map((sample) => sample.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and all requested sample styles", () => {
    const ids = samples.map((sample) => sample.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(samples.some((sample) => sample.use === "integration_sample")).toBe(true);
    expect(samples.some((sample) => sample.use === "final_evidence")).toBe(true);
    expect(samples.some((sample) => sample.use === "final_qa")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const sample of samples) {
      expect(sample.title_pa).toMatch(GURMUKHI_BLOCK);
      expect(sample.primary_line_pa).toMatch(GURMUKHI_BLOCK);
      expect(sample.support_lines_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of sample.support_lines_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(sample.romanization.length).toBeGreaterThan(4);
      expect(sample.title_vi.length).toBeGreaterThan(3);
      expect(sample.title_en.length).toBeGreaterThan(3);
      expect(sample.situation_vi.length).toBeGreaterThan(20);
      expect(sample.situation_en.length).toBeGreaterThan(20);
      expect(sample.learner_can_do_vi.length).toBeGreaterThan(20);
      expect(sample.learner_can_do_en.length).toBeGreaterThan(20);
      expect(sample.meaning_vi.length).toBeGreaterThan(3);
      expect(sample.meaning_en.length).toBeGreaterThan(3);
      expect(sample.canada_practical_note_vi).toMatch(/Canada|Ở Canada|Dùng|Hữu ích|Câu này|Đây là/u);
      expect(sample.canada_practical_note_en).toMatch(/Canada|Use|Useful|This|In Canada/u);
    }
  });

  it("includes learner traps and final evidence where useful", () => {
    const traps = samples.filter((sample) => sample.learner_trap_vi && sample.learner_trap_en);
    const evidence = samples.filter((sample) => sample.final_evidence_vi && sample.final_evidence_en);

    expect(traps.length).toBeGreaterThanOrEqual(9);
    expect(evidence.length).toBeGreaterThanOrEqual(5);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE.scriptPolicy).toMatch(/Shahmukhi.*awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE.boundaries.join(" ")).toMatch(/Native review is deferred/);

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_INTEGRATION_SCOPE,
      samples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(samples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
