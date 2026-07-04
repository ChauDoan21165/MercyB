// src/lib/__tests__/roomJsonResolver.offline.test.ts
//
// Offline contract for loadRoomJson, CORRECTED (production-readiness
// sweep Area 4 / Top-5 #5). The resolver no longer short-circuits to the
// IDB pack on !isOnline(); it is fetch-first so the service worker's
// `lessons` StaleWhileRevalidate cache (every room visited online) can
// serve a "visited then offline" room. Resolution order:
//
//   1. fetch(/data/<id>.json)  — SW serves it from the `lessons` cache
//      (or the ~38-room precache) with no network when offline
//   2. on fetch rejection → the explicit-download IDB pack
//   3. on both miss → kind "offline_unavailable" (offline) /
//      "network" (online) so ChatHub renders the right screen
//
// The normalize/backfill/keyword cases still exercise normalizeOfflineRoom
// via path (2): fetch is stubbed to reject so the IDB pack is reached.

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
import {
  canonicalizeRoomId,
  normalizeOfflineRoom,
  resolveRoomJsonPath,
} from "../roomJsonResolver";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
import * as detector from "@/lib/offline/offlineDetector";
import * as db from "@/lib/offline/offlineDb";

/** Stub global fetch to reject — simulates "SW cache miss + offline". */
function stubFetchReject() {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch,
  );
}

/** Stub global fetch to resolve with a JSON body — simulates the SW
 *  `lessons` cache answering a visited-then-offline room. */
function stubFetchJson(body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      text: async () => JSON.stringify(body),
    })) as unknown as typeof fetch,
  );
}

function stubFetchResponse(status: number, contentType: string, body: string) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok: status >= 200 && status < 300,
      status,
      headers: new Headers({ "content-type": contentType }),
      text: async () => body,
    })) as unknown as typeof fetch,
  );
}

beforeEach(() => {
  vi.clearAllMocks();
  for (const key of Object.keys(PUBLIC_ROOM_MANIFEST)) {
    delete PUBLIC_ROOM_MANIFEST[key];
  }
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("loadRoomJson — offline contract (fetch-first → IDB → unavailable)", () => {
  it("offline + SW cache HIT: returns the room from fetch, IDB pack untouched", async () => {
    // This is THE fix: a room visited online is in the SW `lessons`
    // cache, so the offline fetch resolves and we never need the pack.
    vi.mocked(detector.isOnline).mockReturnValue(false);
    const room = { id: "visited-room", entries: [{ slug: "a" }] };
    stubFetchJson(room);

    const result = await loadRoomJson("visited-room");

    expect(result).toEqual(room);
    expect(db.getRoom).not.toHaveBeenCalled();
  });

  it("offline + SW MISS + not downloaded: throws kind:offline_unavailable", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    stubFetchReject();
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

  it("offline + SW MISS + downloaded pack: returns the unwrapped room JSON", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    stubFetchReject();
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
    stubFetchReject();
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
    stubFetchReject();
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
    stubFetchReject();
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
    stubFetchReject();
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

  it("online + SW/CDN serves it: uses fetch, IDB pack untouched", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(true);
    const room = { id: "online-room" };
    stubFetchJson(room);
    const result = await loadRoomJson("online-room");
    expect(result).toEqual(room);
    expect(db.getRoom).not.toHaveBeenCalled();
  });

  it("online + total network failure + downloaded pack: returns the pack (strict improvement)", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(true);
    stubFetchReject();
    const room = { id: "flaky", entries: [] };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "flaky",
      cachedAt: 0,
      contentVersion: 0,
      json: room,
    });
    const result = await loadRoomJson("flaky");
    expect(result).toMatchObject({ id: "flaky" });
  });

  it("online + network failure + no pack: throws kind:network (unchanged)", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(true);
    stubFetchReject();
    vi.mocked(db.getRoom).mockResolvedValueOnce(undefined);

    let caught: unknown = null;
    try {
      await loadRoomJson("nope");
    } catch (err) {
      caught = err;
    }
    expect(caught).toBeInstanceOf(Error);
    expect((caught as { kind?: string }).kind).toBe("network");
  });

  it("canonicalizes room ids from suffixes, paths, queries, spaces, dashes, and casing", () => {
    expect(canonicalizeRoomId("Depression Support VIP1.json")).toBe("depression_support_vip1");
    expect(canonicalizeRoomId("/data/Anxiety-Relief.json?download=1")).toBe("anxiety_relief");
    expect(canonicalizeRoomId("data/family conflict.JSON")).toBe("family_conflict");
    expect(canonicalizeRoomId(" /room/Level 1 Practice ")).toBe("level_1_practice");
    expect(resolveRoomJsonPath(" /data/Level-1 Practice.json?x=1 ")).toBe(
      "data/level_1_practice.json",
    );
  });

  it("trusts manifest paths and falls back to canonical data paths for unknown rooms", () => {
    PUBLIC_ROOM_MANIFEST.manifest_room = "custom/manifest-room.json";

    expect(resolveRoomJsonPath("Manifest Room")).toBe("custom/manifest-room.json");
    expect(resolveRoomJsonPath("Unknown Room")).toBe("data/unknown_room.json");
  });

  it("normalizes offline envelope, flat, and malformed stored room shapes", () => {
    const entries = [{ slug: "one", keywords_en: ["hello"], keywords_vi: ["xin chao"] }];

    expect(
      normalizeOfflineRoom({
        roomId: "envelope",
        room: { id: "envelope" },
        entries,
      }),
    ).toMatchObject({
      id: "envelope",
      entries,
      keywords_en: ["hello"],
      keywords_vi: ["xin chao"],
    });

    expect(normalizeOfflineRoom({ id: "flat", entries: [] })).toMatchObject({
      id: "flat",
      entries: [],
    });
    expect(normalizeOfflineRoom(null)).toBeNull();
    expect(normalizeOfflineRoom("not-a-room")).toBeNull();
  });

  it("backfills Japanese keywords without overwriting existing top-level Japanese keywords", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(false);
    stubFetchReject();
    const room = {
      id: "ja-backfill",
      entries: [
        { slug: "one", keywords_ja: ["回復", " 癒し "] },
        { slug: "two", keywords_ja: ["癒し", "練習"] },
      ],
    };
    vi.mocked(db.getRoom).mockResolvedValueOnce({
      roomId: "ja-backfill",
      cachedAt: 0,
      contentVersion: 0,
      json: { roomId: "ja-backfill", room, entries: room.entries, audioUrls: [] },
    });

    const result = (await loadRoomJson("ja-backfill")) as Record<string, unknown>;

    expect(result.keywords_ja).toEqual(["回復", "癒し", "練習"]);

    const preserved = normalizeOfflineRoom({
      room: {
        id: "ja-preserved",
        keywords_ja: ["既存"],
        entries: [{ keywords_ja: ["ignored"] }],
      },
    });
    expect(preserved?.keywords_ja).toEqual(["既存"]);
  });

  it("classifies server and invalid-json fetch failures", async () => {
    vi.mocked(detector.isOnline).mockReturnValue(true);
    stubFetchResponse(503, "application/json", "{\"error\":\"down\"}");

    await expect(loadRoomJson("server-fail")).rejects.toMatchObject({
      kind: "server",
    });

    stubFetchResponse(200, "application/json", "{bad json");

    await expect(loadRoomJson("invalid-json")).rejects.toMatchObject({
      kind: "json_invalid",
    });
  });
});
