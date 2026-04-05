// src/lib/roomLoader.ts

import { logger } from "./logger";
import { getRoomFromDB } from "@/lib/supabaseClient";
import { loadRoomJson } from "./roomJsonResolver";
import { processEntriesOptimized } from "./roomLoaderHelpers";
import { AUDIO_FOLDER } from "@/lib/constants/rooms";

type LoadSource = "database" | "json";

export async function loadMergedRoom(roomId: string) {
  const start = performance.now();

  let dbEntries: any[] | null = null;
  let roomMeta: any = null;

  // ===============================
  // 1. LOAD DB
  // ===============================
  try {
    const dbResult = await getRoomFromDB(roomId);

    if (dbResult) {
      dbEntries = Array.isArray(dbResult.entries) ? dbResult.entries : null;
      roomMeta = dbResult.meta || null;
    }
  } catch (err) {
    logger.error("[roomLoader] DB load failed", {
      roomId,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  // Prefer room-level embedded entries first when present.
  // This matches snapshot tests where DB row metadata contains the usable
  // normalized entries while dbEntries may only contain thin index rows.
  const dbCandidateEntries =
    Array.isArray(roomMeta?.entries) && roomMeta.entries.length > 0
      ? roomMeta.entries
      : Array.isArray(dbEntries) && dbEntries.length > 0
        ? dbEntries
        : null;

  // ===============================
  // 2. VALID DB
  // Only treat DB as "valid" if at least one row has some usable identity.
  // Malformed DB should fall through so JSON can override it.
  // ===============================
  if (Array.isArray(dbCandidateEntries) && dbCandidateEntries.length > 0) {
    const hasUsableDbEntry = dbCandidateEntries.some((e) =>
      hasUsableIdentity(e)
    );

    if (hasUsableDbEntry) {
      return buildSuccess(
        dbCandidateEntries,
        "database",
        roomMeta,
        start,
        roomId
      );
    }
  }

  // ===============================
  // 3. JSON
  // JSON wins over malformed DB if it exists
  // ===============================
  let roomJson: any = null;
  let jsonEntries: any[] | null = null;

  try {
    roomJson = await loadRoomJson(roomId);

    if (roomJson && Array.isArray(roomJson.entries)) {
      jsonEntries = roomJson.entries;
    }
  } catch (err) {
    logger.error("[roomLoader] JSON load error", {
      roomId,
      error: err instanceof Error ? err.message : String(err),
    });
  }

  if (Array.isArray(jsonEntries) && jsonEntries.length > 0) {
    return buildSuccess(jsonEntries, "json", roomJson, start, roomId);
  }

  // ===============================
  // 4. DB SALVAGE
  // Only runs if JSON is missing/invalid and DB had rows
  // ===============================
  if (
    (!jsonEntries || jsonEntries.length === 0) &&
    Array.isArray(dbEntries) &&
    dbEntries.length > 0
  ) {
    const safe = dbEntries.map((row, i) => ({
      slug:
        firstNonEmptyString(
          row?.slug,
          row?.keyword_en,
          row?.keywordEn,
          row?.title
        ) || `entry-${i}`,
      title:
        (typeof row?.title === "string" && row.title.trim()) ||
        `Entry ${i + 1}`,
      copy: row?.copy ?? null,
      keywords: Array.isArray(row?.keywords) ? row.keywords : [],
      tier: "free",
    }));

    const slugs = safe.map((e) => e.slug);

    return {
      roomId,
      merged: safe,
      hasFullAccess: true,
      keywordMenu: {
        en: slugs,
        vi: slugs,
      },
      source: "database" as const,
      meta: roomMeta || null,
      audioBasePath: `${AUDIO_FOLDER}/`,
      roomTier: normalizeTier(roomMeta),
    };
  }

  // ===============================
  // FAIL SAFE
  // ===============================
  logger.error(`[App] Room failed to load: ${roomId}`, {
    error: "Room not found in database or JSON",
    roomId,
    duration_ms: performance.now() - start,
  });

  return {
    roomId,
    merged: [],
    hasFullAccess: false,
    keywordMenu: { en: [], vi: [] },
    errorCode: "ROOM_NOT_FOUND",
  };
}

function buildSuccess(
  entries: any[],
  source: LoadSource,
  roomMeta: any,
  start: number,
  roomId: string
) {
  const duration = performance.now() - start;

  logger.info(`[App] Room loaded: ${roomId} in ${duration}ms`, {
    source,
    entryCount: entries.length,
    roomId,
    duration_ms: duration,
  });

  const processed = processEntriesOptimized(entries);

  return {
    roomId,
    merged: Array.isArray(processed?.merged) ? processed.merged : [],
    hasFullAccess: true,
    keywordMenu: {
      en: Array.isArray(processed?.keywordMenu?.en)
        ? processed.keywordMenu.en
        : [],
      vi: Array.isArray(processed?.keywordMenu?.vi)
        ? processed.keywordMenu.vi
        : [],
    },
    source,
    meta: roomMeta || null,
    audioBasePath: `${AUDIO_FOLDER}/`,
    roomTier: normalizeTier(roomMeta),
  };
}

function hasUsableIdentity(entry: any): boolean {
  return Boolean(
    firstNonEmptyString(
      entry?.slug,
      entry?.keyword_en,
      entry?.keywordEn,
      entry?.title,
      entry?.keyword_vi,
      entry?.keywordVi
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

function normalizeTier(meta: any): string {
  const raw =
    firstNonEmptyString(meta?.roomTier, meta?.tier, meta?.accessTier) || "free";

  const value = raw.toLowerCase();

  if (value.includes("vip3")) return "vip3";
  if (value.includes("vip2")) return "vip2";
  if (value.includes("vip1")) return "vip1";
  if (value.includes("premium")) return "premium";
  if (value.includes("free")) return "free";

  return value;
}