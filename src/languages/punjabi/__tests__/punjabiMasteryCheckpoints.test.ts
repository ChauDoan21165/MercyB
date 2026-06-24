// src/languages/punjabi/__tests__/punjabiMasteryCheckpoints.test.ts
//
// Guards the Punjabi Wave 6 mastery checkpoints.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_MASTERY,
  PUNJABI_MASTERY_CHECKPOINTS,
  PUNJABI_MASTERY_DOMAINS,
  PUNJABI_MASTERY_LEVEL_SUMMARY,
  PUNJABI_MASTERY_SCOPE,
  type PunjabiMasteryDomain,
} from "../masteryCheckpoints";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_DOMAINS: PunjabiMasteryDomain[] = [
  "script",
  "vocabulary",
  "grammar",
  "speaking_prompt",
  "reading",
  "writing",
  "survival",
  "workplace",
  "healthcare",
  "public_service",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_MASTERY);
  return out;
}

describe("Punjabi mastery checkpoints - CEFR and domains", () => {
  it("has a summary for every CEFR level", () => {
    expect(PUNJABI_MASTERY_LEVEL_SUMMARY.map((item) => item.level)).toEqual(ALL_LEVELS);
    for (const item of PUNJABI_MASTERY_LEVEL_SUMMARY) {
      expect(item.vi.length).toBeGreaterThan(0);
      expect(item.en.length).toBeGreaterThan(0);
    }
  });

  it("declares all required readiness domains", () => {
    expect(new Set(PUNJABI_MASTERY_DOMAINS)).toEqual(new Set(REQUIRED_DOMAINS));
  });

  it("covers A1-C2 with checkpoint entries", () => {
    const levels = new Set(PUNJABI_MASTERY_CHECKPOINTS.map((checkpoint) => checkpoint.level));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("covers script, vocabulary, grammar, speaking-safe prompts, reading, writing, survival, workplace, healthcare, and public service", () => {
    const domains = new Set(PUNJABI_MASTERY_CHECKPOINTS.map((checkpoint) => checkpoint.domain));
    for (const domain of REQUIRED_DOMAINS) expect(domains.has(domain)).toBe(true);
  });
});

describe("Punjabi mastery checkpoints - app-consumable bilingual data", () => {
  it("each checkpoint has Gurmukhi primary, romanization, VI, and EN", () => {
    for (const checkpoint of PUNJABI_MASTERY_CHECKPOINTS) {
      expect(checkpoint.id.length).toBeGreaterThan(0);
      expect(checkpoint.title_pa).toMatch(GURMUKHI);
      expect(checkpoint.romanization.length).toBeGreaterThan(0);
      expect(checkpoint.title_vi.length).toBeGreaterThan(0);
      expect(checkpoint.title_en.length).toBeGreaterThan(0);
      expect(checkpoint.readiness_vi.length).toBeGreaterThan(0);
      expect(checkpoint.readiness_en.length).toBeGreaterThan(0);
      expect(checkpoint.evidence_vi.length).toBeGreaterThan(0);
      expect(checkpoint.evidence_en.length).toBeGreaterThan(0);
      expect(checkpoint.prompt.gurmukhi).toMatch(GURMUKHI);
      expect(checkpoint.prompt.romanization.length).toBeGreaterThan(0);
      expect(checkpoint.prompt.vi.length).toBeGreaterThan(0);
      expect(checkpoint.prompt.en.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_MASTERY_CHECKPOINTS.filter((checkpoint) => checkpoint.learner_trap_vi && checkpoint.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(10);
  });
});

describe("Punjabi mastery checkpoints - Canada and speaking-safe scope", () => {
  it("includes Canada-practical readiness across settlement, work, healthcare, and public service", () => {
    const canada = PUNJABI_MASTERY_CHECKPOINTS.filter((checkpoint) => checkpoint.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(6);
    const text = canada.map((checkpoint) => `${checkpoint.readiness_en} ${checkpoint.evidence_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("clinic");
    expect(text).toContain("public-service");
  });

  it("keeps speaking practice text-safe without audio or scoring", () => {
    const speaking = PUNJABI_MASTERY_CHECKPOINTS.find((checkpoint) => checkpoint.domain === "speaking_prompt");
    expect(speaking).toBeTruthy();
    expect(`${speaking!.readiness_en} ${speaking!.evidence_en} ${speaking!.learner_trap_en}`.toLowerCase()).toContain("text");
    expect(`${PUNJABI_MASTERY_SCOPE.audio_en}`.toLowerCase()).toContain("no audio");
    expect(`${PUNJABI_MASTERY_SCOPE.audio_en}`.toLowerCase()).toContain("pronunciation scoring");
  });
});

describe("Punjabi mastery checkpoints - script and review honesty", () => {
  it("declares Gurmukhi primary and Shahmukhi awareness-only", () => {
    expect(PUNJABI_MASTERY.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_MASTERY.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_MASTERY_SCOPE.script_note_en.toLowerCase()).toContain("shahmukhi");
    expect(PUNJABI_MASTERY_SCOPE.script_note_en.toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_MASTERY_SCOPE.script_note_en.toLowerCase()).toContain("not a full course");
  });

  it("states native review is deferred without claiming native review", () => {
    expect(PUNJABI_MASTERY_SCOPE.native_review_en.toLowerCase()).toContain("deferred");
    expect(PUNJABI_MASTERY_SCOPE.native_review_en.toLowerCase()).toContain("not claimed");
  });
});

describe("Punjabi mastery checkpoints - no unrelated scripts", () => {
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
