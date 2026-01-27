// FILE: roomLoader.snapshot.test.ts
// PATH: src/lib/__tests__/roomLoader.snapshot.test.ts
// VERSION: MB-BLUE-ROOMLOADER-SNAP-1.0.4 — 2026-01-22 (+0700)
//
// FIX: vitest hoists vi.mock() factories to the top.
// Define spies INSIDE the mock factory and export __mock handles.
//
// FIX (2026-01-22):
// - Avoid TS “declared here” weirdness from destructuring + inline type literals.
// - Read mock handles via (as any) + explicit casts (still type-safe enough for tests).
//
// FIX (2026-01-22) SNAPSHOT STABILITY:
// - Room loader output can legitimately evolve (merged contents, keyword derivation, extra fields).
// - Snapshot only the *contract keys* we truly need stable: audioBasePath + roomTier.
// - Still assert merged/keywordMenu shapes without snapshotting full payload.
//
// FIX (2026-01-15):
// roomLoader dynamically imports determineAccess from ./accessControl.
// The mock MUST export determineAccess (and we keep a spy handle for it).

import { describe, it, expect, vi, beforeEach } from "vitest";

// --------------------
// Supabase mock (hoist-safe)
// --------------------
vi.mock("@/lib/supabaseClient", () => {
  const mockGetUser = vi.fn();
  const mockFrom = vi.fn();

  return {
    supabase: {
      auth: { getUser: mockGetUser },
      from: mockFrom,
    },
    __mock: { mockGetUser, mockFrom },
  };
});

import { __mock as supaMock } from "@/lib/supabaseClient";
const mockGetUser = (supaMock as any).mockGetUser as ReturnType<typeof vi.fn>;
const mockFrom = (supaMock as any).mockFrom as ReturnType<typeof vi.fn>;

// --------------------
// roomLoaderHelpers mock
// (export both names to survive refactors)
// --------------------
vi.mock("../roomLoaderHelpers", () => {
  const payload = {
    merged: [{ slug: "dummy-entry", copy: { en: "EN", vi: "VI" } }],
    keywordMenu: { en: ["dummy"], vi: ["dummy"] },
  };

  return {
    processEntriesOptimized: vi.fn(() => payload),
    processEntries: vi.fn(() => payload),
  };
});

// --------------------
// accessControl mock (hoist-safe handle)
// --------------------
vi.mock("../accessControl", () => {
  const mockCanUserAccessRoom = vi.fn();

  // IMPORTANT: roomLoader uses determineAccess via dynamic import("./accessControl")
  // so we MUST export it in the mock.
  const mockDetermineAccess = vi.fn(() => ({
    hasFullAccess: true,
    isPreview: false,
  }));

  return {
    canUserAccessRoom: mockCanUserAccessRoom,
    determineAccess: mockDetermineAccess,
    __mock: { mockCanUserAccessRoom, mockDetermineAccess },
  };
});

import { __mock as accessMock } from "../accessControl";
const mockCanUserAccessRoom = (accessMock as any).mockCanUserAccessRoom as ReturnType<typeof vi.fn>;
const mockDetermineAccess = (accessMock as any).mockDetermineAccess as ReturnType<typeof vi.fn>;

// --------------------
// constants mock
// --------------------
vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

// --------------------
// roomJsonResolver mock (hoist-safe handle)
// --------------------
vi.mock("../roomJsonResolver", () => {
  const mockLoadRoomJson = vi.fn();
  return {
    loadRoomJson: mockLoadRoomJson,
    __mock: { mockLoadRoomJson },
  };
});

import { __mock as jsonMock } from "../roomJsonResolver";
const mockLoadRoomJson = (jsonMock as any).mockLoadRoomJson as ReturnType<typeof vi.fn>;

// IMPORTANT: import AFTER mocks
import { loadMergedRoom } from "../roomLoader";

function expectStableContract(result: any) {
  // Stable “contract” snapshot (do NOT include volatile fields)
  expect({
    audioBasePath: result?.audioBasePath,
    roomTier: result?.roomTier,
  }).toMatchInlineSnapshot(`
    {
      "audioBasePath": "audio/",
      "roomTier": "free",
    }
  `);

  // Shape assertions (no snapshot)
  expect(Array.isArray(result?.merged)).toBe(true);
  expect(typeof result?.keywordMenu).toBe("object");
  expect(Array.isArray(result?.keywordMenu?.en)).toBe(true);
  expect(Array.isArray(result?.keywordMenu?.vi)).toBe(true);
}

describe("loadMergedRoom snapshots", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-123" } },
      error: null,
    });

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
              copy: { en: "EN body", vi: "VI body" },
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

    mockCanUserAccessRoom.mockReturnValue(true);
    mockDetermineAccess.mockReturnValue({ hasFullAccess: true, isPreview: false });
    mockLoadRoomJson.mockResolvedValue(null);
  });

  it("DB room → stable merged contract snapshot", async () => {
    const result = await loadMergedRoom("test-room");
    expectStableContract(result);
  });

  it("JSON fallback room → stable merged contract snapshot", async () => {
    // DB returns null → forces JSON path
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

    mockLoadRoomJson.mockResolvedValue({
      id: "json-room",
      tier: "Free / Miễn phí",
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
    expectStableContract(result);
  });
});

/* teacher GPT — new thing to learn:
   Snapshot the smallest “contract” that must never change,
   and assert shapes for the rest — that prevents refactors from exploding tests. */
