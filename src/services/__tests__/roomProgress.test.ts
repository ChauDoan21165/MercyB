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

const chain: any = {
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
    mockEq(...args);
    return chain;
  },
  maybeSingle: () => mockMaybeSingle(),
};

const mockFrom = vi.fn(() => chain);

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
      (chain as any)._updatePayload = payload;
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
    const patch = (chain as any)._updatePayload;
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
      (chain as any)._updatePayload = payload;
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
    const patch = (chain as any)._updatePayload;
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
});

describe("roomProgress.updateRoomProgress", () => {
  beforeEach(resetMocks);

  it("progress_pct never decreases (monotonic)", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 75, repeat_count: 3, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      (chain as any)._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    const result = await updateRoomProgress(USER, ROOM, { progressPct: 20 });
    expect(result.ok).toBe(true);
    const patch = (chain as any)._updatePayload;
    expect(patch.progress_pct).toBe(75); // kept high, not lowered to 20
  });

  it("progress_pct increases when new value is higher", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 30, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      (chain as any)._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    await updateRoomProgress(USER, ROOM, { progressPct: 80 });
    const patch = (chain as any)._updatePayload;
    expect(patch.progress_pct).toBe(80);
  });

  it("clamps progress_pct outside 0..100", async () => {
    mockMaybeSingle.mockResolvedValueOnce({
      data: { progress_pct: 0, repeat_count: 1, last_seen_at: new Date().toISOString() },
      error: null,
    });
    mockUpdate.mockImplementationOnce((payload: Record<string, unknown>) => {
      (chain as any)._updatePayload = payload;
      return chain;
    });
    mockEq.mockImplementation(() => {
      const resolved = Promise.resolve({ error: null });
      Object.assign(resolved, chain);
      return resolved;
    });

    await updateRoomProgress(USER, ROOM, { progressPct: 250 });
    expect((chain as any)._updatePayload.progress_pct).toBe(100);
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
});
