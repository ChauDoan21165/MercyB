// Automatic room data imports using Vite's import.meta.glob
// This automatically imports all JSON files from the rooms directory
const roomModules = import.meta.glob('@/data/rooms/*.json', { eager: true });

// Import room manifest for public JSON files
import { PUBLIC_ROOM_MANIFEST } from './roomManifest';

// Also import JSON files from public directory
const publicJsonModules: Record<string, any> = {};

// Cache for loaded tier-specific data
const tierDataCache: Record<string, any> = {};

// Fetch public JSON files dynamically
async function loadPublicJson(filename: string) {
  try {
    const response = await fetch(`/${filename}`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.warn(`Could not load public JSON: ${filename}`, e);
  }
  return null;
}

// Build the roomDataMap dynamically from imported modules
export const roomDataMap: Record<string, any> = {};

for (const path in roomModules) {
  // Extract filename from path: '@/data/rooms/stress_free.json' -> 'stress_free'
  const fileName = path.split('/').pop()?.replace('.json', '') || '';
  
  // Convert filename to kebab-case room ID
  // stress_free -> stress-free, Shadow_Work_Free -> shadow-work-free
  const roomId = fileName
    .replace(/_/g, '-')
    .toLowerCase();
  
  // Store the module data
  const module = roomModules[path] as any;
  roomDataMap[roomId] = module.default || module;
}

// Pre-load public room JSON files from manifest
// This makes them available in ALL_ROOMS immediately
(async () => {
  for (const [roomId, filename] of Object.entries(PUBLIC_ROOM_MANIFEST)) {
    const data = await loadPublicJson(filename);
    if (data) {
      roomDataMap[roomId] = data;
      console.log(`Pre-loaded public room: ${roomId} from ${filename}`);
    }
  }
  console.log('Total rooms loaded:', Object.keys(roomDataMap).length);
})();

// Log available rooms for debugging
console.log('Auto-loaded rooms:', Object.keys(roomDataMap).sort());

// Helper function to get room data with tier fallback
// New structure: /tiers/{tier}/{room}/{room}_{tier}.json
export async function getRoomDataWithTier(roomName: string, userTier: 'free' | 'vip1' | 'vip2' | 'vip3'): Promise<any> {
  const cacheKey = `${roomName}_${userTier}`;
  
  // Return from cache if available
  if (tierDataCache[cacheKey]) {
    return tierDataCache[cacheKey];
  }
  
  // NEW STRUCTURE: Check /tiers/{tier}/{room}/{room}_{tier}.json
  const jsonPath = `tiers/${userTier}/${roomName}/${roomName}_${userTier}.json`;
  const jsonData = await loadPublicJson(jsonPath);
  
  if (jsonData) {
    console.log(`Loaded ${jsonPath} for room ${roomName}`);
    // Cache the loaded data
    tierDataCache[cacheKey] = jsonData;
    // Also update roomDataMap for keywordResponder
    const roomId = `${roomName}-${userTier}`;
    roomDataMap[roomId] = jsonData;
    return jsonData;
  }
  
  // If nothing found, ensure room is removed from the in-memory map
  const roomId = `${roomName}-${userTier}`;
  if (roomDataMap[roomId]) {
    delete roomDataMap[roomId];
    console.warn(`Removed room '${roomId}' from registry because no JSON was found`);
  }
  return null;
}
