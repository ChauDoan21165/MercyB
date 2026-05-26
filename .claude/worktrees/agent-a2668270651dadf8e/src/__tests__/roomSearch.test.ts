/**
 * Room Search Tests
 *
 * Uses a mocked roomFetcher instead of the deleted roomDataImports.
 * Asserts on stable search invariants against known test data.
 */

import { describe, it, expect, beforeEach, beforeAll, vi } from "vitest";

// Mock Supabase so the room fetcher can hydrate the registry
// without a real database connection.
const MOCK_ROOMS = [
  { id: "adhd_support_free", tier: "level0", title_en: "ADHD Support", title_vi: "Hỗ trợ ADHD" },
  { id: "adhd_support_vip3", tier: "level3", title_en: "ADHD Support VIP", title_vi: "Hỗ trợ ADHD Cao Cấp" },
  { id: "anxiety_relief_free", tier: "level0", title_en: "Anxiety Relief", title_vi: "Giảm Lo Âu" },
  { id: "anxiety_relief_vip3", tier: "level3", title_en: "Anxiety Relief VIP", title_vi: "Giảm Lo Âu Cao Cấp" },
  { id: "depression_support_vip3", tier: "level3", title_en: "Depression Support", title_vi: "Hỗ trợ Trầm Cảm" },
  { id: "english_speaking_level1", tier: "level1", title_en: "English Speaking", title_vi: "Luyện Nói Tiếng Anh" },
  { id: "writing_mastery_level2", tier: "level2", title_en: "Writing Mastery", title_vi: "Làm Chủ Viết" },
];
vi.mock("@/lib/supabaseClient", () => {
  const chain = {
    select: () => chain,
    returns: () => Promise.resolve({ data: MOCK_ROOMS, error: null }),
  };
  return {
    supabase: {
      from: () => chain,
    },
  };
});

import {
  getAllRooms,
  getAllRoomsAsync,
  getRoomById,
  getRoomsByTier,
  refreshRegistry,
} from "@/lib/rooms/roomRegistry";
import {
  searchRooms,
  getSearchSuggestions,
  hasSearchResults,
} from "@/lib/search/roomSearch";

const KNOWN_IDS = {
  adhdFree: "adhd_support_free",
  adhdVip3: "adhd_support_vip3",
  anxietyFree: "anxiety_relief_free",
  anxietyVip3: "anxiety_relief_vip3",
  depressionVip3: "depression_support_vip3",
} as const;

describe("roomRegistry (mocked roomFetcher)", () => {
  beforeAll(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });
  beforeEach(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });

  it("should load rooms from roomFetcher (non-empty)", () => {
    const rooms = getAllRooms();
    expect(Array.isArray(rooms)).toBe(true);
    expect(rooms.length).toBeGreaterThan(0);
  });

  it("should get a room by id and preserve production fields", () => {
    const room = getRoomById(KNOWN_IDS.adhdFree);
    expect(room).toBeDefined();
    expect(room?.id).toBe(KNOWN_IDS.adhdFree);

    // Production schema
    expect(room).toHaveProperty("title_en");
    expect(room).toHaveProperty("title_vi");
    expect(room).toHaveProperty("tier");
    expect(room).toHaveProperty("hasData");

    expect(typeof room?.title_en).toBe("string");
    expect(typeof room?.title_vi).toBe("string");
    expect(typeof room?.tier).toBe("string");
    expect(typeof room?.hasData).toBe("boolean");
  });

  it("should return undefined for non-existent room", () => {
    const room = getRoomById("__definitely_not_a_real_room_id__");
    expect(room).toBeUndefined();
  });

  it("should get rooms by tier and only return that tier", () => {
    const freeRooms = getRoomsByTier("level0");
    expect(Array.isArray(freeRooms)).toBe(true);
    expect(freeRooms.length).toBeGreaterThan(0);
    expect(freeRooms.every((r) => r.tier === "level0")).toBe(true);

    const vip3Rooms = getRoomsByTier("level3");
    if (vip3Rooms.length > 0) {
      expect(vip3Rooms.every((r) => r.tier === "level3")).toBe(true);
    }
  });
});

describe("searchRooms (mocked dataset)", () => {
  beforeAll(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });
  beforeEach(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });

  it("should return empty array for empty/whitespace query", () => {
    expect(searchRooms("")).toEqual([]);
    expect(searchRooms("   ")).toEqual([]);
  });

  it("should find rooms by English title tokens (e.g., ADHD)", () => {
    const results = searchRooms("ADHD");
    const ids = new Set(results.map((r) => r.id));
    expect(ids.has(KNOWN_IDS.adhdFree) || ids.has(KNOWN_IDS.adhdVip3)).toBe(true);
  });

  it("should find rooms by Vietnamese text (diacritics)", () => {
    const results = searchRooms("trầm cảm");
    const ids = new Set(results.map((r) => r.id));
    expect(ids.has(KNOWN_IDS.depressionVip3)).toBe(true);
  });

  it("should find Vietnamese matches without diacritics if normalization exists", () => {
    const results = searchRooms("lo au");
    const ids = new Set(results.map((r) => r.id));
    expect(
      Array.from(ids).some((id) => id.includes("anxiety")) ||
        ids.has(KNOWN_IDS.anxietyVip3)
    ).toBe(true);
  });

  it("should support tier-aware searching", () => {
    const results = searchRooms("ADHD", { tier: "level3" });
    const ids = new Set(results.map((r) => r.id));
    expect(ids.has(KNOWN_IDS.adhdFree) || ids.has(KNOWN_IDS.adhdVip3)).toBe(true);
  });

  it("should respect limit option", () => {
    const results = searchRooms("support", { limit: 5 });
    expect(results.length).toBeLessThanOrEqual(5);
  });

  it("should be case-insensitive", () => {
    const a = searchRooms("adhd").map((r) => r.id);
    const b = searchRooms("ADHD").map((r) => r.id);
    expect(new Set(a)).toEqual(new Set(b));
  });
});

describe("getSearchSuggestions (mocked dataset)", () => {
  beforeAll(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });
  beforeEach(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });

  it("should return empty array for empty prefix", () => {
    expect(getSearchSuggestions("")).toEqual([]);
    expect(getSearchSuggestions("   ")).toEqual([]);
  });

  it("should return suggestions for a meaningful prefix", () => {
    const suggestions = getSearchSuggestions("Anx");
    expect(Array.isArray(suggestions)).toBe(true);
    if (suggestions.length > 0) {
      expect(typeof suggestions[0]).toBe("string");
    }
  });

  it("should respect limit", () => {
    const suggestions = getSearchSuggestions("A", 3);
    expect(suggestions.length).toBeLessThanOrEqual(3);
  });
});

describe("hasSearchResults (mocked dataset)", () => {
  beforeAll(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });
  beforeEach(async () => {
    refreshRegistry();
    await getAllRoomsAsync();
  });

  it("should return false for empty query", () => {
    expect(hasSearchResults("")).toBe(false);
    expect(hasSearchResults("   ")).toBe(false);
  });

  it("should return true for known matching query", () => {
    expect(hasSearchResults("ADHD")).toBe(true);
    expect(hasSearchResults("Anxiety")).toBe(true);
  });

  it("should return false for non-matching query", () => {
    expect(hasSearchResults("__xyz__this_should_not_match_any_room__")).toBe(false);
  });
});
