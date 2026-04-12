/**
 * File: roomLoaderSource.ts
 * Path: src/lib/roomLoaderSource.ts
 */

// PATH: src/lib/roomLoaderSource.ts

import { logger } from "./logger";
import { getRoomFromDB } from "@/lib/supabaseClient";
import { loadRoomJson } from "./roomJsonResolver";
import type { BaseRoomEntry, JsonRoom, RoomMeta } from "./roomLoader";

export interface RawDbRoom {
  entries: BaseRoomEntry[] | null;
  meta: RoomMeta | null;
}

export interface RawJsonRoom {
  room: JsonRoom | null;
  entries: BaseRoomEntry[] | null;
}

export type ChosenCandidate =
  | {
      kind: "db";
      source: "database";
      entries: BaseRoomEntry[];
      meta: RoomMeta | null;
    }
  | {
      kind: "json";
      source: "json";
      entries: BaseRoomEntry[];
      meta: JsonRoom | null;
    }
  | {
      kind: "db_salvage";
      source: "database";
      entries: BaseRoomEntry[];
      meta: RoomMeta | null;
    }
  | null;

interface DbResult {
  entries?: unknown;
  meta?: unknown;
}

type JsonLoadResult =
  | JsonRoom
  | {
      success?: unknown;
      room?: unknown;
      entries?: unknown;
      meta?: unknown;
    }
  | null;

export async function loadDbRoom(roomId: string): Promise<RawDbRoom> {
  try {
    const dbResult = (await getRoomFromDB(roomId)) as DbResult | null;

    return {
      entries: Array.isArray(dbResult?.entries)
        ? (dbResult.entries as BaseRoomEntry[])
        : null,
      meta: isRecord(dbResult?.meta) ? (dbResult.meta as RoomMeta) : null,
    };
  } catch (err) {
    logger.error("[roomLoader] DB load failed", {
      roomId,
      error: err instanceof Error ? err.message : String(err),
    });

    return { entries: null, meta: null };
  }
}

export async function loadJsonRoomSafe(roomId: string): Promise<RawJsonRoom> {
  try {
    const payload = (await loadRoomJson(roomId)) as JsonLoadResult;
    const room = unwrapJsonRoomPayload(payload);
    const entries = pickJsonEntries(payload, room);

    return {
      room,
      entries,
    };
  } catch (err) {
    logger.error("[roomLoader] JSON load error", {
      roomId,
      error: err instanceof Error ? err.message : String(err),
    });

    return { room: null, entries: null };
  }
}

export function chooseBestSource(input: {
  dbEntries: BaseRoomEntry[] | null;
  dbMeta: RoomMeta | null;
  jsonEntries: BaseRoomEntry[] | null;
  jsonRoom: JsonRoom | null;
}): ChosenCandidate {
  const dbEntries = preferredDbEntries(input.dbEntries, input.dbMeta);

  if (hasUsableEntries(dbEntries)) {
    return {
      kind: "db",
      source: "database",
      entries: dbEntries,
      meta: input.dbMeta ?? null,
    };
  }

  if (hasRows(input.jsonEntries)) {
    return {
      kind: "json",
      source: "json",
      entries: input.jsonEntries,
      meta: input.jsonRoom ?? null,
    };
  }

  if (hasRows(input.dbEntries)) {
    return {
      kind: "db_salvage",
      source: "database",
      entries: input.dbEntries,
      meta: input.dbMeta ?? null,
    };
  }

  return null;
}

function preferredDbEntries(
  dbEntries: BaseRoomEntry[] | null,
  dbMeta: RoomMeta | null
): BaseRoomEntry[] | null {
  if (Array.isArray(dbMeta?.entries) && dbMeta.entries.length > 0) {
    return dbMeta.entries;
  }

  return Array.isArray(dbEntries) && dbEntries.length > 0 ? dbEntries : null;
}

function hasRows(entries: BaseRoomEntry[] | null): entries is BaseRoomEntry[] {
  return Array.isArray(entries) && entries.length > 0;
}

function hasUsableEntries(
  entries: BaseRoomEntry[] | null
): entries is BaseRoomEntry[] {
  if (!hasRows(entries)) return false;

  // Keep DB on the normal path unless the whole set is clearly legacy-stub data.
  // This preserves older working behavior and lets processEntriesOptimized()
  // handle real-but-minimal DB rows in tests/runtime.
  return !entries.every(isExplicitLegacyStubEntry);
}

function unwrapJsonRoomPayload(payload: JsonLoadResult): JsonRoom | null {
  if (!isRecord(payload)) {
    return null;
  }

  if (isRecord(payload.room)) {
    return payload.room as JsonRoom;
  }

  return payload as JsonRoom;
}

function pickJsonEntries(
  payload: JsonLoadResult,
  room: JsonRoom | null
): BaseRoomEntry[] | null {
  if (isRecord(payload) && Array.isArray(payload.entries)) {
    return payload.entries as BaseRoomEntry[];
  }

  if (Array.isArray(room?.entries)) {
    return room.entries;
  }

  return null;
}

function isExplicitLegacyStubEntry(entry: BaseRoomEntry | null | undefined): boolean {
  const slug = String(entry?.slug ?? "").trim();
  const title = String(
    entry?.title ?? entry?.title_en ?? entry?.titleEn ?? ""
  ).trim();

  return slug.includes("__legacy") || title.includes("__legacy");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}