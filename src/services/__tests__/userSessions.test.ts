import { describe, it, expect, vi, beforeEach } from "vitest";

const mockUpsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

const chain: any = {
  upsert: (...args: unknown[]) => mockUpsert(...args),
  update: (...args: unknown[]) => {
    mockUpdate(...args);
    return chain;
  },
  eq: (...args: unknown[]) => {
    mockEq(...args);
    return chain;
  },
};

const mockFrom = vi.fn(() => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

const mockIsTrackingEnabled = vi.fn();
vi.mock("../behaviorTrackingFlag", () => ({
  isTrackingEnabled: (...args: unknown[]) => mockIsTrackingEnabled(...args),
}));

import { heartbeatSession, logUserSession } from "../userSessions";

const USER = "user-abc";
const TOKEN = "session-token-xyz";

function resetAll() {
  mockUpsert.mockReset();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockFrom.mockClear();
  mockIsTrackingEnabled.mockReset();
}

describe("userSessions.logUserSession", () => {
  beforeEach(resetAll);

  it("no-ops when userId or sessionToken missing", async () => {
    expect(await logUserSession(null, TOKEN)).toEqual({ ok: false });
    expect(await logUserSession(USER, null)).toEqual({ ok: false });
    expect(mockIsTrackingEnabled).not.toHaveBeenCalled();
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("skips write when flag is OFF", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(false);
    const result = await logUserSession(USER, TOKEN);
    expect(result).toEqual({ ok: false });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("upserts into user_sessions when flag is ON", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockResolvedValueOnce({ error: null });

    const result = await logUserSession(USER, TOKEN);

    expect(result).toEqual({ ok: true });
    expect(mockFrom).toHaveBeenCalledWith("user_sessions");
    expect(mockUpsert).toHaveBeenCalledTimes(1);
    const [payload, options] = mockUpsert.mock.calls[0];
    expect(payload.user_id).toBe(USER);
    expect(payload.session_id).toBe(TOKEN);
    expect(payload.device_type).toMatch(/^(desktop|mobile)$/);
    expect(payload.last_activity).toEqual(expect.any(String));
    expect(options).toEqual({ onConflict: "user_id,device_type" });
  });

  it("returns ok=false when upsert errors", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockResolvedValueOnce({ error: { message: "rls blocked" } });

    const result = await logUserSession(USER, TOKEN);
    expect(result).toEqual({ ok: false });
  });

  it("returns ok=false when upsert throws", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockRejectedValueOnce(new Error("net"));
    const result = await logUserSession(USER, TOKEN);
    expect(result).toEqual({ ok: false });
  });
});

describe("userSessions.heartbeatSession", () => {
  beforeEach(resetAll);

  it("no-ops when userId missing", async () => {
    expect(await heartbeatSession(null)).toEqual({ ok: false });
    expect(mockIsTrackingEnabled).not.toHaveBeenCalled();
  });

  it("skips update when flag is OFF", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(false);
    const result = await heartbeatSession(USER);
    expect(result).toEqual({ ok: false });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("updates last_activity when flag is ON", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    // Final eq returns the promise with no error
    mockEq.mockImplementation(function (this: any) {
      return chain;
    });
    // Emulate: chain.update(...).eq(...).eq(...) then `await` resolves.
    // The simplest mock: make eq return a Promise for the final call.
    let eqCallCount = 0;
    mockEq.mockImplementation((...args: unknown[]) => {
      eqCallCount += 1;
      if (eqCallCount >= 2) {
        return Promise.resolve({ error: null });
      }
      return chain;
    });

    const result = await heartbeatSession(USER);
    expect(result).toEqual({ ok: true });
    expect(mockFrom).toHaveBeenCalledWith("user_sessions");
    expect(mockUpdate).toHaveBeenCalledTimes(1);
    const [payload] = mockUpdate.mock.calls[0];
    expect(payload.last_activity).toEqual(expect.any(String));
  });
});
