import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getParentRoute,
  isValidRoomId,
  getRoomTier,
  tierToRoute,
  type ParentRoute,
  type RoomTier,
} from '../routeHelper';

describe('routeHelper', () => {
  let consoleWarnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleWarnSpy.mockRestore();
  });

  describe('isValidRoomId', () => {
    it('should return false for undefined', () => {
      expect(isValidRoomId(undefined)).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidRoomId('')).toBe(false);
    });

    it('should return true for valid room IDs', () => {
      expect(isValidRoomId('adhd-support-free')).toBe(true);
      expect(isValidRoomId('adhd-support-vip1')).toBe(true);
      expect(isValidRoomId('adhd-support-vip2')).toBe(true);
      expect(isValidRoomId('adhd-support-vip3')).toBe(true);
    });

    it('should return true for sexuality sub-rooms', () => {
      expect(isValidRoomId('sexuality-curiosity-vip3-sub1')).toBe(true);
      expect(isValidRoomId('sexuality-curiosity-vip3-sub2')).toBe(true);
      expect(isValidRoomId('sexuality-curiosity-vip3-sub3')).toBe(true);
      expect(isValidRoomId('sexuality-curiosity-vip3-sub4')).toBe(true);
      expect(isValidRoomId('sexuality-curiosity-vip3-sub5')).toBe(true);
      expect(isValidRoomId('sexuality-curiosity-vip3-sub6')).toBe(true);
    });

    it('should return true for special VIP3 rooms', () => {
      expect(isValidRoomId('sexuality-and-curiosity-and-culture-vip3')).toBe(true);
      expect(isValidRoomId('strategy-in-life-1-vip3')).toBe(true);
      expect(isValidRoomId('strategy-in-life-2-vip3')).toBe(true);
      expect(isValidRoomId('strategy-in-life-3-vip3')).toBe(true);
      expect(isValidRoomId('finance-glory-vip3')).toBe(true);
    });

    it('should return false for invalid room IDs', () => {
      expect(isValidRoomId('nonexistent-room')).toBe(false);
      expect(isValidRoomId('fake-room-vip1')).toBe(false);
    });
  });

  describe('getRoomTier', () => {
    it('should extract tier from standard room IDs', () => {
      expect(getRoomTier('adhd-support-free')).toBe('free');
      expect(getRoomTier('adhd-support-vip1')).toBe('vip1');
      expect(getRoomTier('adhd-support-vip2')).toBe('vip2');
      expect(getRoomTier('adhd-support-vip3')).toBe('vip3');
    });

    it('should return null for room IDs without tier suffix', () => {
      expect(getRoomTier('sexuality-curiosity-vip3-sub1')).toBe(null);
      expect(getRoomTier('invalid-room')).toBe(null);
    });

    it('should handle special VIP3 rooms with tier suffix', () => {
      expect(getRoomTier('strategy-in-life-1-vip3')).toBe('vip3');
      expect(getRoomTier('finance-glory-vip3')).toBe('vip3');
    });
  });

  describe('tierToRoute', () => {
    it('should map tiers to correct routes', () => {
      expect(tierToRoute('free')).toBe('/rooms');
      expect(tierToRoute('vip1')).toBe('/rooms-vip1');
      expect(tierToRoute('vip2')).toBe('/rooms-vip2');
      expect(tierToRoute('vip3')).toBe('/rooms-vip3');
    });

    it('should return correct type', () => {
      const route: ParentRoute = tierToRoute('vip3');
      expect(route).toBe('/rooms-vip3');
    });
  });

  describe('getParentRoute', () => {
    describe('Edge Cases', () => {
      it('should return /rooms for undefined', () => {
        expect(getParentRoute(undefined)).toBe('/rooms');
      });

      it('should return /rooms for empty string', () => {
        expect(getParentRoute('')).toBe('/rooms');
      });

      it('should warn and return /rooms for invalid room ID', () => {
        const result = getParentRoute('nonexistent-room-vip1');
        expect(result).toBe('/rooms');
        expect(consoleWarnSpy).toHaveBeenCalledWith(
          expect.stringContaining('Unknown room ID: nonexistent-room-vip1')
        );
      });

      it('should warn when room has no tier suffix', () => {
        // This will be an invalid room since our rooms always have tier suffixes
        const result = getParentRoute('room-without-tier');
        expect(result).toBe('/rooms');
        expect(consoleWarnSpy).toHaveBeenCalled();
      });
    });

    describe('Sexuality Sub-Rooms', () => {
      it('should route all sexuality sub-rooms to /sexuality-culture', () => {
        expect(getParentRoute('sexuality-curiosity-vip3-sub1')).toBe('/sexuality-culture');
        expect(getParentRoute('sexuality-curiosity-vip3-sub2')).toBe('/sexuality-culture');
        expect(getParentRoute('sexuality-curiosity-vip3-sub3')).toBe('/sexuality-culture');
        expect(getParentRoute('sexuality-curiosity-vip3-sub4')).toBe('/sexuality-culture');
        expect(getParentRoute('sexuality-curiosity-vip3-sub5')).toBe('/sexuality-culture');
        expect(getParentRoute('sexuality-curiosity-vip3-sub6')).toBe('/sexuality-culture');
      });

      it('should route sexuality parent room to /rooms-vip3', () => {
        expect(getParentRoute('sexuality-and-curiosity-and-culture-vip3')).toBe('/rooms-vip3');
      });
    });

    describe('Strategy in Life Series', () => {
      it('should route all strategy rooms to /rooms-vip3', () => {
        expect(getParentRoute('strategy-in-life-1-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('strategy-in-life-2-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('strategy-in-life-3-vip3')).toBe('/rooms-vip3');
      });
    });

    describe('Special VIP3 Rooms', () => {
      it('should route finance glory to /rooms-vip3', () => {
        expect(getParentRoute('finance-glory-vip3')).toBe('/rooms-vip3');
      });
    });

    describe('Standard Tier-Based Rooms', () => {
      it('should route free tier rooms to /rooms', () => {
        expect(getParentRoute('adhd-support-free')).toBe('/rooms');
        expect(getParentRoute('anxiety-relief-free')).toBe('/rooms');
        expect(getParentRoute('mental-health-free')).toBe('/rooms');
        expect(getParentRoute('mindfulness-free')).toBe('/rooms');
      });

      it('should route VIP1 rooms to /rooms-vip1', () => {
        expect(getParentRoute('adhd-support-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('anxiety-relief-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('mental-health-vip1')).toBe('/rooms-vip1');
      });

      it('should route VIP2 rooms to /rooms-vip2', () => {
        expect(getParentRoute('adhd-support-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('anxiety-relief-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('burnout-recovery-vip2')).toBe('/rooms-vip2');
      });

      it('should route VIP3 rooms to /rooms-vip3', () => {
        expect(getParentRoute('adhd-support-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('anxiety-relief-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('mental-health-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('mindfulness-vip3')).toBe('/rooms-vip3');
      });
    });

    describe('All Room Categories', () => {
      it('should handle ADHD support rooms across all tiers', () => {
        expect(getParentRoute('adhd-support-free')).toBe('/rooms');
        expect(getParentRoute('adhd-support-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('adhd-support-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('adhd-support-vip3')).toBe('/rooms-vip3');
      });

      it('should handle depression support rooms across all tiers', () => {
        expect(getParentRoute('depression-support-free')).toBe('/rooms');
        expect(getParentRoute('depression-support-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('depression-support-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('depression-support-vip3')).toBe('/rooms-vip3');
      });

      it('should handle confidence rooms across all tiers', () => {
        expect(getParentRoute('confidence-free')).toBe('/rooms');
        expect(getParentRoute('confidence-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('confidence-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('confidence-vip3')).toBe('/rooms-vip3');
      });

      it('should handle nutrition rooms across all tiers', () => {
        expect(getParentRoute('nutrition-free')).toBe('/rooms');
        expect(getParentRoute('nutrition-vip1')).toBe('/rooms-vip1');
        expect(getParentRoute('nutrition-vip2')).toBe('/rooms-vip2');
        expect(getParentRoute('nutrition-vip3')).toBe('/rooms-vip3');
      });
    });

    describe('Type Safety', () => {
      it('should return ParentRoute type', () => {
        const route: ParentRoute = getParentRoute('adhd-support-vip3');
        expect(['/rooms', '/rooms-vip1', '/rooms-vip2', '/rooms-vip3', '/sexuality-culture']).toContain(route);
      });

      it('should accept string or undefined', () => {
        const route1: ParentRoute = getParentRoute('adhd-support-free');
        const route2: ParentRoute = getParentRoute(undefined);
        expect(route1).toBe('/rooms');
        expect(route2).toBe('/rooms');
      });
    });

    describe('Pattern Matching Priority', () => {
      it('should prioritize sexuality sub-room pattern over tier pattern', () => {
        // Even though it ends with a tier-like pattern, the prefix should match first
        expect(getParentRoute('sexuality-curiosity-vip3-sub1')).toBe('/sexuality-culture');
      });

      it('should check special rooms before tier-based routing', () => {
        expect(getParentRoute('sexuality-and-curiosity-and-culture-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('strategy-in-life-1-vip3')).toBe('/rooms-vip3');
        expect(getParentRoute('finance-glory-vip3')).toBe('/rooms-vip3');
      });
    });
  });
});
