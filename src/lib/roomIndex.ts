// src/lib/roomIndex.ts
// Manifestless room discovery from /public/data
// - Uses Vite's import.meta.glob to build a runtime index of JSON files
// - This eliminates roomManifest.ts drift forever

export type RoomIndexEntry = {
  id: string;        // canonical room id: english_foundation_ef02
  urlPath: string;   // public fetch path: /data/english_foundation_ef02.json
};

let cache: RoomIndexEntry[] | null = null;

const toCanonicalId = (s: string) =>
  String(s || "")
    .trim()
    .toLowerCase()
    .replace(/\.json$/i, "")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");

export function getRoomIndex(): RoomIndexEntry[] {
  if (cache) return cache;

  // Vite will include these JSON files in the build
  const modules = import.meta.glob("/public/data/*.json", { eager: false });

  const entries: RoomIndexEntry[] = Object.keys(modules).map((fullPath) => {
    const filename = fullPath.split("/").pop() || "";
    const id = toCanonicalId(filename);
    return { id, urlPath: `/data/${filename}` };
  });

  // stable sort
  entries.sort((a, b) => a.id.localeCompare(b.id));
  cache = entries;
  return entries;
}

export function resolveRoomJsonPath(roomId: string): string | null {
  const id = toCanonicalId(roomId);
  const hit = getRoomIndex().find((e) => e.id === id);
  return hit?.urlPath || null;
}

export function canonicalizeRoomId(roomId: string): string {
  return toCanonicalId(roomId);
}
