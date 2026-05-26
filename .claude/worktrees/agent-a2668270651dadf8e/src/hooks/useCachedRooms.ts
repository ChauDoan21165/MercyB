// src/hooks/useCachedRooms.ts

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
  tier: TierId;
  tierLabel?: string;
  hasData: boolean;
  color?: string;
  track?: "core" | "bonus";
  domain?: string;
}

const CACHE_KEY      = "rooms-cache";
const CACHE_DURATION = 5 * 60 * 1000;

const SYSTEM_FILES_PATTERNS = [
  "package", "lock", "node_modules", ".git", "config", "ryrus",
  "tsconfig", "vite", "eslint", "prettier", "readme", "license",
  "changelog", ".env", "docker",
];

function isSystemFile(id: string): boolean {
  const lower = id.toLowerCase();
  return SYSTEM_FILES_PATTERNS.some((pattern) => lower.includes(pattern));
}

type RoomRow = {
  id: string;
  title_en: string | null;
  title_vi: string | null;
  tier: string | null;
  domain: string | null;
  track: string | null;
};

function inferTierStrict(room: RoomRow): TierId | "unknown" {
  const id = String(room?.id || "").trim();
  if (id) {
    const t = tierFromRoomId(id);
    if (t && isValidTierId(t)) return t;
  }

  const rawLabel = String(room?.tier || "").trim();
  if (rawLabel) {
    const n = normalizeTier(rawLabel);
    if (isValidTierId(n)) return n;
  }

  return "unknown";
}

async function fetchCachedRooms(tierId?: TierId): Promise<MinimalRoomData[]> {
  try {
    const query = supabase
      .from(ROOMS_TABLE)
      .select("id, title_en, title_vi, tier, domain, track");

    if (import.meta.env.DEV) {
      console.log("[useCachedRooms] Fetching rooms (NO DB tier filter). tierId:", tierId);
    }

    const { data, error } = await query.returns<RoomRow[]>();

    if (error) {
      if (import.meta.env.DEV) {
        console.error("[useCachedRooms] Query error:", error);
      }
      throw error;
    }

    const rows = (data ?? []).filter((room) => room?.id && !isSystemFile(room.id));

    const enriched = rows.map((room) => ({
      room,
      inferred: inferTierStrict(room),
    }));

    const filteredByDomain =
      tierId && tierId !== "level0"
        ? enriched.filter(({ room }) => {
            const d = String(room.domain ?? "").trim();
            return !d || d !== "English Foundation Ladder";
          })
        : enriched;

    const filteredByTier = tierId
      ? filteredByDomain.filter(({ inferred }) => inferred === tierId)
      : filteredByDomain;

    if (import.meta.env.DEV) {
      const total   = rows.length;
      const unknown = enriched.filter((x) => x.inferred === "unknown").length;
      console.log(
        `[useCachedRooms] total=${total} unknown=${unknown} return=${filteredByTier.length} (tierId=${tierId ?? "ALL"})`,
      );
    }

    filteredByTier.sort((a, b) => {
      const ae = String(a.room.title_en || a.room.id || "").toLowerCase();
      const be = String(b.room.title_en || b.room.id || "").toLowerCase();
      return ae.localeCompare(be);
    });

    return filteredByTier.map(({ room, inferred }) => ({
      id: room.id,
      nameEn: room.title_en || room.id,
      nameVi: room.title_vi || "",
      tier: inferred !== "unknown" ? inferred : "level0",
      tierLabel: room.tier || "",
      hasData: true,
      track: (room.track as "core" | "bonus") || "core",
      domain: room.domain || undefined,
    }));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("[useCachedRooms] Failed to fetch rooms:", err);
    }
    return [];
  }
}

export function useCachedRooms(tierId?: TierId) {
  return useQuery({
    queryKey: [CACHE_KEY, tierId],
    queryFn:  () => fetchCachedRooms(tierId),
    staleTime: CACHE_DURATION,
    gcTime:    CACHE_DURATION * 2,
  });
}