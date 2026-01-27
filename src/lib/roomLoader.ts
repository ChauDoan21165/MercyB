// src/lib/roomLoader.ts
import { supabase } from "@/lib/supabaseClient";
import { processEntriesOptimized } from "./roomLoaderHelpers";
import { ROOMS_TABLE, AUDIO_FOLDER } from "@/lib/constants/rooms";
import { normalizeTier, type TierId, KIDS_TIER_IDS, TIERS } from "@/lib/constants/tiers";
import type { Database } from "@/integrations/supabase/types";
import { logger } from "./logger";
import { useSWR } from "./cache/swrCache";
import { tierFromRoomId } from "@/lib/tierFromRoomId";
import { classifyRoomError } from "@/lib/errors/roomErrorKind";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];

export type RoomLoadErrorCode = "ROOM_NOT_FOUND" | "ACCESS_DENIED" | "JSON_INVALID";

export type LoadedRoomResult = {
  merged: any[];
  keywordMenu: { en: string[]; vi: string[] };
  audioBasePath: string;
  roomTier?: TierId | null;
  errorCode?: RoomLoadErrorCode;
  hasFullAccess?: boolean;
};

const ROOM_ID_OVERRIDES: Record<string, string> = {
  "english-writing-deep-dive-vip3-ii": "english-writing-deep-dive-vip3II",
  "english-writing-deep-dive-vip3-ii-ii": "english-writing-deep-dive-vip3II-II",
  "english-writing-deep-dive-vip3-iii": "english-writing-deep-dive-vip3ii-III",
};

const normalizeRoomId = (roomId: string): string => {
  if (ROOM_ID_OVERRIDES[roomId]) return ROOM_ID_OVERRIDES[roomId];

  if (roomId.endsWith("_kids_l1")) {
    return roomId.replace("_kids_l1", "").replace(/_/g, "-");
  }

  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (romanNumeralPattern.test(roomId)) {
    return roomId.replace(romanNumeralPattern, (m) => m.toUpperCase());
  }

  return roomId;
};

const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`;

const buildPreviewEntries = (entries: any[]): any[] =>
  Array.isArray(entries) ? entries.slice(0, 2) : [];

const loadFromDatabase = async (dbRoomId: string) => {
  const { data: dbRoom, error } = await supabase
    .from(ROOMS_TABLE)
    .select("*")
    .eq("id", dbRoomId)
    .maybeSingle<RoomRow>();

  if (error || !dbRoom) return null;

  const entries = (dbRoom as any).entries;
  const roomTier: TierId = tierFromRoomId(dbRoomId);

  if (!Array.isArray(entries) || entries.length === 0) {
    const keywords = (dbRoom as any).keywords;
    if (!Array.isArray(keywords) || keywords.length === 0) return null;

    return {
      merged: [],
      keywordMenu: { en: keywords, vi: keywords },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  const { keywordMenu, merged } = processEntriesOptimized(entries, dbRoomId);

  return {
    merged,
    keywordMenu,
    audioBasePath: AUDIO_BASE_PATH,
    roomTier,
  };
};

const loadFromJson = async (roomId: string) => {
  try {
    const { loadRoomJson } = await import("./roomJsonResolver");
    const jsonData = await loadRoomJson(roomId);

    if (!Array.isArray(jsonData?.entries) || jsonData.entries.length === 0) {
      return null;
    }

    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries, roomId);

    return {
      merged,
      keywordMenu,
      audioBasePath: AUDIO_BASE_PATH,
      roomTier: tierFromRoomId(roomId),
    };
  } catch {
    return null;
  }
};

// kids tier helper (central cast to avoid TS fights)
const KIDS_TIER_SET = new Set<string>(KIDS_TIER_IDS as readonly string[]);
const isKidsTier = (tier?: TierId | null) => !!tier && KIDS_TIER_SET.has(String(tier));

/**
 * ✅ MAIN HOOK
 */
export const useMergedRoom = (roomId: string): LoadedRoomResult => {
  const key = `room:${roomId}`;

  const swr = useSWR({
    key,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000,
  }) as any;

  const data = swr?.data ?? swr;

  if (data && Array.isArray(data.merged)) {
    return data as LoadedRoomResult;
  }

  return {
    merged: [],
    keywordMenu: { en: [], vi: [] },
    audioBasePath: AUDIO_BASE_PATH,
    roomTier: tierFromRoomId(normalizeRoomId(roomId)),
    hasFullAccess: false,
  };
};

export const useLoadMergedRoom = useMergedRoom;

/**
 * INTERNAL (non-hook)
 */
const loadMergedRoomInternal = async (roomId: string): Promise<LoadedRoomResult> => {
  const start = performance.now();
  const { determineAccess } = await import("./accessControl");

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    let baseTier: TierId = "free";

    if (user) {
      const { data: isAdminRpc } = await supabase.rpc("has_role", {
        _role: "admin",
        _user_id: user.id,
      });

      isAdmin = !!isAdminRpc;

      const { data: sub } = await supabase
        .from("user_subscriptions")
        .select("subscription_tiers(name)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      baseTier = normalizeTier((sub?.subscription_tiers as any)?.name || TIERS.FREE);
    }

    const userTier: TierId = isAdmin ? "vip9" : baseTier;

    const dbRoomId = normalizeRoomId(roomId);
    const roomTier: TierId = tierFromRoomId(dbRoomId);

    const userIsKids = isKidsTier(baseTier);
    const roomIsKids = isKidsTier(roomTier);

    const dbResult = await loadFromDatabase(dbRoomId);

    if (dbResult) {
      let hasFullAccess = true;

      if (!isAdmin) {
        if (userIsKids && !roomIsKids) {
          hasFullAccess = false;
        } else {
          hasFullAccess = determineAccess(userTier, roomTier).hasFullAccess;
        }
      }

      if (!hasFullAccess) {
        return {
          merged: buildPreviewEntries(dbResult.merged),
          keywordMenu: dbResult.keywordMenu,
          audioBasePath: AUDIO_BASE_PATH,
          roomTier,
          errorCode: "ACCESS_DENIED",
          hasFullAccess: false,
        };
      }

      logger.roomLoad(roomId, performance.now() - start, true, {
        source: "database",
        entryCount: dbResult.merged.length,
      });

      return { ...dbResult, roomTier, hasFullAccess: true };
    }

    const jsonResult =
      (await loadFromJson(dbRoomId)) || (dbRoomId !== roomId ? await loadFromJson(roomId) : null);

    if (jsonResult) {
      let hasFullAccess = true;

      if (!isAdmin) {
        if (userIsKids && !roomIsKids) {
          hasFullAccess = false;
        } else {
          hasFullAccess = determineAccess(userTier, roomTier).hasFullAccess;
        }
      }

      if (!hasFullAccess) {
        return {
          merged: buildPreviewEntries(jsonResult.merged),
          keywordMenu: jsonResult.keywordMenu,
          audioBasePath: AUDIO_BASE_PATH,
          roomTier,
          errorCode: "ACCESS_DENIED",
          hasFullAccess: false,
        };
      }

      return { ...jsonResult, roomTier, hasFullAccess: true };
    }

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    };
  } catch (err: any) {
    const kind = classifyRoomError(err);

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier: tierFromRoomId(normalizeRoomId(roomId)),
      errorCode: kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND",
      hasFullAccess: false,
    };
  }
};

/**
 * ✅ EXPORT FOR TESTS
 */
export const loadMergedRoom = async (roomId: string): Promise<LoadedRoomResult> =>
  loadMergedRoomInternal(roomId);

export default loadMergedRoom;
