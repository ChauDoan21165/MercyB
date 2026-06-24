// src/languages/punjabi/__tests__/punjabiFinalIntegrationEvidenceMap.test.ts
//
// Guards the Punjabi Wave 20 final integration evidence map. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_INTEGRATION_EVIDENCE_AREAS,
  PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP,
  PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROOT,
  PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROUTES,
  PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE,
  type PunjabiIntegrationEvidenceArea,
} from "../finalIntegrationEvidenceMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiIntegrationEvidenceArea[] = [
  "representative_module",
  "level_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "integration_sample",
  "final_qa",
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
  walk(PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROOT);
  return out;
}

describe("Punjabi final integration evidence map - scope", () => {
  it("declares Wave 20 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.wave).toBe("Wave 20");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_INTEGRATION_EVIDENCE_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final integration evidence map - coverage", () => {
  it("declares all requested evidence areas", () => {
    expect(new Set(PUNJABI_FINAL_INTEGRATION_EVIDENCE_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has entries for all requested evidence areas", () => {
    const areas = new Set(PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.map((entry) => entry.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across evidence entries", () => {
    const levels = new Set(PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.flatMap((entry) => entry.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final evidence map compact but useful", () => {
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final integration evidence map - entry shape", () => {
  it("each entry has app-consumable bilingual Gurmukhi-first evidence data", () => {
    for (const entry of PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.title_vi.length).toBeGreaterThan(0);
      expect(entry.title_en.length).toBeGreaterThan(0);
      expect(entry.evidence_vi.length).toBeGreaterThan(0);
      expect(entry.evidence_en.length).toBeGreaterThan(0);
      expect(entry.integration_sample_vi.length).toBeGreaterThan(0);
      expect(entry.integration_sample_en.length).toBeGreaterThan(0);
      expect(entry.sample.gurmukhi).toMatch(GURMUKHI);
      expect(entry.sample.romanization.length).toBeGreaterThan(0);
      expect(entry.sample.vi.length).toBeGreaterThan(0);
      expect(entry.sample.en.length).toBeGreaterThan(0);
      expect(entry.representative_modules.length).toBeGreaterThan(0);
      expect(entry.evidence_tags.length).toBeGreaterThan(0);
      expect(entry.later_a11_note_vi.length).toBeGreaterThan(0);
      expect(entry.later_a11_note_en.length).toBeGreaterThan(0);
    }
  });

  it("includes integration-sample/final-evidence/final-QA style status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.map((entry) => entry.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const traps = PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.filter((entry) => entry.learner_trap_vi && entry.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("references the expected representative Punjabi modules", () => {
    const modules = PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.flatMap((entry) => entry.representative_modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("lessons-a1");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
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
    expect(modules).toContain("finalIntegrationEvidenceMap");
  });
});

describe("Punjabi final integration evidence map - practical and boundary checks", () => {
  it("includes Canada-practical survival/work/health/public-service evidence", () => {
    const canada = PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.filter((entry) => entry.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const text = canada.map((entry) => `${entry.title_en} ${entry.canada_practical} ${entry.evidence_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public-service");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const entry = PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.find((item) => item.id === "evidence-no-audio-azure");
    expect(entry).toBeDefined();
    const text = `${entry?.evidence_en} ${entry?.integration_sample_en} ${entry?.later_a11_note_en} ${entry?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("speech pipeline");
    expect(text).toContain("text-only");
  });

  it("guards native-review and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_INTEGRATION_EVIDENCE_MAP.map((entry) => `${entry.evidence_en} ${entry.integration_sample_en} ${entry.later_a11_note_en} ${entry.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("not claimed");
    expect(text).toContain("does not run a11 integration");
    expect(text).toContain("data only");
  });

  it("defines evidence routes for coverage, Canada samples, and boundaries", () => {
    expect(PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_INTEGRATION_EVIDENCE_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.evidence_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final integration evidence map - no unrelated scripts", () => {
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
