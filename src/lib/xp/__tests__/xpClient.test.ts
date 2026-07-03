// src/lib/xp/__tests__/xpClient.test.ts
//
// Unit tests for the XP client. Pure helpers are tested directly;
// the supabase-touching paths are tested via the shared mock.

import { describe, it, expect, vi, beforeEach } from "vitest";
import type { createSupabaseMock } from "@/test/mocks/supabaseMock";

type SupabaseMock = ReturnType<typeof createSupabaseMock>;

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<typeof import("@/test/mocks/supabaseMock")>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as typeof SupaMod & { __mock: SupabaseMock }).__mock;

import { awardXp, getXp, getXpThisWeek, weekRange } from "../xpClient";

describe("weekRange", () => {
  it("starts on Monday and ends 7 days later", () => {
    // 2026-04-22 is a Wednesday
    const ref = new Date(2026, 3, 22);
    const { startISO, endISO } = weekRange(ref);
    expect(startISO).toBe("2026-04-20"); // Monday
    expect(endISO).toBe("2026-04-27"); // next Monday (exclusive)
  });

  it("handles Sunday by anchoring to the prior Monday", () => {
    // 2026-04-26 is a Sunday
    const ref = new Date(2026, 3, 26);
    const { startISO, endISO } = weekRange(ref);
    expect(startISO).toBe("2026-04-20");
    expect(endISO).toBe("2026-04-27");
  });

  it("handles Monday as the start of its own week", () => {
    const ref = new Date(2026, 3, 20); // Monday
    const { startISO, endISO } = weekRange(ref);
    expect(startISO).toBe("2026-04-20");
    expect(endISO).toBe("2026-04-27");
  });
});

describe("awardXp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects non-positive points without calling supabase", async () => {
    const result = await awardXp("u1", 0, "challenge");
    expect(result).toEqual({ ok: false, error: expect.any(String) });
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("calls increment_user_xp RPC with rounded points", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: 25, error: null });

    const result = await awardXp("u1", 12.7, "lesson");

    expect(supabaseMock.rpc).toHaveBeenCalledWith("increment_user_xp", {
      p_points: 13,
    });
    expect(result).toEqual({ ok: true, total: 25 });
  });

  it("surfaces RPC errors as ok:false", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "rls denied" },
    });

    const result = await awardXp("u1", 10, "streak");
    expect(result).toEqual({ ok: false, error: "rls denied" });
  });
});

describe("getXp", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 0 when row is missing", async () => {
    // The default mock chain.maybeSingle returns { data: null, error: null }
    const total = await getXp("u1");
    expect(total).toBe(0);
    expect(supabaseMock.from).toHaveBeenCalledWith("user_xp");
  });
});

describe("getXpThisWeek", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("queries daily_challenges scoped to the user + week range", async () => {
    // Override the chain to capture filters and return rows.
    const lt = vi.fn().mockResolvedValue({
      data: [{ xp_awarded: 10 }, { xp_awarded: 15 }, { xp_awarded: null }],
      error: null,
    });
    const gte = vi.fn(() => ({ lt }));
    const eq = vi.fn(() => ({ gte }));
    const select = vi.fn(() => ({ eq }));
    supabaseMock.from.mockImplementationOnce(() => ({ select }));

    const total = await getXpThisWeek("u1", new Date(2026, 3, 22));

    expect(supabaseMock.from).toHaveBeenCalledWith("daily_challenges");
    expect(select).toHaveBeenCalledWith("xp_awarded");
    expect(eq).toHaveBeenCalledWith("user_id", "u1");
    expect(gte).toHaveBeenCalledWith("date", "2026-04-20");
    expect(lt).toHaveBeenCalledWith("date", "2026-04-27");
    expect(total).toBe(25);
  });

  it("returns 0 on query error", async () => {
    const lt = vi
      .fn()
      .mockResolvedValue({ data: null, error: { message: "boom" } });
    const gte = vi.fn(() => ({ lt }));
    const eq = vi.fn(() => ({ gte }));
    const select = vi.fn(() => ({ eq }));
    supabaseMock.from.mockImplementationOnce(() => ({ select }));

    const total = await getXpThisWeek("u1");
    expect(total).toBe(0);
  });
});
