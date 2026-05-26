// Tier route mapping following Mercy Blade Design System v1.1
import { normalizeTier, type TierId } from './constants/tiers';
import { getTierPath, getTierLabel } from './constants/tierMapConfig';

export const TIER_ROUTES: Record<TierId | string, { path: string; name: string; nameVi: string }> = {
  'level0': { path: '/rooms', name: 'Level 0 Tier', nameVi: 'Miễn Phí' },
  'level1': { path: '/vip/level1', name: 'Level 1', nameVi: 'Level 1' },
  'level2': { path: '/vip/level2', name: 'Level 2', nameVi: 'Level 2' },
  'level3': { path: '/vip/level3', name: 'Level 3', nameVi: 'Level 3' },
  'level4': { path: '/vip/level4', name: 'Level 4 CareerZ', nameVi: 'Level 4 CareerZ' },
  'level5': { path: '/vip/level5', name: 'Level 5 Writing', nameVi: 'Level 5 Viết' },
  'level6': { path: '/vip/level6', name: 'Level 6 Psychology', nameVi: 'Level 6 Tâm Lý' },
  'level9': { path: '/vip/level9', name: 'Level 9 Strategic Mastery', nameVi: 'Level 9 Chiến Lược' },
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
