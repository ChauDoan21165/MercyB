import { describe, expect, it } from "vitest";

import scenarioMatrix, {
  PUNJABI_CANADA_SERVICE_SCENARIO_DOMAINS,
  PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX,
  PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE,
  type PunjabiCanadaServiceScenarioDomain,
} from "@/languages/punjabi/canadaServiceScenarioMatrix";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceScenarioDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "public_office",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
];

describe("Punjabi Canada service scenario matrix", () => {
  it("exports compact app-consumable TypeScript data", () => {
    expect(scenarioMatrix).toBe(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX);
    expect(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.length).toBeLessThanOrEqual(14);
    expect(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE.name).toContain("Scenario Matrix");
  });

  it("declares scope, script policy, and deferred review without overclaiming", () => {
    const scope = `${PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE.scriptPolicy} ${PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE.reviewStatus} ${PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX_SCOPE.boundary}`.toLowerCase();
    expect(scope).toContain("gurmukhi is primary");
    expect(scope).toContain("shahmukhi is awareness only");
    expect(scope).toContain("not a full course");
    expect(scope).toContain("native review is deferred");
    expect(scope).toContain("not a11 integration");
    expect(scope).toContain("not legal, medical, or financial advice");
  });

  it("covers required Canada service scenario domains", () => {
    expect(new Set(PUNJABI_CANADA_SERVICE_SCENARIO_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));

    const present = new Set(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("keeps stable ids, scenario routes, and Gurmukhi primary", () => {
    const ids = PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.every((id) => id.startsWith("pa-ca-scenario-"))).toBe(true);

    const routes = new Set(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.map((item) => item.route));
    expect(routes.has("ready_for_content_integration")).toBe(true);
    expect(routes.has("review_before_live_use")).toBe(true);
    expect(routes.has("emergency_only")).toBe(true);

    for (const item of PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX) {
      expect(item.phrase_pa).toMatch(GURMUKHI);
      expect(item.phrase_pa).not.toMatch(SHAHMUKHI);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI);
        expect(line).not.toMatch(SHAHMUKHI);
      }
    }
  });

  it("includes romanization plus Vietnamese and English routing context", () => {
    for (const item of PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX) {
      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.scenario_vi.length).toBeGreaterThan(20);
      expect(item.scenario_en.length).toBeGreaterThan(20);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.routing_note_vi.length).toBeGreaterThan(20);
      expect(item.routing_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng/u);
      expect(item.canada_example_en).toMatch(/Canada|Canadian|In Canada|Use/u);
    }
  });

  it("includes Canada-practical scenario coverage and learner traps", () => {
    const traps = PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);

    const allText = JSON.stringify(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX).toLowerCase();
    for (const term of [
      "clinic",
      "pharmacy",
      "school",
      "bank",
      "repair",
      "transit",
      "documents",
      "interpreter",
      "emergency",
      "workplace",
      "scenario",
      "route",
      "review",
    ]) {
      expect(allText).toContain(term);
    }
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allText = JSON.stringify(PUNJABI_CANADA_SERVICE_SCENARIO_MATRIX);
    expect(allText).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allText).not.toMatch(/native reviewed|reviewed by native|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });
});
