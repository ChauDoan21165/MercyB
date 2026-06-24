// src/languages/punjabi/__tests__/punjabiPreIntegrationHandoffMap.test.ts
//
// Guards the Punjabi Wave 15 pre-integration handoff map. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRE_INTEGRATION_HANDOFF_GROUPS,
  PUNJABI_PRE_INTEGRATION_HANDOFF_LANES,
  PUNJABI_PRE_INTEGRATION_HANDOFF_MAP,
  PUNJABI_PRE_INTEGRATION_HANDOFF_ROOT,
  PUNJABI_PRE_INTEGRATION_HANDOFF_ROUTES,
  PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE,
  type PunjabiHandoffGroup,
  type PunjabiHandoffLane,
} from "../preIntegrationHandoffMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_LANES: PunjabiHandoffLane[] = [
  "foundation_lane",
  "dialogue_lane",
  "course_navigation_lane",
  "progression_lane",
  "quality_lane",
  "handoff_boundary_lane",
];
const REQUIRED_GROUPS: PunjabiHandoffGroup[] = [
  "script_foundation",
  "learner_journey",
  "skill_progression",
  "canada_practical",
  "pre_integration_review",
  "forbidden_claims",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_PRE_INTEGRATION_HANDOFF_ROOT);
  return out;
}

describe("Punjabi pre-integration handoff map - scope", () => {
  it("declares Wave 15 only, not A11 integration", () => {
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.wave).toBe("Wave 15");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.code).toBe("pa");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_PRE_INTEGRATION_HANDOFF_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi pre-integration handoff map - coverage", () => {
  it("declares all requested lanes and groups", () => {
    expect(new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_LANES)).toEqual(new Set(REQUIRED_LANES));
    expect(new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_GROUPS)).toEqual(new Set(REQUIRED_GROUPS));
  });

  it("has handoff entries for all lanes and groups", () => {
    const lanes = new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.map((item) => item.lane));
    const groups = new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.map((item) => item.group));
    for (const lane of REQUIRED_LANES) expect(lanes.has(lane)).toBe(true);
    for (const group of REQUIRED_GROUPS) expect(groups.has(group)).toBe(true);
  });

  it("covers A1-C2 across handoff entries", () => {
    const levels = new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the handoff map compact but useful", () => {
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.length).toBeGreaterThanOrEqual(9);
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi pre-integration handoff map - item shape", () => {
  it("each item has app-consumable bilingual Gurmukhi-first handoff data", () => {
    for (const item of PUNJABI_PRE_INTEGRATION_HANDOFF_MAP) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.handoff_vi.length).toBeGreaterThan(0);
      expect(item.handoff_en.length).toBeGreaterThan(0);
      expect(item.readiness_signal_vi.length).toBeGreaterThan(0);
      expect(item.readiness_signal_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.modules.length).toBeGreaterThan(0);
      expect(item.owner_lane_vi.length).toBeGreaterThan(0);
      expect(item.owner_lane_en.length).toBeGreaterThan(0);
      expect(item.next_step_vi.length).toBeGreaterThan(0);
      expect(item.next_step_en.length).toBeGreaterThan(0);
    }
  });

  it("includes learner-journey/handoff/readiness style status markers", () => {
    const statuses = new Set(PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.map((item) => item.status));
    expect(statuses.has("ready_for_later_integration")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const traps = PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
  });

  it("references the expected Punjabi module groups", () => {
    const modules = PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.flatMap((item) => item.modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("normalize");
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
    expect(modules).toContain("preIntegrationHandoffMap");
  });
});

describe("Punjabi pre-integration handoff map - practical and boundary review", () => {
  it("includes Canada-practical examples across real domains", () => {
    const canadaItems = PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(2);
    const text = canadaItems.map((item) => item.canada_practical).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("school");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const item = PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.find((entry) => entry.id === "handoff-no-audio-scoring");
    expect(item).toBeDefined();
    const text = `${item?.handoff_en} ${item?.readiness_signal_en} ${item?.next_step_en} ${item?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("text-only");
    expect(text).toContain("azure");
  });

  it("keeps later A11 as a deferred boundary", () => {
    const item = PUNJABI_PRE_INTEGRATION_HANDOFF_MAP.find((entry) => entry.id === "handoff-later-a11-boundary");
    expect(item).toBeDefined();
    const text = `${item?.handoff_en} ${item?.readiness_signal_en} ${item?.owner_lane_en} ${item?.next_step_en}`.toLowerCase();
    expect(text).toContain("later a11");
    expect(text).toContain("does not run a11 integration");
    expect(text).toContain("no push");
    expect(text).toContain("no deploy");
  });

  it("defines handoff routes for learner journey, Canada, and quality boundaries", () => {
    expect(PUNJABI_PRE_INTEGRATION_HANDOFF_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_PRE_INTEGRATION_HANDOFF_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi pre-integration handoff map - no unrelated scripts", () => {
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
