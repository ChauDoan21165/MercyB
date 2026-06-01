// Real-content prove-out: the vi→ko A1 seed is genuine — built from the live
// Korean corpus and every seeded card independently passes the gate.

import { describe, it, expect } from "vitest";

import { lessons as koA1 } from "@/languages/korean/lessons-a1";
import { buildKoreanCandidates } from "../../ingestion/koreanLessons";
import { buildSeed } from "../buildSeed";
import { runGate } from "../../validate";
import { backHasRequiredScript, frontLooksVietnamese } from "../../validate";

describe("vi→ko A1 seed (real content)", () => {
  it("produces an A1 seed of certified cards (count clamped to real supply)", async () => {
    const candidates = buildKoreanCandidates(koA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-ko", level: "A1", limit: 20 });

    expect(seed.flow).toBe("vi-ko");
    expect(seed.status).toBe("for-review");
    // Don't pad: the seed holds min(20, certified-at-A1). Assert it's non-empty
    // and never exceeds the actual certified-at-level supply.
    expect(seed.cards.length).toBeGreaterThan(0);
    expect(seed.cards.length).toBe(Math.min(20, seed.certifiedAtLevel));
    expect(seed.cards.length).toBeLessThanOrEqual(20);
  });

  it("every seeded card re-passes the gate and is correctly mapped", async () => {
    const candidates = buildKoreanCandidates(koA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-ko", level: "A1", limit: 20 });

    for (const card of seed.cards) {
      const verdict = await runGate(card);
      expect(verdict.certified, `${card.id} :: ${verdict.reasons}`).toBe(true);
      expect(card.cefr).toBe("A1");
      expect(card.provenance).toBe("adapted");
      expect(card.kind).toBe("sentence");
      expect(frontLooksVietnamese(card.front)).toBe(true);
      expect(backHasRequiredScript("vi-ko", card.back)).toBe(true);
      // vi-ko requires a reading (romaja) — every certified card carries one.
      expect((card.pronunciation ?? "").trim().length).toBeGreaterThan(0);
    }
  });
});
