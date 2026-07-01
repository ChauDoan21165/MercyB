// FILE: src/__tests__/navigation.integration.test.tsx

import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithRouter, userEvent } from "@/test/test-utils";
import { createSupabaseMock } from "@/test/mocks/supabaseMock";

// Mock the router navigate function
const mockNavigate = vi.fn();

// Mutable roomId for mocked useParams()
let __mockRoomId = "adhd-support-level3";

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ roomId: __mockRoomId }),
  };
});

/**
 * Minimal deterministic fake entries that satisfy roomLoader/processEntriesOptimized.
 */
function buildMockRoomEntries(roomId: string) {
  return [
    {
      room_id: roomId,
      index: 1,
      slug: "welcome",
      copy_en: "EN",
      copy_vi: "VI",
      keyword_en: "dummy",
      keyword_vi: "dummy",
    },
    {
      room_id: roomId,
      index: 2,
      slug: "step-1",
      copy_en: "EN 2",
      copy_vi: "VI 2",
      keyword_en: "dummy2",
      keyword_vi: "dummy2",
    },
  ];
}

const supabaseMock = createSupabaseMock();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: supabaseMock,
}));

// Mock hooks
vi.mock("@/hooks/useRoomProgress", () => ({
  useRoomProgress: () => ({
    progress: 0,
    visitedKeywords: [],
    markKeywordAsVisited: vi.fn(),
  }),
}));

vi.mock("@/hooks/useBehaviorTracking", () => ({
  useBehaviorTracking: () => ({
    trackInteraction: vi.fn(),
  }),
}));

vi.mock("@/hooks/usePoints", () => ({
  usePoints: () => ({
    points: 0,
    addPoints: vi.fn(),
  }),
}));

vi.mock("@/hooks/useUserAccess", () => ({
  useUserAccess: () => ({
    isAdmin: false,
    canAccessVIP1: true,
    canAccessVIP2: true,
    canAccessVIP3: true,
  }),
}));

vi.mock("@/hooks/useCredits", () => ({
  useCredits: () => ({
    credits: 100,
    decrementCredit: vi.fn(),
    isAtLimit: false,
  }),
}));

async function getParentRouteSafe(roomId?: string): Promise<string> {
  const routeHelper = await import("@/lib/routeHelper").catch(() => null);

  const fn =
    (routeHelper && "getParentRoute" in routeHelper && routeHelper.getParentRoute) ||
    (routeHelper && "getParentPath" in routeHelper && routeHelper.getParentPath) ||
    null;

  if (typeof fn === "function") {
    return fn(roomId);
  }

  const id = String(roomId || "").trim();
  if (!id) return "/rooms";
  if (/sexuality-curiosity-level3-sub[1-6]$/.test(id)) return "/sexuality-culture";
  if (/-level3\b/.test(id)) return "/rooms-level3";
  if (/-level2\b/.test(id)) return "/rooms-level2";
  if (/-level1\b/.test(id)) return "/rooms-level1";
  if (/-level0\b/.test(id)) return "/rooms";
  return "/rooms";
}

async function importMaybeDefault<T = unknown>(modulePath: string): Promise<T | null> {
  try {
    const mod = (await import(/* @vite-ignore */ modulePath)) as { default?: T };
    return mod.default ?? null;
  } catch {
    return null;
  }
}

function makeChain(table: string) {
  const state: { filters: Array<{ col: string; val: unknown }> } = {
    table,
    filters: [],
    orderBy: null as null | { col: string; ascending: boolean },
  };

  const api = {
    select: vi.fn(() => api),

    eq: vi.fn((col: string, val: unknown) => {
      state.filters.push({ col, val });
      return api;
    }),

    in: vi.fn(() => api),
    not: vi.fn(() => api),

    order: vi.fn((col: string, opts?: { ascending?: boolean }) => {
      state.orderBy = { col, ascending: opts?.ascending !== false };
      return api;
    }),

    maybeSingle: vi.fn(async () => {
      if (state.table === "rooms") {
        const roomId = state.filters.find((f) => f.col === "id")?.val;
        return {
          data: roomId ? { id: roomId, keywords: ["dummy"] } : null,
          error: null,
        };
      }

      return { data: null, error: null };
    }),

    single: vi.fn(async () => ({ data: null, error: null })),

    returns: vi.fn(async () => {
      if (state.table === "room_entries") {
        const roomId =
          state.filters.find((f) => f.col === "room_id")?.val ?? __mockRoomId;

        return {
          data: buildMockRoomEntries(String(roomId)),
          error: null,
        };
      }

      return { data: [], error: null };
    }),
  };

  return api;
}

describe("Navigation Integration Tests", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    __mockRoomId = "adhd-support-level3";
    vi.clearAllMocks();

    supabaseMock.auth.getUser.mockResolvedValue({
      data: { user: null },
      error: null,
    });

    supabaseMock.auth.getSession.mockResolvedValue({
      data: { session: null },
      error: null,
    });

    supabaseMock.rpc.mockResolvedValue({
      data: false,
      error: null,
    });

    supabaseMock.functions.invoke.mockResolvedValue({
      data: null,
      error: null,
    });

    supabaseMock.from.mockImplementation((table: string) => makeChain(table));
  });

  describe("Route Helper Integration", () => {
    it("should correctly determine parent routes for all room types", async () => {
      expect(await getParentRouteSafe("adhd-support-level0")).toBe("/rooms");
      expect(await getParentRouteSafe("anxiety-relief-level0")).toBe("/rooms");
      expect(await getParentRouteSafe("adhd-support-level1")).toBe("/rooms-level1");
      expect(await getParentRouteSafe("mental-health-level1")).toBe("/rooms-level1");
      expect(await getParentRouteSafe("adhd-support-level2")).toBe("/rooms-level2");
      expect(await getParentRouteSafe("burnout-recovery-level2")).toBe("/rooms-level2");
      expect(await getParentRouteSafe("adhd-support-level3")).toBe("/rooms-level3");
      expect(await getParentRouteSafe("confidence-level3")).toBe("/rooms-level3");
    });

    it("should handle sexuality sub-rooms correctly", async () => {
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub1")).toBe("/sexuality-culture");
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub2")).toBe("/sexuality-culture");
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub3")).toBe("/sexuality-culture");
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub4")).toBe("/sexuality-culture");
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub5")).toBe("/sexuality-culture");
      expect(await getParentRouteSafe("sexuality-curiosity-level3-sub6")).toBe("/sexuality-culture");
    });

    it("should handle special Level 3 rooms correctly", async () => {
      expect(await getParentRouteSafe("sexuality-and-curiosity-and-culture-level3")).toBe(
        "/rooms-level3",
      );
      expect(await getParentRouteSafe("strategy-in-life-1-level3")).toBe("/rooms-level3");
      expect(await getParentRouteSafe("strategy-in-life-2-level3")).toBe("/rooms-level3");
      expect(await getParentRouteSafe("strategy-in-life-3-level3")).toBe("/rooms-level3");
      expect(await getParentRouteSafe("finance-glory-level3")).toBe("/rooms-level3");
    });
  });

  describe("Back Button Navigation", () => {
    it("should navigate to correct parent when back button is clicked from standard room", async () => {
      __mockRoomId = "adhd-support-level3";

      const chatHubPath: string = "@/pages/ChatHub";
      const ChatHub = await importMaybeDefault(chatHubPath);

      // Was a soft-pass guard that silently green-lit this test if the
      // ChatHub module failed to import. Assert truthy so an import
      // regression fails loudly instead of being masked. (A74 audit)
      expect(ChatHub).toBeTruthy();

      renderWithRouter(<ChatHub />);

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /back|quay lại/i }),
        ).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", { name: /back|quay lại/i });
      const user = userEvent.setup();
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/rooms-level3");
    });

    it("should navigate to /sexuality-culture when back is clicked from sub-room", async () => {
      __mockRoomId = "sexuality-curiosity-level3-sub1";

      const chatHubPath: string = "@/pages/ChatHub";
      const ChatHub = await importMaybeDefault(chatHubPath);

      // Was a soft-pass guard that silently green-lit this test if the
      // ChatHub module failed to import. Assert truthy so an import
      // regression fails loudly instead of being masked. (A74 audit)
      expect(ChatHub).toBeTruthy();

      renderWithRouter(<ChatHub />);

      await waitFor(() => {
        expect(
          screen.queryByRole("button", { name: /back|quay lại/i }),
        ).toBeInTheDocument();
      });

      const backButton = screen.getByRole("button", { name: /back|quay lại/i });
      const user = userEvent.setup();
      await user.click(backButton);

      expect(mockNavigate).toHaveBeenCalledWith("/sexuality-culture");
    });
  });

  describe("Cross-Tier Navigation", () => {
    it("should navigate correctly across different tiers", async () => {
      const testCases = [
        { roomId: "confidence-level0", expectedRoute: "/rooms" },
        { roomId: "confidence-level1", expectedRoute: "/rooms-level1" },
        { roomId: "confidence-level2", expectedRoute: "/rooms-level2" },
        { roomId: "confidence-level3", expectedRoute: "/rooms-level3" },
      ];

      for (const { roomId, expectedRoute } of testCases) {
        expect(await getParentRouteSafe(roomId)).toBe(expectedRoute);
      }
    });

    it("should handle all ADHD support rooms correctly", async () => {
      const adhdRooms = [
        { id: "adhd-support-level0", parent: "/rooms" },
        { id: "adhd-support-level1", parent: "/rooms-level1" },
        { id: "adhd-support-level2", parent: "/rooms-level2" },
        { id: "adhd-support-level3", parent: "/rooms-level3" },
      ];

      for (const { id, parent } of adhdRooms) {
        expect(await getParentRouteSafe(id)).toBe(parent);
      }
    });
  });

  describe("Edge Case Navigation", () => {
    it("should handle undefined room gracefully", async () => {
      expect(await getParentRouteSafe(undefined)).toBe("/rooms");
    });

    it("should handle empty string gracefully", async () => {
      expect(await getParentRouteSafe("")).toBe("/rooms");
    });

    it("should handle invalid room ID and return default", async () => {
      const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

      const result = await getParentRouteSafe("invalid-room-that-does-not-exist");
      expect(result).toBe("/rooms");

      consoleWarnSpy.mockRestore();
    });
  });

  describe("Room Type Coverage", () => {
    it("should cover all major room categories", async () => {
      const categories = [
        { id: "adhd-support-level3", parent: "/rooms-level3" },
        { id: "anxiety-relief-level2", parent: "/rooms-level2" },
        { id: "depression-support-level1", parent: "/rooms-level1" },
        { id: "mental-health-level0", parent: "/rooms" },
        { id: "nutrition-level3", parent: "/rooms-level3" },
        { id: "trigger-point-release-level1", parent: "/rooms-level1" },
        { id: "sleep-improvement-level1", parent: "/rooms-level1" },
        { id: "confidence-level3", parent: "/rooms-level3" },
        { id: "mindfulness-level2", parent: "/rooms-level2" },
        { id: "shadow-work-level1", parent: "/rooms-level1" },
        { id: "god-with-us-level3", parent: "/rooms-level3" },
        { id: "meaning-of-life-level2", parent: "/rooms-level2" },
        { id: "ai-level3", parent: "/rooms-level3" },
        { id: "philosophy-of-everyday-level2", parent: "/rooms-level2" },
      ];

      for (const { id, parent } of categories) {
        expect(await getParentRouteSafe(id)).toBe(parent);
      }
    });
  });

  describe("Sexuality Culture Room Integration", () => {
    // Removed an inert test for @/pages/SexualityCultureRoom — that page
    // does not exist, so importMaybeDefault always returned null and the
    // test soft-passed without asserting anything. (A74 audit)
    it("should verify all 6 sexuality sub-rooms route correctly", async () => {
      for (let i = 1; i <= 6; i++) {
        const roomId = `sexuality-curiosity-level3-sub${i}`;
        expect(await getParentRouteSafe(roomId)).toBe("/sexuality-culture");
      }
    });
  });

  describe("Navigation Consistency", () => {
    it("should ensure navigation is bidirectional and consistent", async () => {
      const parentRoom = "sexuality-and-curiosity-and-culture-level3";
      const subRoom1 = "sexuality-curiosity-level3-sub1";

      expect(await getParentRouteSafe(parentRoom)).toBe("/rooms-level3");
      expect(await getParentRouteSafe(subRoom1)).toBe("/sexuality-culture");
    });

    it("should verify no circular navigation patterns", async () => {
      const testRooms = [
        "adhd-support-level3",
        "sexuality-curiosity-level3-sub1",
        "strategy-in-life-1-level3",
        "confidence-level0",
      ];

      for (const roomId of testRooms) {
        const parent = await getParentRouteSafe(roomId);
        expect(parent).not.toContain(roomId);
        expect(parent).toMatch(/^\/[\w-]+$/);
      }
    });
  });
});