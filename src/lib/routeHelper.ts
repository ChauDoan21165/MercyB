/**
 * Centralized route helper to determine parent routes for rooms
 * Prevents 404s and navigation mismatches
 */

export const getParentRoute = (roomId: string | undefined): string => {
  if (!roomId) return "/rooms";

  // Special handling for sexuality sub-rooms
  if (roomId.startsWith('sexuality-curiosity-vip3-sub')) {
    return "/sexuality-culture";
  }

  // Determine tier-based parent route
  const tierSuffix = roomId.match(/-(free|vip1|vip2|vip3)$/)?.[1];
  
  switch (tierSuffix) {
    case 'vip3':
      return "/rooms-vip3";
    case 'vip2':
      return "/rooms-vip2";
    case 'vip1':
      return "/rooms-vip1";
    default:
      return "/rooms";
  }
};
