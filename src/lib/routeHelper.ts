/**
 * Centralized route helper to determine parent routes for rooms
 * Prevents 404s and navigation mismatches with TypeScript type safety
 */

import { roomDataMap } from './roomDataImports';

/**
 * Valid parent route paths in the application
 */
export type ParentRoute = 
  | "/rooms"           // Free tier rooms
  | "/rooms-vip1"      // VIP1 tier rooms
  | "/rooms-vip2"      // VIP2 tier rooms
  | "/rooms-vip3"      // VIP3 tier rooms
  | "/rooms-vip4"      // VIP4 tier rooms
  | "/vip6"            // VIP6 tier rooms
  | "/rooms-vip9"      // VIP9 tier rooms
  | "/sexuality-culture" // Sexuality sub-rooms parent
  | "/finance-calm";   // Finance sub-rooms parent

/**
 * Room tier type
 */
export type RoomTier = 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip6' | 'vip9';

/**
 * Validates if a room ID exists in the system
 */
export function isValidRoomId(roomId: string | undefined): roomId is string {
  if (!roomId) return false;
  return roomId in roomDataMap;
}

/**
 * Gets the tier from a room ID
 */
export function getRoomTier(roomId: string): RoomTier | null {
  // Detect tier segment anywhere in the ID (supports -, _, . separators)
  const match = roomId.match(/(?:^|[._-])(free|vip1|vip2|vip3|vip4|vip6|vip9)(?:$|[._-])/i);
  return match ? (match[1].toLowerCase() as RoomTier) : null;
}

/**
 * Converts a room tier to its corresponding parent route
 */
export function tierToRoute(tier: RoomTier): ParentRoute {
  const tierRouteMap: Record<RoomTier, ParentRoute> = {
    'free': "/rooms",
    'vip1': "/rooms-vip1",
    'vip2': "/rooms-vip2",
    'vip3': "/rooms-vip3",
    'vip4': "/rooms-vip4",
    'vip6': "/vip6",
    'vip9': "/rooms-vip9"
  };
  return tierRouteMap[tier];
}

/**
 * Gets the parent route for a given room ID with full type safety
 * 
 * @param roomId - The room identifier (e.g., 'adhd-support-vip3')
 * @returns The parent route path for navigation
 * 
 * @example
 * getParentRoute('adhd-support-vip3') // Returns: "/rooms-vip3"
 * getParentRoute('sexuality-curiosity-vip3-sub1') // Returns: "/sexuality-culture"
 */
export function getParentRoute(roomId: string | undefined): ParentRoute {
  // Handle undefined or empty room ID
  if (!roomId) return "/rooms";

  // Validate room exists (log warning but don't throw)
  if (!isValidRoomId(roomId)) {
    console.warn(`[RouteHelper] Unknown room ID: ${roomId}. Defaulting to /rooms`);
    return "/rooms";
  }

  // Special handling for sexuality sub-rooms (all 6 sub-rooms)
  if (roomId.startsWith('sexuality-curiosity-vip3-sub')) {
    return "/sexuality-culture";
  }

  // Special handling for finance sub-rooms (all 6 sub-rooms)
  if (roomId.startsWith('finance-calm-money-sub')) {
    return "/finance-calm";
  }

  // Special handling for sexuality parent room
  if (roomId === 'sexuality-and-curiosity-and-culture-vip3') {
    return "/rooms-vip3";
  }

  // Special handling for finance parent room
  if (roomId === 'finance-glory-vip3') {
    return "/rooms-vip3";
  }

  // Special handling for strategy in life series (multi-part VIP3 rooms)
  if (roomId.startsWith('strategy-in-life-')) {
    return "/rooms-vip3";
  }

  // Standard tier-based routing for all other rooms
  const tier = getRoomTier(roomId);
  
  if (tier) {
    return tierToRoute(tier);
  }

  // Fallback for any room without a tier suffix
  console.warn(`[RouteHelper] Could not determine tier for room: ${roomId}. Defaulting to /rooms`);
  return "/rooms";
}
