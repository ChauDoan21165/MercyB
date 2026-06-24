// src/languages/punjabi/__tests__/punjabiPreIntegrationCoverageMap.test.ts
//
// Guards the Punjabi Wave 10 pre-integration coverage map.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_PRE_INTEGRATION_COVERAGE,
  PUNJABI_PRE_INTEGRATION_COVERAGE_MAP,
  PUNJABI_PRE_INTEGRATION_DOMAINS,
  PUNJABI_PRE_INTEGRATION_SCOPE,
  PUNJABI_PRE_INTEGRATION_SUMMARY,
  type PunjabiCoverageDomain,
} from "../preIntegrationCoverageMap";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_DOMAINS: PunjabiCoverageDomain[] = [
  "module",
  "skill",
  "gurmukhi_path",
  "vi_en_support",
  "canada_survival",
  "work",
  "health",
  "school",
  "public_service",
  "capstone",
  "deferred_review",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_PRE_INTEGRATION_COVERAGE_MAP);
  return out;
}

describe("Punjabi pre-integration coverage - scope", () => {
  it("declares Gurmukhi primary and later-A11 purpose", () => {
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.code).toBe("pa");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.purpose_en.toLowerCase()).toContain("later a11");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.purpose_en.toLowerCase()).toContain("does not run a11");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.shahmukhi_en.toLowerCase()).toContain("awareness only");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.shahmukhi_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_PRE_INTEGRATION_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio, scoring, infrastructure, push, and deploy", () => {
    const text = PUNJABI_PRE_INTEGRATION_SCOPE.no_infra_en.toLowerCase();
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

describe("Punjabi pre-integration coverage - domain and level coverage", () => {
  it("declares all required coverage domains", () => {
    expect(new Set(PUNJABI_PRE_INTEGRATION_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));
  });

  it("has at least one coverage item for every required domain", () => {
    const domains = new Set(PUNJABI_PRE_INTEGRATION_COVERAGE.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) expect(domains.has(domain)).toBe(true);
  });

  it("covers A1-C2 across the map", () => {
    const levels = new Set(PUNJABI_PRE_INTEGRATION_COVERAGE.flatMap((item) => item.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
    expect(PUNJABI_PRE_INTEGRATION_SUMMARY.all_levels).toEqual(ALL_LEVELS);
  });

  it("keeps the coverage map compact but useful", () => {
    expect(PUNJABI_PRE_INTEGRATION_COVERAGE.length).toBeGreaterThanOrEqual(11);
    expect(PUNJABI_PRE_INTEGRATION_COVERAGE.length).toBeLessThanOrEqual(18);
  });
});

describe("Punjabi pre-integration coverage - item data", () => {
  it("each item has app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_PRE_INTEGRATION_COVERAGE) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.coverage_vi.length).toBeGreaterThan(0);
      expect(item.coverage_en.length).toBeGreaterThan(0);
      expect(item.modules.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_PRE_INTEGRATION_COVERAGE.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
  });

  it("includes capstone/checkpoint style items", () => {
    const checkpoints = PUNJABI_PRE_INTEGRATION_COVERAGE.filter((item) => item.checkpoint_vi && item.checkpoint_en);
    expect(checkpoints.length).toBeGreaterThanOrEqual(8);
    expect(PUNJABI_PRE_INTEGRATION_COVERAGE.some((item) => item.status === "capstone_ready")).toBe(true);
  });
});

describe("Punjabi pre-integration coverage - practical coverage", () => {
  it("covers Canada survival, work, health, school, and public-service contexts", () => {
    const text = PUNJABI_PRE_INTEGRATION_COVERAGE
      .map((item) => `${item.domain} ${item.coverage_en} ${item.title_en}`)
      .join(" ")
      .toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("health");
    expect(text).toContain("school");
    expect(text).toContain("public");
  });

  it("marks Canada-practical items with examples", () => {
    const canada = PUNJABI_PRE_INTEGRATION_COVERAGE.filter((item) => item.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(5);
    for (const item of canada) expect(item.sample.gurmukhi).toMatch(GURMUKHI);
  });

  it("lists known deferred items", () => {
    expect(PUNJABI_PRE_INTEGRATION_SUMMARY.deferred).toContain("native_review");
    expect(PUNJABI_PRE_INTEGRATION_SUMMARY.deferred).toContain("audio");
    expect(PUNJABI_PRE_INTEGRATION_SUMMARY.deferred).toContain("pronunciation_scoring");
    expect(PUNJABI_PRE_INTEGRATION_SUMMARY.deferred).toContain("full_shahmukhi");
  });
});

describe("Punjabi pre-integration coverage - no unrelated scripts", () => {
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
