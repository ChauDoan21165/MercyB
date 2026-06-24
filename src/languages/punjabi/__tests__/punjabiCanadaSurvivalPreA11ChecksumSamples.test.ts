import { describe, expect, it } from "vitest";

import preA11ChecksumSamples, {
  PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SCOPE,
  type PunjabiCanadaSurvivalPreA11ChecksumDomain,
} from "@/languages/punjabi/canadaSurvivalPreA11ChecksumSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalPreA11ChecksumDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms_service_desk",
  "interpreter_request",
  "emergency_boundary",
  "service_recovery",
  "workplace_safety",
];

describe("Punjabi Canada survival pre-A11-checksum samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(preA11ChecksumSamples).toBe(PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SAMPLES);
    expect(Array.isArray(preA11ChecksumSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SCOPE.name).toContain("Pre-A11 Checksum Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(preA11ChecksumSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(preA11ChecksumSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(preA11ChecksumSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and pre-A11-checksum samples styles", () => {
    const ids = preA11ChecksumSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(preA11ChecksumSamples.some((item) => item.use === "pre_a11_checksum")).toBe(true);
    expect(preA11ChecksumSamples.some((item) => item.use === "runner_readiness")).toBe(true);
    expect(preA11ChecksumSamples.some((item) => item.use === "pipeline_readiness")).toBe(true);
    expect(preA11ChecksumSamples.some((item) => item.use === "pre_integration")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of preA11ChecksumSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.pre_a11_checksum_vi.length).toBeGreaterThan(20);
      expect(item.pre_a11_checksum_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.pre_a11_checksum_check_vi).toMatch(/Pre-A11-checksum|Runner-readiness|Pipeline-readiness|Pre-integration/u);
      expect(item.pre_a11_checksum_check_en).toMatch(/Pre-A11-checksum|Runner-readiness|Pipeline-readiness|Pre-integration/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and end-to-end practical flow coverage", () => {
    const traps = preA11ChecksumSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(preA11ChecksumSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_PRE_A11_CHECKSUM_SCOPE,
      preA11ChecksumSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(preA11ChecksumSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
