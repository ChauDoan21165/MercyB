import { describe, expect, it } from "vitest";
import { createHarness } from "./testHarness.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";

async function started(h: ReturnType<typeof createHarness>) {
  const res = await h.run({ action: "start" });
  if (!res.ok || !res.prompt) throw new Error("start failed");
  return res;
}

async function answer(
  h: ReturnType<typeof createHarness>,
  state: Awaited<ReturnType<ReturnType<typeof createHarness>["run"]>>,
  text = USER_RESPONSES.medium,
) {
  if (!state.ok || !state.prompt) throw new Error("state has no prompt");
  return h.run({
    action: "respond",
    response: {
      sessionId: state.session.id,
      taskIndex: state.session.current_task_index,
      promptId: state.prompt.id,
      responseText: text,
    },
  });
}

describe("placement v3 orchestration edge cases", () => {
  it("start abandons expired active session and creates a fresh one", async () => {
    const h = createHarness({ now: "2026-05-20T12:00:00.000Z" });
    const first = await started(h);
    h.sessions.set(first.session.id, {
      ...first.session,
      updated_at: "2026-05-19T00:00:00.000Z",
    });
    const second = await h.run({ action: "start" });
    expect(second.ok).toBe(true);
    if (second.ok) {
      expect(second.session.id).not.toBe(first.session.id);
      expect(h.sessions.get(first.session.id)?.flow_state).toBe("abandoned");
    }
  });

  it("resume abandoned session refuses terminal state", async () => {
    const h = createHarness();
    const first = await started(h);
    await h.run({ action: "abandon", sessionId: first.session.id });
    const resumed = await h.run({ action: "resume", sessionId: first.session.id });
    expect(resumed.ok).toBe(false);
    expect(!resumed.ok && resumed.error).toBe("session_abandoned");
  });

  it("respond to completed session returns existing final profile", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("B2", 0.9), version: "mock" }),
    });
    let state = await h.run({ action: "start" });
    for (let i = 0; i < 5 && state.ok && state.prompt; i++) {
      state = await answer(h, state, USER_RESPONSES.long);
    }
    if (!state.ok) throw new Error("flow failed");
    const done = await h.run({
      action: "respond",
      response: {
        sessionId: state.session.id,
        taskIndex: state.session.current_task_index,
        responseText: USER_RESPONSES.long,
      },
    });
    expect(done.ok).toBe(true);
    if (done.ok) {
      expect(done.session.flow_state).toBe("completed");
      expect(done.profile?.cefr_overall).toBe("B2");
    }
  });

  it("status on completed session includes profile", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("A2", 0.9), version: "mock" }),
    });
    let state = await h.run({ action: "start" });
    for (let i = 0; i < 5 && state.ok && state.prompt; i++) {
      state = await answer(h, state);
    }
    if (!state.ok) throw new Error("flow failed");
    const status = await h.run({ action: "status", sessionId: state.session.id });
    expect(status.ok).toBe(true);
    if (status.ok) expect(status.profile?.cefr_overall).toBe("A2");
  });

  it("status without a session returns not found", async () => {
    const h = createHarness();
    const status = await h.run({ action: "status" });
    expect(status.ok).toBe(false);
    expect(!status.ok && status.status).toBe(404);
  });

  it("respond with unknown session returns not found", async () => {
    const h = createHarness();
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: "missing",
        taskIndex: 0,
        responseText: USER_RESPONSES.medium,
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("session_not_found");
  });

  it("respond rejects negative task index", async () => {
    const h = createHarness();
    const start = await started(h);
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: -1,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("invalid_task_index");
  });

  it("low-confidence grader keeps modality before moving on", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("A2", 0.4), version: "mock" }),
    });
    const start = await started(h);
    const next = await answer(h, start);
    expect(next.ok).toBe(true);
    if (next.ok) expect(next.prompt?.modality).toBe("writing");
  });

  it("three low-confidence attempts force modality advance", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("A2", 0.4), version: "mock" }),
    });
    let state = await h.run({ action: "start" });
    state = await answer(h, state);
    state = await answer(h, state);
    state = await answer(h, state);
    expect(state.ok).toBe(true);
    if (state.ok) expect(state.prompt?.modality).toBe("speaking");
  });

  it("max total tasks completes even if modalities remain low confidence", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("A2", 0.1), version: "mock" }),
    });
    let state = await h.run({ action: "start" });
    for (let i = 0; i < 12 && state.ok && state.prompt; i++) {
      state = await answer(h, state);
    }
    expect(state.ok).toBe(true);
    if (state.ok) {
      expect(state.session.flow_state).toBe("completed");
      expect((h.responses.get(state.session.id) ?? []).length).toBeLessThanOrEqual(11);
    }
  });

  it("new completed profile marks previous profile not current", async () => {
    const h = createHarness({
      grade: async () => ({ ok: true, assessment: assessment("B1", 0.9), version: "mock" }),
    });
    let first = await h.run({ action: "start" });
    for (let i = 0; i < 5 && first.ok && first.prompt; i++) first = await answer(h, first);
    if (!first.ok) throw new Error("first failed");

    const oldId = first.session.id;
    h.sessions.set(oldId, { ...first.session, flow_state: "completed" });
    const second = await h.run({ action: "start" });
    expect(second.ok).toBe(true);
    if (second.ok) expect(second.session.id).not.toBe(oldId);
  });

  it("database insert failure propagates for Sentry wrapper", async () => {
    const h = createHarness();
    h.deps.insertResponse = async () => {
      throw new Error("insert failed");
    };
    const start = await started(h);
    await expect(answer(h, start)).rejects.toThrow("insert failed");
  });

  it("malformed grader fallback still persists assessment metadata", async () => {
    const h = createHarness({
      grade: async () => ({
        ok: false,
        assessment: {
          overallLevel: "A1",
          confidence: 0.35,
          metadata: { errorCode: "malformed_json", fallback: true },
        },
        version: "fallback",
        errorCode: "malformed_json",
        errorMessage: "bad JSON",
      }),
    });
    const start = await started(h);
    const next = await answer(h, start);
    const row = h.responses.get(start.session.id)?.[0];
    expect(next.ok).toBe(true);
    expect(row?.ai_assessment?.metadata?.errorCode).toBe("malformed_json");
  });

  it("English with a small Vietnamese transfer note is accepted", async () => {
    const h = createHarness();
    const start = await started(h);
    const res = await answer(
      h,
      start,
      "I want to improve my English because my Vietnamese habit makes articles hard.",
    );
    expect(res.ok).toBe(true);
  });
});

