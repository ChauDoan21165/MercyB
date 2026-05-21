import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvents,
  createSpeakingQueue,
  drainSpeakingQueue,
  enqueueSpeakingEvent,
  flushSpeakingQueue,
  initOrchestratorState,
  translateSpeakingRuntimeEvent,
} from "../index";
import type { SpeakingRuntimeEvent } from "../index";
import { ORCH_USER, dayMs } from "./orchestrationFixtures";

const TRANSLATE_OPTS = {
  userIdHash: ORCH_USER,
  sessionId: "sess-speak",
  eventIdPrefix: "speak::test",
} as const;

describe("speakingRuntimeAdapter — queue", () => {
  it("enqueue is synchronous and pure (returns new queue)", () => {
    const q = createSpeakingQueue();
    const event: SpeakingRuntimeEvent = {
      type: "speaking_attempt_start",
      lessonId: "l1",
      promptId: "p1",
      attemptOrdinal: 1,
      timestampMs: dayMs(0),
    };
    const q2 = enqueueSpeakingEvent(q, event);
    expect(q.events).toHaveLength(0);
    expect(q2.events).toHaveLength(1);
  });

  it("enqueue NEVER throws on overflow — increments dropped counter instead", () => {
    let q = createSpeakingQueue({ capacity: 2 });
    for (let i = 0; i < 10; i++) {
      q = enqueueSpeakingEvent(q, {
        type: "speaking_attempt_start",
        lessonId: "lx",
        promptId: "p1",
        attemptOrdinal: i + 1,
        timestampMs: dayMs(0) + i,
      });
    }
    expect(q.events.length).toBe(2);
    expect(q.dropped).toBe(8);
  });

  it("flush drains all unflushed events in arrival order", () => {
    let q = createSpeakingQueue();
    for (let i = 1; i <= 4; i++) {
      q = enqueueSpeakingEvent(q, {
        type: "speaking_attempt_start",
        lessonId: "lx",
        promptId: "p1",
        attemptOrdinal: i,
        timestampMs: dayMs(0) + i,
      });
    }
    const seen: number[] = [];
    const result = flushSpeakingQueue(q, {
      onEvent: (ev) => {
        seen.push(ev.timestampMs);
      },
    });
    expect(seen).toEqual([dayMs(0) + 1, dayMs(0) + 2, dayMs(0) + 3, dayMs(0) + 4]);
    expect(result.flushed).toBe(4);
    expect(result.queue.flushedCount).toBe(4);
  });

  it("flush is idempotent — re-flushing already-flushed events emits nothing", () => {
    let q = createSpeakingQueue();
    q = enqueueSpeakingEvent(q, {
      type: "speaking_attempt_start",
      lessonId: "lx",
      promptId: "p1",
      attemptOrdinal: 1,
      timestampMs: dayMs(0),
    });
    const first = flushSpeakingQueue(q, { onEvent: () => {} });
    const seen: SpeakingRuntimeEvent[] = [];
    const second = flushSpeakingQueue(first.queue, {
      onEvent: (e) => seen.push(e),
    });
    expect(second.flushed).toBe(0);
    expect(seen).toHaveLength(0);
  });

  it("flush swallows sink errors without losing the cursor", () => {
    let q = createSpeakingQueue();
    q = enqueueSpeakingEvent(q, {
      type: "speaking_attempt_start",
      lessonId: "lx",
      promptId: "p1",
      attemptOrdinal: 1,
      timestampMs: dayMs(0),
    });
    const result = flushSpeakingQueue(q, {
      onEvent: () => {
        throw new Error("sink boom");
      },
    });
    expect(result.flushed).toBe(1);
    expect(result.queue.flushedCount).toBe(1);
  });
});

describe("speakingRuntimeAdapter — translation", () => {
  it("first attempt → lesson_start orchestration event", () => {
    const ev = translateSpeakingRuntimeEvent(
      {
        type: "speaking_attempt_start",
        lessonId: "l1",
        promptId: "p1",
        attemptOrdinal: 1,
        timestampMs: dayMs(0),
      },
      TRANSLATE_OPTS,
    );
    expect(ev?.type).toBe("lesson_start");
  });

  it("subsequent attempts → null (not double-counted as starts)", () => {
    const ev = translateSpeakingRuntimeEvent(
      {
        type: "speaking_attempt_start",
        lessonId: "l1",
        promptId: "p1",
        attemptOrdinal: 2,
        timestampMs: dayMs(0),
      },
      TRANSLATE_OPTS,
    );
    expect(ev).toBeNull();
  });

  it("attempt_complete → speaking_retry with pronunciation score", () => {
    const ev = translateSpeakingRuntimeEvent(
      {
        type: "speaking_attempt_complete",
        lessonId: "l1",
        promptId: "p1",
        attemptOrdinal: 2,
        pronunciationScore: 0.65,
        timestampMs: dayMs(0),
      },
      TRANSLATE_OPTS,
    );
    expect(ev?.type).toBe("speaking_retry");
  });

  it("speaking_hesitation → hesitation_loop", () => {
    const ev = translateSpeakingRuntimeEvent(
      {
        type: "speaking_hesitation",
        lessonId: "l1",
        loopDurationMs: 8000,
        silenceCount: 2,
        timestampMs: dayMs(0),
      },
      TRANSLATE_OPTS,
    );
    expect(ev?.type).toBe("hesitation_loop");
  });

  it("speaking_skipped → lesson_skip dropoff", () => {
    const ev = translateSpeakingRuntimeEvent(
      {
        type: "speaking_skipped",
        lessonId: "l1",
        progressRatio: 0.3,
        dwellMs: 30_000,
        timestampMs: dayMs(0),
      },
      TRANSLATE_OPTS,
    );
    expect(ev?.type).toBe("lesson_skip");
  });
});

describe("speakingRuntimeAdapter — drain → orchestrator integration", () => {
  it("drain returns orchestration events that apply cleanly", () => {
    let q = createSpeakingQueue();
    q = enqueueSpeakingEvent(q, {
      type: "speaking_attempt_start",
      lessonId: "l1",
      promptId: "p1",
      attemptOrdinal: 1,
      timestampMs: dayMs(0),
    });
    q = enqueueSpeakingEvent(q, {
      type: "speaking_attempt_complete",
      lessonId: "l1",
      promptId: "p1",
      attemptOrdinal: 1,
      pronunciationScore: 0.7,
      timestampMs: dayMs(0) + 30_000,
    });
    const drained = drainSpeakingQueue(q, TRANSLATE_OPTS);
    expect(drained.orchestrationEvents.length).toBeGreaterThan(0);
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      drained.orchestrationEvents,
    );
    expect(state.telemetryEvents.length).toBeGreaterThan(0);
  });

  it("playback-first invariant: enqueue is microbenchmark-fast (purely allocation)", () => {
    // We can't easily measure ms here, but we can assert the function is pure
    // and does not invoke any side effect that could block. The strictest
    // assertion available in vitest is: enqueue does not throw under
    // pathological inputs (e.g. Date.now removed).
    const originalNow = Date.now;
    Date.now = () => {
      throw new Error("Date.now must not be reachable from enqueue");
    };
    try {
      const q = createSpeakingQueue();
      expect(() =>
        enqueueSpeakingEvent(q, {
          type: "speaking_attempt_start",
          lessonId: "l1",
          promptId: "p1",
          attemptOrdinal: 1,
          timestampMs: dayMs(0),
        }),
      ).not.toThrow();
    } finally {
      Date.now = originalNow;
    }
  });
});
