// FILE: tierRoomSource.ts
// PATH: src/lib/tierRoomSource.ts
//
// ONE truth pipeline for Tier pages:
// - Prefer DB rooms list (id + domain + track + titles) if available
// - Fallback: /room-registry.json (various shapes)
// - Fallback: PUBLIC_ROOM_MANIFEST
// - Tier is inferred STRICT from id/path (unknown stays unknown)
// - Area (core/english/life/kids) inferred with HARD OVERRIDES:
//   - If ID clearly indicates english/kids/life => that wins (even if DB says track="core").
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

export type TierSource = "DB" | "room-registry.json" | "PUBLIC_ROOM_MANIFEST" | "none";

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

function normalizeLeafId(x: string): string {
  const s = String(x || "").trim();
  if (!s) return "";
  const noQuery = s.split("?")[0]?.split("#")[0] ?? s;
  const leaf = noQuery.replace(/\\/g, "/").split("/").pop() || noQuery;
  return leaf.replace(/\.json$/i, "").trim();
}

/**
 * STRICT tier detection:
 * - Determine tier ONLY when the id/path contains an explicit tier marker.
 * - Never allow "free" to be a default for unknown.
 *
 * CRITICAL FIX:
 * - Kids lesson ids are often ..._kids_l1/_kids_l2/_kids_l3 (NOT kids_1/2/3)
 * - Map those to kids_1/2/3 so kids tier pages don't show empty.
 *
 * IMPORTANT (VIP FIX):
 * - VIP markers may appear in the MIDDLE of ids (e.g. survival_resilience_vip1_srs02),
 *   so we must match vip tokens as bounded by separators, not suffix-only.
 *
 * EXTRA HARDEN (VIP4–VIP8 “0 outside but present inside”):
 * - Some ids are NOT cleanly separated (example patterns: "...vip6bonus", "...vip5bonus", "...vip4bonus")
 * - TierDetail can still show rooms (it filters by a different path),
 *   but TierMap’s counters rely on THIS function.
 * - Add a conservative “loose” match: vipN not followed by another digit.
 */
export function strictTierFromIdOrPath(idOrPath: string): TierId | "unknown" {
  const raw = String(idOrPath || "").trim();
  if (!raw) return "unknown";

  const leaf = normalizeLeafId(raw);
  const idLower = leaf.toLowerCase();

  // Helper: token match bounded by start/end or _/-
  const hasTok = (tok: string) => new RegExp(`(^|[_-])${tok}([_-]|$)`).test(idLower);

  // Helper: loose match for ids that contain "vip6bonus" (no separators).
  // IMPORTANT: ensure we do NOT match vip60/vip600 etc.
  const hasVipLoose = (n: number) => new RegExp(`vip${n}(?!\\d)`).test(idLower);

  // --- KIDS tiers (explicit + lesson id forms) ---
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

  // --- VIP tiers (explicit tokens anywhere) ---
  if (hasTok("vip9")) return "vip9";
  if (hasTok("vip8")) return "vip8";
  if (hasTok("vip7")) return "vip7";
  if (hasTok("vip6")) return "vip6";
  if (hasTok("vip5")) return "vip5";
  if (hasTok("vip4")) return "vip4";
  if (hasTok("vip3ii")) return "vip3"; // legacy vip3ii -> vip3
  if (hasTok("vip3")) return "vip3";
  if (hasTok("vip2")) return "vip2";
  if (hasTok("vip1")) return "vip1";

  // --- VIP tiers (LOOSE, separator-less forms) ---
  // Keep order high -> low
  if (hasVipLoose(9)) return "vip9";
  if (hasVipLoose(8)) return "vip8";
  if (hasVipLoose(7)) return "vip7";
  if (hasVipLoose(6)) return "vip6";
  if (hasVipLoose(5)) return "vip5";
  if (hasVipLoose(4)) return "vip4";
  if (hasVipLoose(3)) return "vip3";
  if (hasVipLoose(2)) return "vip2";
  if (hasVipLoose(1)) return "vip1";

  // --- Free (explicit only) ---
  if (hasTok("free")) return "free";

  // --- Fallback to existing helper ONLY if it returns a tier AND it's not the "free default" case ---
  const t = String(tierFromRoomId(leaf) ?? "").trim().toLowerCase();
  if (t && isTierId(t)) {
    if (t === "free") return "unknown";
    return t;
  }

  return "unknown";
}

function inferAreaFromIdHeuristics(idLower: string, titleLower: string): RoomArea {
  // ✅ ORDER MATTERS:
  // 1) LIFE (right) must override everything
  // 2) KIDS (explicit kids + kids lesson ids) MUST come before ENGLISH
  // 3) ENGLISH (left)

  // ✅ LIFE (right) explicit markers
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

  // ✅ KIDS (explicit kids system ids + lesson-id forms)
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

  // ✅ ENGLISH (left)
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

  // Title fallback (lower confidence)
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

  if (titleLower.includes("kids level") || titleLower.includes("kids") || titleLower.includes("children")) {
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

  // ✅ HARD OVERRIDE: ID/Title signals win
  const byId = inferAreaFromIdHeuristics(idLower, titleLower);
  if (byId !== "core") return byId;

  // ✅ Only trust DB when explicitly english/kids/life
  if (domain.includes("english")) return "english";
  if (domain.includes("kids") || domain.includes("children")) return "kids";
  if (
    domain.includes("life") ||
    domain.includes("survival") ||
    domain.includes("public speaking") ||
    domain.includes("debate")
  )
    return "life";

  if (track === "english") return "english";
  if (track === "kids") return "kids";
  if (track === "life" || track === "life_skills") return "life";

  // ✅ ONLY NOW allow DB “core/bonus”
  if (track === "core" || track === "bonus") return "core";

  return "core";
}

// extract room-like objects from many possible registry shapes
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
        const tier = strictTierFromIdOrPath(id);
        const area = inferAreaFromMetaAndId({ id });
        return { id, tier, area } as TierRoom;
      }

      if (r && typeof r === "object") {
        const id = String(r.id || r.roomId || r.path || r.file || "").trim();
        if (!id) return null;

        const title_en = (r.title_en ?? r.titleEn ?? r.title?.en ?? r.nameEn ?? r.name?.en ?? r.name ?? null) as any;
        const title_vi = (r.title_vi ?? r.titleVi ?? r.title?.vi ?? r.nameVi ?? r.name?.vi ?? null) as any;
        const domain = (r.domain ?? r.area ?? r.group ?? null) as any;
        const track = (r.track ?? r.path_track ?? r.category ?? null) as any;

        const tier = strictTierFromIdOrPath(id);
        const area = inferAreaFromMetaAndId({
          id,
          domain: domain ?? null,
          track: track ?? null,
          title_en: title_en ?? null,
          title_vi: title_vi ?? null,
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

async function tryLoadFromRegistry(): Promise<{ rooms: TierRoom[]; debug: string } | null> {
  const candidates = ["/room-registry.json", "/public/room-registry.json"];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;

      const text = await res.text();
      if (text.trim().startsWith("<")) continue;

      const json = JSON.parse(text);
      const { rooms: roomLikes, debug } = extractRoomLikesFromRegistryJson(json);
      const rooms = coerceTierRoomsFromAny(roomLikes);

      if (rooms.length) return { rooms, debug: `loaded ${url} | ${debug} -> rooms=${rooms.length}` };
      return { rooms: [], debug: `parsed ${url} but rooms=0 | ${debug}` };
    } catch {
      // keep trying
    }
  }

  return null;
}

function loadFromManifest(): { rooms: TierRoom[]; debug: string } {
  const any: any = PUBLIC_ROOM_MANIFEST as any;
  let ids: string[] = [];

  if (Array.isArray(any)) ids = any.map((x: any) => String(x || "").trim()).filter(Boolean);
  else if (any && typeof any === "object") ids = Object.keys(any).map((x) => String(x || "").trim()).filter(Boolean);

  const rooms = ids.map((id) => {
    const tier = strictTierFromIdOrPath(id);
    const area = inferAreaFromMetaAndId({ id });
    return { id, tier, area } as TierRoom;
  });

  return { rooms, debug: `manifest ids=${ids.length}` };
}

function normalizeTierFromDbValue(x: any): TierId | null {
  const t = String(x ?? "").trim().toLowerCase();
  if (!t) return null;
  if (isTierId(t)) return t;
  return null;
}

async function tryLoadFromDb(): Promise<{ rooms: TierRoom[]; debug: string } | null> {
  // We try SELECT with "tier" column first (best-effort).
  // If the column doesn't exist, fallback to the old select without breaking the pipeline.
  try {
    // Attempt 1: with tier
    type RowWithTier = {
      id: string;
      title_en: string | null;
      title_vi: string | null;
      domain: string | null;
      track: string | null;
      tier?: any;
    };

    const { data, error } = await supabase
      .from(ROOMS_TABLE)
      .select("id, title_en, title_vi, domain, track, tier")
      .returns<RowWithTier[]>();

    if (error) {
      // If "tier" doesn't exist, retry old select.
      const msg = String((error as any)?.message || error);
      const looksLikeMissingColumn = msg.toLowerCase().includes("column") && msg.toLowerCase().includes("tier");

      if (!looksLikeMissingColumn) {
        return { rooms: [], debug: `DB error: ${msg}` };
      }

      // Attempt 2: without tier (legacy)
      type RowLegacy = {
        id: string;
        title_en: string | null;
        title_vi: string | null;
        domain: string | null;
        track: string | null;
      };

      const legacy = await supabase.from(ROOMS_TABLE).select("id, title_en, title_vi, domain, track").returns<RowLegacy[]>();

      if (legacy.error) {
        return {
          rooms: [],
          debug: `DB error(legacy): ${String((legacy.error as any)?.message || legacy.error)}`,
        };
      }

      const rows = (legacy.data || [])
        .map((r) => {
          const id = String(r?.id || "").trim();
          if (!id) return null;

          const tier = strictTierFromIdOrPath(id);
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

      return { rooms: rows, debug: `DB rooms=${rows.length} (legacy select: no tier col)` };
    }

    const rows = (data || [])
      .map((r) => {
        const id = String(r?.id || "").trim();
        if (!id) return null;

        // ✅ Prefer DB tier if present & valid; otherwise infer strictly from id.
        const tierFromDb = normalizeTierFromDbValue((r as any).tier);
        const tier = tierFromDb ?? strictTierFromIdOrPath(id);

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

    return { rooms: rows, debug: `DB rooms=${rows.length} (tier col preferred when valid)` };
  } catch (e: any) {
    return { rooms: [], debug: `DB exception: ${String(e?.message || e)}` };
  }
}

export async function loadRoomsForTiers(): Promise<TierLoadResult> {
  const db = await tryLoadFromDb();
  if (db && db.rooms.length) return { rooms: db.rooms, source: "DB", debug: db.debug };

  const reg = await tryLoadFromRegistry();
  if (reg && reg.rooms.length) return { rooms: reg.rooms, source: "room-registry.json", debug: reg.debug };
  if (reg && reg.rooms.length === 0) return { rooms: [], source: "room-registry.json", debug: reg.debug };

  const man = loadFromManifest();
  if (man.rooms.length) return { rooms: man.rooms, source: "PUBLIC_ROOM_MANIFEST", debug: man.debug };

  return { rooms: [], source: "none", debug: "DB empty, registry not found, manifest empty" };
}

export function filterRoomsByTierAndArea(rooms: TierRoom[], tier: TierId, area: RoomArea): TierRoom[] {
  return rooms.filter((r) => r.tier === tier && r.area === area);
}

export function computeCoreSpineCounts(
  rooms: TierRoom[],
  spineTiers: readonly TierId[]
): { totalCore: number; unknownTier: number; byTier: Record<string, number> } {
  const byTier: Record<string, number> = {};
  for (const t of spineTiers) byTier[t] = 0;

  let totalCore = 0;
  let unknownTier = 0;

  for (const r of rooms) {
    if (r.area !== "core") continue;
    totalCore += 1;

    if (r.tier === "unknown") {
      unknownTier += 1;
      continue;
    }

    const key = String(r.tier);
    if (byTier[key] === undefined) byTier[key] = 0;
    byTier[key] += 1;
  }

  return { totalCore, unknownTier, byTier };
}
