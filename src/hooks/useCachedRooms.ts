import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabaseClient";
import {
  type TierId,
  normalizeTier,
  isValidTierId,
} from "@/lib/constants/tiers";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

export interface MinimalRoomData {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: TierId; // best-effort inferred tier (never used for filtering anymore)
  tierLabel?: string; // Original DB tier label for debug/inspection
  hasData: boolean;
  color?: string;
  track?: "core" | "bonus";
  domain?: string;
}

const CACHE_KEY = "rooms-cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// System files to exclude from room lists
const SYSTEM_FILES_PATTERNS = [
  "package",
  "lock",
  "node_modules",
  ".git",
  "config",
  "ryrus",
  "tsconfig",
  "vite",
  "eslint",
  "prettier",
  "readme",
  "license",
  "changelog",
  ".env",
  "docker",
];

// Check if an ID looks like a system file
function isSystemFile(id: string): boolean {
  const lowerCaseId = id.toLowerCase();
  return SYSTEM_FILES_PATTERNS.some((pattern) => lowerCaseId.includes(pattern));
}

type RoomRow = {
  id: string;
  title_en: string | null;
  title_vi: string | null;
  tier: string | null;
  domain: string | null;
  track: string | null;
};

// STRICT tier inference:
// 1) prefer room.id via tierFromRoomId (matches TierIndex logic)
// 2) optional fallback: if DB tier label exists, normalizeTier(label) BUT only if label was non-empty
function inferTierStrict(room: RoomRow): TierId | "unknown" {
  const id = String(room?.id || "").trim();
  if (id) {
    const t = tierFromRoomId(id);
    if (t && isValidTierId(t)) return t;
  }

  const rawLabel = String(room?.tier || "").trim();
  if (rawLabel) {
    const n = normalizeTier(rawLabel);
    // normalizeTier defaults unknown -> free, so only accept if label was actually present
    if (isValidTierId(n)) return n;
  }

  return "unknown";
}

// Fetch minimal room data from database
async function fetchCachedRooms(tierId?: TierId): Promise<MinimalRoomData[]> {
  try {
    // ✅ DO NOT server-filter by rooms.tier anymore.
    //    That column is unreliable/legacy and caused “tier map count != tier page rooms”.
    let query = supabase.from(ROOMS_TABLE).select("id, title_en, title_vi, tier, domain, track");

    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.log("[useCachedRooms] Fetching rooms (NO DB tier filter). tierId:", tierId);
    }

    const { data, error } = await query.returns<RoomRow[]>();

    if (error) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error("[useCachedRooms] Query error:", error);
      }
      throw error;
    }

    const rows = (data || []).filter((room) => room?.id && !isSystemFile(room.id));

    // Infer tier for each row
    const enriched = rows.map((room) => {
      const inferred = inferTierStrict(room);

      return {
        room,
        inferred, // TierId | "unknown"
      };
    });

    // ✅ Apply domain exclusion AFTER we know which tier page we’re rendering,
    //    but keep the original rule: exclude English Foundation Ladder ONLY for non-free tier pages.
    const filteredByDomain =
      tierId && tierId !== "free"
        ? enriched.filter(({ room }) => {
            const d = String(room.domain || "").trim();
            return !d || d !== "English Foundation Ladder";
          })
        : enriched;

    // ✅ Filter by tierId based on INFERRED tier (same as TierIndex).
    const filteredByTier =
      tierId
        ? filteredByDomain.filter(({ inferred }) => inferred === tierId)
        : filteredByDomain;

    if (import.meta.env.DEV) {
      const total = rows.length;
      const unknown = enriched.filter((x) => x.inferred === "unknown").length;
      const afterTier = filteredByTier.length;

      // eslint-disable-next-line no-console
      console.log(
        `[useCachedRooms] total=${total} unknown=${unknown} return=${afterTier} (tierId=${tierId ?? "ALL"})`
      );
    }

    // Sort by title_en for stable UI
    filteredByTier.sort((a, b) => {
      const ae = String(a.room.title_en || a.room.id || "").toLowerCase();
      const be = String(b.room.title_en || b.room.id || "").toLowerCase();
      return ae.localeCompare(be);
    });

    // Map to MinimalRoomData
    return filteredByTier.map(({ room, inferred }) => {
      // best-effort tier value for display; never used for filtering
      const tierForDisplay: TierId =
        inferred !== "unknown" ? inferred : "free";

      return {
        id: room.id,
        nameEn: room.title_en || room.id,
        nameVi: room.title_vi || "",
        tier: tierForDisplay,
        tierLabel: room.tier || "",
        hasData: true,
        track: (room.track as "core" | "bonus") || "core",
        domain: room.domain || undefined,
      };
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("Failed to fetch rooms:", err);
    return [];
  }
}

export function useCachedRooms(tierId?: TierId) {
  return useQuery({
    queryKey: [CACHE_KEY, tierId],
    queryFn: () => fetchCachedRooms(tierId),
    staleTime: CACHE_DURATION,
    gcTime: CACHE_DURATION * 2,
  });
}
