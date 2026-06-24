import { describe, expect, it } from "vitest";

import signoff, {
  PUNJABI_FINAL_PRE_A11_SIGNOFF,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_AREAS,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_ITEMS,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_ROOT,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_ROUTES,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE,
  PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE_ALIAS,
  type PunjabiFinalPreA11SignoffArea,
} from "../finalPreA11Signoff";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalPreA11SignoffArea[] = [
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

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (value: unknown): void => {
    if (typeof value === "string") out.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object") Object.values(value).forEach(walk);
  };
  walk(PUNJABI_FINAL_PRE_A11_SIGNOFF_ROOT);
  return out;
}

describe("Punjabi final pre-A11 signoff", () => {
  it("exports app-consumable TypeScript data for Wave 53 only", () => {
    expect(signoff).toBe(PUNJABI_FINAL_PRE_A11_SIGNOFF_ROOT);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_ITEMS).toBe(PUNJABI_FINAL_PRE_A11_SIGNOFF);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.wave).toBe("Wave 53");
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.not_a11_integration).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE_ALIAS).toBe(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE);
  });

  it("declares Punjabi identity, Gurmukhi primary, Shahmukhi awareness-only, and deferred review", () => {
    const scopeText = `${PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.script_note_en} ${PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.native_review_en}`.toLowerCase();
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.primary_script).toBe("Gurmukhi");
    expect(scopeText).toContain("shahmukhi");
    expect(scopeText).toContain("awareness-only");
    expect(scopeText).toContain("not a full course");
    expect(scopeText).toContain("native review is deferred");
    expect(scopeText).toContain("does not claim completed native review");
  });

  it("excludes forbidden scope and infrastructure terms", () => {
    const text = `${PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.excluded_en} ${PUNJABI_FINAL_PRE_A11_SIGNOFF_SCOPE.purpose_en}`.toLowerCase();
    for (const term of [
      "audio",
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

  it("declares all requested signoff areas and covers every area", () => {
    expect(new Set(PUNJABI_FINAL_PRE_A11_SIGNOFF_AREAS)).toEqual(new Set(REQUIRED_AREAS));
    const areas = new Set(PUNJABI_FINAL_PRE_A11_SIGNOFF.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("keeps the signoff compact and covers A1-C2", () => {
    const levels = new Set(PUNJABI_FINAL_PRE_A11_SIGNOFF.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF.length).toBeLessThanOrEqual(12);
  });

  it("uses Gurmukhi-first bilingual content with romanization", () => {
    for (const item of PUNJABI_FINAL_PRE_A11_SIGNOFF) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.signoff_vi.length).toBeGreaterThan(0);
      expect(item.signoff_en.length).toBeGreaterThan(0);
      expect(item.evidence_vi.length).toBeGreaterThan(0);
      expect(item.evidence_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.checked_modules.length).toBeGreaterThan(0);
      expect(item.signoff_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and includes all status classes", () => {
    const ids = PUNJABI_FINAL_PRE_A11_SIGNOFF.map((item) => item.id);
    const statuses = new Set(PUNJABI_FINAL_PRE_A11_SIGNOFF.map((item) => item.status));
    expect(new Set(ids).size).toBe(ids.length);
    expect(statuses.has("signed_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("covers module-family, import/export, naming, duplicate ids, Canada, and remediation", () => {
    const text = PUNJABI_FINAL_PRE_A11_SIGNOFF.map(
      (item) =>
        `${item.signoff_en} ${item.evidence_en} ${item.checked_modules.join(" ")} ${item.signoff_tags.join(" ")} ${item.canada_practical ?? ""}`,
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
      "pre-a11-signoff",
      "final-pre-a11-seal",
      "pre-integration",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("guards native-review deferral, no A11 integration, and forbidden claims", () => {
    const text = PUNJABI_FINAL_PRE_A11_SIGNOFF.map(
      (item) =>
        `${item.signoff_en} ${item.evidence_en} ${item.signoff_tags.join(" ")} ${item.learner_trap_en ?? ""} ${item.must_not_claim_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();

    expect(text).toContain("native review is deferred");
    expect(text).toContain("no completion claim");
    expect(text).toContain("does not mean a11 has been integrated");
    expect(text).toContain("no-a11-integration");
    expect(text).toContain("do not claim native review");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });

  it("defines routes for readiness, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_PRE_A11_SIGNOFF_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_PRE_A11_SIGNOFF.map((item) => item.id));
    for (const route of PUNJABI_FINAL_PRE_A11_SIGNOFF_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi final pre-A11 signoff - no unrelated scripts", () => {
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
