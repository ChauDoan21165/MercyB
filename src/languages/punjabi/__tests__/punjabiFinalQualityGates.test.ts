// src/languages/punjabi/__tests__/punjabiFinalQualityGates.test.ts
//
// Guards the Punjabi Wave 17 final quality gates. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_QUALITY_GATE_AREAS,
  PUNJABI_FINAL_QUALITY_GATE_SEQUENCE,
  PUNJABI_FINAL_QUALITY_GATES,
  PUNJABI_FINAL_QUALITY_GATES_ROOT,
  PUNJABI_FINAL_QUALITY_GATES_SCOPE,
  type PunjabiQualityGateArea,
} from "../finalQualityGates";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiQualityGateArea[] = [
  "content_coverage",
  "gurmukhi_first",
  "vi_en_support",
  "canada_practical",
  "native_review_deferred",
  "forbidden_claims",
  "remediation_readiness",
  "later_integration_boundary",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_FINAL_QUALITY_GATES_ROOT);
  return out;
}

describe("Punjabi final quality gates - scope", () => {
  it("declares Wave 17 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.wave).toBe("Wave 17");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_QUALITY_GATES_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_QUALITY_GATES_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final quality gates - coverage", () => {
  it("declares all requested quality gate areas", () => {
    expect(new Set(PUNJABI_FINAL_QUALITY_GATE_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("has gates for all requested areas", () => {
    const areas = new Set(PUNJABI_FINAL_QUALITY_GATES.map((gate) => gate.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across gates", () => {
    const levels = new Set(PUNJABI_FINAL_QUALITY_GATES.flatMap((gate) => gate.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final quality gates compact but useful", () => {
    expect(PUNJABI_FINAL_QUALITY_GATES.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_FINAL_QUALITY_GATES.length).toBeLessThanOrEqual(16);
  });
});

describe("Punjabi final quality gates - gate shape", () => {
  it("each gate has app-consumable bilingual Gurmukhi-first data", () => {
    for (const gate of PUNJABI_FINAL_QUALITY_GATES) {
      expect(gate.id.length).toBeGreaterThan(0);
      expect(gate.title_pa).toMatch(GURMUKHI);
      expect(gate.romanization.length).toBeGreaterThan(0);
      expect(gate.title_vi.length).toBeGreaterThan(0);
      expect(gate.title_en.length).toBeGreaterThan(0);
      expect(gate.gate_vi.length).toBeGreaterThan(0);
      expect(gate.gate_en.length).toBeGreaterThan(0);
      expect(gate.pass_signal_vi.length).toBeGreaterThan(0);
      expect(gate.pass_signal_en.length).toBeGreaterThan(0);
      expect(gate.sample.gurmukhi).toMatch(GURMUKHI);
      expect(gate.sample.romanization.length).toBeGreaterThan(0);
      expect(gate.sample.vi.length).toBeGreaterThan(0);
      expect(gate.sample.en.length).toBeGreaterThan(0);
      expect(gate.modules_checked.length).toBeGreaterThan(0);
      expect(gate.review_actions.length).toBeGreaterThan(0);
    }
  });

  it("includes final-quality/review/remediation/readiness status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_QUALITY_GATES.map((gate) => gate.status));
    expect(statuses.has("pass_ready")).toBe(true);
    expect(statuses.has("manual_review")).toBe(true);
    expect(statuses.has("deferred_boundary")).toBe(true);
    const traps = PUNJABI_FINAL_QUALITY_GATES.filter((gate) => gate.learner_trap_vi && gate.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });

  it("references the expected Punjabi review modules", () => {
    const modules = PUNJABI_FINAL_QUALITY_GATES.flatMap((gate) => gate.modules_checked).join(" ");
    expect(modules).toContain("index");
    expect(modules).toContain("lessons");
    expect(modules).toContain("dialogues");
    expect(modules).toContain("courseMap");
    expect(modules).toContain("learningPath");
    expect(modules).toContain("progressionMatrix");
    expect(modules).toContain("masteryCheckpoints");
    expect(modules).toContain("skillDependencyGraph");
    expect(modules).toContain("contentIndex");
    expect(modules).toContain("integrationReadinessChecklist");
    expect(modules).toContain("finalModuleRegistry");
    expect(modules).toContain("finalCanDoIndex");
    expect(modules).toContain("finalQaInventory");
    expect(modules).toContain("preMrAuditChecklist");
    expect(modules).toContain("finalNavigationMap");
    expect(modules).toContain("finalQualityGates");
  });
});

describe("Punjabi final quality gates - practical and boundary checks", () => {
  it("includes Canada-practical gates for survival/work/health/public service", () => {
    const canada = PUNJABI_FINAL_QUALITY_GATES.filter((gate) => gate.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(2);
    const text = canada.map((gate) => `${gate.title_en} ${gate.canada_practical} ${gate.pass_signal_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("survival");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
  });

  it("guards no audio/pronunciation scoring claims", () => {
    const gate = PUNJABI_FINAL_QUALITY_GATES.find((entry) => entry.id === "gate-no-audio-scoring");
    expect(gate).toBeDefined();
    const text = `${gate?.gate_en} ${gate?.pass_signal_en} ${gate?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("audio");
    expect(text).toContain("pronunciation scoring");
    expect(text).toContain("azure");
    expect(text).toContain("text-only");
  });

  it("guards native-review and later-integration boundaries", () => {
    const text = PUNJABI_FINAL_QUALITY_GATES.map((gate) => `${gate.gate_en} ${gate.pass_signal_en} ${gate.learner_trap_en}`).join(" ").toLowerCase();
    expect(text).toContain("native review is deferred");
    expect(text).toContain("not claimed");
    expect(text).toContain("does not run a11 integration");
    expect(text).toContain("not a release or deploy");
  });

  it("defines review sequence for coverage, learner support, and boundaries", () => {
    expect(PUNJABI_FINAL_QUALITY_GATE_SEQUENCE.length).toBeGreaterThanOrEqual(3);
    for (const step of PUNJABI_FINAL_QUALITY_GATE_SEQUENCE) {
      expect(step.vi.length).toBeGreaterThan(0);
      expect(step.en.length).toBeGreaterThan(0);
      expect(step.gate_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final quality gates - no unrelated scripts", () => {
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
