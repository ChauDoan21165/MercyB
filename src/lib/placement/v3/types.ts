import type { TeacherContext } from "@/lib/tm-int/runtime";

export type PlacementV3Cefr = "pre_a1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type PlacementV3Modality =
  | "writing"
  | "speaking"
  | "reading"
  | "listening"
  | "conversation";

export type PlacementV3TaskType =
  | "writing"
  | "speaking"
  | "reading_mcq"
  | "reading_short"
  | "listening_mcq"
  | "listening_short"
  | "conversation";

export type PlacementV3AnswerMode =
  | "typed"
  | "selected_option"
  | "recorded_audio"
  | "typed_fallback";

export type PlacementV3MediaStatus =
  | "not_required"
  | "missing"
  | "loading"
  | "playable"
  | "unplayable";

export type BilingualText = {
  en: string;
  vi: string;
};

export type PlacementV3Option = {
  id: string;
  label: BilingualText;
};

export type PlacementV3Task = {
  id: string;
  modality: PlacementV3Modality;
  type: PlacementV3TaskType;
  instruction: BilingualText;
  prompt: BilingualText;
  minWords?: number;
  passage?: BilingualText;
  audioUrl?: string;
  mercyTurn?: BilingualText;
  options?: PlacementV3Option[];
  estimatedSeconds?: number;
};

export type PlacementV3SkillProfile = {
  modality: PlacementV3Modality;
  cefr: PlacementV3Cefr;
  confidence: number;
  summary: BilingualText;
  scoreEligible?: boolean;
  runtimeExclusionReason?: "product_failure_audio" | "mic_permission_or_device_block";
};

export type PlacementV3Recommendation = {
  roomId: string;
  title: BilingualText;
  description: BilingualText;
  cefr: PlacementV3Cefr;
  reason: BilingualText;
};

export type PlacementV3L1Flag = {
  id: string;
  label: BilingualText;
  evidence: BilingualText;
  severity: "low" | "medium" | "high";
};

export type PlacementV3Results = {
  sessionId: string;
  completedAt: string;
  overallCefr: PlacementV3Cefr;
  overallConfidence: number;
  overallSummary: BilingualText;
  skills: PlacementV3SkillProfile[];
  l1Flags: PlacementV3L1Flag[];
  recommendations: PlacementV3Recommendation[];
  strengths: BilingualText[];
  gaps: BilingualText[];
  questionCount: number;
  placementValidity?: "valid" | "questionable";
  teacherContext?: TeacherContext;
  runtimeDecision?: PlacementV3RuntimeDecision;
  observationTimeline?: PlacementV3ObservationTimelineItem[];
};

export type PlacementV3SessionStatus =
  | "in_progress"
  | "completed"
  | "abandoned"
  | "expired";

export type PlacementV3Session = {
  sessionId: string;
  status: PlacementV3SessionStatus;
  currentTask: PlacementV3Task | null;
  answeredCount: number;
  estimatedTotal: number;
  modalityIndex: number;
  modalities: PlacementV3Modality[];
  startedAt: string;
  expiresAt: string;
};

export type PlacementV3ResponsePayload = {
  sessionId: string;
  taskId: string;
  modality: PlacementV3Modality;
  value: string;
  audioBlob?: Blob | null;
  answerMode?: PlacementV3AnswerMode;
  mediaStatus?: PlacementV3MediaStatus;
  scoreEligible?: boolean;
  viRevealed?: boolean;
  elapsedMs?: number;
  requestedAudioUrl?: string;
  audioDurationSeconds?: number;
  audioPlaybackError?: string;
  speechPermission?: "unknown" | "granted" | "denied";
  speechTimedOut?: boolean;
  speechTimeoutMs?: number;
  observedCorrect?: boolean;
  productLatencyMs?: number;
  accidentalTap?: boolean;
  questionTooEasy?: boolean;
  priorKnowledge?: boolean;
};

export type PlacementV3SubmitResult = {
  session: PlacementV3Session;
  completed: boolean;
  results?: PlacementV3Results;
};

export type PlacementV3ObservationTimelineItem = {
  kind: "listening_media" | "speaking_capture" | "answer";
  taskId: string;
  modality: PlacementV3Modality;
  observedAt: string;
  mediaStatus?: PlacementV3MediaStatus;
  requestedAudioUrl?: string;
  audioDurationSeconds?: number;
  audioPlaybackError?: string;
  speechPermission?: "unknown" | "granted" | "denied";
  speechTimedOut?: boolean;
  speechTimeoutMs?: number;
  elapsedMs?: number;
  observedCorrect?: boolean;
  productLatencyMs?: number;
  accidentalTap?: boolean;
  questionTooEasy?: boolean;
  priorKnowledge?: boolean;
};

export type PlacementV3RuntimeDecision = {
  excludeListeningScore: boolean;
  excludeSpeakingScore: boolean;
  placementValidity: "valid" | "questionable";
  offers: {
    listeningRetest: boolean;
    speakingTextFallback: boolean;
    micRetry: boolean;
    confidenceFollowUp: boolean;
  };
  recommendationActions: string[];
};
