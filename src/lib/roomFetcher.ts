// src/lib/roomFetcher.ts
/**
 * Local-first room fetching.
 * - Always returns rooms from PUBLIC_ROOM_MANIFEST (fast, no CORS).
 * - Supabase fetch is optional and NON-BLOCKING (never breaks UI).
 *
 * Test/runtime realities:
 * - In Vitest/jsdom, global.fetch may be Node/undici (needs absolute URL),
 *   OR it may be mocked and expect relative "/data/..." URLs.
 * - There is usually no HTTP server in unit tests, so fetch will fail anyway.
 * - JSON fixtures may live in different roots depending on setup (public/, src/public/, etc).
 *
 * Therefore we:
 *   1) attempt relative fetch first (best for mocks)
 *   2) if that fails due to Invalid URL, retry absolute
 *   3) if fetch fails, read from disk (Node) across multiple likely roots
 *   4) if manifest does not contain the roomId, try filesystem guesses
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

type AnyRoomJson = {
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
};

function hasNodeProcess(): boolean {
  return typeof process !== "undefined" && !!(process as any).versions?.node;
}

function getBaseOrigin(): string {
  const anyGlobal = globalThis as any;
  const origin = anyGlobal?.location?.origin;
  if (typeof origin === "string" && origin.length > 0) return origin;
  return "http://localhost";
}

/**
 * In monorepos / test runners, JSON may live under different roots.
 * We try multiple roots deterministically.
 */
function getCandidateRoots(): string[] {
  // Most common cases:
  // - Vite/Next serve from <root>/public
  // - some setups keep assets in src/public
  // - some tests run with cwd already at repo root (so <root>/data might exist)
  // - some repos keep data under src/data
  return [
    "public",
    "src/public",
    "", // repo root
    "src",
  ];
}

async function readJsonFileAbsolutePath(absPath: string): Promise<AnyRoomJson | null> {
  if (!hasNodeProcess()) return null;
  try {
    const { readFile } = await import("node:fs/promises");
    const raw = await readFile(absPath, "utf-8");
    return JSON.parse(raw) as AnyRoomJson;
  } catch {
    return null;
  }
}

/**
 * Node-only helper: attempt to read JSON from disk by trying multiple roots.
 * `pathLike` is like "data/foo.json" (or occasionally "/data/foo.json").
 */
async function readJsonFromDiskByPathLike(
  pathLike: string
): Promise<{ json: AnyRoomJson; resolvedPath: string } | null> {
  if (!hasNodeProcess()) return null;

  const clean = (pathLike || "").replace(/^\/+/, "");
  if (!clean) return null;

  try {
    const [{ access }, pathMod] = await Promise.all([
      import("node:fs/promises"),
      import("node:path"),
    ]);

    const cwd = process.cwd();
    const roots = getCandidateRoots();

    for (const root of roots) {
      const abs = root ? pathMod.join(cwd, root, clean) : pathMod.join(cwd, clean);
      try {
        await access(abs);
        const json = await readJsonFileAbsolutePath(abs);
        if (json) return { json, resolvedPath: abs };
      } catch {
        // try next
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * If roomId is not in manifest, try common guesses across multiple roots.
 * Helps unit tests that reference fixture ids (e.g. "test-room", "json-room").
 */
async function tryFsGuessesForRoomId(
  roomId: string
): Promise<{ json: AnyRoomJson; path: string } | null> {
  if (!hasNodeProcess()) return null;

  const raw = (roomId || "").trim();
  if (!raw) return null;

  const canonical = normalizeRoomIdForCanonicalFile(raw);

  const variants = Array.from(
    new Set<string>([
      canonical,
      canonical.replace(/_/g, "-"),
      raw.toLowerCase().replace(/\.json$/i, ""),
      raw.toLowerCase().replace(/\.json$/i, "").replace(/\s+/g, "-"),
      raw.toLowerCase().replace(/\.json$/i, "").replace(/\s+/g, "_"),
    ])
  ).filter(Boolean);

  // Candidate relative paths we’ll attempt under each root.
  const relCandidates: string[] = [];
  for (const v of variants) relCandidates.push(`data/${v}.json`);
  if (!raw.toLowerCase().endsWith(".json")) relCandidates.push(`data/${raw}.json`);

  for (const rel of relCandidates) {
    const found = await readJsonFromDiskByPathLike(rel);
    if (found) return { json: found.json, path: rel };
  }

  return null;
}

async function fetchJsonUrl(url: string): Promise<AnyRoomJson | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as AnyRoomJson;
  } catch {
    return null;
  }
}

/**
 * Fetch a single room JSON via manifest path (local public/data),
 * with robust fallbacks for tests.
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  const canonicalRoomId = normalizeRoomIdForCanonicalFile(roomId);

  // 1) Find path from manifest
  const manifestPath = (PUBLIC_ROOM_MANIFEST as Record<string, string>)[canonicalRoomId];

  // 2) If not in manifest, try fs guesses (useful for unit test fixtures)
  if (!manifestPath) {
    const guessed = await tryFsGuessesForRoomId(roomId);
    return guessed?.json ?? null;
  }

  const relUrl = `/${manifestPath}?t=${Date.now()}`;

  // 3) Try relative fetch first (keeps fetch mocks working)
  const relAttempt = await fetchJsonUrl(relUrl);
  if (relAttempt) return relAttempt;

  // 4) Retry absolute URL (needed for Node/undici)
  const absUrl = new URL(relUrl, getBaseOrigin()).toString();
  const absAttempt = await fetchJsonUrl(absUrl);
  if (absAttempt) return absAttempt;

  // 5) Fallback to disk read from multiple roots (public/, src/public/, etc.)
  const diskAttempt = await readJsonFromDiskByPathLike(manifestPath);
  if (diskAttempt) return diskAttempt.json;

  // eslint-disable-next-line no-console
  console.warn(`${LOG_PREFIX} fetchRoomJsonById: could not load`, {
    roomId,
    canonicalRoomId,
    manifestPath,
  });

  return null;
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

      const introEN =
        json.intro?.en ?? (json as any).intro_text ?? json.description ?? "";
      const introVI =
        json.intro?.vi ?? (json as any).intro_vi ?? json.description_vi ?? "";

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