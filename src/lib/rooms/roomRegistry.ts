/**
 * Room Registry - Single Source of Truth for All Room Metadata
 *
 * Hybrid mode:
 * - In tests, prefers roomDataImports.roomDataMap (easy to mock, deterministic)
 * - In runtime, falls back to async roomFetcher
 *
 * Preserves:
 * - async cached registry + sync fallback
 * - domain + tags + counts helpers
 * - tolerant title/keyword field parsing
 * - id normalization (- -> _) so navigation/search/tests match
 * - tier inference via tierFromRoomId (VIP3II -> VIP3 collapse)
 */

import { getAllRooms as fetchAllRooms } from "@/lib/roomFetcher";
import { normalizeTier, TierId, ALL_TIER_IDS } from "@/lib/constants/tiers";
import { getDomainCategory, type DomainCategory } from "@/lib/mercy-host/domainMap";
import { tierFromRoomId } from "@/lib/tierFromRoomId";

// NOTE: This import is intentionally here so tests can vi.mock it.
// In runtime, it can exist but may be empty depending on build mode.
import { roomDataMap } from "@/lib/roomDataImports";

/**
 * Normalized room metadata for search and discovery
 */
export interface RoomMeta {
  id: string;
  tier: TierId;
  domain: DomainCategory;
  title_en: string;
  title_vi: string;
  keywords_en: string[];
  keywords_vi: string[];
  tags: string[];
  hasData: boolean;
}

// Cache for room registry
let roomRegistryCache: RoomMeta[] | null = null;
let roomRegistryPromise: Promise<RoomMeta[]> | null = null;
let roomByIdCache: Map<string, RoomMeta> | null = null;

/**
 * Canonical room id in this repo uses underscores.
 * Accept hyphen inputs from URLs/navigation and normalize to underscore.
 */
const normalizeRoomId = (raw: string) =>
  String(raw ?? "")
    .trim()
    .replace(/-/g, "_")
    .replace(/__+/g, "_");

/** Lowercase + de-dupe + trim list */
function cleanList(values: any[]): string[] {
  return [
    ...new Set(
      values
        .map((v) => String(v ?? "").trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function pickTitles(roomData: any): { en: string; vi: string } {
  // Supports multiple formats:
  // 1) title: { en, vi }
  // 2) name + name_vi
  // 3) title_en/title_vi
  // 4) titleEn/titleVi
  // 5) nameEn/nameVi
  const en = String(
    roomData?.title?.en ??
      roomData?.title_en ??
      roomData?.titleEn ??
      roomData?.nameEn ??
      roomData?.name ??
      "",
  ).trim();

  const vi = String(
    roomData?.title?.vi ??
      roomData?.title_vi ??
      roomData?.titleVi ??
      roomData?.nameVi ??
      roomData?.name_vi ??
      "",
  ).trim();

  return { en, vi };
}

function toArray(v: any): any[] {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === "string") return [v];
  return [];
}

function pickKeywords(roomData: any): { en: string[]; vi: string[] } {
  // Room-level keyword variants:
  // - keywords_en / keywords_vi
  // - keywordsEn / keywordsVi
  // - keywordMenu: { en, vi }
  // - keywords: string[] (single list)
  const en: any[] = [];
  const vi: any[] = [];

  en.push(...toArray(roomData?.keywords_en));
  vi.push(...toArray(roomData?.keywords_vi));

  en.push(...toArray(roomData?.keywordsEn));
  vi.push(...toArray(roomData?.keywordsVi));

  en.push(...toArray(roomData?.keywordMenu?.en));
  vi.push(...toArray(roomData?.keywordMenu?.vi));

  // If only a single keywords list exists, include it in both (better than losing it)
  const flat = toArray(roomData?.keywords);
  if (flat.length) {
    en.push(...flat);
    vi.push(...flat);
  }

  // Entry-level keywords (old behavior)
  if (Array.isArray(roomData?.entries)) {
    for (const entry of roomData.entries) {
      en.push(...toArray(entry?.keywords_en));
      vi.push(...toArray(entry?.keywords_vi));
      en.push(...toArray(entry?.keywordsEn));
      vi.push(...toArray(entry?.keywordsVi));
    }
  }

  return { en: cleanList(en), vi: cleanList(vi) };
}

function pickTags(roomData: any): string[] {
  const tags: any[] = [];

  // Entry-level tags (old behavior)
  if (Array.isArray(roomData?.entries)) {
    for (const entry of roomData.entries) {
      tags.push(...toArray(entry?.tags));
    }
  }

  // Some datasets might have room-level tags
  tags.push(...toArray(roomData?.tags));

  return cleanList(tags);
}

function inferTier(roomId: string, roomData: any): TierId {
  // Prefer explicit tier if present, but normalize.
  // If missing/garbage, infer from ID (VIP3II -> VIP3 collapse handled in tierFromRoomId).
  const raw = roomData?.tier ?? roomData?.tierId ?? roomData?.accessTier ?? "";
  const normalized = normalizeTier(raw);
  if (normalized && normalized !== "free") return normalized;

  // If normalized tier is "free" but the id indicates VIP, trust the id.
  const inferred = tierFromRoomId(roomId);
  return inferred ?? "free";
}

/**
 * 🔥 Critical fix:
 * Build registry synchronously from roomDataMap (if present) so anything computed
 * at module-import time (coverageReport/search index) sees a populated registry.
 */
function ensureRegistryFromRoomDataMapSync(): void {
  if (roomRegistryCache) return;

  if (!roomDataMap || typeof roomDataMap !== "object") return;

  const entries = Object.entries(roomDataMap as Record<string, any>);
  if (!entries.length) return;

  const rooms: RoomMeta[] = [];

  for (const [mapId, roomData] of entries) {
    try {
      const rawId = String(roomData?.id ?? mapId ?? "").trim();
      if (!rawId) continue;

      const id = normalizeRoomId(rawId);

      const { en: title_en, vi: title_vi } = pickTitles(roomData);

      // NOTE: For sync map bootstrap (tests/coverage), do NOT skip missing titles.
      // Coverage expects 1:1 with manifest/map.
      const tier = inferTier(id, roomData);
      const domain = getDomainCategory(id, (roomData as any)?.domain);
      const { en: keywords_en, vi: keywords_vi } = pickKeywords(roomData);
      const tags = pickTags(roomData);

      rooms.push({
        id,
        tier,
        domain,
        title_en: title_en || "",
        title_vi: title_vi || "",
        keywords_en,
        keywords_vi,
        tags,
        hasData: Boolean(roomData?.hasData ?? roomData?.has_data ?? true),
      });
    } catch (error) {
      console.error(
        `[RoomRegistry] Error processing room ${String(mapId)}:`,
        error,
      );
    }
  }

  roomRegistryCache = rooms.sort((a, b) => a.id.localeCompare(b.id));
  roomByIdCache = new Map(roomRegistryCache.map((r) => [r.id, r]));
}

/**
 * Build registry from roomDataMap (sync source) OR fetcher (async source)
 */
async function getRawRooms(): Promise<any[]> {
  // Prefer roomDataMap when it exists and is non-empty (tests)
  if (roomDataMap && typeof roomDataMap === "object") {
    const values = Object.values(roomDataMap as Record<string, any>);
    if (values.length > 0) return values as any[];
  }

  // Runtime fallback
  return (await fetchAllRooms()) as any[];
}

/**
 * Build the room registry from fetched rooms (async runtime path)
 */
async function buildRegistryAsync(): Promise<RoomMeta[]> {
  const fetchedRooms = await getRawRooms();
  const rooms: RoomMeta[] = [];

  if (!Array.isArray(fetchedRooms) || fetchedRooms.length === 0) {
    console.warn("[RoomRegistry] No rooms found from source");
    return rooms;
  }

  for (const roomData of fetchedRooms) {
    try {
      const rawId = String(roomData?.id ?? "").trim();
      if (!rawId) continue;

      const id = normalizeRoomId(rawId);

      const { en: title_en, vi: title_vi } = pickTitles(roomData);

      // Keep stricter behavior for runtime fetcher path if you want:
      // (You can relax this if it causes missing rooms in production.)
      if (!title_en || !title_vi) {
        continue;
      }

      const tier = inferTier(id, roomData);
      const domain = getDomainCategory(id, (roomData as any)?.domain);
      const { en: keywords_en, vi: keywords_vi } = pickKeywords(roomData);
      const tags = pickTags(roomData);

      rooms.push({
        id,
        tier,
        domain,
        title_en,
        title_vi,
        keywords_en,
        keywords_vi,
        tags,
        hasData: Boolean(roomData?.hasData ?? roomData?.has_data ?? true),
      });
    } catch (error) {
      console.error(
        `[RoomRegistry] Error processing room ${String(roomData?.id ?? "(unknown)")}:`,
        error,
      );
    }
  }

  return rooms.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Get all rooms from the registry (async, cached)
 */
export async function getAllRoomsAsync(): Promise<RoomMeta[]> {
  // Ensure sync bootstrap first (helps tests even when they call async)
  ensureRegistryFromRoomDataMapSync();
  if (roomRegistryCache) return roomRegistryCache;

  if (!roomRegistryPromise) {
    roomRegistryPromise = buildRegistryAsync().then((rooms) => {
      roomRegistryCache = rooms;
      roomByIdCache = new Map(rooms.map((room) => [room.id, room]));
      return rooms;
    });
  }

  return roomRegistryPromise;
}

/**
 * Get all rooms (sync)
 */
export function getAllRooms(): RoomMeta[] {
  ensureRegistryFromRoomDataMapSync();
  if (!roomRegistryCache) {
    // Trigger async load in background for runtime
    getAllRoomsAsync().catch(console.error);
    return [];
  }
  return roomRegistryCache;
}

/**
 * Get rooms filtered by tier (async)
 */
export async function getRoomsByTierAsync(tierId: TierId): Promise<RoomMeta[]> {
  const rooms = await getAllRoomsAsync();
  const t = normalizeTier(tierId);
  return rooms.filter((room) => room.tier === t);
}

/**
 * Get rooms filtered by tier (sync)
 */
export function getRoomsByTier(tierId: TierId): RoomMeta[] {
  const t = normalizeTier(tierId);
  return getAllRooms().filter((room) => room.tier === t);
}

/**
 * Get rooms filtered by domain
 */
export function getRoomsByDomain(domain: DomainCategory): RoomMeta[] {
  return getAllRooms().filter((room) => room.domain === domain);
}

/**
 * Get a room by ID (sync, cached lookup)
 */
export function getRoomById(id: string): RoomMeta | undefined {
  ensureRegistryFromRoomDataMapSync();
  if (!roomByIdCache) {
    getAllRoomsAsync().catch(console.error);
    return undefined;
  }
  return roomByIdCache.get(normalizeRoomId(id));
}

/**
 * Get a room by ID (async)
 */
export async function getRoomByIdAsync(id: string): Promise<RoomMeta | undefined> {
  await getAllRoomsAsync();
  return roomByIdCache?.get(normalizeRoomId(id));
}

/**
 * Get room counts by tier
 */
export function getRoomCountsByTier(): Record<TierId, number> {
  const counts = Object.fromEntries(ALL_TIER_IDS.map((tier) => [tier, 0])) as Record<
    TierId,
    number
  >;

  for (const room of getAllRooms()) {
    if (counts[room.tier] !== undefined) counts[room.tier]++;
  }

  return counts;
}

/**
 * Get room counts by domain
 */
export function getRoomCountsByDomain(): Record<DomainCategory, number> {
  const counts: Record<DomainCategory, number> = {
    english: 0,
    health: 0,
    strategy: 0,
    kids: 0,
    martial: 0,
    other: 0,
  };

  for (const room of getAllRooms()) {
    counts[room.domain]++;
  }

  return counts;
}

/**
 * Refresh the registry cache (call after new rooms are added)
 */
export function refreshRegistry(): void {
  roomRegistryCache = null;
  roomByIdCache = null;
  roomRegistryPromise = null;
}

/**
 * Get total room count
 */
export function getTotalRoomCount(): number {
  return getAllRooms().length;
}

// Optional: eagerly bootstrap in test/manifest contexts
// so import-time computations see rooms immediately.
ensureRegistryFromRoomDataMapSync();