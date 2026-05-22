// Placement v4 — speaking-runtime adaptive integration.
//
// CRITICAL non-functional constraint: the speaking runtime on iOS Safari
// must produce first audible output synchronously inside the user-gesture
// stack. Adaptive processing CANNOT block, throw, or delay that path.
//
// Design:
//   1. The speaking runtime calls `enqueueSpeakingEvent(queue, event)` —
//      a synchronous, exception-free, allocation-light append.
//   2. The runtime continues with playback immediately.
//   3. AFTER first audible output (or at a natural batch boundary, e.g.
//      onended), the runtime calls `flushSpeakingQueue(queue, sink)` to hand
//      events into the orchestrator. flushSpeakingQueue is the only path
//      where adaptive processing happens.
//
// This file intentionally never imports React or DOM types; it can be used
// from worker contexts, vanilla JS callbacks, or React event handlers.

import type { Skill } from "./adaptiveTelemetryTypes";

// ---------------------------------------------------------------------------
// Queue surface
// ---------------------------------------------------------------------------

export type SpeakingRuntimeEvent =
  | {
      type: "speaking_attempt_start";
      lessonId: string;
      promptId: string;
      attemptOrdinal: number;
      timestampMs: number;
    }
  | {
      type: "speaking_attempt_complete";
      lessonId: string;
      promptId: string;
      attemptOrdinal: number;
      pronunciationScore: number;
      timestampMs: number;
    }
  | {
      type: "speaking_hesitation";
      lessonId: string;
      loopDurationMs: number;
      silenceCount: number;
      timestampMs: number;
    }
  | {
      type: "speaking_skipped";
      lessonId: string;
      progressRatio: number;
      dwellMs: number;
      timestampMs: number;
    };

export interface SpeakingQueue {
  /** Append-only FIFO of events the runtime has emitted. */
  events: readonly SpeakingRuntimeEvent[];
  /** Bounded length so accidental loops can't OOM the device. Default 4096. */
  capacity: number;
  /** Count of events dropped because the queue overflowed. */
  dropped: number;
  /** Cursor at which the next flush should start. Advances on flush. */
  flushedCount: number;
}

export interface SpeakingQueueOptions {
  capacity?: number;
}

export function createSpeakingQueue(
  options: SpeakingQueueOptions = {},
): SpeakingQueue {
  return {
    events: [],
    capacity: options.capacity ?? 4096,
    dropped: 0,
    flushedCount: 0,
  };
}

/**
 * Synchronous, exception-free enqueue.
 *
 * Returns a NEW queue value (immutable update) so the caller can store it
 * back into its state container without sharing references across renders.
 * If the queue is full the event is dropped and `dropped` increments — we
 * never block or throw on overflow.
 */
export function enqueueSpeakingEvent(
  queue: SpeakingQueue,
  event: SpeakingRuntimeEvent,
): SpeakingQueue {
  if (queue.events.length >= queue.capacity) {
    return { ...queue, dropped: queue.dropped + 1 };
  }
  return {
    ...queue,
    events: [...queue.events, event],
  };
}

// ---------------------------------------------------------------------------
// Flush — adaptive processing happens here, off the playback path
// ---------------------------------------------------------------------------

export interface SpeakingFlushSink {
  /** Called once per still-unflushed event in arrival order. */
  onEvent(event: SpeakingRuntimeEvent): void;
}

export interface FlushResult {
  queue: SpeakingQueue;
  flushed: number;
}

/**
 * Drain unflushed events into a sink. The sink receives events in original
 * arrival order (NOT sorted), so the sink (typically the orchestrator
 * adapter) can apply its own canonicalization.
 *
 * If the sink throws on a specific event, the cursor still advances past
 * that event so a malformed item cannot wedge the queue. The error is
 * collected and returned via the caught list rather than re-thrown — again
 * to preserve the playback-first invariant.
 */
export function flushSpeakingQueue(
  queue: SpeakingQueue,
  sink: SpeakingFlushSink,
): FlushResult {
  let flushed = 0;
  for (let i = queue.flushedCount; i < queue.events.length; i++) {
    const ev = queue.events[i];
    try {
      sink.onEvent(ev);
    } catch {
      // Intentionally swallowed: see above.
    }
    flushed += 1;
  }
  return {
    queue: {
      ...queue,
      flushedCount: queue.events.length,
    },
    flushed,
  };
}

// ---------------------------------------------------------------------------
// Convenience: convert a speaking-runtime event into orchestration events
// the adaptiveOrchestrator can apply.
// ---------------------------------------------------------------------------

import type { OrchestrationEvent } from "./adaptiveOrchestrator";

export interface SpeakingTranslateOptions {
  userIdHash: string;
  sessionId: string;
  /**
   * Stable id-prefix string the caller derives — typically
   * `${sessionId}-speak-${monotonicSeq}`. The translator does NOT generate
   * any randomness; the same input always yields the same output.
   */
  eventIdPrefix: string;
}

/**
 * Translate a single SpeakingRuntimeEvent into the OrchestrationEvent shape
 * the orchestrator reducer accepts. Pure function; no Date.now.
 */
export function translateSpeakingRuntimeEvent(
  event: SpeakingRuntimeEvent,
  opts: SpeakingTranslateOptions,
): OrchestrationEvent | null {
  const baseCtx = {
    userIdHash: opts.userIdHash,
    sessionId: opts.sessionId,
    nowMs: event.timestampMs,
    eventIdPrefix: opts.eventIdPrefix,
  } as const;
  switch (event.type) {
    case "speaking_attempt_start": {
      // Speaking starts are recorded as lesson_start events for the lesson
      // when this is the first attempt; subsequent attempts are no-ops at
      // the orchestrator level (each retry comes through speaking_retry).
      if (event.attemptOrdinal === 1) {
        return {
          type: "lesson_start",
          ctx: baseCtx,
          input: {
            lessonId: event.lessonId,
            skill: "speaking" as Skill,
          },
        };
      }
      return null;
    }
    case "speaking_attempt_complete": {
      return {
        type: "speaking_retry",
        ctx: baseCtx,
        input: {
          lessonId: event.lessonId,
          promptId: event.promptId,
          attemptOrdinal: event.attemptOrdinal,
          pronunciationScore: event.pronunciationScore,
        },
      };
    }
    case "speaking_hesitation": {
      return {
        type: "hesitation_loop",
        ctx: baseCtx,
        input: {
          lessonId: event.lessonId,
          loopDurationMs: event.loopDurationMs,
          silenceCount: event.silenceCount,
        },
      };
    }
    case "speaking_skipped": {
      return {
        type: "lesson_skip",
        ctx: baseCtx,
        input: {
          lessonId: event.lessonId,
          progressRatio: event.progressRatio,
          dwellMs: event.dwellMs,
        },
      };
    }
  }
}

// ---------------------------------------------------------------------------
// Public convenience: queue + translate + return ordered orchestration events
// ---------------------------------------------------------------------------

export interface DrainResult {
  queue: SpeakingQueue;
  orchestrationEvents: readonly OrchestrationEvent[];
}

/**
 * Drain the queue and return orchestration events. The host then folds these
 * into the orchestrator state via applyOrchestrationEvents.
 */
export function drainSpeakingQueue(
  queue: SpeakingQueue,
  opts: SpeakingTranslateOptions,
): DrainResult {
  const out: OrchestrationEvent[] = [];
  let seq = 0;
  const flush = flushSpeakingQueue(queue, {
    onEvent: (ev) => {
      seq += 1;
      const scopedOpts: SpeakingTranslateOptions = {
        ...opts,
        eventIdPrefix: `${opts.eventIdPrefix}::${seq.toString().padStart(4, "0")}`,
      };
      const translated = translateSpeakingRuntimeEvent(ev, scopedOpts);
      if (translated) out.push(translated);
    },
  });
  return { queue: flush.queue, orchestrationEvents: out };
}
