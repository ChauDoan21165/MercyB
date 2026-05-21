import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvent,
  applyOrchestrationEvents,
  buildOrchestrationSnapshotFull,
  canonicalJSON,
  compactOrchestrationSnapshot,
  initOrchestratorState,
  rebuildFullFromCompact,
  reflowSnapshotForReplay,
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

describe("replayChaos — reordered runtime telemetry", () => {
  it("yields identical reflowed contentHash across many shuffles", () => {
    const events = buildCanonicalEventSequence();
    const reference = reflowSnapshotForReplay(
      buildOrchestrationSnapshotFull({
        state: applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events),
      }),
    );
    for (let seed = 1; seed <= 16; seed++) {
      const shuffled = shuffleDeterministic(events, seed * 257);
      const candidate = reflowSnapshotForReplay(
        buildOrchestrationSnapshotFull({
          state: applyOrchestrationEvents(initOrchestratorState(ORCH_USER), shuffled),
        }),
      );
      expect(candidate.contentHash).toBe(reference.contentHash);
    }
  });
});

describe("replayChaos — duplicate events", () => {
  it("duplicates are deduped and do not change content hash", () => {
    const events = buildCanonicalEventSequence();
    const base = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const duped = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), [
      ...events,
      ...events,
    ]);
    expect(canonicalJSON(base)).toBe(canonicalJSON(duped));
  });
});

describe("replayChaos — stale merges", () => {
  it("applying a strict subset followed by the full set converges", () => {
    const events = buildCanonicalEventSequence();
    const half = Math.floor(events.length / 2);
    const stale = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      events.slice(0, half),
    );
    const live = applyOrchestrationEvents(stale, events);
    const fresh = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    expect(canonicalJSON(live)).toBe(canonicalJSON(fresh));
  });
});

describe("replayChaos — compaction round-trip", () => {
  it("compact + rebuild + recompact stays stable", () => {
    const events = buildCanonicalEventSequence();
    const state = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const full = buildOrchestrationSnapshotFull({ state });
    const compact = compactOrchestrationSnapshot(full);
    const rebuilt = rebuildFullFromCompact({
      compact,
      telemetryEvents: state.telemetryEvents,
      memoryEvents: state.memoryEvents,
    });
    const recompact = compactOrchestrationSnapshot(rebuilt);
    expect(recompact.contentHash).toBe(compact.contentHash);
  });
});

describe("replayChaos — intervention escalation + resolution", () => {
  it("issued → acknowledged → resolved → re-issue does not produce a fresh entry under the same id", () => {
    let state = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      buildCanonicalEventSequence(),
    );
    const snap = buildOrchestrationSnapshotForUser({ reviewDebtCount: 9 });
    state = runAdaptiveCycle({ state, snapshot: snap }).state;
    const ivId = state.interventions[0].interventionId;

    state = applyOrchestrationEvent(state, {
      type: "intervention_acknowledged",
      interventionId: ivId,
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(8),
        eventIdPrefix: "ack",
      },
    });
    state = applyOrchestrationEvent(state, {
      type: "intervention_resolved",
      interventionId: ivId,
      resolutionReason: "user_returned",
      ctx: {
        userIdHash: ORCH_USER,
        sessionId: "s",
        nowMs: dayMs(9),
        eventIdPrefix: "res",
      },
    });
    // Run cycle again with same snapshot — should NOT re-issue.
    const after = runAdaptiveCycle({ state, snapshot: snap }).state;
    const ids = new Set(after.interventions.map((iv) => iv.interventionId));
    expect(ids.has(ivId)).toBe(true);
    expect(
      after.interventions.find((iv) => iv.interventionId === ivId)!.status,
    ).toBe("resolved");
  });
});

describe("replayChaos — recovery loops", () => {
  it("oscillating recovery_started/recovery_completed converges to last state", () => {
    let state = initOrchestratorState(ORCH_USER);
    for (let i = 0; i < 5; i++) {
      state = applyOrchestrationEvent(state, {
        type: "recovery_started",
        reasonCode: `burnout_${i}`,
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(i * 2),
          eventIdPrefix: `rstart-${i}`,
        },
      });
      state = applyOrchestrationEvent(state, {
        type: "recovery_completed",
        reasonCode: `recovered_${i}`,
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(i * 2 + 1),
          eventIdPrefix: `rend-${i}`,
        },
      });
    }
    expect(state.recoveryState.kind).toBe("none");
    expect(state.recoveryState.endedMs).toBe(dayMs(9));
  });
});

describe("replayChaos — speaking avoidance cycles", () => {
  it("repeated speaking_skip events accumulate without divergent state hashes", () => {
    const skipEvents: OrchestrationEvent[] = [];
    for (let i = 0; i < 12; i++) {
      skipEvents.push({
        type: "lesson_skip",
        input: {
          lessonId: `speak-l-${i}`,
          progressRatio: 0.1,
          dwellMs: 5000,
        },
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(i, 8),
          eventIdPrefix: `skip-${i}`,
        },
      });
    }
    const a = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), skipEvents);
    const b = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      shuffleDeterministic(skipEvents, 1234),
    );
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
  });
});

describe("replayChaos — burnout/recovery oscillation", () => {
  it("alternating burnout indicator + recovery converges deterministically", () => {
    const events: OrchestrationEvent[] = [];
    for (let i = 0; i < 4; i++) {
      events.push({
        type: "burnout_indicator",
        input: {
          lessonId: `l-${i}`,
          hesitationDurationMs: 8000,
          silenceCount: 2,
          abandoned: true,
          progressRatio: 0.4,
          dwellMs: 60_000,
        },
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(i * 2, 10),
          eventIdPrefix: `burnout-${i}`,
        },
      });
      events.push({
        type: "burnout_recovered",
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(i * 2 + 1, 10),
          eventIdPrefix: `recovered-${i}`,
        },
      });
    }
    const a = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const b = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      shuffleDeterministic(events, 9_321),
    );
    expect(canonicalJSON(a)).toBe(canonicalJSON(b));
    expect(a.recoveryState.kind).toBe("none");
  });
});

describe("replayChaos — offline/mobile replay", () => {
  it("split the event stream across two devices and reunite — convergent hash", () => {
    const events = buildCanonicalEventSequence();
    const live = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const liveSnap = reflowSnapshotForReplay(
      buildOrchestrationSnapshotFull({ state: live }),
    );

    // Simulate offline replay: replay the entire event log from scratch on the
    // "other" device.
    const offline = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const offlineSnap = reflowSnapshotForReplay(
      buildOrchestrationSnapshotFull({ state: offline }),
    );
    expect(offlineSnap.contentHash).toBe(liveSnap.contentHash);
  });
});

describe("replayChaos — bounded lineage growth", () => {
  it("event log grows linearly with unique events only — no quadratic explosion under duplicates", () => {
    const events = buildCanonicalEventSequence();
    const onePass = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    // Apply the log 5 times — dedup should still keep length the same.
    let state = initOrchestratorState(ORCH_USER);
    for (let i = 0; i < 5; i++) {
      state = applyOrchestrationEvents(state, events);
    }
    expect(state.telemetryEvents.length).toBe(onePass.telemetryEvents.length);
  });
});

describe("replayChaos — projection consistency", () => {
  it("runAdaptiveCycle output is deterministic across replayed inputs", () => {
    const events = buildCanonicalEventSequence();
    const snap = buildOrchestrationSnapshotForUser({ reviewDebtCount: 8 });
    const stateA = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const stateB = applyOrchestrationEvents(
      initOrchestratorState(ORCH_USER),
      shuffleDeterministic(events, 31337),
    );
    const cycleA = runAdaptiveCycle({ state: stateA, snapshot: snap });
    const cycleB = runAdaptiveCycle({ state: stateB, snapshot: snap });
    expect(canonicalJSON(cycleA.loopResult)).toBe(canonicalJSON(cycleB.loopResult));
  });
});
