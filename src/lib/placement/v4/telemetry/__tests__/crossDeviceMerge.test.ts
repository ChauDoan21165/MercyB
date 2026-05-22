import { describe, expect, it } from "vitest";

import {
  applyOrchestrationEvents,
  buildOrchestrationSnapshotFull,
  convergenceHash,
  detectCorruption,
  initOrchestratorState,
  isConvergent,
  mergeDeviceSnapshots,
  runAdaptiveCycle,
} from "../index";
import type { DeviceSnapshot, OrchestrationEvent } from "../index";
import {
  ORCH_USER,
  buildCanonicalEventSequence,
  buildOrchestrationSnapshotForUser,
  dayMs,
} from "./orchestrationFixtures";

function makeDevice(
  deviceId: string,
  events: readonly OrchestrationEvent[],
  vectorClock: Record<string, number>,
): DeviceSnapshot {
  const state = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
  const snapshot = buildOrchestrationSnapshotFull({ state });
  return { deviceId, vectorClock, snapshot };
}

describe("crossDeviceMerge — convergence", () => {
  it("merging the same device set in any order yields the same hash", () => {
    const events = buildCanonicalEventSequence();
    const half = Math.floor(events.length / 2);
    const a = makeDevice("dev-a", events.slice(0, half), { "dev-a": half });
    const b = makeDevice("dev-b", events.slice(half), {
      "dev-b": events.length - half,
    });
    const hashAB = convergenceHash([a, b]);
    const hashBA = convergenceHash([b, a]);
    expect(hashAB).toBe(hashBA);
  });

  it("isConvergent returns true for matching device sets", () => {
    const events = buildCanonicalEventSequence();
    const half = Math.floor(events.length / 2);
    const a = makeDevice("dev-a", events.slice(0, half), { "dev-a": half });
    const b = makeDevice("dev-b", events.slice(half), {
      "dev-b": events.length - half,
    });
    expect(isConvergent([a, b], [b, a])).toBe(true);
  });

  it("merging overlapping events does not double-count", () => {
    const events = buildCanonicalEventSequence();
    const a = makeDevice("dev-a", events, { "dev-a": events.length });
    const b = makeDevice("dev-b", events, { "dev-b": events.length });
    const merged = mergeDeviceSnapshots([a, b]);
    expect(merged.merged.snapshot.state.telemetryEvents.length).toBe(
      a.snapshot.state.telemetryEvents.length,
    );
  });
});

describe("crossDeviceMerge — vector clocks", () => {
  it("merged vector clock is per-device max", () => {
    const a = makeDevice("dev-a", [], { "dev-a": 5, "dev-b": 2 });
    const b = makeDevice("dev-b", [], { "dev-a": 3, "dev-b": 7 });
    const merged = mergeDeviceSnapshots([a, b]);
    expect(merged.merged.vectorClock["dev-a"]).toBe(5);
    expect(merged.merged.vectorClock["dev-b"]).toBe(7);
  });
});

describe("crossDeviceMerge — corruption", () => {
  it("detects hash mismatch", () => {
    const events = buildCanonicalEventSequence();
    const dev = makeDevice("dev-a", events, { "dev-a": events.length });
    const corrupt: DeviceSnapshot = {
      ...dev,
      snapshot: {
        ...dev.snapshot,
        contentHash: "ffff" + dev.snapshot.contentHash.slice(4),
      },
    };
    expect(detectCorruption(corrupt).isCorrupted).toBe(true);
    expect(detectCorruption(corrupt).reasons).toContain("hash_mismatch");
  });

  it("detects userid mismatch", () => {
    const events = buildCanonicalEventSequence();
    const dev = makeDevice("dev-a", events, { "dev-a": events.length });
    const corrupt: DeviceSnapshot = {
      ...dev,
      snapshot: {
        ...dev.snapshot,
        userIdHash: "different-id",
      },
    };
    expect(detectCorruption(corrupt).reasons).toContain("userid_mismatch");
  });

  it("detects negative clock entries", () => {
    const events = buildCanonicalEventSequence();
    const dev = makeDevice("dev-a", events, { "dev-a": -1 });
    expect(detectCorruption(dev).reasons).toContain("negative_clock");
  });

  it("drops corrupt devices by default during merge", () => {
    const events = buildCanonicalEventSequence();
    const good = makeDevice("dev-good", events, { "dev-good": events.length });
    const bad = makeDevice("dev-bad", events, { "dev-bad": -1 });
    const merged = mergeDeviceSnapshots([good, bad]);
    expect(merged.rejected).toHaveLength(1);
    expect(merged.rejected[0].deviceId).toBe("dev-bad");
  });
});

describe("crossDeviceMerge — intervention lifecycle merge", () => {
  it("highest status wins (issued < acknowledged < resolved)", () => {
    const events = buildCanonicalEventSequence();
    let state = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), events);
    const snap = buildOrchestrationSnapshotForUser({ reviewDebtCount: 9 });
    state = runAdaptiveCycle({ state, snapshot: snap }).state;
    const issuedId = state.interventions[0].interventionId;

    const acknowledged = applyOrchestrationEvents(state, [
      {
        type: "intervention_acknowledged",
        interventionId: issuedId,
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(8),
          eventIdPrefix: "ack",
        },
      },
    ]);
    const resolved = applyOrchestrationEvents(acknowledged, [
      {
        type: "intervention_resolved",
        interventionId: issuedId,
        resolutionReason: "user_returned",
        ctx: {
          userIdHash: ORCH_USER,
          sessionId: "s",
          nowMs: dayMs(9),
          eventIdPrefix: "res",
        },
      },
    ]);

    const devIssued: DeviceSnapshot = {
      deviceId: "dev-issued",
      vectorClock: { "dev-issued": 1 },
      snapshot: buildOrchestrationSnapshotFull({ state }),
    };
    const devResolved: DeviceSnapshot = {
      deviceId: "dev-resolved",
      vectorClock: { "dev-resolved": 1 },
      snapshot: buildOrchestrationSnapshotFull({ state: resolved }),
    };
    const merged = mergeDeviceSnapshots([devIssued, devResolved]);
    const mergedIv = merged.merged.snapshot.state.interventions.find(
      (iv) => iv.interventionId === issuedId,
    )!;
    expect(mergedIv.status).toBe("resolved");
  });
});

describe("crossDeviceMerge — recovery state merge", () => {
  it("latest event wins; active beats none at the same timestamp", () => {
    const ctx = {
      userIdHash: ORCH_USER,
      sessionId: "s",
      nowMs: dayMs(5),
      eventIdPrefix: "p",
    };
    const activeState = applyOrchestrationEvents(initOrchestratorState(ORCH_USER), [
      {
        type: "recovery_started",
        reasonCode: "burnout_detected",
        ctx,
      },
    ]);
    const noneState = initOrchestratorState(ORCH_USER);
    const devActive: DeviceSnapshot = {
      deviceId: "a",
      vectorClock: { a: 1 },
      snapshot: buildOrchestrationSnapshotFull({ state: activeState }),
    };
    const devNone: DeviceSnapshot = {
      deviceId: "b",
      vectorClock: { b: 1 },
      snapshot: buildOrchestrationSnapshotFull({ state: noneState }),
    };
    const merged = mergeDeviceSnapshots([devActive, devNone]);
    expect(merged.merged.snapshot.state.recoveryState.kind).toBe("active");
  });
});
