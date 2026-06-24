import { describe, expect, it } from "vitest";

import archiveRoot, {
  PUNJABI_FINAL_PRE_A11_ARCHIVE_AREAS,
  PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX,
  PUNJABI_FINAL_PRE_A11_ARCHIVE_ITEMS,
  PUNJABI_FINAL_PRE_A11_ARCHIVE_ROOT,
  PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE,
  punjabiFinalPreA11ArchiveByArea,
  type PunjabiFinalPreA11ArchiveArea,
} from "@/languages/punjabi/finalPreA11ArchiveIndex";

const GURMUKHI = /[\u0A00-\u0A7F]/;

const REQUIRED_AREAS: PunjabiFinalPreA11ArchiveArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "a1_c2_coverage",
  "gurmukhi_script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "deferred_native_review",
  "forbidden_claims",
];

describe("Punjabi final pre-A11 archive index", () => {
  it("exports app-consumable archive data for Wave 54 only", () => {
    expect(archiveRoot).toBe(PUNJABI_FINAL_PRE_A11_ARCHIVE_ROOT);
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_ITEMS).toBe(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX);
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE.wave).toBe("Wave 54");
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE.not_a11_integration).toBe(true);
  });

  it("covers every requested archive area compactly", () => {
    expect(new Set(PUNJABI_FINAL_PRE_A11_ARCHIVE_AREAS)).toEqual(new Set(REQUIRED_AREAS));
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.length).toBeGreaterThanOrEqual(REQUIRED_AREAS.length);
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.length).toBeLessThanOrEqual(12);

    const areas = new Set(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.map((item) => item.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing area: ${area}`).toBe(true);
      expect(punjabiFinalPreA11ArchiveByArea(area).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("uses Gurmukhi primary with romanization, Vietnamese, and English", () => {
    for (const item of PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX) {
      expect(item.id).toMatch(/^archive-[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.archive_vi.length).toBeGreaterThan(20);
      expect(item.archive_en.length).toBeGreaterThan(20);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.evidence_modules.length).toBeGreaterThan(0);
    }
  });

  it("includes pre-A11 archive, signoff, seal, and pre-integration styles", () => {
    const styles = new Set(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.map((item) => item.style));
    expect(styles.has("pre_a11_archive")).toBe(true);
    expect(styles.has("signoff")).toBe(true);
    expect(styles.has("seal")).toBe(true);
    expect(styles.has("pre_integration")).toBe(true);
  });

  it("covers A1-C2, Canada survival, remediation, naming, and duplicate-id risk", () => {
    const levels = new Set(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX.flatMap((item) => item.levels));
    for (const level of ["A1", "A2", "B1", "B2", "C1", "C2"]) {
      expect(levels.has(level)).toBe(true);
    }

    const text = JSON.stringify(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX).toLowerCase();
    for (const term of [
      "course map",
      "learning path",
      "import",
      "export",
      "naming",
      "duplicate",
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
      "later a11",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("mentions Shahmukhi only as awareness and defers native review", () => {
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE.script_policy_en).toMatch(/Shahmukhi is awareness only/i);
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE.script_policy_en).toMatch(/not a full course/i);
    expect(PUNJABI_FINAL_PRE_A11_ARCHIVE_SCOPE.review_status).toBe("Native review is deferred.");
  });

  it("keeps restricted platform and overclaim terms out of item data", () => {
    const allContent = JSON.stringify(PUNJABI_FINAL_PRE_A11_ARCHIVE_INDEX);
    expect(allContent).not.toMatch(/audio|pronunciation scoring|Azure|auth|billing|RLS|Supabase|CI config/i);
    expect(allContent).not.toMatch(/deployed|pushed|certified|native reviewed|native-approved/i);
  });
});
