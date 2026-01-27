// FILE: roomLoader.snapshot.test.ts
// PATH: src/lib/__tests__/roomLoader.snapshot.test.ts
// VERSION: MB-BLUE-ROOMLOADER-SNAP-1.0.2 — 2026-01-15 (+0700)
//
// FIX: vitest hoists vi.mock() factories to the top.
// Define spies INSIDE the mock factory and export __mock handles.
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
const { mockGetUser, mockFrom } = supaMock as {
  mockGetUser: ReturnType<typeof vi.fn>;
  mockFrom: ReturnType<typeof vi.fn>;
};

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
const { mockCanUserAccessRoom, mockDetermineAccess } = accessMock as {
  mockCanUserAccessRoom: ReturnType<typeof vi.fn>;
  mockDetermineAccess: ReturnType<typeof vi.fn>;
};

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
const { mockLoadRoomJson } = jsonMock as {
  mockLoadRoomJson: ReturnType<typeof vi.fn>;
};

// IMPORTANT: import AFTER mocks
import { loadMergedRoom } from "../roomLoader";

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

  it("DB room → stable merged structure snapshot", async () => {
    const result = await loadMergedRoom("test-room");

    expect(result).toMatchInlineSnapshot(`
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
        "roomTier": "free",
      }
    `);
  });

  it("JSON fallback room → stable merged structure snapshot", async () => {
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

    expect(result).toMatchInlineSnapshot(`
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
        "roomTier": "free",
      }
    `);
  });
});
