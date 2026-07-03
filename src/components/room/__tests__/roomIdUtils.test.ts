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
});
