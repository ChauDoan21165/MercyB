// Real-content prove-out: the vi→zh A1 seed is built from the live Chinese
// corpus, adaptation-only. NOTE: in the current corpus the A1 lessons carry NO
// Vietnamese gloss (`vi`) on their sentences/vocab — the VI glosses live on the
// B2/C1/C2 rows. So the A1 seed is legitimately small/empty until the A1
// generation gap is filled. We assert the ACTUAL count rather than padding, and
// require that whatever IS seeded independently re-passes the gate.

import { describe, it, expect } from "vitest";

import { lessons as zhA1 } from "@/languages/chinese/lessons-a1";
import { buildChineseCandidates } from "../../ingestion/chineseLessons";
import { buildSeed } from "../buildSeed";
import { runGate } from "../../validate";
import { backHasRequiredScript, frontLooksVietnamese, pinyinHasTone } from "../../validate";

describe("vi→zh A1 seed (real content)", () => {
  it("builds an A1 seed marked for-review (count reflects real vi coverage)", async () => {
    const candidates = buildChineseCandidates(zhA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-zh", level: "A1", limit: 20 });

    expect(seed.flow).toBe("vi-zh");
    expect(seed.status).toBe("for-review");

    // Adaptation-only: the A1 corpus currently has no `vi` glosses on
    // sentences/vocab, so the A1 seed is empty. This is the documented
    // generation gap, not a defect — assert the real count, do NOT pad.
    expect(seed.cards.length).toBe(seed.certifiedAtLevel);
    expect(seed.cards.length).toBe(0);
    expect(seed.certifiedAtLevel).toBe(0);
  });

  it("every seeded A1 card re-passes the gate and is correctly mapped", async () => {
    const candidates = buildChineseCandidates(zhA1);
    const { seed } = await buildSeed(candidates, { flow: "vi-zh", level: "A1", limit: 20 });

    for (const card of seed.cards) {
      const verdict = await runGate(card);
      expect(verdict.certified, `${card.id} :: ${verdict.reasons}`).toBe(true);
      expect(card.cefr).toBe("A1");
      expect(card.provenance).toBe("adapted");
      expect(frontLooksVietnamese(card.front)).toBe(true);
      expect(backHasRequiredScript("vi-zh", card.back)).toBe(true);
      expect(pinyinHasTone(card.pronunciation ?? "")).toBe(true);
    }
  });

  it("proves the adapter DOES certify cards where vi exists (B2 sanity)", async () => {
    // Guard against a false-positive empty A1: confirm the pipeline genuinely
    // certifies adapted vi→zh cards when the source rows carry a vi gloss.
    const { lessons: zhB2 } = await import("@/languages/chinese/lessons-b2");
    const candidates = buildChineseCandidates(zhB2);
    const { seed } = await buildSeed(candidates, { flow: "vi-zh", level: "B2", limit: 20 });

    expect(seed.cards.length).toBeGreaterThan(0);
    for (const card of seed.cards) {
      const verdict = await runGate(card);
      expect(verdict.certified, `${card.id} :: ${verdict.reasons}`).toBe(true);
    }
  });
});
