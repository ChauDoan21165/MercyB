// @vitest-environment node
//
// Unit tests for the referral-leaderboard opt-in client.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// ── Inline supabase mock ─────────────────────────────────────────────────
// We build a small chained-builder shim per call so we can return whatever
// shape the test needs without leaking state across cases.

const fromMock = vi.fn();

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (...args: unknown[]) => fromMock(...args),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

import {
  validateDisplayName,
  optInToReferralLeaderboard,
  optOutOfReferralLeaderboard,
  getOptInStatus,
} from "../leaderboardOptIn";

describe("validateDisplayName", () => {
  it("rejects empty/whitespace input", () => {
    expect(validateDisplayName("")).toEqual({ ok: false, reason: "empty" });
    expect(validateDisplayName("   ")).toEqual({ ok: false, reason: "empty" });
  });

  it("accepts plain ASCII names within length", () => {
    expect(validateDisplayName("Chau Doan")).toEqual({
      ok: true,
      value: "Chau Doan",
    });
  });

  it("accepts the SFW emoji whitelist", () => {
    expect(validateDisplayName("Anh Tuan ✨")).toEqual({
      ok: true,
      value: "Anh Tuan ✨",
    });
    expect(validateDisplayName("Linh 💎🏆")).toEqual({
      ok: true,
      value: "Linh 💎🏆",
    });
  });

  it("rejects emoji outside the whitelist", () => {
    expect(validateDisplayName("Linh 😎")).toEqual({
      ok: false,
      reason: "disallowed_chars",
    });
    expect(validateDisplayName("Hung 🔥")).toEqual({
      ok: false,
      reason: "disallowed_chars",
    });
  });

  it("rejects names longer than 30 codepoints", () => {
    expect(validateDisplayName("a".repeat(31))).toEqual({
      ok: false,
      reason: "too_long",
    });
    // Whitelisted emoji each count as 1 codepoint.
    expect(validateDisplayName("✨".repeat(31))).toEqual({
      ok: false,
      reason: "too_long",
    });
  });

  it("counts emoji as a single codepoint, not 2 (boundary)", () => {
    // 30 sparkle emoji (each 1 codepoint) → ok.
    const thirty = "✨".repeat(30);
    expect(validateDisplayName(thirty)).toEqual({ ok: true, value: thirty });
  });
});

describe("optInToReferralLeaderboard", () => {
  it("returns failure when no userId is provided", async () => {
    const result = await optInToReferralLeaderboard("", "Chau");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("not_signed_in");
      expect(result.reasonVi).toContain("đăng nhập");
    }
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("returns failure for invalid name without touching the DB", async () => {
    const result = await optInToReferralLeaderboard("u-1", "🔥🔥🔥");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("disallowed_chars");
    expect(fromMock).not.toHaveBeenCalled();
  });

  it("upserts the row on success", async () => {
    const upsert = vi.fn().mockResolvedValue({ error: null });
    fromMock.mockReturnValue({ upsert });

    const result = await optInToReferralLeaderboard("u-1", "Chau Doan");

    expect(fromMock).toHaveBeenCalledWith("referral_leaderboard_optin");
    expect(upsert).toHaveBeenCalledTimes(1);
    const [row, opts] = upsert.mock.calls[0]!;
    expect(row.user_id).toBe("u-1");
    expect(row.display_name).toBe("Chau Doan");
    expect(row.status).toBe("active");
    expect(opts).toEqual({ onConflict: "user_id" });
    expect(result).toEqual({ ok: true });
  });

  it("propagates DB errors with VN copy", async () => {
    const upsert = vi.fn().mockResolvedValue({
      error: { message: "RLS denied" },
    });
    fromMock.mockReturnValue({ upsert });

    const result = await optInToReferralLeaderboard("u-1", "Chau");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.reason).toBe("db_error");
      expect(result.reasonVi).toMatch(/lỗi/);
    }
  });
});

describe("optOutOfReferralLeaderboard", () => {
  it("sets status='opted_out' on the user's row", async () => {
    const eq = vi.fn().mockResolvedValue({ error: null });
    const update = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ update });

    const result = await optOutOfReferralLeaderboard("u-2");

    expect(fromMock).toHaveBeenCalledWith("referral_leaderboard_optin");
    expect(update).toHaveBeenCalledWith(
      expect.objectContaining({ status: "opted_out" }),
    );
    expect(eq).toHaveBeenCalledWith("user_id", "u-2");
    expect(result).toEqual({ ok: true });
  });

  it("returns not_signed_in failure when no userId is given", async () => {
    const result = await optOutOfReferralLeaderboard("");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toBe("not_signed_in");
    expect(fromMock).not.toHaveBeenCalled();
  });
});

describe("getOptInStatus", () => {
  it("returns optedIn:false when there is no row", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({ data: null, error: null });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ select });

    const result = await getOptInStatus("u-3");
    expect(result).toEqual({ optedIn: false, displayName: null });
  });

  it("returns optedIn:true with display_name for an active row", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { display_name: "Linh ✨", status: "active" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ select });

    const result = await getOptInStatus("u-3");
    expect(result).toEqual({ optedIn: true, displayName: "Linh ✨" });
  });

  it("returns optedIn:false for a flagged row (privacy preserved)", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { display_name: "Sus User", status: "flagged" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ select });

    const result = await getOptInStatus("u-3");
    expect(result).toEqual({ optedIn: false, displayName: null });
  });

  it("returns optedIn:false for an opted_out row", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: { display_name: "Quitter", status: "opted_out" },
      error: null,
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ select });

    const result = await getOptInStatus("u-3");
    expect(result).toEqual({ optedIn: false, displayName: null });
  });

  it("returns optedIn:false when DB errors (defaults to safe state)", async () => {
    const maybeSingle = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "rls_denied" },
    });
    const eq = vi.fn().mockReturnValue({ maybeSingle });
    const select = vi.fn().mockReturnValue({ eq });
    fromMock.mockReturnValue({ select });

    const result = await getOptInStatus("u-3");
    expect(result).toEqual({ optedIn: false, displayName: null });
  });
});
