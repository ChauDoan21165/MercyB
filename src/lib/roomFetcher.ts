/**
 * roomFetcher.ts
 * - Fetch room metadata list for search/keywords UI
 * - Production: prefer Supabase
 * - Dev / failure: fallback to local public/data via PUBLIC_ROOM_MANIFEST
 */

import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";
import { loadRoomJson } from "./roomJsonResolver";

/** Minimal shape used by UI search / lists */
export type RoomMeta = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  intro_vi?: string;
  // optional tags/keywords if your UI uses them
  keywords?: string[];
};

function pickBilingualTitle(data: any): { en?: string; vi?: string } {
  if (data?.title?.en || data?.title?.vi) return { en: data.title.en, vi: data.title.vi };
  if (data?.name || data?.name_vi) return { en: data.name, vi: data.name_vi };
  return {};
}

function pickBilingualIntro(data: any): { en?: string; vi?: string } {
  if (data?.intro?.en || data?.intro?.vi) return { en: data.intro.en, vi: data.intro.vi };
  return {};
}

function extractKeywords(data: any): string[] {
  // If your JSON has tags/keywords/categories, prefer them.
  // Otherwise, return empty; your room page can still work.
  const k =
    data?.keywords ||
    data?.tags ||
    data?.categories ||
    [];

  if (Array.isArray(k)) return k.map(String).filter(Boolean);

  // If it is an object, take keys
  if (k && typeof k === "object") return Object.keys(k);

  return [];
}

function toMeta(data: any): RoomMeta {
  const title = pickBilingualTitle(data);
  const intro = pickBilingualIntro(data);

  return {
    id: String(data?.id ?? ""),
    tier: data?.tier ? String(data.tier) : undefined,
    title_en: title.en,
    title_vi: title.vi,
    intro_en: intro.en,
    intro_vi: intro.vi,
    keywords: extractKeywords(data),
  };
}

/**
 * ✅ Local fallback: build meta list from manifest + public JSON.
 * This keeps the app usable even when Supabase is blocked by CORS in dev.
 */
async function fetchAllRoomsFromLocal(): Promise<RoomMeta[]> {
  const roomIds = Object.keys(PUBLIC_ROOM_MANIFEST);

  // keep it safe: if you have many rooms, don’t DDoS your own dev server
  // fetch in small batches
  const batchSize = 12;
  const results: RoomMeta[] = [];

  for (let i = 0; i < roomIds.length; i += batchSize) {
    const batch = roomIds.slice(i, i + batchSize);
    const metas = await Promise.all(
      batch.map(async (roomId) => {
        try {
          // This uses your canonical resolver + strict validation
          const data = await loadRoomJson(roomId);
          return toMeta(data);
        } catch (e) {
          // If a single room fails validation, skip it (do NOT kill the whole UI)
          console.warn("[roomFetcher] Local room load failed:", roomId, e);
          return null;
        }
      })
    );

    for (const m of metas) if (m?.id) results.push(m);
  }

  return results;
}

/**
 * Supabase list fetch (optional).
 * NOTE: If your app uses supabase-js somewhere else, keep it.
 * Here we do a plain REST fetch with apikey to avoid extra dependencies.
 */
async function fetchAllRoomsFromSupabase(): Promise<RoomMeta[]> {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anon) {
    throw new Error("Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY");
  }

  const endpoint = `${url}/rest/v1/rooms?select=id,tier,title_en,title_vi,intro_en,intro_vi,keywords&order=title_en.asc`;

  const res = await fetch(endpoint, {
    headers: {
      apikey: anon,
      Authorization: `Bearer ${anon}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Supabase rooms fetch failed: HTTP ${res.status} ${res.statusText}\n${text}`);
  }

  const rows = (await res.json()) as any[];
  return (rows || [])
    .map((r) => ({
      id: String(r.id),
      tier: r.tier ?? undefined,
      title_en: r.title_en ?? undefined,
      title_vi: r.title_vi ?? undefined,
      intro_en: r.intro_en ?? undefined,
      intro_vi: r.intro_vi ?? undefined,
      keywords: Array.isArray(r.keywords) ? r.keywords : undefined,
    }))
    .filter((x) => x.id);
}

/**
 * Public API used by the UI.
 * - Production: prefer Supabase, but still fallback if it fails.
 * - Dev: prefer local to avoid CORS pain.
 */
let _cache: { at: number; rooms: RoomMeta[] } | null = null;

export async function fetchAllRoomsMeta(opts?: { force?: boolean }): Promise<RoomMeta[]> {
  const force = !!opts?.force;
  const now = Date.now();

  // 60s cache
  if (!force && _cache && now - _cache.at < 60_000) return _cache.rooms;

  const mode = import.meta.env.MODE;

  try {
    if (mode === "production") {
      const rooms = await fetchAllRoomsFromSupabase();
      _cache = { at: now, rooms };
      return rooms;
    }

    // dev: use local first
    const rooms = await fetchAllRoomsFromLocal();
    _cache = { at: now, rooms };
    return rooms;
  } catch (err) {
    console.warn("[roomFetcher] Primary fetch failed, falling back to local:", err);
    const rooms = await fetchAllRoomsFromLocal();
    _cache = { at: now, rooms };
    return rooms;
  }
}

/**
 * Convenience: get a single room meta quickly (used by some pages).
 */
export async function fetchRoomMeta(roomId: string): Promise<RoomMeta | null> {
  try {
    const data = await loadRoomJson(roomId);
    const meta = toMeta(data);
    return meta?.id ? meta : null;
  } catch (e) {
    console.warn("[roomFetcher] fetchRoomMeta failed:", roomId, e);
    return null;
  }
}
