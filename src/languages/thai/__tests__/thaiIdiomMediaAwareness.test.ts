// Thai idiom & media-awareness pack — structural, coverage, and safety guards.
//
// These tests pin the SHAPE and completeness of the pack, not its linguistic
// correctness (native review is deferred). They guard: count (40–80), category
// coverage, the five required parts per entry (phrase / literal / practical /
// safe-usage / example), Thai script on every phrase and example, bilingual
// fields, and the not-native-certified / no-stereotype framing.

import { describe, it, expect } from "vitest";

import {
  entries,
  entriesByCategory,
  CATEGORY_ORDER,
  IDIOM_MEDIA_DISCLAIMER,
  type IdiomCategory,
} from "@/languages/thai/idiomMediaAwareness";

const THAI_RANGE = /[฀-๿]/;
const hasThai = (s: string) => THAI_RANGE.test(s);

const REQUIRED_CATEGORIES: IdiomCategory[] = [
  "classic_idiom",
  "proverb",
  "colloquial_expression",
  "media_slang",
  "internet_social",
];

describe("Thai idiom/media — batch size & coverage", () => {
  it("contains 40–80 entries", () => {
    expect(entries.length).toBeGreaterThanOrEqual(40);
    expect(entries.length).toBeLessThanOrEqual(80);
  });

  it("covers every required category at least once", () => {
    const seen = new Set(entries.map((e) => e.category));
    for (const c of REQUIRED_CATEGORIES) {
      expect(seen.has(c), `missing category: ${c}`).toBe(true);
    }
  });

  it("CATEGORY_ORDER lists exactly the required categories", () => {
    expect([...CATEGORY_ORDER].sort()).toEqual([...REQUIRED_CATEGORIES].sort());
  });

  it("entriesByCategory returns only matching entries", () => {
    for (const c of REQUIRED_CATEGORIES) {
      const subset = entriesByCategory(c);
      expect(subset.length).toBeGreaterThan(0);
      expect(subset.every((e) => e.category === c)).toBe(true);
    }
  });
});

describe("Thai idiom/media — per-entry integrity", () => {
  it("ids are unique and non-empty", () => {
    const ids = entries.map((e) => e.id);
    expect(ids.every((id) => id.length > 0)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each entry has all five required parts, bilingual", () => {
    for (const e of entries) {
      // phrase (Thai + romanization)
      expect(e.phrase.thai.length, `${e.id} phrase.thai`).toBeGreaterThan(0);
      expect(e.phrase.rtgs.length, `${e.id} phrase.rtgs`).toBeGreaterThan(0);
      // literal meaning
      expect(e.literal_vi.length, `${e.id} literal_vi`).toBeGreaterThan(0);
      expect(e.literal_en.length, `${e.id} literal_en`).toBeGreaterThan(0);
      // practical meaning
      expect(e.practical_vi.length, `${e.id} practical_vi`).toBeGreaterThan(0);
      expect(e.practical_en.length, `${e.id} practical_en`).toBeGreaterThan(0);
      // safe usage note
      expect(e.safe_usage_vi.length, `${e.id} safe_usage_vi`).toBeGreaterThan(0);
      expect(e.safe_usage_en.length, `${e.id} safe_usage_en`).toBeGreaterThan(0);
      // example
      expect(e.example.vi.length, `${e.id} example.vi`).toBeGreaterThan(0);
      expect(e.example.en.length, `${e.id} example.en`).toBeGreaterThan(0);
    }
  });

  it("every phrase and example carries Thai script", () => {
    for (const e of entries) {
      expect(hasThai(e.phrase.thai), `${e.id} phrase.thai: ${e.phrase.thai}`).toBe(true);
      expect(hasThai(e.example.thai), `${e.id} example.thai: ${e.example.thai}`).toBe(true);
      expect(e.example.rtgs.length, `${e.id} example.rtgs`).toBeGreaterThan(0);
    }
  });
});

describe("Thai idiom/media — safe framing", () => {
  it("exposes a bilingual not-native-certain, no-stereotype disclaimer", () => {
    expect(IDIOM_MEDIA_DISCLAIMER.vi.length).toBeGreaterThan(0);
    expect(IDIOM_MEDIA_DISCLAIMER.en.length).toBeGreaterThan(0);
    const en = IDIOM_MEDIA_DISCLAIMER.en.toLowerCase();
    expect(en).toContain("not native-certified");
    expect(en).toContain("deferred");
    expect(en).toContain("stereotype");
  });

  it("makes no native-review / native-certainty claim in entry text", () => {
    const blob = JSON.stringify(entries).toLowerCase();
    expect(blob).not.toContain("native-reviewed");
    expect(blob).not.toContain("native-certified");
    expect(blob).not.toContain("certified by a native");
  });
});
