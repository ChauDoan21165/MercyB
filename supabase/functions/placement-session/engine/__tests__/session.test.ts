// supabase/functions/placement-session/engine/__tests__/session.test.ts
//
// Golden + property tests for the §4 session lifecycle. SessionDeps is
// fully scripted (fixed id, fixed/steppable clock, deterministic rng) so
// every transition is an exact golden — the locked DI discipline. The
// SCORED `advance` step is intentionally absent from this module (PR 8);
// these tests assert only the scoring-free lifecycle. vitest owns this
// file (excluded from tsconfig.functions.json — same split as the rest).

import { describe, expect, it } from "vitest";

import { PRIOR_SD, SESSION_ABANDON_TTL_MIN } from "../../config";
import { buildItemBank } from "../itemBank";
import { priorMeanForSelfRating } from "../thetaEstimator";
import {
  applySelfRating,
  canResume,
  createSession,
  isStale,
  markAbandonedIfStale,
  type SessionDeps,
} from "../session";
import type { Item, ItemType, SelfRating, SessionState } from "../../types";

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

const fullBank = () =>
  buildItemBank(
    [
      mkItem("rd1", "reading"),
      mkItem("rd2", "reading", { difficulty: 1 }),
      mkItem("li1", "listening"),
      mkItem("gr1", "grammar"),
      mkItem("vo1", "vocabulary"),
    ],
    "bank.sess.1",
  ).bank;

const T0 = "2026-05-18T10:00:00.000Z";
/** Fixed-clock deps; rng → 0 (top of the randomesque window, fully
 *  deterministic first pick). */
function depsAt(now = T0, id = "sess-fixed"): SessionDeps {
  return { newSessionId: () => id, now: () => now, rng: () => 0 };
}
const plusMin = (iso: string, m: number) =>
  new Date(Date.parse(iso) + m * 60_000).toISOString();

// ---------------------------------------------------------------------------
// createSession — design §4 step 1
// ---------------------------------------------------------------------------
describe("createSession", () => {
  it("phase awaiting_self_rating, neutral seed placeholder, ids/ts from deps", () => {
    const s = createSession(depsAt(), {
      userId: "u1",
      bankVersion: "bank.sess.1",
    });
    expect(s.phase).toBe("awaiting_self_rating");
    expect(s.sessionId).toBe("sess-fixed");
    expect(s.userId).toBe("u1");
    expect(s.bankVersion).toBe("bank.sess.1");
    expect(s.selfRating).toBeNull();
    expect(s.priorMean).toBe(0);
    expect(s.currentItemId).toBeNull();
    expect(s.administered).toEqual([]);
    expect(s.servedItemIds).toEqual([]);
    expect(s.startedAt).toBe(T0);
    expect(s.updatedAt).toBe(T0);
    // neutral placeholder θ̂ == seed(0, PRIOR_SD)
    expect(s.current).toEqual({
      theta: 0,
      se: PRIOR_SD,
      method: "seed",
      iterations: 0,
      converged: false,
    });
    // typeCounts has all 5 keys at 0 (never undefined downstream).
    expect(Object.keys(s.typeCounts).sort()).toEqual(
      ["grammar", "listening", "reading", "vocabulary", "writing_sample"].sort(),
    );
    expect(s.typeCounts).toEqual({
      reading: 0,
      listening: 0,
      grammar: 0,
      vocabulary: 0,
      writing_sample: 0,
    });
  });
});

// ---------------------------------------------------------------------------
// applySelfRating — design §4 / §2.5
// ---------------------------------------------------------------------------
describe("applySelfRating", () => {
  const ratings: SelfRating[] = [
    "beginner",
    "intermediate",
    "advanced",
    "not_sure",
  ];

  it("each rating → μ₀ from priorMeanForSelfRating, seed θ̂, in_progress + first item", () => {
    for (const r of ratings) {
      const s0 = createSession(depsAt(), {
        userId: "u",
        bankVersion: "bank.sess.1",
      });
      const { session, item } = applySelfRating(
        depsAt(plusMin(T0, 1)),
        s0,
        r,
        fullBank(),
      );
      const mu = priorMeanForSelfRating(r);
      expect(session.selfRating).toBe(r);
      expect(session.priorMean).toBe(mu);
      expect(session.current).toEqual({
        theta: mu,
        se: PRIOR_SD,
        method: "seed",
        iterations: 0,
        converged: false,
      });
      expect(session.phase).toBe("in_progress");
      expect(item).not.toBeNull();
      expect(item!.type).not.toBe("writing_sample");
      expect(session.currentItemId).toBe(item!.id);
      expect(session.servedItemIds).toEqual([item!.id]);
      expect(session.updatedAt).toBe(plusMin(T0, 1));
      expect(session.startedAt).toBe(T0); // unchanged
    }
  });

  it("first pick obeys content balancing (reading — largest hard quota, tie order)", () => {
    const s0 = createSession(depsAt(), { userId: "u", bankVersion: "b" });
    const { item } = applySelfRating(depsAt(), s0, "intermediate", fullBank());
    expect(item!.type).toBe("reading");
  });

  it("empty bank → phase terminating, no item, rating still recorded", () => {
    const empty = buildItemBank([], "empty").bank;
    const s0 = createSession(depsAt(), { userId: "u", bankVersion: "empty" });
    const { session, item } = applySelfRating(
      depsAt(plusMin(T0, 2)),
      s0,
      "beginner",
      empty,
    );
    expect(item).toBeNull();
    expect(session.phase).toBe("terminating");
    expect(session.currentItemId).toBeNull();
    expect(session.selfRating).toBe("beginner");
    expect(session.priorMean).toBe(priorMeanForSelfRating("beginner"));
  });

  it("idempotent guard: no-op (unchanged session, null item, no rng) from a non-awaiting phase", () => {
    const s0 = createSession(depsAt(), { userId: "u", bankVersion: "b" });
    const once = applySelfRating(depsAt(), s0, "advanced", fullBank());
    expect(once.session.phase).toBe("in_progress");
    // rng that throws if called → proves the guard short-circuits before
    // any selection on the second call.
    const throwingDeps: SessionDeps = {
      newSessionId: () => "x",
      now: () => plusMin(T0, 9),
      rng: () => {
        throw new Error("rng must not be drawn on a guarded no-op");
      },
    };
    const twice = applySelfRating(
      throwingDeps,
      once.session,
      "beginner",
      fullBank(),
    );
    expect(twice.item).toBeNull();
    expect(twice.session).toBe(once.session); // same reference, untouched
  });

  it("is deterministic — identical deps + inputs ⇒ deep-equal SessionState", () => {
    const a = applySelfRating(
      depsAt(),
      createSession(depsAt(), { userId: "u", bankVersion: "b" }),
      "intermediate",
      fullBank(),
    );
    const b = applySelfRating(
      depsAt(),
      createSession(depsAt(), { userId: "u", bankVersion: "b" }),
      "intermediate",
      fullBank(),
    );
    expect(a).toEqual(b);
  });
});

// ---------------------------------------------------------------------------
// isStale / markAbandonedIfStale / canResume — design §4 abandon + resume
// ---------------------------------------------------------------------------
describe("isStale (abandon TTL = SESSION_ABANDON_TTL_MIN)", () => {
  const inProgress = (updatedAt: string): SessionState => ({
    ...createSession(depsAt(updatedAt), { userId: "u", bankVersion: "b" }),
    phase: "in_progress",
    currentItemId: "rd1",
    updatedAt,
  });

  it("strict boundary: exactly at the TTL is NOT stale; one minute past IS", () => {
    const s = inProgress(T0);
    expect(isStale(s, plusMin(T0, SESSION_ABANDON_TTL_MIN))).toBe(false);
    expect(isStale(s, plusMin(T0, SESSION_ABANDON_TTL_MIN + 1))).toBe(true);
    expect(isStale(s, plusMin(T0, SESSION_ABANDON_TTL_MIN - 1))).toBe(false);
  });

  it("only unfinished phases can be stale (settled phases never)", () => {
    const longAgo = plusMin(T0, SESSION_ABANDON_TTL_MIN + 999);
    for (const phase of ["terminating", "complete", "abandoned"] as const) {
      expect(isStale({ ...inProgress(T0), phase }, longAgo)).toBe(false);
    }
    expect(
      isStale({ ...inProgress(T0), phase: "awaiting_self_rating" }, longAgo),
    ).toBe(true);
  });
});

describe("markAbandonedIfStale", () => {
  const s = (): SessionState => ({
    ...createSession(depsAt(T0), { userId: "u", bankVersion: "b" }),
    phase: "in_progress",
    updatedAt: T0,
  });

  it("stale → abandoned with updatedAt advanced to now", () => {
    const now = plusMin(T0, SESSION_ABANDON_TTL_MIN + 5);
    const out = markAbandonedIfStale(s(), now);
    expect(out.phase).toBe("abandoned");
    expect(out.updatedAt).toBe(now);
  });

  it("fresh → unchanged (same reference, no clone)", () => {
    const fresh = s();
    expect(markAbandonedIfStale(fresh, plusMin(T0, 1))).toBe(fresh);
  });

  it("already settled → unchanged", () => {
    const done: SessionState = { ...s(), phase: "complete" };
    expect(
      markAbandonedIfStale(done, plusMin(T0, SESSION_ABANDON_TTL_MIN + 50)),
    ).toBe(done);
  });
});

describe("canResume", () => {
  const base = (): SessionState => ({
    ...createSession(depsAt(T0), { userId: "u", bankVersion: "b" }),
    phase: "in_progress",
    currentItemId: "rd1",
    updatedAt: T0,
  });

  it("in_progress + outstanding item + fresh → true", () => {
    expect(canResume(base(), plusMin(T0, 5))).toBe(true);
  });
  it("stale → false", () => {
    expect(canResume(base(), plusMin(T0, SESSION_ABANDON_TTL_MIN + 1))).toBe(
      false,
    );
  });
  it("no outstanding item → false", () => {
    expect(canResume({ ...base(), currentItemId: null }, plusMin(T0, 1))).toBe(
      false,
    );
  });
  it("not in_progress (awaiting / terminating / complete) → false", () => {
    for (const phase of [
      "awaiting_self_rating",
      "terminating",
      "complete",
      "abandoned",
    ] as const) {
      expect(canResume({ ...base(), phase }, plusMin(T0, 1))).toBe(false);
    }
  });
});
