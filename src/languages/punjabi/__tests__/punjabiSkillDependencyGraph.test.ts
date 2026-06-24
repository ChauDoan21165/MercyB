// src/languages/punjabi/__tests__/punjabiSkillDependencyGraph.test.ts
//
// Guards the Punjabi Wave 7 skill dependency graph.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_REMEDIATION_PATHS,
  PUNJABI_SKILL_DEPENDENCY_GRAPH,
  PUNJABI_SKILL_EDGES,
  PUNJABI_SKILL_GRAPH_SCOPE,
  PUNJABI_SKILL_NODES,
  type PunjabiSkillNodeKind,
} from "../skillDependencyGraph";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const REQUIRED_KINDS: PunjabiSkillNodeKind[] = [
  "script",
  "vocabulary",
  "grammar",
  "register",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
  "remediation",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_SKILL_DEPENDENCY_GRAPH);
  return out;
}

describe("Punjabi skill dependency graph - nodes", () => {
  it("declares a useful compact node set", () => {
    expect(PUNJABI_SKILL_NODES.length).toBeGreaterThanOrEqual(12);
    expect(PUNJABI_SKILL_NODES.length).toBeLessThanOrEqual(24);
  });

  it("covers required skill kinds", () => {
    const kinds = new Set(PUNJABI_SKILL_NODES.map((node) => node.kind));
    for (const kind of REQUIRED_KINDS) expect(kinds.has(kind)).toBe(true);
  });

  it("each node has Gurmukhi, romanization, Vietnamese, English, and an example", () => {
    for (const node of PUNJABI_SKILL_NODES) {
      expect(node.id.length).toBeGreaterThan(0);
      expect(node.title_pa).toMatch(GURMUKHI);
      expect(node.romanization.length).toBeGreaterThan(0);
      expect(node.title_vi.length).toBeGreaterThan(0);
      expect(node.title_en.length).toBeGreaterThan(0);
      expect(node.learner_value_vi.length).toBeGreaterThan(0);
      expect(node.learner_value_en.length).toBeGreaterThan(0);
      expect(node.example.gurmukhi).toMatch(GURMUKHI);
      expect(node.example.romanization.length).toBeGreaterThan(0);
      expect(node.example.vi.length).toBeGreaterThan(0);
      expect(node.example.en.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const trapNodes = PUNJABI_SKILL_NODES.filter((node) => node.common_trap_vi && node.common_trap_en);
    expect(trapNodes.length).toBeGreaterThanOrEqual(8);
  });
});

describe("Punjabi skill dependency graph - edges", () => {
  it("links only real node ids", () => {
    const ids = new Set(PUNJABI_SKILL_NODES.map((node) => node.id));
    for (const edge of PUNJABI_SKILL_EDGES) {
      expect(ids.has(edge.from)).toBe(true);
      expect(ids.has(edge.to)).toBe(true);
      expect(edge.reason_vi.length).toBeGreaterThan(0);
      expect(edge.reason_en.length).toBeGreaterThan(0);
    }
  });

  it("uses dependency and remediation relations", () => {
    const relations = new Set(PUNJABI_SKILL_EDGES.map((edge) => edge.relation));
    expect(relations.has("unlocks")).toBe(true);
    expect(relations.has("supports")).toBe(true);
    expect(relations.has("requires")).toBe(true);
    expect(relations.has("remediates")).toBe(true);
    expect(relations.has("prepares_for")).toBe(true);
  });
});

describe("Punjabi skill dependency graph - remediation and Canada readiness", () => {
  it("has remediation paths that reference real nodes", () => {
    const ids = new Set(PUNJABI_SKILL_NODES.map((node) => node.id));
    expect(PUNJABI_REMEDIATION_PATHS.length).toBeGreaterThanOrEqual(3);
    for (const path of PUNJABI_REMEDIATION_PATHS) {
      expect(path.trigger_vi.length).toBeGreaterThan(0);
      expect(path.trigger_en.length).toBeGreaterThan(0);
      expect(path.outcome_vi.length).toBeGreaterThan(0);
      expect(path.outcome_en.length).toBeGreaterThan(0);
      for (const step of path.steps) expect(ids.has(step)).toBe(true);
    }
  });

  it("includes Canada-practical nodes for settlement, work, healthcare, and public-service readiness", () => {
    const canada = PUNJABI_SKILL_NODES.filter((node) => node.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(6);
    const text = canada.map((node) => `${node.learner_value_en} ${node.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public");
  });
});

describe("Punjabi skill dependency graph - scope honesty", () => {
  it("declares Gurmukhi primary and Shahmukhi awareness-only", () => {
    expect(PUNJABI_SKILL_DEPENDENCY_GRAPH.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_SKILL_DEPENDENCY_GRAPH.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_SKILL_GRAPH_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.script_note_en.toLowerCase()).toContain("not a full");
  });

  it("states native review is deferred and excludes audio/scoring/infrastructure work", () => {
    expect(PUNJABI_SKILL_GRAPH_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.audio_en.toLowerCase()).toContain("no audio");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.audio_en.toLowerCase()).toContain("pronunciation scoring");
    expect(PUNJABI_SKILL_GRAPH_SCOPE.audio_en.toLowerCase()).toContain("supabase");
  });
});

describe("Punjabi skill dependency graph - no unrelated scripts", () => {
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
