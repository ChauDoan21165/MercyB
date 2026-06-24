import { describe, expect, it } from "vitest";

import importReadinessSamples, {
  PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SAMPLES,
  PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE,
  type PunjabiCanadaSurvivalImportReadinessDomain,
} from "@/languages/punjabi/canadaSurvivalImportReadinessSamples";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalImportReadinessDomain[] = [
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

describe("Punjabi Canada survival import readiness samples", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(importReadinessSamples).toBe(PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SAMPLES);
    expect(Array.isArray(importReadinessSamples)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE.name).toContain("Import Readiness Samples");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(importReadinessSamples.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(importReadinessSamples.length).toBeLessThanOrEqual(18);

    const present = new Set(importReadinessSamples.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and import-readiness styles", () => {
    const ids = importReadinessSamples.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(importReadinessSamples.some((item) => item.use === "import_readiness")).toBe(true);
    expect(importReadinessSamples.some((item) => item.use === "final_regression")).toBe(true);
    expect(importReadinessSamples.some((item) => item.use === "pre_integration")).toBe(true);
    expect(importReadinessSamples.some((item) => item.use === "handoff_check")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of importReadinessSamples) {
      expect(item.phrase_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.import_vi.length).toBeGreaterThan(20);
      expect(item.import_en.length).toBeGreaterThan(20);
      expect(item.goal_vi.length).toBeGreaterThan(10);
      expect(item.goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.import_check_vi).toMatch(/Import|import|Pre-integration|Final regression|Handoff/u);
      expect(item.import_check_en).toMatch(/Import|import|Pre-integration|final regression|handoff/i);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and Canada-practical examples", () => {
    const traps = importReadinessSamples.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);

    const allContent = JSON.stringify(importReadinessSamples);
    expect(allContent).toMatch(/clinic|pharmacy|school|bank|rental|bus|service centre|workplace/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_IMPORT_READINESS_SCOPE,
      importReadinessSamples,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(importReadinessSamples);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
