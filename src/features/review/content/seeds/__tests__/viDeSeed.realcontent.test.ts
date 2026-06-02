// Real-content prove-out: the vi→de A1 seed is genuine — built from the live
// German corpus and every seeded card independently passes the gate.

import { describe, it, expect } from "vitest";

import { lessons as deA1 } from "@/languages/german/lessons-a1";
import { buildGermanCandidates } from "../../ingestion/germanLessons";
import { buildSeed } from "../buildSeed";
import { runGate } from "../../validate";
import { backHasRequiredScript, frontLooksVietnamese } from "../../validate";

describe("vi→de A1 seed (real content)", () => {
  it("produces a full 20-card A1 seed of certified cards", async () => {
    const candidates = buildGermanCandidates(deA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-de", level: "A1", limit: 20 });

    expect(seed.flow).toBe("vi-de");
    expect(seed.status).toBe("for-review");
    expect(seed.cards).toHaveLength(20);
    expect(seed.certifiedAtLevel).toBeGreaterThanOrEqual(20);
  });

  it("every seeded card re-passes the gate and is correctly mapped", async () => {
    const candidates = buildGermanCandidates(deA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-de", level: "A1", limit: 20 });

    for (const card of seed.cards) {
      const verdict = await runGate(card);
      expect(verdict.certified, `${card.id} :: ${verdict.reasons}`).toBe(true);
      expect(card.cefr).toBe("A1");
      expect(card.provenance).toBe("adapted");
      expect(frontLooksVietnamese(card.front)).toBe(true);
      expect(backHasRequiredScript("vi-de", card.back)).toBe(true);
    }
  });
});
