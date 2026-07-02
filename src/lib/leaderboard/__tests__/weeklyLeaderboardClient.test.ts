// src/lib/leaderboard/__tests__/weeklyLeaderboardClient.test.ts
//
// Pure helpers tested directly. The Supabase paths use the shared mock
// to assert the right RPC + table calls go out and the result shape
// propagates back as the right TypeScript shape.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<unknown>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as unknown).__mock;

import {
  currentWeekStartIso,
  getMyRank,
  getTop,
  setDisplayName,
  validateDisplayName,
} from "../weeklyLeaderboardClient";

// ── currentWeekStartIso ──────────────────────────────────────────────────

describe("currentWeekStartIso", () => {
  it("Wednesday 2026-04-22 → previous Monday 2026-04-20", () => {
    expect(currentWeekStartIso(new Date("2026-04-22T12:34:56Z"))).toBe(
      "2026-04-20",
    );
  });

  it("Sunday rolls back to the prior Monday (six days before)", () => {
    expect(currentWeekStartIso(new Date("2026-04-26T23:59:59Z"))).toBe(
      "2026-04-20",
    );
  });

  it("Monday is its own week start", () => {
    expect(currentWeekStartIso(new Date("2026-04-20T00:00:00Z"))).toBe(
      "2026-04-20",
    );
  });

  it("Crosses year boundary cleanly", () => {
    // 2027-01-03 is a Sunday → previous Monday is 2026-12-28.
    expect(currentWeekStartIso(new Date("2027-01-03T05:00:00Z"))).toBe(
      "2026-12-28",
    );
  });
});

// ── validateDisplayName ──────────────────────────────────────────────────

describe("validateDisplayName", () => {
  it("accepts a plain ASCII name", () => {
    expect(validateDisplayName("Lan")).toEqual({ ok: true, value: "Lan" });
  });

  it("trims surrounding whitespace", () => {
    expect(validateDisplayName("  Lan  ")).toEqual({ ok: true, value: "Lan" });
  });

  it("accepts Vietnamese diacritics", () => {
    expect(validateDisplayName("Phương Anh")).toEqual({
      ok: true,
      value: "Phương Anh",
    });
  });

  it("accepts the three SFW achievement emoji", () => {
    expect(validateDisplayName("Lan ✨").ok).toBe(true);
    expect(validateDisplayName("Diamond 💎").ok).toBe(true);
    expect(validateDisplayName("🏆 Champ").ok).toBe(true);
  });

  it("rejects empty / whitespace-only names", () => {
    expect(validateDisplayName("")).toEqual({ ok: false, reason: "empty" });
    expect(validateDisplayName("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it("rejects names over 30 codepoints", () => {
    const long = "a".repeat(31);
    expect(validateDisplayName(long)).toEqual({ ok: false, reason: "too_long" });
  });

  it("counts emoji as one codepoint each (not their utf-16 length)", () => {
    // 28 ASCII + ✨ = 29 codepoints — should pass.
    expect(validateDisplayName("a".repeat(28) + "✨").ok).toBe(true);
  });

  it("rejects emoji outside the allowlist", () => {
    expect(validateDisplayName("Lan 😀")).toEqual({
      ok: false,
      reason: "disallowed_chars",
    });
    expect(validateDisplayName("Lan 🔥")).toEqual({
      ok: false,
      reason: "disallowed_chars",
    });
  });
});

// ── getTop ───────────────────────────────────────────────────────────────

describe("getTop", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls weekly_leaderboard_top RPC and maps rows", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        {
          rank: 1,
          user_id: "u1",
          display_name: "Lan ✨",
          total_score: 950,
          attempts_count: 12,
          week_starts_on: "2026-04-20",
        },
        {
          rank: 2,
          user_id: "u2",
          display_name: "Phong",
          total_score: 880,
          attempts_count: 10,
          week_starts_on: "2026-04-20",
        },
      ],
      error: null,
    });

    const rows = await getTop(50);
    expect(supabaseMock.rpc).toHaveBeenCalledWith("weekly_leaderboard_top", {
      p_limit: 50,
    });
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ rank: 1, user_id: "u1", total_score: 950 });
    expect(rows[1].display_name).toBe("Phong");
  });

  it("clamps oversized limits to 500", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: [], error: null });
    await getTop(99999);
    expect(supabaseMock.rpc).toHaveBeenCalledWith("weekly_leaderboard_top", {
      p_limit: 500,
    });
  });

  it("falsy limit (0) falls back to the default 100", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: [], error: null });
    await getTop(0);
    expect(supabaseMock.rpc).toHaveBeenLastCalledWith(
      "weekly_leaderboard_top",
      { p_limit: 100 },
    );
  });

  it("negative limit clamps to 1", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: [], error: null });
    await getTop(-5);
    expect(supabaseMock.rpc).toHaveBeenLastCalledWith(
      "weekly_leaderboard_top",
      { p_limit: 1 },
    );
  });

  it("returns [] on RPC error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    expect(await getTop(10)).toEqual([]);
  });

  it("filters out rows missing required fields (defensive)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        { rank: null, user_id: "x", display_name: "x", week_starts_on: "x" }, // bad rank
        { rank: 1, user_id: null, display_name: "x", week_starts_on: "x" }, // bad user
        {
          rank: 1,
          user_id: "u1",
          display_name: "ok",
          total_score: 100,
          attempts_count: 1,
          week_starts_on: "2026-04-20",
        },
      ],
      error: null,
    });
    const rows = await getTop(10);
    expect(rows).toHaveLength(1);
    expect(rows[0].user_id).toBe("u1");
  });
});

// ── getMyRank ────────────────────────────────────────────────────────────

describe("getMyRank", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns onBoard:false when caller has no row", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        {
          rank: null,
          total_score: null,
          attempts_count: null,
          display_name: null,
          opted_in: false,
          week_starts_on: "2026-04-20",
        },
      ],
      error: null,
    });
    const r = await getMyRank();
    expect(r.onBoard).toBe(false);
  });

  it("returns onBoard:true with rank when opted in", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: [
        {
          rank: 47,
          total_score: 612.5,
          attempts_count: 8,
          display_name: "Phương Anh",
          opted_in: true,
          week_starts_on: "2026-04-20",
        },
      ],
      error: null,
    });
    const r = await getMyRank();
    expect(r).toMatchObject({
      onBoard: true,
      rank: 47,
      total_score: 612.5,
      attempts_count: 8,
      display_name: "Phương Anh",
      opted_in: true,
    });
  });

  it("returns onBoard:false on RPC error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    const r = await getMyRank();
    expect(r.onBoard).toBe(false);
  });
});

// ── setDisplayName ───────────────────────────────────────────────────────

describe("setDisplayName", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects an invalid name without touching the DB", async () => {
    const result = await setDisplayName("u1", "");
    expect(result).toEqual({ ok: false, error: "empty" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("rejects a too-long name", async () => {
    const result = await setDisplayName("u1", "a".repeat(31));
    expect(result).toEqual({ ok: false, error: "too_long" });
  });

  it("succeeds when an existing row updates", async () => {
    const select = vi
      .fn()
      .mockResolvedValue({ data: [{ id: "row-1" }], error: null });
    const eqWeek = vi.fn(() => ({ select }));
    const eqUser = vi.fn(() => ({ eq: eqWeek }));
    const update = vi.fn(() => ({ eq: eqUser }));
    supabaseMock.from.mockImplementationOnce(() => ({ update }));

    const result = await setDisplayName("u1", "Lan ✨");
    expect(result).toEqual({ ok: true });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ display_name: "Lan ✨" }),
    );
  });

  it("inserts a placeholder row when none exists for this week", async () => {
    // First .from(...) → update returning no rows
    const updSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    const updEqWeek = vi.fn(() => ({ select: updSelect }));
    const updEqUser = vi.fn(() => ({ eq: updEqWeek }));
    const update = vi.fn(() => ({ eq: updEqUser }));

    // Second .from(...) → insert succeeds
    const insert = vi.fn().mockResolvedValue({ error: null });

    supabaseMock.from
      .mockImplementationOnce(() => ({ update }))
      .mockImplementationOnce(() => ({ insert }));

    const result = await setDisplayName("u1", "New User");
    expect(result).toEqual({ ok: true });
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        user_id: "u1",
        display_name: "New User",
        total_score: 0,
        attempts_count: 0,
      }),
    );
  });

  it("opts out (display_name = null) without inserting a placeholder", async () => {
    const updSelect = vi.fn().mockResolvedValue({ data: [], error: null });
    const updEqWeek = vi.fn(() => ({ select: updSelect }));
    const updEqUser = vi.fn(() => ({ eq: updEqWeek }));
    const update = vi.fn(() => ({ eq: updEqUser }));
    supabaseMock.from.mockImplementationOnce(() => ({ update }));

    const result = await setDisplayName("u1", null);
    expect(result).toEqual({ ok: true });
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ display_name: null }),
    );
    // No second .from() call for an INSERT — opt-out of nothing is a no-op.
    expect(supabaseMock.from).toHaveBeenCalledTimes(1);
  });
});
