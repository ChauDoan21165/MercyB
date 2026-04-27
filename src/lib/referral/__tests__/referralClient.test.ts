// src/lib/referral/__tests__/referralClient.test.ts
//
// Pure helpers tested directly. RPC + table paths use the shared
// supabase mock to assert the right calls go out and the tagged
// statuses propagate back as the right TypeScript shape.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  REFERRAL_CODE_ALPHABET,
  REFERRAL_CODE_LENGTH,
  applyReferralCode,
  buildShareUrl,
  generateCode,
  getMyCode,
  getReferralStats,
  isValidReferralCodeShape,
  normalizeReferralCode,
  readReferralCodeFromUrl,
} from "../referralClient";

describe("alphabet + shape", () => {
  it("alphabet excludes ambiguous characters (0, 1, I, O)", () => {
    expect(REFERRAL_CODE_ALPHABET).not.toMatch(/[01IO]/);
  });

  it("alphabet has 32 characters", () => {
    expect(REFERRAL_CODE_ALPHABET.length).toBe(32);
  });

  it("REFERRAL_CODE_LENGTH is 6", () => {
    expect(REFERRAL_CODE_LENGTH).toBe(6);
  });

  it("isValidReferralCodeShape accepts canonical 6-char code", () => {
    expect(isValidReferralCodeShape("ABC234")).toBe(true);
    expect(isValidReferralCodeShape("ZZZZZZ")).toBe(true);
  });

  it("isValidReferralCodeShape rejects ambiguous chars", () => {
    expect(isValidReferralCodeShape("ABC0DE")).toBe(false); // 0
    expect(isValidReferralCodeShape("ABC1DE")).toBe(false); // 1
    expect(isValidReferralCodeShape("ABCIDE")).toBe(false); // I
    expect(isValidReferralCodeShape("ABCODE")).toBe(false); // O
  });

  it("isValidReferralCodeShape rejects wrong length", () => {
    expect(isValidReferralCodeShape("ABC23")).toBe(false);
    expect(isValidReferralCodeShape("ABC2345")).toBe(false);
  });

  it("isValidReferralCodeShape rejects lowercase", () => {
    expect(isValidReferralCodeShape("abc234")).toBe(false);
  });

  it("normalizeReferralCode trims + uppercases", () => {
    expect(normalizeReferralCode("  abc234 ")).toBe("ABC234");
  });
});

describe("generateCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the RPC-supplied code on success", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: "ABC234", error: null });
    const result = await generateCode("u1");
    expect(result).toEqual({ ok: true, code: "ABC234" });
    expect(supabaseMock.rpc).toHaveBeenCalledWith("get_or_create_referral_code");
  });

  it("returns ok:false when the RPC errors", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "rls denied" },
    });
    const result = await generateCode("u1");
    expect(result).toEqual({ ok: false, error: "rls denied" });
  });

  it("returns ok:false when the RPC returns a non-string", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: null });
    const result = await generateCode("u1");
    expect(result.ok).toBe(false);
  });
});

describe("getMyCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns null when there is no row", async () => {
    // default chain.maybeSingle returns { data: null, error: null }
    const code = await getMyCode("u1");
    expect(code).toBeNull();
    expect(supabaseMock.from).toHaveBeenCalledWith("referral_codes");
  });

  it("returns the code when a row exists", async () => {
    const maybeSingle = vi
      .fn()
      .mockResolvedValue({ data: { code: "DEF234" }, error: null });
    const eq = vi.fn(() => ({ maybeSingle }));
    const select = vi.fn(() => ({ eq }));
    supabaseMock.from.mockImplementationOnce(() => ({ select }));

    const code = await getMyCode("u1");
    expect(code).toBe("DEF234");
    expect(eq).toHaveBeenCalledWith("owner_user_id", "u1");
  });
});

describe("applyReferralCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects malformed codes without calling supabase", async () => {
    const result = await applyReferralCode("u1", "abc");
    expect(result).toEqual({ ok: false, status: "invalid_code" });
    expect(supabaseMock.rpc).not.toHaveBeenCalled();
  });

  it("normalises (trim + upper) before sending", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, status: "applied" },
      error: null,
    });
    await applyReferralCode("u1", "  abc234  ");
    expect(supabaseMock.rpc).toHaveBeenCalledWith("apply_referral_code", {
      p_code: "ABC234",
    });
  });

  it("propagates 'self_referral' as ok:false", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "self_referral" },
      error: null,
    });
    const result = await applyReferralCode("u1", "ABC234");
    expect(result).toEqual({ ok: false, status: "self_referral" });
  });

  it("propagates 'already_used' as ok:false", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "already_used" },
      error: null,
    });
    const result = await applyReferralCode("u1", "ABC234");
    expect(result).toEqual({ ok: false, status: "already_used" });
  });

  it("propagates 'invalid_code' as ok:false", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: false, status: "invalid_code" },
      error: null,
    });
    const result = await applyReferralCode("u1", "ABC234");
    expect(result).toEqual({ ok: false, status: "invalid_code" });
  });

  it("returns ok:true on 'applied'", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: { ok: true, status: "applied" },
      error: null,
    });
    const result = await applyReferralCode("u1", "ABC234");
    expect(result).toEqual({ ok: true, status: "applied" });
  });

  it("falls back to invalid_code when the RPC errors", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    const result = await applyReferralCode("u1", "ABC234");
    expect(result.ok).toBe(false);
    expect(result.status).toBe("invalid_code");
  });
});

describe("getReferralStats", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns zero state when the user has no code", async () => {
    const stats = await getReferralStats("u1");
    expect(stats).toEqual({
      code: null,
      usesCount: 0,
      pendingOwnerRewards: 0,
      completedOwnerRewards: 0,
      totalDaysEarned: 0,
    });
  });

  it("returns code + uses + pending + completed + total days", async () => {
    // 1. referral_codes maybeSingle → { code, uses_count }
    const codeMaybeSingle = vi.fn().mockResolvedValue({
      data: { code: "ABC234", uses_count: 3 },
      error: null,
    });
    const codeEq = vi.fn(() => ({ maybeSingle: codeMaybeSingle }));
    const codeSelect = vi.fn(() => ({ eq: codeEq }));

    // 2. referral_uses .eq.eq returns 2 ungranted rows
    const usesEq2 = vi.fn().mockResolvedValue({
      data: [{ reward_granted_owner: false }, { reward_granted_owner: false }],
      error: null,
    });
    const usesEq1 = vi.fn(() => ({ eq: usesEq2 }));
    const usesSelect = vi.fn(() => ({ eq: usesEq1 }));

    supabaseMock.from
      .mockImplementationOnce(() => ({ select: codeSelect }))
      .mockImplementationOnce(() => ({ select: usesSelect }));

    const stats = await getReferralStats("u1");
    // 3 total uses, 2 pending → 1 completed → 7 days earned
    expect(stats).toEqual({
      code: "ABC234",
      usesCount: 3,
      pendingOwnerRewards: 2,
      completedOwnerRewards: 1,
      totalDaysEarned: 7,
    });
    expect(usesEq1).toHaveBeenCalledWith("code", "ABC234");
    expect(usesEq2).toHaveBeenCalledWith("reward_granted_owner", false);
  });
});

describe("share URL helpers", () => {
  it("buildShareUrl appends the ref query param", () => {
    expect(buildShareUrl("ABC234", "https://example.com")).toBe(
      "https://example.com/?ref=ABC234",
    );
  });

  it("buildShareUrl preserves existing path", () => {
    expect(buildShareUrl("ABC234", "https://example.com/signup")).toBe(
      "https://example.com/signup?ref=ABC234",
    );
  });

  it("readReferralCodeFromUrl extracts a valid code", () => {
    expect(
      readReferralCodeFromUrl("https://example.com/?ref=ABC234"),
    ).toBe("ABC234");
  });

  it("readReferralCodeFromUrl normalises lowercase", () => {
    expect(
      readReferralCodeFromUrl("https://example.com/?ref=abc234"),
    ).toBe("ABC234");
  });

  it("readReferralCodeFromUrl returns null on missing param", () => {
    expect(readReferralCodeFromUrl("https://example.com/")).toBeNull();
  });

  it("readReferralCodeFromUrl returns null on malformed code", () => {
    expect(
      readReferralCodeFromUrl("https://example.com/?ref=tooshort"),
    ).toBeNull();
  });
});
