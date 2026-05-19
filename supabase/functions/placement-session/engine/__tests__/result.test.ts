// supabase/functions/placement-session/engine/__tests__/result.test.ts
//
// Golden tests for PR 8 result assembly. SessionState is constructed
// directly (the minimal-state house style of terminator/session tests)
// so every payload field is an exact golden. Covers: the cefrForTheta
// exclusive-edge contract, the terminating→complete guard, overall /
// itemsAdministered / elapsed / retest / terminationReason, per-skill
// reportability, the L1 severity bands + min-seen floor + ordering, and
// growth. vitest owns this file.

import { describe, expect, it } from "vitest";

import { buildItemBank } from "../itemBank";
import { assembleResult, cefrForTheta, type ResultDeps } from "../result";
import type {
  Item,
  ItemType,
  L1TransferTag,
  PlacementHistoryEntry,
  Response,
  SessionState,
  ThetaEstimate,
} from "../../types";

const META: Item["meta"] = {
  author: "t",
  cefrDescriptor: "x",
  paramSource: "expert",
  displayPreference: "en_first",
};

function mkItem(
  id: string,
  type: Exclude<ItemType, "writing_sample">,
  l1Tags?: L1TransferTag[],
): Item {
  return {
    id,
    type,
    cefr: "B1",
    difficulty: 0,
    discrimination: 1,
    skill: type,
    prompt: { en: "Q?", vi: "Câu?" },
    options: [
      { id: "a", en: "x", vi: "x" },
      { id: "b", en: "y", vi: "y" },
    ],
    correctOptionId: "a",
    ...(l1Tags ? { l1Tags } : {}),
    ...(type === "reading" ? { passage: { en: "p", vi: "p" } } : {}),
    meta: META,
  };
}

const T0 = "2026-05-18T10:00:00.000Z";
const plusMin = (iso: string, m: number) =>
  new Date(Date.parse(iso) + m * 60_000).toISOString();

function mkResp(itemId: string, correct: boolean): Response {
  return {
    itemId,
    correct,
    responseMs: 3000,
    timedOut: false,
    l1RevealedUsed: false,
    shownAt: T0,
    answeredAt: plusMin(T0, 1),
  };
}

// rd1..rd4 → article_use ; vo1..vo4 → false_friend ; gr1 → preposition.
const bank = buildItemBank(
  [
    mkItem("rd1", "reading", ["article_use"]),
    mkItem("rd2", "reading", ["article_use"]),
    mkItem("rd3", "reading", ["article_use"]),
    mkItem("rd4", "reading", ["article_use"]),
    mkItem("vo1", "vocabulary", ["false_friend"]),
    mkItem("vo2", "vocabulary", ["false_friend"]),
    mkItem("vo3", "vocabulary", ["false_friend"]),
    mkItem("vo4", "vocabulary", ["false_friend"]),
    mkItem("gr1", "grammar", ["preposition_transfer"]),
  ],
  "bank.res.1",
).bank;

const ADMINISTERED: Response[] = [
  mkResp("rd1", false),
  mkResp("rd2", false),
  mkResp("rd3", false),
  mkResp("rd4", true), // article_use: seen4 correct1 er .75
  mkResp("vo1", false),
  mkResp("vo2", true),
  mkResp("vo3", true),
  mkResp("vo4", true), // false_friend: seen4 correct3 er .25
  mkResp("gr1", false), // preposition: seen1 correct0 er 1.0 (floor → low)
];

function terminatingSession(over: Partial<SessionState> = {}): SessionState {
  const current: ThetaEstimate = {
    theta: 0.8, // < 1.5 ⇒ B2
    se: 0.28,
    method: "eap",
    iterations: 0,
    converged: true,
  };
  return {
    sessionId: "sess-res",
    userId: "u",
    bankVersion: "bank.res.1",
    phase: "terminating",
    selfRating: "intermediate",
    priorMean: 0,
    administered: ADMINISTERED,
    servedItemIds: bank.items.map((i) => i.id), // all served ⇒ bank_exhausted
    current,
    currentItemId: null,
    typeCounts: {
      reading: 4,
      listening: 0,
      grammar: 1,
      vocabulary: 4,
      writing_sample: 0,
    },
    startedAt: T0,
    updatedAt: plusMin(T0, 20),
    ...over,
  };
}

const deps = (over: Partial<ResultDeps> = {}): ResultDeps => ({
  now: () => plusMin(T0, 20),
  recommendedRoomFor: (cefr) => `room:${cefr}`,
  ...over,
});

describe("cefrForTheta — exclusive upper-edge contract", () => {
  it("maps θ to the first band whose maxTheta it falls under", () => {
    expect(cefrForTheta(-3)).toBe("pre_a1");
    expect(cefrForTheta(-2.5)).toBe("A1"); // edge is exclusive
    expect(cefrForTheta(-0.5)).toBe("B1"); // exclusive
    expect(cefrForTheta(0)).toBe("B1");
    expect(cefrForTheta(0.5)).toBe("B2"); // exclusive
    expect(cefrForTheta(2.5)).toBe("C2"); // exclusive
    expect(cefrForTheta(99)).toBe("C2"); // unbounded last band
  });
});

describe("assembleResult — guard", () => {
  it("non-terminating phase → no-op, same session ref, result null", () => {
    const s = terminatingSession({ phase: "in_progress" });
    const out = assembleResult(s, bank, deps());
    expect(out.session).toBe(s);
    expect(out.result).toBeNull();
  });
});

describe("assembleResult — payload", () => {
  it("overall / itemsAdministered / elapsed / retest / termination + phase→complete", () => {
    const { session, result } = assembleResult(
      terminatingSession(),
      bank,
      deps(),
    );
    expect(result).not.toBeNull();
    const r = result!;

    expect(session.phase).toBe("complete");
    expect(session.updatedAt).toBe(plusMin(T0, 20));

    expect(r.overall).toEqual({ cefr: "B2", theta: 0.8, se: 0.28 });
    expect(r.recommendedRoomId).toBe("room:B2"); // injected map
    expect(r.itemsAdministered).toBe(9); // scored count
    expect(r.elapsedMs).toBe(20 * 60_000);
    expect(r.terminationReason).toBe("bank_exhausted"); // re-derived
    expect(r.retest).toEqual({
      eligibleAt: new Date(
        Date.parse(plusMin(T0, 20)) + 90 * 86_400_000,
      ).toISOString(),
      rationale: "retest_cooldown_90d",
    });
    expect(r.createdAt).toBe(plusMin(T0, 20));
    expect(r.sessionId).toBe("sess-res");
    expect(r.bankVersion).toBe("bank.res.1");
  });

  it("perSkill: reportable only at ≥ MIN_ITEMS_PER_SUBSCORE; else θ/se null", () => {
    const { result } = assembleResult(terminatingSession(), bank, deps());
    const by = Object.fromEntries(
      result!.perSkill.map((p) => [p.skill, p]),
    );
    expect(by.reading.itemsSeen).toBe(4);
    expect(by.reading.reportable).toBe(true);
    expect(typeof by.reading.theta).toBe("number");
    expect(Number.isFinite(by.reading.se)).toBe(true);

    expect(by.vocabulary.reportable).toBe(true);
    expect(by.grammar).toMatchObject({
      itemsSeen: 1,
      reportable: false,
      theta: null,
      se: null,
    });
    expect(by.listening).toMatchObject({
      itemsSeen: 0,
      reportable: false,
      theta: null,
    });
  });

  it("l1Weaknesses: severity bands + min-seen floor, ordered by errorRate desc", () => {
    const { result } = assembleResult(terminatingSession(), bank, deps());
    expect(result!.l1Weaknesses).toEqual([
      // errorRate 1.0 but seen 1 < L1_WEAKNESS_MIN_SEEN ⇒ floored to low
      {
        tag: "preposition_transfer",
        seen: 1,
        correct: 0,
        errorRate: 1,
        severity: "low",
      },
      // seen4 correct1 ⇒ .75 ≥ HIGH
      {
        tag: "article_use",
        seen: 4,
        correct: 1,
        errorRate: 0.75,
        severity: "high",
      },
      // seen4 correct3 ⇒ .25 ≥ MODERATE
      {
        tag: "false_friend",
        seen: 4,
        correct: 3,
        errorRate: 0.25,
        severity: "moderate",
      },
    ]);
  });
});

describe("assembleResult — growth", () => {
  const prev: PlacementHistoryEntry = {
    ts: "2026-01-01T00:00:00.000Z",
    bankVersion: "b",
    theta: -0.5,
    se: 0.4,
    cefr: "A2",
    perSkill: {},
    l1Top: [],
    sessionId: "old",
  };

  it("prior history with a θ ⇒ delta + narrativeKey by sign", () => {
    const { result } = assembleResult(
      terminatingSession(),
      bank,
      deps({ previous: prev }),
    );
    expect(result!.growth).toEqual({
      fromCefr: "A2",
      toCefr: "B2",
      deltaTheta: 0.8 - -0.5,
      sinceISO: "2026-01-01T00:00:00.000Z",
      narrativeKey: "growth_up",
    });
  });

  it("no prior history ⇒ null", () => {
    expect(
      assembleResult(terminatingSession(), bank, deps()).result!.growth,
    ).toBeNull();
  });

  it("prior v1 backfill row (theta null) ⇒ null (no spurious delta)", () => {
    const { result } = assembleResult(
      terminatingSession(),
      bank,
      deps({ previous: { ...prev, theta: null, se: null } }),
    );
    expect(result!.growth).toBeNull();
  });
});
