// src/languages/punjabi/__tests__/punjabiFinalContentManifest.test.ts
//
// Guards the Punjabi Wave 18 final content manifest. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_CONTENT_MANIFEST,
  PUNJABI_FINAL_CONTENT_MANIFEST_DOMAINS,
  PUNJABI_FINAL_CONTENT_MANIFEST_ROOT,
  PUNJABI_FINAL_CONTENT_MANIFEST_ROUTES,
  PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE,
  type PunjabiManifestDomain,
} from "../finalContentManifest";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_DOMAINS: PunjabiManifestDomain[] = [
  "level_map",
  "module_inventory",
  "skill_domain",
  "gurmukhi_support",
  "learner_support",
  "canada_domain",
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
  walk(PUNJABI_FINAL_CONTENT_MANIFEST_ROOT);
  return out;
}

describe("Punjabi final content manifest - scope", () => {
  it("declares Wave 18 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.wave).toBe("Wave 18");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_CONTENT_MANIFEST_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final content manifest - coverage", () => {
  it("declares all requested manifest domains", () => {
    expect(new Set(PUNJABI_FINAL_CONTENT_MANIFEST_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));
  });

  it("has entries for all requested domains", () => {
    const domains = new Set(PUNJABI_FINAL_CONTENT_MANIFEST.map((entry) => entry.domain));
    for (const domain of REQUIRED_DOMAINS) expect(domains.has(domain)).toBe(true);
  });

  it("covers A1-C2 across entries", () => {
    const levels = new Set(PUNJABI_FINAL_CONTENT_MANIFEST.flatMap((entry) => entry.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final manifest compact but useful", () => {
    expect(PUNJABI_FINAL_CONTENT_MANIFEST.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_CONTENT_MANIFEST.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final content manifest - entry shape", () => {
  it("each entry has app-consumable bilingual Gurmukhi-first data", () => {
    for (const entry of PUNJABI_FINAL_CONTENT_MANIFEST) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.title_vi.length).toBeGreaterThan(0);
      expect(entry.title_en.length).toBeGreaterThan(0);
      expect(entry.manifest_vi.length).toBeGreaterThan(0);
      expect(entry.manifest_en.length).toBeGreaterThan(0);
      expect(entry.integration_signal_vi.length).toBeGreaterThan(0);
      expect(entry.integration_signal_en.length).toBeGreaterThan(0);
      expect(entry.sample.gurmukhi).toMatch(GURMUKHI);
      expect(entry.sample.romanization.length).toBeGreaterThan(0);
      expect(entry.sample.vi.length).toBeGreaterThan(0);
      expect(entry.sample.en.length).toBeGreaterThan(0);
      expect(entry.modules.length).toBeGreaterThan(0);
      expect(entry.skill_domains.length).toBeGreaterThan(0);
      expect(entry.review_tags.length).toBeGreaterThan(0);
    }
  });

  it("includes golden-sample/final-QA/integration-readiness style status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_CONTENT_MANIFEST.map((entry) => entry.status));
    expect(statuses.has("ready_for_later_integration")).toBe(true);
    expect(statuses.has("manual_review_needed")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const traps = PUNJABI_FINAL_CONTENT_MANIFEST.filter((entry) => entry.learner_trap_vi && entry.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("references the expected Punjabi modules", () => {
    const modules = PUNJABI_FINAL_CONTENT_MANIFEST.flatMap((entry) => entry.modules).join(" ");
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
    expect(modules).toContain("finalQualityGates");
    expect(modules).toContain("finalContentManifest");
  });
});

describe("Punjabi final content manifest - practical and boundary checks", () => {
  it("covers key skill domains and Canada-practical examples", () => {
    const skillText = PUNJABI_FINAL_CONTENT_MANIFEST.flatMap((entry) => entry.skill_domains).join(" ").toLowerCase();
    expect(skillText).toContain("script");
    expect(skillText).toContain("grammar");
    expect(skillText).toContain("reading");
    expect(skillText).toContain("writing");
    expect(skillText).toContain("public_service");
    expect(skillText).toContain("healthcare");
    const canada = PUNJABI_FINAL_CONTENT_MANIFEST.filter((entry) => entry.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const canadaText = canada.map((entry) => `${entry.canada_practical} ${entry.manifest_en}`).join(" ").toLowerCase();
    expect(canadaText).toContain("canada");
    expect(canadaText).toContain("work");
    expect(canadaText).toContain("clinic");
    expect(canadaText).toContain("public service");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const entry = PUNJABI_FINAL_CONTENT_MANIFEST.find((item) => item.id === "manifest-forbidden-claims");
    expect(entry).toBeDefined();
    const text = `${entry?.manifest_en} ${entry?.integration_signal_en} ${entry?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("text-only");
    expect(text).toContain("microphone");
  });

  it("guards native-review and A11 boundaries", () => {
    const text = PUNJABI_FINAL_CONTENT_MANIFEST.map((entry) => `${entry.manifest_en} ${entry.integration_signal_en} ${entry.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("not claimed");
    expect(text).toContain("does not run a11");
    expect(text).toContain("not main ui integration");
  });

  it("defines manifest routes for coverage, Canada/golden samples, and final boundaries", () => {
    expect(PUNJABI_FINAL_CONTENT_MANIFEST_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_CONTENT_MANIFEST_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.entry_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final content manifest - no unrelated scripts", () => {
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
