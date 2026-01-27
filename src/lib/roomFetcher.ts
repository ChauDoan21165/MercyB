// src/lib/roomFetcher.ts
/**
 * Local-first room fetching.
 * - Always returns rooms from PUBLIC_ROOM_MANIFEST (fast, no CORS).
 * - Supabase fetch is optional and NON-BLOCKING (never breaks UI).
 */

import { PUBLIC_ROOM_MANIFEST } from "./roomManifest";

/**
 * Helper to normalize a room ID into the canonical form used as keys in the manifest.
 */
function normalizeRoomIdForCanonicalFile(input: string): string {
  return (input || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_");
}

const LOG_PREFIX = "[roomFetcher]";

// Some legacy tests/pages import RoomMeta.
// Keep it minimal + compatible.
export type RoomMeta = {
  id: string;
  tier?: string;
  title_en?: string;
  title_vi?: string;
  intro_en?: string;
  intro_vi?: string;
  path?: string; // data/<file>.json
};

export type RoomSummary = RoomMeta;

export type AnyRoomJson = {
  id?: string;
  tier?: string;
  title?: { en?: string; vi?: string };
  intro?: { en?: string; vi?: string };
  name?: string;
  name_vi?: string;
  intro_text?: string;
  intro_vi?: string;
  description?: string;
  description_vi?: string;

  // allow extra room fields (disclaimers, entries, etc.)
  [k: string]: any;
};

/**
 * Fetch a single room JSON via manifest path (local public/data).
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  const canonicalRoomId = normalizeRoomIdForCanonicalFile(roomId);
  const path = (PUBLIC_ROOM_MANIFEST as Record<string, string>)[canonicalRoomId];
  if (!path) return null;

  try {
    const res = await fetch(`/${path}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AnyRoomJson;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} fetchRoomJsonById error:`, err);
    return null;
  }
}

/**
 * ✅ Legacy/API-compatible single-room getter
 * Used by RoomDisclaimer and older UI.
 */
export async function getRoom(roomId: string): Promise<AnyRoomJson | null> {
  return fetchRoomJsonById(roomId);
}

/**
 * Build all room summaries from local manifest (no Supabase needed).
 */
export async function fetchAllRoomSummaries(): Promise<RoomSummary[]> {
  const ids = Object.keys(PUBLIC_ROOM_MANIFEST as Record<string, string>);

  const results = await Promise.all(
    ids.map(async (id) => {
      const json = await fetchRoomJsonById(id);

      if (!json) {
        return {
          id,
          path: (PUBLIC_ROOM_MANIFEST as Record<string, string>)[id],
        } satisfies RoomSummary;
      }

      const introEN = json.intro?.en ?? (json as any).intro_text ?? json.description ?? "";
      const introVI = json.intro?.vi ?? (json as any).intro_vi ?? json.description_vi ?? "";

      return {
        id: json.id ?? id,
        tier: json.tier,
        title_en: json.title?.en ?? json.name,
        title_vi: json.title?.vi ?? json.name_vi,
        intro_en: introEN,
        intro_vi: introVI,
        path: (PUBLIC_ROOM_MANIFEST as Record<string, string>)[id],
      } satisfies RoomSummary;
    })
  );

  return results;
}

/**
 * Optional: Try Supabase in the background, never blocks UI.
 */
async function tryFetchRoomsFromSupabaseNonBlocking(): Promise<void> {
  try {
    return;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} Supabase all rooms error:`, err);
    return;
  }
}

/**
 * Legacy-compatible export: some UI might still call fetchAllRooms().
 */
export async function fetchAllRooms(): Promise<RoomSummary[]> {
  const local = await fetchAllRoomSummaries();
  void tryFetchRoomsFromSupabaseNonBlocking();
  return local;
}

/**
 * REQUIRED BY some diagnostics code.
 */
export async function getAllRooms(): Promise<RoomSummary[]> {
  return fetchAllRooms();
}

/**
 * ✅ REQUIRED BY tests/diagnostics:
 * - getRoomList(): returns array of rooms (meta)
 */
export async function getRoomList(): Promise<RoomMeta[]> {
  return fetchAllRooms();
}

/* teacher GPT — new thing to learn:
   When a component needs “room data”, expose ONE tiny getter (getRoom)
   that wraps your local-first loader, so UI never reaches into manifests directly. */
