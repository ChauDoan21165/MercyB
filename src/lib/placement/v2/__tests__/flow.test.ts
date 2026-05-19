// src/lib/placement/v2/__tests__/flow.test.ts
//
// Lifecycle goldens for PR 10's pure flow controller. A scripted fake
// `PlacementClient` (no network) drives every branch: self-rating gate,
// the answer loop → result, resume-as-continuation (flag #3), the dedup
// no-op, terminating→auto-finalize, error propagation, abandon. flow.ts
// is client.ts's only stateful caller, so this is also what proves
// client.ts is not dead wiring. Deterministic — the locked DI discipline.

import { describe, expect, it } from "vitest";

import { createPlacementFlow } from "../flow";
import type { PlacementClient } from "../client";
import type {
  AnswerResponse,
  ClientResult,
  PublicItem,
  ResultPayload,
  SelfRatingResponse,
  StartResponse,
} from "../types";

const ITEM = (id: string): PublicItem => ({
  id,
  type: "grammar",
  skill: "grammar",
  prompt: { en: "Q?", vi: "Câu?" },
  options: [
    { id: "a", en: "x", vi: "x" },
    { id: "b", en: "y", vi: "y" },
  ],
});

const RESULT: ResultPayload = {
  sessionId: "s1",
  bankVersion: "bv1",
  overall: { cefr: "B1", theta: 0.1, se: 0.28 },
  perSkill: [],
  l1Weaknesses: [],
  recommendedRoomId: "english_b1_b101",
  itemsAdministered: 2,
  elapsedMs: 1234,
  terminationReason: "bank_exhausted",
  retest: { eligibleAt: "2026-08-17T00:00:00.000Z", rationale: "retest_cooldown_90d" },
  growth: null,
  createdAt: "2026-05-19T00:00:00.000Z",
};

const RESP = (itemId: string) => ({
  itemId,
  correct: true,
  responseMs: 800,
  timedOut: false,
  l1RevealedUsed: false,
  shownAt: "2026-05-19T00:00:00.000Z",
  answeredAt: "2026-05-19T00:00:01.000Z",
});

/** Queue-driven fake. Each method consumes the next scripted result;
 *  an unscripted call throws (catches accidental extra round-trips). */
function fakeClient(script: {
  start?: ClientResult<StartResponse>[];
  selfRating?: ClientResult<SelfRatingResponse>[];
  answer?: ClientResult<AnswerResponse>[];
  result?: ClientResult<{ sessionId: string; phase: "complete"; result: ResultPayload }>[];
  abandon?: ClientResult<{ ok: true }>[];
}): PlacementClient {
  const take = <T>(arr: T[] | undefined, name: string): T => {
    if (!arr || arr.length === 0) throw new Error(`unscripted ${name} call`);
    return arr.shift() as T;
  };
  return {
    start: async () => take(script.start, "start"),
    selfRating: async () => take(script.selfRating, "selfRating"),
    answer: async () => take(script.answer, "answer"),
    result: async () => take(script.result, "result") as never,
    abandon: async () => take(script.abandon, "abandon"),
  };
}

describe("createPlacementFlow — lifecycle", () => {
  it("begin with selfRating → in_progress + first item", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [
          { ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1"), bankVersion: "bv1", resumed: false } },
        ],
      }),
    );
    const s = await flow.begin({ selfRating: "intermediate" });
    expect(s.status).toBe("in_progress");
    expect(s.sessionId).toBe("s1");
    expect(s.item?.id).toBe("i1");
    expect(s.resumed).toBe(false);
  });

  it("self-rating gate: awaiting → rate → in_progress", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [
          { ok: true, data: { sessionId: "s1", phase: "awaiting_self_rating", item: null, bankVersion: "bv1", resumed: false } },
        ],
        selfRating: [
          { ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1") } },
        ],
      }),
    );
    let s = await flow.begin();
    expect(s.status).toBe("awaiting_self_rating");
    s = await flow.rate("beginner");
    expect(s.status).toBe("in_progress");
    expect(s.item?.id).toBe("i1");
  });

  it("answer loop → complete + result, answeredCount tracks accepted answers", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1"), bankVersion: "bv1", resumed: false } }],
        answer: [
          { ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i2"), result: null } },
          { ok: true, data: { sessionId: "s1", phase: "complete", item: null, result: RESULT } },
        ],
      }),
    );
    await flow.begin({ selfRating: "intermediate" });
    let s = await flow.submit(RESP("i1"));
    expect(s.status).toBe("in_progress");
    expect(s.item?.id).toBe("i2");
    s = await flow.submit(RESP("i2"));
    expect(s.status).toBe("complete");
    expect(s.result).toEqual(RESULT);
    expect(s.answeredCount).toBe(2);
  });

  it("flag #3: resume returns item:null — surfaced, not fabricated; submit still advances", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: null, bankVersion: "bv1", resumed: true } }],
        answer: [{ ok: true, data: { sessionId: "s1", phase: "complete", item: null, result: RESULT } }],
      }),
    );
    let s = await flow.begin();
    expect(s.status).toBe("in_progress");
    expect(s.resumed).toBe(true);
    expect(s.item).toBeNull(); // NOT guessed
    s = await flow.submit(RESP("held-by-ui"));
    expect(s.status).toBe("complete");
    expect(s.result).toEqual(RESULT);
  });

  it("dedup submit is a no-op: phase/item kept, lastDeduplicated raised", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1"), bankVersion: "bv1", resumed: false } }],
        answer: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: null, result: null, deduplicated: true } }],
      }),
    );
    await flow.begin({ selfRating: "intermediate" });
    const s = await flow.submit(RESP("i1"));
    expect(s.lastDeduplicated).toBe(true);
    expect(s.status).toBe("in_progress");
    expect(s.item?.id).toBe("i1"); // unchanged
    expect(s.answeredCount).toBe(0); // not counted
  });

  it("terminating without a payload auto-finalizes via /result", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1"), bankVersion: "bv1", resumed: false } }],
        answer: [{ ok: true, data: { sessionId: "s1", phase: "terminating", item: null, result: null } }],
        result: [{ ok: true, data: { sessionId: "s1", phase: "complete", result: RESULT } }],
      }),
    );
    await flow.begin({ selfRating: "intermediate" });
    const s = await flow.submit(RESP("i1"));
    expect(s.status).toBe("complete");
    expect(s.result).toEqual(RESULT);
    expect(s.answeredCount).toBe(1);
  });

  it("propagates a client error (auth_required) into status:error", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [
          { ok: false, error: { kind: "auth_required", message: "Sign in", messageVi: "Đăng nhập" } },
        ],
      }),
    );
    const s = await flow.begin();
    expect(s.status).toBe("error");
    expect(s.error?.kind).toBe("auth_required");
  });

  it("abandon → status abandoned", async () => {
    const flow = createPlacementFlow(
      fakeClient({
        start: [{ ok: true, data: { sessionId: "s1", phase: "in_progress", item: ITEM("i1"), bankVersion: "bv1", resumed: false } }],
        abandon: [{ ok: true, data: { ok: true } }],
      }),
    );
    await flow.begin({ selfRating: "intermediate" });
    const s = await flow.abandon();
    expect(s.status).toBe("abandoned");
    expect(s.item).toBeNull();
  });

  it("submit/rate before begin → validation(no_session)", async () => {
    const flow = createPlacementFlow(fakeClient({}));
    const s = await flow.submit(RESP("i1"));
    expect(s.status).toBe("error");
    expect(s.error).toEqual({ kind: "validation", code: "no_session" });
  });
});
