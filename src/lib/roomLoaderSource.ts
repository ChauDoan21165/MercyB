import { logger } from "./logger";
import { getRoomFromDB } from "@/lib/supabaseClient";
import { loadRoomJson } from "./roomJsonResolver";

type LoadSource = "database" | "json";
type CandidateKind = "db" | "json" | "db_salvage";

export type RawDbRoom = {
  entries: any[] | null;
  meta: any;
};

export type RawJsonRoom = {
  room: any;
  entries: any[] | null;
};

export type ChosenCandidate =
  | {
      kind: "db";
      source: "database";
      entries: any[];
      meta: any;
    }
  | {
      kind: "json";
      source: "json";
      entries: any[];
      meta: any;
    }
  | {
      kind: "db_salvage";
      source: "database";
      entries: any[];
      meta: any;
    }
  | null;

export async function loadDbRoom(roomId: string): Promise<RawDbRoom> {
  try {
    const dbResult = await getRoomFromDB(roomId);

    if (!dbResult) {
      return { entries: null, meta: null };
    }

    return {
      entries: Array.isArray(dbResult.entries) ? dbResult.entries : null,
      meta: dbResult.meta || null,
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
    const room = await loadRoomJson(roomId);

    return {
      room: room || null,
      entries: room && Array.isArray(room.entries) ? room.entries : null,
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
  dbEntries: any[] | null;
  dbMeta: any;
  jsonEntries: any[] | null;
  jsonRoom: any;
}): ChosenCandidate {
  const dbPreferredEntries = getPreferredDbEntries(input.dbEntries, input.dbMeta);

  if (hasAnyUsableEntries(dbPreferredEntries)) {
    return {
      kind: "db",
      source: "database",
      entries: dbPreferredEntries!,
      meta: input.dbMeta || null,
    };
  }

  if (hasAnyRows(input.jsonEntries)) {
    return {
      kind: "json",
      source: "json",
      entries: input.jsonEntries!,
      meta: input.jsonRoom || null,
    };
  }

  if (hasAnyRows(input.dbEntries)) {
    return {
      kind: "db_salvage",
      source: "database",
      entries: input.dbEntries!,
      meta: input.dbMeta || null,
    };
  }

  return null;
}

function getPreferredDbEntries(dbEntries: any[] | null, dbMeta: any): any[] | null {
  if (Array.isArray(dbMeta?.entries) && dbMeta.entries.length > 0) {
    return dbMeta.entries;
  }

  if (Array.isArray(dbEntries) && dbEntries.length > 0) {
    return dbEntries;
  }

  return null;
}

function hasAnyRows(entries: any[] | null): boolean {
  return Array.isArray(entries) && entries.length > 0;
}

function hasAnyUsableEntries(entries: any[] | null): boolean {
  if (!Array.isArray(entries) || entries.length === 0) {
    return false;
  }

  return entries.some(hasUsableIdentity);
}

function hasUsableIdentity(entry: any): boolean {
  return Boolean(
    firstNonEmptyString(
      entry?.slug,
      entry?.keyword_en,
      entry?.keywordEn,
      entry?.keyword_vi,
      entry?.keywordVi,
      entry?.title,
      entry?.title_en,
      entry?.titleEn
    )
  );
}

function firstNonEmptyString(...values: any[]): string | null {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return null;
}