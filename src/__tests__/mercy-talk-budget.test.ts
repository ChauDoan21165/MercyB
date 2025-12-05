/**
 * Mercy Talk Budget Tests - Phase 9
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  TIER_BUDGETS,
  GROWTH_MODE,
  getEffectiveBudget,
  isInGrowthMode,
  normalizeTierId,
  incrementTalkUsage,
  wouldExceedHardCap,
  isAtSoftWarning,
  resetTalkUsageIfNewDay,
  createDefaultTalkUsage,
  getTodayISO,
  formatCharCount,
  getTalkProgress,
  type TierId,
  type TalkBudget,
  type TalkUsage
} from '../lib/mercy-host/talkBudget';

describe('Tier Budgets', () => {
  it('should have correct budget for free tier', () => {
    expect(TIER_BUDGETS.free).toEqual({
      dailyChars: 3000,
      softWarnAt: 2400,
      hardCap: 3300
    });
  });

  it('should have correct budget for vip9 tier', () => {
    expect(TIER_BUDGETS.vip9).toEqual({
      dailyChars: 12000,
      softWarnAt: 9600,
      hardCap: 13200
    });
  });

  it('should have higher budgets for higher tiers', () => {
    expect(TIER_BUDGETS.vip1.dailyChars).toBeGreaterThan(TIER_BUDGETS.free.dailyChars);
    expect(TIER_BUDGETS.vip4.dailyChars).toBeGreaterThan(TIER_BUDGETS.vip1.dailyChars);
    expect(TIER_BUDGETS.vip7.dailyChars).toBeGreaterThan(TIER_BUDGETS.vip4.dailyChars);
    expect(TIER_BUDGETS.vip9.dailyChars).toBeGreaterThan(TIER_BUDGETS.vip7.dailyChars);
  });
});

describe('Growth Mode', () => {
  it('should apply growth multiplier for new users', () => {
    const baseBudget = getEffectiveBudget('free', 1); // First visit
    expect(baseBudget.dailyChars).toBe(TIER_BUDGETS.free.dailyChars * GROWTH_MODE.multiplier);
  });

  it('should return base budget after maxVisits', () => {
    const baseBudget = getEffectiveBudget('free', GROWTH_MODE.maxVisits + 1);
    expect(baseBudget.dailyChars).toBe(TIER_BUDGETS.free.dailyChars);
  });

  it('should correctly detect growth mode active', () => {
    expect(isInGrowthMode('free', 1)).toBe(true);
    expect(isInGrowthMode('free', 5)).toBe(true);
    expect(isInGrowthMode('free', GROWTH_MODE.maxVisits)).toBe(false);
    expect(isInGrowthMode('free', 100)).toBe(false);
  });

  it('should apply to all tiers', () => {
    expect(isInGrowthMode('vip1', 1)).toBe(true);
    expect(isInGrowthMode('vip9', 1)).toBe(true);
  });
});

describe('Tier Normalization', () => {
  it('should normalize valid tiers', () => {
    expect(normalizeTierId('free')).toBe('free');
    expect(normalizeTierId('VIP1')).toBe('vip1');
    expect(normalizeTierId('VIP9')).toBe('vip9');
  });

  it('should default to free for invalid tiers', () => {
    expect(normalizeTierId('invalid')).toBe('free');
    expect(normalizeTierId('')).toBe('free');
  });
});

describe('Talk Usage Tracking', () => {
  let defaultUsage: TalkUsage;
  let budget: TalkBudget;

  beforeEach(() => {
    defaultUsage = createDefaultTalkUsage();
    budget = TIER_BUDGETS.free;
  });

  it('should create default usage with today date', () => {
    expect(defaultUsage.dateISO).toBe(getTodayISO());
    expect(defaultUsage.usedChars).toBe(0);
    expect(defaultUsage.softWarned).toBe(false);
    expect(defaultUsage.hardBlocked).toBe(false);
  });

  it('should increment usage correctly', () => {
    const updated = incrementTalkUsage(defaultUsage, 500, budget);
    expect(updated.usedChars).toBe(500);
    expect(updated.softWarned).toBe(false);
    expect(updated.hardBlocked).toBe(false);
  });

  it('should set softWarned when crossing threshold', () => {
    const updated = incrementTalkUsage(defaultUsage, budget.softWarnAt, budget);
    expect(updated.softWarned).toBe(true);
    expect(updated.hardBlocked).toBe(false);
  });

  it('should set hardBlocked when crossing cap', () => {
    const updated = incrementTalkUsage(defaultUsage, budget.hardCap, budget);
    expect(updated.hardBlocked).toBe(true);
  });

  it('should not increment when already hard blocked', () => {
    const blockedUsage: TalkUsage = {
      ...defaultUsage,
      usedChars: budget.hardCap,
      hardBlocked: true
    };
    const updated = incrementTalkUsage(blockedUsage, 100, budget);
    expect(updated.usedChars).toBe(budget.hardCap); // No change
  });
});

describe('Cap Checking', () => {
  const budget = TIER_BUDGETS.free;
  
  it('should detect when speech would exceed hard cap', () => {
    const usage: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: budget.hardCap - 100,
      softWarned: true,
      hardBlocked: false
    };
    
    expect(wouldExceedHardCap(usage, 50, budget)).toBe(false);
    expect(wouldExceedHardCap(usage, 150, budget)).toBe(true);
  });

  it('should detect soft warning threshold', () => {
    const belowWarn: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: budget.softWarnAt - 100,
      softWarned: false,
      hardBlocked: false
    };
    const aboveWarn: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: budget.softWarnAt + 100,
      softWarned: true,
      hardBlocked: false
    };
    
    expect(isAtSoftWarning(belowWarn, budget)).toBe(false);
    expect(isAtSoftWarning(aboveWarn, budget)).toBe(true);
  });
});

describe('Day Reset', () => {
  it('should reset usage for new day', () => {
    const oldUsage: TalkUsage = {
      dateISO: '2020-01-01', // Old date
      usedChars: 5000,
      softWarned: true,
      hardBlocked: true
    };
    
    const reset = resetTalkUsageIfNewDay(oldUsage);
    expect(reset.dateISO).toBe(getTodayISO());
    expect(reset.usedChars).toBe(0);
    expect(reset.softWarned).toBe(false);
    expect(reset.hardBlocked).toBe(false);
  });

  it('should keep usage for same day', () => {
    const todayUsage: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: 1000,
      softWarned: false,
      hardBlocked: false
    };
    
    const result = resetTalkUsageIfNewDay(todayUsage);
    expect(result.usedChars).toBe(1000);
  });
});

describe('Formatting Helpers', () => {
  it('should format char count correctly', () => {
    expect(formatCharCount(500)).toBe('500');
    expect(formatCharCount(1000)).toBe('1.0K');
    expect(formatCharCount(2500)).toBe('2.5K');
    expect(formatCharCount(12000)).toBe('12.0K');
  });

  it('should calculate progress percentage', () => {
    const budget = TIER_BUDGETS.free;
    const usage: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: 1500,
      softWarned: false,
      hardBlocked: false
    };
    
    const progress = getTalkProgress(usage, budget);
    expect(progress).toBe(50); // 1500/3000 = 50%
  });

  it('should cap progress at 100%', () => {
    const budget = TIER_BUDGETS.free;
    const usage: TalkUsage = {
      dateISO: getTodayISO(),
      usedChars: 5000, // Over limit
      softWarned: true,
      hardBlocked: true
    };
    
    const progress = getTalkProgress(usage, budget);
    expect(progress).toBe(100);
  });
});
