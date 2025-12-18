// src/lib/roomLoader.ts
import { supabase } from "@/integrations/supabase/client";
import { processEntriesOptimized } from "./roomLoaderHelpers";
import { ROOMS_TABLE, AUDIO_FOLDER } from "@/lib/constants/rooms";
import {
  normalizeTier,
  type TierId,
  KIDS_TIER_IDS,
  TIERS,
} from "@/lib/constants/tiers";
import type { Database } from "@/integrations/supabase/types";
import { logger } from "./logger";
import { useSWR } from "./cache/swrCache";
import { tierFromRoomId } from "@/lib/tierFromRoomId";
// ✅ NEW IMPORT
import { classifyRoomError } from "@/lib/errors/roomErrorKind";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];

// Error codes for distinguishing room load failures
// Note: AUTH_REQUIRED removed - guests get preview mode instead of blocking
export type RoomLoadErrorCode = "ROOM_NOT_FOUND" | "ACCESS_DENIED" | "JSON_INVALID";

// Return type for room loader
export type LoadedRoomResult = {
  merged: any[];
  keywordMenu: { en: string[]; vi: string[] };
  audioBasePath: string;
  roomTier?: TierId | null;
  errorCode?: RoomLoadErrorCode;
  hasFullAccess?: boolean; // NEW: true = full access, false = preview only
};

const ROOM_ID_OVERRIDES: Record<string, string> = {
  // VIP3 II Writing Deep-Dive rooms - map URL IDs to canonical DB IDs
  "english-writing-deep-dive-vip3-ii": "english-writing-deep-dive-vip3II",
  "english-writing-deep-dive-vip3-ii-ii": "english-writing-deep-dive-vip3II-II",
  "english-writing-deep-dive-vip3-iii": "english-writing-deep-dive-vip3ii-III",
};

const normalizeRoomId = (roomId: string): string => {
  // 1. Explicit overrides first
  if (ROOM_ID_OVERRIDES[roomId]) {
    return ROOM_ID_OVERRIDES[roomId];
  }

  // 2. Kids rooms: strip suffix and kebab-case
  if (roomId.endsWith("_kids_l1")) {
    return roomId.replace("_kids_l1", "").replace(/_/g, "-");
  }

  // 3. Handle VIP3II / Roman numeral suffixes (case-insensitive -> uppercase)
  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (romanNumeralPattern.test(roomId)) {
    return roomId.replace(romanNumeralPattern, (match) => match.toUpperCase());
  }

  // 4. Regular rooms: use as-is (database uses kebab/hyphen IDs)
  return roomId;
};

const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`;

/**
 * Build preview entries - show first 2 entries as a "shop window" preview
 */
const buildPreviewEntries = (entries: any[]): any[] => {
  if (!Array.isArray(entries)) return [];
  return entries.slice(0, 2);
};

/**
 * Load room from database
 */
const loadFromDatabase = async (dbRoomId: string) => {
  const { data: dbRoom, error } = await supabase
    .from(ROOMS_TABLE)
    .select("*")
    .eq("id", dbRoomId)
    .maybeSingle<RoomRow>();

  if (error) return null;
  if (!dbRoom) return null;

  const hasEntries = Array.isArray(dbRoom.entries) && dbRoom.entries.length > 0;

  // ✅ IMPORTANT: tier MUST come from roomId (DB tier is not trusted)
  const roomTier: TierId = tierFromRoomId(dbRoomId);

  // If no entries, check for room-level keywords
  if (!hasEntries) {
    const hasRoomKeywords = Array.isArray(dbRoom.keywords) && dbRoom.keywords.length > 0;
    if (!hasRoomKeywords) return null;

    return {
      merged: [],
      keywordMenu: {
        en: dbRoom.keywords || [],
        vi: dbRoom.keywords || [],
      },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  const { keywordMenu, merged } = processEntriesOptimized(dbRoom.entries, dbRoomId);

  return {
    merged,
    keywordMenu,
    audioBasePath: AUDIO_BASE_PATH,
    roomTier,
  };
};

/**
 * Load room from static JSON files (fallback)
 * NOTE: should be phased out. Tier enforcement here is best-effort.
 */
const loadFromJson = async (roomId: string) => {
  try {
    const { loadRoomJson } = await import("./roomJsonResolver");
    const jsonData = await loadRoomJson(roomId);

    if (!Array.isArray(jsonData?.entries) || jsonData.entries.length === 0) {
      return null;
    }

    const { keywordMenu, merged } = processEntriesOptimized(jsonData.entries, roomId);

    // ✅ IMPORTANT: tier MUST come from roomId (JSON tier is not trusted)
    const roomTier: TierId = tierFromRoomId(roomId);

    return {
      merged,
      keywordMenu,
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  } catch (error) {
    console.error("Failed to load room from JSON:", error);
    return null;
  }
};

// Helper to check kids tier with null safety
const checkIsKidsTier = (tier: TierId | null | undefined): boolean => {
  if (!tier) return false;
  return KIDS_TIER_IDS.includes(tier);
};

/**
 * Main room loader with SWR caching - returns cached data instantly, revalidates in background
 */
export const loadMergedRoom = async (roomId: string): Promise<LoadedRoomResult> => {
  const cacheKey = `room:${roomId}`;

  return useSWR({
    key: cacheKey,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Internal room loader - optimized for fast loading with tier-based access control
 *
 * NEW BEHAVIOR: "Shop preview" model
 * - Visitors/Free users CAN see preview of VIP rooms (title, intro, first 2 entries)
 * - Full access requires correct tier subscription
 * - Never returns empty room just because of tier mismatch
 */
const loadMergedRoomInternal = async (roomId: string): Promise<LoadedRoomResult> => {
  const startTime = performance.now();
  const { determineAccess } = await import("./accessControl");

  try {
    // 1. Get authenticated user (guests treated as free tier)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    let baseTier: TierId = "free"; // Guest default = free tier

    if (user) {
      // 2. Check admin status via has_role RPC
      const { data: isAdminRpc, error: adminError } = await supabase.rpc("has_role", {
        _role: "admin",
        _user_id: user.id,
      });

      if (adminError) {
        logger.error("Error checking admin role", { scope: "roomLoader", error: adminError.message });
      }

      isAdmin = !!isAdminRpc;

      // 3. Get user's tier from database
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("subscription_tiers(name)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const rawUserTier = (subscription?.subscription_tiers as any)?.name || TIERS.FREE;
      baseTier = normalizeTier(rawUserTier);
    }

    const normalizedUserTier: TierId = isAdmin ? "vip9" : baseTier;
    const isUserKidsTier = checkIsKidsTier(baseTier);

    // 4. Normalize room ID
    const dbRoomId = normalizeRoomId(roomId);

    // ✅ IMPORTANT: room tier MUST come from roomId (ALWAYS)
    const normalizedRoomTier: TierId = tierFromRoomId(dbRoomId);
    const isRoomKidsTier = checkIsKidsTier(normalizedRoomTier);

    // 5. Try database first
    try {
      const dbResult = await loadFromDatabase(dbRoomId);

      if (dbResult) {
        // Safety net: if keyword menu is empty but merged entries exist,
        // rebuild keyword menu from entry-level keywordEn/keywordVi fields
        if (
          dbResult.keywordMenu &&
          Array.isArray(dbResult.merged) &&
          dbResult.merged.length > 0 &&
          (!dbResult.keywordMenu.en || dbResult.keywordMenu.en.length === 0)
        ) {
          const fallbackEn: string[] = [];
          const fallbackVi: string[] = [];

          (dbResult.merged as any[]).forEach((entry) => {
            const en = String(entry.keywordEn || entry.slug || entry.identifier || "").trim();
            const vi = String(entry.keywordVi || entry.keywordEn || entry.slug || "").trim();

            if (en) {
              fallbackEn.push(en);
              fallbackVi.push(vi);
            }
          });

          dbResult.keywordMenu = {
            en: fallbackEn,
            vi: fallbackVi,
          };
        }

        // 6. Determine access level using centralized helper
        // (but don't block - return preview instead)
        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTier) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(normalizedUserTier, normalizedRoomTier);
            hasFullAccess = access.hasFullAccess;
          }
        }

        // If no full access, return PREVIEW (not empty)
        if (!hasFullAccess) {
          const previewMerged = buildPreviewEntries(dbResult.merged);
          const duration = performance.now() - startTime;

          logger.roomLoad(roomId, duration, true, {
            source: "database",
            entryCount: previewMerged.length,
            preview: true,
            userTier: normalizedUserTier,
            roomTier: normalizedRoomTier,
          });

          return {
            merged: previewMerged,
            keywordMenu: dbResult.keywordMenu,
            audioBasePath: AUDIO_BASE_PATH,
            roomTier: normalizedRoomTier,
            errorCode: "ACCESS_DENIED", // preview-only
            hasFullAccess: false,
          };
        }

        // Full access - return everything
        const duration = performance.now() - startTime;
        logger.roomLoad(roomId, duration, true, {
          source: "database",
          entryCount: dbResult.merged.length,
        });

        return {
          ...dbResult,
          roomTier: normalizedRoomTier,
          hasFullAccess: true,
        };
      }
    } catch (dbError: any) {
      // Database load failed, continue to JSON fallback
      logger.error("Database load error", { scope: "roomLoader", roomId, error: dbError?.message });
    }

    // 7. Fallback to JSON files (with same preview logic)
    try {
      let jsonResult = await loadFromJson(dbRoomId);

      // Extra safety: if normalized ID didn't find it, try original
      if (!jsonResult && dbRoomId !== roomId) {
        jsonResult = await loadFromJson(roomId);
      }

      if (jsonResult) {
        const isRoomKidsTierJson = checkIsKidsTier(normalizedRoomTier);

        // Determine access level for JSON rooms (same logic)
        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTierJson) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(normalizedUserTier, normalizedRoomTier);
            hasFullAccess = access.hasFullAccess;
          }
        }

        // If no full access, return preview
        if (!hasFullAccess) {
          const previewMerged = buildPreviewEntries(jsonResult.merged);
          const duration = performance.now() - startTime;

          logger.roomLoad(roomId, duration, true, {
            source: "json",
            entryCount: previewMerged.length,
            preview: true,
            userTier: normalizedUserTier,
            roomTier: normalizedRoomTier,
          });

          return {
            merged: previewMerged,
            keywordMenu: jsonResult.keywordMenu,
            audioBasePath: AUDIO_BASE_PATH,
            roomTier: normalizedRoomTier,
            errorCode: "ACCESS_DENIED",
            hasFullAccess: false,
          };
        }

        // Full access
        const duration = performance.now() - startTime;
        logger.roomLoad(roomId, duration, true, { source: "json", entryCount: jsonResult.merged.length });

        return {
          ...jsonResult,
          roomTier: normalizedRoomTier,
          hasFullAccess: true,
        };
      }
    } catch (jsonError: any) {
      // ✅ Use classifier for JSON-specific errors
      const kind = classifyRoomError(jsonError);
      const errorCode = kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND";

      logger.error("JSON load error", { scope: "roomLoader", roomId, error: jsonError?.message, classifiedKind: kind });

      const duration = performance.now() - startTime;
      logger.roomLoad(roomId, duration, false, { error: "Room load failed (JSON)", classifiedKind: kind });

      return {
        merged: [],
        keywordMenu: { en: [], vi: [] },
        audioBasePath: AUDIO_BASE_PATH,
        roomTier: normalizedRoomTier,
        errorCode,
        error: jsonError,
        hasFullAccess: false,
      };
    }

    // 8. Room not found (neither DB nor JSON)
    const duration = performance.now() - startTime;
    logger.roomLoad(roomId, duration, false, { error: "Room not found in database or JSON" });

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier: normalizedRoomTier,
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    };
  } catch (error: any) {
    // ✅ Use classifier for top-level unexpected errors
    const kind = classifyRoomError(error);
    const errorCode = kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND";

    const duration = performance.now() - startTime;
    logger.error("Room load error", {
      scope: "roomLoader",
      roomId,
      duration_ms: duration,
      error: error.message,
      errorStack: error.stack,
      classifiedKind: kind,
    });

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier: tierFromRoomId(normalizeRoomId(roomId)),
      errorCode,
      error,
      hasFullAccess: false,
    };
  }
};