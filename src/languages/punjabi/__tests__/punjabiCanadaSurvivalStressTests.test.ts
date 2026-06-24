import { describe, expect, it } from "vitest";

import stressTests, {
  PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE,
  PUNJABI_CANADA_SURVIVAL_STRESS_TESTS,
  type PunjabiCanadaSurvivalStressDomain,
} from "@/languages/punjabi/canadaSurvivalStressTests";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalStressDomain[] = [
  "clinic",
  "pharmacy",
  "school_childcare",
  "bank",
  "housing",
  "transport",
  "interpreter_request",
  "emergency_boundary",
  "workplace_safety",
  "forms_service_desk",
];

describe("Punjabi Canada survival stress tests", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(stressTests).toBe(PUNJABI_CANADA_SURVIVAL_STRESS_TESTS);
    expect(Array.isArray(stressTests)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE.name).toContain("Stress Tests");
  });

  it("covers the required Canada survival stress domains compactly", () => {
    expect(stressTests.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(stressTests.length).toBeLessThanOrEqual(18);

    const present = new Set(stressTests.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested stress, risk, and QA styles", () => {
    const ids = stressTests.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(stressTests.some((item) => item.use === "stress_test")).toBe(true);
    expect(stressTests.some((item) => item.use === "final_risk")).toBe(true);
    expect(stressTests.some((item) => item.use === "final_qa")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of stressTests) {
      expect(item.response_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.followup_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.followup_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.scenario_vi.length).toBeGreaterThan(20);
      expect(item.scenario_en.length).toBeGreaterThan(20);
      expect(item.learner_goal_vi.length).toBeGreaterThan(10);
      expect(item.learner_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.risk_note_vi.length).toBeGreaterThan(20);
      expect(item.risk_note_en.length).toBeGreaterThan(20);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and warns about real-risk boundaries", () => {
    const traps = stressTests.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const emergency = stressTests.find((item) => item.domain === "emergency_boundary");

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(emergency?.risk_note_vi ?? "").toMatch(/khẩn|nguy hiểm|an toàn/i);
    expect(emergency?.risk_note_en ?? "").toMatch(/emergency|danger|safety/i);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_STRESS_PACK_SCOPE,
      stressTests,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(stressTests);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
