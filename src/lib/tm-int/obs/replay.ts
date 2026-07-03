import { detectAudioObservations } from "./detectors/audio";
import { detectLearningObservation } from "./detectors/learning";
import { detectSpeechObservations } from "./detectors/speech";
import { createObservationPacket } from "./evidencePacket";
import type { ObservationFact, ObservationPacket, ReplayScenario } from "./types";

export function replayObservationScenario(scenario: ReplayScenario, observedAt = new Date().toISOString()): ObservationPacket {
  const facts: ObservationFact[] = [];

  for (const step of scenario.steps) {
    if (step.input.kind === "audio") facts.push(...detectAudioObservations(step.input.value, observedAt));
    if (step.input.kind === "speech") facts.push(...detectSpeechObservations(step.input.value, observedAt));
    if (step.input.kind === "learning") facts.push(detectLearningObservation(step.input.value, observedAt));
  }

  return createObservationPacket(facts, observedAt);
}

export const LINH_AUDIO_FAILURE_REPLAY: ReplayScenario = {
  id: "linh-placement-audio-failure",
  title: "Linh placement listening audio unavailable or duration zero",
  steps: [
    {
      input: {
        kind: "audio",
        value: {
          route: "/placement/test/:sessionId",
          taskId: "listening-a2-class-delay-1",
          requestedUrl: "/audio/placement-v3/listening-a2-class-delay-1.mp3",
          durationSeconds: 0,
          learnerAction: "guessed",
        },
      },
    },
  ],
};
