import {
  isPlacementRecoverabilityState,
  sortPlacementEvents,
  type PlacementFailureTimeline,
  type PlacementForensicEvent,
  type PlacementRecoverabilityState,
} from "@/types/placementForensics";

export function buildFailureTimeline(
  events: PlacementForensicEvent[],
): PlacementFailureTimeline {
  const ordered = sortPlacementEvents(events);
  const first = ordered[0] ?? null;
  const last = ordered[ordered.length - 1] ?? null;
  const missingSequences = findMissingSequences(ordered.map((event) => event.sequence));
  const providerSwitches: PlacementFailureTimeline["providerSwitches"] = [];
  const retries: PlacementFailureTimeline["retries"] = [];
  const fallbacks: PlacementFailureTimeline["fallbacks"] = [];
  const inconsistentRetries: string[] = [];
  const orchestrationDeadEnds: string[] = [];

  let recoverability: PlacementRecoverabilityState = "unknown";
  let degraded = false;
  let deterministic: boolean | "unknown" = "unknown";
  let lastProvider: string | null = null;
  let maxRetrySeenByStep = new Map<string, number>();
  let terminalTransitionSeen = false;

  for (const event of ordered) {
    if (event.failureSnapshot?.deterministic !== undefined) {
      deterministic = event.failureSnapshot.deterministic;
    }

    if (
      event.failureSnapshot?.recoverable &&
      isPlacementRecoverabilityState(event.failureSnapshot.recoverable)
    ) {
      recoverability = event.failureSnapshot.recoverable;
    }

    if (event.type === "recoverability_state") {
      recoverability = event.state;
    }

    if (event.type === "degraded_result") {
      degraded = true;
      recoverability = recoverability === "unknown" ? "degraded_safe" : recoverability;
    }

    if (event.type === "provider_event") {
      if (lastProvider && event.provider !== lastProvider) {
        providerSwitches.push({
          atSequence: event.sequence,
          from: lastProvider,
          to: event.provider,
          reason: event.status,
        });
      }
      if (event.provider !== "none") lastProvider = event.provider;
    }

    if (event.type === "retry_event") {
      retries.push({
        atSequence: event.sequence,
        attempt: event.attempt,
        maxAttempts: event.maxAttempts,
        reason: event.reason,
      });
      const key = event.step;
      const previous = maxRetrySeenByStep.get(key) ?? 0;
      if (event.attempt > event.maxAttempts) {
        inconsistentRetries.push(
          `${key}: attempt ${event.attempt} exceeds max ${event.maxAttempts}`,
        );
      }
      if (event.attempt < previous) {
        inconsistentRetries.push(
          `${key}: retry attempt regressed from ${previous} to ${event.attempt}`,
        );
      }
      maxRetrySeenByStep.set(key, Math.max(previous, event.attempt));
    }

    if (event.type === "fallback_event") {
      fallbacks.push({
        atSequence: event.sequence,
        from: event.from,
        to: event.to,
        reason: event.reason,
      });
    }

    if (event.type === "orchestration_transition") {
      if (["completed", "abandoned", "failed"].includes(event.toState)) {
        terminalTransitionSeen = true;
      }
      if (event.fromState === event.toState && event.severity !== "info") {
        orchestrationDeadEnds.push(
          `${event.action}: remained in ${event.fromState} at sequence ${event.sequence}`,
        );
      }
    }
  }

  if (ordered.length > 0 && !terminalTransitionSeen) {
    const lastTransition = [...ordered].reverse().find(
      (event) => event.type === "orchestration_transition",
    );
    if (lastTransition) {
      orchestrationDeadEnds.push(
        `no terminal transition after ${lastTransition.step} at sequence ${lastTransition.sequence}`,
      );
    }
  }

  return {
    sessionId: first?.sessionId ?? "unknown",
    correlationId: first?.correlationId ?? "unknown",
    startedAt: first?.occurredAt ?? null,
    endedAt: last?.occurredAt ?? null,
    eventCount: ordered.length,
    missingSequences,
    providerSwitches,
    retries,
    fallbacks,
    recoverability,
    degraded,
    deterministic,
    inconsistentRetries,
    orchestrationDeadEnds,
    steps: ordered.map((event) => ({
      sequence: event.sequence,
      occurredAt: event.occurredAt,
      type: event.type,
      step: event.step,
      message: event.message,
      severity: event.severity,
    })),
  };
}

function findMissingSequences(sequences: number[]): number[] {
  if (sequences.length === 0) return [];
  const sorted = [...new Set(sequences)].sort((a, b) => a - b);
  const missing: number[] = [];
  for (let current = sorted[0]; current <= sorted[sorted.length - 1]; current += 1) {
    if (!sorted.includes(current)) missing.push(current);
  }
  return missing;
}
