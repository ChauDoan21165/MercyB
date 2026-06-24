// src/languages/punjabi/__tests__/punjabiFinalNavigationMap.test.ts
//
// Guards the Punjabi Wave 16 final navigation map. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_NAVIGATION_AUDIENCES,
  PUNJABI_FINAL_NAVIGATION_MAP,
  PUNJABI_FINAL_NAVIGATION_NODE_TYPES,
  PUNJABI_FINAL_NAVIGATION_ROOT,
  PUNJABI_FINAL_NAVIGATION_ROUTES,
  PUNJABI_FINAL_NAVIGATION_SCOPE,
  type PunjabiNavigationAudience,
  type PunjabiNavigationNodeType,
} from "../finalNavigationMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_NODE_TYPES: PunjabiNavigationNodeType[] = [
  "entry",
  "script_support",
  "learner_route",
  "skill_module",
  "canada_route",
  "review",
  "remediation",
  "boundary",
];
const REQUIRED_AUDIENCES: PunjabiNavigationAudience[] = ["vi_learner", "en_learner", "later_integration"];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_NAVIGATION_ROOT);
  return out;
}

describe("Punjabi final navigation map - scope", () => {
  it("declares Wave 16 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.wave).toBe("Wave 16");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_NAVIGATION_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_NAVIGATION_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final navigation map - coverage", () => {
  it("declares all requested node types and audiences", () => {
    expect(new Set(PUNJABI_FINAL_NAVIGATION_NODE_TYPES)).toEqual(new Set(REQUIRED_NODE_TYPES));
    expect(new Set(PUNJABI_FINAL_NAVIGATION_AUDIENCES)).toEqual(new Set(REQUIRED_AUDIENCES));
  });

  it("has navigation nodes for all requested node types", () => {
    const types = new Set(PUNJABI_FINAL_NAVIGATION_MAP.map((node) => node.type));
    for (const type of REQUIRED_NODE_TYPES) expect(types.has(type)).toBe(true);
  });

  it("covers A1-C2 across navigation nodes", () => {
    const levels = new Set(PUNJABI_FINAL_NAVIGATION_MAP.flatMap((node) => node.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final navigation map compact but useful", () => {
    expect(PUNJABI_FINAL_NAVIGATION_MAP.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_NAVIGATION_MAP.length).toBeLessThanOrEqual(18);
  });
});

describe("Punjabi final navigation map - node shape", () => {
  it("each node has app-consumable bilingual Gurmukhi-first navigation data", () => {
    for (const node of PUNJABI_FINAL_NAVIGATION_MAP) {
      expect(node.id.length).toBeGreaterThan(0);
      expect(node.title_pa).toMatch(GURMUKHI);
      expect(node.romanization.length).toBeGreaterThan(0);
      expect(node.title_vi.length).toBeGreaterThan(0);
      expect(node.title_en.length).toBeGreaterThan(0);
      expect(node.navigation_vi.length).toBeGreaterThan(0);
      expect(node.navigation_en.length).toBeGreaterThan(0);
      expect(node.readiness_vi.length).toBeGreaterThan(0);
      expect(node.readiness_en.length).toBeGreaterThan(0);
      expect(node.sample.gurmukhi).toMatch(GURMUKHI);
      expect(node.sample.romanization.length).toBeGreaterThan(0);
      expect(node.sample.vi.length).toBeGreaterThan(0);
      expect(node.sample.en.length).toBeGreaterThan(0);
      expect(node.modules.length).toBeGreaterThan(0);
      expect(node.audiences.length).toBeGreaterThan(0);
    }
  });

  it("includes review/remediation/readiness style signals and common learner traps", () => {
    const reviewSignals = PUNJABI_FINAL_NAVIGATION_MAP.filter((node) => node.review_signal_vi && node.review_signal_en);
    const traps = PUNJABI_FINAL_NAVIGATION_MAP.filter((node) => node.learner_trap_vi && node.learner_trap_en);
    expect(reviewSignals.length).toBeGreaterThanOrEqual(10);
    expect(traps.length).toBeGreaterThanOrEqual(9);
  });

  it("links navigation nodes with next-node ids except the terminal boundary", () => {
    const nodeIds = new Set(PUNJABI_FINAL_NAVIGATION_MAP.map((node) => node.id));
    for (const node of PUNJABI_FINAL_NAVIGATION_MAP) {
      for (const nextId of node.next_node_ids) expect(nodeIds.has(nextId)).toBe(true);
    }
    const terminal = PUNJABI_FINAL_NAVIGATION_MAP.find((node) => node.id === "nav-boundary-claims");
    expect(terminal?.next_node_ids).toEqual([]);
  });

  it("references the expected Punjabi modules for later integration", () => {
    const modules = PUNJABI_FINAL_NAVIGATION_MAP.flatMap((node) => node.modules).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("normalize");
    expect(modules).toContain("lessons");
    expect(modules).toContain("lessons-a1");
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
    expect(modules).toContain("finalNavigationMap");
  });
});

describe("Punjabi final navigation map - practical and boundary routes", () => {
  it("routes Canada survival/work/health/public-service content", () => {
    const canadaNodes = PUNJABI_FINAL_NAVIGATION_MAP.filter((node) => node.type === "canada_route");
    expect(canadaNodes.length).toBeGreaterThanOrEqual(3);
    const text = canadaNodes.map((node) => `${node.navigation_en} ${node.canada_practical}`).join(" ").toLowerCase();
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("health");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
    expect(text).toContain("canada");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const text = PUNJABI_FINAL_NAVIGATION_MAP.map((node) => `${node.navigation_en} ${node.review_signal_en} ${node.readiness_en}`).join(" ").toLowerCase();
    expect(text).toContain("text-only");
    expect(text).toContain("no recording");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
  });

  it("defines final routes for learner start, Canada practice, and later-integration review", () => {
    expect(PUNJABI_FINAL_NAVIGATION_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_NAVIGATION_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.node_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final navigation map - no unrelated scripts", () => {
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
