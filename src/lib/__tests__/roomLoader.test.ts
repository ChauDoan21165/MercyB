// src/lib/__tests__/roomLoader.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------
// HOIST-SAFE mocks
// --------------------
const supabaseMocks = vi.hoisted(() => {
  return {
    mockGetUser: vi.fn(),
    mockFrom: vi.fn(),
    mockRpc: vi.fn(),
  };
});

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: supabaseMocks.mockGetUser,
    },
    from: supabaseMocks.mockFrom,
    rpc: supabaseMocks.mockRpc,
  },
}));

const accessMocks = vi.hoisted(() => {
  return {
    mockDetermineAccess: vi.fn(),
  };
});

vi.mock("../accessControl", () => ({
  determineAccess: accessMocks.mockDetermineAccess,
}));

vi.mock("../roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn(() => ({
    merged: [{ slug: "dummy-entry" }],
    keywordMenu: { en: ["dummy"], vi: ["dummy"] },
  })),
}));

vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

const jsonMocks = vi.hoisted(() => {
  return {
    mockLoadRoomJson: vi.fn(),
  };
});

vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: jsonMocks.mockLoadRoomJson,
}));

// Import AFTER mocks
import { loadMergedRoom } from "../roomLoader";

// --------------------
// Helper: chain builder
// --------------------
const makeChain = (overrides: Partial<Record<string, any>> = {}) => {
  const self: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue({ data: [], error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };
  return self;
};

describe("loadMergedRoom", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default: authenticated user
    supabaseMocks.mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    // Default: has_role(admin) => false
    supabaseMocks.mockRpc.mockResolvedValue({ data: false, error: null });

    // Default: active Free subscription
    const subscriptionChain = makeChain({
      maybeSingle: vi.fn().mockResolvedValue({
        data: { subscription_tiers: { name: "Free / Miễn phí" } },
        error: null,
      }),
    });

    // Default: room_entries contains 1 entry (DB success path)
    const roomEntriesChain = makeChain({
      returns: vi.fn().mockResolvedValue({
        data: [{ room_id: "test-room", index: 0 }],
        error: null,
      }),
    });

    // Default: rooms table (mostly unused in success path)
    const roomsChain = makeChain({
      maybeSingle: vi.fn().mockResolvedValue({
        data: { id: "test-room", keywords: ["fallback-keyword"] },
        error: null,
      }),
    });

    supabaseMocks.mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") return subscriptionChain;
      if (table === "room_entries") return roomEntriesChain;
      if (table === "rooms") return roomsChain;
      throw new Error(`Unexpected table: ${table}`);
    });

    // Default: allow full access
    accessMocks.mockDetermineAccess.mockReturnValue({ hasFullAccess: true });

    // Default JSON: missing
    jsonMocks.mockLoadRoomJson.mockResolvedValue(null);
  });

  it("guest/unauthenticated does NOT throw; returns ROOM_NOT_FOUND (new preview model)", async () => {
    supabaseMocks.mockGetUser.mockResolvedValueOnce({
      data: { user: null },
      error: null,
    });

    // Force DB miss + JSON miss
    supabaseMocks.mockFrom.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }
      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        });
      }
      if (table === "user_subscriptions") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        });
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    const result = await loadMergedRoom("some-room");

    expect(result).toMatchObject({
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: "audio/",
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    });
  });

  it("loads room from DB and returns merged data when access allowed", async () => {
    const result = await loadMergedRoom("test-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.errorCode).toBeUndefined();
    expect(result.merged).toHaveLength(1);
    expect(result.keywordMenu.en).toContain("dummy");
    expect(accessMocks.mockDetermineAccess).toHaveBeenCalled();
  });

  it("when determineAccess denies: returns PREVIEW (does not throw)", async () => {
    accessMocks.mockDetermineAccess.mockReturnValueOnce({ hasFullAccess: false });

    const result = await loadMergedRoom("vip3-room");

    expect(result.hasFullAccess).toBe(false);
    expect(result.errorCode).toBe("ACCESS_DENIED");
    expect(result.merged.length).toBeGreaterThan(0); // preview entries
  });

  it("falls back to JSON when DB returns no room_entries", async () => {
    // DB miss (room_entries empty + rooms empty)
    supabaseMocks.mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        });
      }
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }
      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        });
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
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

    expect(jsonMocks.mockLoadRoomJson).toHaveBeenCalledWith("json-room");
    expect(result.merged).toHaveLength(1);
    expect(result.hasFullAccess).toBe(true);
  });

  it("denies access on JSON fallback when tier is too high → returns PREVIEW", async () => {
    // DB miss
    supabaseMocks.mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "Free / Miễn phí" } },
            error: null,
          }),
        });
      }
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }
      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        });
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
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

    accessMocks.mockDetermineAccess.mockReturnValueOnce({ hasFullAccess: false });

    const result = await loadMergedRoom("json-vip-room");

    expect(result.hasFullAccess).toBe(false);
    expect(result.errorCode).toBe("ACCESS_DENIED");
    expect(result.merged.length).toBeGreaterThan(0);
  });

  it("applies ROOM_ID_OVERRIDES / normalizeRoomId before DB lookup (room_entries eq room_id)", async () => {
    const seenRoomIds: string[] = [];

    const roomEntriesChain = makeChain();
    roomEntriesChain.eq = vi.fn().mockImplementation((col: string, val: string) => {
      if (col === "room_id") seenRoomIds.push(val);
      return roomEntriesChain;
    });
    roomEntriesChain.returns = vi.fn().mockResolvedValue({
      data: [{ room_id: "english-writing-deep-dive-vip3II", index: 0 }],
      error: null,
    });

    supabaseMocks.mockFrom.mockImplementation((table: string) => {
      if (table === "user_subscriptions") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { subscription_tiers: { name: "VIP3 / VIP3" } },
            error: null,
          }),
        });
      }
      if (table === "room_entries") return roomEntriesChain;
      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: "english-writing-deep-dive-vip3II", keywords: [] },
            error: null,
          }),
        });
      }
      throw new Error(`Unexpected table: ${table}`);
    });

    await loadMergedRoom("english-writing-deep-dive-vip3-ii");

    expect(seenRoomIds).toContain("english-writing-deep-dive-vip3II");
  });

  it("matches stable shape snapshot for a simple DB room", async () => {
    const result = await loadMergedRoom("test-room");

    expect(result).toMatchInlineSnapshot(`
      {
        "audioBasePath": "audio/",
        "hasFullAccess": true,
        "keywordMenu": {
          "en": [
            "dummy",
          ],
          "vi": [
            "dummy",
          ],
        },
        "merged": [
          {
            "slug": "dummy-entry",
          },
        ],
        "roomTier": "free",
      }
    `);
  });
});