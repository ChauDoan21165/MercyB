import { describe, it, expect, vi, beforeEach } from "vitest";
import { resetCanonicalStorageMock } from "@/test/storageMock";

// Mock supabase first so the migration module picks it up on import.
const mockRpc = vi.fn();
const mockGetUser = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockMaybeSingle = vi.fn();

const profileChain: any = {
  select: (...args: unknown[]) => {
    mockSelect(...args);
    return profileChain;
  },
  update: (...args: unknown[]) => {
    mockUpdate(...args);
    return profileChain;
  },
  eq: (...args: unknown[]) => {
    mockEq(...args);
    return profileChain;
  },
  maybeSingle: () => mockMaybeSingle(),
};
const telemetryChain: any = {
  insert: (...args: unknown[]) => {
    mockInsert(...args);
    return Promise.resolve({ error: null });
  },
};

const mockFrom = vi.fn((table: string) =>
  table === "user_behavior_tracking" ? telemetryChain : profileChain,
);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: {
    from: (table: string) => mockFrom(table),
    rpc: (...args: unknown[]) => mockRpc(...args),
    auth: { getUser: () => mockGetUser() },
  },
}));

vi.mock("@/lib/featureFlags", () => ({
  FEATURE_FLAGS: {
    SERVER_STREAKS_ENABLED: true,
    MERCY_HOST_ENABLED: false,
  },
}));

import {
  collectLocalStreakValues,
  clearLocalStreakKeys,
  migrateLocalStreakOnce,
  writeBrowserTimezoneOnce,
} from "../streakMigration";
import { __resetStreakCacheForTests, getCachedStreak } from "../streakCache";

beforeEach(() => {
  resetCanonicalStorageMock();
  mockRpc.mockReset();
  mockGetUser.mockReset();
  mockInsert.mockReset();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockSelect.mockReset();
  mockMaybeSingle.mockReset();
  mockFrom.mockClear();
  __resetStreakCacheForTests();
});

describe("collectLocalStreakValues", () => {
  it("returns zeros when nothing is in localStorage", () => {
    expect(collectLocalStreakValues()).toEqual({
      current: 0,
      longest: 0,
      lastStudiedDate: null,
    });
  });

  it("reads all three sources (points, mercy memory, room_progress)", () => {
    localStorage.setItem("mb.points.streak", "7");
    localStorage.setItem("mb.points.lastDaily", "2026-04-23");
    localStorage.setItem(
      "mercy_host_memory",
      JSON.stringify({ streakDays: 5, longestStreak: 12, greetings: 3 }),
    );
    localStorage.setItem("room_progress", JSON.stringify({ streak: 4 }));

    const r = collectLocalStreakValues();
    expect(r.current).toBe(7);
    expect(r.lastStudiedDate).toBe("2026-04-23");
    // longest picks up MAX(longestStreak, streakDays, room_progress.streak, current)
    expect(r.longest).toBe(12);
  });

  it("tolerates corrupt JSON in mercy_host_memory", () => {
    localStorage.setItem("mercy_host_memory", "{broken");
    localStorage.setItem("mb.points.streak", "3");
    const r = collectLocalStreakValues();
    expect(r.current).toBe(3);
    expect(r.longest).toBe(3);
  });
});

describe("clearLocalStreakKeys — surgical mercy_host_memory cleanup", () => {
  it("removes the 3 standalone keys", () => {
    localStorage.setItem("mb.points.streak", "7");
    localStorage.setItem("mb.points.lastDaily", "2026-04-23");
    localStorage.setItem("room_progress", "{\"streak\":4}");

    clearLocalStreakKeys();

    expect(localStorage.getItem("mb.points.streak")).toBeNull();
    expect(localStorage.getItem("mb.points.lastDaily")).toBeNull();
    expect(localStorage.getItem("room_progress")).toBeNull();
  });

  it("strips streakDays + longestStreak from mercy_host_memory but preserves other fields", () => {
    localStorage.setItem(
      "mercy_host_memory",
      JSON.stringify({
        streakDays: 5,
        longestStreak: 12,
        greetings: 3,
        tiersCelebrated: [1, 2, 3],
        onboarding: { step: 2 },
      }),
    );

    clearLocalStreakKeys();

    const after = JSON.parse(localStorage.getItem("mercy_host_memory")!);
    expect(after.streakDays).toBeUndefined();
    expect(after.longestStreak).toBeUndefined();
    // non-streak fields survive
    expect(after.greetings).toBe(3);
    expect(after.tiersCelebrated).toEqual([1, 2, 3]);
    expect(after.onboarding).toEqual({ step: 2 });
  });

  it("leaves corrupt mercy_host_memory alone (can't safely mutate)", () => {
    localStorage.setItem("mercy_host_memory", "{corrupt");
    clearLocalStreakKeys();
    expect(localStorage.getItem("mercy_host_memory")).toBe("{corrupt");
  });
});

describe("migrateLocalStreakOnce — idempotency + MAX merge", () => {
  const USER_ID = "user-abc";

  it("skips when no auth user", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });
    const r = await migrateLocalStreakOnce();
    expect(r).toEqual({ skipped: true, reason: "anon" });
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("skips when local guard says already done", async () => {
    localStorage.setItem("mb.streak.migrated", "true");
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    const r = await migrateLocalStreakOnce();
    expect(r).toEqual({ skipped: true, reason: "already_local_guard" });
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("calls RPC with collected local values", async () => {
    localStorage.setItem("mb.points.streak", "4");
    localStorage.setItem("mb.points.lastDaily", "2026-04-22");
    localStorage.setItem(
      "mercy_host_memory",
      JSON.stringify({ longestStreak: 10 }),
    );

    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: {
        already_migrated: false,
        current: 4,
        longest: 10,
        last_date: "2026-04-22",
      },
      error: null,
    });

    const r = await migrateLocalStreakOnce();

    expect(mockRpc).toHaveBeenCalledWith("migrate_local_streak", {
      p_local_current: 4,
      p_local_longest: 10,
      p_local_last_studied_date: "2026-04-22",
    });
    expect(r).toMatchObject({ skipped: false, alreadyMigrated: false });
  });

  it("clears localStorage keys + sets guard after successful RPC", async () => {
    localStorage.setItem("mb.points.streak", "4");
    localStorage.setItem("mb.points.lastDaily", "2026-04-22");
    localStorage.setItem("room_progress", "{\"streak\":3}");

    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: { already_migrated: false, current: 4, longest: 4, last_date: "2026-04-22" },
      error: null,
    });

    await migrateLocalStreakOnce();

    expect(localStorage.getItem("mb.points.streak")).toBeNull();
    expect(localStorage.getItem("mb.points.lastDaily")).toBeNull();
    expect(localStorage.getItem("room_progress")).toBeNull();
    expect(localStorage.getItem("mb.streak.migrated")).toBe("true");
  });

  it("warms the streak cache from the RPC response", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: { already_migrated: false, current: 9, longest: 42, last_date: "2026-04-23" },
      error: null,
    });

    await migrateLocalStreakOnce();

    const cached = getCachedStreak();
    expect(cached?.current).toBe(9);
    expect(cached?.longest).toBe(42);
    expect(cached?.lastStudiedDate).toBe("2026-04-23");
  });

  it("server returns already_migrated=true → still clears local keys", async () => {
    localStorage.setItem("mb.points.streak", "4");
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: { already_migrated: true, current: 15, longest: 20, last_date: "2026-04-23" },
      error: null,
    });

    const r = await migrateLocalStreakOnce();

    expect(r).toMatchObject({ skipped: false, alreadyMigrated: true });
    expect(localStorage.getItem("mb.points.streak")).toBeNull();
    expect(localStorage.getItem("mb.streak.migrated")).toBe("true");
  });

  it("RPC error → leaves localStorage intact, no guard set, telemetry logged", async () => {
    localStorage.setItem("mb.points.streak", "4");
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: null,
      error: { message: "network glitch" },
    });

    const r = await migrateLocalStreakOnce();

    expect(r).toMatchObject({ skipped: false, error: "network glitch" });
    expect(localStorage.getItem("mb.points.streak")).toBe("4");
    expect(localStorage.getItem("mb.streak.migrated")).toBeNull();
    expect(mockInsert).toHaveBeenCalled();
    const payload = mockInsert.mock.calls[0][0];
    expect(payload.interaction_type).toBe("streak_migration_attempt");
    expect(payload.interaction_data.success).toBe(false);
  });

  it("telemetry logs success payload with merged values", async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: { id: USER_ID } } });
    mockRpc.mockResolvedValueOnce({
      data: { already_migrated: false, current: 4, longest: 4, last_date: "2026-04-22" },
      error: null,
    });
    await migrateLocalStreakOnce();
    expect(mockInsert).toHaveBeenCalled();
    const payload = mockInsert.mock.calls[0][0];
    expect(payload.interaction_type).toBe("streak_migration_attempt");
    expect(payload.interaction_data.success).toBe(true);
    expect(payload.interaction_data.merged).toEqual({
      current: 4,
      longest: 4,
      lastDate: "2026-04-22",
    });
  });
});

describe("writeBrowserTimezoneOnce", () => {
  const USER_ID = "user-xyz";

  beforeEach(() => {
    vi.stubGlobal("Intl", {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: "America/Los_Angeles" }),
      }),
    });
  });

  it("updates profiles.timezone when stored value is still the Vietnam default", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
    mockMaybeSingle.mockResolvedValueOnce({
      data: { timezone: "Asia/Ho_Chi_Minh" },
      error: null,
    });
    // Second profile call is the UPDATE — make it resolve
    mockEq.mockImplementation(() => {
      return Promise.resolve({ error: null });
    });

    await writeBrowserTimezoneOnce();

    // At least one update call should have happened setting timezone
    const updates = mockUpdate.mock.calls;
    expect(updates.length).toBeGreaterThanOrEqual(1);
    expect(updates[0][0]).toMatchObject({ timezone: "America/Los_Angeles" });
  });

  it("does NOT update when user already has a non-default timezone set", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });
    mockMaybeSingle.mockResolvedValueOnce({
      data: { timezone: "Europe/Berlin" },
      error: null,
    });

    await writeBrowserTimezoneOnce();

    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("does NOT update when browser timezone is also Asia/Ho_Chi_Minh", async () => {
    vi.stubGlobal("Intl", {
      DateTimeFormat: () => ({
        resolvedOptions: () => ({ timeZone: "Asia/Ho_Chi_Minh" }),
      }),
    });
    mockGetUser.mockResolvedValue({ data: { user: { id: USER_ID } } });

    await writeBrowserTimezoneOnce();

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockGetUser).not.toHaveBeenCalled(); // early-return before auth check
  });
});
