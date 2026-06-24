// src/languages/punjabi/__tests__/punjabiFinalIntegrationSanityPack.test.ts
//
// Guards the Punjabi Wave 31 final integration sanity pack. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_SANITY_PACK_AREAS,
  PUNJABI_FINAL_SANITY_PACK,
  PUNJABI_FINAL_SANITY_PACK_ROOT,
  PUNJABI_FINAL_SANITY_PACK_ROUTES,
  PUNJABI_FINAL_SANITY_PACK_SCOPE,
  PUNJABI_FINAL_SANITY_PACK_SCOPE_ALIAS,
  type PunjabiSanityArea,
} from "../finalIntegrationSanityPack";

const GURMUKHI = /[਀-੿]/;
const SHAHMUKHI = /[؀-ۿ]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힯]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiSanityArea[] = [
  "module_families",
  "naming_expectations",
  "duplicate_risk",
  "export_readiness",
  "gurmukhi_first",
  "learner_support",
  "canada_domains",
  "sanity_regression",
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
  walk(PUNJABI_FINAL_SANITY_PACK_ROOT);
  return out;
}

describe("Punjabi final integration sanity pack - scope", () => {
  it("declares Wave 31 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE.wave).toBe("Wave 31");
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE_ALIAS).toBe(PUNJABI_FINAL_SANITY_PACK_SCOPE);
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_SANITY_PACK_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("frames itself as a pre-integration sanity pack for later A11", () => {
    const text = `${PUNJABI_FINAL_SANITY_PACK_SCOPE.purpose_en}`.toLowerCase();
    expect(text).toContain("sanity pack");
    expect(text).toContain("later a11");
    expect(text).toContain("pre-integration");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_SANITY_PACK_SCOPE.script_note_en} ${PUNJABI_FINAL_SANITY_PACK_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_SANITY_PACK_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final integration sanity pack - coverage", () => {
  it("declares all requested sanity areas", () => {
    expect(new Set(PUNJABI_FINAL_SANITY_PACK_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has sanity items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_SANITY_PACK.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across sanity items", () => {
    const levels = new Set(PUNJABI_FINAL_SANITY_PACK.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the sanity pack compact but useful", () => {
    expect(PUNJABI_FINAL_SANITY_PACK.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_SANITY_PACK.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi final integration sanity pack - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_SANITY_PACK) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.check_vi.length).toBeGreaterThan(0);
      expect(item.check_en.length).toBeGreaterThan(0);
      expect(item.regression_vi.length).toBeGreaterThan(0);
      expect(item.regression_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.expected_modules.length).toBeGreaterThan(0);
      expect(item.export_groups.length).toBeGreaterThan(0);
      expect(item.sanity_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps every sanity item id unique", () => {
    const ids = PUNJABI_FINAL_SANITY_PACK.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_SANITY_PACK.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps and must-not-claim markers", () => {
    const traps = PUNJABI_FINAL_SANITY_PACK.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    const forbidden = PUNJABI_FINAL_SANITY_PACK.filter((item) => item.must_not_claim_vi && item.must_not_claim_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
  });

  it("includes a Canada-practical example", () => {
    const canada = PUNJABI_FINAL_SANITY_PACK.filter((item) => item.canada_practical && item.canada_practical.length > 0);
    expect(canada.length).toBeGreaterThanOrEqual(1);
  });

  it("references the expected modules for sanity planning", () => {
    const modules = PUNJABI_FINAL_SANITY_PACK.flatMap((item) => item.expected_modules).join(" ");
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
    expect(modules).toContain("finalIntegrationStabilityPlan");
    expect(modules).toContain("finalIntegrationDryRunPlan");
    expect(modules).toContain("preMrAuditChecklist");
  });

  it("references the export groups expected by sanity planning", () => {
    const groups = PUNJABI_FINAL_SANITY_PACK.flatMap((item) => item.export_groups).join(" ");
    expect(groups).toContain("core_exports");
    expect(groups).toContain("review_exports");
    expect(groups).toContain("boundary_exports");
    expect(groups).toContain("naming_exports");
    expect(groups).toContain("route_exports");
    expect(groups).toContain("dedupe_exports");
    expect(groups).toContain("order_exports");
    expect(groups).toContain("script_exports");
    expect(groups).toContain("preview_exports");
    expect(groups).toContain("learner_exports");
    expect(groups).toContain("qa_exports");
    expect(groups).toContain("canada_exports");
    expect(groups).toContain("public_service_exports");
    expect(groups).toContain("regression_exports");
    expect(groups).toContain("sanity_exports");
    expect(groups).toContain("safe_exports");
  });
});

describe("Punjabi final integration sanity pack - boundary checks", () => {
  it("covers module families, naming, duplicate risk, export readiness, Canada, and regression", () => {
    const text = PUNJABI_FINAL_SANITY_PACK.map((item) => `${item.check_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("module");
    expect(text).toContain("naming");
    expect(text).toContain("duplicate");
    expect(text).toContain("export readiness");
    expect(text).toContain("canada");
    expect(text).toContain("regression");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_SANITY_PACK.find((entry) => entry.id === "sanity-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.check_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text only");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_SANITY_PACK.map((item) => `${item.check_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines sanity routes for structure, support, and boundary checks", () => {
    expect(PUNJABI_FINAL_SANITY_PACK_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_SANITY_PACK.map((item) => item.id));
    for (const route of PUNJABI_FINAL_SANITY_PACK_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi final integration sanity pack - no unrelated scripts", () => {
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
