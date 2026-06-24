// src/languages/punjabi/__tests__/punjabiIntegrationReadinessChecklist.test.ts
//
// Guards the Punjabi Wave 9 integration readiness checklist.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_INTEGRATION_READINESS,
  PUNJABI_INTEGRATION_READINESS_CHECKLIST,
  PUNJABI_INTEGRATION_READINESS_SUMMARY,
  PUNJABI_INTEGRATION_SCOPE,
  PUNJABI_READINESS_AREAS,
  type PunjabiReadinessArea,
} from "../integrationReadinessChecklist";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiReadinessArea[] = [
  "module_coverage",
  "level_coverage",
  "script_path",
  "bilingual_support",
  "canada_survival",
  "workplace",
  "healthcare",
  "public_service",
  "review_remediation",
  "scope_honesty",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_INTEGRATION_READINESS);
  return out;
}

describe("Punjabi integration readiness - scope", () => {
  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_INTEGRATION_SCOPE.code).toBe("pa");
    expect(PUNJABI_INTEGRATION_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_INTEGRATION_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("says this is for later A11 and does not run A11", () => {
    expect(PUNJABI_INTEGRATION_SCOPE.integration_note_en.toLowerCase()).toContain("later a11");
    expect(PUNJABI_INTEGRATION_SCOPE.integration_note_en.toLowerCase()).toContain("does not run a11");
    expect(PUNJABI_INTEGRATION_READINESS_SUMMARY.later_a11_note_en.toLowerCase()).toContain("does not run a11");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_INTEGRATION_SCOPE.shahmukhi_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_INTEGRATION_SCOPE.shahmukhi_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_INTEGRATION_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_INTEGRATION_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring and infrastructure work", () => {
    const text = PUNJABI_INTEGRATION_SCOPE.forbidden_scope_en.toLowerCase();
    expect(text).toContain("no audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("auth");
    expect(text).toContain("billing");
    expect(text).toContain("supabase");
    expect(text).toContain("ci");
    expect(text).toContain("push");
    expect(text).toContain("deploy");
  });
});

describe("Punjabi integration readiness - coverage", () => {
  it("declares all required readiness areas", () => {
    expect(new Set(PUNJABI_READINESS_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has checklist entries for every readiness area", () => {
    const areas = new Set(PUNJABI_INTEGRATION_READINESS_CHECKLIST.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across readiness items", () => {
    const levels = new Set(PUNJABI_INTEGRATION_READINESS_CHECKLIST.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the checklist compact but useful", () => {
    expect(PUNJABI_INTEGRATION_READINESS_CHECKLIST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_INTEGRATION_READINESS_CHECKLIST.length).toBeLessThanOrEqual(18);
  });
});

describe("Punjabi integration readiness - item data", () => {
  it("each item is app-consumable bilingual data with Gurmukhi and romanization", () => {
    for (const item of PUNJABI_INTEGRATION_READINESS_CHECKLIST) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.check_vi.length).toBeGreaterThan(0);
      expect(item.check_en.length).toBeGreaterThan(0);
      expect(item.evidence_modules.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_INTEGRATION_READINESS_CHECKLIST.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
  });

  it("tracks ready, deferred, and blocked-out-of-scope statuses", () => {
    const statuses = new Set(PUNJABI_INTEGRATION_READINESS_CHECKLIST.map((item) => item.status));
    expect(statuses.has("ready_for_later_integration")).toBe(true);
    expect(statuses.has("deferred")).toBe(true);
    expect(statuses.has("blocked_out_of_scope")).toBe(true);
    expect(PUNJABI_INTEGRATION_READINESS_SUMMARY.ready_count).toBeGreaterThanOrEqual(8);
  });
});

describe("Punjabi integration readiness - practical and module evidence", () => {
  it("covers module, level, Gurmukhi, VI/EN, Canada, workplace, health, public-service, review/remediation, and honesty checks", () => {
    const text = PUNJABI_INTEGRATION_READINESS_CHECKLIST
      .map((item) => `${item.area} ${item.check_en} ${item.evidence_modules.join(" ")}`)
      .join(" ")
      .toLowerCase();
    expect(text).toContain("foundation");
    expect(text).toContain("a1-c2");
    expect(text).toContain("gurmukhi");
    expect(text).toContain("vietnamese");
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("health");
    expect(text).toContain("public");
    expect(text).toContain("remediation");
    expect(text).toContain("native review");
  });

  it("has Canada-practical entries for settlement/work/health/public-service", () => {
    const canada = PUNJABI_INTEGRATION_READINESS_CHECKLIST.filter((item) => item.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(4);
    const text = canada.map((item) => `${item.area} ${item.check_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("health");
    expect(text).toContain("public");
  });
});

describe("Punjabi integration readiness - no unrelated scripts", () => {
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
