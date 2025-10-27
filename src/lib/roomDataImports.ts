// Automatic room data imports using Vite's import.meta.glob
// This automatically imports all JSON files from the rooms directory
const roomModules = import.meta.glob('@/data/rooms/*.json', { eager: true });

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

// Log available rooms for debugging
console.log('Auto-loaded rooms:', Object.keys(roomDataMap).sort());

// Helper function to get room data with tier fallback
// Looks for: {roomName}_{tier}.json, then {roomName}_vip3.json, vip2, vip1, then {roomName}.json
export async function getRoomDataWithTier(roomName: string, userTier: 'free' | 'vip1' | 'vip2' | 'vip3'): Promise<any> {
  const cacheKey = `${roomName}_${userTier}`;
  
  // Return from cache if available
  if (tierDataCache[cacheKey]) {
    return tierDataCache[cacheKey];
  }
  
  // Try exact tier match from public folder
  const tierPriority = userTier === 'vip3' ? ['VIP3', 'VIP2', 'VIP1', 'Free'] :
                       userTier === 'vip2' ? ['VIP2', 'VIP1', 'Free'] :
                       userTier === 'vip1' ? ['VIP1', 'Free'] :
                       ['Free'];
  
  for (const tier of tierPriority) {
    const filename = `${roomName}_${tier}.json`;
    const data = await loadPublicJson(filename);
    if (data) {
      console.log(`Loaded ${filename} for room ${roomName}`);
      // Cache the loaded data
      tierDataCache[cacheKey] = data;
      // Also update roomDataMap for keywordResponder
      const roomId = roomName.replace(/_/g, '-').toLowerCase();
      roomDataMap[roomId] = data;
      return data;
    }
  }
  
  // Fallback to base room data from src/data/rooms
  const roomId = roomName.replace(/_/g, '-').toLowerCase();
  const fallbackData = roomDataMap[roomId] || null;
  if (fallbackData) {
    tierDataCache[cacheKey] = fallbackData;
  }
  return fallbackData;
}
