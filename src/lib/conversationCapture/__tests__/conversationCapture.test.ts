import { vi, describe, it, expect, beforeEach } from "vitest";

// Chainable Supabase mock that records every insert/update so we can assert on
// the exact rows the capture module pushes. insert()/update().eq() are
// awaitable; overridable to reject for the fail-silent tests.
const h = vi.hoisted(() => {
  const inserts: Array<{ table: string; payload: unknown }> = [];
  const updates: Array<{ table: string; patch: unknown; eq: { col: string; val: unknown } }> = [];
  let insertImpl: null | (() => unknown) = null;
  let updateImpl: null | (() => unknown) = null;

  const makeBuilder = (table: string) => ({
    insert: (payload: unknown) => {
      inserts.push({ table, payload });
      if (insertImpl) return insertImpl();
      return Promise.resolve({ data: null, error: null });
    },
    update: (patch: unknown) => ({
      eq: (col: string, val: unknown) => {
        updates.push({ table, patch, eq: { col, val } });
        if (updateImpl) return updateImpl();
        return Promise.resolve({ data: null, error: null });
      },
    }),
  });

  return {
    inserts,
    updates,
    setInsertImpl: (fn: null | (() => unknown)) => {
      insertImpl = fn;
    },
    setUpdateImpl: (fn: null | (() => unknown)) => {
      updateImpl = fn;
    },
    reset: () => {
      inserts.length = 0;
      updates.length = 0;
      insertImpl = null;
      updateImpl = null;
    },
    supabase: { from: (table: string) => makeBuilder(table) },
  };
});

vi.mock("@/lib/supabaseClient", () => ({ supabase: h.supabase }));

import { startSession, logTurn, endSession } from "@/lib/conversationCapture/conversationCapture";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

beforeEach(() => {
  h.reset();
});

describe("startSession", () => {
  it("inserts a conversations row and returns a uuid session id", async () => {
    const id = await startSession("user-123", "banking");
    expect(id).toMatch(UUID_RE);

    expect(h.inserts).toHaveLength(1);
    const { table, payload } = h.inserts[0];
    expect(table).toBe("conversations");
    expect(payload).toMatchObject({
      id,
      user_id: "user-123",
      theme_id: "banking",
    });
    expect((payload as { started_at: string }).started_at).toEqual(expect.any(String));
  });

  it("stores theme_id null when omitted", async () => {
    await startSession("user-123");
    expect((h.inserts[0].payload as { theme_id: unknown }).theme_id).toBeNull();
  });

  it("returns null and writes nothing when userId is missing", async () => {
    expect(await startSession("")).toBeNull();
    expect(await startSession("   ")).toBeNull();
    expect(h.inserts).toHaveLength(0);
  });

  it("still resolves to an id when the insert rejects (fail-silent)", async () => {
    h.setInsertImpl(() => Promise.reject(new Error("network down")));
    const id = await startSession("user-123", "banking");
    expect(id).toMatch(UUID_RE);
  });
});

describe("logTurn", () => {
  it("inserts a single turn_completed event with input + response", async () => {
    await logTurn("sess-1", 3, "I goed to school", "I went to school");

    expect(h.inserts).toHaveLength(1);
    const { table, payload } = h.inserts[0];
    expect(table).toBe("conversation_events");
    const rows = payload as Array<Record<string, unknown>>;
    expect(rows).toHaveLength(1);
    expect(rows[0]).toMatchObject({
      conversation_id: "sess-1",
      turn_number: 3,
      event_type: "turn_completed",
      learner_input: "I goed to school",
      ai_response: "I went to school",
      error_details: null,
    });
  });

  it("batches turn + error + correction rows in one insert with correct event types", async () => {
    await logTurn(
      "sess-1",
      1,
      "I goed",
      "Try: I went",
      [{ errorType: "grammar", learnerText: "goed", correctedText: "went" }],
      [
        { accepted: true, correctedText: "went" },
        { accepted: false, correctedText: "gone" },
      ],
    );

    expect(h.inserts).toHaveLength(1);
    const rows = h.inserts[0].payload as Array<Record<string, unknown>>;
    expect(rows.map((r) => r.event_type)).toEqual([
      "turn_completed",
      "error_detected",
      "correction_accepted",
      "correction_rejected",
    ]);

    const errorRow = rows[1];
    expect(errorRow.error_details).toMatchObject({ errorType: "grammar", correctedText: "went" });
    expect(errorRow.ai_response).toBeNull();

    const acceptedRow = rows[2];
    expect(acceptedRow.ai_response).toBe("went");
    expect(acceptedRow.error_details).toMatchObject({ accepted: true });
  });

  it("no-ops on a falsy sessionId", async () => {
    await logTurn("", 1, "hi", "hello");
    await logTurn(null, 1, "hi", "hello");
    await logTurn(undefined, 1, "hi", "hello");
    expect(h.inserts).toHaveLength(0);
  });

  it("does not throw when the insert rejects (fail-silent)", async () => {
    h.setInsertImpl(() => Promise.reject(new Error("boom")));
    await expect(logTurn("sess-1", 1, "hi", "hello")).resolves.toBeUndefined();
  });
});

describe("endSession", () => {
  it("stamps ended_at and writes a string summary, filtered by id", async () => {
    await endSession("sess-1", "Bạn nói 5 lượt — giỏi lắm!");

    expect(h.updates).toHaveLength(1);
    const { table, patch, eq } = h.updates[0];
    expect(table).toBe("conversations");
    expect(eq).toEqual({ col: "id", val: "sess-1" });
    expect(patch).toMatchObject({ summary: "Bạn nói 5 lượt — giỏi lắm!" });
    expect((patch as { ended_at: string }).ended_at).toEqual(expect.any(String));
  });

  it("writes the rollup count columns from a summary object", async () => {
    await endSession("sess-1", {
      turnCount: 5,
      errorsDetected: 2,
      correctionsAccepted: 1,
      text: "recap",
    });

    expect(h.updates[0].patch).toMatchObject({
      turn_count: 5,
      errors_detected: 2,
      corrections_accepted: 1,
      summary: "recap",
    });
  });

  it("omits count columns that were not supplied", async () => {
    await endSession("sess-1", { turnCount: 4 });
    const patch = h.updates[0].patch as Record<string, unknown>;
    expect(patch).toHaveProperty("turn_count", 4);
    expect(patch).not.toHaveProperty("errors_detected");
    expect(patch).not.toHaveProperty("corrections_accepted");
  });

  it("no-ops on a falsy sessionId", async () => {
    await endSession("", "x");
    await endSession(null, "x");
    expect(h.updates).toHaveLength(0);
  });

  it("does not throw when the update rejects (fail-silent)", async () => {
    h.setUpdateImpl(() => Promise.reject(new Error("boom")));
    await expect(endSession("sess-1", "x")).resolves.toBeUndefined();
  });
});
