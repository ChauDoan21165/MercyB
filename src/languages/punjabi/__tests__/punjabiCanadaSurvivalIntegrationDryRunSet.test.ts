import { describe, expect, it } from "vitest";

import dryRunSet, {
  PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SCOPE,
  PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SET,
  type PunjabiCanadaSurvivalIntegrationDryRunDomain,
} from "@/languages/punjabi/canadaSurvivalIntegrationDryRunSet";

const GURMUKHI_BLOCK = /[਀-੿]/;

const REQUIRED_DOMAINS: PunjabiCanadaSurvivalIntegrationDryRunDomain[] = [
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

describe("Punjabi Canada survival integration dry-run set", () => {
  it("exports app-consumable TypeScript data", () => {
    expect(dryRunSet).toBe(PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SET);
    expect(Array.isArray(dryRunSet)).toBe(true);
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SCOPE.name).toContain("Dry Run Set");
  });

  it("covers the required Canada survival domains compactly", () => {
    expect(dryRunSet.length).toBeGreaterThanOrEqual(REQUIRED_DOMAINS.length);
    expect(dryRunSet.length).toBeLessThanOrEqual(18);

    const present = new Set(dryRunSet.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) {
      expect(present.has(domain), `missing domain: ${domain}`).toBe(true);
    }
  });

  it("uses stable ids and dry-run readiness styles", () => {
    const ids = dryRunSet.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(dryRunSet.some((item) => item.use === "dry_run")).toBe(true);
    expect(dryRunSet.some((item) => item.use === "pre_integration")).toBe(true);
    expect(dryRunSet.some((item) => item.use === "final_readiness")).toBe(true);
    expect(dryRunSet.some((item) => item.use === "export_readiness")).toBe(true);
  });

  it("keeps Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of dryRunSet) {
      expect(item.prompt_pa).toMatch(GURMUKHI_BLOCK);
      expect(item.helper_pa.length).toBeGreaterThanOrEqual(2);
      for (const line of item.helper_pa) {
        expect(line).toMatch(GURMUKHI_BLOCK);
      }

      expect(item.romanization.length).toBeGreaterThan(4);
      expect(item.trigger_vi.length).toBeGreaterThan(20);
      expect(item.trigger_en.length).toBeGreaterThan(20);
      expect(item.dry_run_goal_vi.length).toBeGreaterThan(10);
      expect(item.dry_run_goal_en.length).toBeGreaterThan(10);
      expect(item.meaning_vi.length).toBeGreaterThan(3);
      expect(item.meaning_en.length).toBeGreaterThan(3);
      expect(item.review_note_vi.length).toBeGreaterThan(10);
      expect(item.review_note_en.length).toBeGreaterThan(10);
      expect(item.canada_example_vi).toMatch(/Canada|Ở Canada|Dùng|Câu này|Đây là/u);
      expect(item.canada_example_en).toMatch(/Canada|Use|This|In Canada|At a Canadian/u);
    }
  });

  it("includes learner traps and final readiness guardrails", () => {
    const traps = dryRunSet.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const readiness = dryRunSet.filter(
      (item) => item.use === "final_readiness" || item.use === "export_readiness"
    );

    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(readiness.length).toBeGreaterThanOrEqual(4);
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SCOPE.scriptPolicy).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SCOPE.reviewStatus).toBe("Native review is deferred.");

    const allContent = JSON.stringify({
      scope: PUNJABI_CANADA_SURVIVAL_INTEGRATION_DRY_RUN_SCOPE,
      dryRunSet,
    });
    expect(allContent).not.toMatch(/native reviewed|native-approved|full Shahmukhi course|Shahmukhi lesson/i);
  });

  it("keeps forbidden integration and scoring concepts out of the data", () => {
    const allContent = JSON.stringify(dryRunSet);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
  });
});
