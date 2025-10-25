// Automatic room data imports using Vite's import.meta.glob
// This automatically imports all JSON files from the rooms directory
const roomModules = import.meta.glob('@/data/rooms/*.json', { eager: true });

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
