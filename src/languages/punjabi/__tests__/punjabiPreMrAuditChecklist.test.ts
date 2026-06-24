// src/languages/punjabi/__tests__/punjabiPreMrAuditChecklist.test.ts
//
// Guards the Punjabi Wave 14 pre-MR audit checklist. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRE_MR_AUDIT_AREAS,
  PUNJABI_PRE_MR_AUDIT_CHECKLIST,
  PUNJABI_PRE_MR_AUDIT_CHECKLIST_ROOT,
  PUNJABI_PRE_MR_AUDIT_REVIEW_ROUTES,
  PUNJABI_PRE_MR_AUDIT_SCOPE,
  type PunjabiPreMrAuditArea,
} from "../preMrAuditChecklist";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiPreMrAuditArea[] = [
  "file_coverage",
  "level_coverage",
  "bilingual_support",
  "gurmukhi_first_path",
  "canada_practical_domain",
  "native_review_boundary",
  "no_audio_pronunciation_claim",
  "routing_readiness",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_PRE_MR_AUDIT_CHECKLIST_ROOT);
  return out;
}

describe("Punjabi pre-MR audit checklist - scope", () => {
  it("declares Wave 14 only, not A11 integration", () => {
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.wave).toBe("Wave 14");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.code).toBe("pa");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_PRE_MR_AUDIT_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_PRE_MR_AUDIT_SCOPE.excluded_en.toLowerCase();
    expect(text).toContain("no audio");
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

describe("Punjabi pre-MR audit checklist - coverage", () => {
  it("declares all requested audit areas", () => {
    expect(new Set(PUNJABI_PRE_MR_AUDIT_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has checklist entries for all requested audit areas", () => {
    const areas = new Set(PUNJABI_PRE_MR_AUDIT_CHECKLIST.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across audit entries", () => {
    const levels = new Set(PUNJABI_PRE_MR_AUDIT_CHECKLIST.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the audit checklist compact but useful", () => {
    expect(PUNJABI_PRE_MR_AUDIT_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_PRE_MR_AUDIT_CHECKLIST.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi pre-MR audit checklist - item shape", () => {
  it("each item has app-consumable bilingual Gurmukhi-first audit data", () => {
    for (const item of PUNJABI_PRE_MR_AUDIT_CHECKLIST) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.audit_question_vi.length).toBeGreaterThan(0);
      expect(item.audit_question_en.length).toBeGreaterThan(0);
      expect(item.pass_signal_vi.length).toBeGreaterThan(0);
      expect(item.pass_signal_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.files_or_modules.length).toBeGreaterThan(0);
      expect(item.review_route.length).toBeGreaterThan(0);
    }
  });

  it("includes integration-readiness/review/routing style items", () => {
    const statuses = new Set(PUNJABI_PRE_MR_AUDIT_CHECKLIST.map((item) => item.status));
    expect(statuses.has("ready_for_review")).toBe(true);
    expect(statuses.has("needs_manual_review")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const checkpoints = PUNJABI_PRE_MR_AUDIT_CHECKLIST.filter((item) => item.checkpoint_vi && item.checkpoint_en);
    expect(checkpoints.length).toBeGreaterThanOrEqual(10);
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_PRE_MR_AUDIT_CHECKLIST.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("references the expected pre-MR Punjabi files and modules", () => {
    const modules = PUNJABI_PRE_MR_AUDIT_CHECKLIST.flatMap((item) => item.files_or_modules).join(" ");
    expect(modules).toContain("lessons");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("skillDependencyGraph");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("integrationReadinessChecklist");
    expect(modules).toContain("preIntegrationCoverageMap");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("preMrAuditChecklist");
  });
});

describe("Punjabi pre-MR audit checklist - practical and boundary review", () => {
  it("includes Canada-practical examples across real domains", () => {
    const canadaItems = PUNJABI_PRE_MR_AUDIT_CHECKLIST.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    const text = canadaItems.map((item) => item.canada_practical).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("school");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const item = PUNJABI_PRE_MR_AUDIT_CHECKLIST.find((entry) => entry.area === "no_audio_pronunciation_claim");
    expect(item).toBeDefined();
    const text = `${item?.audit_question_en} ${item?.pass_signal_en} ${item?.checkpoint_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("text-only");
  });

  it("defines review routes for coverage, Canada, and boundary review", () => {
    expect(PUNJABI_PRE_MR_AUDIT_REVIEW_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_PRE_MR_AUDIT_REVIEW_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });

  it("keeps Wave 14 scoped to pre-MR audit and away from A11 integration", () => {
    const item = PUNJABI_PRE_MR_AUDIT_CHECKLIST.find((entry) => entry.id === "audit-final-mr-boundary");
    expect(item).toBeDefined();
    const text = `${item?.audit_question_en} ${item?.pass_signal_en} ${item?.checkpoint_en}`.toLowerCase();
    expect(text).toContain("pre-mr audit");
    expect(text).toContain("a11 integration");
    expect(text).toContain("do not push");
    expect(text).toContain("deploy");
  });
});

describe("Punjabi pre-MR audit checklist - no unrelated scripts", () => {
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
