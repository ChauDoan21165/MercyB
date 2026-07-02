// Unit tests for the leaderboard client.
//
// We mock @/lib/supabaseClient using the shared supabaseMock helper so
// rpc() can be re-stubbed per-test. The mock is hoisted (vi.mock) so we
// import it via `as any` to read the spy back.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<unknown>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return {
    supabase,
    __mock: supabase,
  };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as unknown).__mock;

import {
  getWeeklyTop10,
  getMyWeeklyRank,
  awardPoints,
} from "../leaderboardClient";

beforeEach(() => {
  vi.clearAllMocks();
  supabaseMock.rpc.mockResolvedValue({ data: null, error: null });
});

describe("getWeeklyTop10", () => {
  it("maps snake_case RPC payload to camelCase entries", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        {
          rank: 1,
          user_id: "u1",
          username: "alice",
          points: 50,
          lessons_completed: 5,
          streak_days: 3,
        },
        {
          rank: 2,
          user_id: "u2",
          username: "bob",
          points: 30,
          lessons_completed: 3,
          streak_days: 1,
        },
      ],
      error: null,
    });

    const result = await getWeeklyTop10();

    expect(supabaseMock.rpc).toHaveBeenCalledWith("leaderboard_weekly_top10");
    expect(result).toEqual([
      {
        rank: 1,
        userId: "u1",
        username: "alice",
        points: 50,
        lessonsCompleted: 5,
        streakDays: 3,
      },
      {
        rank: 2,
        userId: "u2",
        username: "bob",
        points: 30,
        lessonsCompleted: 3,
        streakDays: 1,
      },
    ]);
  });

  it("returns [] on RPC error (silent degradation)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });

    const result = await getWeeklyTop10();
    expect(result).toEqual([]);
  });

  it("returns [] when data is not an array (defensive)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: null });
    const result = await getWeeklyTop10();
    expect(result).toEqual([]);
  });
});

describe("getMyWeeklyRank", () => {
  it("returns [] without calling RPC when userId is missing", async () => {
    const result = await getMyWeeklyRank(null);
    expect(result).toEqual([]);
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("maps neighbor rows including is_me → isMe", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        { rank: 3, user_id: "u3", username: "carol", points: 40, lessons_completed: 4, streak_days: 2, is_me: false },
        { rank: 4, user_id: "u4", username: "dave",  points: 35, lessons_completed: 3, streak_days: 2, is_me: false },
        { rank: 5, user_id: "me",  username: "me",    points: 30, lessons_completed: 3, streak_days: 1, is_me: true },
        { rank: 6, user_id: "u6", username: "eve",   points: 25, lessons_completed: 2, streak_days: 1, is_me: false },
        { rank: 7, user_id: "u7", username: "frank", points: 20, lessons_completed: 2, streak_days: 0, is_me: false },
      ],
      error: null,
    });

    const result = await getMyWeeklyRank("me");
    expect(supabaseMock.rpc).toHaveBeenCalledWith("leaderboard_weekly_my_rank");
    expect(result).toHaveLength(5);
    expect(result.find((r) => r.isMe)).toMatchObject({
      rank: 5,
      userId: "me",
      points: 30,
      isMe: true,
    });
    expect(result.filter((r) => !r.isMe)).toHaveLength(4);
  });

  it("returns synthetic 'not on board' row with isMe=true and points=0", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        { rank: 12, user_id: "me", username: "me", points: 0, lessons_completed: 0, streak_days: 0, is_me: true },
      ],
      error: null,
    });

    const result = await getMyWeeklyRank("me");
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ rank: 12, points: 0, isMe: true });
  });

  it("returns [] on error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "denied" },
    });
    const result = await getMyWeeklyRank("me");
    expect(result).toEqual([]);
  });
});

describe("awardPoints", () => {
  it("rejects unauth callers without hitting RPC", async () => {
    const result = await awardPoints(null, 10, "lesson");
    expect(result).toBeNull();
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("rejects negative or non-finite points without hitting RPC", async () => {
    expect(await awardPoints("u1", -5, "lesson")).toBeNull();
    expect(await awardPoints("u1", Number.NaN, "lesson")).toBeNull();
    expect(await awardPoints("u1", Number.POSITIVE_INFINITY, "challenge")).toBeNull();
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("calls RPC with floored points and the requested kind", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: {
        week_start: "2026-04-20",
        points: 25,
        lessons_completed: 2,
        streak_days: 3,
      },
      error: null,
    });

    const result = await awardPoints("u1", 12.7, "lesson");
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "award_leaderboard_points",
      { p_points: 12, p_kind: "lesson" },
    );
    expect(result).toEqual({
      weekStart: "2026-04-20",
      points: 25,
      lessonsCompleted: 2,
      streakDays: 3,
    });
  });

  it("reports null on RPC error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    const result = await awardPoints("u1", 5, "challenge");
    expect(result).toBeNull();
  });

  it("supports all three valid kinds", async () => {
    supabaseMock.rpc.mockResolvedValue({
      data: { week_start: "2026-04-20", points: 0, lessons_completed: 0, streak_days: 0 },
      error: null,
    });

    await awardPoints("u1", 1, "lesson");
    await awardPoints("u1", 1, "streak");
    await awardPoints("u1", 1, "challenge");

    const kinds = supabaseMock.rpc.mock.calls.map((c: unknown[]) => c[1]?.p_kind);
    expect(kinds).toEqual(["lesson", "streak", "challenge"]);
  });
});

describe("rank computation contract", () => {
  // The DB does the actual ranking; here we lock in the client-side
  // assumption that neighbor ordering is preserved as-is from the RPC,
  // so the UI can render rows in array order without re-sorting.
  it("does not re-sort the neighbor list", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        { rank: 1, user_id: "a", username: "a", points: 100, lessons_completed: 10, streak_days: 5, is_me: false },
        { rank: 2, user_id: "b", username: "b", points: 90,  lessons_completed: 9,  streak_days: 4, is_me: true },
        { rank: 3, user_id: "c", username: "c", points: 80,  lessons_completed: 8,  streak_days: 3, is_me: false },
      ],
      error: null,
    });

    const result = await getMyWeeklyRank("b");
    expect(result.map((r) => r.rank)).toEqual([1, 2, 3]);
  });
});
