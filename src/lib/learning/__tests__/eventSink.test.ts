import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createLearningEventSink,
  toLearningEventRow,
  type InsertResult,
  type LearningEventRow,
} from "@/lib/learning/eventSink";
import type { LearningEvent } from "@/lib/tutor/learningEvents";

// Explicitly-typed insert mock: without the signature, vi.fn() infers an
// empty-args tuple (mock.calls[0][0] → TS2493) and pins the return type to the
// first literal (so a later { error: null } fails). Typing it fixes both.
type InsertFn = (rows: LearningEventRow[]) => Promise<InsertResult>;
const insertMock = (impl: InsertFn) => vi.fn<InsertFn>(impl);

// A tiny in-memory stand-in for the localStorage queue that honours the real
// drain semantics: peek returns oldest-first; ack removes by id.
function makeFakeQueue(seed: LearningEvent[]) {
  let queue = [...seed];
  return {
    peek: (limit: number) => [...queue].sort((a, b) => a.timestamp - b.timestamp).slice(0, limit),
    ack: (ids: string[]) => {
      const set = new Set(ids);
      queue = queue.filter((e) => !(e.id && set.has(e.id)));
    },
    remaining: () => queue,
  };
}

function ev(id: string, t: number, over: Partial<LearningEvent> = {}): LearningEvent {
  return { id, eventType: "lesson_started", product: "ai_tutor", targetLanguage: "en", timestamp: t, sessionId: "s1", ...over };
}

describe("learning eventSink", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("toLearningEventRow carries only allowlisted, non-PII fields", () => {
    const row = toLearningEventRow(
      ev("id-1", 1000, { mode: "grammar", safeTopicTag: "past-tense", count: 2, ruleOrDetectorId: "l1:past" }),
      "user-abc",
      "v9.9.9",
    );
    expect(row).toEqual<LearningEventRow>({
      user_id: "user-abc",
      event_type: "lesson_started",
      rule_or_detector_id: "l1:past",
      payload: { product: "ai_tutor", target_language: "en", mode: "grammar", safe_topic_tag: "past-tense", count: 2 },
      client_ts: new Date(1000).toISOString(),
      session_id: "s1",
      app_version: "v9.9.9",
    });
    // No raw text/audio/transcript keys can appear.
    expect(JSON.stringify(row)).not.toMatch(/transcript|audio|learnerText|jwt/i);
  });

  it("flushes a batch and acks only on a successful insert", async () => {
    const q = makeFakeQueue([ev("a", 1), ev("b", 2), ev("c", 3)]);
    const insertRows = insertMock(async () => ({ error: null }));
    const sink = createLearningEventSink({
      enabled: true, peek: q.peek, ack: q.ack, insertRows,
      getUserId: async () => "user-1", batchSize: 2, now: () => 0,
    });

    const out = await sink.flush();

    expect(out.flushed).toBe(2);
    expect(insertRows).toHaveBeenCalledTimes(1);
    const rows = insertRows.mock.calls[0][0];
    expect(rows.map((r) => r.event_type)).toHaveLength(2);
    expect(rows.every((r) => r.user_id === "user-1")).toBe(true);
    // a,b acked; c remains.
    expect(q.remaining().map((e) => e.id)).toEqual(["c"]);
  });

  it("does NOT ack and backs off when the insert errors (queue intact)", async () => {
    const q = makeFakeQueue([ev("a", 1), ev("b", 2)]);
    const insertRows = insertMock(async () => ({ error: { message: "network down" } }));
    let clock = 0;
    const sink = createLearningEventSink({
      enabled: true, peek: q.peek, ack: q.ack, insertRows,
      getUserId: async () => "user-1", now: () => clock,
    });

    const first = await sink.flush();
    expect(first.flushed).toBe(0);
    expect(first.error).toBeTruthy();
    expect(q.remaining().map((e) => e.id)).toEqual(["a", "b"]); // nothing lost

    // Immediately retrying is suppressed by backoff.
    const suppressed = await sink.flush();
    expect(suppressed.skipped).toBe("backoff");
    expect(insertRows).toHaveBeenCalledTimes(1);

    // After the backoff window, it retries.
    clock = 10 * 60_000;
    insertRows.mockResolvedValueOnce({ error: null });
    const recovered = await sink.flush();
    expect(recovered.flushed).toBe(2);
    expect(q.remaining()).toEqual([]);
  });

  it("skips when signed out (cannot satisfy RLS user_id = auth.uid())", async () => {
    const q = makeFakeQueue([ev("a", 1)]);
    const insertRows = insertMock(async () => ({ error: null }));
    const sink = createLearningEventSink({
      enabled: true, peek: q.peek, ack: q.ack, insertRows,
      getUserId: async () => null, now: () => 0,
    });

    const out = await sink.flush();
    expect(out.skipped).toBe("signed_out");
    expect(insertRows).not.toHaveBeenCalled();
    expect(q.remaining().map((e) => e.id)).toEqual(["a"]); // untouched
  });

  it("is a no-op when disabled (flush skipped, start schedules no timer)", async () => {
    const insertRows = insertMock(async () => ({ error: null }));
    const peek = vi.fn(() => [] as LearningEvent[]);
    const setIntervalSpy = vi.spyOn(globalThis, "setInterval");

    const sink = createLearningEventSink({ enabled: false, insertRows, peek, getUserId: async () => "u" });
    expect(sink.isEnabled()).toBe(false);

    // start() must not schedule an interval or drain anything when disabled.
    sink.start();
    expect(setIntervalSpy).not.toHaveBeenCalled();
    expect(peek).not.toHaveBeenCalled();

    expect((await sink.flush()).skipped).toBe("disabled");
    expect(insertRows).not.toHaveBeenCalled();

    sink.stop();
    setIntervalSpy.mockRestore();
  });

  it("maybeFlushOnSize only flushes at or above the threshold", async () => {
    const q = makeFakeQueue([ev("a", 1), ev("b", 2)]);
    const insertRows = insertMock(async () => ({ error: null }));
    const sink = createLearningEventSink({
      enabled: true, peek: q.peek, ack: q.ack, insertRows,
      getUserId: async () => "u", sizeThreshold: 3, now: () => 0,
    });

    expect((await sink.maybeFlushOnSize()).skipped).toBe("empty"); // 2 < 3
    expect(insertRows).not.toHaveBeenCalled();

    q.ack([]); // no-op; now push size to threshold
    const q2 = makeFakeQueue([ev("a", 1), ev("b", 2), ev("c", 3)]);
    const sink2 = createLearningEventSink({
      enabled: true, peek: q2.peek, ack: q2.ack, insertRows,
      getUserId: async () => "u", sizeThreshold: 3, now: () => 0,
    });
    expect((await sink2.maybeFlushOnSize()).flushed).toBe(3);
  });
});
