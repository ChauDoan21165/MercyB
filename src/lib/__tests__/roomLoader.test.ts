import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------
// SHARED Supabase mock (hoist-safe + TS-safe)
// --------------------
const supabaseClientMocks = vi.hoisted(() => ({
  mockGetRoomFromDB: vi.fn(),
}));

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();

  return {
    supabase,
    getRoomFromDB: supabaseClientMocks.mockGetRoomFromDB,
    __mock: supabase,
    __mockGetRoomFromDB: supabaseClientMocks.mockGetRoomFromDB,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;
const mockGetRoomFromDB = (SupaMod as any).__mockGetRoomFromDB;

// --------------------
// Other mocks
// --------------------
const accessMocks = vi.hoisted(() => {
  return {
    mockDetermineAccess: vi.fn(),
  };
});

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
        (Array.isArray(entry?.keywords_en) && entry.keywords_en[0]) ||
        "";

      const keywordVi =
        (typeof entry?.keyword_vi === "string" && entry.keyword_vi.trim()) ||
        (typeof entry?.keywordVi === "string" && entry.keywordVi.trim()) ||
        (Array.isArray(entry?.keywords_vi) && entry.keywords_vi[0]) ||
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

const jsonMocks = vi.hoisted(() => {
  return {
    mockLoadRoomJson: vi.fn(),
  };
});

vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: jsonMocks.mockLoadRoomJson,
}));

import { loadMergedRoom } from "../roomLoader";

describe("loadMergedRoom", () => {
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

    mockGetRoomFromDB.mockResolvedValue({
      entries: [
        {
          room_id: "test-room",
          index: 0,
          slug: "db-entry",
          keyword_en: "db-keyword",
          keyword_vi: "db-keyword-vi",
          copy: { en: "Hello", vi: "Xin chào" },
        },
      ],
      meta: { id: "test-room", keywords: ["fallback-keyword"] },
    });
  });

  it("loads room from DB successfully", async () => {
    const result = await loadMergedRoom("test-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.errorCode).toBeUndefined();
  });

  it("admin gets full access to vip room even when determineAccess would deny", async () => {
    supabaseMock.auth.getUser.mockResolvedValueOnce({
      data: { user: { id: "admin-123" } },
      error: null,
    });

    supabaseMock.auth.getSession.mockResolvedValueOnce({
      data: {
        session: {
          access_token: "admin-token",
          user: { id: "admin-123" },
        },
      },
      error: null,
    });

    supabaseMock.rpc.mockResolvedValueOnce({
      data: true,
      error: null,
    });

    accessMocks.mockDetermineAccess.mockReturnValueOnce({
      hasFullAccess: false,
    });

    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [
        {
          room_id: "vip3-room",
          index: 0,
          slug: "vip-entry",
          keyword_en: "vip-en",
          keyword_vi: "vip-vi",
        },
      ],
      meta: { id: "vip3-room", keywords: ["vip"] },
    });

    const result = await loadMergedRoom("vip3-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.errorCode).toBeUndefined();
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("vip-entry");
  });

  it("db room metadata missing but json entries recover room", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [],
      meta: null,
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "json-room",
      tier: "Free / Miễn phí",
      entries: [
        {
          slug: "json-entry",
          keyword_en: "json-en",
          keyword_vi: "json-vi",
        },
      ],
    });

    const result = await loadMergedRoom("json-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.errorCode).toBeUndefined();
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("json-entry");
  });

  it("JSON exists but entries is not an array → fails safely", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [],
      meta: null,
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "bad-json-room",
      tier: "Free / Miễn phí",
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
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [
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
      meta: { id: "broken-db-room", keywords: [] },
    });

    const result = await loadMergedRoom("broken-db-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(2);
    expect(result.merged[0].slug).toBe("entry-0");
    expect(result.merged[1].slug).toBe("entry-1");
    expect(result.keywordMenu.en).toEqual(["entry-0", "entry-1"]);
    expect(result.keywordMenu.vi).toEqual(["entry-0", "entry-1"]);
  });

  it("db entries malformed falls back to json", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [
        null,
        { weird: true },
        { room_id: "mixed-room", index: 2, slug: "", keyword_en: null },
      ],
      meta: null,
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "mixed-room",
      tier: "Free / Miễn phí",
      entries: [
        {
          slug: "json-recovery-entry",
          keyword_en: "json-en",
          keyword_vi: "json-vi",
        },
      ],
    });

    const result = await loadMergedRoom("mixed-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("json-recovery-entry");
  });

  it("room data has empty keywords / null copy / broken shapes → still returns safe output", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [
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
      meta: {
        id: "shape-room",
        keywords: [],
        copy: null,
        title_en: null,
      },
    });

    const result = await loadMergedRoom("shape-room");

    expect(result.hasFullAccess).toBe(true);
    expect(result.merged).toHaveLength(1);
    expect(result.merged[0].slug).toBe("shape-entry");
    expect(result.keywordMenu.en).toEqual(["shape-entry"]);
    expect(result.keywordMenu.vi).toEqual(["shape-entry"]);
  });

  it("DB has room row but no entries, JSON has broken shapes → still recovers safely", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [],
      meta: {
        id: "mixed-room",
        keywords: [],
        title_en: "DB shell",
      },
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "mixed-room",
      tier: "Free / Miễn phí",
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
  });

  it("DB returns stale/incomplete room while JSON is malformed → fails safely", async () => {
    mockGetRoomFromDB.mockResolvedValueOnce({
      entries: [],
      meta: {
        id: "broken-room",
        keywords: [],
        title_en: "Incomplete DB row",
      },
    });

    jsonMocks.mockLoadRoomJson.mockResolvedValueOnce({
      id: "broken-room",
      tier: "Free / Miễn phí",
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
});