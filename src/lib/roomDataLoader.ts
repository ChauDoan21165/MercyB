/**
 * Runtime room data loader - replaces static roomDataImports.ts
 * Loads room data via fetch at runtime instead of bundling at build time
 */

import { RoomData } from "@/lib/roomData";

// Runtime cache - only populated when needed
let roomDataCache: Record<string, RoomData> | null = null;
let loadingPromise: Promise<Record<string, RoomData>> | null = null;

/**
 * Load room data map at runtime (not build time)
 * Uses fetch to load from public/data/ directory
 */
export async function loadRoomDataMap(): Promise<Record<string, RoomData>> {
  // Return cached data if available
  if (roomDataCache) {
    return roomDataCache;
  }

  // Return existing promise if already loading
  if (loadingPromise) {
    return loadingPromise;
  }

  // Start loading
  loadingPromise = (async () => {
    try {
      // Fetch the room registry/manifest if it exists
      const manifestResponse = await fetch('/data/room-registry.json');
      if (!manifestResponse.ok) {
        console.warn('Room registry not found, returning empty map');
        roomDataCache = {};
        return roomDataCache;
      }

      const manifest = await manifestResponse.json();
      const roomIds: string[] = Array.isArray(manifest) 
        ? manifest 
        : (manifest.rooms || Object.keys(manifest));

      // Load room data in parallel (batch of 10)
      const result: Record<string, RoomData> = {};
      const batchSize = 10;

      for (let i = 0; i < roomIds.length; i += batchSize) {
        const batch = roomIds.slice(i, i + batchSize);
        const batchResults = await Promise.allSettled(
          batch.map(async (id) => {
            const response = await fetch(`/data/${id}.json`);
            if (!response.ok) return null;
            const json = await response.json();
            return {
              id,
              data: {
                id: json.id || id,
                nameEn: json.title?.en || json.title_en || id,
                nameVi: json.title?.vi || json.title_vi || id,
                tier: json.tier || 'free',
                hasData: true
              } as RoomData
            };
          })
        );

        for (const r of batchResults) {
          if (r.status === 'fulfilled' && r.value) {
            result[r.value.id] = r.value.data;
          }
        }
      }

      roomDataCache = result;
      return result;
    } catch (err) {
      console.error('Failed to load room data map:', err);
      roomDataCache = {};
      return roomDataCache;
    } finally {
      loadingPromise = null;
    }
  })();

  return loadingPromise;
}

/**
 * Get a single room's data (async)
 */
export async function getRoomData(roomId: string): Promise<RoomData | null> {
  const map = await loadRoomDataMap();
  return map[roomId] || null;
}

/**
 * Clear the cache (useful for refresh)
 */
export function clearRoomDataCache(): void {
  roomDataCache = null;
  loadingPromise = null;
}
