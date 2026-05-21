import { describe, expect, it, vi } from "vitest";
import { createHarness } from "./testHarness.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";

describe("placement v3 auth and session ownership boundary", () => {
  it("rejects unauthenticated start, resume, and submit attempts", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" }, "");
    const resume = await h.run({ action: "resume", sessionId: "session-1" }, "");
    const submit = await h.run({
      action: "respond",
      response: {
        sessionId: "session-1",
        taskIndex: 0,
        promptId: "prompt-1",
        responseText: USER_RESPONSES.medium,
      },
    }, "");

    for (const result of [start, resume, submit]) {
      expect(result.ok).toBe(false);
      expect(!result.ok && result.error).toBe("auth_required");
      expect(!result.ok && result.status).toBe(401);
    }
    expect(h.sessions.size).toBe(0);
    expect(h.responses.size).toBe(0);
  });

  it("prevents learner B from resuming learner A's session", async () => {
    const h = createHarness();
    const learnerAStart = await h.run({ action: "start" }, "learner-a");
    if (!learnerAStart.ok) throw new Error("learner A start failed");

    const learnerBResume = await h.run({
      action: "resume",
      sessionId: learnerAStart.session.id,
    }, "learner-b");

    expect(learnerBResume.ok).toBe(false);
    expect(!learnerBResume.ok && learnerBResume.error).toBe("session_not_found");
    expect(!learnerBResume.ok && learnerBResume.status).toBe(404);
  });

  it("rejects learner B's submit against learner A's session without writing grading rows", async () => {
    const grade = vi.fn(async () => ({
      ok: true,
      assessment: assessment("A2", 0.8),
      version: "mock",
    }));
    const h = createHarness({ grade });
    const learnerAStart = await h.run({ action: "start" }, "learner-a");
    if (!learnerAStart.ok || !learnerAStart.prompt) throw new Error("learner A start failed");

    const learnerBSubmit = await h.run({
      action: "respond",
      response: {
        sessionId: learnerAStart.session.id,
        taskIndex: learnerAStart.session.current_task_index,
        promptId: learnerAStart.prompt.id,
        responseText: USER_RESPONSES.medium,
      },
    }, "learner-b");

    expect(learnerBSubmit.ok).toBe(false);
    expect(!learnerBSubmit.ok && learnerBSubmit.error).toBe("session_not_found");
    expect(grade).not.toHaveBeenCalled();
    expect(h.responses.get(learnerAStart.session.id)).toHaveLength(0);
  });

  it("treats a stale session id after logout/login switch as not found", async () => {
    const h = createHarness();
    const learnerAStart = await h.run({ action: "start" }, "learner-a");
    if (!learnerAStart.ok) throw new Error("learner A start failed");

    const learnerBStart = await h.run({ action: "start" }, "learner-b");
    const learnerBStatusForAId = await h.run({
      action: "status",
      sessionId: learnerAStart.session.id,
    }, "learner-b");

    expect(learnerBStart.ok).toBe(true);
    expect(learnerBStart.ok && learnerBStart.session.id).not.toBe(learnerAStart.session.id);
    expect(learnerBStatusForAId.ok).toBe(false);
    expect(!learnerBStatusForAId.ok && learnerBStatusForAId.error).toBe("session_not_found");
  });
});
