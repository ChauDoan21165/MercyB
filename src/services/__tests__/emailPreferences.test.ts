// src/services/__tests__/emailPreferences.test.ts
//
// Coverage for the client-side email-preferences service. The supabase
// singleton is mocked so the tests don't need real env vars.

import { afterEach, describe, expect, it, vi } from "vitest";

const rpcMock = vi.fn();
const updateMock = vi.fn();
const getUserMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    auth: {
      getUser: (...args: unknown[]) => getUserMock(...args),
    },
    rpc: (...args: unknown[]) => rpcMock(...args),
    from: () => ({
      update: (patch: unknown) => ({
        eq: (col: string, val: unknown) => updateMock(patch, col, val),
      }),
    }),
  },
}));

afterEach(() => {
  rpcMock.mockReset();
  updateMock.mockReset();
  getUserMock.mockReset();
});

import {
  getEmailPreferences,
  unsubscribeByToken,
  updateEmailPreferences,
} from "../emailPreferences";

describe("unsubscribeByToken", () => {
  it("returns invalid_token for empty input", async () => {
    const out = await unsubscribeByToken("");
    expect(out.ok).toBe(false);
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("returns success when the RPC reports ok=true", async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ ok: true, message: "unsubscribed" }],
      error: null,
    });
    const out = await unsubscribeByToken("real_token");
    expect(out.ok).toBe(true);
    expect(rpcMock).toHaveBeenCalledWith("unsubscribe_by_token", {
      p_token: "real_token",
    });
  });

  it("returns token_not_found when RPC says so", async () => {
    rpcMock.mockResolvedValueOnce({
      data: [{ ok: false, message: "token_not_found" }],
      error: null,
    });
    const out = await unsubscribeByToken("missing");
    expect(out).toEqual({ ok: false, message: "token_not_found" });
  });

  it("maps errors to rpc_error", async () => {
    rpcMock.mockResolvedValueOnce({ data: null, error: { message: "boom" } });
    const out = await unsubscribeByToken("real");
    expect(out).toEqual({ ok: false, message: "rpc_error" });
  });

  it("trims whitespace before validating", async () => {
    const out = await unsubscribeByToken("   ");
    expect(out.ok).toBe(false);
    expect(rpcMock).not.toHaveBeenCalled();
  });
});

describe("getEmailPreferences", () => {
  it("returns defaults when no row is returned", async () => {
    rpcMock.mockResolvedValueOnce({ data: [], error: null });
    const out = await getEmailPreferences();
    expect(out).toEqual({
      reEngagementEnabled: true,
      trialExpiryEnabled: true,
      weeklyDigestEnabled: true,
      unsubscribedAt: null,
    });
  });

  it("maps DB column names to camelCase", async () => {
    rpcMock.mockResolvedValueOnce({
      data: [
        {
          email_re_engagement_enabled: false,
          email_trial_expiry_enabled: true,
          email_weekly_digest_enabled: false,
          email_unsubscribed_at: "2026-04-27T05:00:00Z",
        },
      ],
      error: null,
    });
    const out = await getEmailPreferences();
    expect(out.reEngagementEnabled).toBe(false);
    expect(out.trialExpiryEnabled).toBe(true);
    expect(out.weeklyDigestEnabled).toBe(false);
    expect(out.unsubscribedAt).toBe("2026-04-27T05:00:00Z");
  });
});

describe("updateEmailPreferences", () => {
  it("throws when no authenticated user", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: null } });
    await expect(updateEmailPreferences({ reEngagementEnabled: false })).rejects.toThrow(
      /Not authenticated/,
    );
  });

  it("clears unsubscribed_at when re-enabling any flag", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    updateMock.mockResolvedValueOnce({ error: null });
    rpcMock.mockResolvedValueOnce({ data: [], error: null }); // post-update read
    await updateEmailPreferences({ reEngagementEnabled: true });
    const patch = updateMock.mock.calls[0][0];
    expect(patch.email_re_engagement_enabled).toBe(true);
    expect(patch.email_unsubscribed_at).toBeNull();
  });

  it("does NOT clear unsubscribed_at when disabling", async () => {
    getUserMock.mockResolvedValueOnce({ data: { user: { id: "u1" } } });
    updateMock.mockResolvedValueOnce({ error: null });
    rpcMock.mockResolvedValueOnce({ data: [], error: null });
    await updateEmailPreferences({ reEngagementEnabled: false });
    const patch = updateMock.mock.calls[0][0];
    expect(patch.email_re_engagement_enabled).toBe(false);
    expect("email_unsubscribed_at" in patch).toBe(false);
  });
});
