import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { recordL1Tag, type L1RecentEntry } from "../l1-recent";

const KEY = "mb.stage3a.l1.recent";

describe("recordL1Tag", () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => window.localStorage.clear());

  it("writes a single entry with the expected shape", () => {
    recordL1Tag("vi_l1_3rd_person_s", 1_779_700_000_000);
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as L1RecentEntry[];
    expect(stored).toEqual([{ tag: "vi_l1_3rd_person_s", t: 1_779_700_000_000 }]);
  });

  it("appends to existing buffer and trims to cap (20)", () => {
    for (let i = 0; i < 25; i++) recordL1Tag(`tag_${i}`, 1_779_700_000_000 + i);
    const stored = JSON.parse(window.localStorage.getItem(KEY)!) as L1RecentEntry[];
    expect(stored).toHaveLength(20);
    expect(stored[0].tag).toBe("tag_5");           // first 5 evicted
    expect(stored[19].tag).toBe("tag_24");
  });

  it("ignores empty tag and tolerates localStorage throws", () => {
    recordL1Tag("");
    expect(window.localStorage.getItem(KEY)).toBeNull();
  });
});
