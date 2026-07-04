import { describe, expect, it } from "vitest";

import {
  inferTierIdFromRoomId,
  isBadAutoTitle,
  prettifyRoomIdEN,
  stripTierSuffix,
} from "@/components/room/roomIdUtils";
import { coreRoomIdFromEffective } from "@/components/room/roomRenderer/helpers";

describe("room id helpers", () => {
  it("strips only trailing level and free tier suffixes", () => {
    expect(stripTierSuffix("ptsd_support_free")).toBe("ptsd_support");
    expect(stripTierSuffix("family_budget_level3")).toBe("family_budget");
    expect(stripTierSuffix("stress_free_breathing")).toBe("stress_free_breathing");
    expect(stripTierSuffix("level1_basics")).toBe("level1_basics");
  });

  it("normalizes uppercase suffixes and surrounding whitespace", () => {
    expect(stripTierSuffix("  PTSD_SUPPORT_FREE  ")).toBe("PTSD_SUPPORT");
    expect(stripTierSuffix("  family_budget_LEVEL3  ")).toBe("family_budget");
    expect(inferTierIdFromRoomId("  FAMILY_BUDGET_LEVEL3  ")).toBe("level3");
    expect(inferTierIdFromRoomId(" PTSD_SUPPORT_FREE ")).toBe("level0");
  });

  it("handles blank room id input without leaking whitespace", () => {
    expect(stripTierSuffix("   ")).toBe("");
    expect(prettifyRoomIdEN("   ")).toBe("Untitled room");
    expect(inferTierIdFromRoomId("   ")).toBeNull();
  });

  it("normalizes repeated separators deterministically", () => {
    expect(stripTierSuffix("room--id__level2")).toBe("room_id");
    expect(stripTierSuffix("__room___id__free__")).toBe("room_id");
    expect(prettifyRoomIdEN("room--id__free")).toBe("Room Id");
    expect(inferTierIdFromRoomId("room--id__level2")).toBe("level2");
  });

  it("normalizes mixed separators before suffix stripping and prettifying", () => {
    expect(stripTierSuffix("  _family--budget   level3_ ")).toBe(
      "family_budget",
    );
    expect(stripTierSuffix("daily---check in__free")).toBe("daily_check_in");
    expect(prettifyRoomIdEN("daily---check in__free")).toBe("Daily Check In");
    expect(inferTierIdFromRoomId("daily---check in__free")).toBe("level0");
  });

  it("treats tier markers as suffix-only", () => {
    expect(stripTierSuffix("free_breathing_level1_intro")).toBe(
      "free_breathing_level1_intro",
    );
    expect(stripTierSuffix("level3_confidence_builder")).toBe(
      "level3_confidence_builder",
    );
    expect(inferTierIdFromRoomId("free_breathing_level1_intro")).toBeNull();
    expect(inferTierIdFromRoomId("level3_confidence_builder")).toBeNull();
  });

  it("keeps tier inference aligned with free suffix stripping", () => {
    expect(inferTierIdFromRoomId("ptsd_support_free")).toBe("level0");
    expect(coreRoomIdFromEffective("ptsd_support_free")).toBe("ptsd_support");
    expect(coreRoomIdFromEffective("family_budget_level3")).toBe("family_budget");
  });

  it("prettifies free room ids without leaking the tier suffix into title text", () => {
    expect(prettifyRoomIdEN("ptsd_support_free")).toBe("Ptsd Support");
  });

  it("treats free-suffixed auto titles as generated titles", () => {
    expect(isBadAutoTitle("ptsd_support_free", "ptsd_support_free")).toBe(true);
    expect(isBadAutoTitle("ptsd_support_free", "ptsd_support")).toBe(true);
    expect(isBadAutoTitle("PTSD support", "ptsd_support_free")).toBe(false);
  });

  it("detects empty, case-variant, and spaced auto titles safely", () => {
    expect(isBadAutoTitle("", "family_budget_level3")).toBe(true);
    expect(isBadAutoTitle("FAMILY_BUDGET_LEVEL3", "family_budget_level3")).toBe(
      true,
    );
    expect(isBadAutoTitle("family_budget", "family_budget_level3")).toBe(true);
    expect(isBadAutoTitle("Family Budget", "family_budget_level3")).toBe(false);
  });

  it("keeps roomIdUtils aligned with RoomRenderer core id extraction", () => {
    const ids = [
      "ptsd_support_free",
      "family_budget_level3",
      "daily_check_in_free",
    ];

    for (const id of ids) {
      expect(stripTierSuffix(id)).toBe(coreRoomIdFromEffective(id));
    }
  });

  it("preserves non-tier words in generated room titles", () => {
    expect(prettifyRoomIdEN("stress_free_breathing")).toBe(
      "Stress Free Breathing",
    );
    expect(prettifyRoomIdEN("level1_basics")).toBe("Level1 Basics");
    expect(prettifyRoomIdEN("free_level_story_level2")).toBe(
      "Free Level Story",
    );
  });
});
