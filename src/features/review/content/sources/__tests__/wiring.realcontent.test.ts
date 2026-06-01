// Integration: the REAL content adapter (default sources) now serves all four
// reviewed vi→X flows from their certified seeds. (vi-ja was wired after its
// romaji was human-corrected.)

import { describe, it, expect } from "vitest";

import { createContentAdapter } from "../../contentAdapter";

describe("default content adapter wiring", () => {
  const adapter = createContentAdapter(); // real sources

  it("supports all 7 flows incl. vi-de/vi-ko/vi-zh/vi-ja", () => {
    const flows = adapter.supportedFlows();
    expect(flows).toEqual(
      expect.arrayContaining([
        "en-es",
        "en-vi",
        "vi-en",
        "vi-de",
        "vi-ko",
        "vi-zh",
        "vi-ja",
      ]),
    );
  });

  // vi-de/ko/ja serve one 20-card seed; vi-zh serves A1 (20) + B2 (20) = 40.
  it.each([
    ["vi-de", 20],
    ["vi-ko", 20],
    ["vi-zh", 40],
    ["vi-ja", 20],
  ] as const)("%s serves its reviewed seed(s) (%i well-formed items)", async (flow, n) => {
    const items = await adapter.getItems(flow);
    expect(items).toHaveLength(n);
    for (const it of items) {
      expect(it.flow).toBe(flow);
      expect(it.front.trim().length).toBeGreaterThan(0);
      expect(it.back.trim().length).toBeGreaterThan(0);
    }
  });

  it("vi-ja items carry a reading with no untransliterated kanji (paren-format aside)", async () => {
    const items = await adapter.getItems("vi-ja");
    for (const it of items) {
      expect(it.pronunciation && it.pronunciation.trim().length).toBeTruthy();
      // No bare kanji in romaji except the "今 (ima)" reading-in-parens format.
      if (it.pronunciation && !it.pronunciation.includes("(")) {
        expect(/[一-鿿]/.test(it.pronunciation)).toBe(false);
      }
    }
  });
});
