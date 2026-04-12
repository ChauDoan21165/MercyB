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
  it('should have correct budget for level0 tier', () => {
    expect(TIER_BUDGETS.level0).toEqual({
      dailyChars: 3000,
      softWarnAt: 2400,
      hardCap: 3300
    });
  });

  it('should have correct budget for level9 tier', () => {
    expect(TIER_BUDGETS.level9).toEqual({
      dailyChars: 12000,
      softWarnAt: 9600,
      hardCap: 13200
    });
  });

  it('should have higher budgets for higher tiers', () => {
    expect(TIER_BUDGETS.level1.dailyChars).toBeGreaterThan(TIER_BUDGETS.level0.dailyChars);
    expect(TIER_BUDGETS.level4.dailyChars).toBeGreaterThan(TIER_BUDGETS.level1.dailyChars);
    expect(TIER_BUDGETS.level7.dailyChars).toBeGreaterThan(TIER_BUDGETS.level4.dailyChars);
    expect(TIER_BUDGETS.level9.dailyChars).toBeGreaterThan(TIER_BUDGETS.level7.dailyChars);
  });
});

describe('Growth Mode', () => {
  it('should apply growth multiplier for new users', () => {
    const baseBudget = getEffectiveBudget('level0', 1); // First visit
    expect(baseBudget.dailyChars).toBe(TIER_BUDGETS.level0.dailyChars * GROWTH_MODE.multiplier);
  });

  it('should return base budget after maxVisits', () => {
    const baseBudget = getEffectiveBudget('level0', GROWTH_MODE.maxVisits + 1);
    expect(baseBudget.dailyChars).toBe(TIER_BUDGETS.level0.dailyChars);
  });

  it('should correctly detect growth mode active', () => {
    expect(isInGrowthMode('level0', 1)).toBe(true);
    expect(isInGrowthMode('level0', 5)).toBe(true);
    expect(isInGrowthMode('level0', GROWTH_MODE.maxVisits)).toBe(false);
    expect(isInGrowthMode('level0', 100)).toBe(false);
  });

  it('should apply to all tiers', () => {
    expect(isInGrowthMode('level1', 1)).toBe(true);
    expect(isInGrowthMode('level9', 1)).toBe(true);
  });
});

describe('Tier Normalization', () => {
  it('should normalize valid tiers', () => {
    expect(normalizeTierId('level0')).toBe('level0');
    expect(normalizeTierId('Level 1')).toBe('level1');
    expect(normalizeTierId('Level 9')).toBe('level9');
  });

  it('should default to level0 for invalid tiers', () => {
    expect(normalizeTierId('invalid')).toBe('level0');
    expect(normalizeTierId('')).toBe('level0');
  });
});

describe('Talk Usage Tracking', () => {
  let defaultUsage: TalkUsage;
  let budget: TalkBudget;

  beforeEach(() => {
    defaultUsage = createDefaultTalkUsage();
    budget = TIER_BUDGETS.level0;
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
  const budget = TIER_BUDGETS.level0;
  
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
    const budget = TIER_BUDGETS.level0;
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
    const budget = TIER_BUDGETS.level0;
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
