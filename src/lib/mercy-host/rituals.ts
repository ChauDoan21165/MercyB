/**
 * Mercy Rituals System - Phase 6
 * 
 * Defines micro-rituals and ceremonies for user progress events.
 */

import type { EmotionState } from './emotionModel';
import type { MercyAnimationType } from './eventMap';
import type { VoiceTrigger } from './voicePack';
import { memory } from './memory';
import { isCrisisRoom } from './safetyRails';

export type RitualType = 
  | 'entry_complete' 
  | 'room_complete' 
  | 'streak_milestone' 
  | 'vip_upgrade' 
  | 'comeback_after_gap';

export interface RitualSpec {
  id: string;
  type: RitualType;
  tierRange: [number, number]; // [minTier, maxTier] where 0=free, 1=vip1, etc.
  minEntries?: number;
  emotionBias?: EmotionState;
  animation: MercyAnimationType;
  voiceTrigger: VoiceTrigger;
  textEn: string;
  textVi: string;
  badgeId?: string;
  priority: number; // Higher = more important
}

// Ritual priority order
const RITUAL_PRIORITIES: Record<RitualType, number> = {
  vip_upgrade: 100,
  room_complete: 80,
  entry_complete: 40,
  streak_milestone: 60,
  comeback_after_gap: 50
};

// Entry completion micro-rituals
const ENTRY_RITUALS: RitualSpec[] = [
  // Soft nod (1-2 entries)
  {
    id: 'entry_soft_nod',
    type: 'entry_complete',
    tierRange: [0, 9],
    minEntries: 1,
    animation: null,
    voiceTrigger: 'encouragement',
    textEn: "A small step forward.",
    textVi: "Một bước nhỏ tiến về phía trước.",
    priority: 10
  },
  // Spark of progress (3-5 entries)
  {
    id: 'entry_spark',
    type: 'entry_complete',
    tierRange: [0, 9],
    minEntries: 3,
    animation: 'spark',
    voiceTrigger: 'encouragement',
    textEn: "You're building momentum.",
    textVi: "Bạn đang tạo đà tiến.",
    priority: 20
  },
  // Step on the bridge (6+ entries)
  {
    id: 'entry_bridge',
    type: 'entry_complete',
    tierRange: [0, 9],
    minEntries: 6,
    emotionBias: 'focused',
    animation: 'shimmer',
    voiceTrigger: 'entry_complete',
    textEn: "You walk the bridge with purpose now.",
    textVi: "Bạn bước trên cầu với mục đích rõ ràng.",
    priority: 30
  }
];

// Room completion rituals per tier group
const ROOM_COMPLETE_RITUALS: RitualSpec[] = [
  // Free tier
  {
    id: 'room_complete_free',
    type: 'room_complete',
    tierRange: [0, 0],
    emotionBias: 'celebrating',
    animation: 'halo',
    voiceTrigger: 'celebration',
    textEn: "Room complete. You showed up. That matters.",
    textVi: "Phòng hoàn thành. Bạn đã có mặt. Điều đó quan trọng.",
    priority: 80
  },
  // VIP 1-3
  {
    id: 'room_complete_vip1_3',
    type: 'room_complete',
    tierRange: [1, 3],
    emotionBias: 'celebrating',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "Another room conquered. Your foundation grows stronger.",
    textVi: "Thêm một phòng chinh phục. Nền tảng của bạn vững chắc hơn.",
    priority: 80
  },
  // VIP 4-6
  {
    id: 'room_complete_vip4_6',
    type: 'room_complete',
    tierRange: [4, 6],
    emotionBias: 'celebrating',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "Mastery in motion. This room is now part of you.",
    textVi: "Sự thành thạo đang chuyển động. Phòng này giờ là một phần của bạn.",
    priority: 80
  },
  // VIP 7-9
  {
    id: 'room_complete_vip7_9',
    type: 'room_complete',
    tierRange: [7, 9],
    emotionBias: 'celebrating',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "A chapter closes, wisdom remains. Beautifully done.",
    textVi: "Một chương khép lại, trí tuệ còn mãi. Tuyệt đẹp.",
    priority: 80
  }
];

// Streak milestone rituals
const STREAK_RITUALS: RitualSpec[] = [
  {
    id: 'streak_3_days',
    type: 'streak_milestone',
    tierRange: [0, 9],
    emotionBias: 'celebrating',
    animation: 'spark',
    voiceTrigger: 'celebration',
    textEn: "3 days in a row. Consistency is your superpower.",
    textVi: "3 ngày liên tiếp. Sự kiên trì là siêu năng lực của bạn.",
    badgeId: 'streak_3',
    priority: 60
  },
  {
    id: 'streak_7_days',
    type: 'streak_milestone',
    tierRange: [0, 9],
    emotionBias: 'celebrating',
    animation: 'shimmer',
    voiceTrigger: 'celebration',
    textEn: "7 days strong. You're proving something real.",
    textVi: "7 ngày vững vàng. Bạn đang chứng minh điều có thật.",
    badgeId: 'streak_7',
    priority: 65
  },
  {
    id: 'streak_30_days',
    type: 'streak_milestone',
    tierRange: [0, 9],
    emotionBias: 'celebrating',
    animation: 'glow',
    voiceTrigger: 'celebration',
    textEn: "30 days. A habit is born. Mercy bows to your dedication.",
    textVi: "30 ngày. Một thói quen ra đời. Mercy cúi đầu trước sự cống hiến.",
    badgeId: 'streak_30',
    priority: 70
  }
];

// Comeback ritual
const COMEBACK_RITUAL: RitualSpec = {
  id: 'comeback_after_gap',
  type: 'comeback_after_gap',
  tierRange: [0, 9],
  emotionBias: 'returning_after_gap',
  animation: 'ripple',
  voiceTrigger: 'returning_after_gap',
  textEn: "You came back. That takes courage. Welcome home.",
  textVi: "Bạn đã quay lại. Điều đó cần dũng khí. Chào mừng về nhà.",
  priority: 50
};

// Crisis room gentle acknowledgment (replaces celebration)
const CRISIS_ROOM_RITUAL: RitualSpec = {
  id: 'crisis_gentle',
  type: 'room_complete',
  tierRange: [0, 9],
  emotionBias: 'neutral',
  animation: 'halo',
  voiceTrigger: 'low_mood',
  textEn: "You showed up for yourself today. That's enough.",
  textVi: "Hôm nay bạn đã có mặt vì chính mình. Như vậy là đủ.",
  priority: 80
};

/**
 * Convert tier string to number for comparison
 */
function tierToNumber(tier: string): number {
  if (tier === 'free') return 0;
  const match = tier.match(/vip(\d+)/i);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Get ritual intensity setting from memory
 */
function getRitualIntensity(): 'off' | 'minimal' | 'normal' {
  const mem = memory.get();
  return (mem as any).ritualIntensity || 'normal';
}

/**
 * Check if ritual type is allowed based on intensity setting
 */
function isRitualAllowed(type: RitualType): boolean {
  const intensity = getRitualIntensity();
  
  if (intensity === 'off') return false;
  
  if (intensity === 'minimal') {
    // Only entry_complete and gentle room_complete
    return type === 'entry_complete' || type === 'room_complete';
  }
  
  return true; // 'normal' allows all
}

export interface RitualContext {
  tier: string;
  roomId?: string;
  roomTags?: string[];
  roomDomain?: string;
  entriesCompleted?: number;
  streakDays?: number;
  daysSinceLastVisit?: number;
  isVipUpgrade?: boolean;
  previousTier?: string;
}

/**
 * Get the best ritual for a given event and context
 */
export function getRitualForEvent(
  type: RitualType,
  context: RitualContext
): RitualSpec | null {
  // Check if rituals are allowed
  if (!isRitualAllowed(type)) return null;
  
  const tierNum = tierToNumber(context.tier);
  const isCrisis = isCrisisRoom(context.roomTags, context.roomDomain);
  
  // Handle crisis rooms specially
  if (isCrisis && type === 'room_complete') {
    return CRISIS_ROOM_RITUAL;
  }
  
  // Handle VIP upgrade
  if (type === 'vip_upgrade' && context.isVipUpgrade) {
    // VIP ceremonies handled in vipCeremonies.ts
    return null;
  }
  
  // Handle comeback
  if (type === 'comeback_after_gap') {
    const days = context.daysSinceLastVisit || 0;
    if (days >= 7) {
      return COMEBACK_RITUAL;
    }
    return null;
  }
  
  // Handle streak milestones
  if (type === 'streak_milestone') {
    const streak = context.streakDays || 0;
    
    // Find the highest applicable streak ritual
    const applicable = STREAK_RITUALS
      .filter(r => streak >= (r.id.includes('30') ? 30 : r.id.includes('7') ? 7 : 3))
      .filter(r => tierNum >= r.tierRange[0] && tierNum <= r.tierRange[1]);
    
    if (applicable.length > 0) {
      return applicable[applicable.length - 1]; // Highest streak
    }
    return null;
  }
  
  // Handle room complete
  if (type === 'room_complete') {
    const ritual = ROOM_COMPLETE_RITUALS.find(
      r => tierNum >= r.tierRange[0] && tierNum <= r.tierRange[1]
    );
    return ritual || null;
  }
  
  // Handle entry complete
  if (type === 'entry_complete') {
    const entries = context.entriesCompleted || 1;
    
    // Find the best matching entry ritual
    const applicable = ENTRY_RITUALS
      .filter(r => entries >= (r.minEntries || 1))
      .filter(r => tierNum >= r.tierRange[0] && tierNum <= r.tierRange[1]);
    
    if (applicable.length > 0) {
      // Return highest priority ritual
      return applicable.reduce((best, current) => 
        current.priority > best.priority ? current : best
      );
    }
    return null;
  }
  
  return null;
}

/**
 * Get ritual text in specified language
 */
export function getRitualText(ritual: RitualSpec, language: 'en' | 'vi'): string {
  return language === 'vi' ? ritual.textVi : ritual.textEn;
}

/**
 * Check if a streak milestone was just achieved
 */
export function checkStreakMilestone(
  currentStreak: number,
  previousStreak: number
): number | null {
  const milestones = [3, 7, 30];
  
  for (const milestone of milestones) {
    if (currentStreak >= milestone && previousStreak < milestone) {
      return milestone;
    }
  }
  
  return null;
}

/**
 * Compute daily visit streak
 */
export function computeVisitStreak(now: Date, lastVisitAt: string | null): number {
  if (!lastVisitAt) return 1;
  
  const last = new Date(lastVisitAt);
  const diffMs = now.getTime() - last.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Same day
  if (diffDays === 0) {
    const mem = memory.get();
    return (mem as any).streakDays || 1;
  }
  
  // Consecutive day
  if (diffDays === 1) {
    const mem = memory.get();
    return ((mem as any).streakDays || 0) + 1;
  }
  
  // Streak broken
  return 1;
}

/**
 * Update streak in memory
 */
export function updateStreak(): { streak: number; milestone: number | null } {
  const mem = memory.get();
  const previousStreak = (mem as any).streakDays || 0;
  const lastVisit = mem.lastVisitISO;
  const now = new Date();
  
  const newStreak = computeVisitStreak(now, lastVisit);
  const milestone = checkStreakMilestone(newStreak, previousStreak);
  
  // Update memory
  memory.update({
    ...mem,
    streakDays: newStreak,
    longestStreak: Math.max((mem as any).longestStreak || 0, newStreak),
    lastVisitISO: now.toISOString()
  } as any);
  
  return { streak: newStreak, milestone };
}
