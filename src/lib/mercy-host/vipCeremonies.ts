/**
 * VIP Tier Ceremonies - Phase 6
 * 
 * Special upgrade ceremonies for each VIP tier.
 */

import type { MercyAnimationType } from './eventMap';
import type { VoiceTrigger } from './voicePack';
import { memory } from './memory';

export interface VipCeremonySpec {
  tier: string;
  animation: MercyAnimationType;
  voiceTrigger: VoiceTrigger;
  textEn: string;
  textVi: string;
}

// VIP upgrade ceremonies (heartfelt, not transactional)
export const VIP_CEREMONIES: Record<string, VipCeremonySpec> = {
  vip1: {
    tier: 'vip1',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "Welcome deeper. Your commitment to growth inspires me.",
    textVi: "Chào mừng sâu hơn. Cam kết phát triển của bạn truyền cảm hứng cho mình."
  },
  vip2: {
    tier: 'vip2',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "You're building real momentum now. I'm honored to walk with you.",
    textVi: "Bạn đang tạo đà tiến thực sự. Mình vinh dự được bước cùng bạn."
  },
  vip3: {
    tier: 'vip3',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "The depths call to you. Welcome to clearer waters.",
    textVi: "Chiều sâu gọi bạn. Chào mừng đến vùng nước trong hơn."
  },
  vip4: {
    tier: 'vip4',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "Precision becomes your ally. This tier shapes focus.",
    textVi: "Sự chính xác trở thành đồng minh. Tầng này định hình sự tập trung."
  },
  vip5: {
    tier: 'vip5',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "Your influence grows. Lead with the heart you carry.",
    textVi: "Ảnh hưởng của bạn tăng lên. Dẫn dắt bằng trái tim bạn mang."
  },
  vip6: {
    tier: 'vip6',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "Strategy and serenity merge here. Welcome, thoughtful one.",
    textVi: "Chiến lược và thanh thản hợp nhất ở đây. Chào mừng, người suy tư."
  },
  vip7: {
    tier: 'vip7',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "The horizon opens. You're becoming a creator now.",
    textVi: "Chân trời mở ra. Bạn đang trở thành người sáng tạo."
  },
  vip8: {
    tier: 'vip8',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "Light becomes language here. Welcome to transcendence.",
    textVi: "Ánh sáng trở thành ngôn ngữ ở đây. Chào mừng đến siêu việt."
  },
  vip9: {
    tier: 'vip9',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "Distinguished one, you've arrived. Mercy bows to your path.",
    textVi: "Người xuất sắc, bạn đã đến. Mercy cúi chào con đường của bạn."
  }
};

/**
 * Get VIP ceremony for a tier upgrade
 */
export function getVipCeremony(tier: string): VipCeremonySpec | null {
  const normalizedTier = tier.toLowerCase().replace('-', '');
  return VIP_CEREMONIES[normalizedTier] || null;
}

/**
 * Check if ceremony has already been played for this tier
 */
export function hasCeremonyBeenPlayed(tier: string): boolean {
  const mem = memory.get();
  const celebrated = (mem as any).tiersCelebrated || [];
  return celebrated.includes(tier.toLowerCase());
}

/**
 * Mark ceremony as played for a tier
 */
export function markCeremonyPlayed(tier: string): void {
  const mem = memory.get();
  const celebrated = (mem as any).tiersCelebrated || [];
  
  if (!celebrated.includes(tier.toLowerCase())) {
    memory.update({
      ...mem,
      tiersCelebrated: [...celebrated, tier.toLowerCase()]
    } as any);
  }
}

/**
 * Get ceremony text in specified language
 */
export function getCeremonyText(ceremony: VipCeremonySpec, language: 'en' | 'vi'): string {
  return language === 'vi' ? ceremony.textVi : ceremony.textEn;
}

/**
 * Execute VIP ceremony (returns ceremony if should play, null if already played)
 */
export function executeVipCeremony(
  newTier: string,
  previousTier?: string
): VipCeremonySpec | null {
  // Only celebrate upgrades, not downgrades
  if (previousTier) {
    const newNum = tierToNumber(newTier);
    const prevNum = tierToNumber(previousTier);
    if (newNum <= prevNum) return null;
  }
  
  // Check if already celebrated
  if (hasCeremonyBeenPlayed(newTier)) {
    return null;
  }
  
  const ceremony = getVipCeremony(newTier);
  if (ceremony) {
    markCeremonyPlayed(newTier);
  }
  
  return ceremony;
}

/**
 * Convert tier string to number for comparison
 */
function tierToNumber(tier: string): number {
  if (tier === 'free') return 0;
  const match = tier.match(/vip(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}
