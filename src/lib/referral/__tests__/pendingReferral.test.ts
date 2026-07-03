// src/lib/referral/__tests__/pendingReferral.test.ts
//
// Covers the A9 capture-on-boot + auto-apply-on-auth wiring.
//
// Boundary conditions tested:
//   - capturePendingReferralFromUrl: stores a valid code, ignores
//     malformed and missing codes, normalises lowercase.
//   - readPendingReferralCode: round-trips the stored value, returns
//     null on absent or malformed.
//   - clearPendingReferralCode: removes the entry.
//   - applyPendingReferralOnAuth: no-op when no code; calls apply RPC
//     when a code exists; clears the entry regardless of outcome.

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

import {
  capturePendingReferralFromUrl,
  readPendingReferralCode,
  clearPendingReferralCode,
  applyPendingReferralOnAuth,
} from "../referralClient";

beforeEach(() => {
  vi.clearAllMocks();
  window.sessionStorage.clear();
});

describe("capturePendingReferralFromUrl", () => {
  it("stores a valid 6-char code from ?ref=", () => {
    const stored = capturePendingReferralFromUrl(
      "https://mercyblade.com/?ref=ABC234",
    );
    expect(stored).toBe("ABC234");
    expect(readPendingReferralCode()).toBe("ABC234");
  });

  it("normalises lowercase input", () => {
    capturePendingReferralFromUrl("https://mercyblade.com/?ref=abc234");
    expect(readPendingReferralCode()).toBe("ABC234");
  });

  it("ignores malformed codes (wrong length)", () => {
    const stored = capturePendingReferralFromUrl(
      "https://mercyblade.com/?ref=tooshort",
    );
    expect(stored).toBeNull();
    expect(readPendingReferralCode()).toBeNull();
  });

  it("ignores ambiguous chars (0, 1, I, O)", () => {
    expect(
      capturePendingReferralFromUrl("https://mercyblade.com/?ref=ABCIDE"),
    ).toBeNull();
  });

  it("returns null when there is no ?ref param", () => {
    expect(capturePendingReferralFromUrl("https://mercyblade.com/")).toBeNull();
    expect(readPendingReferralCode()).toBeNull();
  });
});

describe("clearPendingReferralCode", () => {
  it("removes a stored code", () => {
    capturePendingReferralFromUrl("https://mercyblade.com/?ref=ABC234");
    expect(readPendingReferralCode()).toBe("ABC234");
    clearPendingReferralCode();
    expect(readPendingReferralCode()).toBeNull();
  });
});

describe("applyPendingReferralOnAuth", () => {
  it("no-ops and returns null when no code is pending", async () => {
    const result = await applyPendingReferralOnAuth("user-1");
    expect(result).toBeNull();
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("calls apply_referral_code with the captured code, then clears it", async () => {
    capturePendingReferralFromUrl("https://mercyblade.com/?ref=ABC234");
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, status: "applied" },
      error: null,
    });

    const result = await applyPendingReferralOnAuth("user-1");

    expect(supabaseMock.rpc).toHaveBeenCalledWith("apply_referral_code", {
      p_code: "ABC234",
    });
    expect(result).toEqual({ ok: true, status: "applied" });
    // Clears regardless of outcome — we don't want to retry forever.
    expect(readPendingReferralCode()).toBeNull();
  });

  it("clears the pending code even when apply fails (already_used)", async () => {
    capturePendingReferralFromUrl("https://mercyblade.com/?ref=ABC234");
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "already_used" },
      error: null,
    });

    const result = await applyPendingReferralOnAuth("user-1");
    expect(result).toEqual({ ok: false, status: "already_used" });
    expect(readPendingReferralCode()).toBeNull();
  });

  it("clears the pending code on self-referral", async () => {
    capturePendingReferralFromUrl("https://mercyblade.com/?ref=ABC234");
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "self_referral" },
      error: null,
    });

    await applyPendingReferralOnAuth("user-1");
    expect(readPendingReferralCode()).toBeNull();
  });
});
