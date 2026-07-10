import type { ObservationCapability } from "./types";

export const OBSERVATION_CAPABILITIES = [
  {
    id: "OBS-AUDIO-000001",
    semanticKey: "obs.audio.unavailable",
    domain: "audio",
    factType: "AudioUnavailable",
    description: "Records that a requested audio URL was absent or unavailable.",
  },
  {
    id: "OBS-AUDIO-000002",
    semanticKey: "obs.audio.duration_zero",
    domain: "audio",
    factType: "AudioDurationZero",
    description: "Records that an audio asset reported zero duration.",
  },
  {
    id: "OBS-AUDIO-000003",
    semanticKey: "obs.audio.playback_failed",
    domain: "audio",
    factType: "AudioPlaybackFailed",
    description: "Records that browser audio playback failed.",
  },
  {
    id: "OBS-AUDIO-000004",
    semanticKey: "obs.audio.replay_count",
    domain: "audio",
    factType: "AudioReplayCount",
    description: "Records repeat playback count as a fact.",
  },
  {
    id: "OBS-SPEECH-000001",
    semanticKey: "obs.speech.mic_permission_denied",
    domain: "speech",
    factType: "MicPermissionDenied",
    description: "Records denied microphone permission.",
  },
  {
    id: "OBS-SPEECH-000002",
    semanticKey: "obs.speech.timeout",
    domain: "speech",
    factType: "SpeechTimeout",
    description: "Records speech capture timeout.",
  },
  {
    id: "OBS-LEARNING-000001",
    semanticKey: "obs.learning.retry_observed",
    domain: "learning",
    factType: "RetryObserved",
    description: "Records a retry action.",
  },
  {
    id: "OBS-LEARNING-000002",
    semanticKey: "obs.learning.skip_observed",
    domain: "learning",
    factType: "SkipObserved",
    description: "Records a skip action.",
  },
  {
    id: "OBS-LEARNING-000003",
    semanticKey: "obs.learning.hint_used",
    domain: "learning",
    factType: "HintUsed",
    description: "Records hint usage.",
  },
  {
    id: "OBS-LEARNING-000004",
    semanticKey: "obs.learning.assessment_answer_submitted",
    domain: "learning",
    factType: "AssessmentAnswerSubmitted",
    description: "Records assessment answer timing and correctness as facts.",
  },
  {
    id: "OBS-EVD-000001",
    semanticKey: "obs.evidence.packet_schema",
    domain: "evidence",
    description: "Defines the observation evidence packet schema.",
  },
  {
    id: "OBS-REP-000001",
    semanticKey: "obs.replay.observation_replay",
    domain: "replay",
    description: "Replays observation scenarios into fact packets.",
  },
  {
    id: "OBS-VAL-000001",
    semanticKey: "obs.validation.linh_audio_failure_replay",
    domain: "validation",
    description: "Replays Linh placement audio failure without inferring listening weakness.",
  },
  {
    id: "OBS-PRED-000001",
    semanticKey: "obs.prediction.recorded",
    domain: "prediction",
    factType: "PredictionRecorded",
    description: "Records a lookup-table prediction of a learner outcome BEFORE the outcome exists.",
  },
  {
    id: "OBS-PRED-000002",
    semanticKey: "obs.prediction.surprise_resolved",
    domain: "prediction",
    factType: "SurpriseResolved",
    description: "Records surprise (distance between predicted and actual outcome) for an accepted pair.",
  },
  {
    id: "OBS-PRED-000003",
    semanticKey: "obs.prediction.hindsight_rejected",
    domain: "prediction",
    factType: "HindsightRejected",
    description: "Records that a pair was excluded because its prediction was not strictly before the outcome.",
  },
] as const satisfies readonly ObservationCapability[];

export function capabilityById(id: string): ObservationCapability | null {
  return OBSERVATION_CAPABILITIES.find((capability) => capability.id === id) ?? null;
}
