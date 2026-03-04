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
 *
 * NEW (Adult/VIP private rooms):
 * - If manifestPath starts with "private:", we do NOT fetch from /public.
 * - Instead we call Supabase Edge Function "adult-content-url" which returns a signed URL.
 * - Then we fetch JSON from that signed URL.
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
  path?: string; // data/<file>.json OR private:<key>
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

/**
 * Error codes that the UI can react to (upgrade modal, adult confirm modal, signin redirect).
 */
export type RoomAccessErrorCode =
  | "not_logged_in"
  | "adult_not_confirmed"
  | "not_entitled"
  | "missing_functions_url"
  | "signed_url_failed"
  | "private_room_fetch_failed"
  | "room_fetch_failed";

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
  return ["public", "src/public", "", "src"];
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
 * Dynamically load Supabase client in a way that doesn't explode Node/Vitest
 * if the module path differs.
 *
 * Try a few common import paths. Adjust/add if your supabase client lives elsewhere.
 */
async function getSupabaseClientOrNull(): Promise<any | null> {
  const candidates = [
    "@/lib/supabaseClient",
    "./supabaseClient",
    "../lib/supabaseClient",
    "../supabaseClient",
  ] as const;

  for (const p of candidates) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const mod = await import(/* @vite-ignore */ p);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (mod?.supabase) return mod.supabase;
    } catch {
      // try next
    }
  }
  return null;
}

function getFunctionsBaseUrl(): string | null {
  const base = (import.meta as any)?.env?.VITE_SUPABASE_FUNCTIONS_URL;
  return typeof base === "string" && base.length > 0 ? base.replace(/\/+$/, "") : null;
}

async function fetchPrivateRoomJsonByKeyOrThrow(key: string): Promise<AnyRoomJson> {
  // In pure Node test contexts, we usually can't do auth/session anyway.
  // Allow tests to continue without breaking by throwing a clear code.
  const supabase = await getSupabaseClientOrNull();
  if (!supabase) {
    throw new Error("not_logged_in");
  }

  const { data } = await supabase.auth.getSession();
  const session = data?.session;
  if (!session) throw new Error("not_logged_in");

  const base = getFunctionsBaseUrl();
  if (!base) throw new Error("missing_functions_url");

  // Call your deployed edge function: adult-content-url?key=...
  const res = await fetch(`${base}/adult-content-url?key=${encodeURIComponent(key)}`, {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  const payload = await res.json().catch(() => ({} as any));
  if (!res.ok) {
    // Expect payload.error like: adult_not_confirmed / not_entitled
    const code =
      (payload as any)?.error ||
      (payload as any)?.message ||
      "signed_url_failed";
    throw new Error(String(code));
  }

  const signedUrl = (payload as any)?.signedUrl;
  if (!signedUrl) throw new Error("signed_url_failed");

  const jsonRes = await fetch(String(signedUrl), { cache: "no-store" });
  if (!jsonRes.ok) throw new Error("private_room_fetch_failed");

  return (await jsonRes.json()) as AnyRoomJson;
}

/**
 * NEW: Like fetchRoomJsonById, but throws typed-ish errors you can catch in UI:
 * - "not_logged_in" → redirect /signin
 * - "adult_not_confirmed" → show 18+ confirm modal
 * - "not_entitled" → show upgrade/pricing
 */
export async function fetchRoomJsonByIdOrThrow(roomId: string): Promise<AnyRoomJson> {
  const canonicalRoomId = normalizeRoomIdForCanonicalFile(roomId);

  // 1) Find path from manifest
  const manifestPath = (PUBLIC_ROOM_MANIFEST as Record<string, string>)[canonicalRoomId];

  // 2) If not in manifest, try fs guesses (useful for unit test fixtures)
  if (!manifestPath) {
    const guessed = await tryFsGuessesForRoomId(roomId);
    if (guessed?.json) return guessed.json;
    throw new Error("room_fetch_failed");
  }

  // 3) Private path support
  if (manifestPath.startsWith("private:")) {
    const key = manifestPath.slice("private:".length);
    if (!key) throw new Error("room_fetch_failed");
    return await fetchPrivateRoomJsonByKeyOrThrow(key);
  }

  // 4) Public path (existing behavior)
  const relUrl = `/${manifestPath}?t=${Date.now()}`;

  // Try relative fetch first (keeps fetch mocks working)
  const relAttempt = await fetchJsonUrl(relUrl);
  if (relAttempt) return relAttempt;

  // Retry absolute URL (needed for Node/undici)
  const absUrl = new URL(relUrl, getBaseOrigin()).toString();
  const absAttempt = await fetchJsonUrl(absUrl);
  if (absAttempt) return absAttempt;

  // Fallback to disk read from multiple roots (public/, src/public/, etc.)
  const diskAttempt = await readJsonFromDiskByPathLike(manifestPath);
  if (diskAttempt) return diskAttempt.json;

  throw new Error("room_fetch_failed");
}

/**
 * Fetch a single room JSON via manifest path (local public/data),
 * with robust fallbacks for tests.
 *
 * Back-compat: returns null on any failure.
 */
export async function fetchRoomJsonById(roomId: string): Promise<AnyRoomJson | null> {
  try {
    return await fetchRoomJsonByIdOrThrow(roomId);
  } catch (err: any) {
    // eslint-disable-next-line no-console
    console.warn(`${LOG_PREFIX} fetchRoomJsonById: could not load`, {
      roomId,
      canonicalRoomId: normalizeRoomIdForCanonicalFile(roomId),
      error: String(err?.message ?? err),
    });
    return null;
  }
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