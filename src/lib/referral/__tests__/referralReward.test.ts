// src/lib/referral/__tests__/referralReward.test.ts
//
// Tests grantReferralReward (the new RPC wrapper) and confirms that
// applyReferralCode triggers it best-effort after a successful apply.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  applyReferralCode,
  grantReferralReward,
} from "../referralClient";

beforeEach(() => {
  vi.clearAllMocks();
  supabaseMock.rpc.mockResolvedValue({ data: null, error: null });
});

describe("grantReferralReward", () => {
  it("calls grant_referral_reward RPC with the user id", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, granted_referred: true, granted_owner: true },
      error: null,
    });

    const result = await grantReferralReward("user-1");

    expect(supabaseMock.rpc).toHaveBeenCalledWith(
      "grant_referral_reward",
      { p_referred_user_id: "user-1" },
    );
    expect(result).toEqual({
      ok: true,
      grantedReferred: true,
      grantedOwner: true,
      ownerPendingDay3: false,
      ownerAtCap: false,
    });
  });

  it("reports partial idempotent grant (owner already had reward)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, granted_referred: true, granted_owner: false },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({
      ok: true,
      grantedReferred: true,
      grantedOwner: false,
      ownerPendingDay3: false,
      ownerAtCap: false,
    });
  });

  it("reports both-already-granted as ok with both false", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, granted_referred: false, granted_owner: false },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({
      ok: true,
      grantedReferred: false,
      grantedOwner: false,
      ownerPendingDay3: false,
      ownerAtCap: false,
    });
  });

  it("surfaces ownerPendingDay3 when owner reward is held by Day-3 gate", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: {
        ok: true,
        granted_referred: true,
        granted_owner: false,
        owner_pending_day3: true,
        owner_at_cap: false,
      },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({
      ok: true,
      grantedReferred: true,
      grantedOwner: false,
      ownerPendingDay3: true,
      ownerAtCap: false,
    });
  });

  it("surfaces ownerAtCap when referrer hit the 90-day/year cap", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: {
        ok: true,
        granted_referred: true,
        granted_owner: false,
        owner_pending_day3: false,
        owner_at_cap: true,
      },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({
      ok: true,
      grantedReferred: true,
      grantedOwner: false,
      ownerPendingDay3: false,
      ownerAtCap: true,
    });
  });

  it("propagates structured 'no_referral_use' error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "no_referral_use" },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({ ok: false, error: "no_referral_use" });
  });

  it("propagates 'not_self' when caller != p_referred_user_id", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "not_self" },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({ ok: false, error: "not_self" });
  });

  it("propagates 'orphan_code' when the code's owner row was deleted", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, error: "orphan_code" },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({ ok: false, error: "orphan_code" });
  });

  it("returns rpc_failed on transport error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({ ok: false, error: "rpc_failed" });
  });

  it("returns rpc_failed when payload is malformed (no ok / no recognised error)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { something: "weird" },
      error: null,
    });

    const result = await grantReferralReward("user-1");
    expect(result).toEqual({ ok: false, error: "rpc_failed" });
  });
});

describe("applyReferralCode → reward grant wiring", () => {
  it("fires grant_referral_reward after a successful apply", async () => {
    // First call: apply_referral_code → applied
    // Second call: grant_referral_reward → ok (fired in background)
    supabaseMock.rpc
      .mockResolvedValueOnce({
        data: { ok: true, status: "applied" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: { ok: true, granted_referred: true, granted_owner: true },
        error: null,
      });

    const result = await applyReferralCode("user-1", "ABC234");
    expect(result).toEqual({ ok: true, status: "applied" });

    // Yield a microtask so the unawaited grant call gets dispatched.
    await Promise.resolve();
    await Promise.resolve();

    const calls = supabaseMock.rpc.mock.calls.map((c: any[]) => c[0]);
    expect(calls).toContain("apply_referral_code");
    expect(calls).toContain("grant_referral_reward");
  });

  it("does not fire grant when apply fails (invalid_code)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "invalid_code" },
      error: null,
    });

    const result = await applyReferralCode("user-1", "ABC234");
    expect(result).toEqual({ ok: false, status: "invalid_code" });

    await Promise.resolve();
    await Promise.resolve();

    const calls = supabaseMock.rpc.mock.calls.map((c: any[]) => c[0]);
    expect(calls).toContain("apply_referral_code");
    expect(calls).not.toContain("grant_referral_reward");
  });

  it("does not fire grant when apply fails (self_referral)", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "self_referral" },
      error: null,
    });

    const result = await applyReferralCode("user-1", "ABC234");
    expect(result).toEqual({ ok: false, status: "self_referral" });

    await Promise.resolve();

    const calls = supabaseMock.rpc.mock.calls.map((c: any[]) => c[0]);
    expect(calls).not.toContain("grant_referral_reward");
  });

  it("apply still returns success even if the background grant fails", async () => {
    supabaseMock.rpc
      .mockResolvedValueOnce({
        data: { ok: true, status: "applied" },
        error: null,
      })
      .mockResolvedValueOnce({
        data: null,
        error: { message: "transient db" },
      });

    const result = await applyReferralCode("user-1", "ABC234");
    expect(result).toEqual({ ok: true, status: "applied" });
    // Test passes if no rejection bubbles out — grant failure is swallowed.
    await Promise.resolve();
    await Promise.resolve();
  });
});
