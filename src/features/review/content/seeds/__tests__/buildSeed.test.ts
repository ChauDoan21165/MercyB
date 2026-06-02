import { describe, it, expect } from "vitest";

import { buildSeed } from "../buildSeed";
import type { ReviewCandidate } from "../../validate";

function c(over: Partial<ReviewCandidate>): ReviewCandidate {
  return {
    id: "vi-de:sentence:x",
    flow: "vi-de",
    kind: "sentence",
    front: "Xin chào",
    back: "Hallo",
    cefr: "A1",
    provenance: "adapted",
    source: "german/lessons",
    ...over,
  };
}

describe("buildSeed", () => {
  it("certifies, filters to level, caps at limit, summarizes quarantine", async () => {
    const cands: ReviewCandidate[] = [
      c({ id: "a", front: "một", back: "eins" }),
      c({ id: "b", front: "hai", back: "zwei" }),
      c({ id: "c", front: "ba", back: "drei", cefr: "A2" }), // wrong level → not in seed
      c({ id: "d", front: "你好", back: "你好" }), // FRONT_NOT_VIETNAMESE + script + equals
    ];
    const { seed, quarantine } = await buildSeed(cands, { flow: "vi-de", level: "A1", limit: 1 });

    expect(seed.status).toBe("for-review");
    expect(seed.certifiedTotal).toBe(3); // a, b, c
    expect(seed.certifiedAtLevel).toBe(2); // a, b at A1
    expect(seed.cards).toHaveLength(1); // capped
    expect(seed.cards[0].cefr).toBe("A1");

    expect(quarantine.total).toBe(1); // card d
    expect(Object.keys(quarantine.byReason).length).toBeGreaterThan(0);
  });

  it("requires a round-trip for generated cards (none supplied → quarantined)", async () => {
    const gen = c({ id: "g", flow: "vi-zh", front: "táo", back: "苹果", pronunciation: "píng guǒ", provenance: "generated" });
    const { seed, quarantine } = await buildSeed([gen], { flow: "vi-zh", level: "A1", limit: 5 });
    expect(seed.cards).toHaveLength(0);
    expect(quarantine.byReason.NEEDS_ROUNDTRIP).toBe(1);
  });
});
