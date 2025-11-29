// src/lib/__tests__/roomLoader.snapshot.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";

// --- Mocks ---

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

vi.mock("@/lib/roomLoaderHelpers", () => ({
  processEntriesOptimized: vi.fn(() => ({
    merged: [{ slug: "dummy-entry", copy: { en: "EN", vi: "VI" } }],
    keywordMenu: { en: ["dummy"], vi: ["dummy"] },
  })),
}));

const mockCanUserAccessRoom = vi.fn();
vi.mock("../accessControl", () => ({
  canUserAccessRoom: mockCanUserAccessRoom,
}));

vi.mock("@/lib/constants/rooms", () => ({
  ROOMS_TABLE: "rooms",
  AUDIO_FOLDER: "audio",
}));

const mockLoadRoomJson = vi.fn();
vi.mock("../roomJsonResolver", () => ({
  loadRoomJson: mockLoadRoomJson,
}));

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
    mockLoadRoomJson.mockResolvedValue(null);
  });

  it("DB room → stable merged structure snapshot", async () => {
    const result = await loadMergedRoom("test-room");

    // We only snapshot the public shape that ChatHub cares about
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
            data: {
              subscription_tiers: { name: "Free / Miễn phí" },
            },
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
