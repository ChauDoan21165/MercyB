/**
 * Mercy Rituals Tests - Phase 6
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  getRitualForEvent, 
  getRitualText,
  computeVisitStreak,
  checkStreakMilestone,
  type RitualContext 
} from '../lib/teacher-mercy/rituals';
import {
  getTierCeremony,
  getCeremonyText,
  executeTierCeremony
} from '../lib/teacher-mercy/tierCeremonies';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value; },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

Object.defineProperty(global, 'localStorage', { value: localStorageMock });

describe('Rituals System', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getRitualForEvent', () => {
    describe('entry_complete rituals', () => {
      it('should return soft nod for 1-2 entries', () => {
        const context: RitualContext = {
          tier: 'level0',
          entriesCompleted: 1
        };
        
        const ritual = getRitualForEvent('entry_complete', context);
        expect(ritual).toBeDefined();
        expect(ritual?.id).toBe('entry_soft_nod');
        expect(ritual?.animation).toBeNull();
      });

      it('should return spark for 3-5 entries', () => {
        const context: RitualContext = {
          tier: 'level2',
          entriesCompleted: 4
        };
        
        const ritual = getRitualForEvent('entry_complete', context);
        expect(ritual).toBeDefined();
        expect(ritual?.id).toBe('entry_spark');
        expect(ritual?.animation).toBe('spark');
      });

      it('should return bridge for 6+ entries', () => {
        const context: RitualContext = {
          tier: 'level5',
          entriesCompleted: 8
        };
        
        const ritual = getRitualForEvent('entry_complete', context);
        expect(ritual).toBeDefined();
        expect(ritual?.id).toBe('entry_bridge');
        expect(ritual?.animation).toBe('shimmer');
      });
    });

    describe('room_complete rituals', () => {
      it('should return level0 tier ritual for level0 users', () => {
        const context: RitualContext = {
          tier: 'level0',
          roomId: 'test-room'
        };
        
        const ritual = getRitualForEvent('room_complete', context);
        expect(ritual).toBeDefined();
        expect(ritual?.id).toBe('room_complete_level0');
      });

      it('should return level1-3 ritual for level2', () => {
        const context: RitualContext = {
          tier: 'level2'
        };
        
        const ritual = getRitualForEvent('room_complete', context);
        expect(ritual?.id).toBe('room_complete_level1_3');
      });

      it('should return level4-6 ritual for level5', () => {
        const context: RitualContext = {
          tier: 'level5'
        };
        
        const ritual = getRitualForEvent('room_complete', context);
        expect(ritual?.id).toBe('room_complete_level4_6');
      });

      it('should return level7-9 ritual for level9', () => {
        const context: RitualContext = {
          tier: 'level9'
        };
        
        const ritual = getRitualForEvent('room_complete', context);
        expect(ritual?.id).toBe('room_complete_level7_9');
      });

      it('should return crisis ritual for crisis rooms', () => {
        const context: RitualContext = {
          tier: 'level3',
          roomTags: ['mental_health', 'crisis']
        };
        
        const ritual = getRitualForEvent('room_complete', context);
        expect(ritual?.id).toBe('crisis_gentle');
        expect(ritual?.voiceTrigger).toBe('low_mood');
      });
    });

    describe('streak_milestone rituals', () => {
      it('should return 3-day streak ritual', () => {
        const context: RitualContext = {
          tier: 'level1',
          streakDays: 3
        };
        
        const ritual = getRitualForEvent('streak_milestone', context);
        expect(ritual?.id).toBe('streak_3_days');
        expect(ritual?.badgeId).toBe('streak_3');
      });

      it('should return 7-day streak ritual', () => {
        const context: RitualContext = {
          tier: 'level2',
          streakDays: 7
        };
        
        const ritual = getRitualForEvent('streak_milestone', context);
        expect(ritual?.id).toBe('streak_7_days');
      });

      it('should return 30-day streak ritual', () => {
        const context: RitualContext = {
          tier: 'level0',
          streakDays: 30
        };
        
        const ritual = getRitualForEvent('streak_milestone', context);
        expect(ritual?.id).toBe('streak_30_days');
      });

      it('should return null for 2-day streak', () => {
        const context: RitualContext = {
          tier: 'level1',
          streakDays: 2
        };
        
        const ritual = getRitualForEvent('streak_milestone', context);
        expect(ritual).toBeNull();
      });
    });

    describe('comeback_after_gap rituals', () => {
      it('should return comeback ritual after 7+ days', () => {
        const context: RitualContext = {
          tier: 'level3',
          daysSinceLastVisit: 10
        };
        
        const ritual = getRitualForEvent('comeback_after_gap', context);
        expect(ritual).toBeDefined();
        expect(ritual?.id).toBe('comeback_after_gap');
        expect(ritual?.emotionBias).toBe('returning_after_gap');
      });

      it('should return null for less than 7 days', () => {
        const context: RitualContext = {
          tier: 'level1',
          daysSinceLastVisit: 5
        };
        
        const ritual = getRitualForEvent('comeback_after_gap', context);
        expect(ritual).toBeNull();
      });
    });
  });

  describe('getRitualText', () => {
    it('should return English text when language is en', () => {
      const context: RitualContext = { tier: 'level0', entriesCompleted: 1 };
      const ritual = getRitualForEvent('entry_complete', context);
      
      expect(ritual).toBeDefined();
      expect(getRitualText(ritual!, 'en')).toBe(ritual?.textEn);
    });

    it('should return Vietnamese text when language is vi', () => {
      const context: RitualContext = { tier: 'level0', entriesCompleted: 1 };
      const ritual = getRitualForEvent('entry_complete', context);
      
      expect(ritual).toBeDefined();
      expect(getRitualText(ritual!, 'vi')).toBe(ritual?.textVi);
    });
  });

  describe('computeVisitStreak', () => {
    it('should return 1 for first visit', () => {
      const streak = computeVisitStreak(new Date(), null);
      expect(streak).toBe(1);
    });

    it('should reset to 1 after more than 1 day gap', () => {
      const now = new Date();
      const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
      
      const streak = computeVisitStreak(now, threeDaysAgo.toISOString());
      expect(streak).toBe(1);
    });
  });

  describe('checkStreakMilestone', () => {
    it('should detect 3-day milestone', () => {
      expect(checkStreakMilestone(3, 2)).toBe(3);
    });

    it('should detect 7-day milestone', () => {
      expect(checkStreakMilestone(7, 6)).toBe(7);
    });

    it('should detect 30-day milestone', () => {
      expect(checkStreakMilestone(30, 29)).toBe(30);
    });

    it('should return null when no milestone crossed', () => {
      expect(checkStreakMilestone(5, 4)).toBeNull();
    });

    it('should return null when already past milestone', () => {
      expect(checkStreakMilestone(8, 7)).toBeNull();
    });
  });
});

describe('VIP Ceremonies', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('getTierCeremony', () => {
    it('should return ceremony for level1', () => {
      const ceremony = getTierCeremony('level1');
      expect(ceremony).toBeDefined();
      expect(ceremony?.tier).toBe('level1');
    });

    it('should return ceremony for level9', () => {
      const ceremony = getTierCeremony('level9');
      expect(ceremony).toBeDefined();
      expect(ceremony?.tier).toBe('level9');
      expect(ceremony?.textEn).toContain('Distinguished');
    });

    it('should return null for invalid tier', () => {
      const ceremony = getTierCeremony('vip10');
      expect(ceremony).toBeNull();
    });

    it('should return null for level0 tier', () => {
      const ceremony = getTierCeremony('level0');
      expect(ceremony).toBeNull();
    });
  });

  describe('getCeremonyText', () => {
    it('should return English text', () => {
      const ceremony = getTierCeremony('level1')!;
      expect(getCeremonyText(ceremony, 'en')).toBe(ceremony.textEn);
    });

    it('should return Vietnamese text', () => {
      const ceremony = getTierCeremony('level1')!;
      expect(getCeremonyText(ceremony, 'vi')).toBe(ceremony.textVi);
    });
  });

  describe('executeTierCeremony', () => {
    it('should return ceremony on first upgrade', () => {
      const ceremony = executeTierCeremony('level1', 'level0');
      expect(ceremony).toBeDefined();
      expect(ceremony?.tier).toBe('level1');
    });

    it('should return null on second call (already celebrated)', () => {
      executeTierCeremony('level1', 'level0');
      const second = executeTierCeremony('level1', 'level0');
      expect(second).toBeNull();
    });

    it('should return null for downgrade', () => {
      const ceremony = executeTierCeremony('level1', 'level3');
      expect(ceremony).toBeNull();
    });
  });

  describe('ceremony text length', () => {
    const tiers = ['level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9'];
    
    it.each(tiers)('%s ceremony text should be ≤160 chars', (tier) => {
      const ceremony = getTierCeremony(tier);
      expect(ceremony).toBeDefined();
      expect(ceremony!.textEn.length).toBeLessThanOrEqual(160);
      expect(ceremony!.textVi.length).toBeLessThanOrEqual(160);
    });
  });
});

describe('Crisis Room Behavior', () => {
  it('should use gentle ritual in crisis rooms', () => {
    const context: RitualContext = {
      tier: 'level5',
      roomTags: ['trauma', 'healing']
    };
    
    const ritual = getRitualForEvent('room_complete', context);
    expect(ritual?.id).toBe('crisis_gentle');
    expect(ritual?.emotionBias).toBe('neutral');
    expect(ritual?.voiceTrigger).toBe('low_mood');
  });

  it('should not use celebrating emotion in crisis rooms', () => {
    const context: RitualContext = {
      tier: 'level9',
      roomDomain: 'mental_health'
    };
    
    const ritual = getRitualForEvent('room_complete', context);
    expect(ritual?.emotionBias).not.toBe('celebrating');
  });
});
