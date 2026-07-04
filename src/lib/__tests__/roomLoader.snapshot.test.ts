// src/lib/__tests__/roomLoader.snapshot.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock>;
type SupabaseFromResult = ReturnType<SupabaseMock["from"]>;
type ChainMock = SupabaseFromResult & Record<string, unknown>;
type QueryChain = {
  select: (...args: unknown[]) => QueryChain;
  eq: (...args: unknown[]) => QueryChain;
  order: (...args: unknown[]) => QueryChain;
  returns: () => Promise<{ data: unknown; error: unknown }>;
  maybeSingle: () => Promise<{ data: unknown; error: unknown }>;
};
type SupabaseLike = Omit<SupabaseMock, "from"> & { from: (table: string) => QueryChain };
type StableRoomSnapshot = {
  audioBasePath?: unknown;
  roomTier?: unknown;
  keywordMenu?: unknown;
  merged?: unknown;
};

// --------------------
// Shared Supabase mock (hoist-safe + TS-safe)
// --------------------
vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock() as unknown as SupabaseLike;

  const getRoomFromDB = vi.fn(async (roomId: string) => {
    const roomsRes = await supabase.from("rooms").select("*").eq("id", roomId).maybeSingle();
    const roomEntriesRes = await supabase
      .from("room_entries")
      .select("*")
      .eq("room_id", roomId)
      .order("index")
      .returns();

    const room = roomsRes?.data ?? null;
    const entries = Array.isArray(roomEntriesRes?.data) ? roomEntriesRes.data : [];

    if (!room && entries.length === 0) return null;

    return {
      ...(room ?? { id: roomId }),
      entries,
    };
  });

  return {
    supabase,
    getRoomFromDB,
    __mock: supabase,
    __getRoomFromDBMock: getRoomFromDB,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as typeof SupaMod & { __mock: SupabaseMock }).__mock;

// --------------------
// roomLoaderHelpers mock
// --------------------
vi.mock("../roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn(() => ({
    merged: [{ slug: "dummy-entry", copy: { en: "EN", vi: "VI" } }],
    keywordMenu: { en: ["dummy"], vi: ["dummy"] },
  })),
}));

// --------------------
// constants mock
// --------------------
vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

// --------------------
// roomJsonResolver mock
// --------------------
const jsonMocks = vi.hoisted(() => ({
  mockLoadRoomJson: vi.fn(),
}));

vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: jsonMocks.mockLoadRoomJson,
}));

import { loadMergedRoom } from "../roomLoader";

const makeChain = (overrides: Partial<ChainMock> = {}): SupabaseFromResult => {
  const self: Partial<ChainMock> = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    returns: vi.fn().mockResolvedValue({ data: [], error: null }),
    ...overrides,
  };
  return self as SupabaseFromResult;
};

describe("loadMergedRoom snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

    supabaseMock.auth.getSession.mockResolvedValue({
      data: {
        session: {
          access_token: "fake-token",
          user: { id: "user-123" },
        },
      },
      error: null,
    });

    supabaseMock.rpc.mockResolvedValue({
      data: false,
      error: null,
    });

    supabaseMock.functions.invoke.mockResolvedValue({
      data: {
        is_premium: false,
        source: null,
        status: "inactive",
        expires_at: null,
        plan_name: null,
        tier_id: null,
      },
      error: null,
    });

    const roomEntriesChain = makeChain({
      returns: vi.fn().mockResolvedValue({
        data: [{ room_id: "test-room", index: 0 }],
        error: null,
      }),
    });

    const roomsChain = makeChain({
      maybeSingle: vi.fn().mockResolvedValue({
        data: {
          id: "test-room",
          title_en: "Test Room",
          title_vi: "Phòng thử",
          tier: "Level 0 / Miễn phí",
          keywords: ["test"],
          entries: [
            {
              slug: "entry-1",
              keywords_en: ["test"],
              keywords_vi: ["thử"],
              copy: { en: "EN body", vi: "VI body" },
            },
          ],
        },
        error: null,
      }),
    });

    supabaseMock.from.mockImplementation((table: string) => {
      const t = String(table || "").toLowerCase();
      if (t === "room_entries") return roomEntriesChain;
      if (t === "rooms") return roomsChain;
      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValue(null);
  });

  it("DB room → stable merged structure snapshot", async () => {
    const result = await loadMergedRoom("test-room");

    const snapshot = result as StableRoomSnapshot;
    const stable = {
      audioBasePath: snapshot.audioBasePath,
      roomTier: snapshot.roomTier,
      keywordMenu: snapshot.keywordMenu,
      merged: snapshot.merged,
    };

    expect(stable).toMatchInlineSnapshot(`
      {
        "audioBasePath": "audio/",
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
            "copy": {
              "en": "EN",
              "vi": "VI",
            },
            "slug": "dummy-entry",
          },
        ],
        "roomTier": "level0",
      }
    `);
  });

  it("JSON fallback room → stable merged structure snapshot", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      const t = String(table || "").toLowerCase();

      if (t === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        });
      }

      if (t === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        });
      }

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValue({
      id: "json-room",
      tier: "Level 0 / Miễn phí",
      entries: [
        {
          slug: "json-entry",
          keywords_en: ["json"],
          keywords_vi: ["json"],
          copy: { en: "Json EN body", vi: "Json VI body" },
        },
      ],
    });

    const result = await loadMergedRoom("json-room");

    const snapshot = result as StableRoomSnapshot;
    const stable = {
      audioBasePath: snapshot.audioBasePath,
      roomTier: snapshot.roomTier,
      keywordMenu: snapshot.keywordMenu,
      merged: snapshot.merged,
    };

    expect(stable).toMatchInlineSnapshot(`
      {
        "audioBasePath": "audio/",
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
            "copy": {
              "en": "EN",
              "vi": "VI",
            },
            "slug": "dummy-entry",
          },
        ],
        "roomTier": "level 0 / miễn phí",
      }
    `);
  });
});
