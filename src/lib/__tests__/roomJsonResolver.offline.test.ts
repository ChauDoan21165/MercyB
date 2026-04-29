// src/lib/__tests__/roomJsonResolver.offline.test.ts
//
// Offline Lite v1 (A3) — verifies the offline branch added to
// loadRoomJson:
//   - online → unchanged behavior (delegates to fetch)
//   - offline + downloaded → returns the unwrapped room JSON
//   - offline + not downloaded → throws kind: "offline_unavailable"

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/roomManifest", () => ({
  PUBLIC_ROOM_MANIFEST: {} as Record<string, string>,
}));

vi.mock("@/lib/offline/offlineDetector", () => ({
  isOnline: vi.fn(() => true),
}));

vi.mock("@/lib/offline/offlineDb", () => ({
  getRoom: vi.fn(async () => undefined),
}));

import { loadRoomJson } from "../roomJsonResolver";
import * as detector from "@/lib/offline/offlineDetector";
import * as db from "@/lib/offline/offlineDb";

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadRoomJson — offline branch", () => {
  it("throws kind:offline_unavailable when offline and not downloaded", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    vi.mocked(db.getRoom).mockResolvedValueOnce(undefined);

    let caught: unknown = null;
    try {
      await loadRoomJson("missing-room");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as { kind?: string }).kind).toBe("offline_unavailable");
  });

  it("returns the unwrapped room JSON when offline and downloaded", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const room = {
      id: "demo-room",
      keywords_en: ["alpha"],
      keywords_vi: ["alpha-vi"],
      entries: [{ slug: "x" }],
    };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "demo-room",
      cachedAt: 0,
      contentVersion: 0,
      json: { roomId: "demo-room", room, entries: [], audioUrls: [] },
    });

    const result = await loadRoomJson("demo-room");
    expect(result).toMatchObject({
      id: "demo-room",
      keywords_en: ["alpha"],
      keywords_vi: ["alpha-vi"],
      entries: [{ slug: "x" }],
    });
  });

  it("falls back to the stored value when no .room envelope is present", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const room = { id: "flat", entries: [] };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "flat",
      cachedAt: 0,
      contentVersion: 0,
      json: room,
    });
    const result = await loadRoomJson("flat");
    expect(result).toMatchObject({ id: "flat" });
  });

  it("backfills room.entries from envelope.entries when inner room lacks them", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const innerRoom = { id: "split-shape" };
    const envEntries = [{ slug: "a", keywords_en: ["x"], keywords_vi: ["x-vi"] }];
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "split-shape",
      cachedAt: 0,
      contentVersion: 0,
      json: {
        roomId: "split-shape",
        room: innerRoom,
        entries: envEntries,
        audioUrls: [],
      },
    });

    const result = (await loadRoomJson("split-shape")) as Record<string, unknown>;
    expect(result.entries).toEqual(envEntries);
  });

  it("synthesizes top-level keywords_en/vi from per-entry arrays when missing", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const room = {
      id: "no-top-keywords",
      entries: [
        { slug: "one", keywords_en: ["recovery", "healing"], keywords_vi: ["phục hồi", "chữa lành"] },
        { slug: "two", keywords_en: ["healing", "therapy"], keywords_vi: ["chữa lành", "liệu pháp"] },
      ],
    };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "no-top-keywords",
      cachedAt: 0,
      contentVersion: 0,
      json: { roomId: "no-top-keywords", room, entries: room.entries, audioUrls: [] },
    });

    const result = (await loadRoomJson("no-top-keywords")) as Record<string, unknown>;
    expect(result.keywords_en).toEqual(["recovery", "healing", "therapy"]);
    expect(result.keywords_vi).toEqual(["phục hồi", "chữa lành", "liệu pháp"]);
  });

  it("preserves existing top-level keywords_en/vi without overwriting", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const room = {
      id: "has-top",
      keywords_en: ["addiction", "recovery"],
      keywords_vi: ["nghiện", "phục hồi"],
      entries: [{ slug: "x", keywords_en: ["one-off"], keywords_vi: ["one-off-vi"] }],
    };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "has-top",
      cachedAt: 0,
      contentVersion: 0,
      json: { roomId: "has-top", room, entries: room.entries, audioUrls: [] },
    });

    const result = (await loadRoomJson("has-top")) as Record<string, unknown>;
    expect(result.keywords_en).toEqual(["addiction", "recovery"]);
    expect(result.keywords_vi).toEqual(["nghiện", "phục hồi"]);
  });

  it("uses fetch when online (offline branch not taken)", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(true);
    const room = { id: "online-room" };
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => ({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        text: async () => JSON.stringify(room),
      })) as unknown as typeof fetch,
    );
    const result = await loadRoomJson("online-room");
    expect(result).toEqual(room);
    expect(db.getRoom).not.toHaveBeenCalled();
  });
});
