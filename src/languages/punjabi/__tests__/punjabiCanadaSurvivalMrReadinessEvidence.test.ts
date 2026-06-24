import { describe, expect, it } from "vitest";

import mrReadinessSamples, {
  PUNJABI_CANADA_SURVIVAL_MR_READINESS_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_MR_READINESS_SCOPE,
  type PunjabiCanadaSurvivalMrReadinessDomain,
} from "@/languages/punjabi/canadaSurvivalMrReadinessEvidence";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalMrReadinessDomain[] = [
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

describe("Punjabi Canada survival MR-readiness evidence", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(mrReadinessSamples).toBe(PUNJABI_CANADA_SURVIVAL_MR_READINESS_SAMPLES);
    expect(Array.isArray(mrReadinessSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_MR_READINESS_SCOPE.name).toContain("MR Readiness Evidence");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(mrReadinessSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(mrReadinessSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(mrReadinessSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and MR-readiness evidence styles", () => {
    const ids = mrReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(mrReadinessSamples.some((item) => item.use === "mr_readiness")).toBe(true);
    expect(mrReadinessSamples.some((item) => item.use === "final_freeze")).toBe(true);
    expect(mrReadinessSamples.some((item) => item.use === "final_lock")).toBe(true);
    expect(mrReadinessSamples.some((item) => item.use === "pre_integration")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of mrReadinessSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.mr_readiness_vi.length).toBeGreaterThan(20);
      expect(item.mr_readiness_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.mr_readiness_check_vi).toMatch(/MR-readiness|Final-freeze|Final-lock|Pre-integration/u);
      expect(item.mr_readiness_check_en).toMatch(/MR-readiness|Final-freeze|Final-lock|final lock|Pre-integration/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and end-to-end practical flow coverage", () => {
    const traps = mrReadinessSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(mrReadinessSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_MR_READINESS_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_MR_READINESS_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_MR_READINESS_SCOPE,
      mrReadinessSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(mrReadinessSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
