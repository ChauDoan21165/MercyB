// supabase/functions/placement-session/__tests__/grading.test.ts
//
// PR 11 series-functional fix: the answer key is SERVER-ONLY (PublicItem
// strips correctOptionId), so the browser cannot supply `correct`;
// scoring.ts reads `resp.correct`; therefore the EDGE FN must grade. This
// proves handleAnswer derives `correct` from `Item.correctOptionId` and
// IGNORES whatever the client sent — for both a wrong and a right pick.

import { describe, expect, it } from "vitest";

import { type Deps, handleRequest } from "../core";
import type { Item, SessionState } from "../types";

const META: Item["meta"] = {
  author: "t",
  cefrDescriptor: "x",
  paramSource: "expert",
  displayPreference: "en_first",
};

function mkItem(id: string): Item {
  return {
    id,
    type: "grammar",
    cefr: "B1",
    difficulty: 0,
    discrimination: 1,
    skill: "grammar",
    prompt: { en: "Q?", vi: "Câu?" },
    options: [
      { id: "a", en: "x", vi: "x" },
      { id: "b", en: "y", vi: "y" },
    ],
    correctOptionId: "a", // SERVER-ONLY — never leaves via PublicItem
    meta: META,
  };
}

const NOW = "2026-05-19T00:00:00.000Z";
const URL = "https://x.functions.supabase.co/placement-session";

/** Minimal store; the only thing under test is what appendResponse
 *  receives as `response.correct`. */
function harness() {
  const sessions = new Map<string, SessionState>();
  const appended: SessionState["administered"] = [];
  let n = 0;
  const deps: Deps = {
    getUser: async () => ({ id: "u1" }),
    loadActiveItems: async () => ({
      rawItems: [mkItem("g1"), mkItem("g2")].map((i) => ({ ...i, bankVersion: "bv1" })),
      activeVersions: ["bv1"],
    }),
    loadSession: async (id, uid) => {
      const s = sessions.get(id);
      return s && s.userId === uid ? s : null;
    },
    loadLatestUnfinished: async () => null,
    persistSession: async (s) => {
      sessions.set(s.sessionId, s);
    },
    appendResponse: async ({ response }) => {
      appended.push(response);
    },
    loadPrevHistory: async () => null,
    writeCompletion: async ({ session }) => {
      sessions.set(session.sessionId, session);
    },
    newSessionId: () => `s-${++n}`,
    now: () => NOW,
    rng: () => 0,
  };
  return { deps, appended, sessions };
}

function post(path: string, body: unknown): Request {
  return new Request(`${URL}${path}`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: JSON.stringify(body),
  });
}

async function startAndGetItemId(deps: Deps): Promise<{ sid: string; itemId: string }> {
  const res = await handleRequest(
    post("/start", { selfRating: "intermediate" }),
    deps,
  );
  const b = await res.json();
  return { sid: b.sessionId, itemId: b.item.id };
}

describe("handleAnswer — server-side grading (PR 11 fix)", () => {
  it("a WRONG pick is recorded correct:false even when the client sent correct:true", async () => {
    const h = harness();
    const { sid, itemId } = await startAndGetItemId(h.deps);
    await handleRequest(
      post("/answer", {
        sessionId: sid,
        response: {
          itemId,
          correct: true, // client lies / cannot know — must be ignored
          selectedOptionId: "b", // wrong (key is "a")
          responseMs: 900,
          timedOut: false,
          l1RevealedUsed: false,
          shownAt: NOW,
          answeredAt: NOW,
        },
      }),
      h.deps,
    );
    expect(h.appended).toHaveLength(1);
    expect(h.appended[0].correct).toBe(false);
  });

  it("a RIGHT pick is recorded correct:true even when the client sent correct:false", async () => {
    const h = harness();
    const { sid, itemId } = await startAndGetItemId(h.deps);
    await handleRequest(
      post("/answer", {
        sessionId: sid,
        response: {
          itemId,
          correct: false, // ignored
          selectedOptionId: "a", // matches the server-only key
          responseMs: 900,
          timedOut: false,
          l1RevealedUsed: false,
          shownAt: NOW,
          answeredAt: NOW,
        },
      }),
      h.deps,
    );
    expect(h.appended).toHaveLength(1);
    expect(h.appended[0].correct).toBe(true);
  });
});
