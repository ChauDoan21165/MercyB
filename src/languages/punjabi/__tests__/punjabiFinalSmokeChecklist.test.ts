// src/languages/punjabi/__tests__/punjabiFinalSmokeChecklist.test.ts
//
// Guards the Punjabi Wave 19 final smoke checklist. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_SMOKE_AREAS,
  PUNJABI_FINAL_SMOKE_CHECKLIST,
  PUNJABI_FINAL_SMOKE_CHECKLIST_ROOT,
  PUNJABI_FINAL_SMOKE_SCOPE,
  PUNJABI_FINAL_SMOKE_SEQUENCE,
  type PunjabiSmokeCheckArea,
} from "../finalSmokeChecklist";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiSmokeCheckArea[] = [
  "a1_c2_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "golden_sample",
  "final_qa",
  "integration_readiness",
  "forbidden_claim",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_SMOKE_CHECKLIST_ROOT);
  return out;
}

describe("Punjabi final smoke checklist - scope", () => {
  it("declares Wave 19 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_SMOKE_SCOPE.wave).toBe("Wave 19");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_SMOKE_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_SMOKE_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_SMOKE_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_SMOKE_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_SMOKE_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final smoke checklist - coverage", () => {
  it("declares all requested smoke areas", () => {
    expect(new Set(PUNJABI_FINAL_SMOKE_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has checks for all requested areas", () => {
    const areas = new Set(PUNJABI_FINAL_SMOKE_CHECKLIST.map((check) => check.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across smoke checks", () => {
    const levels = new Set(PUNJABI_FINAL_SMOKE_CHECKLIST.flatMap((check) => check.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final smoke checklist compact but useful", () => {
    expect(PUNJABI_FINAL_SMOKE_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_SMOKE_CHECKLIST.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final smoke checklist - check shape", () => {
  it("each check has app-consumable bilingual Gurmukhi-first data", () => {
    for (const check of PUNJABI_FINAL_SMOKE_CHECKLIST) {
      expect(check.id.length).toBeGreaterThan(0);
      expect(check.title_pa).toMatch(GURMUKHI);
      expect(check.romanization.length).toBeGreaterThan(0);
      expect(check.title_vi.length).toBeGreaterThan(0);
      expect(check.title_en.length).toBeGreaterThan(0);
      expect(check.smoke_check_vi.length).toBeGreaterThan(0);
      expect(check.smoke_check_en.length).toBeGreaterThan(0);
      expect(check.pass_signal_vi.length).toBeGreaterThan(0);
      expect(check.pass_signal_en.length).toBeGreaterThan(0);
      expect(check.sample.gurmukhi).toMatch(GURMUKHI);
      expect(check.sample.romanization.length).toBeGreaterThan(0);
      expect(check.sample.vi.length).toBeGreaterThan(0);
      expect(check.sample.en.length).toBeGreaterThan(0);
      expect(check.modules_checked.length).toBeGreaterThan(0);
      expect(check.smoke_steps.length).toBeGreaterThan(0);
    }
  });

  it("includes smoke-check/final-QA/integration-readiness status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_SMOKE_CHECKLIST.map((check) => check.status));
    expect(statuses.has("pass_ready")).toBe(true);
    expect(statuses.has("manual_review")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const traps = PUNJABI_FINAL_SMOKE_CHECKLIST.filter((check) => check.learner_trap_vi && check.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("references the expected Punjabi modules", () => {
    const modules = PUNJABI_FINAL_SMOKE_CHECKLIST.flatMap((check) => check.modules_checked).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("lessons-a1");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("skillDependencyGraph");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("preMrAuditChecklist");
    expect(modules).toContain("preIntegrationHandoffMap");
    expect(modules).toContain("finalNavigationMap");
    expect(modules).toContain("finalQualityGates");
    expect(modules).toContain("finalContentManifest");
    expect(modules).toContain("finalSmokeChecklist");
  });
});

describe("Punjabi final smoke checklist - practical and boundary checks", () => {
  it("covers Canada-practical survival/work/health/public service", () => {
    const canada = PUNJABI_FINAL_SMOKE_CHECKLIST.filter((check) => check.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const text = canada.map((check) => `${check.title_en} ${check.canada_practical} ${check.pass_signal_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const check = PUNJABI_FINAL_SMOKE_CHECKLIST.find((entry) => entry.id === "smoke-no-audio-azure");
    expect(check).toBeDefined();
    const text = `${check?.smoke_check_en} ${check?.pass_signal_en} ${check?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("text-only");
    expect(text).toContain("microphone");
  });

  it("guards native-review and A11 boundaries", () => {
    const text = PUNJABI_FINAL_SMOKE_CHECKLIST.map((check) => `${check.smoke_check_en} ${check.pass_signal_en} ${check.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("not claimed");
    expect(text).toContain("does not run a11 integration");
    expect(text).toContain("not infrastructure or release work");
  });

  it("defines smoke sequence for coverage, Canada samples, and boundaries", () => {
    expect(PUNJABI_FINAL_SMOKE_SEQUENCE.length).toBeGreaterThanOrEqual(3);
    for (const step of PUNJABI_FINAL_SMOKE_SEQUENCE) {
      expect(step.vi.length).toBeGreaterThan(0);
      expect(step.en.length).toBeGreaterThan(0);
      expect(step.check_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final smoke checklist - no unrelated scripts", () => {
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
