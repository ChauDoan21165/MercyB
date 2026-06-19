// src/languages/thai/__tests__/thaiPublicRoadmap.test.ts
//
// Guards the Thai public roadmap metadata. Proves:
//   • every required module is present (foundation, A1–C2, survival, vocab,
//     tones, dialogues, reading, writing, speaking, placement, review, emergency),
//   • each module has a valid status + VI/EN descriptions,
//   • all three status values are represented honestly,
//   • the three non-negotiable disclaimers (native review deferred, no audio/
//     scoring, no certification claim) are present in VI + EN,
//   • Thai endonym is in Thai script, with NO CJK / Hangul / kana / Cyrillic
//     assumptions anywhere.

import { describe, it, expect } from "vitest";

import {
  THAI_PUBLIC_ROADMAP,
  THAI_ROADMAP_MODULES,
  THAI_ROADMAP_DISCLAIMERS,
  type ThaiRoadmapModuleKey,
  type ThaiRoadmapStatus,
} from "../publicRoadmap";

const THAI = /[฀-๿]/;
const CJK = /[一-鿿]/;
const HANGUL = /[가-힣]/;
const KANA = /[぀-ヿ]/;
const CYRILLIC = /[Ѐ-ӿ]/;

const REQUIRED_MODULES: ThaiRoadmapModuleKey[] = [
  "foundation",
  "a1",
  "a2",
  "b1",
  "b2",
  "c1",
  "c2",
  "survival",
  "vocab",
  "tones",
  "dialogues",
  "reading",
  "writing",
  "speaking",
  "placement",
  "review",
  "emergency",
];

const VALID_STATUS: ThaiRoadmapStatus[] = [
  "available",
  "study_support_only",
  "needs_native_review",
];

function allStrings(): string[] {
  const out: string[] = [];
  const walk = (v: unknown): void => {
    if (typeof v === "string") out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") Object.values(v).forEach(walk);
  };
  walk(THAI_PUBLIC_ROADMAP);
  return out;
}

describe("Thai public roadmap — modules", () => {
  it("includes every required module", () => {
    const keys = new Set(THAI_ROADMAP_MODULES.map((m) => m.key));
    for (const k of REQUIRED_MODULES) expect(keys.has(k)).toBe(true);
  });

  it("module keys are unique", () => {
    const keys = THAI_ROADMAP_MODULES.map((m) => m.key);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("each module has a valid status and VI + EN descriptions", () => {
    for (const m of THAI_ROADMAP_MODULES) {
      expect(VALID_STATUS).toContain(m.status);
      expect(m.title_vi.length).toBeGreaterThan(0);
      expect(m.title_en.length).toBeGreaterThan(0);
      expect(m.desc_vi.length).toBeGreaterThan(0);
      expect(m.desc_en.length).toBeGreaterThan(0);
      expect(typeof m.needsNativeReview).toBe("boolean");
    }
  });

  it("everything still needs native review (honest default)", () => {
    for (const m of THAI_ROADMAP_MODULES) {
      expect(m.needsNativeReview).toBe(true);
    }
  });

  it("represents both available and study-support-only states", () => {
    const statuses = new Set(THAI_ROADMAP_MODULES.map((m) => m.status));
    expect(statuses.has("available")).toBe(true);
    expect(statuses.has("study_support_only")).toBe(true);
  });

  it("marks the A1 foundation as available", () => {
    const a1 = THAI_ROADMAP_MODULES.find((m) => m.key === "a1")!;
    expect(a1.status).toBe("available");
  });
});

describe("Thai public roadmap — disclaimers", () => {
  it("carries the three non-negotiable disclaimers", () => {
    const keys = new Set(THAI_ROADMAP_DISCLAIMERS.map((d) => d.key));
    expect(keys.has("native_review_deferred")).toBe(true);
    expect(keys.has("no_audio_or_scoring")).toBe(true);
    expect(keys.has("no_certification")).toBe(true);
  });

  it("each disclaimer has VI + EN text", () => {
    for (const d of THAI_ROADMAP_DISCLAIMERS) {
      expect(d.text_vi.length).toBeGreaterThan(0);
      expect(d.text_en.length).toBeGreaterThan(0);
    }
  });

  it("the EN disclaimers actually mention the key caveats", () => {
    const en = THAI_ROADMAP_DISCLAIMERS.map((d) => d.text_en.toLowerCase()).join(" ");
    expect(en).toContain("native review");
    expect(en).toContain("audio");
    expect(en).toContain("pronunciation");
    expect(en).toContain("certification");
  });
});

describe("Thai public roadmap — no CJK/Hangul/Japanese/Russian assumptions", () => {
  const strings = allStrings();

  it("contains no Chinese/Japanese kanji", () => {
    for (const s of strings) expect(s).not.toMatch(CJK);
  });
  it("contains no Korean Hangul", () => {
    for (const s of strings) expect(s).not.toMatch(HANGUL);
  });
  it("contains no Japanese kana", () => {
    for (const s of strings) expect(s).not.toMatch(KANA);
  });
  it("contains no Cyrillic (Russian etc.)", () => {
    for (const s of strings) expect(s).not.toMatch(CYRILLIC);
  });

  it("declares the Thai endonym in Thai script", () => {
    expect(THAI_PUBLIC_ROADMAP.name_th).toMatch(THAI);
  });
});
