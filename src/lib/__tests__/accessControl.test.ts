import { describe, it, expect } from "vitest";
import {
  ACCESS_TEST_MATRIX,
  canAccessVIPTier,
  canUserAccessRoom,
  determineAccess,
  getAccessibleTiers,
  validateAccessControl,
} from "../accessControl";

describe("Access Control", () => {
  describe("canUserAccessRoom", () => {
    it("should allow free users to access only free curriculum", () => {
      expect(canUserAccessRoom("free", "free")).toBe(true);
      expect(canUserAccessRoom("free", "vip1")).toBe(false);
      expect(canUserAccessRoom("free", "vip2")).toBe(false);
      expect(canUserAccessRoom("free", "vip3")).toBe(false);
    });

    it("should allow curriculum progression by numeric level", () => {
      expect(canUserAccessRoom("vip2", "free")).toBe(true);
      expect(canUserAccessRoom("vip2", "vip1")).toBe(true);
      expect(canUserAccessRoom("vip2", "vip2")).toBe(true);

      expect(canUserAccessRoom("vip2", "vip3")).toBe(false);
      expect(canUserAccessRoom("vip2", "vip4")).toBe(false);
    });

    it("should allow highest curriculum users to access all curriculum levels", () => {
      expect(canUserAccessRoom("vip9", "free")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip1")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip6")).toBe(true);
      expect(canUserAccessRoom("vip9", "vip9")).toBe(true);
    });

    it("should treat VIP3 II as VIP3 (collapsed upstream)", () => {
      expect(canUserAccessRoom("vip3", "vip3")).toBe(true);
      expect(canUserAccessRoom("vip3", "vip2")).toBe(true);
      expect(canUserAccessRoom("vip3", "vip4")).toBe(false);
    });

    it("should allow kids curriculum to share canonical curriculum level access", () => {
      expect(canUserAccessRoom("kids_1", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_2", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_1", "kids_2")).toBe(false);

      expect(canUserAccessRoom("kids_2", "vip1")).toBe(true);
      expect(canUserAccessRoom("kids_2", "vip2")).toBe(true);
      expect(canUserAccessRoom("kids_2", "vip3")).toBe(false);
    });
  });

  describe("canAccessVIPTier", () => {
    it("should match generic curriculum level comparison", () => {
      expect(canAccessVIPTier("vip3", "vip2")).toBe(true);
      expect(canAccessVIPTier("vip3", "vip4")).toBe(false);
    });

    it("should allow kids tiers to compare by canonical level", () => {
      expect(canAccessVIPTier("kids_2", "vip1")).toBe(true);
      expect(canAccessVIPTier("kids_2", "vip2")).toBe(true);
      expect(canAccessVIPTier("kids_2", "vip3")).toBe(false);
    });
  });

  describe("getAccessibleTiers", () => {
    it("should return only free for free users", () => {
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

    it("should return all curriculum tiers for VIP9 users", () => {
      const tiers = getAccessibleTiers("vip9");
      expect(tiers).toContain("free");
      expect(tiers).toContain("vip1");
      expect(tiers).toContain("vip6");
      expect(tiers).toContain("vip9");
    });
  });

  describe("determineAccess", () => {
    it("should return full access when allowed", () => {
      expect(determineAccess("vip3", "vip2")).toEqual({
        hasFullAccess: true,
        reason: undefined,
      });
    });

    it("should return denied when blocked", () => {
      expect(determineAccess("free", "vip1")).toEqual({
        hasFullAccess: false,
        reason: "ACCESS_DENIED",
      });
    });
  });

  describe("validateAccessControl", () => {
    it("should pass all test cases in ACCESS_TEST_MATRIX", () => {
      const result = validateAccessControl(ACCESS_TEST_MATRIX);

      if (result.failed > 0) {
        const pretty = (() => {
          try {
            return JSON.stringify(result.failures, null, 2);
          } catch {
            return String(result.failures);
          }
        })();

        throw new Error(
          [
            `ACCESS_TEST_MATRIX failed: ${result.failed} case(s)`,
            `passed=${result.passed} total=${ACCESS_TEST_MATRIX.length}`,
            "failures=",
            pretty,
          ].join("\n"),
        );
      }

      expect(result.failed).toBe(0);
      expect(result.passed).toBe(ACCESS_TEST_MATRIX.length);
      expect(result.failures).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should keep free users out of curriculum-gated content", () => {
      expect(canUserAccessRoom("free", "vip1")).toBe(false);
      expect(canUserAccessRoom("free", "vip2")).toBe(false);
      expect(canUserAccessRoom("free", "kids_1")).toBe(false);
    });

    it("should treat VIP3 and VIP3II as same level", () => {
      expect(canUserAccessRoom("vip3", "vip3")).toBe(true);
      expect(canAccessVIPTier("vip3", "vip3")).toBe(true);
    });

    it("should allow VIP9 to access any curriculum tier", () => {
      expect(canAccessVIPTier("vip9", "free")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip1")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip6")).toBe(true);
      expect(canAccessVIPTier("vip9", "vip9")).toBe(true);
    });
  });
});