// Real-content prove-out: the vi→zh A1 seed is genuine — built from the live
// Chinese A1 corpus (authored vi gloss + source tone-marked pinyin), and every
// seeded card independently re-passes the gate WITH the round-trip checker.
//
// HONESTY: these cards are generated/authored, status "for-review", NOT wired
// live (vi-zh stays live at B2 only). The test certifies the gate would accept
// them, not that a human has reviewed them.

import { describe, it, expect } from "vitest";

import {
  RAW_ITEMS,
  toVi,
  fromVi,
} from "../../ingestion/chineseSeedA1.authored";
import {
  generateCandidates,
  makeRoundTripChecker,
  staticTranslator,
} from "../../generate";
import { buildSeed } from "../buildSeed";
import { runGate } from "../../validate";
import {
  backHasRequiredScript,
  frontLooksVietnamese,
  hasHanzi,
  pinyinHasTone,
} from "../../validate";

const translator = staticTranslator(toVi, fromVi);
const roundTrip = makeRoundTripChecker(translator);
const GATE_OPTS = { roundTrip, roundTripThreshold: 0.6 } as const;

async function buildZhA1Seed() {
  const candidates = await generateCandidates(RAW_ITEMS, { translator });
  return buildSeed(candidates, {
    flow: "vi-zh",
    level: "A1",
    limit: 20,
    ...GATE_OPTS,
  });
}

describe("vi→zh A1 seed (real content, generated + round-trip certified)", () => {
  it("produces an A1 seed of >= 15 certified cards (aim 20), for-review", async () => {
    const { seed } = await buildZhA1Seed();

    expect(seed.flow).toBe("vi-zh");
    expect(seed.level).toBe("A1");
    expect(seed.status).toBe("for-review");
    expect(seed.cards.length).toBeGreaterThanOrEqual(15);
    expect(seed.cards.length).toBe(Math.min(20, seed.certifiedAtLevel));
    expect(seed.cards.length).toBeLessThanOrEqual(20);
  });

  it("every seeded card re-passes the gate WITH the round-trip checker", async () => {
    const { seed } = await buildZhA1Seed();

    for (const card of seed.cards) {
      const verdict = await runGate(card, GATE_OPTS);
      expect(verdict.certified, `${card.id} :: ${verdict.reasons}`).toBe(true);
      expect(card.cefr).toBe("A1");
      expect(card.provenance).toBe("generated");
      // back carries hanzi; front is Vietnamese (no hanzi)
      expect(hasHanzi(card.back)).toBe(true);
      expect(backHasRequiredScript("vi-zh", card.back)).toBe(true);
      expect(frontLooksVietnamese(card.front)).toBe(true);
      expect(hasHanzi(card.front)).toBe(false);
      // vi-zh requires a tone-marked pinyin reading — every certified card has one
      expect((card.pronunciation ?? "").trim().length).toBeGreaterThan(0);
      expect(pinyinHasTone(card.pronunciation ?? "")).toBe(true);
    }
  });

  it("WITHOUT a round-trip checker the generated cards quarantine (NEEDS_ROUNDTRIP)", async () => {
    // Guards the honesty claim: these are generated, not adapted — they cannot
    // certify on structural checks alone.
    const candidates = await generateCandidates(RAW_ITEMS, { translator });
    const { seed } = await buildSeed(candidates, { flow: "vi-zh", level: "A1", limit: 20 });
    expect(seed.cards.length).toBe(0);
  });
});
