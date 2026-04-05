import { logger } from "./logger";
import { AUDIO_FOLDER } from "@/lib/constants/rooms";
import { chooseBestSource, loadDbRoom, loadJsonRoomSafe } from "./roomLoaderSource";
import {
  normalizeEntries,
  normalizeTier,
  salvageDbEntries,
  type KeywordMenu,
} from "./roomLoaderNormalize";

type LoadSource = "database" | "json";
type CandidateKind = "db" | "json" | "db_salvage";

export type LoadMergedRoomSuccess = {
  roomId: string;
  merged: any[];
  hasFullAccess: true;
  keywordMenu: KeywordMenu;
  source: LoadSource;
  meta: any;
  audioBasePath: string;
  roomTier: string;
};

export type LoadMergedRoomFailure = {
  roomId: string;
  merged: [];
  hasFullAccess: false;
  keywordMenu: KeywordMenu;
  errorCode: "ROOM_NOT_FOUND";
};

export type LoadMergedRoomResult =
  | LoadMergedRoomSuccess
  | LoadMergedRoomFailure;

const EMPTY_KEYWORD_MENU: KeywordMenu = { en: [], vi: [] };

export async function loadMergedRoom(
  roomId: string
): Promise<LoadMergedRoomResult> {
  const start = performance.now();

  const db = await loadDbRoom(roomId);
  const json = await loadJsonRoomSafe(roomId);

  const chosen = chooseBestSource({
    dbEntries: db.entries,
    dbMeta: db.meta,
    jsonEntries: json.entries,
    jsonRoom: json.room,
  });

  if (!chosen) {
    return buildFailure(roomId, start);
  }

  return buildSuccess({
    roomId,
    start,
    source: chosen.source,
    entries: chosen.entries,
    meta: chosen.meta,
    mode: chosen.kind,
  });
}

function buildSuccess(input: {
  roomId: string;
  start: number;
  source: LoadSource;
  entries: any[];
  meta: any;
  mode: CandidateKind;
}): LoadMergedRoomSuccess {
  const duration = performance.now() - input.start;

  const normalized =
    input.mode === "db_salvage"
      ? salvageDbEntries(input.entries)
      : normalizeEntries(input.entries);

  logger.info(`[App] Room loaded: ${input.roomId} in ${duration}ms`, {
    source: input.source,
    entryCount: normalized.merged.length,
    roomId: input.roomId,
    duration_ms: duration,
  });

  return {
    roomId: input.roomId,
    merged: normalized.merged,
    hasFullAccess: true,
    keywordMenu: normalized.keywordMenu,
    source: input.source,
    meta: input.meta || null,
    audioBasePath: `${AUDIO_FOLDER}/`,
    roomTier: normalizeTier(input.meta),
  };
}

function buildFailure(roomId: string, start: number): LoadMergedRoomFailure {
  logger.error(`[App] Room failed to load: ${roomId}`, {
    error: "Room not found in database or JSON",
    roomId,
    duration_ms: performance.now() - start,
  });

  return {
    roomId,
    merged: [],
    hasFullAccess: false,
    keywordMenu: EMPTY_KEYWORD_MENU,
    errorCode: "ROOM_NOT_FOUND",
  };
}