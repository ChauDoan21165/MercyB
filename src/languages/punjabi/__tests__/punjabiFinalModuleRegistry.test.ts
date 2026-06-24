// src/languages/punjabi/__tests__/punjabiFinalModuleRegistry.test.ts
//
// Guards the Punjabi Wave 11 final module registry. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_MODULE_REGISTRY,
  PUNJABI_FINAL_MODULE_REGISTRY_ROOT,
  PUNJABI_FINAL_REGISTRY_ROUTES,
  PUNJABI_FINAL_REGISTRY_SCOPE,
  PUNJABI_FINAL_REGISTRY_SKILLS,
  type PunjabiRegistrySkill,
} from "../finalModuleRegistry";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_SKILLS: PunjabiRegistrySkill[] = [
  "foundation",
  "dialogue",
  "navigation",
  "learning_path",
  "progression",
  "mastery",
  "dependency_graph",
  "content_index",
  "readiness",
  "coverage",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_MODULE_REGISTRY_ROOT);
  return out;
}

describe("Punjabi final module registry - scope", () => {
  it("declares Wave 11 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.wave).toBe("Wave 11");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_REGISTRY_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_REGISTRY_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final module registry - coverage", () => {
  it("declares all registry skills", () => {
    expect(new Set(PUNJABI_FINAL_REGISTRY_SKILLS)).toEqual(new Set(REQUIRED_SKILLS));
  });

  it("has registry entries for all major skills", () => {
    const skills = new Set(PUNJABI_FINAL_MODULE_REGISTRY.map((entry) => entry.skill));
    for (const skill of REQUIRED_SKILLS) expect(skills.has(skill)).toBe(true);
  });

  it("covers A1-C2 across entries", () => {
    const levels = new Set(PUNJABI_FINAL_MODULE_REGISTRY.flatMap((entry) => entry.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps registry compact but useful", () => {
    expect(PUNJABI_FINAL_MODULE_REGISTRY.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_MODULE_REGISTRY.length).toBeLessThanOrEqual(18);
  });
});

describe("Punjabi final module registry - entry shape", () => {
  it("each entry has app-consumable bilingual Gurmukhi-first data", () => {
    for (const entry of PUNJABI_FINAL_MODULE_REGISTRY) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.module.length).toBeGreaterThan(0);
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.title_vi.length).toBeGreaterThan(0);
      expect(entry.title_en.length).toBeGreaterThan(0);
      expect(entry.purpose_vi.length).toBeGreaterThan(0);
      expect(entry.purpose_en.length).toBeGreaterThan(0);
      expect(entry.route_hint_vi.length).toBeGreaterThan(0);
      expect(entry.route_hint_en.length).toBeGreaterThan(0);
      expect(entry.learner_support).toContain("vi");
      expect(entry.learner_support).toContain("en");
      expect(entry.sample.gurmukhi).toMatch(GURMUKHI);
      expect(entry.sample.romanization.length).toBeGreaterThan(0);
      expect(entry.sample.vi.length).toBeGreaterThan(0);
      expect(entry.sample.en.length).toBeGreaterThan(0);
    }
  });

  it("includes readiness/checkpoint/routing style items", () => {
    const checkpoints = PUNJABI_FINAL_MODULE_REGISTRY.filter((entry) => entry.checkpoint_vi && entry.checkpoint_en);
    expect(checkpoints.length).toBeGreaterThanOrEqual(8);
    expect(PUNJABI_FINAL_REGISTRY_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_REGISTRY_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.modules.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_FINAL_MODULE_REGISTRY.filter((entry) => entry.learner_trap_vi && entry.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(6);
  });
});

describe("Punjabi final module registry - practical domains", () => {
  it("covers Canada-practical settlement/survival/work/health/school/public-service/review domains", () => {
    const domains = new Set(PUNJABI_FINAL_MODULE_REGISTRY.flatMap((entry) => entry.canada_domains));
    expect(domains.has("settlement")).toBe(true);
    expect(domains.has("survival")).toBe(true);
    expect(domains.has("work")).toBe(true);
    expect(domains.has("health")).toBe(true);
    expect(domains.has("school")).toBe(true);
    expect(domains.has("public_service")).toBe(true);
    expect(domains.has("review")).toBe(true);
  });

  it("lists the expected major Punjabi data modules", () => {
    const modules = PUNJABI_FINAL_MODULE_REGISTRY.map((entry) => entry.module).join(" ");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("skillDependencyGraph");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("integrationReadinessChecklist");
    expect(modules).toContain("preIntegrationCoverageMap");
  });
});

describe("Punjabi final module registry - no unrelated scripts", () => {
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
