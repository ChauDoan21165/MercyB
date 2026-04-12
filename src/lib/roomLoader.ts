/**
 * File: roomLoader.ts
 * Path: src/lib/roomLoader.ts
 */

import { logger } from "./logger";
import { AUDIO_FOLDER } from "@/lib/constants/rooms";
import { chooseBestSource, loadDbRoom, loadJsonRoomSafe } from "./roomLoaderSource";
import {
  normalizeEntries,
  normalizeTier,
  salvageDbEntries,
  type KeywordMenu,
  type NormalizedEntriesResult,
} from "./roomLoaderNormalize";
import {
  clearInFlightRoom,
  getCachedRoom,
  getInFlightRoom,
  setCachedRoom,
  setInFlightRoom,
  shouldUseRoomLoaderCache,
} from "./roomLoaderCache";

export type LoadSource = "database" | "json";
export type CandidateKind = "db" | "json" | "db_salvage";

export interface RoomCopy {
  en?: string | null;
  vi?: string | null;
  [key: string]: unknown;
}

export interface BaseRoomEntry {
  slug?: string | null;
  title?: string | null;
  title_en?: string | null;
  titleEn?: string | null;
  keyword_en?: string | null;
  keywordEn?: string | null;
  keyword_vi?: string | null;
  keywordVi?: string | null;
  keywords?: string[] | null;
  keywords_en?: string[] | null;
  keywords_vi?: string[] | null;
  copy?: RoomCopy | string | null;
  tier?: string | null;
  [key: string]: unknown;
}

export interface NormalizedRoomEntry {
  slug: string;
  title?: string | null;
  copy?: RoomCopy | string | null;
  keywords?: string[];
  tier?: string | null;
  [key: string]: unknown;
}

export interface RoomMeta {
  id?: string;
  roomTier?: string | null;
  tier?: string | null;
  accessTier?: string | null;
  entries?: BaseRoomEntry[] | null;
  keywords?: string[] | null;
  title_en?: string | null;
  [key: string]: unknown;
}

export interface JsonRoom {
  id?: string;
  roomTier?: string | null;
  tier?: string | null;
  accessTier?: string | null;
  entries?: BaseRoomEntry[] | null;
  [key: string]: unknown;
}

export interface LoadMergedRoomSuccess {
  roomId: string;
  merged: NormalizedRoomEntry[];
  hasFullAccess: true;
  keywordMenu: KeywordMenu;
  source: LoadSource;
  meta: RoomMeta | JsonRoom | null;
  audioBasePath: string;
  roomTier: string;
  errorCode?: undefined;
}

export interface LoadMergedRoomFailure {
  roomId: string;
  merged: [];
  hasFullAccess: false;
  keywordMenu: KeywordMenu;
  errorCode: "ROOM_NOT_FOUND";
}

export type LoadMergedRoomResult =
  | LoadMergedRoomSuccess
  | LoadMergedRoomFailure;

const EMPTY_KEYWORD_MENU: KeywordMenu = { en: [], vi: [] };

type SafeDbRoom = {
  entries: BaseRoomEntry[] | null;
  meta: RoomMeta | null;
};

type SafeJsonRoom = {
  room: JsonRoom | null;
  entries: BaseRoomEntry[] | null;
};

function nowMs(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function emptyDbRoom(): SafeDbRoom {
  return {
    entries: null,
    meta: null,
  };
}

function emptyJsonRoom(): SafeJsonRoom {
  return {
    room: null,
    entries: null,
  };
}

function hasValidSlug(entries: NormalizedRoomEntry[]): boolean {
  return entries.some(
    (entry) =>
      typeof entry.slug === "string" &&
      entry.slug.trim().length > 0 &&
      !entry.slug.startsWith("entry-"),
  );
}

export async function loadMergedRoom(
  roomId: string
): Promise<LoadMergedRoomResult> {
  if (shouldUseRoomLoaderCache()) {
    const cached = getCachedRoom(roomId);
    if (cached) return cached;

    const inFlight = getInFlightRoom(roomId);
    if (inFlight) return inFlight;

    const promise = loadMergedRoomUncached(roomId)
      .then((result) => {
        setCachedRoom(roomId, result);
        return result;
      })
      .finally(() => {
        clearInFlightRoom(roomId);
      });

    setInFlightRoom(roomId, promise);
    return promise;
  }

  return loadMergedRoomUncached(roomId);
}

async function loadMergedRoomUncached(
  roomId: string
): Promise<LoadMergedRoomResult> {
  const start = nowMs();

  const [dbResult, jsonResult] = await Promise.allSettled([
    loadDbRoom(roomId),
    loadJsonRoomSafe(roomId),
  ]);

  const db: SafeDbRoom =
    dbResult.status === "fulfilled" && dbResult.value
      ? dbResult.value
      : emptyDbRoom();

  const json: SafeJsonRoom =
    jsonResult.status === "fulfilled" && jsonResult.value
      ? jsonResult.value
      : emptyJsonRoom();

  if (dbResult.status === "rejected") {
    logger.info(`[App] DB room source failed, continuing with other sources`, {
      roomId,
      source: "database",
      error:
        dbResult.reason instanceof Error
          ? dbResult.reason.message
          : String(dbResult.reason ?? "unknown"),
    });
  }

  if (jsonResult.status === "rejected") {
    logger.info(`[App] JSON room source failed, continuing with other sources`, {
      roomId,
      source: "json",
      error:
        jsonResult.reason instanceof Error
          ? jsonResult.reason.message
          : String(jsonResult.reason ?? "unknown"),
    });
  }

  const chosen = chooseBestSource({
    dbEntries: db.entries,
    dbMeta: db.meta,
    jsonEntries: json.entries,
    jsonRoom: json.room,
  });

  if (!chosen) {
    return buildFailure(roomId, start);
  }

  const normalized = normalizeChosenEntries(chosen.kind, chosen.entries);

  if (chosen.kind === "db" && !hasValidSlug(normalized.merged)) {
    const salvaged = normalizeChosenEntries("db_salvage", chosen.entries);

    if (hasValidSlug(salvaged.merged)) {
      return buildSuccess(
        roomId,
        "database",
        chosen.meta,
        salvaged,
        start
      );
    }

    if (Array.isArray(json.entries) && json.entries.length > 0) {
      const jsonNormalized = normalizeChosenEntries("json", json.entries);

      if (jsonNormalized.merged.length > 0) {
        return buildSuccess(
          roomId,
          "json",
          json.room ?? null,
          jsonNormalized,
          start
        );
      }
    }
  }

  return buildSuccess(roomId, chosen.source, chosen.meta, normalized, start);
}

function normalizeChosenEntries(
  kind: CandidateKind,
  entries: BaseRoomEntry[]
): NormalizedEntriesResult {
  return kind === "db_salvage"
    ? salvageDbEntries(entries)
    : normalizeEntries(entries);
}

function buildSuccess(
  roomId: string,
  source: LoadSource,
  meta: RoomMeta | JsonRoom | null,
  normalized: NormalizedEntriesResult,
  start: number
): LoadMergedRoomSuccess {
  const duration = nowMs() - start;

  logger.info(`[App] Room loaded: ${roomId} in ${duration}ms`, {
    source,
    entryCount: normalized.merged.length,
    roomId,
    duration_ms: duration,
  });

  return {
    roomId,
    merged: normalized.merged,
    hasFullAccess: true,
    keywordMenu: normalized.keywordMenu,
    source,
    meta: meta ?? null,
    audioBasePath: `${AUDIO_FOLDER}/`,
    roomTier: normalizeTier(meta),
    errorCode: undefined,
  };
}

function buildFailure(roomId: string, start: number): LoadMergedRoomFailure {
  logger.error(`[App] Room failed to load: ${roomId}`, {
    error: "Room not found in database or JSON",
    roomId,
    duration_ms: nowMs() - start,
  });

  return {
    roomId,
    merged: [],
    hasFullAccess: false,
    keywordMenu: EMPTY_KEYWORD_MENU,
    errorCode: "ROOM_NOT_FOUND",
  };
}