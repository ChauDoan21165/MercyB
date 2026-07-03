import type { AudioObservationInput, ObservationFact } from "../types";

const ZERO_DURATION_EPSILON = 0.001;

function baseContext(input: AudioObservationInput) {
  return {
    route: input.route,
    taskId: input.taskId,
    requestedUrl: input.requestedUrl ?? undefined,
    learnerAction: input.learnerAction,
  };
}

export function detectAudioObservations(input: AudioObservationInput, observedAt = new Date().toISOString()): ObservationFact[] {
  const facts: ObservationFact[] = [];
  const requestedUrl = String(input.requestedUrl ?? "").trim();

  if (!requestedUrl) {
    facts.push({
      capabilityId: "OBS-AUDIO-000001",
      factType: "AudioUnavailable",
      severity: "failure",
      observedAt,
      context: baseContext(input),
      message: "Audio URL was missing or unavailable.",
    });
  }

  if (typeof input.durationSeconds === "number" && input.durationSeconds <= ZERO_DURATION_EPSILON) {
    facts.push({
      capabilityId: "OBS-AUDIO-000002",
      factType: "AudioDurationZero",
      severity: "failure",
      observedAt,
      context: baseContext(input),
      metrics: { durationSeconds: input.durationSeconds },
      message: "Audio duration was zero.",
    });
  }

  if (input.playbackError && input.playbackError.trim()) {
    facts.push({
      capabilityId: "OBS-AUDIO-000003",
      factType: "AudioPlaybackFailed",
      severity: "failure",
      observedAt,
      context: baseContext(input),
      message: `Audio playback failed: ${input.playbackError.trim()}`,
    });
  }

  if (typeof input.replayCount === "number" && input.replayCount > 0) {
    facts.push({
      capabilityId: "OBS-AUDIO-000004",
      factType: "AudioReplayCount",
      severity: "info",
      observedAt,
      context: baseContext(input),
      metrics: { replayCount: input.replayCount },
      message: "Audio replay count observed.",
    });
  }

  return facts;
}
