import { describe, expect, it } from "vitest";

import boundaries, {
  PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE,
  PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARIES,
  type PunjabiCanadaServiceSafetyBoundaryDomain,
} from "@/languages/punjabi/canadaServiceSafetyBoundaries";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceSafetyBoundaryDomain[] = [
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

describe("Punjabi Canada service safety boundaries", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(boundaries).toBe(PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARIES);
    expect(Array.isArray(boundaries)).toBe(true);
    expect(PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE.name).toContain("Service Safety Boundaries");
  });

  it("covers the required Canada service safety domains compactly", () => {
    expect(boundaries.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(boundaries.length).toBeLessThanOrEqual(18);

    const present = new Set(boundaries.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested safety styles", () => {
    const ids = boundaries.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(boundaries.some((item) => item.use === "service_safety")).toBe(true);
    expect(boundaries.some((item) => item.use === "final_safety")).toBe(true);
    expect(boundaries.some((item) => item.use === "final_quality")).toBe(true);
    expect(boundaries.some((item) => item.use === "export_readiness")).toBe(true);
    expect(boundaries.some((item) => item.use === "regression")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of boundaries) {
      expect(item.safety_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.safe_steps_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.safe_steps_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.boundary_vi.length).toBeGreaterThan(10);
      expect(item.boundary_en.length).toBeGreaterThan(10);
      expect(item.safer_goal_vi.length).toBeGreaterThan(10);
      expect(item.safer_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.quality_note_vi.length).toBeGreaterThan(20);
      expect(item.quality_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and final safety or quality coverage", () => {
    const traps = boundaries.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const finalCoverage = boundaries.filter(
      (item) => item.use === "final_safety" || item.use === "final_quality" || item.use === "export_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(finalCoverage.length).toBeGreaterThanOrEqual(3);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SERVICE_SAFETY_BOUNDARY_SCOPE,
      boundaries,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(boundaries);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
