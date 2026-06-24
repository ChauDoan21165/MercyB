import { describe, expect, it } from "vitest";

import selectors, {
  PUNJABI_CANADA_SURVIVAL_FINAL_SELECTOR_SCOPE,
  PUNJABI_CANADA_SURVIVAL_FINAL_SELECTORS,
  type PunjabiCanadaSurvivalFinalSelectorDomain,
} from "@/languages/punjabi/canadaSurvivalFinalSelectors";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalFinalSelectorDomain[] = [
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

describe("Punjabi Canada survival final selectors", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(selectors).toBe(PUNJABI_CANADA_SURVIVAL_FINAL_SELECTORS);
    expect(Array.isArray(selectors)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_SELECTOR_SCOPE.name).toContain("Final Selectors");
  });

  it("covers the required Canada survival selector domains compactly", () => {
    expect(selectors.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(selectors.length).toBeLessThanOrEqual(18);

    const present = new Set(selectors.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and selector-readiness styles", () => {
    const ids = selectors.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(selectors.some((item) => item.use === "selector")).toBe(true);
    expect(selectors.some((item) => item.use === "pre_integration")).toBe(true);
    expect(selectors.some((item) => item.use === "final_readiness")).toBe(true);
    expect(selectors.some((item) => item.use === "export_readiness")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of selectors) {
      expect(item.selector_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.key_steps_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.key_steps_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.selector_vi.length).toBeGreaterThan(20);
      expect(item.selector_en.length).toBeGreaterThan(20);
      expect(item.readiness_goal_vi.length).toBeGreaterThan(10);
      expect(item.readiness_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.guidance_vi.length).toBeGreaterThan(10);
      expect(item.guidance_en.length).toBeGreaterThan(10);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and final readiness guardrails", () => {
    const traps = selectors.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const readiness = selectors.filter(
      (item) => item.use === "final_readiness" || item.use === "export_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(readiness.length).toBeGreaterThanOrEqual(4);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_SELECTOR_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_FINAL_SELECTOR_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_FINAL_SELECTOR_SCOPE,
      selectors,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(selectors);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
