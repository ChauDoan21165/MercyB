// src/lib/lifetime/__tests__/lifetimeClient.test.ts
//
// Pure email validation tested directly. Supabase paths use the shared
// mock to assert the right calls go out and the result shape propagates.

import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabaseClient", async () => {
  const mod = await vi.importActual<any>("@/test/mocks/supabaseMock");
  const supabase = mod.createSupabaseMock();
  return { supabase, __mock: supabase };
});

import * as SupaMod from "@/lib/supabaseClient";
const supabaseMock = (SupaMod as any).__mock;

import {
  getMySignup,
  getSignupCount,
  isLikelyValidEmail,
  signUpForLifetime,
} from "../lifetimeClient";

describe("isLikelyValidEmail", () => {
  it("accepts a typical email", () => {
    expect(isLikelyValidEmail("name@example.com")).toBe(true);
  });

  it("accepts a +tag alias", () => {
    expect(isLikelyValidEmail("name+tag@example.com")).toBe(true);
  });

  it("accepts a .vn TLD with two dots", () => {
    expect(isLikelyValidEmail("admin@hcmus.edu.vn")).toBe(true);
  });

  it("trims surrounding whitespace before validating", () => {
    expect(isLikelyValidEmail("  name@example.com  ")).toBe(true);
  });

  it("rejects missing @", () => {
    expect(isLikelyValidEmail("name.example.com")).toBe(false);
  });

  it("rejects missing dot in domain", () => {
    expect(isLikelyValidEmail("name@example")).toBe(false);
  });

  it("rejects empty string", () => {
    expect(isLikelyValidEmail("")).toBe(false);
  });
});

describe("signUpForLifetime", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects empty email without calling supabase", async () => {
    const result = await signUpForLifetime({
      userId: "u1",
      email: "   ",
      reasonCode: "commitment",
    });
    expect(result).toEqual({ ok: false, error: "email required" });
    expect(supabaseMock.from).not.toHaveBeenCalled();
  });

  it("inserts the row with all fields wired", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    supabaseMock.from.mockImplementationOnce(() => ({ insert }));

    const result = await signUpForLifetime({
      userId: "u1",
      email: "  name@example.com ",
      country: "Vietnam",
      reasonCode: "gift",
      reasonText: "for my mom",
    });

    expect(result).toEqual({ ok: true });
    expect(supabaseMock.from).toHaveBeenCalledWith("lifetime_intent_signups");
    expect(insert).toHaveBeenCalledWith({
      user_id: "u1",
      email: "name@example.com",
      country: "Vietnam",
      reason_code: "gift",
      reason_text: "for my mom",
    });
  });

  it("nulls out optional fields when omitted", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    supabaseMock.from.mockImplementationOnce(() => ({ insert }));

    await signUpForLifetime({
      userId: "u1",
      email: "name@example.com",
      reasonCode: "savings",
    });

    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({
        country: null,
        reason_text: null,
      }),
    );
  });

  it("propagates DB error", async () => {
    const insert = vi.fn().mockResolvedValue({
      error: { message: "rls denied" },
    });
    supabaseMock.from.mockImplementationOnce(() => ({ insert }));

    const result = await signUpForLifetime({
      userId: "u1",
      email: "name@example.com",
      reasonCode: "commitment",
    });
    expect(result).toEqual({ ok: false, error: "rls denied" });
  });
});

describe("getMySignup", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns false when there is no row", async () => {
    // Default chain.maybeSingle returns { data: null, error: null }
    const has = await getMySignup("u1");
    expect(has).toBe(false);
    expect(supabaseMock.from).toHaveBeenCalledWith("lifetime_intent_signups");
  });

  it("returns true when a row exists", async () => {
    const maybeSingle = vi
      .fn()
      .mockResolvedValue({ data: { id: "row-1" }, error: null });
    const limit = vi.fn(() => ({ maybeSingle }));
    const eq = vi.fn(() => ({ limit }));
    const select = vi.fn(() => ({ eq }));
    supabaseMock.from.mockImplementationOnce(() => ({ select }));

    const has = await getMySignup("u1");
    expect(has).toBe(true);
    expect(eq).toHaveBeenCalledWith("user_id", "u1");
  });
});

describe("getSignupCount", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the RPC count on success", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: 12, error: null });
    const n = await getSignupCount();
    expect(n).toBe(12);
    expect(supabaseMock.rpc).toHaveBeenCalledWith("lifetime_intent_count");
  });

  it("returns 0 on error", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({
      data: null,
      error: { message: "boom" },
    });
    const n = await getSignupCount();
    expect(n).toBe(0);
  });

  it("returns 0 when the RPC returns a non-number", async () => {
    supabaseMock.rpc.mockResolvedValueOnce({ data: null, error: null });
    const n = await getSignupCount();
    expect(n).toBe(0);
  });
});
