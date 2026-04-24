import { describe, it, expect, vi, beforeEach } from "vitest";

const mockInsert = vi.fn();

const chain: any = {
  insert: (...args: unknown[]) => mockInsert(...args),
};

const mockFrom = vi.fn(() => chain);

vi.mock("@/lib/supabaseClient", () => ({
  supabase: { from: (...args: unknown[]) => mockFrom(...args) },
}));

const mockIsTrackingEnabled = vi.fn();
vi.mock("../behaviorTrackingFlag", () => ({
  isTrackingEnabled: (...args: unknown[]) => mockIsTrackingEnabled(...args),
}));

import {
  trackKeyword,
  trackMessageSent,
  trackRoomCompletion,
  trackRoomVisit,
} from "../userBehavior";

const USER = "user-abc";
const ROOM = "room-123";

function resetAll() {
  mockInsert.mockReset();
  mockFrom.mockClear();
  mockIsTrackingEnabled.mockReset();
}

describe("userBehavior writers", () => {
  beforeEach(resetAll);

  it("trackRoomVisit no-ops on missing args", async () => {
    expect(await trackRoomVisit(null, ROOM)).toEqual({ ok: false });
    expect(await trackRoomVisit(USER, null)).toEqual({ ok: false });
    expect(mockIsTrackingEnabled).not.toHaveBeenCalled();
  });

  it("trackRoomVisit skips insert when flag is OFF", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(false);
    const r = await trackRoomVisit(USER, ROOM);
    expect(r).toEqual({ ok: false });
    expect(mockFrom).not.toHaveBeenCalled();
  });

  it("trackRoomVisit inserts visited row when flag is ON", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockResolvedValueOnce({ error: null });

    const r = await trackRoomVisit(USER, ROOM);
    expect(r).toEqual({ ok: true });

    expect(mockFrom).toHaveBeenCalledWith("user_behavior_tracking");
    const [payload] = mockInsert.mock.calls[0];
    expect(payload.user_id).toBe(USER);
    expect(payload.room_id).toBe(ROOM);
    expect(payload.interaction_type).toBe("visited");
    expect(payload.interaction_data.timestamp).toEqual(expect.any(String));
  });

  it("trackKeyword requires non-empty keyword", async () => {
    expect(await trackKeyword(USER, ROOM, "")).toEqual({ ok: false });
    expect(mockIsTrackingEnabled).not.toHaveBeenCalled();
  });

  it("trackKeyword inserts keyword_triggered row with keyword", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockResolvedValueOnce({ error: null });

    const r = await trackKeyword(USER, ROOM, "family");
    expect(r).toEqual({ ok: true });
    const [payload] = mockInsert.mock.calls[0];
    expect(payload.interaction_type).toBe("keyword_triggered");
    expect(payload.interaction_data.keyword).toBe("family");
  });

  it("trackMessageSent inserts message_length", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockResolvedValueOnce({ error: null });

    const r = await trackMessageSent(USER, ROOM, 42);
    expect(r).toEqual({ ok: true });
    const [payload] = mockInsert.mock.calls[0];
    expect(payload.interaction_type).toBe("message_sent");
    expect(payload.interaction_data.message_length).toBe(42);
  });

  it("trackRoomCompletion inserts completed row", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockResolvedValueOnce({ error: null });

    const r = await trackRoomCompletion(USER, ROOM);
    expect(r).toEqual({ ok: true });
    const [payload] = mockInsert.mock.calls[0];
    expect(payload.interaction_type).toBe("completed");
  });

  it("insert errors degrade gracefully to ok:false", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockResolvedValueOnce({ error: { message: "rls" } });
    const r = await trackRoomVisit(USER, ROOM);
    expect(r).toEqual({ ok: false });
  });

  it("insert throw is caught and returns ok:false", async () => {
    mockIsTrackingEnabled.mockResolvedValueOnce(true);
    mockInsert.mockRejectedValueOnce(new Error("net"));
    const r = await trackRoomVisit(USER, ROOM);
    expect(r).toEqual({ ok: false });
  });
});
