// Tier route mapping following Mercy Blade Design System v1.1
import { normalizeTier, type TierId } from './constants/tiers';

export const TIER_ROUTES: Record<TierId | string, { path: string; name: string; nameVi: string }> = {
  'free': { path: '/rooms', name: 'Free Tier', nameVi: 'Miễn Phí' },
  'vip1': { path: '/rooms-vip1', name: 'VIP1', nameVi: 'VIP1' },
  'vip2': { path: '/rooms-vip2', name: 'VIP2', nameVi: 'VIP2' },
  'vip3': { path: '/rooms-vip3', name: 'VIP3', nameVi: 'VIP3' },
  'vip3ii': { path: '/rooms-vip3ii', name: 'VIP3 II', nameVi: 'VIP3 II' },
  'vip4': { path: '/rooms-vip4', name: 'VIP4 CareerZ', nameVi: 'VIP4 CareerZ' },
  'vip5': { path: '/rooms-vip5', name: 'VIP5 Writing', nameVi: 'VIP5 Viết' },
  'vip6': { path: '/vip6', name: 'VIP6 Psychology', nameVi: 'VIP6 Tâm Lý' },
  'vip9': { path: '/rooms-vip9', name: 'VIP9 Strategic Mastery', nameVi: 'VIP9 Chiến Lược' },
  'kids_1': { path: '/kids-level1', name: 'Kids Level 1', nameVi: 'Trẻ Em Cấp 1' },
  'kids_2': { path: '/kids-level2', name: 'Kids Level 2', nameVi: 'Trẻ Em Cấp 2' },
  'kids_3': { path: '/kids-level3', name: 'Kids Level 3', nameVi: 'Trẻ Em Cấp 3' },
};

/**
 * Get tier route from any tier string (raw DB label or TierId)
 * Uses normalizeTier to convert to canonical TierId first
 */
export function getTierRoute(tier: string | undefined): { path: string; name: string; nameVi: string } | null {
  if (!tier) return null;
  
  // Normalize to canonical TierId
  const tierId = normalizeTier(tier);
  
  return TIER_ROUTES[tierId] || null;
}
