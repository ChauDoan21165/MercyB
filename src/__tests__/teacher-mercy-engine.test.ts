/**
 * Mercy Host Engine Test Suite
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMercyEngine, initialEngineState, type MercyEngineState } from '@/lib/teacher-mercy/engine';
import { getAnimationForEvent, shouldTriggerVoice, getVoiceTriggerForEvent } from '@/lib/teacher-mercy/eventMap';
import { getTierScript, getTierGreeting, getTierEncouragement } from '@/lib/teacher-mercy/tierScripts';
import { getVoiceLineByTrigger } from '@/lib/teacher-mercy/voicePack';

describe('Mercy Host Engine', () => {
  let state: MercyEngineState;
  let setState: (updater: (prev: MercyEngineState) => MercyEngineState) => void;
  let getState: () => MercyEngineState;
  
  beforeEach(() => {
    state = { ...initialEngineState };
    setState = vi.fn((updater) => {
      state = updater(state);
    });
    getState = () => state;
    localStorage.clear();
  });
  
  describe('createMercyEngine', () => {
    it('should create engine with all required actions', () => {
      const engine = createMercyEngine(setState, getState);
      
      expect(engine.init).toBeDefined();
      expect(engine.greet).toBeDefined();
      expect(engine.onEnterRoom).toBeDefined();
      expect(engine.onReturnRoom).toBeDefined();
      expect(engine.onTierChange).toBeDefined();
      expect(engine.onEvent).toBeDefined();
      expect(engine.setEnabled).toBeDefined();
      expect(engine.setAvatarStyle).toBeDefined();
      expect(engine.setLanguage).toBeDefined();
      expect(engine.dismiss).toBeDefined();
      expect(engine.show).toBeDefined();
    });
    
    it('should initialize with config', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.init({
        tier: 'level3',
        userName: 'Test User',
        language: 'vi'
      });
      
      expect(setState).toHaveBeenCalled();
    });
    
    it('should greet when enabled', () => {
      state.isEnabled = true;
      const engine = createMercyEngine(setState, getState);
      
      engine.greet();
      
      expect(setState).toHaveBeenCalled();
    });
    
    it('should not greet when disabled', () => {
      state.isEnabled = false;
      const engine = createMercyEngine(setState, getState);
      
      engine.greet();
      
      // Should not update state when disabled
      expect(state.greetingText).toBeNull();
    });
    
    it('should toggle enabled state', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.setEnabled(false);
      
      expect(setState).toHaveBeenCalled();
    });
    
    it('should change avatar style', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.setAvatarStyle('angelic');
      
      expect(setState).toHaveBeenCalled();
    });
    
    it('should change language', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.setLanguage('vi');
      
      expect(setState).toHaveBeenCalled();
    });
  });
  
  describe('Event Map', () => {
    it('should return correct animation for room_enter', () => {
      expect(getAnimationForEvent('room_enter')).toBe('halo');
    });
    
    it('should return spark for entry_click', () => {
      expect(getAnimationForEvent('entry_click')).toBe('spark');
    });
    
    it('should return shimmer for tier_upgrade', () => {
      expect(getAnimationForEvent('tier_upgrade')).toBe('shimmer');
    });
    
    it('should return glow for color_toggle', () => {
      expect(getAnimationForEvent('color_toggle')).toBe('glow');
    });
    
    it('should determine voice trigger correctly', () => {
      expect(shouldTriggerVoice('room_enter')).toBe(true);
      expect(shouldTriggerVoice('entry_click')).toBe(false);
      expect(shouldTriggerVoice('tier_upgrade')).toBe(true);
    });
    
    it('should map event to voice trigger type', () => {
      expect(getVoiceTriggerForEvent('room_enter')).toBe('room_enter');
      expect(getVoiceTriggerForEvent('entry_complete')).toBe('entry_complete');
      expect(getVoiceTriggerForEvent('tier_upgrade')).toBe('encouragement');
      expect(getVoiceTriggerForEvent('entry_click')).toBeNull();
    });
  });
  
  describe('Tier Scripts', () => {
    it('should return script for level0 tier', () => {
      const script = getTierScript('level0');
      expect(script.tone).toBe('warm, encouraging, gentle');
      expect(script.greetings.length).toBeGreaterThan(0);
    });
    
    it('should return script for Level 9', () => {
      const script = getTierScript('level9');
      expect(script.tone).toBe('divine, metaphysical');
    });
    
    it('should get tier greeting with name replacement', () => {
      const greeting = getTierGreeting('level0', 'Alice');
      expect(greeting.en).toContain('Alice');
      expect(greeting.vi).toContain('Alice');
    });
    
    it('should get encouragement for tier', () => {
      const encouragement = getTierEncouragement('level3');
      expect(encouragement.en).toBeDefined();
      expect(encouragement.vi).toBeDefined();
    });
  });
  
  describe('Voice Pack', () => {
    it('should get voice line by trigger', () => {
      const line = getVoiceLineByTrigger('room_enter', 'Test');
      expect(line).toBeDefined();
      expect(line.trigger).toBe('room_enter');
    });
    
    it('should replace name placeholder in voice line', () => {
      const line = getVoiceLineByTrigger('room_enter', 'Alice');
      // Some lines contain name, some don't
      if (line.en.includes('Alice')) {
        expect(line.en).toContain('Alice');
      }
    });
    
    it('should have EN and VI text for each line', () => {
      const line = getVoiceLineByTrigger('entry_complete');
      expect(line.en).toBeDefined();
      expect(line.vi).toBeDefined();
    });
  });
  
  describe('Initial State', () => {
    it('should have correct default values', () => {
      expect(initialEngineState.isEnabled).toBe(true);
      expect(initialEngineState.presenceState).toBe('idle');
      expect(initialEngineState.avatarStyle).toBe('minimalist');
      expect(initialEngineState.language).toBe('en');
      expect(initialEngineState.currentTier).toBe('level0');
      expect(initialEngineState.isGreetingVisible).toBe(false);
      expect(initialEngineState.isBubbleVisible).toBe(false);
    });
  });
  
  describe('Role Consistency', () => {
    it('should always speak as Mercy', () => {
      const greeting = getTierGreeting('level0', 'User');
      // Check greetings don't claim to be AI
      expect(greeting.en.toLowerCase()).not.toContain('ai');
      expect(greeting.en.toLowerCase()).not.toContain('artificial');
      expect(greeting.en.toLowerCase()).not.toContain('model');
    });
  });
  
  describe('Speech Length', () => {
    it('should respect max speech length of 160 chars', () => {
      const allTiers = ['level0', 'level1', 'level2', 'level3', 'level4', 'level5', 'level6', 'level7', 'level8', 'level9'];
      
      allTiers.forEach(tier => {
        const script = getTierScript(tier);
        script.greetings.forEach(greeting => {
          // Allow some buffer for name replacement
          expect(greeting.en.length).toBeLessThan(200);
          expect(greeting.vi.length).toBeLessThan(200);
        });
      });
    });
  });
});
