import { describe, expect, it } from "vitest";

import { buildFailureTimeline } from "@/lib/placementForensics/buildFailureTimeline";
import {
  isPlacementForensicEventType,
  isPlacementRecoverabilityState,
  sortPlacementEvents,
  type PlacementForensicEvent,
} from "@/types/placementForensics";

function base(
  sequence: number,
  overrides: Partial<PlacementForensicEvent> & {
    type: PlacementForensicEvent["type"];
    step: string;
    message: string;
  },
): PlacementForensicEvent {
  return {
    id: `evt-${sequence}`,
    sessionId: "session-a2",
    correlationId: "corr-a2",
    occurredAt: new Date(Date.UTC(2026, 4, 20, 18, 0, sequence)).toISOString(),
    sequence,
    severity: overrides.severity ?? "info",
    ...overrides,
  } as PlacementForensicEvent;
}

describe("Placement V3 forensics timeline reconstruction", () => {
  it("sorts events by sequence before timestamp", () => {
    const sorted = sortPlacementEvents([
      base(3, { type: "session_event", step: "c", message: "c", sessionState: "in_progress" }),
      base(1, { type: "session_event", step: "a", message: "a", sessionState: "created" }),
    ]);
    expect(sorted.map((event) => event.sequence)).toEqual([1, 3]);
  });

  it("detects missing event sequences", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "session_event", step: "start", message: "started", sessionState: "in_progress" }),
      base(4, { type: "session_event", step: "end", message: "ended", sessionState: "failed" }),
    ]);
    expect(timeline.missingSequences).toEqual([2, 3]);
  });

  it("records retry attempts and max attempts", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "retry_event", step: "grader.retry", message: "retry", attempt: 1, maxAttempts: 2, reason: "timeout" }),
    ]);
    expect(timeline.retries).toEqual([
      { atSequence: 1, attempt: 1, maxAttempts: 2, reason: "timeout" },
    ]);
  });

  it("flags retry attempts that exceed the configured max", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "retry_event", step: "grader.retry", message: "retry", attempt: 3, maxAttempts: 2, reason: "timeout" }),
    ]);
    expect(timeline.inconsistentRetries[0]).toMatch(/exceeds max/);
  });

  it("flags retry attempt regressions", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "retry_event", step: "grader.retry", message: "retry", attempt: 2, maxAttempts: 3, reason: "timeout" }),
      base(2, { type: "retry_event", step: "grader.retry", message: "retry", attempt: 1, maxAttempts: 3, reason: "timeout" }),
    ]);
    expect(timeline.inconsistentRetries[0]).toMatch(/regressed/);
  });

  it("records explicit fallback transitions", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "fallback_event", step: "provider.fallback", message: "fallback", from: "openai", to: "gemini", reason: "timeout" }),
    ]);
    expect(timeline.fallbacks).toEqual([
      { atSequence: 1, from: "openai", to: "gemini", reason: "timeout" },
    ]);
  });

  it("records implicit provider switches from provider events", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "provider_event", step: "provider", message: "openai", provider: "openai", attempt: 1, status: "timeout" }),
      base(2, { type: "provider_event", step: "provider", message: "gemini", provider: "gemini", attempt: 2, status: "success" }),
    ]);
    expect(timeline.providerSwitches).toEqual([
      { atSequence: 2, from: "openai", to: "gemini", reason: "success" },
    ]);
  });

  it("marks degraded results as degraded safe when recoverability is unknown", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "degraded_result", step: "grader.fallback", message: "fallback", marker: "heuristic_grade", userVisible: true }),
    ]);
    expect(timeline.degraded).toBe(true);
    expect(timeline.recoverability).toBe("degraded_safe");
  });

  it("lets explicit recoverability override degraded defaults", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "recoverability_state", step: "db", message: "db failed", state: "unrecoverable", reason: "write failed" }),
      base(2, { type: "degraded_result", step: "fallback", message: "fallback", marker: "safe_default", userVisible: true }),
    ]);
    expect(timeline.recoverability).toBe("unrecoverable");
  });

  it("carries deterministic failure snapshot state", () => {
    const timeline = buildFailureTimeline([
      base(1, {
        type: "provider_event",
        step: "grader.parse",
        message: "parse failed",
        provider: "openai",
        attempt: 1,
        status: "parse_error",
        failureSnapshot: {
          errorCode: "malformed_json",
          errorMessage: "bad json",
          deterministic: true,
          recoverable: "degraded_safe",
        },
      }),
    ]);
    expect(timeline.deterministic).toBe(true);
    expect(timeline.recoverability).toBe("degraded_safe");
  });

  it("detects orchestration dead ends when state does not advance", () => {
    const timeline = buildFailureTimeline([
      base(1, {
        type: "orchestration_transition",
        step: "orchestrator",
        message: "stuck",
        fromState: "grading",
        toState: "grading",
        action: "respond",
        severity: "error",
      }),
    ]);
    expect(timeline.orchestrationDeadEnds[0]).toMatch(/remained in grading/);
  });

  it("detects missing terminal transitions", () => {
    const timeline = buildFailureTimeline([
      base(1, {
        type: "orchestration_transition",
        step: "orchestrator",
        message: "advanced",
        fromState: "writing",
        toState: "speaking",
        action: "respond",
      }),
    ]);
    expect(timeline.orchestrationDeadEnds[0]).toMatch(/no terminal transition/);
  });

  it("does not flag completed timelines as dead ends", () => {
    const timeline = buildFailureTimeline([
      base(1, {
        type: "orchestration_transition",
        step: "orchestrator",
        message: "completed",
        fromState: "grading",
        toState: "completed",
        action: "respond",
      }),
    ]);
    expect(timeline.orchestrationDeadEnds).toEqual([]);
  });

  it("accepts known forensic event types only", () => {
    expect(isPlacementForensicEventType("provider_event")).toBe(true);
    expect(isPlacementForensicEventType("unknown_event")).toBe(false);
  });

  it("accepts known recoverability states only", () => {
    expect(isPlacementRecoverabilityState("degraded_safe")).toBe(true);
    expect(isPlacementRecoverabilityState("maybe")).toBe(false);
  });

  it("reconstructs a full provider timeout recovery path", () => {
    const timeline = buildFailureTimeline([
      base(1, { type: "session_event", step: "start", message: "started", sessionState: "in_progress" }),
      base(2, { type: "provider_event", step: "grader", message: "timeout", provider: "openai", attempt: 1, status: "timeout", latencyMs: 12_500 }),
      base(3, { type: "latency_event", step: "grader.latency", message: "slow", latencyMs: 12_500, budgetMs: 12_000, exceededBudget: true, severity: "warn" }),
      base(4, { type: "fallback_event", step: "provider.fallback", message: "fallback", from: "openai", to: "heuristic", reason: "timeout" }),
      base(5, { type: "degraded_result", step: "grade.degraded", message: "safe grade", marker: "heuristic_grade", userVisible: true }),
      base(6, { type: "orchestration_transition", step: "orchestrator", message: "completed", fromState: "grading", toState: "completed", action: "respond" }),
    ]);
    expect(timeline.eventCount).toBe(6);
    expect(timeline.fallbacks).toHaveLength(1);
    expect(timeline.degraded).toBe(true);
    expect(timeline.orchestrationDeadEnds).toEqual([]);
  });
});
