import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockUpsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();

type MockChain = {
  upsert: (...args: unknown[]) => unknown;
  update: (...args: unknown[]) => MockChain;
  eq: (...args: unknown[]) => unknown;
};

const chain: MockChain = {
  upsert: (...args: unknown[]) => mockUpsert(...args),
  update: (...args: unknown[]) => {
    mockUpdate(...args);
    return chain;
  },
  eq: (...args: unknown[]) => {
    return mockEq(...args) ?? chain;
  },
};

const mockFrom = vi.fn((..._args: unknown[]) => chain);

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
  vi.unstubAllGlobals();
  mockUpsert.mockReset();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockFrom.mockClear();
  mockIsTrackingEnabled.mockReset();
}

afterEach(() => {
  vi.unstubAllGlobals();
});

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
    expect(mockUpsert).not.toHaveBeenCalled();
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

  it("detects mobile device_type from common mobile user agents", async () => {
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
      userAgentData: { platform: "iOS" },
    });
    vi.stubGlobal("window", { screen: { width: 390, height: 844 } });
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockResolvedValueOnce({ error: null });

    const result = await logUserSession(USER, TOKEN);

    expect(result).toEqual({ ok: true });
    expect(mockUpsert.mock.calls[0][0]).toMatchObject({
      device_type: "mobile",
      device_info: {
        userAgent: expect.stringContaining("iPhone"),
        platform: "iOS",
        screenWidth: 390,
        screenHeight: 844,
      },
    });
  });

  it("detects desktop device_type from desktop user agents", async () => {
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0)",
    });
    vi.stubGlobal("window", { screen: { width: 1440, height: 900 } });
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockResolvedValueOnce({ error: null });

    const result = await logUserSession(USER, TOKEN);

    expect(result).toEqual({ ok: true });
    expect(mockUpsert.mock.calls[0][0]).toMatchObject({
      device_type: "desktop",
      device_info: {
        userAgent: expect.stringContaining("Macintosh"),
        platform: expect.stringContaining("Macintosh"),
        screenWidth: 1440,
        screenHeight: 900,
      },
    });
  });

  it("survives missing browser globals with safe device_info", async () => {
    vi.stubGlobal("navigator", undefined);
    vi.stubGlobal("window", undefined);
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpsert.mockResolvedValueOnce({ error: null });

    const result = await logUserSession(USER, TOKEN);

    expect(result).toEqual({ ok: true });
    expect(mockUpsert.mock.calls[0][0]).toMatchObject({
      device_type: "desktop",
      device_info: {},
    });
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
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("updates last_activity when flag is ON", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    // Final eq returns the promise with no error
    mockEq.mockImplementation(() => chain);
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

  it("scopes heartbeat updates by user_id and detected device_type", async () => {
    vi.stubGlobal("navigator", {
      userAgent: "Mozilla/5.0 (Linux; Android 14; Pixel 8)",
    });
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    let eqCallCount = 0;
    mockEq.mockImplementation(() => {
      eqCallCount += 1;
      if (eqCallCount >= 2) {
        return Promise.resolve({ error: null });
      }
      return chain;
    });

    const result = await heartbeatSession(USER);

    expect(result).toEqual({ ok: true });
    expect(mockEq.mock.calls).toEqual([
      ["user_id", USER],
      ["device_type", "mobile"],
    ]);
  });

  it("returns ok=false when heartbeat update errors", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    let eqCallCount = 0;
    mockEq.mockImplementation(() => {
      eqCallCount += 1;
      if (eqCallCount >= 2) {
        return Promise.resolve({ error: { message: "rls blocked" } });
      }
      return chain;
    });

    const result = await heartbeatSession(USER);

    expect(result).toEqual({ ok: false });
  });

  it("returns ok=false when heartbeat update throws", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockUpdate.mockImplementationOnce(() => {
      throw new Error("network down");
    });

    const result = await heartbeatSession(USER);

    expect(result).toEqual({ ok: false });
  });
});
