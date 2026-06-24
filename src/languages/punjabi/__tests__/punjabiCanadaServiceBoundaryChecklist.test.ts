import { describe, expect, it } from "vitest";

import checklist, {
  PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST,
  PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE,
  type PunjabiCanadaServiceBoundaryChecklistDomain,
} from "@/languages/punjabi/canadaServiceBoundaryChecklist";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceBoundaryChecklistDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "forms",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada service boundary checklist", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(checklist).toBe(PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST);
    expect(Array.isArray(checklist)).toBe(true);
    expect(PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE.name).toContain("Service Boundary Checklist");
  });

  it("covers the required Canada service boundary domains compactly", () => {
    expect(checklist.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(checklist.length).toBeLessThanOrEqual(18);

    const present = new Set(checklist.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested checklist styles", () => {
    const ids = checklist.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(checklist.some((item) => item.use === "checklist")).toBe(true);
    expect(checklist.some((item) => item.use === "final_stability")).toBe(true);
    expect(checklist.some((item) => item.use === "final_quality")).toBe(true);
    expect(checklist.some((item) => item.use === "export_readiness")).toBe(true);
    expect(checklist.some((item) => item.use === "regression")).toBe(true);
    expect(checklist.some((item) => item.use === "boundary")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of checklist) {
      expect(item.checklist_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.checklist_steps_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.checklist_steps_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.boundary_vi.length).toBeGreaterThan(10);
      expect(item.boundary_en.length).toBeGreaterThan(10);
      expect(item.checklist_goal_vi.length).toBeGreaterThan(10);
      expect(item.checklist_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.stability_note_vi.length).toBeGreaterThan(20);
      expect(item.stability_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and stability coverage for the checklist", () => {
    const traps = checklist.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const stability = checklist.filter(
      (item) => item.use === "final_stability" || item.use === "final_quality" || item.use === "export_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(stability.length).toBeGreaterThanOrEqual(3);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SERVICE_BOUNDARY_CHECKLIST_SCOPE,
      checklist,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(checklist);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
