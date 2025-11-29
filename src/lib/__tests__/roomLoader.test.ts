// src/lib/__tests__/roomLoader.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

// 1) Mock Supabase client
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  },
}));

// 2) Mock accessControl (only care that canUserAccessRoom is used)
const mockCanUserAccessRoom = vi.fn();

vi.mock("@/lib/roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn(() => ({
    merged: [{ slug: "dummy-entry" }],
    keywordMenu: { en: ["dummy"], vi: ["dummy"] },
  })),
}));

vi.mock("../accessControl", () => ({
  canUserAccessRoom: mockCanUserAccessRoom,
}));

// 3) Mock constants
vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

// 4) Mock JSON loader
const mockLoadRoomJson = vi.fn();
vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: mockLoadRoomJson,
}));

// 5) Import after mocks are set up
import { loadMergedRoom } from "../roomLoader";
import { normalizeTier } from "@/lib/constants/tiers";

describe("loadMergedRoom", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: authenticated Free user
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    // Default: subscription row → Free / Miễn phí
    const subscriptionChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          subscription_tiers: { name: "Free / Miễn phí" },
        },
        error: null,
      }),
    };

    // Default: rooms table chain (we'll override per test)
    const roomsChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: "test-room",
          title_en: "Test Room",
          title_vi: "Phòng thử",
          tier: "Free / Miễn phí",
          keywords: ["test"],
          entries: [
            {
              slug: "entry-1",
              keywords_en: ["test"],
              keywords_vi: ["thử"],
              copy: { en: "EN", vi: "VI" },
            },
          ],
        },
        error: null,
      }),
    };

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") return subscriptionChain;
      if (table === "rooms") return roomsChain;
      throw new Error(`Unexpected table: ${table}`);
    });

    // By default: allow access
    mockCanUserAccessRoom.mockReturnValue(true);

    // Default JSON loader
    mockLoadRoomJson.mockResolvedValue(null);
  });

  it("throws AUTHENTICATION_REQUIRED if user is not authenticated", async () => {
    mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    await expect(loadMergedRoom("some-room")).rejects.toThrow(
      "AUTHENTICATION_REQUIRED",
    );
  });

  it("loads room from DB and returns merged data when access allowed", async () => {
    const result = await loadMergedRoom("test-room");

    expect(result).toBeTruthy();
    expect(result.merged).toHaveLength(1);
    expect(result.keywordMenu.en).toContain("dummy");

    // canUserAccessRoom called with normalized tiers
    const freeTier = normalizeTier("Free / Miễn phí");
    expect(mockCanUserAccessRoom).toHaveBeenCalledWith(freeTier, freeTier);
  });

  it("denies access when canUserAccessRoom returns false (DB room)", async () => {
    // user: VIP2
    mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP2 / VIP2" } },
            error: null,
          }),
        };
      }
      if (table === "rooms") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "vip3-room",
              title_en: "VIP3 Room",
              title_vi: "Phòng VIP3",
              tier: "VIP3 / VIP3",
              keywords: ["vip3"],
              entries: [],
            },
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    mockCanUserAccessRoom.mockReturnValue(false);

    await expect(loadMergedRoom("vip3-room")).rejects.toThrow(
      "ACCESS_DENIED_INSUFFICIENT_TIER",
    );

    const vip2 = normalizeTier("VIP2 / VIP2");
    const vip3 = normalizeTier("VIP3 / VIP3");
    expect(mockCanUserAccessRoom).toHaveBeenCalledWith(vip2, vip3);
  });

  it("falls back to JSON when DB returns no room", async () => {
    // DB returns null
    mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        };
      }
      if (table === "rooms") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    // JSON loader returns a valid room
    mockLoadRoomJson.mockResolvedValue({
      id: "json-room",
      tier: "Free / Miễn phí",
      entries: [
        {
          slug: "entry-json",
          keywords_en: ["json"],
          keywords_vi: ["json"],
          copy: { en: "Json EN", vi: "Json VI" },
        },
      ],
    });

    const result = await loadMergedRoom("json-room");

    expect(result).toBeTruthy();
    expect(result.merged).toHaveLength(1);
    expect(mockLoadRoomJson).toHaveBeenCalledWith("json-room");
  });

  it("denies access on JSON fallback when tier is too high", async () => {
    // DB returns null
    mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        };
      }
      if (table === "rooms") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        };
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    // JSON room with VIP tier
    mockLoadRoomJson.mockResolvedValue({
      id: "json-vip-room",
      tier: "VIP3 / VIP3",
      entries: [
        {
          slug: "entry-json-vip",
          keywords_en: ["vip"],
          keywords_vi: ["vip"],
          copy: { en: "vip", vi: "vip" },
        },
      ],
    });

    mockCanUserAccessRoom.mockReturnValue(false);

    await expect(loadMergedRoom("json-vip-room")).rejects.toThrow(
      "ACCESS_DENIED_INSUFFICIENT_TIER",
    );
  });

  it("applies ROOM_ID_OVERRIDES / normalizeRoomId before DB lookup", async () => {
    // Example: english-writing-deep-dive-vip3-ii → english-writing-deep-dive-vip3II
    const seenIds: string[] = [];

    mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP3 / VIP3" } },
            error: null,
          }),
        };
      }
      if (table === "rooms") {
        const chain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockImplementation((col: string, val: string) => {
            if (col === "id") {
              seenIds.push(val);
            }
            return chain;
          }),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "english-writing-deep-dive-vip3II",
              title_en: "VIP3II Deep Dive",
              title_vi: "VIP3II Deep Dive",
              tier: "VIP3 / VIP3",
              keywords: ["vip3"],
              entries: [],
            },
            error: null,
          }),
        };
        return chain;
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    await loadMergedRoom("english-writing-deep-dive-vip3-ii");

    // We expect normalized ID to be used in the DB query
    expect(seenIds).toContain("english-writing-deep-dive-vip3II");
  });
});
