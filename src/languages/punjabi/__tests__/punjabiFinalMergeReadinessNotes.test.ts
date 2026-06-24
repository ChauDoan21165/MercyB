// src/languages/punjabi/__tests__/punjabiFinalMergeReadinessNotes.test.ts
//
// Guards the Punjabi Wave 32 final merge-readiness notes. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_MERGE_READINESS_NOTES_AREAS,
  PUNJABI_FINAL_MERGE_READINESS_NOTES,
  PUNJABI_FINAL_MERGE_READINESS_NOTES_ROOT,
  PUNJABI_FINAL_MERGE_READINESS_NOTES_ROUTES,
  PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE,
  PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE_ALIAS,
  type PunjabiFinalMergeReadinessArea,
} from "../finalMergeReadinessNotes";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiFinalMergeReadinessArea[] = [
  "module_families",
  "export_checks",
  "duplicate_risk",
  "level_coverage",
  "script_coverage",
  "canada_domains",
  "remediation_coverage",
  "merge_readiness",
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
  walk(PUNJABI_FINAL_MERGE_READINESS_NOTES_ROOT);
  return out;
}

describe("Punjabi final merge-readiness notes - scope", () => {
  it("declares Wave 32 only and not A11 integration", () => {
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.wave).toBe("Wave 32");
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.not_a11_integration).toBe(true);
  });

  it("keeps the legacy scope alias available", () => {
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE_ALIAS).toBe(
      PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE,
    );
  });

  it("declares Punjabi identity and Gurmukhi primary", () => {
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("frames itself as pre-integration merge readiness for later A11", () => {
    const text = PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.purpose_en.toLowerCase();
    expect(text).toContain("merge-readiness");
    expect(text).toContain("later a11");
    expect(text).toContain("do not perform integration");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    const text = `${PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.script_note_en} ${PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.native_review_en}`.toLowerCase();
    expect(text).toContain("shahmukhi");
    expect(text).toContain("awareness-only");
    expect(text).toContain("not a full course");
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_MERGE_READINESS_NOTES_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final merge-readiness notes - coverage", () => {
  it("declares all requested merge-readiness areas", () => {
    expect(new Set(PUNJABI_FINAL_MERGE_READINESS_NOTES_AREAS)).toEqual(
      new Set(REQUIRED_AREAS),
    );
  });

  it("has items for every requested area", () => {
    const areas = new Set(PUNJABI_FINAL_MERGE_READINESS_NOTES.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across merge-readiness items", () => {
    const levels = new Set(PUNJABI_FINAL_MERGE_READINESS_NOTES.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the notes compact but useful", () => {
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES.length).toBeLessThanOrEqual(12);
  });
});

describe("Punjabi final merge-readiness notes - item shape", () => {
  it("uses app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_MERGE_READINESS_NOTES) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.note_vi.length).toBeGreaterThan(0);
      expect(item.note_en.length).toBeGreaterThan(0);
      expect(item.regression_vi.length).toBeGreaterThan(0);
      expect(item.regression_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.expected_modules.length).toBeGreaterThan(0);
      expect(item.export_groups.length).toBeGreaterThan(0);
      expect(item.merge_tags.length).toBeGreaterThan(0);
    }
  });

  it("keeps every item id unique", () => {
    const ids = PUNJABI_FINAL_MERGE_READINESS_NOTES.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("includes statuses and boundary markers", () => {
    const statuses = new Set(PUNJABI_FINAL_MERGE_READINESS_NOTES.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
  });

  it("includes learner traps, Canada practice, and must-not-claim markers", () => {
    const traps = PUNJABI_FINAL_MERGE_READINESS_NOTES.filter(
      (item) => item.learner_trap_vi && item.learner_trap_en,
    );
    const forbidden = PUNJABI_FINAL_MERGE_READINESS_NOTES.filter(
      (item) => item.must_not_claim_vi && item.must_not_claim_en,
    );
    const canada = PUNJABI_FINAL_MERGE_READINESS_NOTES.filter(
      (item) => item.canada_practical && item.canada_practical.length > 0,
    );
    expect(traps.length).toBeGreaterThanOrEqual(8);
    expect(forbidden.length).toBeGreaterThanOrEqual(2);
    expect(canada.length).toBeGreaterThanOrEqual(1);
  });

  it("references expected module families for merge planning", () => {
    const modules = PUNJABI_FINAL_MERGE_READINESS_NOTES.flatMap((item) => item.expected_modules).join(" ");
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
    expect(modules).toContain("finalExportReadiness");
    expect(modules).toContain("finalPackagingReadiness");
    expect(modules).toContain("finalIntegrationStabilityPlan");
    expect(modules).toContain("finalIntegrationGuardrails");
    expect(modules).toContain("finalIntegrationDryRunPlan");
    expect(modules).toContain("finalA11HandoffNotes");
    expect(modules).toContain("finalIntegrationSanityPack");
  });

  it("references export groups expected by merge planning", () => {
    const groups = PUNJABI_FINAL_MERGE_READINESS_NOTES.flatMap((item) => item.export_groups).join(" ");
    expect(groups).toContain("core_exports");
    expect(groups).toContain("review_exports");
    expect(groups).toContain("boundary_exports");
    expect(groups).toContain("naming_exports");
    expect(groups).toContain("route_exports");
    expect(groups).toContain("order_exports");
    expect(groups).toContain("dedupe_exports");
    expect(groups).toContain("qa_exports");
    expect(groups).toContain("safe_exports");
    expect(groups).toContain("level_exports");
    expect(groups).toContain("script_exports");
    expect(groups).toContain("canada_exports");
    expect(groups).toContain("public_service_exports");
    expect(groups).toContain("remediation_exports");
    expect(groups).toContain("regression_exports");
    expect(groups).toContain("merge_exports");
  });
});

describe("Punjabi final merge-readiness notes - boundary checks", () => {
  it("covers merge readiness, duplicate risk, A1-C2, script, Canada, and remediation", () => {
    const text = PUNJABI_FINAL_MERGE_READINESS_NOTES.map((item) => `${item.note_en} ${item.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("merge");
    expect(text).toContain("duplicate");
    expect(text).toContain("a1-c2");
    expect(text).toContain("gurmukhi");
    expect(text).toContain("canada");
    expect(text).toContain("remediation");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_MERGE_READINESS_NOTES.find(
      (entry) => entry.id === "merge-forbidden-claims",
    );
    expect(item).toBeDefined();
    const text = `${item?.note_en} ${item?.must_not_claim_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("supabase");
    expect(text).toContain("deploy");
    expect(text).toContain("push");
    expect(text).toContain("text-only data");
  });

  it("guards native-review deferral and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_MERGE_READINESS_NOTES.map(
      (item) => `${item.note_en} ${item.must_not_claim_en ?? ""} ${item.learner_trap_en ?? ""}`,
    )
      .join(" ")
      .toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("completion is not claimed");
    expect(text).toContain("not a11 integration");
    expect(text).toContain("no a11 integration");
  });

  it("defines routes for structure, coverage, and boundary checks", () => {
    expect(PUNJABI_FINAL_MERGE_READINESS_NOTES_ROUTES.length).toBe(3);
    const knownIds = new Set(PUNJABI_FINAL_MERGE_READINESS_NOTES.map((item) => item.id));
    for (const route of PUNJABI_FINAL_MERGE_READINESS_NOTES_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
      for (const id of route.item_ids) expect(knownIds.has(id)).toBe(true);
    }
  });
});

describe("Punjabi final merge-readiness notes - no unrelated scripts", () => {
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
