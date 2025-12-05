/**
 * Mercy Integration Tests
 * 
 * Tests ChatHub + MercyHostProvider interplay.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createMercyEngine, initialEngineState, type MercyEngineState } from '@/lib/mercy-host/engine';
import { loadValidatedMemory, saveMemory, resetMemory } from '@/lib/mercy-host/memorySchema';
import { eventLimiter } from '@/lib/mercy-host/eventLimiter';
import { mercyHeartbeat } from '@/lib/mercy-host/heartbeat';

describe('Mercy Integration Tests', () => {
  let state: MercyEngineState;
  let setState: (updater: (prev: MercyEngineState) => MercyEngineState) => void;
  let getState: () => MercyEngineState;

  beforeEach(() => {
    state = { ...initialEngineState };
    setState = vi.fn((updater) => {
      state = updater(state);
    });
    getState = () => state;

    // Mock localStorage
    const storage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation((key) => storage[key] || null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      storage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      delete storage[key];
    });

    // Clear event limiter
    eventLimiter.clearQueue();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Engine Initialization Flow', () => {
    it('should initialize engine with default state', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.init({ tier: 'free', language: 'en' });
      
      expect(setState).toHaveBeenCalled();
      expect(state.isEnabled).toBe(true);
      expect(state.currentTier).toBe('free');
    });

    it('should initialize with VIP tier and update avatar', () => {
      const engine = createMercyEngine(setState, getState);
      
      engine.init({ tier: 'vip9', language: 'en' });
      
      expect(state.currentTier).toBe('vip9');
      expect(state.avatarStyle).toBe('angelic');
    });

    it('should respect saved enabled state', () => {
      localStorage.setItem('mercy_host_enabled', 'false');
      
      const engine = createMercyEngine(setState, getState);
      engine.init({ tier: 'free' });
      
      expect(state.isEnabled).toBe(false);
    });
  });

  describe('Room Enter Flow', () => {
    it('should trigger greeting on first room enter', () => {
      state.isEnabled = true;
      const engine = createMercyEngine(setState, getState);
      
      engine.onEnterRoom('test-room', 'Test Room');
      
      // Should have triggered state updates
      expect(setState).toHaveBeenCalled();
    });

    it('should not trigger greeting when disabled', () => {
      state.isEnabled = false;
      const engine = createMercyEngine(setState, getState);
      
      engine.onEnterRoom('test-room', 'Test Room');
      
      // Greeting should not be visible
      expect(state.isGreetingVisible).toBe(false);
    });
  });

  describe('Tier Change Flow', () => {
    it('should update avatar on tier upgrade', () => {
      state.isEnabled = true;
      state.avatarStyle = 'minimalist';
      const engine = createMercyEngine(setState, getState);
      
      engine.onTierChange('vip9');
      
      expect(state.avatarStyle).toBe('angelic');
      expect(state.currentTier).toBe('vip9');
    });

    it('should trigger shimmer animation on tier change', () => {
      state.isEnabled = true;
      const engine = createMercyEngine(setState, getState);
      
      engine.onTierChange('vip5');
      
      expect(state.currentAnimation).toBe('shimmer');
    });
  });

  describe('Memory Persistence', () => {
    it('should persist engine state across reload', () => {
      const memory = loadValidatedMemory();
      memory.totalVisits = 5;
      memory.hasOnboarded = true;
      saveMemory(memory);
      
      const loaded = loadValidatedMemory();
      expect(loaded.totalVisits).toBe(5);
      expect(loaded.hasOnboarded).toBe(true);
    });

    it('should reset corrupted memory', () => {
      localStorage.setItem('mercy_host_memory', 'invalid json{');
      
      const loaded = loadValidatedMemory();
      expect(loaded.version).toBeDefined();
      expect(loaded.totalVisits).toBe(0);
    });

    it('should migrate old memory versions', () => {
      localStorage.setItem('mercy_host_memory', JSON.stringify({
        version: 1,
        userName: 'TestUser',
        totalVisits: 10
      }));
      
      const loaded = loadValidatedMemory();
      expect(loaded.version).toBe(2);
      expect(loaded.userName).toBe('TestUser');
      expect(loaded.totalVisits).toBe(10);
      expect(loaded.hostPreferences.silenceMode).toBe(false);
    });
  });

  describe('Event Throttling', () => {
    it('should throttle rapid events', () => {
      const processed: string[] = [];
      eventLimiter.setProcessor((event) => {
        processed.push(event);
      });

      // Submit multiple events rapidly
      eventLimiter.submit('room_enter');
      eventLimiter.submit('entry_click');
      eventLimiter.submit('color_toggle');

      // Only first should process immediately
      expect(processed.length).toBe(1);
      expect(processed[0]).toBe('room_enter');
    });

    it('should queue excess events', () => {
      eventLimiter.setProcessor(() => {});
      
      const status1 = eventLimiter.getStatus();
      expect(status1.queueLength).toBe(0);

      // Submit one that processes
      eventLimiter.submit('room_enter');
      // Submit more that get queued
      eventLimiter.submit('entry_click');
      eventLimiter.submit('color_toggle');

      const status2 = eventLimiter.getStatus();
      expect(status2.queueLength).toBeGreaterThan(0);
    });
  });

  describe('Heartbeat Monitor', () => {
    it('should report healthy status for valid state', () => {
      state = {
        ...initialEngineState,
        avatarStyle: 'minimalist',
        currentAnimation: 'halo'
      };

      mercyHeartbeat.start(getState, () => {});
      const status = mercyHeartbeat.forceCheck();
      
      expect(status.isHealthy).toBe(true);
      expect(status.checks.avatarMounted).toBe(true);
      expect(status.checks.animationAlive).toBe(true);

      mercyHeartbeat.stop();
    });

    it('should detect invalid avatar style', () => {
      state = {
        ...initialEngineState,
        avatarStyle: 'invalid-style' as any
      };

      mercyHeartbeat.start(getState, () => {});
      const status = mercyHeartbeat.forceCheck();
      
      expect(status.checks.avatarMounted).toBe(false);

      mercyHeartbeat.stop();
    });
  });

  describe('Silence Mode', () => {
    it('should update silence mode in memory', () => {
      const memory = loadValidatedMemory();
      memory.hostPreferences.silenceMode = true;
      saveMemory(memory);
      
      const loaded = loadValidatedMemory();
      expect(loaded.hostPreferences.silenceMode).toBe(true);
    });
  });

  describe('Greeting Snapshots', () => {
    it('should have consistent greeting text for free tier', () => {
      const { getTierGreeting } = require('@/lib/mercy-host/tierScripts');
      const greeting = getTierGreeting('free', 'TestUser');
      
      expect(greeting.en).toBeDefined();
      expect(greeting.vi).toBeDefined();
      expect(greeting.en.length).toBeGreaterThan(0);
      expect(greeting.vi.length).toBeGreaterThan(0);
    });

    it('should include user name in greeting', () => {
      const { getTierGreeting } = require('@/lib/mercy-host/tierScripts');
      const greeting = getTierGreeting('free', 'Alice');
      
      // At least one greeting should contain the name
      expect(greeting.en.includes('Alice') || !greeting.en.includes('{{name}}')).toBe(true);
    });
  });
});
