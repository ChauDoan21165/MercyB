// Tests for the validation gate (DC2).

import { describe, it, expect } from "vitest";

import { runGate, runGateBatch } from "../gate";
import type { ReviewCandidate, RoundTripChecker } from "../gateTypes";

function cand(over: Partial<ReviewCandidate>): ReviewCandidate {
  return {
    id: "vi-de:sentence:x",
    flow: "vi-de",
    kind: "sentence",
    front: "Chào buổi sáng!",
    back: "Guten Morgen!",
    cefr: "A1",
    provenance: "adapted",
    source: "german/lessons",
    ...over,
  };
}

describe("gate — shared checks", () => {
  it("certifies a clean adapted vi→de card", async () => {
    const v = await runGate(cand({}));
    expect(v.certified).toBe(true);
    expect(v.reasons).toEqual([]);
  });

  it("quarantines empty front/back", async () => {
    expect((await runGate(cand({ front: "  " }))).reasons).toContain("EMPTY_FRONT");
    expect((await runGate(cand({ back: "" }))).reasons).toContain("EMPTY_BACK");
  });

  it("quarantines front === back", async () => {
    const v = await runGate(cand({ front: "Hallo", back: "Hallo" }));
    expect(v.reasons).toContain("FRONT_EQUALS_BACK");
  });

  it("quarantines an invalid CEFR tag", async () => {
    const v = await runGate(cand({ cefr: "Z9" as never }));
    expect(v.reasons).toContain("INVALID_CEFR");
  });

  it("quarantines an over-long back", async () => {
    const v = await runGate(cand({ back: "Guten " + "a".repeat(400) }));
    expect(v.reasons).toContain("LENGTH_OUT_OF_RANGE");
  });
});

describe("gate — front must be Vietnamese (mapping guard)", () => {
  it("flags a front that carries target script", async () => {
    const v = await runGate(cand({ front: "おはよう", back: "Guten Morgen" }));
    expect(v.reasons).toContain("FRONT_NOT_VIETNAMESE");
  });
});

describe("gate — per-language back script", () => {
  it("vi→de rejects CJK in the back", async () => {
    const v = await runGate(cand({ flow: "vi-de", back: "你好" }));
    expect(v.reasons).toContain("BACK_WRONG_SCRIPT");
  });

  it("vi→ja requires kana/kanji and a reading", async () => {
    const ok = await runGate(
      cand({ flow: "vi-ja", front: "Cảm ơn", back: "ありがとう", pronunciation: "arigatou" }),
    );
    expect(ok.certified).toBe(true);

    const romajiOnly = await runGate(
      cand({ flow: "vi-ja", front: "Cảm ơn", back: "arigatou", pronunciation: "arigatou" }),
    );
    expect(romajiOnly.reasons).toContain("BACK_WRONG_SCRIPT");

    const noReading = await runGate(
      cand({ flow: "vi-ja", front: "Cảm ơn", back: "ありがとう" }),
    );
    expect(noReading.reasons).toContain("MISSING_READING");
  });

  it("vi→ko requires hangul + a reading", async () => {
    const ok = await runGate(
      cand({ flow: "vi-ko", front: "Xin chào", back: "안녕하세요", pronunciation: "annyeonghaseyo" }),
    );
    expect(ok.certified).toBe(true);

    const noHangul = await runGate(
      cand({ flow: "vi-ko", front: "Xin chào", back: "annyeong", pronunciation: "annyeong" }),
    );
    expect(noHangul.reasons).toContain("BACK_WRONG_SCRIPT");
  });

  it("vi→zh requires hanzi + tone-marked pinyin", async () => {
    const ok = await runGate(
      cand({ flow: "vi-zh", front: "Bạn khỏe không?", back: "你好吗？", pronunciation: "nǐ hǎo ma?" }),
    );
    expect(ok.certified).toBe(true);

    const toneless = await runGate(
      cand({ flow: "vi-zh", front: "Bạn khỏe không?", back: "你好吗？", pronunciation: "ni hao ma" }),
    );
    expect(toneless.reasons).toContain("PINYIN_NO_TONE");

    const numbered = await runGate(
      cand({ flow: "vi-zh", front: "Ba quả táo", back: "三个苹果", pronunciation: "san1 ge4 ping2 guo3" }),
    );
    expect(numbered.certified).toBe(true); // numbered tones accepted
  });

  it("vi→ja flags a romaji that can't come from pure kana", async () => {
    const v = await runGate(
      cand({ flow: "vi-ja", front: "Có", back: "はい", pronunciation: "" }),
    );
    expect(v.reasons).toContain("MISSING_READING");
  });
});

describe("gate — generated cards need a round-trip", () => {
  const okCheck: RoundTripChecker = async () => ({ ok: true, similarity: 0.95 });
  const badCheck: RoundTripChecker = async () => ({ ok: false, similarity: 0.2 });

  it("quarantines generated cards with no checker supplied", async () => {
    const v = await runGate(cand({ provenance: "generated", flow: "vi-zh", back: "苹果", pronunciation: "píng guǒ" }));
    expect(v.reasons).toContain("NEEDS_ROUNDTRIP");
  });

  it("certifies a generated card that passes the round-trip", async () => {
    const v = await runGate(
      cand({ provenance: "generated", flow: "vi-zh", back: "苹果", pronunciation: "píng guǒ" }),
      { roundTrip: okCheck },
    );
    expect(v.certified).toBe(true);
  });

  it("quarantines a generated card that fails the round-trip", async () => {
    const v = await runGate(
      cand({ provenance: "generated", flow: "vi-zh", back: "苹果", pronunciation: "píng guǒ" }),
      { roundTrip: badCheck },
    );
    expect(v.reasons).toContain("ROUNDTRIP_FAILED");
  });

  it("treats a throwing checker as a failure, never a pass", async () => {
    const v = await runGate(
      cand({ provenance: "generated", flow: "vi-zh", back: "苹果", pronunciation: "píng guǒ" }),
      { roundTrip: async () => { throw new Error("MT down"); } },
    );
    expect(v.certified).toBe(false);
    expect(v.reasons).toContain("ROUNDTRIP_FAILED");
  });

  it("does not round-trip adapted cards", async () => {
    const v = await runGate(cand({ provenance: "adapted" })); // no checker
    expect(v.certified).toBe(true);
  });
});

describe("runGateBatch — dedup + partition", () => {
  it("certifies the first id, quarantines later duplicates as DUP_ID", async () => {
    const a = cand({ id: "vi-de:sentence:hallo", back: "Hallo" });
    const b = cand({ id: "vi-de:sentence:hallo", back: "Hallo (again)" });
    const res = await runGateBatch([a, b]);
    expect(res.certified).toHaveLength(1);
    expect(res.quarantined).toHaveLength(1);
    expect(res.quarantined[0].reasons).toContain("DUP_ID");
  });

  it("partitions clean vs failing and preserves order", async () => {
    const good = cand({ id: "vi-de:sentence:g", back: "Danke" });
    const bad = cand({ id: "vi-de:sentence:b", back: "你好" });
    const res = await runGateBatch([good, bad]);
    expect(res.certified.map((c) => c.id)).toEqual(["vi-de:sentence:g"]);
    expect(res.quarantined.map((q) => q.candidate.id)).toEqual(["vi-de:sentence:b"]);
  });

  it("a failed first-seen id does not block a later corrected card", async () => {
    const broken = cand({ id: "vi-de:sentence:x", back: "你好" }); // wrong script
    const fixed = cand({ id: "vi-de:sentence:x", back: "Guten Tag" });
    const res = await runGateBatch([broken, fixed]);
    expect(res.certified.map((c) => c.id)).toEqual(["vi-de:sentence:x"]);
    expect(res.quarantined).toHaveLength(1);
    expect(res.quarantined[0].reasons).not.toContain("DUP_ID");
  });
});
