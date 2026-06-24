// src/languages/punjabi/__tests__/punjabiFinalQaInventory.test.ts
//
// Guards the Punjabi Wave 13 final QA inventory. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_QA_AREAS,
  PUNJABI_FINAL_QA_INVENTORY,
  PUNJABI_FINAL_QA_INVENTORY_ROOT,
  PUNJABI_FINAL_QA_REVIEW_ORDER,
  PUNJABI_FINAL_QA_SCOPE,
  type PunjabiQaArea,
} from "../finalQaInventory";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiQaArea[] = [
  "level_coverage",
  "skill_coverage",
  "gurmukhi_first",
  "learner_support",
  "canada_domain",
  "native_review_boundary",
  "no_audio_claim",
  "qa_checkpoint",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_QA_INVENTORY_ROOT);
  return out;
}

describe("Punjabi final QA inventory - scope", () => {
  it("declares Wave 13 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_QA_SCOPE.wave).toBe("Wave 13");
    expect(PUNJABI_FINAL_QA_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_QA_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_QA_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_QA_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_QA_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_QA_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_QA_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_QA_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_QA_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_QA_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final QA inventory - coverage", () => {
  it("declares all requested QA areas", () => {
    expect(new Set(PUNJABI_FINAL_QA_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has inventory entries for all requested QA areas", () => {
    const areas = new Set(PUNJABI_FINAL_QA_INVENTORY.map((item) => item.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across QA entries", () => {
    const levels = new Set(PUNJABI_FINAL_QA_INVENTORY.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the QA inventory compact but useful", () => {
    expect(PUNJABI_FINAL_QA_INVENTORY.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_QA_INVENTORY.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final QA inventory - item shape", () => {
  it("each item has app-consumable bilingual Gurmukhi-first QA data", () => {
    for (const item of PUNJABI_FINAL_QA_INVENTORY) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.qa_question_vi.length).toBeGreaterThan(0);
      expect(item.qa_question_en.length).toBeGreaterThan(0);
      expect(item.expected_evidence_vi.length).toBeGreaterThan(0);
      expect(item.expected_evidence_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.modules_checked.length).toBeGreaterThan(0);
    }
  });

  it("includes final-review/checkpoint/QA style items", () => {
    const statuses = new Set(PUNJABI_FINAL_QA_INVENTORY.map((item) => item.status));
    expect(statuses.has("pass_ready")).toBe(true);
    expect(statuses.has("review_checkpoint")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const checkpoints = PUNJABI_FINAL_QA_INVENTORY.filter((item) => item.checkpoint_vi && item.checkpoint_en);
    expect(checkpoints.length).toBeGreaterThanOrEqual(10);
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_FINAL_QA_INVENTORY.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("references the expected pre-integration Punjabi modules", () => {
    const modules = PUNJABI_FINAL_QA_INVENTORY.flatMap((item) => item.modules_checked).join(" ");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("integrationReadinessChecklist");
    expect(modules).toContain("preIntegrationCoverageMap");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalQaInventory");
  });
});

describe("Punjabi final QA inventory - practical and boundary review", () => {
  it("includes Canada-practical examples across real domains", () => {
    const canadaItems = PUNJABI_FINAL_QA_INVENTORY.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(3);
    const text = canadaItems.map((item) => item.canada_practical).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("school");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const item = PUNJABI_FINAL_QA_INVENTORY.find((entry) => entry.area === "no_audio_claim");
    expect(item).toBeDefined();
    const text = `${item?.qa_question_en} ${item?.expected_evidence_en} ${item?.checkpoint_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("text-only");
  });

  it("defines review order for coverage, Canada, and boundary passes", () => {
    expect(PUNJABI_FINAL_QA_REVIEW_ORDER.length).toBeGreaterThanOrEqual(3);
    for (const step of PUNJABI_FINAL_QA_REVIEW_ORDER) {
      expect(step.vi.length).toBeGreaterThan(0);
      expect(step.en.length).toBeGreaterThan(0);
      expect(step.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final QA inventory - no unrelated scripts", () => {
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
