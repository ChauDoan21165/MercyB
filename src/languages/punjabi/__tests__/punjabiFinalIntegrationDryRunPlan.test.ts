// src/languages/punjabi/__tests__/punjabiFinalIntegrationDryRunPlan.test.ts
//
// Guards the Punjabi Wave 29 final integration dry-run plan. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_AREAS,
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN,
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROOT,
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE,
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_ROUTES,
  PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE_ALIAS,
  type PunjabiFinalIntegrationDryRunArea,
} from "../finalIntegrationDryRunPlan";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalIntegrationDryRunArea[] = [
  "module_groups",
  "export_order",
  "naming_checks",
  "duplicate_risk",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "dry_run_readiness",
  "deferred_review",
  "forbidden_claim",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_ROOT);
  return out;
}

describe("Punjabi final integration dry-run plan - scope", () => {
  it("declares Wave 29 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.wave).toBe("Wave 29");
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_SCOPE_ALIAS).toBe(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE);
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.script_note_en} ${PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN_SCOPE.excluded_en.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("auth");
    expect(text).toContain("billing");
    expect(text).toContain("rls");
    expect(text).toContain("supabase");
    expect(text).toContain("ci");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });
});

describe("Punjabi final integration dry-run plan - coverage", () => {
  it("declares all requested dry-run areas", () => {
    expect(new Set(PUNJABI_FINAL_INTEGRATION_DRY_RUN_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has plan items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across dry-run items", () => {
    const levels = new Set(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the dry-run plan compact but useful", () => {
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi final integration dry-run plan - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.dry_run_vi.length).toBeGreaterThan(0);
      expect(item.dry_run_en.length).toBeGreaterThan(0);
      expect(item.regression_vi.length).toBeGreaterThan(0);
      expect(item.regression_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.expected_modules.length).toBeGreaterThan(0);
      expect(item.export_groups.length).toBeGreaterThan(0);
      expect(item.dry_run_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps and must-not-claim markers", () => {
    const traps = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const forbidden = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.filter((item) => item.must_not_claim_vi && item.must_not_claim_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
  });

  it("references the expected modules for dry-run planning", () => {
    const modules = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.flatMap((item) => item.expected_modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("normalize");
    expect(modules).toContain("lessons");
    expect(modules).toContain("lessons-a1");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("finalContentManifest");
    expect(modules).toContain("finalIntegrationEvidenceMap");
    expect(modules).toContain("finalPreIntegrationSummary");
    expect(modules).toContain("finalOwnerReviewPacket");
    expect(modules).toContain("finalIntegrationRiskRegister");
    expect(modules).toContain("finalExportReadiness");
    expect(modules).toContain("finalPackagingReadiness");
    expect(modules).toContain("finalIntegrationGuardrails");
    expect(modules).toContain("preMrAuditChecklist");
  });

  it("references the export groups expected by dry-run planning", () => {
    const groups = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.flatMap((item) => item.export_groups).join(" ");
    expect(groups).toContain("core_exports");
    expect(groups).toContain("review_exports");
    expect(groups).toContain("boundary_exports");
    expect(groups).toContain("order_exports");
    expect(groups).toContain("route_exports");
    expect(groups).toContain("naming_exports");
    expect(groups).toContain("duplication_exports");
    expect(groups).toContain("scan_exports");
    expect(groups).toContain("script_exports");
    expect(groups).toContain("preview_exports");
    expect(groups).toContain("learner_exports");
    expect(groups).toContain("qa_exports");
    expect(groups).toContain("canada_exports");
    expect(groups).toContain("public_service_exports");
    expect(groups).toContain("readiness_exports");
    expect(groups).toContain("safe_exports");
  });
});

describe("Punjabi final integration dry-run plan - boundary checks", () => {
  it("covers module groups, export order, naming, Canada, and readiness", () => {
    const text = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.map((item) => `${item.dry_run_en} ${item.selector_vi} ${item.selector_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("module");
    expect(text).toContain("export order");
    expect(text).toContain("naming");
    expect(text).toContain("canada");
    expect(text).toContain("ready");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.find((entry) => entry.id === "dryrun-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.dry_run_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text only");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_INTEGRATION_DRY_RUN_PLAN.map((item) => `${item.dry_run_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines dry-run routes for structure, support, and boundary checks", () => {
    expect(PUNJABI_FINAL_INTEGRATION_DRY_RUN_ROUTES.length).toBe(3);
    for (const route of PUNJABI_FINAL_INTEGRATION_DRY_RUN_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final integration dry-run plan - no unrelated scripts", () => {
  const strings = allStrings();

  it("does not include Shahmukhi-script content", () => {
    for (const s of strings) expect(s).not.toMatch(SHAHMUKHI);
  });

  it("contains no CJK, Hangul, kana, or Cyrillic script", () => {
    for (const s of strings) {
      expect(s).not.toMatch(CJK);
      expect(s).not.toMatch(HANGUL);
      expect(s).not.toMatch(KANA);
      expect(s).not.toMatch(CYRILLIC);
    }
  });
});
