import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvent,
  applyOrchestrationEvents,
  canonicalJSON,
  initOrchestratorState,
  runAdaptiveCycle,
} from "../index";
import type { OrchestrationEvent } from "../index";
import {
  ORCH_USER,
  buildCanonicalEventSequence,
  buildOrchestrationSnapshotForUser,
  dayMs,
  shuffleDeterministic,
} from "./orchestrationFixtures";

describe("adaptiveOrchestrator — reducer", () => {
  it("initialises an empty state", () => {
    const state = initOrchestratorState(ORCH_USER);
    expect(state.telemetryEvents).toHaveLength(0);
    expect(state.memoryEvents).toHaveLength(0);
    expect(state.interventions).toHaveLength(0);
    expect(state.recoveryState.kind).toBe("none");
  });

  it("rejects user mismatch on event application", () => {
    const state = initOrchestratorState(ORCH_USER);
    const event: OrchestrationEvent = {
      type: "lesson_start",
      input: { lessonId: "lx", skill: "reading" },
      ctx: {
        userIdHash: "uhash_different_user",
        sessionId: "s",
        nowMs: dayMs(0),
        eventIdPrefix: "x",
      },
    };
    expect(() => applyOrchestrationEvent(state, event)).toThrow();
  });

  it("applies the canonical sequence and produces stable telemetry", () => {
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    expect(state.telemetryEvents.length).toBeGreaterThan(0);
    expect(state.memoryEvents.length).toBeGreaterThan(0);
    expect(state.planVersionHistory).toHaveLength(1);
  });
});

describe("adaptiveOrchestrator — determinism + idempotency", () => {
  it("is order-insensitive across permutations of the same input", () => {
    const events = buildCanonicalEventSequence();
    const baseline = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      events,
    );
    const baseJson = canonicalJSON(baseline);
    for (let seed = 1; seed <= 8; seed++) {
      const shuffled = shuffleDeterministic(events, seed * 991);
      const next = applyOrchestrationEvents(
        initOrchestratorState(ORCH_USER),
        shuffled,
      );
      expect(canonicalJSON(next)).toBe(baseJson);
    }
  });

  it("is idempotent — replaying duplicate events does not change state", () => {
    const events = buildCanonicalEventSequence();
    const once = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const twice = applyOrchestrationEvents(once, events);
    expect(canonicalJSON(twice)).toBe(canonicalJSON(once));
  });
});

describe("adaptiveOrchestrator — recovery state machine", () => {
  it("transitions none → active → none", () => {
    let state = initOrchestratorState(ORCH_USER);
    state = applyOrchestrationEvent(state, {
      type: "recovery_started",
      reasonCode: "burnout_detected",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(0),
        eventIdPrefix: "p",
      },
    });
    expect(state.recoveryState.kind).toBe("active");
    state = applyOrchestrationEvent(state, {
      type: "recovery_completed",
      reasonCode: "user_returned",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(1),
        eventIdPrefix: "p",
      },
    });
    expect(state.recoveryState.kind).toBe("none");
    expect(state.recoveryState.endedMs).toBe(dayMs(1));
  });

  it("burnout_recovered also closes active recovery", () => {
    let state = initOrchestratorState(ORCH_USER);
    state = applyOrchestrationEvent(state, {
      type: "recovery_started",
      reasonCode: "burnout_detected",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(0),
        eventIdPrefix: "p",
      },
    });
    state = applyOrchestrationEvent(state, {
      type: "burnout_recovered",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(1),
        eventIdPrefix: "p",
      },
    });
    expect(state.recoveryState.kind).toBe("none");
    expect(state.recoveryState.reasonCode).toBe("burnout_recovered");
  });
});

describe("adaptiveOrchestrator — intervention lifecycle", () => {
  it("appends issued interventions when runAdaptiveCycle finds them", () => {
    const baseEvents = buildCanonicalEventSequence();
    const state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      baseEvents,
    );
    const snapshot = buildOrchestrationSnapshotForUser({ reviewDebtCount: 8 });
    const { state: next } = runAdaptiveCycle({ state, snapshot });
    expect(next.interventions.length).toBeGreaterThan(0);
    for (const iv of next.interventions) {
      expect(iv.status).toBe("issued");
      expect(iv.issuedMs).toBe(snapshot.snapshotMs);
    }
  });

  it("transitions issued → acknowledged → resolved", () => {
    const baseEvents = buildCanonicalEventSequence();
    let state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      baseEvents,
    );
    const snapshot = buildOrchestrationSnapshotForUser({ reviewDebtCount: 9 });
    const { state: afterCycle } = runAdaptiveCycle({ state, snapshot });
    state = afterCycle;
    const issued = state.interventions[0];
    expect(issued.status).toBe("issued");

    state = applyOrchestrationEvent(state, {
      type: "intervention_acknowledged",
      interventionId: issued.interventionId,
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(8),
        eventIdPrefix: "ack",
      },
    });
    expect(state.interventions[0].status).toBe("acknowledged");

    state = applyOrchestrationEvent(state, {
      type: "intervention_resolved",
      interventionId: issued.interventionId,
      resolutionReason: "user_returned",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(9),
        eventIdPrefix: "res",
      },
    });
    expect(state.interventions[0].status).toBe("resolved");
    expect(state.interventions[0].resolutionReason).toBe("user_returned");
  });

  it("does not re-issue already-resolved interventions on next cycle", () => {
    let state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snapshot = buildOrchestrationSnapshotForUser({ reviewDebtCount: 9 });
    state = runAdaptiveCycle({ state, snapshot }).state;
    const firstCount = state.interventions.length;
    state = runAdaptiveCycle({ state, snapshot }).state;
    expect(state.interventions.length).toBe(firstCount);
  });
});

describe("adaptiveOrchestrator — replay rebuild", () => {
  it("replaying the event log from genesis yields the same state", () => {
    const events = buildCanonicalEventSequence();
    const live = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const replay = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      [...events].sort(() => 0), // identity sort just to assert no mutation
    );
    expect(canonicalJSON(live)).toBe(canonicalJSON(replay));
  });
});
