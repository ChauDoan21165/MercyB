// src/lib/roomFetcher.ts
/**
 * Local-first room fetching.
 * - Always returns rooms from PUBLIC_ROOM_MANIFEST (fast, no CORS).
 * - Supabase fetch is optional and NON-BLOCKING (never breaks UI).
 */

import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";

const LOG_PREFIX = "[roomFetcher]";

export type RoomSummary = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  intro_vi?: string;
  path?: string; // data/<file>.json (optional convenience)
};

type AnyRoomJson = {
  id?: string;
  tier?: string;
  title?: { en?: string; vi?: string };
  intro?: { en?: string; vi?: string };
  name?: string;
  name_vi?: string;
  intro_text?: string;
  intro_vi?: string;
};

/**
 * Fetch a single room JSON via manifest path (local public/data).
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  const path = PUBLIC_ROOM_MANIFEST[roomId];
  if (!path) return null;

  try {
    const res = await fetch(`/${path}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AnyRoomJson;
  } catch (err) {
    console.warn(`${LOG_PREFIX} fetchRoomJsonById error:`, err);
    return null;
  }
}

/**
 * Build all room summaries from local manifest (no Supabase needed).
 */
export async function fetchAllRoomSummaries(): Promise<RoomSummary[]> {
  const ids = Object.keys(PUBLIC_ROOM_MANIFEST);

  // Try to read JSON for each room (best), but never fail the whole list.
  const results = await Promise.all(
    ids.map(async (id) => {
      const json = await fetchRoomJsonById(id);

      // If JSON fails, still return a minimal summary so UI can render list.
      if (!json) {
        return {
          id,
          path: PUBLIC_ROOM_MANIFEST[id],
        } satisfies RoomSummary;
      }

      return {
        id,
        tier: json.tier,
        title_en: json.title?.en ?? json.name,
        title_vi: json.title?.vi ?? json.name_vi,
        intro_en: json.intro?.en ?? (json as any).intro_text,
        intro_vi: json.intro?.vi ?? (json as any).intro_vi,
        path: PUBLIC_ROOM_MANIFEST[id],
      } satisfies RoomSummary;
    })
  );

  return results;
}

/**
 * Optional: Try Supabase in the background, never blocks UI.
 * Keep this only if other legacy code expects it.
 */
async function tryFetchRoomsFromSupabaseNonBlocking(): Promise<void> {
  try {
    // If you later want this, implement with your supabase client here.
    // IMPORTANT: Must not throw or block.
    return;
  } catch (err) {
    console.warn(`${LOG_PREFIX} Supabase all rooms error:`, err);
    return;
  }
}

/**
 * Legacy-compatible export: some UI might still call fetchAllRooms().
 * Always returns local summaries first and never blocks.
 */
export async function fetchAllRooms(): Promise<RoomSummary[]> {
  const local = await fetchAllRoomSummaries();

  // Fire and forget (do not await)
  void tryFetchRoomsFromSupabaseNonBlocking();

  return local;
}

/**
 * ✅ REQUIRED BY roomRegistry.ts right now
 * Provide the named export that the app imports.
 */
export async function getAllRooms(): Promise<RoomSummary[]> {
  return fetchAllRooms();
}
