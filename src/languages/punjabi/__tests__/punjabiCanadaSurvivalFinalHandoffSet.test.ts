import { describe, expect, it } from "vitest";

import finalHandoffSet, {
  PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE,
  PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SET,
  type PunjabiCanadaSurvivalFinalHandoffDomain,
} from "@/languages/punjabi/canadaSurvivalFinalHandoffSet";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalFinalHandoffDomain[] = [
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

describe("Punjabi Canada survival final handoff set", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(finalHandoffSet).toBe(PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SET);
    expect(Array.isArray(finalHandoffSet)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE.name).toContain("Final Handoff Set");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(finalHandoffSet.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(finalHandoffSet.length).toBeLessThanOrEqual(18);

    const present = new Set(finalHandoffSet.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and final-handoff readiness styles", () => {
    const ids = finalHandoffSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(finalHandoffSet.some((item) => item.use === "final_handoff")).toBe(true);
    expect(finalHandoffSet.some((item) => item.use === "pre_integration")).toBe(true);
    expect(finalHandoffSet.some((item) => item.use === "final_readiness")).toBe(true);
    expect(finalHandoffSet.some((item) => item.use === "export_readiness")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of finalHandoffSet) {
      expect(item.handoff_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.support_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.support_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.handoff_vi.length).toBeGreaterThan(20);
      expect(item.handoff_en.length).toBeGreaterThan(20);
      expect(item.handoff_goal_vi.length).toBeGreaterThan(10);
      expect(item.handoff_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.review_vi.length).toBeGreaterThan(10);
      expect(item.review_en.length).toBeGreaterThan(10);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and final readiness guardrails", () => {
    const traps = finalHandoffSet.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const readiness = finalHandoffSet.filter(
      (item) => item.use === "final_readiness" || item.use === "export_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(readiness.length).toBeGreaterThanOrEqual(4);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_FINAL_HANDOFF_SCOPE,
      finalHandoffSet,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(finalHandoffSet);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
