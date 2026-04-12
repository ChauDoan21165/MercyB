// src/lib/__tests__/roomLoader.corruption.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------
// SHARED Supabase mock (hoist-safe + TS-safe)
// --------------------
vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();

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
const supabaseMock = (SupaMod as any).__mock;

// --------------------
// Other mocks
// --------------------
const accessMocks = vi.hoisted(() => ({
  mockDetermineAccess: vi.fn(),
}));

vi.mock("../accessControl", () => ({
  determineAccess: accessMocks.mockDetermineAccess,
}));

vi.mock("../roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn((entries: any[]) => {
    const safeEntries = Array.isArray(entries) ? entries : [];

    const merged = safeEntries.map((entry, index) => {
      const slug =
        (typeof entry?.slug === "string" && entry.slug.trim()) ||
        (typeof entry?.keyword_en === "string" && entry.keyword_en.trim()) ||
        (typeof entry?.keywordEn === "string" && entry.keywordEn.trim()) ||
        `entry-${index}`;

      const keywordEn =
        (typeof entry?.keyword_en === "string" && entry.keyword_en.trim()) ||
        (typeof entry?.keywordEn === "string" && entry.keywordEn.trim()) ||
        (Array.isArray(entry?.keywords_en) ? entry.keywords_en[0] : "") ||
        "";

      const keywordVi =
        (typeof entry?.keyword_vi === "string" && entry.keyword_vi.trim()) ||
        (typeof entry?.keywordVi === "string" && entry.keywordVi.trim()) ||
        (Array.isArray(entry?.keywords_vi) ? entry.keywords_vi[0] : "") ||
        "";

      return {
        slug,
        keywordEn,
        keywordVi,
        copy: entry?.copy ?? null,
      };
    });

    return {
      merged,
      keywordMenu: {
        en: merged.map((m) => m.keywordEn || m.slug).filter(Boolean),
        vi: merged.map((m) => m.keywordVi || m.keywordEn || m.slug).filter(Boolean),
      },
    };
  }),
}));

vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

const jsonMocks = vi.hoisted(() => ({
  mockLoadRoomJson: vi.fn(),
}));

vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: jsonMocks.mockLoadRoomJson,
}));

import { loadMergedRoom } from "../roomLoader";

// --------------------
// Helpers
// --------------------
const makeChain = (overrides: Partial<Record<string, any>> = {}) => {
  const self: any = {
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    not: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    returns: vi.fn().mockResolvedValue({ data: [], error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  };
  return self;
};

describe("loadMergedRoom corruption handling", () => {
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

    supabaseMock.rpc.mockResolvedValue({ data: false, error: null });

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

    accessMocks.mockDetermineAccess.mockReturnValue({ hasFullAccess: true });
    jsonMocks.mockLoadRoomJson.mockResolvedValue(null);

    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({
            data: [
              {
                room_id: "healthy-room",
                index: 0,
                slug: "healthy-entry",
                keyword_en: "healthy-en",
                keyword_vi: "healthy-vi",
                copy: { en: "Hello", vi: "Xin chào" },
              },
            ],
            error: null,
          }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: "healthy-room", keywords: ["healthy"] },
            error: null,
          }),
        });
      }

      return makeChain();
    });
  });

  it("JSON exists but entries is not an array → returns ROOM_NOT_FOUND safely", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
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

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "bad-json-room",
      tier: "Level 0 / Miễn phí",
      entries: "not-an-array",
    });

    const result = await loadMergedRoom("bad-json-room");

    expect(result).toMatchObject({
      merged: [],
      keywordMenu: { en: [], vi: [] },
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    });
  });

  it("DB entry rows missing expected fields → derives safe fallback values", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({
            data: [
              {
                room_id: "broken-db-room",
                index: 0,
                slug: "",
                keyword_en: null,
                keyword_vi: undefined,
                copy: null,
              },
              {
                room_id: "broken-db-room",
                index: 1,
              },
            ],
            error: null,
          }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: "broken-db-room", keywords: [] },
            error: null,
          }),
        });
      }

      return makeChain();
    });

    const result = await loadMergedRoom("broken-db-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(2);
    expect(result.merged[0].slug).toBe("entry-0");
    expect(result.merged[1].slug).toBe("entry-1");
    expect(result.keywordMenu.en).toEqual(["entry-0", "entry-1"]);
    expect(result.keywordMenu.vi).toEqual(["entry-0", "entry-1"]);
  });

  it("room data has empty keywords / null copy / broken shapes → still returns safe output", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({
            data: [
              {
                room_id: "shape-room",
                index: 0,
                slug: "shape-entry",
                keyword_en: "",
                keyword_vi: "",
                copy: null,
                weird_extra: { nested: true },
              },
            ],
            error: null,
          }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "shape-room",
              keywords: [],
              copy: null,
              title_en: null,
            },
            error: null,
          }),
        });
      }

      return makeChain();
    });

    const result = await loadMergedRoom("shape-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("shape-entry");
    expect(result.keywordMenu.en).toEqual(["shape-entry"]);
    expect(result.keywordMenu.vi).toEqual(["shape-entry"]);
  });

  it("DB shell exists but JSON entries have broken shapes → still recovers safely", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "mixed-room",
              keywords: [],
              title_en: "DB shell",
            },
            error: null,
          }),
        });
      }

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "mixed-room",
      tier: "Level 0 / Miễn phí",
      entries: [
        {
          slug: "",
          keyword_en: null,
          keyword_vi: null,
          copy: null,
        },
      ],
    });

    const result = await loadMergedRoom("mixed-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("entry-0");
    expect(result.keywordMenu.en).toEqual(["entry-0"]);
    expect(result.keywordMenu.vi).toEqual(["entry-0"]);
  });

  it("DB returns stale/incomplete room while JSON is malformed → fails safely", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "broken-room",
              keywords: [],
              title_en: "Incomplete DB row",
            },
            error: null,
          }),
        });
      }

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "broken-room",
      tier: "Level 0 / Miễn phí",
      entries: 12345,
    });

    const result = await loadMergedRoom("broken-room");

    expect(result).toMatchObject({
      merged: [],
      keywordMenu: { en: [], vi: [] },
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    });
  });

  it("DB returns broken room row with non-array keywords → still fails safely when no usable entries exist", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "odd-room",
              keywords: "not-an-array",
              title_en: "Odd room",
            },
            error: null,
          }),
        });
      }

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce(null);

    const result = await loadMergedRoom("odd-room");

    expect(result).toMatchObject({
      merged: [],
      keywordMenu: { en: [], vi: [] },
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    });
  });

  it("JSON entries with partial valid data are normalized instead of crashing", async () => {
    supabaseMock.from.mockImplementation((table: string) => {
      if (table === "room_entries") {
        return makeChain({
          returns: vi.fn().mockResolvedValue({ data: [], error: null }),
        });
      }

      if (table === "rooms") {
        return makeChain({
          maybeSingle: vi.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        });
      }

      return makeChain();
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "partial-json-room",
      tier: "Level 0 / Miễn phí",
      entries: [
        {
          keyword_en: "json-keyword-only",
          copy: null,
        },
        {
          slug: "json-slug-only",
        },
      ],
    });

    const result = await loadMergedRoom("partial-json-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(2);
    expect(result.merged[0].slug).toBe("json-keyword-only");
    expect(result.merged[1].slug).toBe("json-slug-only");
    expect(result.keywordMenu.en).toEqual(["json-keyword-only", "json-slug-only"]);
  });
});
