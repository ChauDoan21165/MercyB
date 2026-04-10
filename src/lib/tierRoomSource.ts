// src/lib/tierRoomSource.ts
// DB-only truth pipeline for Tier pages.
// - No /room-registry.json fallback
// - No PUBLIC_ROOM_MANIFEST fallback
// - Tier pages read room metadata from the database only
// - Tier is inferred from explicit DB tier first, then strict id/path markers, then legacy helper fallback
// - Area (core/english/life/kids) is inferred with hard overrides from id/title before trusting DB metadata
//
// Used by: TierIndex, TierDetail

import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

export type TierId =
  | "free"
  | "vip1"
  | "vip2"
  | "vip3"
  | "vip4"
  | "vip5"
  | "vip6"
  | "vip7"
  | "vip8"
  | "vip9"
  | "kids_1"
  | "kids_2"
  | "kids_3";

export type TierSource = "DB" | "none";

export type RoomArea = "core" | "english" | "life" | "kids" | "unknown";

export type TierRoom = {
  id: string;
  title_en?: string;
  title_vi?: string;
  domain?: string;
  track?: string;
  tier: TierId | "unknown";
  area: RoomArea;
};

export type TierLoadResult = {
  rooms: TierRoom[];
  source: TierSource;
  debug?: string;
};

type RoomDbRow = {
  id: string;
  title_en: string | null;
  title_vi: string | null;
  domain: string | null;
  track: string | null;
  tier: string | null;
};

export function isTierId(x: unknown): x is TierId {
  return (
    x === "free" ||
    x === "vip1" ||
    x === "vip2" ||
    x === "vip3" ||
    x === "vip4" ||
    x === "vip5" ||
    x === "vip6" ||
    x === "vip7" ||
    x === "vip8" ||
    x === "vip9" ||
    x === "kids_1" ||
    x === "kids_2" ||
    x === "kids_3"
  );
}

function normalizeLeafId(x: string): string {
  const s = String(x || "").trim();
  if (!s) return "";

  const noQuery = s.split("?")[0]?.split("#")[0] ?? s;
  const leaf = noQuery.replace(/\\/g, "/").split("/").pop() || noQuery;

  return leaf.replace(/\.json$/i, "").trim();
}

function normalizeDbTier(raw: unknown): TierId | "unknown" {
  const value = String(raw || "").trim().toLowerCase();

  if (isTierId(value)) return value;

  if (value === "kids1" || value === "kids-1" || value === "kids_l1") return "kids_1";
  if (value === "kids2" || value === "kids-2" || value === "kids_l2") return "kids_2";
  if (value === "kids3" || value === "kids-3" || value === "kids_l3") return "kids_3";

  return "unknown";
}

/**
 * STRICT tier detection:
 * - Determine tier ONLY when the id/path contains an explicit tier marker.
 * - Never allow "free" to be a default for unknown.
 *
 * Kids lesson ids are often ..._kids_l1/_kids_l2/_kids_l3
 * Map those to kids_1/2/3 so kids tier pages do not show empty.
 */
export function strictTierFromIdOrPath(idOrPath: string): TierId | "unknown" {
  const raw = String(idOrPath || "").trim();
  if (!raw) return "unknown";

  const leaf = normalizeLeafId(raw);
  const idLower = leaf.toLowerCase();

  if (
    idLower === "kids_1" ||
    idLower === "kids-1" ||
    /(^|[_-])kids[_-]?1($|[_-])/.test(idLower) ||
    /_kids_l1\b/.test(idLower) ||
    /_kidslevel1\b/.test(idLower)
  ) {
    return "kids_1";
  }

  if (
    idLower === "kids_2" ||
    idLower === "kids-2" ||
    /(^|[_-])kids[_-]?2($|[_-])/.test(idLower) ||
    /_kids_l2\b/.test(idLower) ||
    /_kidslevel2\b/.test(idLower)
  ) {
    return "kids_2";
  }

  if (
    idLower === "kids_3" ||
    idLower === "kids-3" ||
    /(^|[_-])kids[_-]?3($|[_-])/.test(idLower) ||
    /_kids_l3\b/.test(idLower) ||
    /_kidslevel3\b/.test(idLower)
  ) {
    return "kids_3";
  }

  if (/(^|[_-])vip9($|[_-])/.test(idLower)) return "vip9";
  if (/(^|[_-])vip8($|[_-])/.test(idLower)) return "vip8";
  if (/(^|[_-])vip7($|[_-])/.test(idLower)) return "vip7";
  if (/(^|[_-])vip6($|[_-])/.test(idLower)) return "vip6";
  if (/(^|[_-])vip5($|[_-])/.test(idLower)) return "vip5";
  if (/(^|[_-])vip4($|[_-])/.test(idLower)) return "vip4";
  if (/(^|[_-])vip3($|[_-])/.test(idLower)) return "vip3";
  if (/(^|[_-])vip2($|[_-])/.test(idLower)) return "vip2";
  if (/(^|[_-])vip1($|[_-])/.test(idLower)) return "vip1";

  if (/(^|[_-])free($|[_-])/.test(idLower)) return "free";

  const helperTier = String(tierFromRoomId(leaf) ?? "").trim().toLowerCase();
  if (helperTier && isTierId(helperTier)) {
    if (helperTier === "free") return "unknown";
    return helperTier;
  }

  return "unknown";
}

/**
 * DB fallback tier inference:
 * - When DB ids do not contain explicit "_vipX" markers, use the existing helper.
 * - Never let unknown silently default to free.
 */
function inferTierFromIdFallback(idOrPath: string): TierId | "unknown" {
  const leaf = normalizeLeafId(String(idOrPath || "").trim());
  if (!leaf) return "unknown";

  const helperTier = String(tierFromRoomId(leaf) ?? "").trim().toLowerCase();
  if (!helperTier || !isTierId(helperTier)) return "unknown";
  if (helperTier === "free") return "unknown";

  return helperTier;
}

function inferAreaFromIdHeuristics(idLower: string, titleLower: string): RoomArea {
  if (
    idLower.includes("survival") ||
    idLower.includes("life-skill") ||
    idLower.includes("life_skill") ||
    idLower.includes("life-skills") ||
    idLower.includes("life_skills") ||
    idLower.includes("public_speaking") ||
    idLower.includes("public-speaking") ||
    idLower.includes("debate") ||
    idLower.includes("discipline") ||
    idLower.includes("martial")
  ) {
    return "life";
  }

  if (
    idLower.startsWith("kids_") ||
    idLower.startsWith("kids-") ||
    idLower.includes("kids_track") ||
    idLower.includes("children_track") ||
    /_kids_l[123]\b/.test(idLower) ||
    /_kidslevel[123]\b/.test(idLower)
  ) {
    return "kids";
  }

  if (
    idLower.startsWith("english_") ||
    idLower.startsWith("english-") ||
    idLower.includes("english_a1_") ||
    idLower.includes("english_a2_") ||
    idLower.includes("english_b1_") ||
    idLower.includes("english_b2_") ||
    idLower.includes("english_c1_") ||
    idLower.includes("english_c2_") ||
    idLower.includes("english_foundation") ||
    idLower.includes("grammar_") ||
    idLower.includes("pronunciation") ||
    idLower.includes("vocabulary") ||
    idLower.includes("phonics") ||
    idLower.includes("spelling") ||
    idLower.includes("ielts") ||
    idLower.includes("toefl")
  ) {
    return "english";
  }

  if (
    titleLower.includes("public speaking") ||
    titleLower.includes("debate") ||
    titleLower.includes("survival") ||
    titleLower.includes("life skill") ||
    titleLower.includes("life-skill") ||
    titleLower.includes("discipline") ||
    titleLower.includes("martial")
  ) {
    return "life";
  }

  if (
    titleLower.includes("kids level") ||
    titleLower.includes("kids") ||
    titleLower.includes("children")
  ) {
    return "kids";
  }

  if (
    titleLower.includes("english") ||
    titleLower.includes("grammar") ||
    titleLower.includes("vocabulary") ||
    titleLower.includes("pronunciation") ||
    titleLower.includes("phonics") ||
    titleLower.includes("spelling") ||
    titleLower.includes("a1-") ||
    titleLower.includes("a2-") ||
    titleLower.includes("b1-") ||
    titleLower.includes("c1-") ||
    titleLower.includes("c2-")
  ) {
    return "english";
  }

  return "core";
}

function inferAreaFromMetaAndId(meta: {
  id: string;
  domain?: string | null;
  track?: string | null;
  title_en?: string | null;
  title_vi?: string | null;
}): RoomArea {
  const idLower = String(meta.id || "").toLowerCase();
  const domain = String(meta.domain || "").toLowerCase();
  const track = String(meta.track || "").toLowerCase();
  const titleLower = `${String(meta.title_en || "")} ${String(meta.title_vi || "")}`.toLowerCase();

  const byId = inferAreaFromIdHeuristics(idLower, titleLower);
  if (byId !== "core") return byId;

  if (domain.includes("english")) return "english";
  if (domain.includes("kids") || domain.includes("children")) return "kids";
  if (
    domain.includes("life") ||
    domain.includes("survival") ||
    domain.includes("public speaking") ||
    domain.includes("debate")
  ) {
    return "life";
  }

  if (track === "english") return "english";
  if (track === "kids") return "kids";
  if (track === "life" || track === "life_skills") return "life";
  if (track === "core" || track === "bonus") return "core";

  return "core";
}

async function tryLoadFromDb(): Promise<{ rooms: TierRoom[]; debug: string } | null> {
  try {
    const { data, error } = await supabase
      .from(ROOMS_TABLE)
      .select("id, title_en, title_vi, domain, track, tier")
      .returns<RoomDbRow[]>();

    if (error) {
      return {
        rooms: [],
        debug: `DB error: ${String((error as { message?: string })?.message || error)}`,
      };
    }

    const rows = (data || [])
      .map((row): TierRoom | null => {
        const id = String(row?.id || "").trim();
        if (!id) return null;

        let tier = normalizeDbTier(row.tier);
        if (tier === "unknown") tier = strictTierFromIdOrPath(id);
        if (tier === "unknown") tier = inferTierFromIdFallback(id);

        const area = inferAreaFromMetaAndId({
          id,
          domain: row.domain,
          track: row.track,
          title_en: row.title_en,
          title_vi: row.title_vi,
        });

        return {
          id,
          title_en: row.title_en ?? undefined,
          title_vi: row.title_vi ?? undefined,
          domain: row.domain ?? undefined,
          track: row.track ?? undefined,
          tier,
          area,
        };
      })
      .filter((row): row is TierRoom => row !== null);

    return {
      rooms: rows,
      debug: `DB rooms=${rows.length}`,
    };
  } catch (error) {
    return {
      rooms: [],
      debug: `DB exception: ${String((error as Error)?.message || error)}`,
    };
  }
}

export async function loadRoomsForTiers(): Promise<TierLoadResult> {
  const db = await tryLoadFromDb();
  if (db && db.rooms.length) {
    return {
      rooms: db.rooms,
      source: "DB",
      debug: db.debug,
    };
  }

  return {
    rooms: [],
    source: "none",
    debug: db?.debug || "DB returned no rooms",
  };
}

export function filterRoomsByTierAndArea(
  rooms: TierRoom[],
  tier: TierId,
  area: RoomArea
): TierRoom[] {
  return rooms.filter((room) => room.tier === tier && room.area === area);
}

export function computeCoreSpineCounts(
  rooms: TierRoom[],
  spineTiers: readonly TierId[]
): { totalCore: number; unknownTier: number; byTier: Record<string, number> } {
  const byTier: Record<string, number> = {};
  for (const tier of spineTiers) byTier[tier] = 0;

  let totalCore = 0;
  let unknownTier = 0;

  for (const room of rooms) {
    if (room.area !== "core") continue;

    totalCore += 1;

    if (room.tier === "unknown") {
      unknownTier += 1;
    } else if (byTier[room.tier] !== undefined) {
      byTier[room.tier] += 1;
    }
  }

  return { totalCore, unknownTier, byTier };
}