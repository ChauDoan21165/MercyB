// src/lib/__tests__/send-feedback.test.ts
//
// Regression test for the Mercy feedback CLIENT → /api/mercy-feedback
// request contract. Guards #745 / A12 (the silent-failure that ran in
// production, undetected, for months).
//
// What actually broke before #745: the production handler in
// api/mercy-feedback.ts returned HTTP 500 `supabase_not_configured`
// because SUPABASE_SERVICE_ROLE_KEY was never set on the deployment.
// Zero rows were written to mercy_feedback_events for months. The CLIENT
// code was never the bug — sendMercyFeedback always sent a well-formed
// envelope; the failure was environment, server-side.
//
// So the durable client-side regression target is exactly that
// invariant: the client must keep POSTing a well-formed envelope whose
// field names match what the production handler reads. The handler
// (api/mercy-feedback.ts) maps:
//     actor.anonId        -> actor_anon_id
//     actor.sessionId     -> session_id
//     context.conversationId -> conversation_id
//     items[].vote        -> vote
//     items[].lang        -> lang
//     items[].feedbackReason -> feedback_reason
//     items[].answerText  -> answer_text_snapshot
// If a refactor renames or drops any of those wire keys, the POST would
// still return 200 but persist NULLs — silent again, exactly the failure
// class #745 fixed. This test pins the wire shape so that drift fails
// CI instead of production.
//
// Mirrors the fetch-spy + resolveApiUrl-mock pattern used by
// src/components/mercy-guide/tabs/grammar-writing/__tests__/api.test.ts.

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockResolveApiUrl = vi.fn((path: string) => path);
vi.mock("@/lib/apiBase", () => ({
  resolveApiUrl: (path: string) => mockResolveApiUrl(path),
}));

import { sendMercyFeedback } from "@/lib/send-feedback";

const originalFetch = globalThis.fetch;

type FeedbackEnvelope = {
  schema: string;
  appKey: string;
  client: {
    version: string | null;
    buildTime: string | null;
    platform: string | null;
    locale: string | null;
    tzOffsetMin: number | null;
  };
  actor: { anonId: string | null; sessionId: string | null };
  context: {
    pagePath: string | null;
    mode: string | null;
    contextLine: string | null;
    conversationId: string | null;
  };
  model: { name: string | null; promptVersion: string | null };
  items: Array<{
    v: number;
    ts: number;
    appKey: string;
    authUserId: string | null;
    tier: string | null;
    lang: string | null;
    mode: string | null;
    path: string | null;
    msgId: string | null;
    responseId: string | null;
    vote: string | null;
    feedbackReason: string | null;
    answerText: string | null;
  }>;
};

function jsonResponse(body: unknown, status = 200) {
  const headers = new Headers();
  headers.set("content-type", "application/json");
  return new Response(JSON.stringify(body), { status, headers });
}

const SAMPLE_ARGS = {
  appKey: "mercy_blade",
  anonId: "anon_abc123",
  sessionId: "sess_xyz789",
  conversationId: "conv_111",
  responseId: "resp_222",
  msgId: "msg_333",
  vote: "down" as const,
  feedbackReason: "not_helpful",
  answerText: "Mercy said: try the present perfect here.",
  modelName: "mercy-blade-1",
  promptVersion: "p-7",
  tier: "level0",
  lang: "vi",
  mode: "room",
  path: "/room/some-room",
};

function parseSentEnvelope(
  fetchSpy: ReturnType<typeof vi.fn>,
): FeedbackEnvelope {
  const init = fetchSpy.mock.calls[0][1] as RequestInit;
  return JSON.parse(init.body as string) as FeedbackEnvelope;
}

describe("sendMercyFeedback — /api/mercy-feedback request contract (#745/A12)", () => {
  beforeEach(() => {
    mockResolveApiUrl.mockClear();
    mockResolveApiUrl.mockImplementation((path: string) => path);
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
  });

  it("routes the POST through resolveApiUrl('/api/mercy-feedback')", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: true, acceptedCount: 1 }));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;
    // Simulate a native build pointing at the prod origin — the exact
    // reason resolveApiUrl exists (see src/lib/apiBase.ts). The feedback
    // POST must go through it, not a bare relative fetch.
    mockResolveApiUrl.mockImplementation(
      (path: string) => `https://mercyblade.com${path}`,
    );

    await sendMercyFeedback(SAMPLE_ARGS);

    expect(mockResolveApiUrl).toHaveBeenCalledWith("/api/mercy-feedback");
    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(fetchSpy.mock.calls[0][0]).toBe(
      "https://mercyblade.com/api/mercy-feedback",
    );
    const init = fetchSpy.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(
      (init.headers as Record<string, string>)["Content-Type"],
    ).toBe("application/json");
  });

  it("sends an envelope whose keys match every column api/mercy-feedback.ts reads", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: true, acceptedCount: 1 }));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    await sendMercyFeedback(SAMPLE_ARGS);

    const env = parseSentEnvelope(fetchSpy);

    // Envelope-level keys the handler destructures.
    expect(env.schema).toBe("mb.feedback.v1");
    expect(env.appKey).toBe("mercy_blade");
    expect(env.actor.anonId).toBe(SAMPLE_ARGS.anonId);
    expect(env.actor.sessionId).toBe(SAMPLE_ARGS.sessionId);
    expect(env.context.conversationId).toBe(SAMPLE_ARGS.conversationId);
    expect(env.context.pagePath).toBe(SAMPLE_ARGS.path);
    expect(env.context.mode).toBe(SAMPLE_ARGS.mode);
    expect(env.model.name).toBe(SAMPLE_ARGS.modelName);
    expect(env.model.promptVersion).toBe(SAMPLE_ARGS.promptVersion);

    // Exactly one item, with every field the handler maps onto a
    // mercy_feedback_events column. These are the columns that were
    // silently NULL/absent for months pre-#745.
    expect(env.items).toHaveLength(1);
    expect(env.items[0]).toMatchObject({
      v: 1,
      appKey: SAMPLE_ARGS.appKey,
      authUserId: null,
      tier: SAMPLE_ARGS.tier,
      lang: SAMPLE_ARGS.lang,
      mode: SAMPLE_ARGS.mode,
      path: SAMPLE_ARGS.path,
      msgId: SAMPLE_ARGS.msgId,
      responseId: SAMPLE_ARGS.responseId,
      vote: SAMPLE_ARGS.vote,
      feedbackReason: SAMPLE_ARGS.feedbackReason,
      answerText: SAMPLE_ARGS.answerText,
    });
    expect(typeof env.items[0].ts).toBe("number");
  });

  it("returns the parsed JSON the handler responds with", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: true, acceptedCount: 1 }));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    const result = await sendMercyFeedback(SAMPLE_ARGS);

    expect(result).toEqual({ ok: true, acceptedCount: 1 });
  });

  it("still emits the contract fields when optional inputs fall back to defaults", async () => {
    const fetchSpy = vi
      .fn()
      .mockResolvedValue(jsonResponse({ ok: true, acceptedCount: 1 }));
    globalThis.fetch = fetchSpy as unknown as typeof globalThis.fetch;

    // Only the required ids — feedbackReason/answerText/model omitted.
    // The wire keys must still be PRESENT (null), because the handler
    // does `item.feedbackReason ?? null` etc.: a missing key and an
    // explicit null both map to the column, but a *renamed* key would
    // silently drop the value. Presence is the invariant.
    await sendMercyFeedback({
      appKey: "mercy_blade",
      anonId: "anon_only",
      sessionId: "sess_only",
      conversationId: "conv_only",
      responseId: "resp_only",
      msgId: "msg_only",
      vote: "up",
    });

    const env = parseSentEnvelope(fetchSpy);
    expect(env.items[0]).toHaveProperty("feedbackReason", null);
    expect(env.items[0]).toHaveProperty("answerText", null);
    expect(env.items[0]).toHaveProperty("vote", "up");
    expect(env.items[0]).toHaveProperty("lang", "en"); // default
    expect(env.actor).toHaveProperty("anonId", "anon_only");
  });
});
