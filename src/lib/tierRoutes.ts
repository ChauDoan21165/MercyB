// Map tier names to their route paths and display names
export const TIER_ROUTES: Record<string, { path: string; name: string; nameVi: string }> = {
  'free': { path: '/rooms', name: 'Free Tier', nameVi: 'Miễn Phí' },
  'vip1': { path: '/rooms-vip1', name: 'VIP1', nameVi: 'VIP1' },
  'vip2': { path: '/rooms-vip2', name: 'VIP2', nameVi: 'VIP2' },
  'vip3': { path: '/rooms-vip3', name: 'VIP3', nameVi: 'VIP3' },
  'vip4': { path: '/rooms-vip4', name: 'VIP4 CareerZ', nameVi: 'VIP4 CareerZ' },
  'vip5': { path: '/rooms-vip5', name: 'VIP5 Writing', nameVi: 'VIP5 Viết' },
  'vip6': { path: '/vip6', name: 'VIP6 Psychology', nameVi: 'VIP6 Tâm Lý' },
  'vip9': { path: '/rooms-vip9', name: 'VIP9 Strategic Mastery', nameVi: 'VIP9 Chiến Lược' },
  'kids_l1': { path: '/kids-level1', name: 'Kids Level 1', nameVi: 'Trẻ Em Cấp 1' },
  'kids_l2': { path: '/kids-level2', name: 'Kids Level 2', nameVi: 'Trẻ Em Cấp 2' },
  'kids_l3': { path: '/kids-level3', name: 'Kids Level 3', nameVi: 'Trẻ Em Cấp 3' },
};

export function getTierRoute(tier: string | undefined): { path: string; name: string; nameVi: string } | null {
  if (!tier) return null;
  
  const normalizedTier = tier.toLowerCase().replace(/\s+/g, '_');
  
  // Handle kids tiers
  if (normalizedTier.includes('kids')) {
    if (normalizedTier.includes('l1') || normalizedTier.includes('level_1')) {
      return TIER_ROUTES['kids_l1'];
    }
    if (normalizedTier.includes('l2') || normalizedTier.includes('level_2')) {
      return TIER_ROUTES['kids_l2'];
    }
    if (normalizedTier.includes('l3') || normalizedTier.includes('level_3')) {
      return TIER_ROUTES['kids_l3'];
    }
  }
  
  return TIER_ROUTES[normalizedTier] || null;
}
