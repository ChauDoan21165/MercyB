// src/lib/roomLoader.ts
import { supabase } from "@/lib/supabaseClient";
import { processEntriesOptimized } from "./roomLoaderHelpers";
import { ROOMS_TABLE, AUDIO_FOLDER } from "@/lib/constants/rooms";
import { type TierId, KIDS_TIER_IDS } from "@/lib/constants/tiers";
import type { Database } from "@/integrations/supabase/types";
import { logger } from "./logger";
import { useSWR } from "./cache/swrCache";
import { tierFromRoomId } from "@/lib/tierFromRoomId";
import { classifyRoomError } from "@/lib/errors/roomErrorKind";
import {
  fetchCurrentEntitlement,
  resolveEntitlementTier,
} from "@/lib/authService";
import { determineAccess } from "./accessControl";
import { loadRoomJson } from "./roomJsonResolver";

type RoomRow = Database["public"]["Tables"]["rooms"]["Row"];
type RoomEntryRow = Database["public"]["Tables"]["room_entries"]["Row"];

const ROOM_ENTRIES_TABLE = "room_entries";

export type RoomLoadErrorCode =
  | "ROOM_NOT_FOUND"
  | "ACCESS_DENIED"
  | "JSON_INVALID";

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
  "english-writing-deep-dive-vip3-ii-ii":
    "english-writing-deep-dive-vip3II-II",
  "english-writing-deep-dive-vip3-iii": "english-writing-deep-dive-vip3-III",
};

const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`;

const applyRomanSuffixUpper = (s: string): string => {
  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (!romanNumeralPattern.test(s)) return s;
  return s.replace(romanNumeralPattern, (m) => m.toUpperCase());
};

const applyKidsNormalization = (s: string): string => {
  if (!s.endsWith("_kids_l1")) return s;
  return s.replace("_kids_l1", "").replace(/_/g, "-");
};

const toUnderscoreCanonical = (s: string): string => {
  return (s || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/_/g, "_")
    .replace(/-/g, "_");
};

const toKebab = (s: string): string => {
  return (s || "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/_+/g, "_")
    .replace(/_/g, "-");
};

const uniq = <T,>(arr: T[]): T[] => {
  const seen = new Set<T>();
  const out: T[] = [];
  for (const v of arr) {
    if (!seen.has(v)) {
      seen.add(v);
      out.push(v);
    }
  }
  return out;
};

const normalizeRoomIdPrimary = (roomId: string): string => {
  const raw = (roomId || "").trim();
  if (!raw) return raw;

  const lower = raw.toLowerCase();
  if (ROOM_ID_OVERRIDES[lower]) return ROOM_ID_OVERRIDES[lower];

  const kids = applyKidsNormalization(raw);
  if (kids !== raw) return kids;

  const roman = applyRomanSuffixUpper(raw);
  if (roman !== raw) return roman;

  return raw;
};

const buildRoomIdCandidates = (roomId: string): string[] => {
  const raw = (roomId || "").trim();
  const primary = normalizeRoomIdPrimary(raw);

  const underscoreFromRaw = toUnderscoreCanonical(raw);
  const underscoreFromPrimary = toUnderscoreCanonical(primary);

  const kebabFromRaw = toKebab(raw);
  const kebabFromPrimary = toKebab(primary);

  const variants = [
    primary,
    raw,

    applyRomanSuffixUpper(primary),
    applyRomanSuffixUpper(raw),

    underscoreFromPrimary,
    underscoreFromRaw,
    applyRomanSuffixUpper(underscoreFromPrimary),
    applyRomanSuffixUpper(underscoreFromRaw),

    kebabFromPrimary,
    kebabFromRaw,
    applyRomanSuffixUpper(kebabFromPrimary),
    applyRomanSuffixUpper(kebabFromRaw),
  ]
    .map((s) => (s || "").trim())
    .filter(Boolean);

  return uniq(variants);
};

const buildPreviewEntries = (entries: any[]): any[] => {
  if (!Array.isArray(entries)) return [];
  return entries.slice(0, 2);
};

const checkIsKidsTier = (tier: TierId | null | undefined): boolean => {
  if (!tier) return false;
  if (!Array.isArray(KIDS_TIER_IDS)) return false;
  return (KIDS_TIER_IDS as readonly TierId[]).includes(tier);
};

/**
 * Temporary bridge:
 * current entitlements -> legacy access-control ladder
 */
const mapToAccessTier = (tier: TierId): TierId => {
  if (tier === "premium_month") return "vip3";
  if (tier === "premium_year") return "vip6";
  return "free";
};

function hasGetUser(
  client: typeof supabase,
): client is typeof supabase & {
  auth: typeof supabase.auth & {
    getUser: () => Promise<{
      data: { user: { id: string } | null };
      error?: unknown;
    }>;
  };
} {
  return typeof (client as any)?.auth?.getUser === "function";
}

function hasRpc(
  client: typeof supabase,
): client is typeof supabase & {
  rpc: (
    fn: string,
    args?: Record<string, unknown>,
  ) => Promise<{ data: unknown; error: { message?: string } | null }>;
} {
  return typeof (client as any)?.rpc === "function";
}

const loadFromDatabase = async (
  candidateIds: string[],
  canonicalTierSourceId: string,
) => {
  const roomTier: TierId = tierFromRoomId(canonicalTierSourceId);

  for (const dbRoomId of candidateIds) {
    const { data: entryRows, error: entriesError } = await supabase
      .from(ROOM_ENTRIES_TABLE)
      .select("*")
      .eq("room_id", dbRoomId)
      .order("index", { ascending: true })
      .returns<RoomEntryRow[]>();

    if (entriesError) continue;

    const hasEntries = Array.isArray(entryRows) && entryRows.length > 0;
    if (!hasEntries) continue;

    const { keywordMenu, merged } = processEntriesOptimized(
      (entryRows as any[]) ?? [],
      dbRoomId,
    );

    return {
      merged,
      keywordMenu,
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  for (const dbRoomId of candidateIds) {
    const { data: dbRoom, error: roomError } = await supabase
      .from(ROOMS_TABLE)
      .select("*")
      .eq("id", dbRoomId)
      .maybeSingle<RoomRow>();

    if (roomError) continue;
    if (!dbRoom) continue;

    const hasRoomKeywords =
      Array.isArray((dbRoom as any).keywords) &&
      (dbRoom as any).keywords.length > 0;

    if (!hasRoomKeywords) continue;

    return {
      merged: [],
      keywordMenu: {
        en: (dbRoom as any).keywords || [],
        vi: (dbRoom as any).keywords || [],
      },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  return null;
};

const loadFromJson = async (
  candidateIds: string[],
  canonicalTierSourceId: string,
) => {
  try {
    for (const id of candidateIds) {
      const jsonData = await loadRoomJson(id);

      if (!jsonData || typeof jsonData !== "object") continue;

      if (
        !Array.isArray((jsonData as any)?.entries) ||
        (jsonData as any).entries.length === 0
      ) {
        continue;
      }

      const { keywordMenu, merged } = processEntriesOptimized(
        (jsonData as any).entries,
        id,
      );

      const roomTier: TierId = tierFromRoomId(canonicalTierSourceId);

      return {
        merged,
        keywordMenu,
        audioBasePath: AUDIO_BASE_PATH,
        roomTier,
      };
    }

    return null;
  } catch (error) {
    console.error("Failed to load room from JSON:", error);
    return null;
  }
};

export const useMergedRoom = (roomId: string): LoadedRoomResult => {
  const cacheKey = `room:${roomId}`;

  return useSWR({
    key: cacheKey,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000,
  }) as any;
};

export const useLoadMergedRoom = useMergedRoom;

const loadMergedRoomInternal = async (
  roomId: string,
): Promise<LoadedRoomResult> => {
  const startTime = performance.now();

  const canonicalTierSourceId = toUnderscoreCanonical(
    normalizeRoomIdPrimary(roomId),
  );
  const candidateIds = buildRoomIdCandidates(roomId);

  try {
    let user: { id: string } | null = null;

    if (hasGetUser(supabase)) {
      try {
        const {
          data: { user: fetchedUser },
        } = await supabase.auth.getUser();
        user = fetchedUser ?? null;
      } catch (authError: any) {
        logger.error("Error getting current user", {
          scope: "roomLoader",
          roomId,
          error: authError?.message,
        });
      }
    } else {
      logger.warn?.("supabase.auth.getUser is not available; treating as guest", {
        scope: "roomLoader",
        roomId,
      });
    }

    let isAdmin = false;
    let baseTier: TierId = "free";

    if (user) {
      if (hasRpc(supabase)) {
        const { data: isAdminRpc, error: adminError } = await supabase.rpc(
          "has_role",
          {
            _role: "admin",
            _user_id: user.id,
          },
        );

        if (adminError) {
          logger.error("Error checking admin role", {
            scope: "roomLoader",
            error: adminError.message,
          });
        } else {
          isAdmin = !!isAdminRpc;
        }
      } else {
        logger.warn?.("supabase.rpc is not available; skipping admin role check", {
          scope: "roomLoader",
          roomId,
        });
      }

      try {
        const entitlement = await fetchCurrentEntitlement(supabase);
        baseTier = resolveEntitlementTier(entitlement);
      } catch (entitlementError: any) {
        logger.error("Entitlement lookup failed; defaulting to free", {
          scope: "roomLoader",
          roomId,
          error: entitlementError?.message,
        });
        baseTier = "free";
      }
    }

    const normalizedUserTier: TierId = isAdmin ? "vip9" : mapToAccessTier(baseTier);
    const isUserKidsTier = checkIsKidsTier(normalizedUserTier);

    const normalizedRoomTier: TierId = tierFromRoomId(canonicalTierSourceId);
    const isRoomKidsTier = checkIsKidsTier(normalizedRoomTier);

    try {
      const dbResult = await loadFromDatabase(
        candidateIds,
        canonicalTierSourceId,
      );

      if (dbResult) {
        if (
          dbResult.keywordMenu &&
          Array.isArray(dbResult.merged) &&
          dbResult.merged.length > 0 &&
          (!dbResult.keywordMenu.en || dbResult.keywordMenu.en.length === 0)
        ) {
          const fallbackEn: string[] = [];
          const fallbackVi: string[] = [];

          (dbResult.merged as any[]).forEach((entry) => {
            const en = String(
              entry.keywordEn || entry.slug || entry.identifier || "",
            ).trim();
            const vi = String(
              entry.keywordVi || entry.keywordEn || entry.slug || "",
            ).trim();

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

        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTier) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(
              normalizedUserTier,
              normalizedRoomTier,
            );
            hasFullAccess = access.hasFullAccess;
          }
        }

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
            errorCode: "ACCESS_DENIED",
            hasFullAccess: false,
          };
        }

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
      logger.error("Database load error", {
        scope: "roomLoader",
        roomId,
        error: dbError?.message,
      });
    }

    try {
      const jsonResult = await loadFromJson(
        candidateIds,
        canonicalTierSourceId,
      );

      if (jsonResult) {
        const isRoomKidsTierJson = checkIsKidsTier(normalizedRoomTier);

        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTierJson) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(
              normalizedUserTier,
              normalizedRoomTier,
            );
            hasFullAccess = access.hasFullAccess;
          }
        }

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

        const duration = performance.now() - startTime;
        logger.roomLoad(roomId, duration, true, {
          source: "json",
          entryCount: jsonResult.merged.length,
        });

        return {
          ...jsonResult,
          roomTier: normalizedRoomTier,
          hasFullAccess: true,
        };
      }
    } catch (jsonError: any) {
      const kind = classifyRoomError(jsonError);
      const errorCode =
        kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND";

      logger.error("JSON load error", {
        scope: "roomLoader",
        roomId,
        error: jsonError?.message,
        classifiedKind: kind,
      });

      const duration = performance.now() - startTime;
      logger.roomLoad(roomId, duration, false, {
        error: "Room load failed (JSON)",
        classifiedKind: kind,
      });

      return {
        merged: [],
        keywordMenu: { en: [], vi: [] },
        audioBasePath: AUDIO_BASE_PATH,
        roomTier: normalizedRoomTier,
        errorCode,
        error: jsonError as any,
        hasFullAccess: false,
      } as any;
    }

    const duration = performance.now() - startTime;
    logger.roomLoad(roomId, duration, false, {
      error: "Room not found in database or JSON",
    });

    return {
      merged: [],
      keywordMenu: { en: [], vi: [] },
      audioBasePath: AUDIO_BASE_PATH,
      roomTier: normalizedRoomTier,
      errorCode: "ROOM_NOT_FOUND",
      hasFullAccess: false,
    };
  } catch (error: any) {
    const kind = classifyRoomError(error);
    const errorCode =
      kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND";

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
      roomTier: tierFromRoomId(canonicalTierSourceId),
      errorCode,
      hasFullAccess: false,
    };
  }
};

export const loadMergedRoom = async (
  roomId: string,
): Promise<LoadedRoomResult> => {
  return loadMergedRoomInternal(roomId);
};

export default loadMergedRoom;