import { describe, it, expect } from 'vitest';
import { canUserAccessRoom, canAccessVIPTier, getAccessibleTiers, validateAccessControl, ACCESS_TEST_MATRIX } from '../accessControl';
import type { TierId } from '../constants/tiers';

describe('Access Control', () => {
  describe('canUserAccessRoom', () => {
    it('should allow free tier users to access free content', () => {
      expect(canUserAccessRoom('free', 'free')).toBe(true);
    });

    it('should block free tier users from VIP content', () => {
      expect(canUserAccessRoom('free', 'vip1')).toBe(false);
      expect(canUserAccessRoom('free', 'vip2')).toBe(false);
      expect(canUserAccessRoom('free', 'vip3')).toBe(false);
    });

    it('should allow VIP2 users to access VIP1 and Free content', () => {
      expect(canUserAccessRoom('vip2', 'free')).toBe(true);
      expect(canUserAccessRoom('vip2', 'vip1')).toBe(true);
      expect(canUserAccessRoom('vip2', 'vip2')).toBe(true);
    });

    it('should block VIP2 users from VIP3+ content', () => {
      expect(canUserAccessRoom('vip2', 'vip3')).toBe(false);
      expect(canUserAccessRoom('vip2', 'vip4')).toBe(false);
    });

    it('should allow VIP9 users to access all content', () => {
      expect(canUserAccessRoom('vip9', 'free')).toBe(true);
      expect(canUserAccessRoom('vip9', 'vip1')).toBe(true);
      expect(canUserAccessRoom('vip9', 'vip6')).toBe(true);
      expect(canUserAccessRoom('vip9', 'vip9')).toBe(true);
    });

    it('should handle VIP3 II tier correctly', () => {
      expect(canUserAccessRoom('vip3ii', 'vip3')).toBe(true);
      expect(canUserAccessRoom('vip3ii', 'vip3ii')).toBe(true);
      expect(canUserAccessRoom('vip3', 'vip3ii')).toBe(false);
    });
  });

  describe('canAccessVIPTier', () => {
    it('should match canUserAccessRoom behavior', () => {
      expect(canAccessVIPTier('vip3', 'vip2')).toBe(true);
      expect(canAccessVIPTier('vip3', 'vip4')).toBe(false);
    });
  });

  describe('getAccessibleTiers', () => {
    it('should return only free for free tier users', () => {
      const tiers = getAccessibleTiers('free');
      expect(tiers).toEqual(['free']);
    });

    it('should return free through VIP3 for VIP3 users', () => {
      const tiers = getAccessibleTiers('vip3');
      expect(tiers).toContain('free');
      expect(tiers).toContain('vip1');
      expect(tiers).toContain('vip2');
      expect(tiers).toContain('vip3');
      expect(tiers).not.toContain('vip4');
    });

    it('should return all tiers for VIP9 users', () => {
      const tiers = getAccessibleTiers('vip9');
      expect(tiers).toContain('free');
      expect(tiers).toContain('vip1');
      expect(tiers).toContain('vip6');
      expect(tiers).toContain('vip9');
    });
  });

  describe('validateAccessControl', () => {
    it('should pass all test cases in ACCESS_TEST_MATRIX', () => {
      const result = validateAccessControl();
      expect(result.failed).toBe(0);
      expect(result.passed).toBe(ACCESS_TEST_MATRIX.length);
      expect(result.failures).toHaveLength(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle kids tier correctly', () => {
      expect(canUserAccessRoom('kids_1', 'kids_1')).toBe(true);
      expect(canUserAccessRoom('kids_2', 'kids_1')).toBe(true);
      expect(canUserAccessRoom('kids_1', 'kids_2')).toBe(false);
    });

    it('should treat VIP3 and VIP3ii as same level for most content', () => {
      expect(canUserAccessRoom('vip3', 'vip3')).toBe(true);
      expect(canUserAccessRoom('vip3ii', 'vip3')).toBe(true);
    });
  });

  describe('Generic canAccessTier behavior', () => {
    it('should allow VIP2 to access VIP1 but not VIP3', () => {
      expect(canAccessVIPTier('vip2', 'vip1')).toBe(true);
      expect(canAccessVIPTier('vip2', 'vip3')).toBe(false);
    });

    it('should allow VIP3ii to access both VIP3 and VIP3ii', () => {
      expect(canAccessVIPTier('vip3ii', 'vip3')).toBe(true);
      expect(canAccessVIPTier('vip3ii', 'vip3ii')).toBe(true);
    });

    it('should treat kids_2 as same level as vip2', () => {
      expect(canAccessVIPTier('kids_2', 'vip1')).toBe(true);
      expect(canAccessVIPTier('kids_2', 'vip2')).toBe(true);
      expect(canAccessVIPTier('kids_2', 'vip3')).toBe(false);
    });

    it('should allow VIP9 to access any tier', () => {
      expect(canAccessVIPTier('vip9', 'free')).toBe(true);
      expect(canAccessVIPTier('vip9', 'vip1')).toBe(true);
      expect(canAccessVIPTier('vip9', 'vip6')).toBe(true);
      expect(canAccessVIPTier('vip9', 'vip9')).toBe(true);
      expect(canAccessVIPTier('vip9', 'kids_1')).toBe(true);
      expect(canAccessVIPTier('vip9', 'kids_3')).toBe(true);
    });

    it('should deny free tier from accessing any VIP tier', () => {
      expect(canAccessVIPTier('free', 'vip1')).toBe(false);
      expect(canAccessVIPTier('free', 'vip2')).toBe(false);
      expect(canAccessVIPTier('free', 'kids_1')).toBe(false);
    });
  });
});
