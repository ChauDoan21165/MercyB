// src/languages/punjabi/__tests__/punjabiFinalImportReadinessMap.test.ts
//
// Guards the Punjabi Wave 33 final import-readiness map. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_IMPORT_READINESS_MAP_AREAS,
  PUNJABI_FINAL_IMPORT_READINESS_MAP,
  PUNJABI_FINAL_IMPORT_READINESS_MAP_ROOT,
  PUNJABI_FINAL_IMPORT_READINESS_MAP_ROUTES,
  PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE,
  PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE_ALIAS,
  type PunjabiFinalImportReadinessArea,
} from "../finalImportReadinessMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalImportReadinessArea[] = [
  "import_groups",
  "naming_patterns",
  "duplicate_risk",
  "level_coverage",
  "script_coverage",
  "canada_domains",
  "remediation_coverage",
  "import_readiness",
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
  walk(PUNJABI_FINAL_IMPORT_READINESS_MAP_ROOT);
  return out;
}

describe("Punjabi final import-readiness map - scope", () => {
  it("declares Wave 33 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.wave).toBe("Wave 33");
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE_ALIAS).toBe(
      PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE,
    );
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("frames itself as import readiness for later A11 only", () => {
    const text = PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.purpose_en.toLowerCase();
    expect(text).toContain("import-readiness");
    expect(text).toContain("later a11");
    expect(text).toContain("does not perform integration");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.script_note_en} ${PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_IMPORT_READINESS_MAP_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final import-readiness map - coverage", () => {
  it("declares all requested import-readiness areas", () => {
    expect(new Set(PUNJABI_FINAL_IMPORT_READINESS_MAP_AREAS)).toEqual(
      new Set(REQUIRED_AREAS),
    );
  });

  it("has items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_IMPORT_READINESS_MAP.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across import-readiness items", () => {
    const levels = new Set(PUNJABI_FINAL_IMPORT_READINESS_MAP.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the map compact but useful", () => {
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi final import-readiness map - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_IMPORT_READINESS_MAP) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.import_vi.length).toBeGreaterThan(0);
      expect(item.import_en.length).toBeGreaterThan(0);
      expect(item.regression_vi.length).toBeGreaterThan(0);
      expect(item.regression_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.expected_imports.length).toBeGreaterThan(0);
      expect(item.naming_patterns.length).toBeGreaterThan(0);
      expect(item.import_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps every item id unique", () => {
    const ids = PUNJABI_FINAL_IMPORT_READINESS_MAP.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_IMPORT_READINESS_MAP.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps, Canada practice, and must-not-claim markers", () => {
    const traps = PUNJABI_FINAL_IMPORT_READINESS_MAP.filter(
      (item) => item.learner_trap_vi && item.learner_trap_en,
    );
    const forbidden = PUNJABI_FINAL_IMPORT_READINESS_MAP.filter(
      (item) => item.must_not_claim_vi && item.must_not_claim_en,
    );
    const canada = PUNJABI_FINAL_IMPORT_READINESS_MAP.filter(
      (item) => item.canada_practical && item.canada_practical.length > 0,
    );
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
    expect(canada.length).toBeGreaterThanOrEqual(1);
  });

  it("references expected imports for later A11 planning", () => {
    const imports = PUNJABI_FINAL_IMPORT_READINESS_MAP.flatMap((item) => item.expected_imports).join(" ");
    expect(imports).toContain("index");
    expect(imports).toContain("normalize");
    expect(imports).toContain("lessons");
    expect(imports).toContain("lessons-a1");
    expect(imports).toContain("dialogues");
    expect(imports).toContain("courseMap");
    expect(imports).toContain("learningPath");
    expect(imports).toContain("progressionMatrix");
    expect(imports).toContain("masteryCheckpoints");
    expect(imports).toContain("contentIndex");
    expect(imports).toContain("finalModuleRegistry");
    expect(imports).toContain("finalContentManifest");
    expect(imports).toContain("finalExportReadiness");
    expect(imports).toContain("finalMergeReadinessNotes");
    expect(imports).toContain("finalIntegrationSanityPack");
  });

  it("references naming patterns and import tags", () => {
    const patterns = PUNJABI_FINAL_IMPORT_READINESS_MAP.flatMap((item) => item.naming_patterns).join(" ");
    const tags = PUNJABI_FINAL_IMPORT_READINESS_MAP.flatMap((item) => item.import_tags).join(" ");
    expect(patterns).toContain("PUNJABI");
    expect(patterns).toContain("Punjabi");
    expect(patterns).toContain("unique");
    expect(tags).toContain("core-imports");
    expect(tags).toContain("boundary-imports");
    expect(tags).toContain("import-readiness");
    expect(tags).toContain("final-regression");
    expect(tags).toContain("canada-practical");
    expect(tags).toContain("no-a11-integration");
  });
});

describe("Punjabi final import-readiness map - boundary checks", () => {
  it("covers imports, naming, duplicate risk, A1-C2, script, Canada, and remediation", () => {
    const text = PUNJABI_FINAL_IMPORT_READINESS_MAP.map((item) => `${item.import_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("import");
    expect(text).toContain("naming");
    expect(text).toContain("duplicate");
    expect(text).toContain("a1-c2");
    expect(text).toContain("gurmukhi");
    expect(text).toContain("canada");
    expect(text).toContain("remediation");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_IMPORT_READINESS_MAP.find(
      (entry) => entry.id === "import-forbidden-claims",
    );
    expect(item).toBeDefined();
    const text = `${item?.import_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text-only data");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_IMPORT_READINESS_MAP.map(
      (item) => `${item.import_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines routes for structure, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_IMPORT_READINESS_MAP_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_IMPORT_READINESS_MAP.map((item) => item.id));
    for (const route of PUNJABI_FINAL_IMPORT_READINESS_MAP_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi final import-readiness map - no unrelated scripts", () => {
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
