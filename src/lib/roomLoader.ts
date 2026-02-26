// src/lib/roomLoader.ts
import { supabase } from "@/lib/supabaseClient";
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
type RoomEntryRow = Database["public"]["Tables"]["room_entries"]["Row"];

// ✅ DB source of truth for entries (NOT rooms.entries)
const ROOM_ENTRIES_TABLE = "room_entries";

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
  "english-writing-deep-dive-vip3-iii": "english-writing-deep-dive-vip3-III",
};

const AUDIO_BASE_PATH = `${AUDIO_FOLDER}/`;

/**
 * Normalize/transform room IDs across the app:
 * - Some parts of the app treat "canonical" as underscore_case (e.g. adhd-support-vip3 → adhd_support_vip3)
 * - Some DB rows (legacy) may still use kebab-case or custom IDs (overrides)
 *
 * To avoid "ROOM_NOT_FOUND" flakes in tests and integration navigation,
 * we try multiple candidate IDs in priority order.
 */

// Uppercase roman suffixes (e.g. -ii → -II). Only affects trailing suffix.
const applyRomanSuffixUpper = (s: string): string => {
  const romanNumeralPattern = /-(i+|ii|iii|iv|v|vi|vii|viii|ix|x)$/i;
  if (!romanNumeralPattern.test(s)) return s;
  return s.replace(romanNumeralPattern, (m) => m.toUpperCase());
};

// Kids rooms: strip _kids_l1 and convert underscores to hyphens (legacy behavior)
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

  // 1) explicit overrides (input could be any case)
  const lower = raw.toLowerCase();
  if (ROOM_ID_OVERRIDES[lower]) return ROOM_ID_OVERRIDES[lower];

  // 2) kids rule
  const kids = applyKidsNormalization(raw);
  if (kids !== raw) return kids;

  // 3) roman suffix rule
  const roman = applyRomanSuffixUpper(raw);
  if (roman !== raw) return roman;

  // 4) as-is
  return raw;
};

const buildRoomIdCandidates = (roomId: string): string[] => {
  const raw = (roomId || "").trim();
  const primary = normalizeRoomIdPrimary(raw);

  // Produce both underscore-canonical and kebab variations for robust lookup
  const underscoreFromRaw = toUnderscoreCanonical(raw);
  const underscoreFromPrimary = toUnderscoreCanonical(primary);

  const kebabFromRaw = toKebab(raw);
  const kebabFromPrimary = toKebab(primary);

  // ✅ FIX: Prefer `primary` (overrides/normalization) before `raw`
  // This prevents trying a "wrong" raw ID first when an override exists.
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

/**
 * Build preview entries - show first 2 entries as a "shop window" preview
 */
const buildPreviewEntries = (entries: any[]): any[] => {
  if (!Array.isArray(entries)) return [];
  return entries.slice(0, 2);
};

// Helper to check kids tier with null safety
const checkIsKidsTier = (tier: TierId | null | undefined): boolean => {
  if (!tier) return false;
  return KIDS_TIER_IDS.includes(tier);
};

/**
 * Load room from database
 *
 * ✅ IMPORTANT (2026-02):
 * Entries live in public.room_entries (room_id, index, copy_en, copy_vi, ...)
 * NOT in public.rooms.entries.
 *
 * We try multiple candidate IDs to avoid ID-format mismatches.
 */
const loadFromDatabase = async (
  candidateIds: string[],
  canonicalTierSourceId: string
) => {
  // ✅ IMPORTANT: tier MUST come from roomId (DB tier is not trusted)
  const roomTier: TierId = tierFromRoomId(canonicalTierSourceId);

  // 1) Load entries from room_entries (source of truth)
  for (const dbRoomId of candidateIds) {
    const { data: entryRows, error: entriesError } = await supabase
      .from(ROOM_ENTRIES_TABLE)
      .select("*")
      .eq("room_id", dbRoomId)
      .order("index", { ascending: true })
      .returns<RoomEntryRow[]>();

    if (entriesError) {
      // Try next candidate (don’t hard-fail on one)
      continue;
    }

    const hasEntries = Array.isArray(entryRows) && entryRows.length > 0;
    if (!hasEntries) continue;

    const { keywordMenu, merged } = processEntriesOptimized(
      (entryRows as any[]) ?? [],
      dbRoomId
    );

    return {
      merged,
      keywordMenu,
      audioBasePath: AUDIO_BASE_PATH,
      roomTier,
    };
  }

  // 2) No entries — optional: fall back to room-level keywords if present
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

/**
 * Load room from static JSON files (fallback)
 * NOTE: should be phased out. Tier enforcement here is best-effort.
 *
 * We try multiple candidate IDs to avoid ID-format mismatches.
 */
const loadFromJson = async (
  candidateIds: string[],
  canonicalTierSourceId: string
) => {
  try {
    const { loadRoomJson } = await import("./roomJsonResolver");

    for (const id of candidateIds) {
      const jsonData = await loadRoomJson(id);

      // ✅ Missing JSON OR “200 HTML pretending to be JSON” should behave like missing
      if (!jsonData || typeof jsonData !== "object") continue;

      if (
        !Array.isArray((jsonData as any)?.entries) ||
        (jsonData as any).entries.length === 0
      ) {
        continue;
      }

      const { keywordMenu, merged } = processEntriesOptimized(
        (jsonData as any).entries,
        id
      );

      // ✅ IMPORTANT: tier MUST come from roomId (JSON tier is not trusted)
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

/**
 * Main room loader with SWR caching - returns cached data instantly, revalidates in background
 *
 * ✅ IMPORTANT:
 * - Hooks must be called inside a React component or a custom hook (name starts with "use").
 * - This function IS the hook.
 */
export const useMergedRoom = (roomId: string): LoadedRoomResult => {
  const cacheKey = `room:${roomId}`;

  return useSWR({
    key: cacheKey,
    fetcher: () => loadMergedRoomInternal(roomId),
    ttl: 5 * 60 * 1000, // 5 minutes
  }) as any;
};

/**
 * Legacy alias (hook-safe name).
 * If anything previously imported `loadMergedRoom`, update it to import `useMergedRoom`.
 * This alias exists only to ease transition, but stays hook-compliant.
 */
export const useLoadMergedRoom = useMergedRoom;

/**
 * Internal room loader - optimized for fast loading with tier-based access control
 *
 * NEW BEHAVIOR: "Shop preview" model
 * - Visitors/Free users CAN see preview of VIP rooms (title, intro, first 2 entries)
 * - Full access requires correct tier subscription
 * - Never returns empty room just because of tier mismatch
 */
const loadMergedRoomInternal = async (
  roomId: string
): Promise<LoadedRoomResult> => {
  const startTime = performance.now();
  const { determineAccess } = await import("./accessControl");

  // Canonical tier source: underscore form tends to match the rest of the app ("canonical:")
  // but we still try many candidates for actual lookups.
  const canonicalTierSourceId = toUnderscoreCanonical(
    normalizeRoomIdPrimary(roomId)
  );
  const candidateIds = buildRoomIdCandidates(roomId);

  try {
    // 1. Get authenticated user (guests treated as free tier)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    let isAdmin = false;
    let baseTier: TierId = "free"; // Guest default = free tier

    if (user) {
      // 2. Check admin status via has_role RPC
      const { data: isAdminRpc, error: adminError } = await supabase.rpc(
        "has_role",
        {
          _role: "admin",
          _user_id: user.id,
        }
      );

      if (adminError) {
        logger.error("Error checking admin role", {
          scope: "roomLoader",
          error: adminError.message,
        });
      }

      isAdmin = !!isAdminRpc;

      // 3. Get user's tier from database
      const { data: subscription } = await supabase
        .from("user_subscriptions")
        .select("subscription_tiers(name)")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      const rawUserTier =
        (subscription?.subscription_tiers as any)?.name || TIERS.FREE;
      baseTier = normalizeTier(rawUserTier);
    }

    const normalizedUserTier: TierId = isAdmin ? "vip9" : baseTier;
    const isUserKidsTier = checkIsKidsTier(baseTier);

    // ✅ IMPORTANT: room tier MUST come from roomId (ALWAYS)
    const normalizedRoomTier: TierId = tierFromRoomId(canonicalTierSourceId);
    const isRoomKidsTier = checkIsKidsTier(normalizedRoomTier);

    // 5. Try database first (multi-candidate)
    try {
      const dbResult = await loadFromDatabase(
        candidateIds,
        canonicalTierSourceId
      );

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
            const en = String(
              entry.keywordEn || entry.slug || entry.identifier || ""
            ).trim();
            const vi = String(
              entry.keywordVi || entry.keywordEn || entry.slug || ""
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

        // 6. Determine access level using centralized helper
        // (but don't block - return preview instead)
        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTier) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(
              normalizedUserTier,
              normalizedRoomTier
            );
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
      logger.error("Database load error", {
        scope: "roomLoader",
        roomId,
        error: dbError?.message,
      });
    }

    // 7. Fallback to JSON files (with same preview logic, multi-candidate)
    try {
      const jsonResult = await loadFromJson(
        candidateIds,
        canonicalTierSourceId
      );

      if (jsonResult) {
        const isRoomKidsTierJson = checkIsKidsTier(normalizedRoomTier);

        // Determine access level for JSON rooms (same logic)
        let hasFullAccess = true;

        if (!isAdmin) {
          if (isUserKidsTier && !isRoomKidsTierJson) {
            hasFullAccess = false;
          } else {
            const access = determineAccess(
              normalizedUserTier,
              normalizedRoomTier
            );
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
      // ✅ Use classifier for JSON-specific errors
      const kind = classifyRoomError(jsonError);
      const errorCode = kind === "json_invalid" ? "JSON_INVALID" : "ROOM_NOT_FOUND";

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
        // NOTE: keep legacy field if callers expect it
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: jsonError as any,
        hasFullAccess: false,
      } as any;
    }

    // 8. Room not found (neither DB nor JSON)
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
      roomTier: tierFromRoomId(canonicalTierSourceId),
      errorCode,
      hasFullAccess: false,
    };
  }
};

//
// ✅ EXPORT FOR TESTS + NON-REACT CALLERS
// - Tests snapshot the merged structure without React hooks.
// - This keeps backwards compatibility with older imports.
//
// IMPORTANT: This is NOT a hook. Safe to call anywhere.
//
export const loadMergedRoom = async (
  roomId: string
): Promise<LoadedRoomResult> => {
  return loadMergedRoomInternal(roomId);
};

// ✅ DEFAULT EXPORT (optional compatibility)
export default loadMergedRoom;