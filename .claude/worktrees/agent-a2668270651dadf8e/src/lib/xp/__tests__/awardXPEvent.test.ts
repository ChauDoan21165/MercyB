// src/lib/xp/__tests__/awardXPEvent.test.ts
//
// Tests the client wrapper. The RPC itself is exercised via a mock —
// what we lock here is that the wrapper translates RPC responses into
// the documented AwardXPResult shape, including the various reasons
// (awarded, duplicate, cooldown, capped, disabled, invalid, rpc_error).

import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import { awardXPEvent, awardXPEventBackground } from "../awardXPEvent";

function rpcReturning(data: Record<string, unknown> | null, error: { message: string } | null = null) {
  supabaseMock.rpc = vi.fn().mockResolvedValue({ data, error });
}

beforeEach(() => {
  if (typeof supabaseMock.reset === "function") supabaseMock.reset();
});

describe("awardXPEvent — input validation", () => {
  it("returns invalid for non-positive xp_amount", async () => {
    rpcReturning(null);
    const r = await awardXPEvent({ event_type: "lesson_complete", xp_amount: 0 });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("invalid");
  });

  it("returns invalid for NaN xp_amount", async () => {
    rpcReturning(null);
    const r = await awardXPEvent({ event_type: "lesson_complete", xp_amount: Number.NaN });
    expect(r.reason).toBe("invalid");
  });
});

describe("awardXPEvent — RPC translation", () => {
  it("maps reason='awarded' to ok=true and propagates totals", async () => {
    rpcReturning({
      reason: "awarded",
      awarded: 10,
      total_xp: 60,
      current_level: 2,
      previous_level: 1,
      level_changed: true,
    });
    const r = await awardXPEvent({
      event_type: "lesson_complete",
      source_id: "lesson-abc",
    });
    expect(r.ok).toBe(true);
    expect(r.reason).toBe("awarded");
    expect(r.awarded).toBe(10);
    expect(r.total_xp).toBe(60);
    expect(r.current_level).toBe(2);
    expect(r.previous_level).toBe(1);
    expect(r.level_changed).toBe(true);
  });

  it("maps reason='duplicate' to ok=false with awarded=0", async () => {
    rpcReturning({
      reason: "duplicate",
      awarded: 0,
      total_xp: 60,
      current_level: 2,
      previous_level: 2,
      level_changed: false,
    });
    const r = await awardXPEvent({
      event_type: "lesson_complete",
      source_id: "lesson-abc",
    });
    expect(r.ok).toBe(false);
    expect(r.reason).toBe("duplicate");
    expect(r.awarded).toBe(0);
    expect(r.total_xp).toBe(60);
  });

  it("maps reason='cooldown' to ok=false", async () => {
    rpcReturning({
      reason: "cooldown",
      awarded: 0,
      total_xp: 60,
      current_level: 2,
      previous_level: 2,
      level_changed: false,
    });
    const r = await awardXPEvent({
      event_type: "lesson_complete",
      source_id: "lesson-abc",
    });
    expect(r.reason).toBe("cooldown");
    expect(r.ok).toBe(false);
  });

  it("maps reason='capped' to ok=false (still surfaces totals)", async () => {
    rpcReturning({
      reason: "capped",
      awarded: 0,
      total_xp: 1200,
      current_level: 6,
      previous_level: 6,
      level_changed: false,
    });
    const r = await awardXPEvent({ event_type: "drill_complete", source_id: "d-1" });
    expect(r.reason).toBe("capped");
    expect(r.total_xp).toBe(1200);
    expect(r.current_level).toBe(6);
  });

  it("maps reason='disabled' to ok=false", async () => {
    rpcReturning({
      reason: "disabled",
      awarded: 0,
      total_xp: 0,
      current_level: 1,
      previous_level: 1,
      level_changed: false,
    });
    const r = await awardXPEvent({ event_type: "lesson_complete", source_id: "x" });
    expect(r.reason).toBe("disabled");
    expect(r.ok).toBe(false);
  });

  it("maps RPC errors to reason='rpc_error' with the error message", async () => {
    rpcReturning(null, { message: "PGRST301: no rows" });
    const r = await awardXPEvent({ event_type: "lesson_complete", source_id: "x" });
    expect(r.reason).toBe("rpc_error");
    expect(r.error_message).toContain("PGRST301");
  });

  it("uses default XP from eventTypes when xp_amount is omitted", async () => {
    rpcReturning({
      reason: "awarded",
      awarded: 15,
      total_xp: 15,
      current_level: 1,
      previous_level: 1,
      level_changed: false,
    });
    await awardXPEvent({ event_type: "challenge_complete", source_id: "c-1" });
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "award_xp_event",
      expect.objectContaining({ p_xp_amount: 15 }),
    );
  });

  it("rounds non-integer xp_amount on the way to the RPC", async () => {
    rpcReturning({
      reason: "awarded",
      awarded: 10,
      total_xp: 10,
      current_level: 1,
      previous_level: 1,
      level_changed: false,
    });
    await awardXPEvent({ event_type: "lesson_complete", source_id: "x", xp_amount: 9.7 });
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "award_xp_event",
      expect.objectContaining({ p_xp_amount: 10 }),
    );
  });

  it("passes multiplier through, defaulting to 1.0", async () => {
    rpcReturning({
      reason: "awarded",
      awarded: 20,
      total_xp: 20,
      current_level: 1,
      previous_level: 1,
      level_changed: false,
    });
    await awardXPEvent({ event_type: "lesson_complete", source_id: "x" });
    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "award_xp_event",
      expect.objectContaining({ p_multiplier: 1.0 }),
    );
  });
});

describe("awardXPEventBackground", () => {
  it("does not throw when the RPC returns an error", async () => {
    rpcReturning(null, { message: "boom" });
    await expect(
      Promise.resolve(
        awardXPEventBackground({ event_type: "lesson_complete", source_id: "x" }),
      ),
    ).resolves.toBeUndefined();
  });

  it("returns synchronously (fire-and-forget)", () => {
    rpcReturning({
      reason: "awarded",
      awarded: 10,
      total_xp: 10,
      current_level: 1,
      previous_level: 1,
      level_changed: false,
    });
    const ret = awardXPEventBackground({ event_type: "lesson_complete", source_id: "x" });
    expect(ret).toBeUndefined();
  });
});
