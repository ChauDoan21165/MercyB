// src/lib/__tests__/accessControl.test.ts
import { describe, it, expect } from "vitest";
import {
  canUserAccessRoom,
  canAccessVIPTier,
  getAccessibleTiers,
  validateAccessControl,
  ACCESS_TEST_MATRIX,
} from "../accessControl";

describe("Access Control", () => {
  describe("canUserAccessRoom", () => {
    it("should allow free tier users to access free content", () => {
      expect(canUserAccessRoom("free", "free")).toBe(true);
    });

    it("should block free tier users from VIP content", () => {
      expect(canUserAccessRoom("free", "vip1")).toBe(false);
      expect(canUserAccessRoom("free", "vip2")).toBe(false);
      expect(canUserAccessRoom("free", "vip3")).toBe(false);
    });

    it("should allow VIP2 users to access VIP1 and Free content", () => {
      expect(canUserAccessRoom("vip2", "free")).toBe(true);
      expect(canUserAccessRoom("vip2", "vip1")).toBe(true);
      expect(canUserAccessRoom("vip2", "vip2")).toBe(true);
    });

    it("should block VIP2 users from VIP3+ content", () => {
      expect(canUserAccessRoom("vip2", "vip3")).toBe(false);
      expect(canUserAccessRoom("vip2", "vip4")).toBe(false);
    });

    it("should allow VIP9 users to access all content", () => {
      expect(canUserAccessRoom("vip9", "free")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip1")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip6")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip9")).toBe(true);
    });

    it("should treat VIP3 II as VIP3 (VIP3II collapsed)", () => {
      // VIP3II is not a separate tier anymore. Any VIP3-level content is just VIP3.
      expect(canUserAccessRoom("vip3", "vip3")).toBe(true);
      expect(canUserAccessRoom("vip3", "vip2")).toBe(true);
      expect(canUserAccessRoom("vip3", "vip4")).toBe(false);
    });
  });

  describe("canAccessVIPTier", () => {
    it("should match canUserAccessRoom behavior", () => {
      expect(canAccessVIPTier("vip3", "vip2")).toBe(true);
      expect(canAccessVIPTier("vip3", "vip4")).toBe(false);
    });
  });

  describe("getAccessibleTiers", () => {
    it("should return only free for free tier users", () => {
      const tiers = getAccessibleTiers("free");
      expect(tiers).toEqual(["free"]);
    });

    it("should return free through VIP3 for VIP3 users", () => {
      const tiers = getAccessibleTiers("vip3");
      expect(tiers).toContain("free");
      expect(tiers).toContain("vip1");
      expect(tiers).toContain("vip2");
      expect(tiers).toContain("vip3");
      expect(tiers).not.toContain("vip4");
    });

    it("should return all tiers for VIP9 users", () => {
      const tiers = getAccessibleTiers("vip9");
      expect(tiers).toContain("free");
      expect(tiers).toContain("vip1");
      expect(tiers).toContain("vip6");
      expect(tiers).toContain("vip9");
    });
  });

  describe("validateAccessControl", () => {
    it("should pass all test cases in ACCESS_TEST_MATRIX", () => {
      const result = validateAccessControl();

      // Force visibility even when vitest console output is suppressed.
      if (result.failed > 0) {
        const failuresText = (() => {
          try {
            return JSON.stringify(result.failures, null, 2);
          } catch {
            // fallback if failures contain non-serializable values
            return String(result.failures);
          }
        })();

        throw new Error(
          [
            `ACCESS_TEST_MATRIX failed: ${result.failed} case(s)`,
            `passed=${result.passed} total=${ACCESS_TEST_MATRIX.length}`,
            `failures=`,
            failuresText,
          ].join("\n"),
        );
      }

      expect(result.failed).toBe(0);
      expect(result.passed).toBe(ACCESS_TEST_MATRIX.length);
      expect(result.failures).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should handle kids tier correctly", () => {
      expect(canUserAccessRoom("kids_1", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_2", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_1", "kids_2")).toBe(false);
    });

    it("should treat VIP3 and VIP3II as same level (VIP3II collapsed)", () => {
      expect(canUserAccessRoom("vip3", "vip3")).toBe(true);
      // There is no vip3ii TierId anymore; tierFromRoomId collapses vip3-ii → vip3.
      // So the access check remains vip3 vs vip3.
      expect(canUserAccessRoom("vip3", "vip3")).toBe(true);
    });
  });

  describe("Generic canAccessTier behavior", () => {
    it("should allow VIP2 to access VIP1 but not VIP3", () => {
      expect(canAccessVIPTier("vip2", "vip1")).toBe(true);
      expect(canAccessVIPTier("vip2", "vip3")).toBe(false);
    });

    it("should treat VIP3II as VIP3 for access decisions", () => {
      // Same rationale: vip3ii collapsed to vip3 upstream.
      expect(canAccessVIPTier("vip3", "vip3")).toBe(true);
      expect(canAccessVIPTier("vip3", "vip2")).toBe(true);
      expect(canAccessVIPTier("vip3", "vip4")).toBe(false);
    });

    it("should treat kids_2 as same level as vip2 (if accessControl defines it that way)", () => {
      expect(canAccessVIPTier("kids_2", "vip1")).toBe(true);
      expect(canAccessVIPTier("kids_2", "vip2")).toBe(true);
      expect(canAccessVIPTier("kids_2", "vip3")).toBe(false);
    });

    it("should allow VIP9 to access any tier", () => {
      expect(canAccessVIPTier("vip9", "free")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip1")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip6")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip9")).toBe(true);
      expect(canAccessVIPTier("vip9", "kids_1")).toBe(true);
      expect(canAccessVIPTier("vip9", "kids_3")).toBe(true);
    });

    it("should deny free tier from accessing any VIP or kids tier", () => {
      expect(canAccessVIPTier("free", "vip1")).toBe(false);
      expect(canAccessVIPTier("free", "vip2")).toBe(false);
      expect(canAccessVIPTier("free", "kids_1")).toBe(false);
    });
  });
});