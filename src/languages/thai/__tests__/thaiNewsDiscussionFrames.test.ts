// Tests for the Thai news / public-discussion frames batch (A6 Wave 5) — TEXT ONLY.
//
// Pins the structural contract of newsDiscussionFrames.ts: count (40–80), full
// coverage of the ten discussion topics, bilingual VN+EN fields, Thai script in
// frame + example, and the use-case / example / note pedagogical fields. These
// are generic study frames — no current-news accuracy is asserted. Native review
// is deferred.

import { describe, it, expect } from "vitest";

import { newsDiscussionFrames } from "../newsDiscussionFrames";

const THAI = /[฀-๿]/;
const CATEGORIES = [
  "summarize_news",
  "cite_source",
  "express_uncertainty",
  "compare_views",
  "policy_issue",
  "social_topic",
  "economic_topic",
  "public_safety",
  "environment",
  "education",
] as const;

describe("Thai news frames — size & ids", () => {
  it("contains 40–80 frames", () => {
    expect(newsDiscussionFrames.length).toBeGreaterThanOrEqual(40);
    expect(newsDiscussionFrames.length).toBeLessThanOrEqual(80);
  });

  it("every id is unique and non-empty", () => {
    const ids = newsDiscussionFrames.map((f) => f.id);
    expect(ids.every((id) => typeof id === "string" && id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe("Thai news frames — category coverage", () => {
  it("every category is one of the ten target topics", () => {
    const set = new Set<string>(CATEGORIES);
    expect(newsDiscussionFrames.every((f) => set.has(f.category))).toBe(true);
  });

  it("covers all ten target topics", () => {
    const present = new Set(newsDiscussionFrames.map((f) => f.category));
    for (const cat of CATEGORIES) expect(present.has(cat)).toBe(true);
  });
});

describe("Thai news frames — bilingual + Thai-script contract", () => {
  it("every frame has Thai-script pattern + romanization + VN & EN gloss", () => {
    for (const f of newsDiscussionFrames) {
      expect(THAI.test(f.frame_th)).toBe(true);
      expect(f.frame_rom.trim().length).toBeGreaterThan(0);
      expect(f.frame_vi.trim().length).toBeGreaterThan(0);
      expect(f.frame_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has VN + EN use case and note", () => {
    for (const f of newsDiscussionFrames) {
      expect(f.use_case_vi.trim().length).toBeGreaterThan(0);
      expect(f.use_case_en.trim().length).toBeGreaterThan(0);
      expect(f.note_vi.trim().length).toBeGreaterThan(0);
      expect(f.note_en.trim().length).toBeGreaterThan(0);
    }
  });

  it("every frame has an example with Thai script, romanization, VN and EN", () => {
    for (const f of newsDiscussionFrames) {
      const ex = f.example;
      expect(THAI.test(ex.th)).toBe(true);
      expect(ex.rom.trim().length).toBeGreaterThan(0);
      expect(ex.vi.trim().length).toBeGreaterThan(0);
      expect(ex.en.trim().length).toBeGreaterThan(0);
    }
  });
});
