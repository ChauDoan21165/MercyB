// Integration: the REAL content adapter (default sources) now serves the three
// wired vi→X flows from their reviewed seeds, and still withholds vi→ja.

import { describe, it, expect } from "vitest";

import { createContentAdapter } from "../../contentAdapter";

describe("default content adapter wiring", () => {
  const adapter = createContentAdapter(); // real sources

  it("supports the wired flows incl. vi-de/vi-ko/vi-zh, but NOT vi-ja", () => {
    const flows = adapter.supportedFlows();
    expect(flows).toEqual(expect.arrayContaining(["en-es", "en-vi", "vi-en", "vi-de", "vi-ko", "vi-zh"]));
    expect(flows).not.toContain("vi-ja");
  });

  it.each(["vi-de", "vi-ko", "vi-zh"] as const)(
    "%s serves its reviewed seed (20 well-formed items)",
    async (flow) => {
      const items = await adapter.getItems(flow);
      expect(items).toHaveLength(20);
      for (const it of items) {
        expect(it.flow).toBe(flow);
        expect(it.front.trim().length).toBeGreaterThan(0);
        expect(it.back.trim().length).toBeGreaterThan(0);
      }
    },
  );

  it("vi-ja stays dark until human review (returns [])", async () => {
    expect(await adapter.getItems("vi-ja")).toEqual([]);
  });
});
