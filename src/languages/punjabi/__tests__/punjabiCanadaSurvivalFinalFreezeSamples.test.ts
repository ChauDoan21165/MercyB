import { describe, expect, it } from "vitest";

import finalFreezeSamples, {
  PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE,
  type PunjabiCanadaSurvivalFinalFreezeDomain,
} from "@/languages/punjabi/canadaSurvivalFinalFreezeSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalFinalFreezeDomain[] = [
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

describe("Punjabi Canada survival final-freeze samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(finalFreezeSamples).toBe(PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SAMPLES);
    expect(Array.isArray(finalFreezeSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE.name).toContain("Final Freeze Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(finalFreezeSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(finalFreezeSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(finalFreezeSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and final-freeze readiness styles", () => {
    const ids = finalFreezeSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(finalFreezeSamples.some((item) => item.use === "final_freeze")).toBe(true);
    expect(finalFreezeSamples.some((item) => item.use === "owner_acceptance")).toBe(true);
    expect(finalFreezeSamples.some((item) => item.use === "final_lock")).toBe(true);
    expect(finalFreezeSamples.some((item) => item.use === "pre_integration")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of finalFreezeSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.final_freeze_vi.length).toBeGreaterThan(20);
      expect(item.final_freeze_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.final_freeze_check_vi).toMatch(/Final-freeze|Final-lock|Owner Acceptance|Pre-integration/u);
      expect(item.final_freeze_check_en).toMatch(/Final-freeze|Final-lock|Owner Acceptance|final lock|Pre-integration/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and end-to-end practical flow coverage", () => {
    const traps = finalFreezeSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(finalFreezeSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_FINAL_FREEZE_SCOPE,
      finalFreezeSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(finalFreezeSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
