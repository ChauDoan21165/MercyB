import { afterEach, describe, expect, it, vi } from "vitest";
import type { BaseRoomEntry } from "../roomLoader";

vi.mock("../roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn(),
}));

import { processEntriesOptimized } from "../roomLoaderHelpers";
import {
  normalizeEntries,
  normalizeTier,
  salvageDbEntries,
} from "../roomLoaderNormalize";

const mockProcessEntriesOptimized = vi.mocked(processEntriesOptimized);

afterEach(() => {
  vi.clearAllMocks();
});

describe("roomLoaderNormalize.salvageDbEntries", () => {
  it("uses deterministic slug priority across DB entry fields", () => {
    const result = salvageDbEntries([
      { slug: "  explicit-slug  ", keyword_en: "keyword" },
      { slug: " ", keyword_en: " keyword-en " },
      { keywordEn: " keywordEn " },
      { keyword_vi: " keyword-vi " },
      { keywordVi: " keywordVi " },
      { keywords_en: [" ", "array-en"] },
      { keywords_vi: ["array-vi"] },
      { keywords: ["generic-keyword"] },
      { title: " Title Fallback " },
      { title_en: " Title EN " },
      { titleEn: " Title Camel " },
      {},
    ] satisfies BaseRoomEntry[]);

    expect(result.merged.map((entry) => entry.slug)).toEqual([
      "explicit-slug",
      "keyword-en",
      "keywordEn",
      "keyword-vi",
      "keywordVi",
      "array-en",
      "array-vi",
      "generic-keyword",
      "Title Fallback",
      "Title EN",
      "Title Camel",
      "entry-11",
    ]);
  });

  it("normalizes copy without preserving empty or malformed values", () => {
    const result = salvageDbEntries([
      { slug: "string-copy", copy: "  Practice this.  " },
      { slug: "object-copy", copy: { en: " Hello ", vi: " Xin chao " } },
      { slug: "en-only-copy", copy: { en: " Only English ", vi: " " } },
      { slug: "empty-object-copy", copy: { en: " ", vi: " " } },
      { slug: "malformed-copy", copy: { nested: true } },
      { slug: "null-copy", copy: null },
    ] satisfies BaseRoomEntry[]);

    expect(result.merged[0].copy).toBe("Practice this.");
    expect(result.merged[1].copy).toEqual({ en: "Hello", vi: "Xin chao" });
    expect(result.merged[2].copy).toEqual({ en: "Only English" });
    expect(result.merged[3]).not.toHaveProperty("copy");
    expect(result.merged[4]).not.toHaveProperty("copy");
    expect(result.merged[5]).not.toHaveProperty("copy");
    expect(result.merged.map((entry) => entry.copy)).not.toContain("[object Object]");
  });

  it("dedupes and trims keyword menus with VI fallback to EN", () => {
    const result = salvageDbEntries([
      { keyword_en: " hello ", keyword_vi: " xin chao " },
      { keyword_en: "hello", keyword_vi: "xin chao" },
      { keywords_en: ["apple", " apple ", "banana"], keywords_vi: ["tao"] },
      { keywords: ["shared"], keyword_vi: " " },
      { slug: "fallback-slug" },
    ] satisfies BaseRoomEntry[]);

    expect(result.keywordMenu).toEqual({
      en: ["hello", "apple", "shared", "fallback-slug"],
      vi: ["xin chao", "tao", "shared", "fallback-slug"],
    });
  });
});

describe("roomLoaderNormalize.normalizeTier", () => {
  it("prioritizes roomTier, tier, then accessTier and normalizes known values", () => {
    expect(normalizeTier({ roomTier: " Level2 ", tier: "level1" })).toBe("level2");
    expect(normalizeTier({ roomTier: " ", tier: "Premium" })).toBe("premium");
    expect(normalizeTier({ tier: " ", accessTier: "LEVEL3_ROOM" })).toBe("level3");
    expect(normalizeTier({ tier: "level1_plus" })).toBe("level1");
    expect(normalizeTier({ accessTier: "unknown-tier" })).toBe("unknown-tier");
    expect(normalizeTier(null)).toBe("level0");
  });
});

describe("roomLoaderNormalize.normalizeEntries", () => {
  it("normalizes processed keyword menus and preserves valid merged arrays", () => {
    const merged = [{ slug: "one" }, { slug: "two" }];
    mockProcessEntriesOptimized.mockReturnValueOnce({
      merged,
      keywordMenu: {
        en: [" one ", "one", "", "two"],
        vi: [" mot ", 123, "mot", "hai"],
      },
    });

    const result = normalizeEntries([{ slug: "raw" }]);

    expect(result).toEqual({
      merged,
      keywordMenu: {
        en: ["one", "two"],
        vi: ["mot", "hai"],
      },
    });
  });

  it("returns safe empty output when processed entries are malformed", () => {
    mockProcessEntriesOptimized.mockReturnValueOnce({
      merged: { not: "an-array" },
      keywordMenu: {
        en: "hello",
        vi: [null, " ", 42],
      },
    });

    const result = normalizeEntries([{ slug: "raw" }]);

    expect(result).toEqual({
      merged: [],
      keywordMenu: { en: [], vi: [] },
    });
  });
});
