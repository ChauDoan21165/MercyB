import { describe, expect, it } from "vitest";

import auditTrailRoot, {
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL,
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_AREAS,
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ITEMS,
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROOT,
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROUTES,
  PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE,
  punjabiFinalPreA11AuditTrailByArea,
  type PunjabiFinalPreA11AuditTrailArea,
} from "../finalPreA11AuditTrail";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalPreA11AuditTrailArea[] = [
  "module_family_to_level_trace",
  "skill_coverage_trace",
  "gurmukhi_script_trace",
  "canada_domain_trace",
  "remediation_trace",
  "bilingual_support_trace",
  "pre_a11_evidence_chain",
  "import_export_boundary",
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
  walk(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROOT);
  return out;
}

describe("Punjabi final pre-A11 audit trail", () => {
  it("exports app-consumable TypeScript data for Wave 63 only", () => {
    expect(auditTrailRoot).toBe(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROOT);
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ITEMS).toBe(
      PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL,
    );
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.wave).toBe("Wave 63");
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.strict_ready_for_a11).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.ready_for_a11_label).toBe(
      "READY_FOR_A11=true",
    );
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Punjabi identity, Gurmukhi primary, Shahmukhi awareness-only, and deferred review", () => {
    const scopeText =
      `${PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.script_policy_en} ${PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.native_review_en}`.toLowerCase();
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.primary_script).toBe("Gurmukhi");
    expect(scopeText).toContain("shahmukhi");
    expect(scopeText).toContain("awareness only");
    expect(scopeText).toContain("not a full course");
    expect(scopeText).toContain("native review is deferred");
    expect(scopeText).toContain("does not claim completed native review");
  });

  it("declares all requested audit areas and covers every area", () => {
    expect(new Set(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_AREAS)).toEqual(
      new Set(REQUIRED_AREAS),
    );
    const areas = new Set(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map((entry) => entry.area));
    for (const area of REQUIRED_AREAS) {
      expect(areas.has(area), `missing area: ${area}`).toBe(true);
      expect(punjabiFinalPreA11AuditTrailByArea(area).length).toBeGreaterThanOrEqual(1);
    }
  });

  it("keeps the audit trail compact and covers A1-C2", () => {
    const levels = new Set(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.flatMap((entry) => entry.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.length).toBeLessThanOrEqual(12);
  });

  it("uses Gurmukhi-first bilingual content with romanization", () => {
    for (const entry of PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL) {
      expect(entry.id).toMatch(/^audit-trail-[a-z0-9]+(-[a-z0-9]+)*$/);
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.title_vi.length).toBeGreaterThan(0);
      expect(entry.title_en.length).toBeGreaterThan(0);
      expect(entry.audit_vi.length).toBeGreaterThan(20);
      expect(entry.audit_en.length).toBeGreaterThan(20);
      expect(entry.sample.gurmukhi).toMatch(GURMUKHI);
      expect(entry.sample.romanization.length).toBeGreaterThan(0);
      expect(entry.sample.vi.length).toBeGreaterThan(0);
      expect(entry.sample.en.length).toBeGreaterThan(0);
      expect(entry.evidence_refs.length).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and includes all audit statuses", () => {
    const ids = PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map((entry) => entry.id);
    const statuses = new Set(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map((entry) => entry.status));
    expect(new Set(ids).size).toBe(ids.length);
    expect(statuses.has("strict_ready_for_a11")).toBe(true);
    expect(statuses.has("pre_a11_audit_trail")).toBe(true);
    expect(statuses.has("traceability")).toBe(true);
    expect(statuses.has("evidence_receipt")).toBe(true);
    expect(statuses.has("pre_integration")).toBe(true);
  });

  it("maps module families, skills, scripts, Canada domains, remediation, and bilingual support", () => {
    const text = PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map(
      (entry) =>
        `${entry.audit_en} ${entry.evidence_refs.join(" ")} ${entry.canada_practical_en ?? ""} ${entry.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();

    for (const term of [
      "coursemap",
      "learningpath",
      "progressionmatrix",
      "masterycheckpoints",
      "a1-c2",
      "reading",
      "writing",
      "grammar",
      "vocabulary",
      "dialogue",
      "discourse",
      "academic",
      "gurmukhi",
      "romanization",
      "vietnamese explanations",
      "english explanations",
      "clinic",
      "school",
      "workplace",
      "housing",
      "public service",
      "canada",
      "remediation",
      "repair",
      "pre-a11 audit trail",
      "traceability",
      "evidence receipt",
      "completion record",
      "pre-integration",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("guards native-review deferral, no A11 integration, and forbidden claims", () => {
    const text = PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map(
      (entry) => `${entry.audit_en} ${entry.learner_trap_en ?? ""} ${entry.must_not_claim_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();

    expect(text).toContain("native review is deferred");
    expect(text).toContain("not a completed native-review claim");
    expect(text).toContain("does not mean a11 integration has run");
    expect(text).toContain("do not claim native reviewed");
    expect(text).toContain("do not claim a11 has run");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
    expect(text).toContain(".local");
  });

  it("defines routes for readiness, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL.map((entry) => entry.id));
    for (const route of PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      for (const id of route.entry_ids) expect(knownIds.has(id)).toBe(true);
    }
  });

  it("lists restricted scope without performing those actions", () => {
    const text =
      `${PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.excluded_en} ${PUNJABI_FINAL_PRE_A11_AUDIT_TRAIL_SCOPE.purpose_en}`.toLowerCase();
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

describe("Punjabi final pre-A11 audit trail - no unrelated scripts", () => {
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
