// src/lib/placement/v2/__tests__/client.test.ts
//
// Transport goldens for PR 10's placement-session client. A fake `fetch`
// (no network) + injected token/url/anonKey exercise every status→typed
// outcome the merged PR 9 contract emits, the sub-path URL, and the auth
// headers. The locked DI discipline.

import { describe, expect, it } from "vitest";

import { createPlacementClient } from "../client";

const CFG = {
  getAccessToken: async () => "tok-123",
  supabaseUrl: "https://proj.supabase.co",
  anonKey: "anon-key",
  timeoutMs: 5_000,
};

function jsonRes(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

interface Call {
  url: string;
  init: RequestInit;
}

/** Typed manual capture — version-independent (avoids vi.fn arg-tuple
 *  inference quirks under bare `tsc`). */
function recorder(
  responder: () => Response | Promise<Response>,
): { fetchImpl: typeof fetch; calls: Call[] } {
  const calls: Call[] = [];
  const fetchImpl = (async (
    url: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    calls.push({ url: String(url), init: init ?? {} });
    return responder();
  }) as unknown as typeof fetch;
  return { fetchImpl, calls };
}

describe("createPlacementClient — transport", () => {
  it("POSTs the sub-path with auth + apikey headers and a JSON body", async () => {
    const { fetchImpl, calls } = recorder(() =>
      jsonRes({ sessionId: "s1", phase: "in_progress", item: null, bankVersion: "bv1", resumed: false }),
    );
    const c = createPlacementClient({ ...CFG, fetchImpl });
    const r = await c.answer("s1", {
      itemId: "i1",
      correct: true,
      responseMs: 900,
      timedOut: false,
      l1RevealedUsed: false,
      shownAt: "2026-05-19T00:00:00.000Z",
      answeredAt: "2026-05-19T00:00:01.000Z",
    });
    expect(r.ok).toBe(true);
    expect(calls[0].url).toBe(
      "https://proj.supabase.co/functions/v1/placement-session/answer",
    );
    expect(calls[0].init.method).toBe("POST");
    const h = calls[0].init.headers as Record<string, string>;
    expect(h.Authorization).toBe("Bearer tok-123");
    expect(h.apikey).toBe("anon-key");
    expect(JSON.parse(calls[0].init.body as string)).toEqual({
      sessionId: "s1",
      response: expect.objectContaining({ itemId: "i1", correct: true }),
    });
  });

  it("start without selfRating sends an empty body; with it forwards the rating", async () => {
    const { fetchImpl, calls } = recorder(() =>
      jsonRes({ sessionId: "s", phase: "awaiting_self_rating", item: null, bankVersion: "b", resumed: false }),
    );
    const c = createPlacementClient({ ...CFG, fetchImpl });
    await c.start();
    expect(JSON.parse(calls[0].init.body as string)).toEqual({});
    await c.start({ selfRating: "intermediate" });
    expect(JSON.parse(calls[1].init.body as string)).toEqual({
      selfRating: "intermediate",
    });
  });

  it("401 → auth_required with bilingual messages", async () => {
    const c = createPlacementClient({
      ...CFG,
      fetchImpl: (async () =>
        jsonRes(
          { error: "auth_required", message: "Sign in", message_vi: "Đăng nhập" },
          401,
        )) as unknown as typeof fetch,
    });
    const r = await c.result("s1");
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.kind).toBe("auth_required");
      if (r.error.kind === "auth_required") {
        expect(r.error.message).toBe("Sign in");
        expect(r.error.messageVi).toBe("Đăng nhập");
      }
    }
  });

  it("400 → validation(code), 404 → not_found, 409 → conflict(phase)", async () => {
    const mk = (body: unknown, status: number) =>
      createPlacementClient({
        ...CFG,
        fetchImpl: (async () => jsonRes(body, status)) as unknown as typeof fetch,
      });
    const v = await mk({ error: "invalid_response" }, 400).answer("s", {
      itemId: "i",
      correct: null,
      responseMs: 1,
      timedOut: false,
      l1RevealedUsed: false,
      shownAt: "x",
      answeredAt: "y",
    });
    expect(v.ok).toBe(false);
    if (!v.ok) expect(v.error).toEqual({ kind: "validation", code: "invalid_response" });

    const nf = await mk({ error: "session_not_found" }, 404).result("s");
    if (!nf.ok) expect(nf.error.kind).toBe("not_found");

    const cf = await mk({ error: "not_finalizable", phase: "in_progress" }, 409).result("s");
    if (!cf.ok) {
      expect(cf.error.kind).toBe("conflict");
      if (cf.error.kind === "conflict") expect(cf.error.phase).toBe("in_progress");
    }
  });

  it("network throw → network; AbortError → timeout", async () => {
    const net = createPlacementClient({
      ...CFG,
      fetchImpl: (async () => {
        throw new Error("ECONNREFUSED");
      }) as unknown as typeof fetch,
    });
    const r1 = await net.start();
    if (!r1.ok) expect(r1.error.kind).toBe("network");

    const abort = createPlacementClient({
      ...CFG,
      fetchImpl: (async () => {
        const e = new Error("aborted");
        e.name = "AbortError";
        throw e;
      }) as unknown as typeof fetch,
    });
    const r2 = await abort.start();
    if (!r2.ok) expect(r2.error.kind).toBe("timeout");
  });

  it("invalid JSON on a 200 → bad_response", async () => {
    const c = createPlacementClient({
      ...CFG,
      fetchImpl: (async () =>
        new Response("<<not json>>", { status: 200 })) as unknown as typeof fetch,
    });
    const r = await c.start();
    if (!r.ok) {
      expect(r.error.kind).toBe("bad_response");
      if (r.error.kind === "bad_response") expect(r.error.status).toBe(200);
    }
  });

  it("no token → auth_required without hitting fetch", async () => {
    let hits = 0;
    const c = createPlacementClient({
      ...CFG,
      getAccessToken: async () => null,
      fetchImpl: (async () => {
        hits++;
        return jsonRes({});
      }) as unknown as typeof fetch,
    });
    const r = await c.start();
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.kind).toBe("auth_required");
    expect(hits).toBe(0);
  });

  it("missing env (url/anon) → server(missing_env), no fetch", async () => {
    let hits = 0;
    const c = createPlacementClient({
      ...CFG,
      supabaseUrl: "",
      fetchImpl: (async () => {
        hits++;
        return jsonRes({});
      }) as unknown as typeof fetch,
    });
    const r = await c.start();
    if (!r.ok) {
      expect(r.error.kind).toBe("server");
      if (r.error.kind === "server") expect(r.error.code).toBe("missing_env");
    }
    expect(hits).toBe(0);
  });
});
