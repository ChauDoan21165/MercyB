// src/languages/punjabi/__tests__/punjabiFinalReleaseCandidateChecklist.test.ts
//
// Guards the Punjabi Wave 37 final release-candidate checklist. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_AREAS,
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST,
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROOT,
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROUTES,
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE,
  PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE_ALIAS,
  type PunjabiFinalReleaseCandidateArea,
} from "../finalReleaseCandidateChecklist";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalReleaseCandidateArea[] = [
  "import_export_readiness",
  "module_family_coverage",
  "level_coverage",
  "script_coverage",
  "canada_survival_coverage",
  "remediation_coverage",
  "duplicate_id_risk",
  "release_candidate_validation",
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
  walk(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROOT);
  return out;
}

describe("Punjabi final release-candidate checklist - scope", () => {
  it("declares Wave 37 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.wave).toBe("Wave 37");
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE_ALIAS).toBe(
      PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE,
    );
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("frames itself as release-candidate readiness for later A11 only", () => {
    const text = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.purpose_en.toLowerCase();
    expect(text).toContain("final release-candidate checklist");
    expect(text).toContain("later a11");
    expect(text).toContain("does not perform integration");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.script_note_en} ${PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final release-candidate checklist - coverage", () => {
  it("declares all requested release-candidate areas", () => {
    expect(new Set(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_AREAS)).toEqual(
      new Set(REQUIRED_AREAS),
    );
  });

  it("has items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across release-candidate items", () => {
    const levels = new Set(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the checklist compact but useful", () => {
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi final release-candidate checklist - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.check_vi.length).toBeGreaterThan(0);
      expect(item.check_en.length).toBeGreaterThan(0);
      expect(item.risk_vi.length).toBeGreaterThan(0);
      expect(item.risk_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.release_targets.length).toBeGreaterThan(0);
      expect(item.release_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps every item id unique", () => {
    const ids = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps, Canada practice, and must-not-claim markers", () => {
    const traps = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.filter(
      (item) => item.learner_trap_vi && item.learner_trap_en,
    );
    const forbidden = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.filter(
      (item) => item.must_not_claim_vi && item.must_not_claim_en,
    );
    const canada = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.filter(
      (item) => item.canada_practical && item.canada_practical.length > 0,
    );
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
    expect(canada.length).toBeGreaterThanOrEqual(1);
  });

  it("references expected release targets", () => {
    const targets = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.flatMap((item) => item.release_targets).join(" ");
    expect(targets).toContain("index");
    expect(targets).toContain("lessons");
    expect(targets).toContain("dialogues");
    expect(targets).toContain("finalImportReadinessMap");
    expect(targets).toContain("finalA11ValidationChecklist");
    expect(targets).toContain("finalIntegrationClosureChecklist");
  });

  it("references release tags for final cross-check planning", () => {
    const tags = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.flatMap((item) => item.release_tags).join(" ");
    expect(tags).toContain("import-readiness");
    expect(tags).toContain("export-readiness");
    expect(tags).toContain("release-candidate");
    expect(tags).toContain("a1-c2");
    expect(tags).toContain("canada-practical");
    expect(tags).toContain("gurmukhi-first");
    expect(tags).toContain("remediation");
    expect(tags).toContain("no-a11-integration");
  });
});

describe("Punjabi final release-candidate checklist - boundary checks", () => {
  it("covers imports, exports, module families, A1-C2, script, Canada, remediation, duplicate IDs, and release candidate", () => {
    const text = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map((item) => `${item.check_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("import");
    expect(text).toContain("export");
    expect(text).toContain("family");
    expect(text).toContain("a1-c2");
    expect(text).toContain("gurmukhi");
    expect(text).toContain("canada");
    expect(text).toContain("remediation");
    expect(text).toContain("duplicate");
    expect(text).toContain("release");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.find(
      (entry) => entry.id === "release-forbidden-claims",
    );
    expect(item).toBeDefined();
    const text = `${item?.check_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text-only data");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map(
      (item) => `${item.check_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines routes for readiness, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST.map((item) => item.id));
    for (const route of PUNJABI_FINAL_RELEASE_CANDIDATE_CHECKLIST_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi final release-candidate checklist - no unrelated scripts", () => {
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
