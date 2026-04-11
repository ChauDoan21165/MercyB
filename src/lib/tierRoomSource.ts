// PATH: src/lib/tierRoomSource.ts
// File: tierRoomSource.ts
//
// ONE truth pipeline for Tier pages:
// - Prefer richer source of truth between DB and registry
// - Public registry / manifest are fallback sources
// - Tier is inferred STRICT from id/path unless explicit valid tier exists
// - Area (core/english/life/kids) inferred with HARD OVERRIDES:
//   - If ID clearly indicates english/kids/life => that wins
//
// Used by: TierIndex, TierDetail

import { supabase } from "@/lib/supabaseClient";
import { ROOMS_TABLE } from "@/lib/constants/rooms";
import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";
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

export type TierSource =
  | "DB"
  | "data/registry.json"
  | "room-registry.json"
  | "PUBLIC_ROOM_MANIFEST"
  | "none";

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

export function isTierId(x: any): x is TierId {
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

function isRoomArea(x: any): x is RoomArea {
  return x === "core" || x === "english" || x === "life" || x === "kids" || x === "unknown";
}

function normalizeLeafId(x: string): string {
  const s = String(x || "").trim();
  if (!s) return "";
  const noQuery = s.split("?")[0]?.split("#")[0] ?? s;
  const leaf = noQuery.replace(/\\/g, "/").split("/").pop() || noQuery;
  return leaf.replace(/\.json$/i, "").trim().toLowerCase();
}

function normalizeTierValue(x: unknown): TierId | "unknown" {
  const t = String(x ?? "").trim().toLowerCase().replace(/-/g, "_");

  if (isTierId(t)) return t;

  if (t === "kids1" || t === "kids_l1" || t === "kidslevel1") return "kids_1";
  if (t === "kids2" || t === "kids_l2" || t === "kidslevel2") return "kids_2";
  if (t === "kids3" || t === "kids_l3" || t === "kidslevel3") return "kids_3";

  return "unknown";
}

/**
 * STRICT tier detection:
 * - Determine tier ONLY when the id/path contains an explicit tier marker.
 * - Never allow "free" to be a default for unknown.
 *
 * CRITICAL FIX:
 * - Kids lesson ids are often ..._kids_l1/_kids_l2/_kids_l3 (NOT kids_1/2/3)
 * - Map those to kids_1/2/3 so kids tier pages don't show empty.
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

  const t = String(tierFromRoomId(leaf) ?? "").trim().toLowerCase();
  if (t && isTierId(t)) {
    if (t === "free") return "unknown";
    return t;
  }

  return "unknown";
}

/**
 * DB / manifest fallback tier inference:
 * - When ids do not contain explicit "_vipX" markers, use existing tierFromRoomId().
 * - MUST NOT let anything default to free.
 */
function inferTierFromIdFallback(idOrPath: string): TierId | "unknown" {
  const leaf = normalizeLeafId(String(idOrPath || "").trim());
  if (!leaf) return "unknown";

  const t = String(tierFromRoomId(leaf) ?? "").trim().toLowerCase();
  if (!t || !isTierId(t)) return "unknown";
  if (t === "free") return "unknown";
  return t;
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
  area?: string | null;
}): RoomArea {
  const explicitArea = String(meta.area || "").trim().toLowerCase();
  if (isRoomArea(explicitArea)) return explicitArea;

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

function extractRoomLikesFromRegistryJson(json: any): { rooms: any[]; debug: string } {
  const asArray = (x: any) => (Array.isArray(x) ? x : []);

  if (Array.isArray(json)) return { rooms: json, debug: `registry shape: array(len=${json.length})` };

  const rooms = asArray(json?.rooms);
  if (rooms.length) return { rooms, debug: `registry shape: rooms[] (len=${rooms.length})` };

  const files = asArray(json?.files);
  if (files.length) return { rooms: files, debug: `registry shape: files[] (len=${files.length})` };

  const manifest = asArray(json?.manifest);
  if (manifest.length) return { rooms: manifest, debug: `registry shape: manifest[] (len=${manifest.length})` };

  const roomIds = asArray(json?.roomIds);
  if (roomIds.length) return { rooms: roomIds, debug: `registry shape: roomIds[] (len=${roomIds.length})` };

  const mapObj =
    (json?.roomDataMap && typeof json.roomDataMap === "object" ? json.roomDataMap : null) ||
    (json?.rooms && !Array.isArray(json.rooms) && typeof json.rooms === "object" ? json.rooms : null);

  if (mapObj) {
    const rooms2 = Object.keys(mapObj).map((id) => ({ id, ...(mapObj as any)[id] }));
    return { rooms: rooms2, debug: `registry shape: object-map(keys=${Object.keys(mapObj).length})` };
  }

  return { rooms: [], debug: `registry shape: unknown keys=${Object.keys(json || {}).join(",")}` };
}

function coerceTierRoomsFromAny(anyRooms: any[]): TierRoom[] {
  return (anyRooms || [])
    .map((r: any) => {
      if (typeof r === "string") {
        const id = String(r || "").trim();
        if (!id) return null;

        let tier = strictTierFromIdOrPath(id);
        if (tier === "unknown") tier = inferTierFromIdFallback(id);

        const area = inferAreaFromMetaAndId({ id });
        return { id, tier, area } as TierRoom;
      }

      if (r && typeof r === "object") {
        const id = String(r.id || r.roomId || r.path || r.file || "").trim();
        if (!id) return null;

        const title_en = (r.title_en ?? r.titleEn ?? r.title?.en ?? r.nameEn ?? r.name?.en ?? r.name ?? null) as any;
        const title_vi = (r.title_vi ?? r.titleVi ?? r.title?.vi ?? r.nameVi ?? r.name?.vi ?? null) as any;
        const domain = (r.domain ?? r.group ?? null) as any;
        const track = (r.track ?? r.path_track ?? r.category ?? null) as any;
        const areaRaw = (r.area ?? null) as any;

        let tier = normalizeTierValue(r.tier);
        if (tier === "unknown") tier = strictTierFromIdOrPath(id);
        if (tier === "unknown") tier = inferTierFromIdFallback(id);

        const area = inferAreaFromMetaAndId({
          id,
          domain: domain ?? null,
          track: track ?? null,
          title_en: title_en ?? null,
          title_vi: title_vi ?? null,
          area: areaRaw ? String(areaRaw) : null,
        });

        return {
          id,
          title_en: title_en ? String(title_en) : undefined,
          title_vi: title_vi ? String(title_vi) : undefined,
          domain: domain ? String(domain) : undefined,
          track: track ? String(track) : undefined,
          tier,
          area,
        } as TierRoom;
      }

      return null;
    })
    .filter(Boolean) as TierRoom[];
}

async function tryLoadFromRegistry(): Promise<{ rooms: TierRoom[]; debug: string; source: TierSource } | null> {
  const candidates: Array<{ url: string; source: TierSource }> = [
    { url: "/data/registry.json", source: "data/registry.json" },
    { url: "/room-registry.json", source: "room-registry.json" },
    { url: "/public/room-registry.json", source: "room-registry.json" },
  ];

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate.url, { cache: "no-store" });
      if (!res.ok) continue;

      const text = await res.text();
      if (text.trim().startsWith("<")) continue;

      const json = JSON.parse(text);
      const { rooms: roomLikes, debug } = extractRoomLikesFromRegistryJson(json);
      const rooms = coerceTierRoomsFromAny(roomLikes);

      if (rooms.length) {
        return {
          rooms,
          source: candidate.source,
          debug: `loaded ${candidate.url} | ${debug} -> rooms=${rooms.length}`,
        };
      }

      return {
        rooms: [],
        source: candidate.source,
        debug: `parsed ${candidate.url} but rooms=0 | ${debug}`,
      };
    } catch {
      // keep trying
    }
  }

  return null;
}

function loadFromManifest(): { rooms: TierRoom[]; debug: string } {
  const any: any = PUBLIC_ROOM_MANIFEST as any;
  let ids: string[] = [];

  if (Array.isArray(any)) {
    ids = any.map((x: any) => String(x || "").trim()).filter(Boolean);
  } else if (any && typeof any === "object") {
    ids = Object.keys(any)
      .map((x) => String(x || "").trim())
      .filter(Boolean);
  }

  const rooms = ids.map((id) => {
    let tier = strictTierFromIdOrPath(id);
    if (tier === "unknown") tier = inferTierFromIdFallback(id);
    const area = inferAreaFromMetaAndId({ id });
    return { id, tier, area } as TierRoom;
  });

  return { rooms, debug: `manifest ids=${ids.length}` };
}

async function tryLoadFromDb(): Promise<{ rooms: TierRoom[]; debug: string } | null> {
  try {
    const { data, error } = await supabase
      .from(ROOMS_TABLE)
      .select("id, title_en, title_vi, domain, track, tier")
      .returns<
        {
          id: string;
          title_en: string | null;
          title_vi: string | null;
          domain: string | null;
          track: string | null;
          tier: string | null;
        }[]
      >();

    if (error) {
      return { rooms: [], debug: `DB error: ${String((error as any)?.message || error)}` };
    }

    const rows = (data || [])
      .map((r) => {
        const id = String(r?.id || "").trim();
        if (!id) return null;

        let tier = normalizeTierValue(r.tier);
        if (tier === "unknown") tier = strictTierFromIdOrPath(id);
        if (tier === "unknown") tier = inferTierFromIdFallback(id);

        const area = inferAreaFromMetaAndId({
          id,
          domain: r.domain,
          track: r.track,
          title_en: r.title_en,
          title_vi: r.title_vi,
        });

        return {
          id,
          title_en: r.title_en ?? undefined,
          title_vi: r.title_vi ?? undefined,
          domain: r.domain ?? undefined,
          track: r.track ?? undefined,
          tier,
          area,
        } as TierRoom;
      })
      .filter(Boolean) as TierRoom[];

    return { rooms: rows, debug: `DB rooms=${rows.length}` };
  } catch (e: any) {
    return { rooms: [], debug: `DB exception: ${String(e?.message || e)}` };
  }
}

function dedupeRooms(rooms: TierRoom[]): TierRoom[] {
  const map = new Map<string, TierRoom>();

  for (const room of rooms || []) {
    const id = String(room?.id || "").trim();
    if (!id) continue;

    const prev = map.get(id);
    if (!prev) {
      map.set(id, room);
      continue;
    }

    map.set(id, {
      ...prev,
      ...room,
      title_en: room.title_en ?? prev.title_en,
      title_vi: room.title_vi ?? prev.title_vi,
      domain: room.domain ?? prev.domain,
      track: room.track ?? prev.track,
      tier: room.tier !== "unknown" ? room.tier : prev.tier,
      area: room.area !== "unknown" ? room.area : prev.area,
    });
  }

  return Array.from(map.values()).sort((a, b) => a.id.localeCompare(b.id));
}

export async function loadRoomsForTiers(): Promise<TierLoadResult> {
  const [db, reg] = await Promise.all([tryLoadFromDb(), tryLoadFromRegistry()]);

  if (db?.rooms?.length && reg?.rooms?.length) {
    const merged = dedupeRooms([...reg.rooms, ...db.rooms]);

    // If registry is richer, trust the merged result but keep DB metadata where present.
    if (merged.length > db.rooms.length) {
      return {
        rooms: merged,
        source: reg.source,
        debug: `merged richer registry+DB | ${reg.debug} | ${db.debug} | merged=${merged.length}`,
      };
    }

    return { rooms: db.rooms, source: "DB", debug: db.debug };
  }

  if (db && db.rooms.length) {
    return { rooms: db.rooms, source: "DB", debug: db.debug };
  }

  if (reg && reg.rooms.length) {
    return { rooms: reg.rooms, source: reg.source, debug: reg.debug };
  }

  if (reg && reg.rooms.length === 0) {
    return { rooms: [], source: reg.source, debug: reg.debug };
  }

  const man = loadFromManifest();
  if (man.rooms.length) {
    return { rooms: man.rooms, source: "PUBLIC_ROOM_MANIFEST", debug: man.debug };
  }

  return { rooms: [], source: "none", debug: "DB empty, registry not found, manifest empty" };
}

export function filterRoomsByTierAndArea(
  rooms: TierRoom[],
  tier: TierId,
  area: RoomArea,
): TierRoom[] {
  return rooms.filter((r) => r.tier === tier && r.area === area);
}

export function computeCoreSpineCounts(
  rooms: TierRoom[],
  spineTiers: readonly TierId[],
): { totalCore: number; unknownTier: number; byTier: Record<string, number> } {
  const byTier: Record<string, number> = {};
  for (const t of spineTiers) byTier[t] = 0;

  let totalCore = 0;
  let unknownTier = 0;

  for (const r of rooms) {
    if (r.area !== "core") continue;
    totalCore += 1;
    if (r.tier === "unknown") unknownTier += 1;
    else if (byTier[r.tier] !== undefined) byTier[r.tier] += 1;
  }

  return { totalCore, unknownTier, byTier };
}