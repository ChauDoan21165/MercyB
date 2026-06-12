// api/__tests__/mercy-feedback.test.ts
//
// Regression test for the SERVER side of #745 / A12.
//
// THE CONTRACT THIS PINS:
//   api/mercy-feedback.ts builds its Supabase client at module load:
//       const supabase = url && anonKey ? createClient(...) : null
//   !906 moved this insert sink to the anon key because RLS now grants
//   anon/authenticated inserts into mercy_feedback_events. If that key is
//   absent, every POST returns HTTP 500 `supabase_not_configured` and ZERO
//   rows reach mercy_feedback_events.
//
// This file locks BOTH halves of the contract:
//   1. The exact failure: anon key missing -> 500
//      supabase_not_configured, and the error names the missing var
//      (so a future env regression is diagnosable, not a blind park).
//   2. The proof it would have succeeded with correct env: a
//      well-formed envelope (the same shape src/lib/send-feedback.ts
//      sends — guarded by send-feedback.test.ts) inserts a correctly
//      column-mapped row into mercy_feedback_events. This is the
//      "would have worked if env was right" assertion the failure mode
//      analysis demands — the bug was env, not the request.
//
// `supabase` is decided at import time, so each test sets process.env,
// vi.doMock("@supabase/supabase-js"), vi.resetModules(), then imports a
// fresh handler. Mirrors the env+global pattern in
// api/_lib/__tests__/aiProvider.test.ts.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type JsonBody = Record<string, unknown>;

type MockRes = {
  statusCode: number;
  body: JsonBody | undefined;
  ended: boolean;
  headers: Record<string, string>;
  setHeader: (k: string, v: string) => void;
  status: (code: number) => MockRes;
  json: (b: JsonBody) => MockRes;
  end: () => MockRes;
};

function makeRes(): MockRes {
  const res: MockRes = {
    statusCode: 0,
    body: undefined,
    ended: false,
    headers: {},
    setHeader(k, v) {
      this.headers[k] = v;
    },
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(b) {
      this.body = b;
      return this;
    },
    end() {
      this.ended = true;
      return this;
    },
  };
  return res;
}

type HandlerReq = { method: string; body?: unknown };
type Handler = (req: unknown, res: unknown) => Promise<unknown> | unknown;

// The exact envelope src/lib/send-feedback.ts puts on the wire. Kept in
// sync with that file by send-feedback.test.ts (client side); here we
// assert the SERVER maps it onto the right columns.
function buildClientEnvelope() {
  return {
    schema: "mb.feedback.v1",
    appKey: "mercy_blade",
    client: {
      version: "web",
      buildTime: "2026-05-19T00:00:00.000Z",
      platform: "web",
      locale: "vi-VN",
      tzOffsetMin: -420,
    },
    actor: { anonId: "anon_abc123", sessionId: "sess_xyz789" },
    context: {
      pagePath: "/room/some-room",
      mode: "room",
      contextLine: null,
      conversationId: "conv_111",
    },
    model: { name: "mercy-blade-1", promptVersion: "p-7" },
    items: [
      {
        v: 1,
        ts: 1_747_600_000_000,
        appKey: "mercy_blade",
        authUserId: null,
        tier: "level0",
        lang: "vi",
        mode: "room",
        path: "/room/some-room",
        msgId: "msg_333",
        responseId: "resp_222",
        vote: "down",
        feedbackReason: "not_helpful",
        answerText: "Mercy said: try the present perfect here.",
      },
    ],
  };
}

const ENV_KEYS = [
  "SUPABASE_URL",
  "VITE_SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "VITE_SUPABASE_ANON_KEY",
] as const;

let savedEnv: Record<string, string | undefined> = {};

beforeEach(() => {
  savedEnv = {};
  for (const k of ENV_KEYS) {
    savedEnv[k] = process.env[k];
    delete process.env[k];
  }
  vi.resetModules();
});

afterEach(() => {
  for (const k of ENV_KEYS) {
    if (savedEnv[k] === undefined) delete process.env[k];
    else process.env[k] = savedEnv[k];
  }
  vi.doUnmock("@supabase/supabase-js");
  vi.resetModules();
});

async function importHandler(): Promise<Handler> {
  const mod = (await import("../mercy-feedback.js")) as {
    default: Handler;
  };
  return mod.default;
}

describe("api/mercy-feedback — #745/A12 server contract", () => {
  it("REGRESSION: missing SUPABASE_ANON_KEY → 500 supabase_not_configured naming the var", async () => {
    // URL present (the #691 VITE_ fallback was fine all along),
    // anon key absent.
    process.env.SUPABASE_URL = "https://proj.supabase.co";
    // SUPABASE_ANON_KEY intentionally NOT set.

    const handler = await importHandler();
    const res = makeRes();
    await handler(
      { method: "POST", body: buildClientEnvelope() } satisfies HandlerReq,
      res,
    );

    expect(res.statusCode).toBe(500);
    expect(res.body).toMatchObject({
      ok: false,
      acceptedCount: 0,
      error: "supabase_not_configured",
    });
    // The whole point of #745: the error must NAME the missing var so
    // the next env regression is a 30-second read, not a blind park.
    expect(String(res.body?.details)).toContain(
      "SUPABASE_ANON_KEY/VITE_SUPABASE_ANON_KEY",
    );
    expect(String(res.body?.details)).not.toContain(
      "SUPABASE_URL/VITE_SUPABASE_URL",
    );
  });

  it("PROOF: with correct env, a well-formed envelope inserts a column-mapped row (the call WOULD have succeeded)", async () => {
    process.env.SUPABASE_URL = "https://proj.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-test-key";

    const insertSpy = vi.fn().mockResolvedValue({ error: null });
    const fromSpy = vi.fn(() => ({ insert: insertSpy }));
    const createClientSpy = vi.fn(() => ({ from: fromSpy }));
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: createClientSpy,
    }));

    const handler = await importHandler();
    const res = makeRes();
    await handler(
      { method: "POST", body: buildClientEnvelope() } satisfies HandlerReq,
      res,
    );

    // Client built with the anon key, matching the RLS-backed insert contract.
    expect(createClientSpy).toHaveBeenCalledWith(
      "https://proj.supabase.co",
      "anon-test-key",
    );
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, acceptedCount: 1 });

    expect(fromSpy).toHaveBeenCalledWith("mercy_feedback_events");
    expect(insertSpy).toHaveBeenCalledTimes(1);
    const insertedRows = insertSpy.mock.calls[0][0] as JsonBody[];
    expect(insertedRows).toHaveLength(1);

    // The wire→column mapping that was producing zero rows. If any of
    // these break, feedback persists garbage even when env is correct.
    expect(insertedRows[0]).toMatchObject({
      schema_name: "mb.feedback.v1",
      request_app_key: "mercy_blade",
      actor_anon_id: "anon_abc123",
      session_id: "sess_xyz789",
      conversation_id: "conv_111",
      context_page_path: "/room/some-room",
      context_mode: "room",
      prompt_version: "p-7",
      model_name: "mercy-blade-1",
      tier: "level0",
      lang: "vi",
      vote: "down",
      feedback_reason: "not_helpful",
      answer_text_snapshot: "Mercy said: try the present perfect here.",
    });
  });

  it("surfaces a Supabase insert failure as 500 supabase_insert_failed (not a silent 200)", async () => {
    process.env.SUPABASE_URL = "https://proj.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-test-key";

    const insertSpy = vi
      .fn()
      .mockResolvedValue({ error: { message: "rls denied" } });
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({ insert: insertSpy })),
      })),
    }));

    const handler = await importHandler();
    const res = makeRes();
    await handler(
      { method: "POST", body: buildClientEnvelope() } satisfies HandlerReq,
      res,
    );

    expect(res.statusCode).toBe(500);
    expect(res.body).toMatchObject({
      ok: false,
      error: "supabase_insert_failed",
      details: "rls denied",
    });
  });

  it("rejects non-POST with 405 and answers the CORS preflight with 204", async () => {
    process.env.SUPABASE_URL = "https://proj.supabase.co";
    process.env.SUPABASE_ANON_KEY = "anon-test-key";
    vi.doMock("@supabase/supabase-js", () => ({
      createClient: vi.fn(() => ({
        from: vi.fn(() => ({ insert: vi.fn() })),
      })),
    }));

    const handler = await importHandler();

    const getRes = makeRes();
    await handler({ method: "GET" } satisfies HandlerReq, getRes);
    expect(getRes.statusCode).toBe(405);
    expect(getRes.body).toMatchObject({ error: "method_not_allowed" });

    const optRes = makeRes();
    await handler({ method: "OPTIONS" } satisfies HandlerReq, optRes);
    expect(optRes.statusCode).toBe(204);
    expect(optRes.ended).toBe(true);
  });
});
