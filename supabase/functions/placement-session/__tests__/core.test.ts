// supabase/functions/placement-session/__tests__/core.test.ts
//
// Golden + behavioral tests for PR 9's edge orchestrator. The whole
// `Deps` seam is an in-memory fake that FAITHFULLY simulates the
// stateless edge boundary: persistSession stores only the
// placement_sessions scalars, appendResponse stores append-only response
// rows, and loadSession REBUILDS the SessionState from those exactly as
// index.ts:rowToSession does (currentItemId always null;
// administered/servedItemIds/typeCounts re-derived) — so these tests
// actually exercise reconstruction flag #4, not a shortcut. now() and
// rng() are pinned so every transition is an exact golden (the locked DI
// discipline). vitest owns this file (excluded from
// tsconfig.functions.json — same split as the engine suite).

import { describe, expect, it } from "vitest";

import {
  type Deps,
  handleRequest,
  type LegacySnapshot,
  pickBankVersion,
  recommendedRoomFor,
  toPublicItem,
} from "../core";
import type {
  Item,
  ItemType,
  PlacementHistoryEntry,
  SessionState,
  TerminationReason,
} from "../types";

// ── Fixtures ───────────────────────────────────────────────────────────

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

const NOW = "2026-05-19T00:00:00.000Z";
const URL_BASE = "https://x.functions.supabase.co/placement-session";

interface Stored {
  sessionId: string;
  userId: string;
  bankVersion: string;
  phase: SessionState["phase"];
  selfRating: SessionState["selfRating"];
  priorMean: number;
  theta: number | null;
  se: number | null;
  startedAt: string;
  updatedAt: string;
}

interface RespRow {
  sessionId: string;
  seq: number;
  itemType: ItemType;
  resp: SessionState["administered"][number];
}

function zeroCounts(): Record<ItemType, number> {
  return {
    reading: 0,
    listening: 0,
    grammar: 0,
    vocabulary: 0,
    writing_sample: 0,
  };
}

function makeStore(bank: Item[]) {
  const sessions = new Map<string, Stored>();
  const responses: RespRow[] = [];
  const history: PlacementHistoryEntry[] = [];
  let snapshot: LegacySnapshot | null = null;
  let terminationReason: TerminationReason | null = null;
  const warnings: string[] = [];
  let idN = 0;

  function rebuild(sessionId: string): SessionState | null {
    const s = sessions.get(sessionId);
    if (!s) return null;
    const rows = responses
      .filter((r) => r.sessionId === sessionId)
      .sort((a, b) => a.seq - b.seq);
    const administered = rows.map((r) => r.resp);
    const typeCounts = zeroCounts();
    for (const r of rows) typeCounts[r.itemType] += 1;
    return {
      sessionId: s.sessionId,
      userId: s.userId,
      bankVersion: s.bankVersion,
      phase: s.phase,
      selfRating: s.selfRating,
      priorMean: s.priorMean,
      administered,
      servedItemIds: administered.map((a) => a.itemId),
      current: {
        theta: s.theta ?? 0,
        se: s.se ?? Number.POSITIVE_INFINITY,
        method: "eap",
        iterations: 0,
        converged: s.theta !== null,
      },
      currentItemId: null,
      typeCounts,
      startedAt: s.startedAt,
      updatedAt: s.updatedAt,
    };
  }

  function store(sn: SessionState) {
    sessions.set(sn.sessionId, {
      sessionId: sn.sessionId,
      userId: sn.userId,
      bankVersion: sn.bankVersion,
      phase: sn.phase,
      selfRating: sn.selfRating,
      priorMean: sn.priorMean,
      theta: sn.current.theta,
      se: Number.isFinite(sn.current.se) ? sn.current.se : null,
      startedAt: sn.startedAt,
      updatedAt: sn.updatedAt,
    });
  }

  const deps: Deps = {
    getUser: async () => ({ id: "u1" }),
    loadActiveItems: async () => ({
      rawItems: bank.map((i) => ({ ...i, bankVersion: "bv1" })),
      activeVersions: ["bv1"],
    }),
    loadSession: async (id, uid) => {
      const s = sessions.get(id);
      if (!s || s.userId !== uid) return null;
      return rebuild(id);
    },
    loadLatestUnfinished: async (uid) => {
      const unfinished = [...sessions.values()].filter(
        (s) =>
          s.userId === uid &&
          (s.phase === "awaiting_self_rating" || s.phase === "in_progress"),
      );
      if (unfinished.length === 0) return null;
      unfinished.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
      return rebuild(unfinished[0].sessionId);
    },
    persistSession: async (sn) => store(sn),
    appendResponse: async ({ session, response, seq, itemType }) => {
      responses.push({
        sessionId: session.sessionId,
        seq,
        itemType: itemType as ItemType,
        resp: response,
      });
    },
    loadPrevHistory: async (_uid, excl) => {
      const prior = history
        .filter((h) => h.sessionId !== excl)
        .sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
      return prior.length > 0 ? prior[0] : null;
    },
    writeCompletion: async (
      { session, historyEntry, snapshot: snap, terminationReason: tr },
    ) => {
      store(session); // phase already "complete"
      if (!history.some((h) => h.sessionId === historyEntry.sessionId)) {
        history.push(historyEntry);
      }
      snapshot = snap;
      terminationReason = tr;
    },
    newSessionId: () => `sess-${++idN}`,
    now: () => NOW,
    rng: () => 0,
    warn: (m) => warnings.push(m),
  };

  return {
    deps,
    get sessions() {
      return sessions;
    },
    get responses() {
      return responses;
    },
    get history() {
      return history;
    },
    get snapshot() {
      return snapshot;
    },
    get terminationReason() {
      return terminationReason;
    },
    get warnings() {
      return warnings;
    },
  };
}

function post(path: string, body?: unknown): Request {
  return new Request(`${URL_BASE}${path}`, {
    method: "POST",
    headers: { Authorization: "Bearer x" },
    body: body === undefined ? "{}" : JSON.stringify(body),
  });
}

// ── Routing / auth ─────────────────────────────────────────────────────

describe("handleRequest — routing & auth", () => {
  it("401 when getUser resolves null", async () => {
    const s = makeStore([]);
    const deps = { ...s.deps, getUser: async () => null };
    const res = await handleRequest(post("/start"), deps);
    expect(res.status).toBe(401);
  });

  it("OPTIONS → 200 + CORS", async () => {
    const s = makeStore([]);
    const res = await handleRequest(
      new Request(`${URL_BASE}/start`, { method: "OPTIONS" }),
      s.deps,
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });

  it("non-POST → 405; unknown route → 404", async () => {
    const s = makeStore([]);
    expect(
      (await handleRequest(
        new Request(`${URL_BASE}/start`, { method: "GET" }),
        s.deps,
      )).status,
    ).toBe(405);
    expect(
      (await handleRequest(post("/nope"), s.deps)).status,
    ).toBe(404);
  });
});

// ── /start ─────────────────────────────────────────────────────────────

describe("/start", () => {
  it("no selfRating → awaiting_self_rating, no item, persisted", async () => {
    const s = makeStore([mkItem("rd1", "reading")]);
    const res = await handleRequest(post("/start"), s.deps);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.phase).toBe("awaiting_self_rating");
    expect(body.item).toBeNull();
    expect(body.resumed).toBe(false);
    expect(s.sessions.size).toBe(1);
  });

  it("with selfRating → in_progress + a PublicItem with NO answer key", async () => {
    const s = makeStore([mkItem("rd1", "reading"), mkItem("gr1", "grammar")]);
    const res = await handleRequest(
      post("/start", { selfRating: "intermediate" }),
      s.deps,
    );
    const body = await res.json();
    expect(body.phase).toBe("in_progress");
    expect(body.item).toBeTruthy();
    expect(body.item.correctOptionId).toBeUndefined();
    expect(body.item.transcript).toBeUndefined();
    expect(body.item.options.every((o: { id: string }) => "id" in o)).toBe(
      true,
    );
  });

  it("invalid selfRating → 400", async () => {
    const s = makeStore([]);
    const res = await handleRequest(
      post("/start", { selfRating: "guru" }),
      s.deps,
    );
    expect(res.status).toBe(400);
  });

  it("resumes a non-stale in_progress session (resumed:true, item:null)", async () => {
    const s = makeStore([mkItem("rd1", "reading"), mkItem("gr1", "grammar")]);
    await handleRequest(post("/start", { selfRating: "intermediate" }), s.deps);
    const res = await handleRequest(post("/start"), s.deps);
    const body = await res.json();
    expect(body.resumed).toBe(true);
    expect(body.phase).toBe("in_progress");
    expect(body.item).toBeNull();
    expect(s.sessions.size).toBe(1); // no new session created
  });
});

// ── full lifecycle: /self-rating → /answer×N → terminate → /result ─────

describe("lifecycle → bank_exhausted → finalize", () => {
  function answerBody(sessionId: string, itemId: string) {
    return {
      sessionId,
      response: {
        itemId,
        correct: true,
        selectedOptionId: "a",
        responseMs: 1200,
        timedOut: false,
        l1RevealedUsed: false,
        shownAt: NOW,
        answeredAt: NOW,
      },
    };
  }

  it("answers every item, finalizes, and /result is byte-identical", async () => {
    const s = makeStore([mkItem("rd1", "reading"), mkItem("gr1", "grammar")]);

    const startRes = await handleRequest(
      post("/start", { selfRating: "intermediate" }),
      s.deps,
    );
    const start = await startRes.json();
    const sid = start.sessionId;

    // Drive the test by always answering whatever item we currently hold.
    let current = start.item;
    let finalize: Record<string, unknown> | null = null;
    for (let i = 0; i < 10 && current; i++) {
      const r = await handleRequest(
        post("/answer", answerBody(sid, current.id)),
        s.deps,
      );
      const b = await r.json();
      if (b.result) {
        finalize = b;
        break;
      }
      current = b.item;
    }

    expect(finalize).toBeTruthy();
    expect(finalize!.phase).toBe("complete");
    const result = finalize!.result as Record<string, unknown>;
    expect(result.terminationReason).toBe("bank_exhausted");
    expect(["pre_a1", "A1", "A2", "B1", "B2", "C1", "C2"]).toContain(
      (result.overall as { cefr: string }).cefr,
    );

    // writeCompletion side effects
    expect(s.history).toHaveLength(1);
    expect(s.history[0].sessionId).toBe(sid);
    expect(s.history[0].source).toBe("v2");
    expect(s.snapshot).toBeTruthy();
    expect(s.snapshot!.cefr).toBe((result.overall as { cefr: string }).cefr);
    expect(Array.isArray(s.snapshot!.weaknessTags)).toBe(true);
    expect(s.terminationReason).toBe("bank_exhausted");

    // /result on a COMPLETE session re-assembles deterministically.
    const rr = await handleRequest(post("/result", { sessionId: sid }), s.deps);
    const rb = await rr.json();
    expect(rb.phase).toBe("complete");
    expect(rb.result).toEqual(result);
  });

  it("idempotent: re-answering an already-answered item is a no-op", async () => {
    const s = makeStore([
      mkItem("rd1", "reading"),
      mkItem("gr1", "grammar"),
      mkItem("vo1", "vocabulary"),
    ]);
    const start = await (
      await handleRequest(
        post("/start", { selfRating: "intermediate" }),
        s.deps,
      )
    ).json();
    const sid = start.sessionId;
    const first = start.item.id;

    await handleRequest(post("/answer", answerBody(sid, first)), s.deps);
    const before = s.responses.length;
    const dup = await handleRequest(
      post("/answer", answerBody(sid, first)),
      s.deps,
    );
    const dupBody = await dup.json();
    expect(dupBody.deduplicated).toBe(true);
    expect(s.responses.length).toBe(before); // no extra append
  });

  it("flag #4: unknown itemId is deduplicated, never crashes", async () => {
    const s = makeStore([mkItem("rd1", "reading"), mkItem("gr1", "grammar")]);
    const start = await (
      await handleRequest(
        post("/start", { selfRating: "intermediate" }),
        s.deps,
      )
    ).json();
    const res = await handleRequest(
      post("/answer", answerBody(start.sessionId, "ghost-item")),
      s.deps,
    );
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body.deduplicated).toBe(true);
    expect(s.responses).toHaveLength(0);
  });

  it("malformed response → 400; missing sessionId → 400", async () => {
    const s = makeStore([mkItem("rd1", "reading")]);
    expect(
      (await handleRequest(
        post("/answer", { sessionId: "x", response: { itemId: 1 } }),
        s.deps,
      )).status,
    ).toBe(400);
    expect(
      (await handleRequest(post("/answer", { response: {} }), s.deps)).status,
    ).toBe(400);
  });
});

// ── /abandon ───────────────────────────────────────────────────────────

describe("/abandon", () => {
  it("marks an in_progress session abandoned", async () => {
    const s = makeStore([mkItem("rd1", "reading"), mkItem("gr1", "grammar")]);
    const start = await (
      await handleRequest(
        post("/start", { selfRating: "intermediate" }),
        s.deps,
      )
    ).json();
    const res = await handleRequest(
      post("/abandon", { sessionId: start.sessionId }),
      s.deps,
    );
    expect((await res.json()).ok).toBe(true);
    expect(s.sessions.get(start.sessionId)!.phase).toBe("abandoned");
  });

  it("404 for an unknown session", async () => {
    const s = makeStore([]);
    const res = await handleRequest(
      post("/abandon", { sessionId: "nope" }),
      s.deps,
    );
    expect(res.status).toBe(404);
  });
});

// ── pure helpers ───────────────────────────────────────────────────────

describe("pickBankVersion (flag #2)", () => {
  it("env override wins", () => {
    expect(pickBankVersion(["a", "b"], "envv")).toEqual({ version: "envv" });
  });
  it("single active version is used", () => {
    expect(pickBankVersion(["only"])).toEqual({ version: "only" });
  });
  it("no active versions → empty (D2 ship-EMPTY → bank_exhausted)", () => {
    expect(pickBankVersion([])).toEqual({ version: "" });
  });
  it(">1 active → lexicographic-max + a warning", () => {
    const r = pickBankVersion(["v2", "v10", "v3"]);
    expect(r.version).toBe("v3"); // lexicographic, not numeric
    expect(r.warning).toMatch(/active bank_versions/);
  });
});

describe("toPublicItem", () => {
  it("never carries the answer key / transcript / IRT params", () => {
    const pub = toPublicItem(
      mkItem("li1", "listening", { difficulty: 2.2, discrimination: 1.7 }),
    );
    expect(pub).not.toHaveProperty("correctOptionId");
    expect(pub).not.toHaveProperty("transcript");
    expect(pub).not.toHaveProperty("difficulty");
    expect(pub).not.toHaveProperty("discrimination");
    expect(pub).not.toHaveProperty("meta");
    expect(pub.audio).toEqual({ key: "k.mp3", replayLimit: 1 });
  });
});

describe("recommendedRoomFor", () => {
  it("maps via the server mirror", () => {
    expect(recommendedRoomFor("B1")).toBe("english_b1_b101");
    expect(recommendedRoomFor("C2")).toBe("english_c1_c114");
  });
});
