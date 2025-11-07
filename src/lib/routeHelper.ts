/**
 * Centralized route helper to determine parent routes for rooms
 * Prevents 404s and navigation mismatches
 */

export const getParentRoute = (roomId: string | undefined): string => {
  if (!roomId) return "/rooms";

  // Special handling for sexuality sub-rooms (all 6 sub-rooms)
  if (roomId.startsWith('sexuality-curiosity-vip3-sub')) {
    return "/sexuality-culture";
  }

  // Special handling for sexuality parent room
  if (roomId === 'sexuality-and-curiosity-and-culture-vip3') {
    return "/rooms-vip3";
  }

  // Special handling for strategy in life series (multi-part VIP3 rooms)
  if (roomId.startsWith('strategy-in-life-')) {
    return "/rooms-vip3";
  }

  // Special handling for finance glory VIP3
  if (roomId === 'finance-glory-vip3') {
    return "/rooms-vip3";
  }

  // Standard tier-based routing for all other rooms
  // Pattern: {room-name}-(free|vip1|vip2|vip3)
  const tierSuffix = roomId.match(/-(free|vip1|vip2|vip3)$/)?.[1];
  
  switch (tierSuffix) {
    case 'vip3':
      return "/rooms-vip3";
    case 'vip2':
      return "/rooms-vip2";
    case 'vip1':
      return "/rooms-vip1";
    case 'free':
      return "/rooms";
    default:
      // Fallback for any room without a tier suffix
      return "/rooms";
  }
};
