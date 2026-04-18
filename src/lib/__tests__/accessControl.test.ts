// Path: src/lib/__tests__/accessControl.test.ts

import { describe, it, expect } from "vitest";
import {
  ACCESS_TEST_MATRIX,
  canAccessVIPTier,
  canUserAccessRoom,
  determineAccess,
  getAccessibleTiers,
  validateAccessControl,
} from "../accessControl";

const OPEN_ACCESS_TIERS = [
  "level0",
  "level1",
  "level2",
  "level3",
  "level4",
  "level5",
  "level6",
  "level7",
  "level8",
  "level9",
  "kids_1",
  "kids_2",
  "kids_3",
] as const;

const OPEN_ACCESS_MATRIX = ACCESS_TEST_MATRIX.map((entry) => ({
  ...entry,
  expected: true,
}));

describe("Access Control", () => {
  describe("canUserAccessRoom", () => {
    it("should allow level0 users to access all curriculum levels", () => {
      expect(canUserAccessRoom("level0", "level0")).toBe(true);
      expect(canUserAccessRoom("level0", "level1")).toBe(true);
      expect(canUserAccessRoom("level0", "level2")).toBe(true);
      expect(canUserAccessRoom("level0", "level3")).toBe(true);
    });

    it("should allow access across numeric curriculum levels", () => {
      expect(canUserAccessRoom("level2", "level0")).toBe(true);
      expect(canUserAccessRoom("level2", "level1")).toBe(true);
      expect(canUserAccessRoom("level2", "level2")).toBe(true);
      expect(canUserAccessRoom("level2", "level3")).toBe(true);
      expect(canUserAccessRoom("level2", "level4")).toBe(true);
    });

    it("should allow highest curriculum users to access all curriculum levels", () => {
      expect(canUserAccessRoom("level9", "level0")).toBe(true);
      expect(canUserAccessRoom("level9", "level1")).toBe(true);
      expect(canUserAccessRoom("level9", "level6")).toBe(true);
      expect(canUserAccessRoom("level9", "level9")).toBe(true);
    });

    it("should treat Level 3 II as Level 3 (collapsed upstream)", () => {
      expect(canUserAccessRoom("level3", "level3")).toBe(true);
      expect(canUserAccessRoom("level3", "level2")).toBe(true);
      expect(canUserAccessRoom("level3", "level4")).toBe(true);
    });

    it("should allow kids curriculum to share canonical curriculum room access", () => {
      expect(canUserAccessRoom("kids_1", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_2", "kids_1")).toBe(true);
      expect(canUserAccessRoom("kids_1", "kids_2")).toBe(true);

      expect(canUserAccessRoom("kids_2", "level1")).toBe(true);
      expect(canUserAccessRoom("kids_2", "level2")).toBe(true);
      expect(canUserAccessRoom("kids_2", "level3")).toBe(true);
    });
  });

  describe("canAccessVIPTier", () => {
    it("should match generic curriculum level comparison", () => {
      expect(canAccessVIPTier("level3", "level2")).toBe(true);
      expect(canAccessVIPTier("level3", "level4")).toBe(false);
    });

    it("should allow kids tiers to compare by canonical level", () => {
      expect(canAccessVIPTier("kids_2", "level1")).toBe(true);
      expect(canAccessVIPTier("kids_2", "level2")).toBe(true);
      expect(canAccessVIPTier("kids_2", "level3")).toBe(false);
    });
  });

  describe("getAccessibleTiers", () => {
    it("should return all curriculum tiers for level0 users", () => {
      const tiers = getAccessibleTiers("level0");
      expect(tiers).toEqual([...OPEN_ACCESS_TIERS]);
    });

    it("should return all curriculum tiers for Level 3 users", () => {
      const tiers = getAccessibleTiers("level3");
      expect(tiers).toEqual([...OPEN_ACCESS_TIERS]);
    });

    it("should return all curriculum tiers for Level 9 users", () => {
      const tiers = getAccessibleTiers("level9");
      expect(tiers).toEqual([...OPEN_ACCESS_TIERS]);
    });
  });

  describe("determineAccess", () => {
    it("should return full access when allowed", () => {
      expect(determineAccess("level3", "level2")).toEqual({
        hasFullAccess: true,
        reason: undefined,
      });
    });

    it("should return full access for previously blocked curriculum combinations", () => {
      expect(determineAccess("level0", "level1")).toEqual({
        hasFullAccess: true,
        reason: undefined,
      });
    });
  });

  describe("validateAccessControl", () => {
    it("should pass all test cases in the open-access matrix", () => {
      const result = validateAccessControl(OPEN_ACCESS_MATRIX);

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
            `OPEN_ACCESS_MATRIX failed: ${result.failed} case(s)`,
            `passed=${result.passed} total=${OPEN_ACCESS_MATRIX.length}`,
            "failures=",
            pretty,
          ].join("\n"),
        );
      }

      expect(result.failed).toBe(0);
      expect(result.passed).toBe(OPEN_ACCESS_MATRIX.length);
      expect(result.failures).toHaveLength(0);
    });
  });

  describe("Edge Cases", () => {
    it("should keep level0 users inside open access for curriculum-gated content", () => {
      expect(canUserAccessRoom("level0", "level1")).toBe(true);
      expect(canUserAccessRoom("level0", "level2")).toBe(true);
      expect(canUserAccessRoom("level0", "kids_1")).toBe(true);
    });

    it("should treat Level 3 and VIP3II as same level", () => {
      expect(canUserAccessRoom("level3", "level3")).toBe(true);
      expect(canAccessVIPTier("level3", "level3")).toBe(true);
    });

    it("should allow Level 9 to access any curriculum tier", () => {
      expect(canAccessVIPTier("level9", "level0")).toBe(true);
      expect(canAccessVIPTier("level9", "level1")).toBe(true);
      expect(canAccessVIPTier("level9", "level6")).toBe(true);
      expect(canAccessVIPTier("level9", "level9")).toBe(true);
    });
  });
});