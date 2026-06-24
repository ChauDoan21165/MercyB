// src/languages/punjabi/__tests__/punjabiA11PreparationMap.test.ts
//
// Guards the Punjabi Wave 28 A11 preparation map. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_A11_PREPARATION_AREAS,
  PUNJABI_A11_PREPARATION_MAP,
  PUNJABI_A11_PREPARATION_MAP_ROOT,
  PUNJABI_A11_PREPARATION_MAP_SCOPE,
  PUNJABI_A11_PREPARATION_ROUTES,
  PUNJABI_A11_PREPARATION_SCOPE_ALIAS,
  type PunjabiA11PreparationArea,
} from "../a11PreparationMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiA11PreparationArea[] = [
  "import_groups",
  "level_modules",
  "script_modules",
  "canada_modules",
  "remediation_modules",
  "selector_routes",
  "pre_integration_readiness",
  "final_readiness",
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
  walk(PUNJABI_A11_PREPARATION_MAP_ROOT);
  return out;
}

describe("Punjabi A11 preparation map - scope", () => {
  it("declares Wave 28 only and not A11 integration", () => {
    expect(PUNJABI_A11_PREPARATION_MAP_SCOPE.wave).toBe("Wave 28");
    expect(PUNJABI_A11_PREPARATION_MAP_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_A11_PREPARATION_SCOPE_ALIAS).toBe(PUNJABI_A11_PREPARATION_MAP_SCOPE);
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_A11_PREPARATION_MAP_SCOPE.code).toBe("pa");
    expect(PUNJABI_A11_PREPARATION_MAP_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_A11_PREPARATION_MAP_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_A11_PREPARATION_MAP_SCOPE.script_note_en} ${PUNJABI_A11_PREPARATION_MAP_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_A11_PREPARATION_MAP_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi A11 preparation map - coverage", () => {
  it("declares all requested preparation areas", () => {
    expect(new Set(PUNJABI_A11_PREPARATION_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has preparation items for every requested area", () => {
    const areas = new Set(PUNJABI_A11_PREPARATION_MAP.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across preparation items", () => {
    const levels = new Set(PUNJABI_A11_PREPARATION_MAP.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the preparation map compact but useful", () => {
    expect(PUNJABI_A11_PREPARATION_MAP.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_A11_PREPARATION_MAP.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi A11 preparation map - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_A11_PREPARATION_MAP) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.prep_vi.length).toBeGreaterThan(0);
      expect(item.prep_en.length).toBeGreaterThan(0);
      expect(item.regression_vi.length).toBeGreaterThan(0);
      expect(item.regression_en.length).toBeGreaterThan(0);
      expect(item.selector_vi.length).toBeGreaterThan(0);
      expect(item.selector_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.expected_modules.length).toBeGreaterThan(0);
      expect(item.import_groups.length).toBeGreaterThan(0);
      expect(item.prep_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_A11_PREPARATION_MAP.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps and must-not-claim markers", () => {
    const traps = PUNJABI_A11_PREPARATION_MAP.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const forbidden = PUNJABI_A11_PREPARATION_MAP.filter((item) => item.must_not_claim_vi && item.must_not_claim_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
  });

  it("references the expected modules for preparation planning", () => {
    const modules = PUNJABI_A11_PREPARATION_MAP.flatMap((item) => item.expected_modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("normalize");
    expect(modules).toContain("lessons");
    expect(modules).toContain("lessons-a1");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("skillDependencyGraph");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("finalContentManifest");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalNavigationMap");
    expect(modules).toContain("finalQualityGates");
    expect(modules).toContain("finalSmokeChecklist");
    expect(modules).toContain("finalIntegrationEvidenceMap");
    expect(modules).toContain("finalPreIntegrationSummary");
    expect(modules).toContain("finalOwnerReviewPacket");
    expect(modules).toContain("finalIntegrationRiskRegister");
    expect(modules).toContain("finalExportReadiness");
    expect(modules).toContain("finalPackagingReadiness");
    expect(modules).toContain("finalIntegrationGuardrails");
    expect(modules).toContain("preIntegrationCoverageMap");
    expect(modules).toContain("preIntegrationHandoffMap");
    expect(modules).toContain("preMrAuditChecklist");
  });

  it("references the import groups expected by preparation planning", () => {
    const groups = PUNJABI_A11_PREPARATION_MAP.flatMap((item) => item.import_groups).join(" ");
    expect(groups).toContain("core_imports");
    expect(groups).toContain("review_imports");
    expect(groups).toContain("boundary_imports");
    expect(groups).toContain("level_imports");
    expect(groups).toContain("progression_imports");
    expect(groups).toContain("script_imports");
    expect(groups).toContain("preview_imports");
    expect(groups).toContain("canada_imports");
    expect(groups).toContain("public_service_imports");
    expect(groups).toContain("remediation_imports");
    expect(groups).toContain("repair_imports");
    expect(groups).toContain("selector_imports");
    expect(groups).toContain("route_imports");
    expect(groups).toContain("pre_integration_imports");
    expect(groups).toContain("coverage_imports");
    expect(groups).toContain("final_readiness_imports");
    expect(groups).toContain("safe_imports");
  });
});

describe("Punjabi A11 preparation map - boundary checks", () => {
  it("covers selectors, pre-integration, final readiness, Canada, and remediation", () => {
    const text = PUNJABI_A11_PREPARATION_MAP.map((item) => `${item.prep_en} ${item.selector_en} ${item.regression_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("selector");
    expect(text).toContain("pre-integration");
    expect(text).toContain("final readiness");
    expect(text).toContain("canada");
    expect(text).toContain("remediation");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_A11_PREPARATION_MAP.find((entry) => entry.id === "prep-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.prep_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text only");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_A11_PREPARATION_MAP.map((item) => `${item.prep_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines preparation routes for imports, script, Canada, and boundary checks", () => {
    expect(PUNJABI_A11_PREPARATION_ROUTES.length).toBe(3);
    for (const route of PUNJABI_A11_PREPARATION_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi A11 preparation map - no unrelated scripts", () => {
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
