import { describe, expect, it, vi } from "vitest";
import { createHarness } from "./testHarness.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";

describe("placement v3 core actions", () => {
  it("start creates a session and returns first prompt", async () => {
    const h = createHarness();
    const res = await h.run({ action: "start" });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.session.flow_state).toBe("in_progress");
      expect(res.prompt?.modality).toBe("writing");
    }
  });

  it("start while in_progress resumes existing session", async () => {
    const h = createHarness();
    const first = await h.run({ action: "start" });
    const second = await h.run({ action: "start" });
    expect(first.ok && second.ok && first.session.id === second.session.id).toBe(true);
    expect(second.ok && second.resumed).toBe(true);
  });

  it("respond rejects empty text", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: "",
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("empty_response");
  });

  it("respond rejects wrong-language response", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.vietnamese,
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("wrong_language");
  });

  it("respond rejects prompt mismatch", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok) throw new Error("start failed");
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: "wrong",
        responseText: USER_RESPONSES.medium,
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("prompt_mismatch");
  });

  it("abandon marks session abandoned", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok) throw new Error("start failed");
    const res = await h.run({ action: "abandon", sessionId: start.session.id });
    expect(res.ok && res.session.flow_state).toBe("abandoned");
  });

  it("resume returns active prompt", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok) throw new Error("start failed");
    const res = await h.run({ action: "resume", sessionId: start.session.id });
    expect(res.ok && res.prompt?.id).toBe(start.prompt?.id);
  });

  it("status returns current session state without mutation", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok) throw new Error("start failed");
    const res = await h.run({ action: "status", sessionId: start.session.id });
    expect(res.ok && res.session.current_task_index).toBe(0);
  });

  it("duplicate request reaching the function boundary only grades once", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("B1", 0.9),
      version: "mock",
    }));
    const h = createHarness({ grade, insertResponseDelayMs: 20 });
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    const request = {
      action: "respond" as const,
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    };
    const [first, second] = await Promise.all([h.run(request), h.run(request)]);
    expect(first.ok).toBe(true);
    expect(second.ok).toBe(true);
    expect(grade).toHaveBeenCalledTimes(1);
    expect(h.responses.get(start.session.id)).toHaveLength(1);
  });

  it("suppresses fresh partially claimed duplicate deliveries without regrading", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("B1", 0.9),
      version: "mock",
    }));
    const h = createHarness({ grade });
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    h.responses.set(start.session.id, [{
      id: "partial-1",
      session_id: start.session.id,
      task_index: start.session.current_task_index,
      modality: start.prompt.modality,
      prompt_id: start.prompt.id,
      prompt_text: start.prompt.promptText,
      user_response_text: USER_RESPONSES.medium,
      audio_storage_path: null,
      response_duration_ms: null,
      ai_assessment: null,
      ai_assessment_version: null,
      graded_at: null,
      created_at: "2026-05-20T12:00:00.000Z",
    }]);

    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    });

    expect(res.ok).toBe(true);
    expect(grade).not.toHaveBeenCalled();
    expect(h.responses.get(start.session.id)).toHaveLength(1);
    expect(h.deps.log).toHaveBeenCalledWith(
      "placement_v3.response_duplicate_suppressed",
      expect.objectContaining({ graded: false }),
    );
  });

  it("recovers a stale partially persisted response row instead of poisoning the slot", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("B1", 0.9),
      version: "mock",
    }));
    const h = createHarness({ grade });
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    h.responses.set(start.session.id, [{
      id: "partial-1",
      session_id: start.session.id,
      task_index: start.session.current_task_index,
      modality: start.prompt.modality,
      prompt_id: start.prompt.id,
      prompt_text: start.prompt.promptText,
      user_response_text: USER_RESPONSES.medium,
      audio_storage_path: null,
      response_duration_ms: null,
      ai_assessment: null,
      ai_assessment_version: null,
      graded_at: null,
      created_at: "2026-05-20T11:59:00.000Z",
    }]);

    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    });

    expect(res.ok).toBe(true);
    expect(grade).toHaveBeenCalledTimes(1);
    const rows = h.responses.get(start.session.id) ?? [];
    expect(rows).toHaveLength(1);
    expect(rows[0].ai_assessment_version).toBe("mock");
    expect(rows[0].graded_at).toBe("2026-05-20T12:00:00.000Z");
    expect(h.deps.log).toHaveBeenCalledWith(
      "placement_v3.response_slot_recovered",
      expect.objectContaining({ taskIndex: 0 }),
    );
  });

  it("repeated duplicate deliveries after grading converge without duplicate rows", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("B1", 0.9),
      version: "mock",
    }));
    const h = createHarness({ grade });
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    const request = {
      action: "respond" as const,
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    };

    const first = await h.run(request);
    const duplicates = await Promise.all([
      h.run(request),
      h.run(request),
      h.run(request),
    ]);

    expect(first.ok).toBe(true);
    expect(duplicates.every((res) => res.ok)).toBe(true);
    expect(grade).toHaveBeenCalledTimes(1);
    expect(h.responses.get(start.session.id)).toHaveLength(1);
  });

  it("duplicate submit after auth transition cannot claim another user's slot", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("B1", 0.9),
      version: "mock",
    }));
    const h = createHarness({ grade });
    const start = await h.run({ action: "start" }, "user-1");
    if (!start.ok || !start.prompt) throw new Error("start failed");

    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: start.session.current_task_index,
        promptId: start.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    }, "user-2");

    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("session_not_found");
    expect(grade).not.toHaveBeenCalled();
    expect(h.responses.get(start.session.id)).toHaveLength(0);
  });
});
