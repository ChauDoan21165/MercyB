// src/languages/punjabi/__tests__/punjabiFinalCanDoIndex.test.ts
//
// Guards the Punjabi Wave 12 final can-do index. This is not A11 integration.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_FINAL_CAN_DO_DOMAINS,
  PUNJABI_FINAL_CAN_DO_INDEX,
  PUNJABI_FINAL_CAN_DO_INDEX_ROOT,
  PUNJABI_FINAL_CAN_DO_ROUTES,
  PUNJABI_FINAL_CAN_DO_SCOPE,
  type PunjabiCanDoDomain,
} from "../finalCanDoIndex";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_DOMAINS: PunjabiCanDoDomain[] = [
  "script",
  "vocabulary",
  "grammar",
  "reading",
  "writing",
  "text_speaking_prompt",
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
  walk(PUNJABI_FINAL_CAN_DO_INDEX_ROOT);
  return out;
}

describe("Punjabi final can-do index - scope", () => {
  it("declares Wave 12 only, not A11 integration", () => {
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.wave).toBe("Wave 12");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.not_a11_integration).toBe(true);
  });

  it("declares Gurmukhi primary and Punjabi identity", () => {
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.code).toBe("pa");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.primary_script).toBe("Gurmukhi");
  });

  it("keeps Shahmukhi awareness-only and native review deferred", () => {
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_FINAL_CAN_DO_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });

  it("excludes audio/scoring/infrastructure/push/deploy", () => {
    const text = PUNJABI_FINAL_CAN_DO_SCOPE.excluded_en.toLowerCase();
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

describe("Punjabi final can-do index - coverage", () => {
  it("declares all requested can-do domains", () => {
    expect(new Set(PUNJABI_FINAL_CAN_DO_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));
  });

  it("has can-do entries for all requested domains", () => {
    const domains = new Set(PUNJABI_FINAL_CAN_DO_INDEX.map((item) => item.domain));
    for (const domain of REQUIRED_DOMAINS) expect(domains.has(domain)).toBe(true);
  });

  it("covers A1-C2 across entries", () => {
    const levels = new Set(PUNJABI_FINAL_CAN_DO_INDEX.map((item) => item.level));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the final index compact but useful", () => {
    expect(PUNJABI_FINAL_CAN_DO_INDEX.length).toBeGreaterThanOrEqual(12);
    expect(PUNJABI_FINAL_CAN_DO_INDEX.length).toBeLessThanOrEqual(20);
  });
});

describe("Punjabi final can-do index - item shape", () => {
  it("each item has app-consumable bilingual Gurmukhi-first data", () => {
    for (const item of PUNJABI_FINAL_CAN_DO_INDEX) {
      expect(item.id.length).toBeGreaterThan(0);
      expect(item.title_pa).toMatch(GURMUKHI);
      expect(item.romanization.length).toBeGreaterThan(0);
      expect(item.title_vi.length).toBeGreaterThan(0);
      expect(item.title_en.length).toBeGreaterThan(0);
      expect(item.can_do_vi.length).toBeGreaterThan(0);
      expect(item.can_do_en.length).toBeGreaterThan(0);
      expect(item.evidence_vi.length).toBeGreaterThan(0);
      expect(item.evidence_en.length).toBeGreaterThan(0);
      expect(item.sample.gurmukhi).toMatch(GURMUKHI);
      expect(item.sample.romanization.length).toBeGreaterThan(0);
      expect(item.sample.vi.length).toBeGreaterThan(0);
      expect(item.sample.en.length).toBeGreaterThan(0);
      expect(item.linked_modules.length).toBeGreaterThan(0);
    }
  });

  it("includes readiness/checkpoint/deferred status markers", () => {
    const statuses = new Set(PUNJABI_FINAL_CAN_DO_INDEX.map((item) => item.status));
    expect(statuses.has("ready")).toBe(true);
    expect(statuses.has("checkpoint")).toBe(true);
    expect(statuses.has("deferred")).toBe(true);
    const checkpoints = PUNJABI_FINAL_CAN_DO_INDEX.filter((item) => item.checkpoint_vi && item.checkpoint_en);
    expect(checkpoints.length).toBeGreaterThanOrEqual(10);
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_FINAL_CAN_DO_INDEX.filter((item) => item.learner_trap_vi && item.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(8);
  });

  it("keeps text speaking prompts text-only without scoring claims", () => {
    const prompt = PUNJABI_FINAL_CAN_DO_INDEX.find((item) => item.domain === "text_speaking_prompt");
    expect(prompt).toBeDefined();
    const text = `${prompt?.can_do_en} ${prompt?.evidence_en} ${prompt?.checkpoint_en} ${prompt?.learner_trap_en}`.toLowerCase();
    expect(text).toContain("text");
    expect(text).toContain("no recording");
    expect(text).toContain("no pronunciation scoring");
  });
});

describe("Punjabi final can-do index - practical readiness", () => {
  it("includes Canada-practical examples across real domains", () => {
    const canadaItems = PUNJABI_FINAL_CAN_DO_INDEX.filter((item) => item.canada_practical);
    expect(canadaItems.length).toBeGreaterThanOrEqual(8);
    const text = canadaItems.map((item) => item.canada_practical).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public service");
    expect(text).toContain("school");
  });

  it("defines learner routes for new, Canada-practical, and advanced readiness", () => {
    expect(PUNJABI_FINAL_CAN_DO_ROUTES.length).toBeGreaterThanOrEqual(3);
    for (const route of PUNJABI_FINAL_CAN_DO_ROUTES) {
      expect(route.vi.length).toBeGreaterThan(0);
      expect(route.en.length).toBeGreaterThan(0);
      expect(route.item_ids.length).toBeGreaterThan(0);
    }
  });
});

describe("Punjabi final can-do index - no unrelated scripts", () => {
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
