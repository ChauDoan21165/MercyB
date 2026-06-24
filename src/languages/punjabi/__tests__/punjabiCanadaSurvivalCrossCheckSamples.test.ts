import { describe, expect, it } from "vitest";

import crossCheckSamples, {
  PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE,
  type PunjabiCanadaSurvivalCrossCheckDomain,
} from "@/languages/punjabi/canadaSurvivalCrossCheckSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalCrossCheckDomain[] = [
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
  "workplace_safety",
];

describe("Punjabi Canada survival cross-check samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(crossCheckSamples).toBe(PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SAMPLES);
    expect(Array.isArray(crossCheckSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE.name).toContain("Cross-Check Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(crossCheckSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(crossCheckSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(crossCheckSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and cross-check styles", () => {
    const ids = crossCheckSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(crossCheckSamples.some((item) => item.use === "cross_check")).toBe(true);
    expect(crossCheckSamples.some((item) => item.use === "verification")).toBe(true);
    expect(crossCheckSamples.some((item) => item.use === "pre_integration")).toBe(true);
    expect(crossCheckSamples.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of crossCheckSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.cross_check_vi.length).toBeGreaterThan(20);
      expect(item.cross_check_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.verification_vi).toMatch(/Cross-check|Verification|Pre-integration|Handoff/u);
      expect(item.verification_en).toMatch(/cross-check|verification|Pre-integration|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and coherent end-to-end practical links", () => {
    const traps = crossCheckSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allContent = JSON.stringify(crossCheckSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_CROSS_CHECK_SCOPE,
      crossCheckSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(crossCheckSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
