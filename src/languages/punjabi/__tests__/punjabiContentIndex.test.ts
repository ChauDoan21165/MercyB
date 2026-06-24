// src/languages/punjabi/__tests__/punjabiContentIndex.test.ts
//
// Guards the Punjabi Wave 8 content index.

import { describe, expect, it } from "vitest";

import {
  PUNJABI_CONTENT_AREAS,
  PUNJABI_CONTENT_INDEX,
  PUNJABI_CONTENT_INDEX_LINKS,
  PUNJABI_CONTENT_INDEX_METADATA,
  PUNJABI_CONTENT_INDEX_ROOT,
  type PunjabiContentArea,
} from "../contentIndex";

const GURMUKHI = /[\u0A00-\u0A7F]/;
const SHAHMUKHI = /[\u0600-\u06FF]/;
const CJK = /[\u4E00-\u9FFF]/;
const HANGUL = /[\uAC00-\uD7AF]/;
const KANA = /[\u3040-\u30FF]/;
const CYRILLIC = /[\u0400-\u04FF]/;

const ALL_LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];
const REQUIRED_AREAS: PunjabiContentArea[] = [
  "levels",
  "script_path",
  "skill_area",
  "survival_domain",
  "workplace",
  "healthcare",
  "public_service",
  "review",
  "remediation",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(PUNJABI_CONTENT_INDEX_ROOT);
  return out;
}

describe("Punjabi content index - metadata", () => {
  it("is integration-ready Gurmukhi-primary metadata", () => {
    expect(PUNJABI_CONTENT_INDEX_METADATA.code).toBe("pa");
    expect(PUNJABI_CONTENT_INDEX_METADATA.name_pa).toMatch(GURMUKHI);
    expect(PUNJABI_CONTENT_INDEX_METADATA.primary_script).toBe("Gurmukhi");
    expect(PUNJABI_CONTENT_INDEX_METADATA.integration_ready).toBe(true);
  });

  it("declares native review deferred, Shahmukhi awareness-only, and no audio/scoring", () => {
    expect(PUNJABI_CONTENT_INDEX_METADATA.native_review_deferred).toBe(true);
    expect(PUNJABI_CONTENT_INDEX_METADATA.shahmukhi_awareness_only).toBe(true);
    expect(PUNJABI_CONTENT_INDEX_METADATA.no_audio_or_scoring).toBe(true);
    expect(PUNJABI_CONTENT_INDEX_METADATA.notes_en.join(" ").toLowerCase()).toContain("awareness-only");
    expect(PUNJABI_CONTENT_INDEX_METADATA.notes_en.join(" ").toLowerCase()).toContain("not claimed");
    expect(PUNJABI_CONTENT_INDEX_METADATA.notes_en.join(" ").toLowerCase()).toContain("no audio");
  });
});

describe("Punjabi content index - areas and entries", () => {
  it("declares all required content areas", () => {
    expect(new Set(PUNJABI_CONTENT_AREAS)).toEqual(new Set(REQUIRED_AREAS));
  });

  it("covers every required area with at least one entry", () => {
    const areas = new Set(PUNJABI_CONTENT_INDEX.map((entry) => entry.area));
    for (const area of REQUIRED_AREAS) expect(areas.has(area)).toBe(true);
  });

  it("covers A1-C2 across index entries", () => {
    const levels = new Set(PUNJABI_CONTENT_INDEX.flatMap((entry) => entry.levels));
    for (const level of ALL_LEVELS) expect(levels.has(level)).toBe(true);
  });

  it("keeps the index compact but useful", () => {
    expect(PUNJABI_CONTENT_INDEX.length).toBeGreaterThanOrEqual(10);
    expect(PUNJABI_CONTENT_INDEX.length).toBeLessThanOrEqual(20);
  });
});

describe("Punjabi content index - app-consumable bilingual data", () => {
  it("each entry has Gurmukhi, romanization, Vietnamese, English, entry points, and links", () => {
    for (const entry of PUNJABI_CONTENT_INDEX) {
      expect(entry.id.length).toBeGreaterThan(0);
      expect(entry.title_pa).toMatch(GURMUKHI);
      expect(entry.romanization.length).toBeGreaterThan(0);
      expect(entry.title_vi.length).toBeGreaterThan(0);
      expect(entry.title_en.length).toBeGreaterThan(0);
      expect(entry.summary_vi.length).toBeGreaterThan(0);
      expect(entry.summary_en.length).toBeGreaterThan(0);
      expect(entry.entry_points.length).toBeGreaterThan(0);
      expect(entry.linked_modules.length).toBeGreaterThan(0);
      expect(entry.sample.gurmukhi).toMatch(GURMUKHI);
      expect(entry.sample.romanization.length).toBeGreaterThan(0);
      expect(entry.sample.vi.length).toBeGreaterThan(0);
      expect(entry.sample.en.length).toBeGreaterThan(0);
    }
  });

  it("includes common learner traps where useful", () => {
    const traps = PUNJABI_CONTENT_INDEX.filter((entry) => entry.learner_trap_vi && entry.learner_trap_en);
    expect(traps.length).toBeGreaterThanOrEqual(7);
  });
});

describe("Punjabi content index - practical coverage and links", () => {
  it("indexes workplace, healthcare, public-service, survival, review, and remediation coverage", () => {
    const ids = PUNJABI_CONTENT_INDEX.map((entry) => entry.id).join(" ");
    expect(ids).toContain("workplace");
    expect(ids).toContain("healthcare");
    expect(ids).toContain("public-service");
    expect(ids).toContain("survival");
    expect(ids).toContain("review");
    expect(ids).toContain("remediation");
  });

  it("has Canada-practical entries across settlement/work/health/public-service contexts", () => {
    const canada = PUNJABI_CONTENT_INDEX.filter((entry) => entry.canada_practical);
    expect(canada.length).toBeGreaterThanOrEqual(6);
    const text = canada.map((entry) => `${entry.summary_en} ${entry.title_en}`).join(" ").toLowerCase();
    expect(text).toContain("canada");
    expect(text).toContain("work");
    expect(text).toContain("health");
    expect(text).toContain("public");
  });

  it("provides integration links for foundation, wave modules, and tests", () => {
    expect(PUNJABI_CONTENT_INDEX_LINKS.foundation).toContain("index");
    expect(PUNJABI_CONTENT_INDEX_LINKS.wave_modules).toContain("contentIndex");
    expect(PUNJABI_CONTENT_INDEX_LINKS.wave_modules).toContain("skillDependencyGraph");
    expect(PUNJABI_CONTENT_INDEX_LINKS.tests).toContain("punjabiContentIndex");
  });
});

describe("Punjabi content index - no unrelated scripts", () => {
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
