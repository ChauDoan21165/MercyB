import { describe, expect, it } from "vitest";
import { createHarness } from "./testHarness.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";

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
});

