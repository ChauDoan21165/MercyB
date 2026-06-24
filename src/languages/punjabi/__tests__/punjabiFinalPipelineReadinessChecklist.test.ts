// src/languages/punjabi/__tests__/punjabiFinalPipelineReadinessChecklist.test.ts
//
// Guards the Punjabi Wave 46 Pipeline readiness checklist. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_AREAS,
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST,
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_ROOT,
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_ROUTES,
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE,
  PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE_ALIAS,
  type PunjabiFinalPipelineReadinessChecklistArea,
} from "../finalPipelineReadinessChecklist";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalPipelineReadinessChecklistArea[] = [
  "module_family_completeness",
  "import_export_expectations",
  "naming_consistency",
  "duplicate_id_risk",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "pipeline_readiness_decision",
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
  walk(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_ROOT);
  return out;
}

describe("Punjabi Pipeline readiness checklist", () => {
  it("declares Wave 46 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.wave).toBe("Wave 46");
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.not_a11_integration).toBe(true);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE_ALIAS).toBe(
      PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE,
    );
  });

  it("declares Punjabi identity, Gurmukhi primary, Shahmukhi awareness-only, and deferred review", () => {
    const scopeText = `${PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.script_note_en} ${PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.native_review_en}`.toLowerCase();
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.primary_script).toBe("Gurmukhi");
    expect(scopeText).toContain("shahmukhi");
    expect(scopeText).toContain("awareness-only");
    expect(scopeText).toContain("not a full course");
    expect(scopeText).toContain("native review is deferred");
    expect(scopeText).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_SCOPE.excluded_en.toLowerCase();
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
    ]) {
      expect(text).toContain(term);
    }
  });

  it("declares all requested areas and covers every area", () => {
    expect(new Set(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_AREAS)).toEqual(new Set(REQUIRED_AREAS));
    const areas = new Set(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 and stays compact", () => {
    const levels = new Set(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.length).toBeLessThanOrEqual(12);
  });

  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.pipeline_vi.length).toBeGreaterThan(0);
      expect(item.pipeline_en.length).toBeGreaterThan(0);
      expect(item.risk_vi.length).toBeGreaterThan(0);
      expect(item.risk_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.pipeline_targets.length).toBeGreaterThan(0);
      expect(item.pipeline_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps ids unique and includes pipeline-readiness check status markers", () => {
    const ids = PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map((item) => item.id);
    const statuses = new Set(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map((item) => item.status));
    expect(new Set(ids).size).toBe(ids.length);
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps, Canada practice, and must-not-claim markers", () => {
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.filter((item) => item.learner_trap_vi && item.learner_trap_en).length).toBeGreaterThanOrEqual(8);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.filter((item) => item.must_not_claim_vi && item.must_not_claim_en).length).toBeGreaterThanOrEqual(2);
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.filter((item) => item.canada_practical).length).toBeGreaterThanOrEqual(1);
  });

  it("covers requested pipeline-readiness concepts", () => {
    const text = PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map((item) => `${item.pipeline_en} ${item.title_en}`).join(" ").toLowerCase();
    for (const term of [
      "pipeline",
      "module",
      "import",
      "export",
      "naming",
      "duplicate",
      "a1-c2",
      "gurmukhi",
      "canada",
      "remediation",
      "ci-readiness",
      "mr-readiness",
      "owner-acceptance",
      "final-acceptance",
      "final-freeze",
      "final-lock",
      "pre-integration",
    ]) {
      expect(text).toContain(term);
    }
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map(
      (item) => `${item.pipeline_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines routes for readiness, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST.map((item) => item.id));
    for (const route of PUNJABI_FINAL_PIPELINE_READINESS_CHECKLIST_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi Pipeline readiness checklist - no unrelated scripts", () => {
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
