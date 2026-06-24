import { describe, expect, it } from "vitest";

import bundleRoot, {
  PUNJABI_FINAL_PRE_A11_BUNDLE_AREAS,
  PUNJABI_FINAL_PRE_A11_BUNDLE_ITEMS,
  PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST,
  PUNJABI_FINAL_PRE_A11_BUNDLE_ROOT,
  PUNJABI_FINAL_PRE_A11_BUNDLE_ROUTES,
  PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE,
  punjabiFinalPreA11BundleByArea,
  type PunjabiFinalPreA11BundleArea,
} from "../finalPreA11BundleManifest";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalPreA11BundleArea[] = [
  "module_family_inventory",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risks",
  "a1_c2_coverage",
  "gurmukhi_script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "deferred_native_review",
  "forbidden_claims",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(PUNJABI_FINAL_PRE_A11_BUNDLE_ROOT);
  return out;
}

describe("Punjabi final pre-A11 bundle manifest", () => {
  it("exports app-consumable TypeScript data for Wave 57 only", () => {
    expect(bundleRoot).toBe(PUNJABI_FINAL_PRE_A11_BUNDLE_ROOT);
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_ITEMS).toBe(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST);
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.wave).toBe("Wave 57");
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Punjabi identity, Gurmukhi primary, Shahmukhi awareness-only, and deferred review", () => {
    const scopeText =
      `${PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.script_policy_en} ${PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.native_review_en}`.toLowerCase();
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.primary_script).toBe("Gurmukhi");
    expect(scopeText).toContain("shahmukhi");
    expect(scopeText).toContain("awareness only");
    expect(scopeText).toContain("not a full course");
    expect(scopeText).toContain("native review is deferred");
    expect(scopeText).toContain("does not claim completed native review");
  });

  it("declares all requested bundle areas and covers every area", () => {
    expect(new Set(PUNJABI_FINAL_PRE_A11_BUNDLE_AREAS)).toEqual(new Set(REQUIRED_AREAS));
    const areas = new Set(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map((item) => item.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing area: ${area}`).toBe(true);
      expect(punjabiFinalPreA11BundleByArea(area).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps the bundle compact and covers A1-C2", () => {
    const levels = new Set(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.length).toBeLessThanOrEqual(12);
  });

  it("uses Gurmukhi-first bilingual content with romanization", () => {
    for (const item of PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST) {
      expect(item.id).toMatch(/^bundle-[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.manifest_vi.length).toBeGreaterThan(20);
      expect(item.manifest_en.length).toBeGreaterThan(20);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.bundled_modules.length).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and includes all bundle styles", () => {
    const ids = PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map((item) => item.id);
    const styles = new Set(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map((item) => item.style));
    expect(new Set(ids).size).toBe(ids.length);
    expect(styles.has("pre_a11_bundle")).toBe(true);
    expect(styles.has("receipt")).toBe(true);
    expect(styles.has("ledger")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });

  it("covers inventory, import/export, naming, duplicate ids, Canada, and remediation", () => {
    const text = PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map(
      (item) =>
        `${item.manifest_en} ${item.bundled_modules.join(" ")} ${item.canada_practical_en ?? ""} ${item.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();

    for (const term of [
      "coursemap",
      "learningpath",
      "progressionmatrix",
      "masterycheckpoints",
      "import",
      "export",
      "naming",
      "duplicate",
      "a1-c2",
      "gurmukhi",
      "clinic",
      "school",
      "workplace",
      "housing",
      "public service",
      "canada",
      "remediation",
      "repair",
      "pre-a11",
      "bundle",
      "receipt",
      "ledger",
      "pre-integration",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("guards native-review deferral, no A11 integration, and forbidden claims", () => {
    const text = PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map(
      (item) =>
        `${item.manifest_en} ${item.learner_trap_en ?? ""} ${item.must_not_claim_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();

    expect(text).toContain("native review is deferred");
    expect(text).toContain("not a completed native-review claim");
    expect(text).toContain("does not mean later a11 has run");
    expect(text).toContain("do not claim native reviewed");
    expect(text).toContain("do not claim a11 has run");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });

  it("defines routes for readiness, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_PRE_A11_BUNDLE_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_PRE_A11_BUNDLE_MANIFEST.map((item) => item.id));
    for (const route of PUNJABI_FINAL_PRE_A11_BUNDLE_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });

  it("lists restricted scope without performing those actions", () => {
    const text =
      `${PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.excluded_en} ${PUNJABI_FINAL_PRE_A11_BUNDLE_SCOPE.purpose_en}`.toLowerCase();
    for (const term of [
      "no audio creation",
      "pronunciation scoring",
      "azure",
      "auth",
      "billing",
      "rls",
      "supabase",
      "ci config",
      "push",
      "deploy",
      ".local",
      "does not wire",
    ]) {
      expect(text).toContain(term);
    }
  });
});

describe("Punjabi final pre-A11 bundle manifest - no unrelated scripts", () => {
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
