import { describe, expect, it } from "vitest";

import mergeReadinessSamples, {
  PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE,
  type PunjabiCanadaSurvivalMergeReadinessDomain,
} from "@/languages/punjabi/canadaSurvivalMergeReadinessSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalMergeReadinessDomain[] = [
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

describe("Punjabi Canada survival merge readiness samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(mergeReadinessSamples).toBe(PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SAMPLES);
    expect(Array.isArray(mergeReadinessSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE.name).toContain("Merge Readiness Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(mergeReadinessSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(mergeReadinessSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(mergeReadinessSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and merge-readiness styles", () => {
    const ids = mergeReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(mergeReadinessSamples.some((item) => item.use === "merge_readiness")).toBe(true);
    expect(mergeReadinessSamples.some((item) => item.use === "final_regression")).toBe(true);
    expect(mergeReadinessSamples.some((item) => item.use === "pre_integration")).toBe(true);
    expect(mergeReadinessSamples.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of mergeReadinessSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.merge_vi.length).toBeGreaterThan(20);
      expect(item.merge_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.merge_check_vi).toMatch(/Merge|merge|Pre-integration|Final regression|Handoff/u);
      expect(item.merge_check_en).toMatch(/Merge|merge|Pre-integration|final regression|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and Canada-practical guardrails", () => {
    const traps = mergeReadinessSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allContent = JSON.stringify(mergeReadinessSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_MERGE_READINESS_SCOPE,
      mergeReadinessSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(mergeReadinessSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
