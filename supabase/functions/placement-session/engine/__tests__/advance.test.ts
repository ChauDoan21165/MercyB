// supabase/functions/placement-session/engine/__tests__/advance.test.ts
//
// Golden + property tests for PR 8's scored turn step. Deps are fully
// scripted (fixed clock, rng→0) so every transition is an exact golden —
// the locked DI discipline. Covers: the continue step, the
// bank_exhausted termination, all three idempotency/resume guards
// (rng/clock proven untouched), determinism, and the L1-revealed
// discount's measurable effect on θ̂. vitest owns this file.

import { describe, expect, it } from "vitest";

import { buildItemBank } from "../itemBank";
import { applySelfRating, createSession, type SessionDeps } from "../session";
import { advance } from "../advance";
import type { Item, ItemType, Response, SessionState } from "../../types";

const META: Item["meta"] = {
  author: "t",
  cefrDescriptor: "x",
  paramSource: "expert",
  displayPreference: "en_first",
};

function mkItem(
  id: string,
  type: Exclude<ItemType, "writing_sample">,
  over: Partial<Item> = {},
): Item {
  const base: Item = {
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
    meta: META,
    ...over,
  };
  if (type === "reading") base.passage = { en: "p", vi: "p" };
  if (type === "listening") {
    base.audio = { key: "k.mp3", replayLimit: 1 };
    base.transcript = { en: "t", vi: "t" };
  }
  return base;
}

// 2-item bank → bank_exhausts fast (deterministic terminator golden;
// MIN/MAX/precision precedence is unit-tested in terminator.test.ts).
const twoItemBank = () =>
  buildItemBank(
    [mkItem("rd1", "reading"), mkItem("gr1", "grammar")],
    "bank.adv.1",
  ).bank;

const T0 = "2026-05-18T10:00:00.000Z";
const plusMin = (iso: string, m: number) =>
  new Date(Date.parse(iso) + m * 60_000).toISOString();
function depsAt(now = T0): SessionDeps {
  return { newSessionId: () => "sess-fixed", now: () => now, rng: () => 0 };
}
function mkResp(itemId: string, over: Partial<Response> = {}): Response {
  return {
    itemId,
    correct: true,
    responseMs: 3000,
    timedOut: false,
    l1RevealedUsed: false,
    shownAt: T0,
    answeredAt: plusMin(T0, 1),
    ...over,
  };
}

/** Seed a session into in_progress with its first item served. */
function started(bank = twoItemBank()): { s: SessionState; firstId: string } {
  const s0 = createSession(depsAt(), { userId: "u", bankVersion: "b" });
  const { session, item } = applySelfRating(depsAt(), s0, "intermediate", bank);
  return { s: session, firstId: item!.id };
}

describe("advance — the continue step", () => {
  it("appends the response, bumps typeCounts, re-estimates θ̂ (seed → EAP), serves the next item", () => {
    const bank = twoItemBank();
    const { s, firstId } = started(bank);
    expect(firstId).toBe("rd1"); // content-balance golden (reading quota)
    expect(s.current.method).toBe("seed"); // pre-advance placeholder

    const r = advance(depsAt(plusMin(T0, 2)), s, mkResp(firstId), bank);

    expect(r.session.administered).toHaveLength(1);
    expect(r.session.administered[0].itemId).toBe("rd1");
    expect(r.session.typeCounts.reading).toBe(1);
    expect(r.session.current.method).toBe("eap"); // re-estimated
    expect(r.session.phase).toBe("in_progress");
    expect(r.termination).toBeNull();
    expect(r.item!.id).toBe("gr1"); // next, content-balanced
    expect(r.session.currentItemId).toBe("gr1");
    expect(r.session.servedItemIds).toEqual(["rd1", "gr1"]);
    expect(r.session.updatedAt).toBe(plusMin(T0, 2));
  });
});

describe("advance — bank_exhausted termination", () => {
  it("answering the last eligible item → terminating, no item, reason bank_exhausted", () => {
    const bank = twoItemBank();
    const { s, firstId } = started(bank);
    const mid = advance(depsAt(plusMin(T0, 2)), s, mkResp(firstId), bank);
    const end = advance(
      depsAt(plusMin(T0, 3)),
      mid.session,
      mkResp(mid.item!.id),
      bank,
    );

    expect(end.session.phase).toBe("terminating");
    expect(end.item).toBeNull();
    expect(end.session.currentItemId).toBeNull();
    expect(end.termination).toEqual({ stop: true, reason: "bank_exhausted" });
    expect(end.session.administered.map((a) => a.itemId)).toEqual([
      "rd1",
      "gr1",
    ]);
    expect(end.session.typeCounts).toMatchObject({ reading: 1, grammar: 1 });
  });
});

describe("advance — idempotency / resume guards (no-op, never throws)", () => {
  const throwing: SessionDeps = {
    newSessionId: () => "x",
    now: () => {
      throw new Error("clock must not be read on a guarded no-op");
    },
    rng: () => {
      throw new Error("rng must not be drawn on a guarded no-op");
    },
  };

  it("phase not in_progress → unchanged ref, null item/termination, deps untouched", () => {
    const s0 = createSession(depsAt(), { userId: "u", bankVersion: "b" });
    const r = advance(throwing, s0, mkResp("rd1"), twoItemBank());
    expect(r.session).toBe(s0);
    expect(r.item).toBeNull();
    expect(r.termination).toBeNull();
  });

  it("response.itemId ≠ currentItemId (stale/duplicate) → no-op", () => {
    const { s } = started();
    const r = advance(throwing, s, mkResp("not-the-served-item"), twoItemBank());
    expect(r.session).toBe(s);
    expect(r.item).toBeNull();
  });

  it("currentItemId null while in_progress → no-op", () => {
    const { s } = started();
    const r = advance(
      throwing,
      { ...s, currentItemId: null },
      mkResp("rd1"),
      twoItemBank(),
    );
    expect(r.session.currentItemId).toBeNull();
    expect(r.item).toBeNull();
  });
});

describe("advance — determinism + L1-revealed discount effect on θ̂", () => {
  it("identical deps + inputs ⇒ deep-equal AdvanceResult", () => {
    const a = advance(depsAt(), started().s, mkResp("rd1"), twoItemBank());
    const b = advance(depsAt(), started().s, mkResp("rd1"), twoItemBank());
    expect(a).toEqual(b);
  });

  it("a crutch-assisted correct yields a LOWER θ̂ than a clean correct", () => {
    const clean = advance(
      depsAt(plusMin(T0, 2)),
      started().s,
      mkResp("rd1", { correct: true, l1RevealedUsed: false }),
      twoItemBank(),
    );
    const crutch = advance(
      depsAt(plusMin(T0, 2)),
      started().s,
      mkResp("rd1", { correct: true, l1RevealedUsed: true }),
      twoItemBank(),
    );
    // clean → u=1 (ability shown) ; crutch → u=0 (discounted) ⇒ θ̂ drops.
    expect(crutch.session.current.theta).toBeLessThan(
      clean.session.current.theta,
    );
  });
});
