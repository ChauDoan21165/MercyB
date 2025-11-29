import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  type TierId,
  type TierValue,
  TIER_ID_TO_LABEL,
  normalizeTier,
} from "@/lib/constants/tiers";
import { ROOMS_TABLE } from "@/lib/constants/rooms";

export interface MinimalRoomData {
  id: string;
  nameEn: string;
  nameVi: string;
  tier: TierId;
  hasData: boolean;
  color?: string;
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
  return SYSTEM_FILES_PATTERNS.some((pattern) =>
    lowerCaseId.includes(pattern)
  );
}

// Fetch minimal room data from database
async function fetchCachedRooms(tierId?: TierId): Promise<MinimalRoomData[]> {
  try {
    let query = supabase
      .from(ROOMS_TABLE)
      .select("id, title_en, title_vi, tier, schema_id, domain");

    if (tierId) {
      // Map TierId → canonical human label from TIERS
      const tierLabel: TierValue = TIER_ID_TO_LABEL[tierId];
      query = query.eq("tier", tierLabel);
    }

    // Exclude English Pathway rooms AFTER tier filter, but NOT for free tier
    if (tierId && tierId !== "free") {
      query = query.or(
        'domain.is.null,domain.neq."English Foundation Ladder"'
      );
    }

    const { data, error } = await query.order("title_en");

    if (error) throw error;

    return (data || [])
      .filter((room) => !isSystemFile(room.id))
      .map((room) => ({
        id: room.id,
        nameEn: room.title_en || room.id,
        nameVi: room.title_vi || "",
        // Normalize whatever is in DB to TierId canon
        tier: normalizeTier(room.tier || "free"),
        hasData: true,
      }));
  } catch (err) {
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
