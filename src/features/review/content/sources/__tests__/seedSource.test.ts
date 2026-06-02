import { describe, it, expect } from "vitest";

import { createSeedSource, type SeedLike } from "../seedSource";
import type { ReviewCandidate } from "../../validate";

const seed: SeedLike = {
  flow: "vi-de",
  cards: [
    {
      id: "vi-de:sentence:xin-chao",
      flow: "vi-de",
      kind: "sentence",
      front: "Xin chào",
      back: "Hallo",
      noteVi: "ha-lô",
      cefr: "A1",
      provenance: "adapted",
      source: "german/lessons",
    } as ReviewCandidate,
  ],
};

describe("createSeedSource", () => {
  const src = createSeedSource("seed:vi-de", "vi-de", seed);

  it("declares only its flow", () => {
    expect(src.flows()).toEqual(["vi-de"]);
  });

  it("projects seed cards onto ReviewItem (drops cefr/provenance)", () => {
    const items = src.items("vi-de");
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      id: "vi-de:sentence:xin-chao",
      flow: "vi-de",
      front: "Xin chào",
      back: "Hallo",
      noteVi: "ha-lô",
      source: "german/lessons",
    });
    expect((items[0] as unknown as Record<string, unknown>).cefr).toBeUndefined();
    expect((items[0] as unknown as Record<string, unknown>).provenance).toBeUndefined();
  });

  it("returns [] for any other flow", () => {
    expect(src.items("vi-ja")).toEqual([]);
  });
});
