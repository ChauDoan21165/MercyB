// PATH: src/lib/roomIndex.ts
// File: roomIndex.ts

import { PUBLIC_ROOM_MANIFEST } from "@/lib/roomManifest";

export type RoomIndexEntry = {
  id: string;
  urlPath: string;
};

const toCanonicalId = (s: string) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/^\/?data\//i, "")
    .replace(/^\/?public\/data\//i, "")
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/[-\s]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

function toHyphenId(s: string): string {
  return String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/^\/?data\//i, "")
    .replace(/^\/?public\/data\//i, "")
    .replace(/["'`]+/g, "")
    .replace(/[^\w\s-]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "")
    .replace(/_/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toCoreRoomId(s: string): string {
  return toCanonicalId(s).replace(
    /_(vip[1-9]|level0|kids_1|kids_2|kids_3|kidslevel[123]|kids_l[123]|vip3_ii)$/i,
    "",
  );
}

function toCoreHyphenRoomId(s: string): string {
  return toHyphenId(s).replace(
    /-(vip[1-9]|level0|kids-1|kids-2|kids-3|kidslevel[123]|kids-l[123]|level3-ii)$/i,
    "",
  );
}

function normalizeManifestPath(path: string): string {
  const cleaned = String(path || "").trim();
  if (!cleaned) return "";
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

function getRoomIdCandidates(roomId: string): string[] {
  const raw = String(roomId || "").trim().replace(/\.json$/i, "");
  const canonical = toCanonicalId(raw);
  const hyphen = toHyphenId(raw);
  const core = toCoreRoomId(raw);
  const coreHyphen = toCoreHyphenRoomId(raw);

  const candidates = [
    raw,
    raw.toLowerCase(),
    canonical,
    hyphen,
    canonical.replace(/_/g, "-"),
    hyphen.replace(/-/g, "_"),
    core,
    coreHyphen,
    core.replace(/_/g, "-"),
    coreHyphen.replace(/-/g, "_"),
  ]
    .map((v) => String(v || "").trim())
    .filter(Boolean);

  return Array.from(new Set(candidates));
}

function buildIndexEntries(): RoomIndexEntry[] {
  return Object.entries(PUBLIC_ROOM_MANIFEST)
    .map(([id, urlPath]) => ({
      id,
      urlPath: normalizeManifestPath(urlPath),
    }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

const ROOM_INDEX = buildIndexEntries();
const ROOM_INDEX_BY_ID = new Map<string, string>(
  ROOM_INDEX.flatMap((entry) => {
    const ids = getRoomIdCandidates(entry.id);
    return ids.map((id) => [id, entry.urlPath] as const);
  }),
);

export function getRoomIndex(): RoomIndexEntry[] {
  return ROOM_INDEX.slice();
}

/**
 * Legacy compatibility:
 * return the public JSON path when available.
 */
export function resolveRoomJsonPath(roomId: string): string {
  const candidates = getRoomIdCandidates(roomId);

  for (const candidate of candidates) {
    const found = ROOM_INDEX_BY_ID.get(candidate);
    if (found) return found;
  }

  const fallback = toCanonicalId(roomId);
  return fallback ? `/data/${fallback}.json` : "";
}

export function canonicalizeRoomId(roomId: string): string {
  return toCanonicalId(roomId);
}

/**
 * Helper for callers that need consistent canonical/core candidates.
 */
export function getCanonicalRoomIdCandidates(roomId: string): string[] {
  return getRoomIdCandidates(roomId);
}

/**
 * Helper for callers using the secure loader path.
 */
export function resolveSecureRoomLoaderPath(roomId: string): string {
  const id = canonicalizeRoomId(roomId);
  if (!id) return "";

  const envBase = String(
    (import.meta as ImportMeta & {
      env?: Record<string, string | undefined>;
    })?.env?.VITE_SUPABASE_FUNCTIONS_URL || "",
  ).trim();

  if (envBase) {
    return `${envBase.replace(/\/+$/, "")}/secure-room-loader`;
  }

  return "/functions/v1/secure-room-loader";
}