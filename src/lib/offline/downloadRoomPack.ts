// src/lib/offline/downloadRoomPack.ts
//
// Offline Lite v1 — download a single room for offline use.
//
// Reuses the foundation contract:
//   - Structured records in IndexedDB via offlineDb.putRoom (table: rooms).
//     We store the entire room object as `OfflineRoomRecord.json`, plus a
//     small RoomPackJson envelope around it (title, entries, keywords,
//     resolved audio URLs, downloadedAt) so consumers can read the pack
//     back without re-deriving fields.
//   - Audio bytes go in the Cache API via audioCache.put. They never enter
//     IndexedDB. See docs/offline-lite-v1.md "Storage choices".
//
// Contract notes:
//   - The shape passed in `room` is the same AnyRoom shape RoomRenderer
//     already consumes (loadRoomJson output). We do not invent a new
//     normalized form here — RoomRenderer's own pre-processors will run
//     when the cached pack is later replayed.
//   - contentVersion is read from /version.json. The current build does
//     not emit a `contentVersion` field; we default to 0 so the record
//     remains valid until the field is added.
//   - Audio resolution goes through resolveRoomAudioUrl so the same URL
//     the live player uses is the URL we cache. Local-only keys
//     (kids/*, music/*, http(s) absolute) and Supabase public URLs are
//     all handled uniformly.

import { putRoom, getRoom, type OfflineRoomRecord } from "./offlineDb";
import * as audioCache from "./audioCache";
import { resolveRoomAudioUrl, toAudioKey } from "@/lib/roomAudioResolver";

export interface RoomPackJson {
  roomId: string;
  title: string;
  room: unknown;
  entries: unknown[];
  keywords: string[];
  audioUrls: string[];
  downloadedAt: number;
}

export interface DownloadRoomPackInput {
  roomId: string;
  room: Record<string, unknown>;
  title?: string;
}

export interface DownloadRoomPackResult {
  ok: boolean;
  roomId: string;
  audioCached: number;
  audioFailed: number;
  contentVersion: number;
  error?: Error;
}

const AUDIO_FIELD_KEYS = [
  "audio_url",
  "audio_en",
  "audio",
  "audioEn",
  "audioEN",
  "audioUrl",
] as const;

const TITLE_FIELD_KEYS = [
  "title",
  "roomTitle",
  "name",
  "label",
  "heading",
  "slugTitle",
  "id",
] as const;

const KEYWORD_LIST_KEYS = ["keywords", "keywords_en", "keywords_vi"] as const;

const KEYWORD_SCALAR_KEYS = [
  "keyword_en",
  "keywordEn",
  "keyword_vi",
  "keywordVi",
] as const;

function asString(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function getTitle(room: Record<string, unknown>, fallback: string): string {
  for (const k of TITLE_FIELD_KEYS) {
    const v = asString(room[k]);
    if (v) return v;
  }
  return fallback;
}

function getEntries(room: Record<string, unknown>): unknown[] {
  return Array.isArray(room.entries) ? (room.entries as unknown[]) : [];
}

function getKeywords(room: Record<string, unknown>): string[] {
  const out: string[] = [];
  const seen = new Set<string>();

  function push(raw: unknown): void {
    const v = asString(raw);
    if (!v || seen.has(v)) return;
    seen.add(v);
    out.push(v);
  }

  function pushList(raw: unknown): void {
    if (Array.isArray(raw)) raw.forEach(push);
  }

  for (const k of KEYWORD_LIST_KEYS) pushList(room[k]);

  for (const entry of getEntries(room)) {
    const e = (entry ?? {}) as Record<string, unknown>;
    for (const k of KEYWORD_LIST_KEYS) pushList(e[k]);
    for (const k of KEYWORD_SCALAR_KEYS) push(e[k]);
  }

  return out;
}

function collectAudioRefs(room: Record<string, unknown>): string[] {
  const refs = new Set<string>();

  function visit(v: unknown): void {
    const s = asString(v);
    if (s) refs.add(s);
  }

  for (const k of AUDIO_FIELD_KEYS) visit(room[k]);

  for (const entry of getEntries(room)) {
    const e = (entry ?? {}) as Record<string, unknown>;
    for (const k of AUDIO_FIELD_KEYS) visit(e[k]);
  }

  return Array.from(refs);
}

async function fetchContentVersion(): Promise<number> {
  if (typeof fetch !== "function") return 0;
  try {
    const res = await fetch(`/version.json?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const j = (await res.json()) as { contentVersion?: unknown };
    const v = j?.contentVersion;
    return typeof v === "number" && Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export async function isRoomPackAvailable(roomId: string): Promise<boolean> {
  if (!roomId) return false;
  try {
    const r = await getRoom(roomId);
    return r !== undefined && r !== null;
  } catch {
    return false;
  }
}

export async function downloadRoomPack(
  input: DownloadRoomPackInput,
): Promise<DownloadRoomPackResult> {
  const { roomId, room } = input;
  if (!roomId || !room) {
    return {
      ok: false,
      roomId: roomId ?? "",
      audioCached: 0,
      audioFailed: 0,
      contentVersion: 0,
      error: new Error("downloadRoomPack: missing roomId or room"),
    };
  }

  const contentVersion = await fetchContentVersion();
  const title = input.title?.trim() || getTitle(room, roomId);
  const entries = getEntries(room);
  const keywords = getKeywords(room);

  const refs = collectAudioRefs(room);
  const resolvedUrls: string[] = [];
  for (const raw of refs) {
    const key = toAudioKey(raw);
    if (!key) continue;
    try {
      const r = await resolveRoomAudioUrl(key);
      if (r?.url) resolvedUrls.push(r.url);
    } catch {
      // Skip refs that fail to resolve — caching is opportunistic.
    }
  }
  const uniqueUrls = Array.from(new Set(resolvedUrls));

  let audioCached = 0;
  let audioFailed = 0;
  for (const url of uniqueUrls) {
    const ok = await audioCache.put(url);
    if (ok) audioCached += 1;
    else audioFailed += 1;
  }

  const pack: RoomPackJson = {
    roomId,
    title,
    room,
    entries,
    keywords,
    audioUrls: uniqueUrls,
    downloadedAt: Date.now(),
  };

  const record: OfflineRoomRecord = {
    roomId,
    json: pack,
    cachedAt: Date.now(),
    contentVersion,
  };

  try {
    await putRoom(record);
  } catch (err) {
    return {
      ok: false,
      roomId,
      audioCached,
      audioFailed,
      contentVersion,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }

  return {
    ok: true,
    roomId,
    audioCached,
    audioFailed,
    contentVersion,
  };
}

export const __INTERNAL__ = {
  AUDIO_FIELD_KEYS,
  TITLE_FIELD_KEYS,
  KEYWORD_LIST_KEYS,
  KEYWORD_SCALAR_KEYS,
  getTitle,
  getEntries,
  getKeywords,
  collectAudioRefs,
  fetchContentVersion,
};
