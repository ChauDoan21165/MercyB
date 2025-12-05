/**
 * Mercy Talk Budget System - Phase 9
 * 
 * Tier-based character quota per day with growth mode for new users.
 * Controls how much Mercy can "talk" (display text) to manage costs.
 */

export type TierId = 'free' | 'vip1' | 'vip2' | 'vip3' | 'vip4' | 'vip5' | 'vip6' | 'vip7' | 'vip8' | 'vip9';

export interface TalkBudget {
  dailyChars: number;
  softWarnAt: number;
  hardCap: number;
}

export interface TalkUsage {
  dateISO: string;
  usedChars: number;
  softWarned: boolean;
  hardBlocked: boolean;
}

export interface GrowthModeConfig {
  enabled: boolean;
  multiplier: number;
  maxVisits: number;
  minTier: TierId;
}

/**
 * Base tier budgets (characters per day)
 * 
 * Free: ~3K chars (minimal engagement)
 * VIP1-3: ~5K chars (moderate)
 * VIP4-6: ~7K chars (active)
 * VIP7-8: ~9K chars (premium)
 * VIP9: ~12K chars (unlimited-feel)
 */
export const TIER_BUDGETS: Record<TierId, TalkBudget> = {
  free: { dailyChars: 3_000, softWarnAt: 2_400, hardCap: 3_300 },
  vip1: { dailyChars: 5_000, softWarnAt: 4_000, hardCap: 5_500 },
  vip2: { dailyChars: 5_000, softWarnAt: 4_000, hardCap: 5_500 },
  vip3: { dailyChars: 5_000, softWarnAt: 4_000, hardCap: 5_500 },
  vip4: { dailyChars: 7_000, softWarnAt: 5_600, hardCap: 7_700 },
  vip5: { dailyChars: 7_000, softWarnAt: 5_600, hardCap: 7_700 },
  vip6: { dailyChars: 7_000, softWarnAt: 5_600, hardCap: 7_700 },
  vip7: { dailyChars: 9_000, softWarnAt: 7_200, hardCap: 9_900 },
  vip8: { dailyChars: 9_000, softWarnAt: 7_200, hardCap: 9_900 },
  vip9: { dailyChars: 12_000, softWarnAt: 9_600, hardCap: 13_200 }
};

/**
 * Growth mode configuration
 * 
 * New users (< maxVisits) get multiplied budget to encourage engagement.
 * After maxVisits, they fall back to base tier budget.
 */
export const GROWTH_MODE: GrowthModeConfig = {
  enabled: true,
  multiplier: 2,
  maxVisits: 15,
  minTier: 'free'
};

/**
 * Tier ordering for comparison
 */
const TIER_ORDER: TierId[] = ['free', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];

/**
 * Check if tier A is >= tier B
 */
function isTierAtLeast(tierA: TierId, tierB: TierId): boolean {
  return TIER_ORDER.indexOf(tierA) >= TIER_ORDER.indexOf(tierB);
}

/**
 * Normalize tier string to TierId
 */
export function normalizeTierId(tier: string): TierId {
  const normalized = tier.toLowerCase() as TierId;
  if (TIER_ORDER.includes(normalized)) {
    return normalized;
  }
  return 'free';
}

/**
 * Get effective budget for a user based on tier and visit count
 * 
 * @param tier - User's current subscription tier
 * @param totalVisits - Total visits from memory
 * @returns Effective talk budget (potentially multiplied for growth mode)
 */
export function getEffectiveBudget(tier: TierId, totalVisits: number): TalkBudget {
  const baseBudget = TIER_BUDGETS[tier] || TIER_BUDGETS.free;
  
  // Check if growth mode applies
  const isGrowthModeActive = 
    GROWTH_MODE.enabled && 
    totalVisits < GROWTH_MODE.maxVisits && 
    isTierAtLeast(tier, GROWTH_MODE.minTier);
  
  if (isGrowthModeActive) {
    return {
      dailyChars: Math.round(baseBudget.dailyChars * GROWTH_MODE.multiplier),
      softWarnAt: Math.round(baseBudget.softWarnAt * GROWTH_MODE.multiplier),
      hardCap: Math.round(baseBudget.hardCap * GROWTH_MODE.multiplier)
    };
  }
  
  return baseBudget;
}

/**
 * Check if user is in growth mode
 */
export function isInGrowthMode(tier: TierId, totalVisits: number): boolean {
  return (
    GROWTH_MODE.enabled && 
    totalVisits < GROWTH_MODE.maxVisits && 
    isTierAtLeast(tier, GROWTH_MODE.minTier)
  );
}

/**
 * Get today's date string in ISO format (YYYY-MM-DD)
 */
export function getTodayISO(): string {
  return new Date().toISOString().split('T')[0];
}

/**
 * Create default talk usage for today
 */
export function createDefaultTalkUsage(): TalkUsage {
  return {
    dateISO: getTodayISO(),
    usedChars: 0,
    softWarned: false,
    hardBlocked: false
  };
}

/**
 * Reset talk usage if it's a new day
 */
export function resetTalkUsageIfNewDay(usage: TalkUsage): TalkUsage {
  const todayISO = getTodayISO();
  
  if (usage.dateISO !== todayISO) {
    return createDefaultTalkUsage();
  }
  
  return usage;
}

/**
 * Increment talk usage and update flags
 */
export function incrementTalkUsage(
  usage: TalkUsage, 
  deltaChars: number, 
  budget: TalkBudget
): TalkUsage {
  // First ensure we're on today
  const currentUsage = resetTalkUsageIfNewDay(usage);
  
  // If already hard blocked, don't increment
  if (currentUsage.hardBlocked) {
    return currentUsage;
  }
  
  const newUsedChars = currentUsage.usedChars + deltaChars;
  
  return {
    ...currentUsage,
    usedChars: newUsedChars,
    softWarned: currentUsage.softWarned || newUsedChars >= budget.softWarnAt,
    hardBlocked: newUsedChars >= budget.hardCap
  };
}

/**
 * Check if speech would exceed hard cap
 */
export function wouldExceedHardCap(usage: TalkUsage, chars: number, budget: TalkBudget): boolean {
  const currentUsage = resetTalkUsageIfNewDay(usage);
  return (currentUsage.usedChars + chars) >= budget.hardCap;
}

/**
 * Check if at soft warning threshold
 */
export function isAtSoftWarning(usage: TalkUsage, budget: TalkBudget): boolean {
  const currentUsage = resetTalkUsageIfNewDay(usage);
  return currentUsage.usedChars >= budget.softWarnAt;
}

/**
 * Crisis safety override threshold (1.2x hard cap)
 */
export const CRISIS_OVERRIDE_MULTIPLIER = 1.2;

/**
 * Check if crisis speech would exceed extended cap
 */
export function wouldExceedCrisisOverrideCap(usage: TalkUsage, chars: number, budget: TalkBudget): boolean {
  const currentUsage = resetTalkUsageIfNewDay(usage);
  const extendedCap = Math.round(budget.hardCap * CRISIS_OVERRIDE_MULTIPLIER);
  return (currentUsage.usedChars + chars) >= extendedCap;
}

/**
 * Format character count for display (e.g., "2.1K")
 */
export function formatCharCount(chars: number): string {
  if (chars >= 1000) {
    return `${(chars / 1000).toFixed(1)}K`;
  }
  return String(chars);
}

/**
 * Get progress percentage for talk usage
 */
export function getTalkProgress(usage: TalkUsage, budget: TalkBudget): number {
  const currentUsage = resetTalkUsageIfNewDay(usage);
  return Math.min(100, Math.round((currentUsage.usedChars / budget.dailyChars) * 100));
}

/**
 * Soft warning message (shown once when crossing threshold)
 */
export const SOFT_WARNING_MESSAGE = {
  en: "I'll keep my answers shorter today so I can still be here for you.",
  vi: "Hôm nay mình sẽ trả lời ngắn hơn một chút để vẫn có mặt bên bạn nhé."
};

/**
 * Hard limit reached message (shown once per session)
 */
export const HARD_LIMIT_MESSAGE = {
  en: "I'll go quiet for now to take care of everyone fairly. I'm still here with you.",
  vi: "Giờ mình sẽ hơi yên lặng để chăm mọi người công bằng hơn. Mình vẫn ở đây với bạn."
};

/**
 * Growth mode welcome message (shown on first visit)
 */
export const GROWTH_MODE_WELCOME = {
  en: "In your first days here, I can stay with you a bit longer than usual.",
  vi: "Những ngày đầu này, mình sẽ ở lại với bạn lâu hơn một chút nhé."
};
