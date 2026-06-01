import { describe, it, expect } from "vitest";
import { generateCandidates } from "../generator";
import type { RawGenItem } from "../generator";
import { staticTranslator } from "../translator";
import { makeRoundTripChecker } from "../roundTrip";
import { runGate, runGateBatch } from "../../validate";

// A deterministic fake Translator: target → vi (to generate front), vi → target
// (for the round-trip back-check). Pure kana keeps the ja romaji check decisive.
const toVi = new Map<string, string>([
  ["ねこ", "con mèo"],
  ["いぬ", "con chó"],
]);
const fromVi = new Map<string, string>([
  ["con mèo", "ねこ"],
  ["con chó", "いぬ"],
]);
const translator = staticTranslator(toVi, fromVi);

describe("generateCandidates", () => {
  it("stamps provenance and builds namespaced ids; generates front + ja romaji", async () => {
    const raw: RawGenItem[] = [
      { flow: "vi-ja", kind: "vocab", back: "ねこ", cefr: "A1", source: "japanese/test" },
    ];
    const [c] = await generateCandidates(raw, { translator });
    expect(c.provenance).toBe("generated");
    expect(c.front).toBe("con mèo"); // generated via toVietnamese
    expect(c.back).toBe("ねこ");
    expect(c.pronunciation).toBe("neko"); // derived via wanakana
    expect(c.id).toBe("vi-ja:vocab:con-meo");
    expect(c.cefr).toBe("A1");
    expect(c.source).toBe("japanese/test");
  });

  it("keeps a pre-authored front verbatim (skips toVietnamese)", async () => {
    const raw: RawGenItem[] = [
      {
        flow: "vi-ja",
        kind: "vocab",
        back: "ねこ",
        front: "mèo (đã gloss tay)",
        cefr: "A1",
        source: "japanese/test",
      },
    ];
    const [c] = await generateCandidates(raw, { translator });
    expect(c.front).toBe("mèo (đã gloss tay)");
  });

  it("zh/ko: no deterministic reading → left undefined unless supplied", async () => {
    const zhT = staticTranslator(
      new Map([["猫", "con mèo"]]),
      new Map([["con mèo", "猫"]]),
    );
    const raw: RawGenItem[] = [
      { flow: "vi-zh", kind: "vocab", back: "猫", cefr: "A1", source: "chinese/test" },
    ];
    const [c] = await generateCandidates(raw, { translator: zhT });
    expect(c.pronunciation).toBeUndefined();

    const raw2: RawGenItem[] = [
      { flow: "vi-zh", kind: "vocab", back: "猫", reading: "māo", cefr: "A1", source: "chinese/test" },
    ];
    const [c2] = await generateCandidates(raw2, { translator: zhT });
    expect(c2.pronunciation).toBe("māo");
  });

  it("skips ungoverned flows rather than throwing", async () => {
    const raw: RawGenItem[] = [
      { flow: "vi-en", kind: "vocab", back: "cat", cefr: "A1", source: "x" },
    ];
    const out = await generateCandidates(raw, { translator });
    expect(out).toEqual([]);
  });

  it("output is gate-CERTIFIABLE when paired with makeRoundTripChecker(fake)", async () => {
    const raw: RawGenItem[] = [
      { flow: "vi-ja", kind: "vocab", back: "ねこ", cefr: "A1", source: "japanese/test" },
    ];
    const [c] = await generateCandidates(raw, { translator });
    const verdict = await runGate(c, { roundTrip: makeRoundTripChecker(translator) });
    expect(verdict.reasons).toEqual([]);
    expect(verdict.certified).toBe(true);
  });

  it("a bad back-translation quarantines ROUNDTRIP_FAILED", async () => {
    // fromVi maps the generated front to the WRONG kana → low similarity.
    const liar = staticTranslator(
      new Map([["ねこ", "con mèo"]]),
      new Map([["con mèo", "いぬ"]]),
    );
    const [c] = await generateCandidates(
      [{ flow: "vi-ja", kind: "vocab", back: "ねこ", cefr: "A1", source: "japanese/test" }],
      { translator: liar },
    );
    const verdict = await runGate(c, { roundTrip: makeRoundTripChecker(liar) });
    expect(verdict.certified).toBe(false);
    expect(verdict.reasons).toContain("ROUNDTRIP_FAILED");
  });

  it("generated card without a round-trip checker → NEEDS_ROUNDTRIP", async () => {
    const [c] = await generateCandidates(
      [{ flow: "vi-ja", kind: "vocab", back: "ねこ", cefr: "A1", source: "japanese/test" }],
      { translator },
    );
    const verdict = await runGate(c); // no roundTrip opt
    expect(verdict.reasons).toContain("NEEDS_ROUNDTRIP");
  });

  it("batch certifies clean generated cards through the gate", async () => {
    const raw: RawGenItem[] = [
      { flow: "vi-ja", kind: "vocab", back: "ねこ", cefr: "A1", source: "japanese/test" },
      { flow: "vi-ja", kind: "vocab", back: "いぬ", cefr: "A1", source: "japanese/test" },
    ];
    const cands = await generateCandidates(raw, { translator });
    const { certified, quarantined } = await runGateBatch(cands, {
      roundTrip: makeRoundTripChecker(translator),
    });
    expect(quarantined).toEqual([]);
    expect(certified.length).toBe(2);
  });
});
