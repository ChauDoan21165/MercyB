// src/languages/punjabi/__tests__/punjabiFinalPreIntegrationSummary.test.ts
//
// Guards the Punjabi Wave 21 final pre-integration summary. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY,
  PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_AREAS,
  PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROOT,
  PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROUTES,
  PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE,
  type PunjabiPreIntegrationSummaryArea,
} from "../finalPreIntegrationSummary";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiPreIntegrationSummaryArea[] = [
  "exists",
  "coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_practical",
  "deferred",
  "forbidden_claim",
  "exit_ticket",
  "final_proof",
  "final_qa",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROOT);
  return out;
}

describe("Punjabi final pre-integration summary - scope", () => {
  it("declares Wave 21 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.wave).toBe("Wave 21");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final pre-integration summary - coverage", () => {
  it("declares all requested summary areas", () => {
    expect(new Set(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has summary items for all requested areas", () => {
    const areas = new Set(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across summary items", () => {
    const levels = new Set(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final summary compact but useful", () => {
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final pre-integration summary - item shape", () => {
  it("each item has app-consumable bilingual Gurmukhi-first summary data", () => {
    for (const item of PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.summary_vi.length).toBeGreaterThan(0);
      expect(item.summary_en.length).toBeGreaterThan(0);
      expect(item.final_proof_vi.length).toBeGreaterThan(0);
      expect(item.final_proof_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.modules.length).toBeGreaterThan(0);
      expect(item.proof_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes exit-ticket/final-proof/final-QA status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.map((item) => item.status));
    expect(statuses.has("ready_for_later_a11")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const exits = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.filter((item) => item.exit_ticket_vi && item.exit_ticket_en);
    const traps = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(exits.length).toBeGreaterThanOrEqual(8);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("references the expected Punjabi modules", () => {
    const modules = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.flatMap((item) => item.modules).join(" ");
    expect(modules).toContain("index");
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
    expect(modules).toContain("finalIntegrationEvidenceMap");
    expect(modules).toContain("finalPreIntegrationSummary");
  });
});

describe("Punjabi final pre-integration summary - practical and boundary checks", () => {
  it("summarizes Canada-practical survival/work/health/public-service coverage", () => {
    const canada = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.filter((item) => item.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const text = canada.map((item) => `${item.title_en} ${item.canada_practical} ${item.summary_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation/Azure claims", () => {
    const item = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.find((entry) => entry.id === "summary-forbidden-claims");
    expect(item).toBeDefined();
    const text = `${item?.summary_en} ${item?.final_proof_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("text-only");
  });

  it("guards native-review and no-A11 boundaries", () => {
    const text = PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY.map((item) => `${item.summary_en} ${item.final_proof_en} ${item.exit_ticket_en} ${item.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("not claimed");
    expect(text).toContain("does not run a11");
    expect(text).toContain("no push");
    expect(text).toContain("no deploy");
  });

  it("defines summary routes for coverage, Canada, and boundary exit", () => {
    expect(PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_PRE_INTEGRATION_SUMMARY_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final pre-integration summary - no unrelated scripts", () => {
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
