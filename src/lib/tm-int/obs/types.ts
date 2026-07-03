export type ObservationCapabilityId =
  | "OBS-AUDIO-000001"
  | "OBS-AUDIO-000002"
  | "OBS-AUDIO-000003"
  | "OBS-AUDIO-000004"
  | "OBS-SPEECH-000001"
  | "OBS-SPEECH-000002"
  | "OBS-LEARNING-000001"
  | "OBS-LEARNING-000002"
  | "OBS-LEARNING-000003"
  | "OBS-EVD-000001"
  | "OBS-REP-000001"
  | "OBS-VAL-000001";

export type ObservationDomain = "audio" | "speech" | "learning" | "evidence" | "replay" | "validation";

export type ObservationFactType =
  | "AudioUnavailable"
  | "AudioDurationZero"
  | "AudioPlaybackFailed"
  | "AudioReplayCount"
  | "MicPermissionDenied"
  | "SpeechTimeout"
  | "RetryObserved"
  | "SkipObserved"
  | "HintUsed";

export type ObservationSeverity = "info" | "warning" | "failure";

export type ObservationCapability = {
  id: ObservationCapabilityId;
  semanticKey: string;
  domain: ObservationDomain;
  factType?: ObservationFactType;
  description: string;
};

export type ObservationContext = {
  route?: string;
  roomId?: string;
  taskId?: string;
  learnerAction?: "answered" | "guessed" | "retried" | "skipped" | "used_hint" | "replayed";
  requestedUrl?: string;
};

export type ObservationFact = {
  capabilityId: ObservationCapabilityId;
  factType: ObservationFactType;
  severity: ObservationSeverity;
  observedAt: string;
  context: ObservationContext;
  metrics?: Record<string, number>;
  message: string;
};

export type AudioObservationInput = {
  requestedUrl?: string | null;
  durationSeconds?: number | null;
  playbackError?: string | null;
  replayCount?: number | null;
  route?: string;
  taskId?: string;
  learnerAction?: ObservationContext["learnerAction"];
};

export type SpeechObservationInput = {
  permissionState?: "granted" | "denied" | "prompt" | "unknown" | null;
  timedOut?: boolean;
  timeoutMs?: number | null;
  route?: string;
  taskId?: string;
};

export type LearningObservationInput = {
  action: "retry" | "skip" | "hint";
  route?: string;
  taskId?: string;
};

export type ObservationPacket = {
  schemaVersion: "tm-int-obs-packet-v1";
  packetId: string;
  createdAt: string;
  source: "tm-int-obs";
  facts: ObservationFact[];
};

export type ReplayStep = {
  input:
    | { kind: "audio"; value: AudioObservationInput }
    | { kind: "speech"; value: SpeechObservationInput }
    | { kind: "learning"; value: LearningObservationInput };
};

export type ReplayScenario = {
  id: string;
  title: string;
  steps: ReplayStep[];
};

export type WorkpackStatus = "workpack_ready";

export type ObsWorkpack = {
  wp_id: string;
  semantic_key: string;
  tm_int_id: ObservationCapabilityId;
  source_file: string;
  source_line: number;
  source_anchor_excerpt: string;
  related_test_or_replay_file: string;
  objective: string;
  expected_product_value: string;
  acceptance_tests: string;
  judge_checks: string;
  anti_fake_checks: string;
  status: WorkpackStatus;
  verified: false;
};
