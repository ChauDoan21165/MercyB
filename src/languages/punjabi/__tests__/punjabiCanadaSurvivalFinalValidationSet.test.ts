import { describe, expect, it } from "vitest";

import finalValidationSet, {
  PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE,
  PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SET,
  type PunjabiCanadaSurvivalFinalValidationDomain,
} from "@/languages/punjabi/canadaSurvivalFinalValidationSet";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalFinalValidationDomain[] = [
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

describe("Punjabi Canada survival final validation set", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(finalValidationSet).toBe(PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SET);
    expect(Array.isArray(finalValidationSet)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE.name).toContain("Final Validation Set");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(finalValidationSet.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(finalValidationSet.length).toBeLessThanOrEqual(18);

    const present = new Set(finalValidationSet.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and final-validation styles", () => {
    const ids = finalValidationSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(finalValidationSet.some((item) => item.use === "final_validation")).toBe(true);
    expect(finalValidationSet.some((item) => item.use === "cross_check")).toBe(true);
    expect(finalValidationSet.some((item) => item.use === "pre_integration")).toBe(true);
    expect(finalValidationSet.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of finalValidationSet) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.validation_vi.length).toBeGreaterThan(20);
      expect(item.validation_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.final_check_vi).toMatch(/Final-validation|Cross-check|Pre-integration|Handoff/u);
      expect(item.final_check_en).toMatch(/Final validation|cross-check|Pre-integration|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and coherent end-to-end practical links", () => {
    const traps = finalValidationSet.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allContent = JSON.stringify(finalValidationSet);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_FINAL_VALIDATION_SCOPE,
      finalValidationSet,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(finalValidationSet);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
