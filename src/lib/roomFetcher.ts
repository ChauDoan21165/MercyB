/**
 * Room Fetcher API - Single Entry Point for All Room Data
 * 
 * Provides unified runtime loading of room data from JSON or Supabase.
 * Uses in-memory caching to prevent redundant fetches.
 * Source configurable via VITE_ROOM_SOURCE env variable.
 */

import { supabase } from "@/integrations/supabase/client";

export type RoomSource = "json" | "supabase";

// SUPABASE IS NOW THE ONLY SOURCE OF TRUTH
// JSON files in public/data are deprecated and should be ignored
const ROOM_SOURCE: RoomSource = "supabase";

export interface RoomTitle {
  en: string;
  vi: string;
}

export interface RoomContent {
  en: string;
  vi: string;
  audio?: string;
}

export interface RoomEntryCopy {
  en: string;
  vi: string;
}

export interface RoomEntry {
  slug: string;
  copy: RoomEntryCopy;
  audio?: string;
  tags?: string[];
  keywords_en?: string[];
  keywords_vi?: string[];
  [key: string]: unknown;
}

export interface RoomJson {
  id: string;
  tier: string;
  title: RoomTitle;
  content: RoomContent;
  entries: RoomEntry[];
  keywords_en?: string[];
  keywords_vi?: string[];
  domain?: string;
  [key: string]: unknown;
}

/**
 * Minimal room metadata for listing (lightweight)
 */
export interface RoomMeta {
  id: string;
  tier: string;
  nameEn: string;
  nameVi: string;
  domain?: string;
  hasData: boolean;
}

// --------- Simple in-memory caches ---------

const roomCache = new Map<string, Promise<RoomJson | null>>();
const roomMetaCache = new Map<string, RoomMeta>();
let roomListCache: Promise<RoomMeta[]> | null = null;
let fullRoomListCache: Promise<RoomJson[]> | null = null;

// --------- JSON helpers (from /public/data) ---------

async function fetchRoomFromJson(roomId: string): Promise<RoomJson | null> {
  try {
    const res = await fetch(`/data/${roomId}.json`, { cache: "default" });
    if (!res.ok) {
      console.warn("[roomFetcher] JSON room not found:", roomId, res.status);
      return null;
    }
    const json = await res.json();
    
    // Normalize to RoomJson structure
    const room: RoomJson = {
      id: json.id || roomId,
      tier: json.tier || extractTierFromId(roomId),
      title: {
        en: json.title?.en || json.title_en || json.nameEn || roomId,
        vi: json.title?.vi || json.title_vi || json.nameVi || roomId,
      },
      content: {
        en: json.description?.en || json.room_essay?.en || "",
        vi: json.description?.vi || json.room_essay?.vi || "",
        audio: json.content_audio || undefined,
      },
      entries: normalizeEntries(json.entries || []),
      keywords_en: extractKeywordsArray(json, "en"),
      keywords_vi: extractKeywordsArray(json, "vi"),
      domain: json.domain,
    };
    
    return room;
  } catch (err) {
    console.error("[roomFetcher] JSON fetch error:", roomId, err);
    return null;
  }
}

function normalizeEntries(entries: any[]): RoomEntry[] {
  if (!Array.isArray(entries)) return [];
  
  return entries.map((entry, index) => ({
    slug: entry.slug || entry.artifact_id || entry.id || `entry-${index}`,
    copy: {
      en: entry.copy?.en || entry.content?.en || entry.title?.en || "",
      vi: entry.copy?.vi || entry.content?.vi || entry.title?.vi || "",
    },
    audio: entry.audio || entry.audio_en || undefined,
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    keywords_en: Array.isArray(entry.keywords_en) ? entry.keywords_en : [],
    keywords_vi: Array.isArray(entry.keywords_vi) ? entry.keywords_vi : [],
  }));
}

function extractKeywordsArray(json: any, lang: "en" | "vi"): string[] {
  const keywords: string[] = [];
  const key = `keywords_${lang}`;
  
  // From top-level keywords_en/keywords_vi
  if (Array.isArray(json[key])) {
    keywords.push(...json[key]);
  }
  
  // From keywords object
  if (json.keywords && typeof json.keywords === "object") {
    Object.values(json.keywords).forEach((group: any) => {
      if (group?.[lang] && Array.isArray(group[lang])) {
        keywords.push(...group[lang]);
      }
    });
  }
  
  return [...new Set(keywords.filter(k => typeof k === "string"))];
}

function extractTierFromId(roomId: string): string {
  const match = roomId.match(/(vip\d+|free|kids_l?\d)/i);
  return match ? match[1].toLowerCase() : "free";
}

async function fetchRoomListFromJson(): Promise<RoomMeta[]> {
  try {
    // Fetch the room registry manifest
    const manifestRes = await fetch("/data/room-registry.json", {
      cache: "default",
    });

    if (!manifestRes.ok) {
      console.warn("[roomFetcher] room-registry.json not found, returning []");
      return [];
    }

    const manifest = await manifestRes.json();
    
    // If manifest is already an object with room metadata
    if (manifest && typeof manifest === "object" && !Array.isArray(manifest)) {
      const rooms: RoomMeta[] = [];
      
      for (const [roomId, data] of Object.entries(manifest)) {
        if (roomId === "rooms" && Array.isArray(data)) {
          // manifest.rooms is an array of IDs
          for (const id of data as string[]) {
            rooms.push({
              id,
              tier: extractTierFromId(id),
              nameEn: id,
              nameVi: id,
              hasData: true,
            });
          }
        } else if (typeof data === "object" && data !== null) {
          const d = data as any;
          rooms.push({
            id: roomId,
            tier: d.tier || extractTierFromId(roomId),
            nameEn: d.nameEn || d.title_en || roomId,
            nameVi: d.nameVi || d.title_vi || roomId,
            domain: d.domain,
            hasData: true,
          });
        }
      }
      
      return rooms;
    }
    
    // If manifest is an array of IDs
    if (Array.isArray(manifest)) {
      return manifest.map((id: string) => ({
        id,
        tier: extractTierFromId(id),
        nameEn: id,
        nameVi: id,
        hasData: true,
      }));
    }

    return [];
  } catch (err) {
    console.error("[roomFetcher] fetchRoomListFromJson error:", err);
    return [];
  }
}

async function fetchAllRoomsFromJson(): Promise<RoomJson[]> {
  try {
    const roomList = await fetchRoomListFromJson();
    const batchSize = 16;
    const results: RoomJson[] = [];

    for (let i = 0; i < roomList.length; i += batchSize) {
      const batch = roomList.slice(i, i + batchSize);
      const settled = await Promise.allSettled(
        batch.map((meta) => fetchRoomFromJson(meta.id))
      );
      for (const r of settled) {
        if (r.status === "fulfilled" && r.value) {
          results.push(r.value);
        }
      }
    }

    return results;
  } catch (err) {
    console.error("[roomFetcher] fetchAllRoomsFromJson error:", err);
    return [];
  }
}

// --------- Supabase helpers ---------

async function fetchRoomFromDb(roomId: string): Promise<RoomJson | null> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .maybeSingle();

  if (error) {
    console.error("[roomFetcher] Supabase room error:", roomId, error);
    return null;
  }
  if (!data) return null;

  const entries = Array.isArray(data.entries) ? data.entries : [];

  const room: RoomJson = {
    id: data.id,
    tier: data.tier || "free",
    title: {
      en: data.title_en || data.id,
      vi: data.title_vi || data.id,
    },
    content: {
      en: data.room_essay_en || "",
      vi: data.room_essay_vi || "",
    },
    entries: normalizeEntries(entries),
    keywords_en: Array.isArray(data.keywords) ? data.keywords : [],
    keywords_vi: [],
    domain: data.domain,
  };

  return room;
}

async function fetchRoomListFromDb(): Promise<RoomMeta[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("id, tier, title_en, title_vi, domain")
    .order("title_en");

  if (error) {
    console.error("[roomFetcher] Supabase room list error:", error);
    return [];
  }

  return (data || []).map((r) => ({
    id: r.id,
    tier: r.tier || "free",
    nameEn: r.title_en || r.id,
    nameVi: r.title_vi || r.id,
    domain: r.domain || undefined,
    hasData: true,
  }));
}

async function fetchAllRoomsFromDb(): Promise<RoomJson[]> {
  const { data, error } = await supabase
    .from("rooms")
    .select("*")
    .order("title_en");

  if (error) {
    console.error("[roomFetcher] Supabase all rooms error:", error);
    return [];
  }

  return (data || []).map((r) => ({
    id: r.id,
    tier: r.tier || "free",
    title: {
      en: r.title_en || r.id,
      vi: r.title_vi || r.id,
    },
    content: {
      en: r.room_essay_en || "",
      vi: r.room_essay_vi || "",
    },
    entries: normalizeEntries(Array.isArray(r.entries) ? r.entries : []),
    keywords_en: Array.isArray(r.keywords) ? r.keywords : [],
    keywords_vi: [],
    domain: r.domain,
  }));
}

// --------- Public API ---------

/**
 * Get a single room's full data (cached)
 */
export async function getRoom(roomId: string): Promise<RoomJson | null> {
  if (!roomId) return null;

  if (!roomCache.has(roomId)) {
    const p =
      ROOM_SOURCE === "supabase"
        ? fetchRoomFromDb(roomId)
        : fetchRoomFromJson(roomId);
    roomCache.set(roomId, p);
  }

  return roomCache.get(roomId)!;
}

/**
 * Get minimal room metadata list (lightweight, for listings)
 */
export async function getRoomList(): Promise<RoomMeta[]> {
  if (!roomListCache) {
    roomListCache =
      ROOM_SOURCE === "supabase"
        ? fetchRoomListFromDb()
        : fetchRoomListFromJson();
  }
  return roomListCache;
}

/**
 * Get all rooms with full data (heavy, use sparingly)
 */
export async function getAllRooms(): Promise<RoomJson[]> {
  if (!fullRoomListCache) {
    fullRoomListCache =
      ROOM_SOURCE === "supabase"
        ? fetchAllRoomsFromDb()
        : fetchAllRoomsFromJson();
  }
  return fullRoomListCache;
}

/**
 * Get rooms filtered by tier - normalizes tier comparison
 * Handles both canonical IDs (vip3) and DB labels (VIP3 / VIP3)
 */
export async function getRoomsByTier(tier: string): Promise<RoomMeta[]> {
  const rooms = await getRoomList();
  const tierLower = tier.toLowerCase();
  
  return rooms.filter((r) => {
    const roomTierLower = (r.tier || '').toLowerCase();
    
    // Exact match
    if (roomTierLower === tierLower) return true;
    
    // Handle DB format "VIP3 / VIP3" or "VIP3 / Cấp VIP3" matching "vip3"
    if (roomTierLower.includes(tierLower)) return true;
    
    // Handle vip3ii matching "vip3 ii" or "vip3ii"
    if (tierLower === 'vip3ii') {
      return roomTierLower.includes('vip3 ii') || roomTierLower.includes('vip3ii');
    }
    
    return false;
  });
}

/**
 * Clear all caches (call after room updates)
 */
export function clearRoomCache(): void {
  roomCache.clear();
  roomMetaCache.clear();
  roomListCache = null;
  fullRoomListCache = null;
}

/**
 * Get current room source
 */
export function getRoomSource(): RoomSource {
  return ROOM_SOURCE;
}
