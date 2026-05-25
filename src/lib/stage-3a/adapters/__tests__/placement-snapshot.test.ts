import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordPlacementSnapshot, type PlacementSnapshot } from "../placement-snapshot";

const KEY = "mb.stage3a.placement.snapshot";

describe("recordPlacementSnapshot", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("writes the expected shape (completedAt + weaknessTags)", () => {
    recordPlacementSnapshot({
      completedAt: "2026-05-25T10:00:00Z",
      weaknessTags: ["vi_l1_past_ed", "vi_l1_missing_be"],
    });
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PlacementSnapshot;
    expect(stored).toEqual({
      completedAt: "2026-05-25T10:00:00Z",
      weaknessTags: ["vi_l1_past_ed", "vi_l1_missing_be"],
    });
  });

  it("overwrites previous snapshot (single-slot, not history)", () => {
    recordPlacementSnapshot({ completedAt: "2026-04-01T00:00:00Z", weaknessTags: ["vi_l1_old"] });
    recordPlacementSnapshot({ completedAt: "2026-05-25T10:00:00Z", weaknessTags: ["vi_l1_new"] });
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PlacementSnapshot;
    expect(stored.completedAt).toBe("2026-05-25T10:00:00Z");
    expect(stored.weaknessTags).toEqual(["vi_l1_new"]);
  });

  it("filters non-string tags and ignores missing completedAt", () => {
    recordPlacementSnapshot({
      completedAt: "2026-05-25T10:00:00Z",
      weaknessTags: ["good", "", null as unknown as string, 42 as unknown as string],
    });
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as PlacementSnapshot;
    expect(stored.weaknessTags).toEqual(["good"]);

    window.localStorage.clear();
    recordPlacementSnapshot({ completedAt: "", weaknessTags: ["t"] });
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
