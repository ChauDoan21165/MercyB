import { describe, it, expect, vi, beforeEach } from "vitest";

/**
 * Hand-rolled mock. The shared supabaseMock returns the same chain for every
 * call; we need per-call control over `.insert()` / `.update()` / `.maybeSingle()`
 * to verify the writer's branches.
 */
const mockMaybeSingle = vi.fn();
const mockInsert = vi.fn();
const mockUpdate = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();

type MockChain = {
  select: (...args: unknown[]) => MockChain;
  insert: (...args: unknown[]) => unknown;
  update: (...args: unknown[]) => MockChain;
  eq: (...args: unknown[]) => unknown;
  maybeSingle: () => unknown;
  _updatePayload?: Record<string, unknown>;
};

const chain: MockChain = {
  select: (...args: unknown[]) => {
    mockSelect(...args);
    return chain;
  },
  insert: (...args: unknown[]) => mockInsert(...args),
  update: (...args: unknown[]) => {
    mockUpdate(...args);
    return chain;
  },
  eq: (...args: unknown[]) => {
    return mockEq(...args) ?? chain;
  },
  maybeSingle: () => mockMaybeSingle(),
};

const mockFrom = vi.fn((..._args: unknown[]) => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

// Import after mock.
import {
  ROOM_PROGRESS_APP_ID,
  trackRoomEntry,
  updateRoomProgress,
} from "../roomProgress";

const USER = "user-1";
const ROOM = "room-xyz";

function resetMocks() {
  mockMaybeSingle.mockReset();
  mockInsert.mockReset();
  mockUpdate.mockReset();
  mockEq.mockReset();
  mockSelect.mockReset();
  mockFrom.mockClear();
  delete chain._updatePayload;
}

describe("roomProgress.trackRoomEntry", () => {
  beforeEach(resetMocks);

  it("no-ops silently when userId or roomId is missing", async () => {
    const r1 = await trackRoomEntry(null, ROOM);
    const r2 = await trackRoomEntry(USER, "");
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("INSERTs a new row on first entry, repeat_count = 1", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const result = await trackRoomEntry(USER, ROOM, { keywordEn: "hello" });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.action).toBe("inserted");

    expect(mockInsert).toHaveBeenCalledOnce();
    const payload = mockInsert.mock.calls[0][0];
    expect(payload).toMatchObject({
      user_id: USER,
      app_id: ROOM_PROGRESS_APP_ID,
      room_id: ROOM,
      progress_pct: 0,
      repeat_count: 1,
      last_keyword_en: "hello",
    });
    expect(typeof payload.last_seen_at).toBe("string");
  });

  it("UPDATES last_seen_at AND bumps repeat_count when > 30 min since last entry", async () => {
    const oldIso = new Date(Date.now() - 60 * 60 * 1000).toISOString(); // 1h ago
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 40, repeat_count: 2, last_seen_at: oldIso },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    // final eq() returns the resolved promise-like response
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await trackRoomEntry(USER, ROOM);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.action).toBe("updated");
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch.repeat_count).toBe(3); // 2 + 1
    expect(typeof patch.last_seen_at).toBe("string");
  });

  it("THROTTLES repeat_count when < 30 min since last entry", async () => {
    const recentIso = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10m ago
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 40, repeat_count: 2, last_seen_at: recentIso },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await trackRoomEntry(USER, ROOM);

    expect(result.ok).toBe(true);
    if (result.ok) expect(result.action).toBe("throttled");
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch.repeat_count).toBeUndefined(); // not bumped
    expect(typeof patch.last_seen_at).toBe("string");
  });

  it("retries once on transient error then succeeds", async () => {
    mockMaybeSingle
      .mockResolvedValueOnce({ data: null, error: { message: "transient" } });

    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const result = await trackRoomEntry(USER, ROOM);
    expect(result.ok).toBe(true);
    // maybeSingle called twice = initial + retry
    expect(mockMaybeSingle).toHaveBeenCalledTimes(2);
  }, 5000);

  it("returns ok:false on persistent failure (retry also fails)", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: null,
      error: { message: "still broken" },
    });

    const result = await trackRoomEntry(USER, ROOM);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("still broken");
  }, 5000);

  it("patches explicit null keyword and entry ids on existing rows", async () => {
    const oldIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 10, repeat_count: 1, last_seen_at: oldIso },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await trackRoomEntry(USER, ROOM, {
      keywordEn: null,
      entryId: null,
    });

    expect(result.ok).toBe(true);
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch.last_keyword_en).toBeNull();
    expect(patch.last_entry_id).toBeNull();
  });

  it("does not overwrite keyword or entry ids when options are omitted", async () => {
    const oldIso = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 10, repeat_count: 1, last_seen_at: oldIso },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await trackRoomEntry(USER, ROOM);

    expect(result.ok).toBe(true);
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch).not.toHaveProperty("last_keyword_en");
    expect(patch).not.toHaveProperty("last_entry_id");
  });

  it("uses the provided app id override for lookup and insert", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const result = await trackRoomEntry(USER, ROOM, {
      appId: "custom_app",
      keywordEn: "hello",
    });

    expect(result.ok).toBe(true);
    expect(mockEq.mock.calls).toEqual(
      expect.arrayContaining([["app_id", "custom_app"]]),
    );
    expect(mockInsert.mock.calls[0][0]).toMatchObject({
      app_id: "custom_app",
      last_keyword_en: "hello",
    });
  });
});

describe("roomProgress.updateRoomProgress", () => {
  beforeEach(resetMocks);

  it("no-ops silently when userId or roomId is missing", async () => {
    const r1 = await updateRoomProgress(null, ROOM);
    const r2 = await updateRoomProgress(USER, "");
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("progress_pct never decreases (monotonic)", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 75, repeat_count: 3, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: 20 });
    expect(result.ok).toBe(true);
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch.progress_pct).toBe(75); // kept high, not lowered to 20
  });

  it("progress_pct increases when new value is higher", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 30, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    await updateRoomProgress(USER, ROOM, { progressPct: 80 });
    const patch = chain._updatePayload as Record<string, unknown>;
    expect(patch.progress_pct).toBe(80);
  });

  it("clamps progress_pct outside 0..100", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 0, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    await updateRoomProgress(USER, ROOM, { progressPct: 250 });
    expect((chain._updatePayload as Record<string, unknown>).progress_pct).toBe(100);
  });

  it("lazy-INSERTs when row is missing", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const result = await updateRoomProgress(USER, ROOM, {
      keywordEn: "first",
      progressPct: 10,
    });
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.action).toBe("inserted");
    expect(mockInsert).toHaveBeenCalledOnce();
    const payload = mockInsert.mock.calls[0][0];
    expect(payload.progress_pct).toBe(10);
    expect(payload.last_keyword_en).toBe("first");
  });

  it("clamps negative progress to zero on lazy insert", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });
    mockInsert.mockResolvedValueOnce({ error: null });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: -25 });

    expect(result.ok).toBe(true);
    expect(mockInsert.mock.calls[0][0].progress_pct).toBe(0);
  });

  it("rounds fractional progress before applying monotonic updates", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 30, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: 33.6 });

    expect(result.ok).toBe(true);
    expect((chain._updatePayload as Record<string, unknown>).progress_pct).toBe(34);
  });

  it("preserves existing progress when provided progress is NaN", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 40, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: Number.NaN });

    expect(result.ok).toBe(true);
    expect((chain._updatePayload as Record<string, unknown>).progress_pct).toBe(40);
  });

  it("returns ok:false when progress update write keeps failing", async () => {
    mockMaybeSingle.mockResolvedValue({
      data: { progress_pct: 40, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementation((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: { message: "write blocked" } });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: 60 });

    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toContain("write blocked");
    expect(mockUpdate).toHaveBeenCalledTimes(2);
  }, 5000);

  it("uses the provided app id override for lookup and update", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 20, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      chain._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, {
      appId: "custom_app",
      progressPct: 25,
    });

    expect(result.ok).toBe(true);
    expect(mockEq.mock.calls).toEqual(
      expect.arrayContaining([["app_id", "custom_app"]]),
    );
    expect((chain._updatePayload as Record<string, unknown>).progress_pct).toBe(25);
  });
});
