import { describe, expect, it } from "vitest";

import closureValidationSamples, {
  PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SCOPE,
  type PunjabiCanadaSurvivalClosureValidationDomain,
} from "@/languages/punjabi/canadaSurvivalClosureValidationSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalClosureValidationDomain[] = [
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

describe("Punjabi Canada survival closure validation samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(closureValidationSamples).toBe(PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SAMPLES);
    expect(Array.isArray(closureValidationSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SCOPE.name).toContain("Closure Validation Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(closureValidationSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(closureValidationSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(closureValidationSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and closure-validation styles", () => {
    const ids = closureValidationSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(closureValidationSamples.some((item) => item.use === "closure_validation")).toBe(true);
    expect(closureValidationSamples.some((item) => item.use === "final_cross_check")).toBe(true);
    expect(closureValidationSamples.some((item) => item.use === "pre_integration")).toBe(true);
    expect(closureValidationSamples.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of closureValidationSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.closure_vi.length).toBeGreaterThan(20);
      expect(item.closure_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.closure_check_vi).toMatch(/Closure-validation|Final-cross-check|Pre-integration|Handoff/u);
      expect(item.closure_check_en).toMatch(/Closure validation|final cross-check|Pre-integration|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and end-to-end practical flow coverage", () => {
    const traps = closureValidationSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(closureValidationSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_CLOSURE_VALIDATION_SCOPE,
      closureValidationSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(closureValidationSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
