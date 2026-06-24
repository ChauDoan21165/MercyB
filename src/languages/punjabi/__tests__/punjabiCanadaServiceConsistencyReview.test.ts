import { describe, expect, it } from "vitest";

import consistencyReview, {
  PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW,
  PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE,
  type PunjabiCanadaServiceConsistencyDomain,
} from "@/languages/punjabi/canadaServiceConsistencyReview";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaServiceConsistencyDomain[] = [
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

describe("Punjabi Canada service consistency review", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(consistencyReview).toBe(PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW);
    expect(Array.isArray(consistencyReview)).toBe(true);
    expect(PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE.name).toContain("Consistency Review");
  });

  it("covers the required Canada service consistency domains compactly", () => {
    expect(consistencyReview.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(consistencyReview.length).toBeLessThanOrEqual(18);

    const present = new Set(consistencyReview.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and the requested review styles", () => {
    const ids = consistencyReview.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(consistencyReview.some((item) => item.use === "consistency_review")).toBe(true);
    expect(consistencyReview.some((item) => item.use === "final_guardrail")).toBe(true);
    expect(consistencyReview.some((item) => item.use === "integration_readiness")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of consistencyReview) {
      expect(item.review_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.scenario_vi.length).toBeGreaterThan(20);
      expect(item.scenario_en.length).toBeGreaterThan(20);
      expect(item.consistency_goal_vi.length).toBeGreaterThan(10);
      expect(item.consistency_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.guardrail_vi.length).toBeGreaterThan(10);
      expect(item.guardrail_en.length).toBeGreaterThan(10);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and final guardrails", () => {
    const traps = consistencyReview.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const guardrails = consistencyReview.filter(
      (item) => item.use === "final_guardrail" || item.use === "integration_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(guardrails.length).toBeGreaterThanOrEqual(3);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SERVICE_CONSISTENCY_REVIEW_SCOPE,
      consistencyReview,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(consistencyReview);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
