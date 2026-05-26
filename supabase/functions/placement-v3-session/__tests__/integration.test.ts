import { describe, expect, it } from "vitest";
import { createHarness } from "./testHarness.ts";
import { assessment } from "./fixtures/mock-grader-responses.ts";
import { USER_RESPONSES } from "./fixtures/mock-user-responses.ts";

async function answerCurrent(
  h: ReturnType<typeof createHarness>,
  state: Awaited<ReturnType<ReturnType<typeof createHarness>["run"]>>,
  text = USER_RESPONSES.long,
) {
  if (!state.ok || !state.prompt) throw new Error("No prompt to answer");
  return h.run({
    action: "respond",
    response: {
      sessionId: state.session.id,
      taskIndex: state.session.current_task_index,
      promptId: state.prompt.id,
      responseText: text,
      responseDurationMs: 1000,
    },
  });
}

describe("placement v3 integration flow", () => {
  it("happy path completes and produces expected profile shape", async () => {
    const h = createHarness({
      grade: async () => ({
        ok: true,
        assessment: assessment("B1", 0.9),
        version: "mock",
      }),
    });
    let state = await h.run({ action: "start" });
    for (let i = 0; i < 6 && state.ok && state.prompt; i++) {
      state = await answerCurrent(h, state);
    }
    expect(state.ok).toBe(true);
    if (state.ok) {
      expect(state.session.flow_state).toBe("completed");
      expect(state.profile?.cefr_overall).toBe("B1");
      expect(state.profile?.recommended_lessons).toHaveLength(3);
    }
  });

  it("writes a profiles snapshot on completion (directional carve-out)", async () => {
    // Asserts that the v3 edge function writes its own results to
    // `profiles.placement_*` on completion — the equivalent of v2's
    // `placement-session/index.ts:347-371`. Compliant under the
    // "no Placement writeback" directional carve-out: the placement
    // engine writing its own session is permitted; cross-surface
    // writes (Study OS / memory / AI Tutor → placement) are not.
    const h = createHarness({
      grade: async () => ({
        ok: true,
        assessment: assessment("B1", 0.9),
        version: "mock",
      }),
    });
    expect(h.profileSnapshots).toHaveLength(0);
    let state = await h.run({ action: "start" });
    for (let i = 0; i < 6 && state.ok && state.prompt; i++) {
      state = await answerCurrent(h, state);
    }
    expect(state.ok).toBe(true);
    if (!state.ok) return;

    expect(h.profileSnapshots).toHaveLength(1);
    const snap = h.profileSnapshots[0];
    expect(snap.userId).toBe("user-1");
    expect(snap.sessionId).toBe(state.session.id);
    expect(snap.cefr).toBe("B1");
    expect(snap.startingRoom.length).toBeGreaterThan(0);
    expect(snap.completedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(Array.isArray(snap.weaknessTags)).toBe(true);
    expect(snap.historyEntry.source).toBe("v3");
    expect(snap.historyEntry.bankVersion).toBe("placement-v3-session-v1");
    expect(snap.historyEntry.sessionId).toBe(state.session.id);
    expect(snap.historyEntry.theta).toBeNull();
    expect(snap.historyEntry.se).toBeNull();
  });

  it("abandon path updates status to abandoned", async () => {
    const h = createHarness();
    let state = await h.run({ action: "start" });
    state = await answerCurrent(h, state, USER_RESPONSES.medium);
    state = await answerCurrent(h, state, USER_RESPONSES.medium);
    if (!state.ok) throw new Error("respond failed");
    const abandoned = await h.run({ action: "abandon", sessionId: state.session.id });
    expect(abandoned.ok && abandoned.session.flow_state).toBe("abandoned");
  });

  it("resume path continues after browser close", async () => {
    const h = createHarness();
    let state = await h.run({ action: "start" });
    state = await answerCurrent(h, state, USER_RESPONSES.medium);
    if (!state.ok) throw new Error("respond failed");
    const resumed = await h.run({ action: "resume", sessionId: state.session.id });
    expect(resumed.ok && resumed.prompt?.id).toBe(state.prompt?.id);
    const next = await answerCurrent(h, resumed, USER_RESPONSES.medium);
    expect(next.ok).toBe(true);
  });

  it("grader timeout records recoverable error and continues", async () => {
    const h = createHarness({
      grade: async (input) => ({
        ok: false,
        assessment: {
          overallLevel: "A2",
          confidence: 0.35,
          gaps: ["timeout fallback"],
          metadata: { fallback: true },
        },
        version: "fallback",
        errorCode: "timeout",
        errorMessage: `timeout on ${input.modality}`,
      }),
    });
    const start = await h.run({ action: "start" });
    const next = await answerCurrent(h, start, USER_RESPONSES.medium);
    expect(next.ok).toBe(true);
    if (next.ok) {
      expect(next.session.metadata.errors?.[0].code).toBe("timeout");
      expect(next.prompt).not.toBeNull();
    }
  });

  it("concurrent start collision resumes active session", async () => {
    const h = createHarness();
    const first = await h.run({ action: "start" });
    const second = await h.run({ action: "start" });
    expect(second.ok && second.resumed).toBe(true);
    expect(first.ok && second.ok && first.session.id).toBe(second.ok && second.session.id);
  });

  it("expired session is abandoned on resume", async () => {
    const h = createHarness({ now: "2026-05-20T12:00:00.000Z" });
    const start = await h.run({ action: "start" });
    if (!start.ok) throw new Error("start failed");
    h.sessions.set(start.session.id, {
      ...start.session,
      updated_at: "2026-05-19T00:00:00.000Z",
    });
    const resumed = await h.run({ action: "resume", sessionId: start.session.id });
    expect(resumed.ok && resumed.session.flow_state).toBe("abandoned");
  });

  it("duplicate response does not insert a second row", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    const first = await answerCurrent(h, start, USER_RESPONSES.medium);
    if (!start.ok) throw new Error("start failed");
    const duplicate = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt?.id,
        responseText: USER_RESPONSES.medium,
      },
    });
    expect(first.ok).toBe(true);
    expect(duplicate.ok).toBe(true);
    expect(h.responses.get(start.session.id)).toHaveLength(1);
  });

  it("rejects 10000+ word adversarial input", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    if (!start.ok || !start.prompt) throw new Error("start failed");
    const huge = Array.from({ length: 10_001 }, () => "word").join(" ");
    const res = await h.run({
      action: "respond",
      response: {
        sessionId: start.session.id,
        taskIndex: 0,
        promptId: start.prompt.id,
        responseText: huge,
      },
    });
    expect(res.ok).toBe(false);
    expect(!res.ok && res.error).toBe("response_too_long");
  });

  it("copied prompt is accepted but graded low by stub", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    const next = await answerCurrent(h, start, USER_RESPONSES.copied);
    if (!start.ok) throw new Error("start failed");
    const rows = h.responses.get(start.session.id) ?? [];
    expect(next.ok).toBe(true);
    expect(rows[0].ai_assessment?.gaps).toContain("Copies the prompt instead of answering it.");
  });

  it("emoji and formatting characters do not crash grading", async () => {
    const h = createHarness();
    const start = await h.run({ action: "start" });
    const next = await answerCurrent(
      h,
      start,
      "I can explain my plan clearly. **Step one**: learn daily. 😊 console.log('x')",
    );
    expect(next.ok).toBe(true);
  });
});

