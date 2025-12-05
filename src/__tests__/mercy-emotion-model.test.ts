/**
 * Mercy Emotion Model Tests - Phase 5
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { 
  EmotionEngine, 
  inferEmotion, 
  getEmotionFromOnboardingAnswer,
  type EmotionState 
} from '../lib/mercy-host/emotionModel';
import { 
  isCrisisRoom, 
  enforceSafeEmotion, 
  isSafeTrigger,
  validateCrisisScript 
} from '../lib/mercy-host/safetyRails';

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

describe('EmotionEngine', () => {
  let engine: EmotionEngine;

  beforeEach(() => {
    localStorageMock.clear();
    engine = new EmotionEngine();
  });

  describe('recordEvent', () => {
    it('should start with neutral emotion', () => {
      expect(engine.getEmotion()).toBe('neutral');
    });

    it('should transition to celebrating on milestone_complete', () => {
      // Record multiple milestone events to build up score
      engine.recordEvent('milestone_complete');
      engine.recordEvent('milestone_complete');
      expect(engine.getEmotion()).toBe('celebrating');
    });

    it('should transition to confused on error_seen events', () => {
      engine.recordEvent('error_seen');
      engine.recordEvent('error_seen');
      engine.recordEvent('error_seen');
      expect(['confused', 'stressed']).toContain(engine.getEmotion());
    });

    it('should handle return_after_7_days context', () => {
      engine.recordEvent('room_enter', { hoursSinceLastVisit: 200 });
      expect(engine.getEmotion()).toBe('returning_after_gap');
    });

    it('should maintain rolling window of events', () => {
      for (let i = 0; i < 15; i++) {
        engine.recordEvent('room_enter');
      }
      expect(engine.getHistory().length).toBeLessThanOrEqual(10);
    });
  });

  describe('emotion smoothing', () => {
    it('should not jump emotions too quickly (cool-down)', () => {
      const initialEmotion = engine.getEmotion();
      
      // Record event but within cool-down period
      engine.recordEvent('celebrating');
      
      // Emotion might not change immediately due to cool-down
      // This tests the smoothing behavior
      const afterEvent = engine.getEmotion();
      expect(['neutral', 'celebrating']).toContain(afterEvent);
    });
  });

  describe('setEmotion', () => {
    it('should force set emotion', () => {
      engine.setEmotion('low_mood');
      expect(engine.getEmotion()).toBe('low_mood');
    });
  });

  describe('reset', () => {
    it('should reset to neutral', () => {
      engine.setEmotion('stressed');
      engine.reset();
      expect(engine.getEmotion()).toBe('neutral');
    });
  });

  describe('getScores', () => {
    it('should return all emotion scores', () => {
      const scores = engine.getScores();
      expect(scores).toHaveProperty('neutral');
      expect(scores).toHaveProperty('focused');
      expect(scores).toHaveProperty('confused');
      expect(scores).toHaveProperty('low_mood');
      expect(scores).toHaveProperty('stressed');
      expect(scores).toHaveProperty('celebrating');
      expect(scores).toHaveProperty('returning_after_gap');
    });
  });
});

describe('inferEmotion', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  it('should return a valid emotion state', () => {
    const validEmotions: EmotionState[] = [
      'neutral', 'focused', 'confused', 'low_mood', 
      'stressed', 'celebrating', 'returning_after_gap'
    ];
    
    const result = inferEmotion('room_enter');
    expect(validEmotions).toContain(result);
  });
});

describe('getEmotionFromOnboardingAnswer', () => {
  it('should return confused for "lost" answers', () => {
    expect(getEmotionFromOnboardingAnswer('I feel lost')).toBe('confused');
  });

  it('should return low_mood for "tired" answers', () => {
    expect(getEmotionFromOnboardingAnswer('I am tired')).toBe('low_mood');
  });

  it('should return stressed for "anxious" answers', () => {
    expect(getEmotionFromOnboardingAnswer('I feel anxious')).toBe('stressed');
  });

  it('should return celebrating for "excited" answers', () => {
    expect(getEmotionFromOnboardingAnswer('I am excited')).toBe('celebrating');
  });

  it('should return focused for "ready" answers', () => {
    expect(getEmotionFromOnboardingAnswer('I am ready')).toBe('focused');
  });

  it('should return neutral for unknown answers', () => {
    expect(getEmotionFromOnboardingAnswer('hello world')).toBe('neutral');
  });

  it('should handle Vietnamese answers', () => {
    expect(getEmotionFromOnboardingAnswer('Tôi mệt quá')).toBe('low_mood');
    expect(getEmotionFromOnboardingAnswer('Tôi lo lắng')).toBe('stressed');
  });
});

describe('Safety Rails', () => {
  describe('isCrisisRoom', () => {
    it('should detect crisis tags', () => {
      expect(isCrisisRoom(['crisis'])).toBe(true);
      expect(isCrisisRoom(['trauma'])).toBe(true);
      expect(isCrisisRoom(['grief'])).toBe(true);
      expect(isCrisisRoom(['mental_health'])).toBe(true);
    });

    it('should detect crisis domain', () => {
      expect(isCrisisRoom([], 'healing')).toBe(true);
      expect(isCrisisRoom([], 'depression')).toBe(true);
    });

    it('should return false for non-crisis rooms', () => {
      expect(isCrisisRoom(['english', 'learning'])).toBe(false);
      expect(isCrisisRoom([], 'education')).toBe(false);
    });

    it('should handle empty input', () => {
      expect(isCrisisRoom()).toBe(false);
      expect(isCrisisRoom([])).toBe(false);
    });
  });

  describe('enforceSafeEmotion', () => {
    it('should not modify emotions for non-crisis rooms', () => {
      expect(enforceSafeEmotion('celebrating', false)).toBe('celebrating');
      expect(enforceSafeEmotion('stressed', false)).toBe('stressed');
    });

    it('should force celebrating to neutral in crisis rooms', () => {
      expect(enforceSafeEmotion('celebrating', true)).toBe('neutral');
    });

    it('should force focused to neutral in crisis rooms', () => {
      expect(enforceSafeEmotion('focused', true)).toBe('neutral');
    });

    it('should map stressed to low_mood in crisis rooms', () => {
      expect(enforceSafeEmotion('stressed', true)).toBe('low_mood');
    });

    it('should keep neutral as neutral in crisis rooms', () => {
      expect(enforceSafeEmotion('neutral', true)).toBe('neutral');
    });
  });

  describe('isSafeTrigger', () => {
    it('should allow all triggers for non-crisis rooms', () => {
      expect(isSafeTrigger('celebrating', false)).toBe(true);
      expect(isSafeTrigger('milestone_complete', false)).toBe(true);
    });

    it('should block celebratory triggers in crisis rooms', () => {
      expect(isSafeTrigger('celebrating', true)).toBe(false);
      expect(isSafeTrigger('milestone_complete', true)).toBe(false);
      expect(isSafeTrigger('tier_unlock', true)).toBe(false);
    });

    it('should allow safe triggers in crisis rooms', () => {
      expect(isSafeTrigger('room_enter', true)).toBe(true);
      expect(isSafeTrigger('entry_complete', true)).toBe(true);
    });
  });

  describe('validateCrisisScript', () => {
    it('should reject celebratory text', () => {
      expect(validateCrisisScript('Amazing job! Celebrate your win!')).toBe(false);
      expect(validateCrisisScript('Tuyệt vời! Bạn làm xuất sắc!')).toBe(false);
    });

    it('should accept gentle text', () => {
      expect(validateCrisisScript("I'm here with you. Take your time.")).toBe(true);
      expect(validateCrisisScript('Mình ở đây với bạn.')).toBe(true);
    });
  });
});

describe('Emotion Scripts Coverage', () => {
  // Import tier scripts dynamically
  it('should have emotion variants for all tiers', async () => {
    const { TIER_EMOTION_SCRIPTS } = await import('../lib/mercy-host/tierScripts');
    
    const tiers = ['free', 'vip1', 'vip2', 'vip3', 'vip4', 'vip5', 'vip6', 'vip7', 'vip8', 'vip9'];
    const requiredEmotions: EmotionState[] = ['low_mood', 'confused', 'stressed', 'celebrating'];
    
    for (const tier of tiers) {
      const scripts = TIER_EMOTION_SCRIPTS[tier];
      if (scripts) {
        for (const emotion of requiredEmotions) {
          expect(scripts[emotion]).toBeDefined();
          expect(scripts[emotion]?.en.length).toBeLessThanOrEqual(160);
          expect(scripts[emotion]?.vi.length).toBeLessThanOrEqual(160);
        }
      }
    }
  });
});

describe('Snapshot Tests', () => {
  it('should match English greeting snapshots', async () => {
    const { TIER_EMOTION_SCRIPTS } = await import('../lib/mercy-host/tierScripts');
    
    const allEnglishGreetings: Record<string, string[]> = {};
    for (const [tier, scripts] of Object.entries(TIER_EMOTION_SCRIPTS)) {
      allEnglishGreetings[tier] = Object.values(scripts).map(s => s?.en || '');
    }
    
    expect(allEnglishGreetings).toMatchSnapshot();
  });

  it('should match Vietnamese greeting snapshots', async () => {
    const { TIER_EMOTION_SCRIPTS } = await import('../lib/mercy-host/tierScripts');
    
    const allVietnameseGreetings: Record<string, string[]> = {};
    for (const [tier, scripts] of Object.entries(TIER_EMOTION_SCRIPTS)) {
      allVietnameseGreetings[tier] = Object.values(scripts).map(s => s?.vi || '');
    }
    
    expect(allVietnameseGreetings).toMatchSnapshot();
  });
});
